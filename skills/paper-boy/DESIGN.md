# Paper Boy Skill — Architecture Design Document
*Senior AI Systems Architect Review | 2026-03-24*

---

## PREAMBLE: OBSERVED REALITY

Before answering the design questions, key facts from the actual filesystem:

1. **Two naming conventions exist** for HTML reports: `MARKET_REPORT_YYYYMMDD.html` (old) and `MARKET_REPORT_YYYY-MM-DD.html` (new, post-March 19). Paper Boy must handle both.
2. **market-notes.md is a growing prepend file** — most recent date at top, older dates below. Each date section is a `## YYYY-MM-DD —` header.
3. **marketnotes_YYYY-MM-DD.md** (dated backups) exist but are NOT the same as market-notes.md. They appear to be snapshots.
4. **rex-notes.md** is identical in structure to market-notes.md — same `## YYYY-MM-DD` format, same prepend convention.
5. **gmail-poll-state.json** already tracks email processing state. Paper Boy does NOT replace this.
6. **The update script uses `set -e`** — any failure aborts the entire script. This is important for error handling design.
7. **Existing crons:** Gmail Poller (every 10m), 7AM Briefing, 11PM Mission Control, Monday Error Report. Paper Boy slots between Gmail Poller and 7AM Briefing.

---

## Q1: DETECTION MECHANISM

**Answer: D — Combination, with A as primary and B as guard rail.**

### Primary: Timestamp comparison vs state file (Option A)

```json
// last-paperboy-run.json
{
  "lastRunAt": "2026-03-24T08:05:00.000Z",
  "lastHtmlFile": "MARKET_REPORT_20260324.html",
  "lastHtmlMtime": "2026-03-24T07:45:00.000Z",
  "lastNotesMtime": "2026-03-24T07:43:00.000Z",
  "lastDateProcessed": "2026-03-24"
}
```

On each run:
1. Find today's HTML report (both naming conventions)
2. Get its mtime — compare to `lastHtmlMtime`
3. Get market-notes.md mtime — compare to `lastNotesMtime`
4. If EITHER is newer than state → proceed with that component
5. If NEITHER is newer → check guard rail (Option B)

### Guard Rail: Date existence check (Option B)

If timestamps say "nothing new" but `marketnotes_2026-03-24.md` does NOT exist → run anyway. This catches cases where the state file was manually reset or timestamps got corrupted.

### Why not Option C (always run idempotent)?

The update script does a git commit+push. Even if git detects "nothing to commit," the shell exits cleanly but the Railway webhook still fires unnecessarily. More importantly, rex-notes.md prepend logic needs a skip guard to prevent duplicates — idempotency requires knowing what's already been done, which is state tracking anyway.

### Failure modes by option:

| Option | Failure Mode | Severity |
|--------|-------------|----------|
| A only | State file deleted/corrupted → skill thinks nothing is new → misses updates | HIGH |
| A only | Clock skew between email receipt and file save → mtime unreliable | LOW |
| B only | marketnotes backup created manually → skill skips even though content is new | MEDIUM |
| B only | No way to detect "market-notes.md updated but same date" | MEDIUM |
| C only | Double git commits, double rex-notes prepends | HIGH |
| D (combo) | State file corrupt + backup already exists → skip. Mitigated by manual trigger | LOW |

**Winner: D (combo).** A catches the common case. B catches state corruption. Manual trigger covers everything else.

---

## Q2: EXECUTION ORDER AND DEPENDENCIES

```
PHASE 1 — DETECT (parallel)
├── 1a. Find today's HTML file (both naming conventions)
├── 1b. Check market-notes.md mtime
└── 1c. Read last-paperboy-run.json state

PHASE 2 — DECIDE (sequential, needs Phase 1)
└── 2. Evaluate: what's new? (html_new, notes_new, force_run flags)
    └── If nothing new AND guard rail passes → exit with "nothing to do" message

PHASE 3 — MEMORY OPS (sequential, needs Phase 2)
├── 3a. HTML → MD conversion (if html_new AND no .md already exists)
│   └── Output: MARKET_REPORT_YYYY-MM-DD.md
├── 3b. Dated backup: copy market-notes.md → marketnotes_YYYY-MM-DD.md
│   └── Only if file doesn't exist OR mtime is newer
└── 3c. Update rex-notes.md (if notes_new OR today's section missing)
    └── Check if "## YYYY-MM-DD" already exists in rex-notes.md
    └── If missing: prepend today's section from market-notes.md
    └── If exists: SKIP (idempotency guard)

PHASE 3 can run 3a and 3b in parallel. 3c is independent of 3a/3b.

PHASE 4 — DATA HUB PUSH (sequential, needs Phase 3 complete)
└── 4. Run update-market-data.sh
    └── Requires: market-notes.md exists, at least one HTML file exists
    └── This is the only step with external side effects (git push)

PHASE 5 — DOWNSTREAM SYNC (parallel, needs Phase 4 complete)
├── 5a. Mission Control curl
└── 5b. Update last-paperboy-run.json state

PHASE 6 — REPORT
└── 6. Send Telegram summary
```

### Critical dependency rule:
**Phase 4 MUST NOT run if Phase 3 had any errors.** The update script reads market-notes.md directly — if rex-notes.md failed to update, the script still runs fine, but if market-notes.md is somehow corrupted during Phase 3, we'd push bad data to Railway.

---

## Q3: IDEMPOTENCY ANALYSIS

| Step | Safe to re-run? | Risk | Mitigation |
|------|----------------|------|------------|
| Find HTML file | ✅ Yes | None | — |
| Check market-notes.md mtime | ✅ Yes | None | — |
| HTML → MD conversion | ✅ Yes | Overwrites existing .md | Only run if .md doesn't exist: `if [ ! -f "MARKET_REPORT_YYYYMMDD.md" ]` |
| Dated backup (marketnotes_YYYY-MM-DD.md) | ✅ Yes | Overwrites with identical content | Safe — content should be identical |
| **rex-notes.md prepend** | ⚠️ NO | **Duplicate entries** | Check for `## YYYY-MM-DD` before prepending. Hard stop if found. |
| update-market-data.sh | ✅ Mostly | Double git commit (benign), double Railway deploy | `git diff --cached --quiet` guard already in script |
| Mission Control curl (POST) | ✅ Yes | Triggers re-read of same data | Idempotent by design |
| State file update | ✅ Yes | None | — |
| Telegram message | ✅ Yes | Sends duplicate notification | Acceptable — manual re-runs should confirm |

**The one hard non-idempotent step: rex-notes.md prepend.** This is the highest-risk operation. The guard must be:

```bash
TODAY=$(date +%Y-%m-%d)
if grep -q "^## ${TODAY}" /Users/rex/.openclaw/workspace/market-reports/rex-notes.md; then
  echo "⏭️ rex-notes.md already has ${TODAY} entry — skipping prepend"
else
  # prepend
fi
```

---

## Q4: FAILURE HANDLING

### Scenario 1: HTML report arrived, market-notes.md not yet updated

**Detection:** HTML file is newer than state, but market-notes.md mtime is unchanged.

**Strategy:** Partial run.
- Run steps 3a (HTML → MD) only
- Skip 3b and 3c (notes-dependent)
- Run Phase 4 — the update script will use existing market-notes.md (yesterday's) for the notes-side JSON, and the new HTML for market-pulse.json
- Log warning in state file: `"notesStatus": "stale"` with mtime of notes used
- Telegram: "⚠️ HTML report processed, but market-notes.md appears unchanged (mtime: yesterday). Notes data not updated. Re-run Paper Boy after Kelly sends the notes update."

**Do NOT block Phase 4 for missing notes** — the DC Data Hub should get the new HTML data even if notes are delayed.

---

### Scenario 2: Git push fails (network issue)

**The update script uses `set -e`** — it will abort at the git push step. This means the JSON files ARE written to `public/data/` locally, but the Railway deploy doesn't fire.

**Strategy:**
- Catch non-zero exit from the script
- Check git status: `git -C /Users/rex/dev/dc-data-hub status` — if there are uncommitted changes, the local write succeeded but push failed
- Store `"pendingPush": true` in state file with timestamp
- Telegram: "⚠️ DC Data Hub JSON files updated locally but git push failed. Run `cd /Users/rex/dev/dc-data-hub && git push` to deploy, or re-run Paper Boy."
- On next Paper Boy run: if `pendingPush: true` in state, attempt push before running full pipeline

---

### Scenario 3: Railway deploy fails

**Detection:** Railway deploys are fire-and-forget from git push. Paper Boy can't directly detect Railway failures.

**Strategy:** Railway failure is out-of-band. Paper Boy's job ends at `git push`. 
- Log `"railwayDeployTriggeredAt"` in state file
- Telegram summary says "Railway deploy triggered — live in ~2 min"
- If Kelly reports the site isn't updated: manual `git push` retry or Railway dashboard check
- Consider: a 5-minute delayed health check (curl the Railway API endpoint) as optional follow-up in a future iteration, but NOT in v1

---

### Scenario 4: Mission Control is down

**Strategy:** Non-blocking. Mission Control sync (Phase 5a) runs with a 5-second timeout.

```bash
curl -s --max-time 5 -X POST http://localhost:3000/api/headlines/marketnotes
CURL_EXIT=$?
if [ $CURL_EXIT -ne 0 ]; then
  MC_STATUS="unreachable"
else
  MC_STATUS="synced"
fi
```

- If Mission Control is down: log it in state file, include one-liner in Telegram ("⚠️ Mission Control offline — marketnotes sync skipped")
- Continue with state file update and Telegram report regardless
- Mission Control being down NEVER blocks the DC Data Hub push

---

## Q5: CRON TIMING AND RETRY

### The problem

8:00 AM PST cron fires. Kelly emails at 8:30 AM. Paper Boy finds no new files and exits with "nothing to do." The 8 AM briefing runs at 7 AM (already exists) so it has context, but the DC Data Hub never gets updated.

### Solution: Retry cron + manual trigger

**Primary cron:** 8:00 AM PST — the "early bird" run  
**Retry cron:** 9:00 AM PST — catches late emails  
**Failsafe cron:** 10:00 AM PST — final daily attempt

This covers Kelly sending emails up to 9:59 AM. The 10 AM run is the last automated attempt.

**State guard prevents duplicate work:** If the 8 AM run already processed today's files, the 9 AM and 10 AM runs detect nothing new and exit immediately (< 2 seconds).

### Manual trigger

**Phrase:** "run paper boy" or "run paperboy" or "paper boy now"

The skill detects these phrases and sets an internal `force_run=true` flag that bypasses the "nothing new" detection check. It still applies the rex-notes idempotency guard (date check before prepend).

Manual trigger also accepts `force_run=html_only` or `force_run=notes_only` for partial runs.

---

## Q6: STATE TRACKING

### File location
`/Users/rex/.openclaw/workspace/memory/paperboy-state.json`

Rationale: Co-located with `gmail-poll-state.json` which does the same job for email. Consistent pattern. The `memory/` directory is the right home for operational state.

### Schema

```json
{
  "version": 2,
  "lastRunAt": "2026-03-24T08:05:23.000Z",
  "lastRunResult": "success",
  "lastDateProcessed": "2026-03-24",
  
  "html": {
    "lastProcessedFile": "MARKET_REPORT_20260324.html",
    "lastProcessedMtime": "2026-03-24T07:45:00.000Z",
    "mdCreated": true
  },
  
  "notes": {
    "lastProcessedMtime": "2026-03-24T07:43:00.000Z",
    "rexNotesUpdated": true,
    "backupCreated": "marketnotes_2026-03-24.md"
  },
  
  "pipeline": {
    "updateScriptResult": "success",
    "pendingPush": false,
    "railwayDeployTriggeredAt": "2026-03-24T08:06:01.000Z"
  },
  
  "downstream": {
    "missionControlSynced": true,
    "missionControlStatus": "200",
    "missionControlAttemptedAt": "2026-03-24T08:06:05.000Z"
  },
  
  "partialRuns": [
    {
      "at": "2026-03-24T08:05:23.000Z",
      "reason": "notes_stale",
      "completed": ["html_convert", "data_hub_push"],
      "skipped": ["rex_notes_update", "backup_sync"]
    }
  ],
  
  "note": "Paper Boy state. lastDateProcessed prevents duplicate rex-notes entries."
}
```

### What gets written and when

- Written at **end of Phase 5** (after downstream sync, before Telegram)
- Written atomically: write to `.tmp` file first, then `mv` to replace
- On failure: write partial state with `lastRunResult: "partial"` and `failedAt: "step_name"`

---

## Q7: GMAIL_HOOK DIVISION OF RESPONSIBILITIES

### Current Gmail Hook (Gmail Poller cron, every 10m):
- Polls inbox via Gmail API
- Detects emails from Kelly to rex@hitnetwork.io
- Downloads attachments (HTML, MD files)
- **Saves files to `/Users/rex/.openclaw/workspace/market-reports/`**
- Tracks processed email IDs in `gmail-poll-state.json`
- Sends Telegram notification: "📥 New market files received"

### Paper Boy (new, complementary):
- Triggered by cron OR manual command
- **Reads** the files the Gmail hook saved
- Processes, normalizes, and propagates them
- Manages rex-notes.md, backups, DC Data Hub push, Mission Control sync

### Hard boundary:

| Concern | Gmail Hook | Paper Boy |
|---------|-----------|-----------|
| Email detection | ✅ | ❌ |
| File download/save | ✅ | ❌ |
| Email ID tracking | ✅ | ❌ |
| File processing | ❌ | ✅ |
| rex-notes.md | ❌ | ✅ |
| Dated backups | ❌ | ✅ |
| DC Data Hub push | ❌ | ✅ |
| Mission Control sync | ❌ | ✅ |
| Railway deploy trigger | ❌ | ✅ |
| "Files ready" notification | ✅ (receipt) | ✅ (processed) |

**They are complementary, not overlapping.** Gmail Hook is a courier. Paper Boy is the distribution network. The Gmail Hook says "package arrived." Paper Boy says "package opened, processed, delivered to all floors."

### Optional enhancement (v2):

The Gmail Hook could write a trigger file: `/Users/rex/.openclaw/workspace/market-reports/.new-files-pending` on each successful save. Paper Boy checks for this file as a fourth detection signal. Paper Boy deletes it after successful processing. This creates an explicit handshake between the two systems without tight coupling.

---

## Q8: CRON CONFIGURATION

### Three crons needed:

```bash
# Primary — 8:00 AM PST daily
openclaw cron add \
  --name "Paper Boy — Market Data Sync" \
  --schedule "cron 0 8 * * * @ America/Los_Angeles" \
  --message "run paper boy" \
  --agent main \
  --target isolated

# Retry 1 — 9:00 AM PST daily
openclaw cron add \
  --name "Paper Boy Retry 1" \
  --schedule "cron 0 9 * * * @ America/Los_Angeles" \
  --message "run paper boy" \
  --agent main \
  --target isolated

# Retry 2 — 10:00 AM PST daily
openclaw cron add \
  --name "Paper Boy Retry 2" \
  --schedule "cron 0 10 * * * @ America/Los_Angeles" \
  --message "run paper boy" \
  --agent main \
  --target isolated
```

**The trigger message is: `"run paper boy"`**

This is a natural-language phrase that maps to the skill. The skill's description field in SKILL.md should include: `Trigger on "run paper boy", "paper boy", "paperboy", or any cron-triggered message matching "run paper boy".`

### Why three crons instead of a retry loop?

OpenClaw crons are fire-and-forget — they send a message and the agent processes it. There's no native retry-with-backoff for crons. Three separate cron entries at hourly intervals is the correct OpenClaw-native pattern, not a looping retry inside one cron run.

The state guard (timestamp comparison) makes all three fire-safe. If the 8 AM run succeeds, the 9 AM and 10 AM runs take < 2 seconds and exit cleanly.

---

## EXACT EXECUTION FLOW (Implementation Reference)

```
PAPER BOY EXECUTION FLOW v1
════════════════════════════

[TRIGGER] "run paper boy" → skill activates

STEP 0: Load state
  → Read /memory/paperboy-state.json
  → Extract: lastDateProcessed, lastHtmlMtime, lastNotesMtime, pendingPush

STEP 1: Detect files (parallel)
  1a. Find HTML: glob MARKET_REPORT_{YYYYMMDD,YYYY-MM-DD}.html, sort desc, take [0]
  1b. Get market-notes.md mtime
  1c. Build TODAY = $(date +%Y-%m-%d), TODAY_COMPACT = $(date +%Y%m%d)

STEP 2: Evaluate what's new
  html_new  = (html file found) AND (html mtime > lastHtmlMtime OR lastHtmlMtime null)
  notes_new = (notes mtime > lastNotesMtime OR lastNotesMtime null)
  force_run = (manual trigger) OR (pendingPush == true)
  guard     = (marketnotes_TODAY.md does NOT exist)

  if NOT html_new AND NOT notes_new AND NOT force_run AND NOT guard:
    → Log "nothing to do"
    → Send minimal Telegram: "📰 Paper Boy: no new files detected (last run: X)"
    → EXIT

STEP 3: Memory operations (where applicable)
  3a. [if html_new AND MARKET_REPORT_TODAY.md not found]
      Convert HTML → MD using pandoc or Node html-to-md
      Save as MARKET_REPORT_YYYY-MM-DD.md (normalized naming)
      
  3b. [if notes_new OR guard]
      Copy market-notes.md → marketnotes_TODAY.md (overwrite OK)
      
  3c. [if notes_new OR guard]
      Check rex-notes.md for "## {TODAY}" header
      IF FOUND: skip (log "rex-notes already has today's entry")
      IF NOT FOUND:
        Extract today's section from market-notes.md (from ## TODAY to next ## or EOF)
        Prepend to rex-notes.md (read → prepend → write)

  → On any 3x error: set partial_run=true, log which step failed, continue to step 4

STEP 4: DC Data Hub push
  [if html_new OR notes_new OR force_run]
  
  → Verify preconditions:
    - market-notes.md exists and is readable ✅
    - At least one HTML report exists ✅
  
  → Run: bash /Users/rex/dev/dc-data-hub/scripts/update-market-data.sh
  
  → Capture exit code
  → If exit 0: pendingPush = false, scriptResult = "success"
  → If exit non-0: pendingPush = true, scriptResult = "failed", capture stderr
  → Continue to Step 5 regardless of exit code

STEP 5: Downstream sync (parallel)
  5a. curl --max-time 5 -s -X POST http://localhost:3000/api/headlines/marketnotes
      → Capture HTTP status, set mc_status
      
  5b. Write updated paperboy-state.json atomically

STEP 6: Telegram summary
  Format:
  ```
  📰 Paper Boy — {TODAY}
  
  {✅/⚠️} HTML report: {MARKET_REPORT_TODAY.html → .md converted | already processed | not found}
  {✅/⚠️} Market notes: {updated | unchanged | stale}
  {✅/⚠️} rex-notes.md: {prepended | already had today | skipped}
  {✅/⚠️} DC Data Hub: {deployed to Railway | pending push | failed}
  {✅/⚠️} Mission Control: {synced | offline}
  
  {⚠️ WARNINGS if any}
  ```
  → Send via Telegram

EXIT
```

---

## ERROR HANDLING MATRIX

| Error | Phase | Blocking? | Recovery Action | Telegram Alert |
|-------|-------|-----------|-----------------|----------------|
| State file missing/corrupt | 0 | No | Treat as first run — process everything | Silent |
| No HTML file for today | 1 | No | Process notes only | Yes — "no HTML found" |
| Both files unchanged | 2 | Yes (exits) | Informational exit | Minimal note |
| HTML → MD conversion fails | 3a | No | Log, continue without .md | Yes — "HTML conversion failed" |
| Backup copy fails | 3b | No | Log, continue | Yes |
| rex-notes prepend fails | 3c | No | Log, continue — do NOT retry (risk double-write) | Yes |
| update-market-data.sh fails | 4 | No | Set pendingPush=true | Yes — "git push failed, retry needed" |
| JSON validation fails (inside script) | 4 | Script-level | Script exits non-zero, caught by step 4 | Yes |
| Mission Control unreachable | 5a | No | Log mc_status=unreachable, continue | Yes (inline in summary) |
| Telegram send fails | 6 | No | Log to state file only | N/A |

---

## ONE CRITICAL RISK: THE STALE NOTES TRAP

**Risk:** Kelly sends the HTML report at 7:45 AM but forgets to send the updated market-notes.md until 9:30 AM. The 8 AM Paper Boy run detects the HTML as new, processes it, and pushes to Railway — using **yesterday's market-notes.md** for the notes-side JSON (SOPR/MVRV, watching-this-week, marketnotes).

The DC Data Hub now has today's market-pulse.json (correct) paired with yesterday's marketnotes.json (stale). This creates a **data inconsistency that's invisible** — the site shows today's HTML report alongside yesterday's market notes, with no indication they're from different days.

**Mitigation strategy:**

1. The `notesStatus: "stale"` flag in the state file must be checked by the 9 AM and 10 AM retry crons
2. If `notesStatus == "stale"` AND market-notes.md mtime has changed since the partial run → **force full re-run of Phase 4** (re-push everything with the new notes)
3. The Telegram alert for a partial run must be explicit: "⚠️ DC Data Hub updated with TODAY's HTML but YESTERDAY's market notes. Re-run Paper Boy after Kelly sends the notes file."
4. **Add a date-mismatch validation** inside the update script (future v2): compare the most recent `## YYYY-MM-DD` header in market-notes.md against today's date. If it's yesterday's date, emit a warning but don't block.

This is the most operationally dangerous failure mode because it produces wrong data silently and looks correct to a casual observer.

---

## SKILL METADATA (for SKILL.md)

```yaml
name: paper-boy
description: >
  Daily market data sync pipeline. Processes HTML market reports and market-notes.md
  from Kelly, converts files, updates rex-notes.md, syncs DC Data Hub via 
  update-market-data.sh (Railway deploy), and syncs Mission Control.
  Trigger on: "run paper boy", "paper boy", "paperboy", "run paperboy",
  or any scheduled cron message containing "run paper boy".
  NOT for: raw email processing (that's Gmail Poller), market analysis (that's news-aggregation).

location: ~/.openclaw/workspace/skills/paper-boy/SKILL.md
```

---

*Design document complete. Ready for SKILL.md implementation.*
