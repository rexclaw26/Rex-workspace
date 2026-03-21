# Pipeline Watchdog Template
# Copy this into any pipeline's backup watchdog sub-agent task.
# A watchdog that only LOGS is useless — this one SPAWNS missing phases.

---

## Watchdog Task Brief (copy and fill in bracketed fields)

You are a pipeline watchdog for [PIPELINE_NAME].

Your job: verify each phase completed successfully and spawn any missing phases.

**Workspace:** `/Users/rex/.openclaw/workspace/`
**Markers directory:** `/Users/rex/.openclaw/workspace/product-research/markers/` (or pipeline-specific path)
**Pipeline state file:** `/Users/rex/.openclaw/workspace/PIPELINE_STATE.md`
**Delivery deadline:** [TIME PST]
**Kelly's Telegram chat ID:** `1011362712`
**Telegram Bot Token:** stored in `mission-control/.env.local` — read it from there

---

## Step-by-step instructions

**Step 1: Read current state**
```
cat /Users/rex/.openclaw/workspace/PIPELINE_STATE.md
ls /Users/rex/.openclaw/workspace/product-research/markers/
```

**Step 2: Verify each phase**
For each expected phase marker, check:
1. Does the marker FILE exist?
2. Does the OUTPUT FILE exist and have non-zero size?

If both exist → phase is complete. Move to next.
If marker missing or output missing → phase FAILED. Spawn it now (Step 3).

**Phase checklist (fill in for your pipeline):**
| Phase | Marker file | Output file | Status |
|-------|-------------|-------------|--------|
| Phase 1 | markers/PHASE1_COMPLETE | [output-path] | check |
| Phase 2 | markers/PHASE2_COMPLETE | [output-path] | check |
| Phase 3 | markers/PHASE3_COMPLETE | [output-path] | check |

**Step 3: Spawn any missing phase**
If a phase is missing, spawn it immediately using `sessions_spawn`. Do NOT just log "Phase X incomplete." Spawn it. Use the spawn instructions from `PIPELINE_SCHEMATIC.md` for the correct sub-agent brief for that phase.

Format:
```
sessions_spawn(
  task: "[full phase N sub-agent brief from PIPELINE_SCHEMATIC.md]",
  label: "pipeline-[name]-phase-N-watchdog-recovery",
  mode: "run",
  runTimeoutSeconds: [appropriate limit]
)
```

**Step 4: Send status to Kelly via Telegram**
After completing your check, send a summary:

If all phases complete:
```
✅ Pipeline watchdog: [PIPELINE_NAME] — all phases complete. On track for [DEADLINE].
```

If phases were missing and spawned:
```
⚠️ Pipeline watchdog: [PIPELINE_NAME] — Phase [N] was missing. Spawned recovery agent [session key]. Monitoring.
```

If a phase is running and you can't recover it:
```
🚨 Pipeline watchdog: [PIPELINE_NAME] — Phase [N] is incomplete and recovery failed. Manual intervention needed.
```

Send via Telegram Bot API:
```
curl -s -X POST "https://api.telegram.org/bot[TOKEN]/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"1011362712","text":"[MESSAGE]","parse_mode":"HTML"}'
```
(Read TOKEN from `mission-control/.env.local` — NEVER hardcode it)

**Step 5: Update PIPELINE_STATE.md**
After your check, update the status column for each phase to reflect what you found.

---

## When to deploy this watchdog

Set a backup cron 30-60 minutes BEFORE the delivery deadline using `exec`:
```bash
# Example: pipeline delivers at 5 PM, set watchdog at 4 PM
# In the main session, spawn watchdog sub-agent with yieldMs or schedule via openclaw cron
```

Or spawn it at pipeline launch with a `yieldMs` delay:
```
sessions_spawn(
  task: "[watchdog brief]",
  mode: "run",
  runTimeoutSeconds: 300  # 5 min max — just check and act
)
```
With `yieldMs` in an exec command set to fire 30 min before deadline.

---

## Notes
- Watchdog must run FAST — 5 minutes max. It reads files, checks markers, spawns if needed, sends Telegram, exits.
- Never spawn a phase that's currently running (check for in-progress signals in PIPELINE_STATE.md).
- If all phases are complete, your job is done — confirm to Kelly and exit.
- Log everything you do to PIPELINE_STATE.md so the audit trail is complete.
