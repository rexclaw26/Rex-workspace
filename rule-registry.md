# Rule Registry — Rex
_Companion to AGENTS.md. Tracks rule lifecycle._
_Started: 2026-03-21 | Source of truth for all PRs: AGENTS.md_

## Permanent Rules (Grandfathered — in production before registry)

| PR | Rule Summary | Added | Last Triggered | Status |
|----|-------------|-------|---------------|--------|
| PR-009 | System message triage | 2026-03-08 | 2026-03-21 | PERMANENT |
| PR-010 | No duplicate cron delivery | 2026-03-08 | — | PERMANENT |
| PR-011 | Multi-step pipeline protocol | 2026-03-08 | — | PERMANENT |
| PR-012 | No fabricated dashboard metrics | 2026-03-07 | — | PERMANENT |
| PR-023 | Self-chaining pipeline sub-agents | 2026-03-08 | — | PERMANENT |
| PR-024 | Email send gate sequence | 2026-03-08 | — | PERMANENT |
| PR-031 | Infrastructure files off-limits | 2026-03-12 | — | PERMANENT |
| PR-032 | LAW 1 checklist integrity | 2026-03-12 | — | PERMANENT |
| PR-033 | Chat output precedence | 2026-03-13 | 2026-03-21 | PERMANENT |
| PR-036 | No filler narration | 2026-03-13 | 2026-03-21 | PERMANENT |
| PR-037 | Verify before acting | 2026-03-13 | 2026-03-21 | PERMANENT |
| PR-038 | Sub-agent timeout protocol | 2026-03-14 | 2026-03-21 | PERMANENT |
| PR-039 | Precise scope when claiming "no record" | 2026-03-20 | 2026-03-21 | PERMANENT |
| PR-040 | No fabrication under challenge | 2026-03-20 | — | PERMANENT |
| PR-041 | Verify financial figures before rewriting | 2026-03-20 | — | PERMANENT |
| PR-042 | Verify coding agent output before reporting done | 2026-03-21 | 2026-03-21 | PERMANENT |
| PR-043 | Coding agent session scope limit (max 5 files) | 2026-03-21 | 2026-03-21 | PERMANENT |
| PR-044 | Zero-bypass gate enforcement — gatekeeper fires on ALL written deliverables, no exceptions, gate line must precede draft | 2026-03-22 | 2026-03-22 | PERMANENT |
| PR-045 | Mandatory memory checkpoints — session_status check every turn, checkpoint fires at 55-min intervals, daily log canonical, 400-word max | 2026-03-23 | 2026-03-23 | PERMANENT |
| PR-046 | Mandatory model override — Haiku default, Sonnet required for coding/architecture/critic/security/multi-file/gatekeeper tasks | 2026-03-23 | 2026-03-23 | PERMANENT |
| PR-047 | Sub-agent and plan execution: 120s max per pass, partial results written immediately, continuation protocol on timeout, critic gets pre-written summary not live research | 2026-03-25 | — | PERMANENT |
| PR-048 | Gateway restart = `openclaw gateway install --force` only. `stop && start` leaves orphaned process on port. Alias: `openclaw-restart` in .zshrc | 2026-03-25 | — | PERMANENT |
| PR-049 | Error troubleshooting: dual-subagent diagnosis, root-cause-first fix, mandatory critic before implementing — no exceptions | 2026-03-25 | 2026-03-25 | PERMANENT |

## Rules in Testing (need 3 consecutive successes)
| PR | Rule | Testing Status | Evidence |
|----|------|---------------|----------|
_(none yet — new rules from 2026-03-22 onwards go here first)_

## Proposed Rules (awaiting Kelly approval)
| PR | Rule | Proposed | Rationale |
|----|------|---------|-----------|
_(none yet)_

## Retired Rules (90+ days untriggered — archived, not deleted)
_(none yet)_

## Shared Learnings Queue (for Lex/team coordination)
_(none yet — [SHARED LEARNING] entries queued here for routing)_

---

## Rule Proposal Format
When proposing a new rule, use this format and append here:

```
--- RULE PROPOSAL ---
PR: [next number after current highest]
Date: [date]
Type: New Rule | Rule Modification | Rule Removal
Current state: [what exists now, or "no rule"]
Problem observed: [error journal entries or incidents — need 3+ instances]
Proposed change: [specific, actionable rule text]
Expected impact: [what this prevents or improves]
Risk: [could this cause unintended side effects?]
Evidence: [error journal entries with dates]
--- END PROPOSAL ---
```

## Rule Lifecycle
```
Problem observed (3+ instances) → Rule proposed → Kelly approves → 
Testing [0/3] → 3 consecutive successes → PERMANENT (added to AGENTS.md) → 
90 days untriggered → Retirement review → Retired (archived here, removed from AGENTS.md)
```

**Exception:** Critical safety rules (injection defense, security, infrastructure, anti-hallucination) skip testing gate and go to AGENTS.md immediately.

**Rule Index Maintenance:**
When creating or modifying a rule in AGENTS.md or this registry, Rex simultaneously updates `rule-index.md` with the new or updated entry. Index maintenance is Rex's responsibility, not Kelly's. See `rule-index.md` for schema and maintenance protocol.

---

## Governance Notes
- AGENTS.md is the single source of truth for active rule text
- This registry tracks lifecycle metadata only
- When retiring a rule: remove from AGENTS.md, archive full text here with retirement date and reason
- Maximum 2 new rule proposals per week (prevents rule inflation)
- Last PR number used: PR-048

---

## PR-049 — LCM Safeguard Minimum Headroom (2026-03-26, permanent)

**Problem:** contextThreshold=0.75 fires at 150K tokens on a 200K limit. When output is 32K, overflow happens at 215K. LCM fires too late.

**Rule:** LCM contextThreshold must leave minimum 20% headroom = 0.60 for 200K context. If a model with different limits is set as primary, recalculate accordingly.

**Config location:** `openclaw.json → plugins.entries.lossless-claw.config.contextThreshold`

**Also:** LCM summaryModel must not be the same model used as subagent model. Using qwen for both summarization AND subagents creates a compounding failure path when qwen times out.

**Verification:** After any model change, grep error logs for `context overflow detected` — zero occurrences = working.

---

## PR-050 — AGENTS.md Bootstrap Limit (2026-03-26, permanent)

**Problem:** AGENTS.md grew to 67K chars over time. OpenClaw bootstrap limit is 20,000 chars. Sessions starting truncated since 2026-03-07 caused degraded quality and contributed to overnight freeze cascade.

**Rule:** AGENTS.md must stay under 20,000 chars at all times. If it approaches 18,000 chars, trigger a trim. Reference content (protocols, templates, verbose descriptions) must live in separate files.

**Reference files (created 2026-03-26):**
- `BUILD-CRITIC-PROTOCOL.md` — full build-critic loop + templates
- `PIPELINE-PROTOCOL.md` — multi-step pipeline protocol + templates
- `SOCIAL.md` — group chat and social protocol
- `PROTOCOL-DIGEST.md` — condensed LAWS text
- `rule-registry.md` — full PR text

**PR-051 — Railway Service Identity Gate (safety-critical, LAW-level):**
Any action involving Railway (CLI commands, deploy triggers, URL sharing, log checks, status checks, giving Kelly a Railway link):
1. State the target explicitly: "I am targeting [Mission Control / DC Data Hub]"
2. Confirm service ID: cross-reference `memory/railway-projects.md` — never use a service ID from memory alone
3. Confirm repo path: verify local directory and git remote match the table entry
4. URL rule: never construct or share a Railway URL from memory — always copy from `memory/railway-projects.md`
5. Deploy method: MC → `git push rex-workspace master` from `.openclaw/workspace/mission-control/`. DC Hub → `git push origin main` from `/Users/rex/dev/dc-data-hub/`. `railway up` only from linked directory `/Users/rex/OpenClaw/workspace/mission-control/`.

Failure prevented: wrong Railway URL given to Kelly, wrong service restarted, deploy targeting wrong service.

**Verification:** `wc -c AGENTS.md` must return < 20,000.

---

## PR-052 — Sub-Agent Failure Recovery (2026-03-30, permanent)
_Extends PR-047 and PR-038. Governs what to do when a sub-agent times out, fails, or returns incomplete output._

**Problem:** When sub-agents timed out, Rex was summarizing or guessing from partial output instead of recovering properly. Complex tasks (Railway deploys, DC Hub builds) went in circles because the failure recovery protocol was undefined.

**Rule:**
1. Do NOT summarize or guess from partial sub-agent output — incomplete work is not done.
2. Immediately read/grep what the agent actually wrote to files before it failed.
3. Estimate completion % — what completed vs. what's missing.
4. Write a checkpoint to the task lock file (## Current State + ## Sub-Agents sections).
5. Decide: re-spawn if scope is clear and remaining work <50% of original. Escalate to Kelly if agent failed multiple times or a decision is needed.
6. Log in error-journal — sub-agent failure is a system event.

Never mark a task step complete without verifying the sub-agent's output files exist and are non-empty.

---

## PR-053 — ROUTING.md Mandatory Session Read (2026-03-30, permanent)

**Problem:** No routing signal at session start. Skill selection was entirely memory-dependent, causing inconsistent chains and wrong skill selection.

**Rule:** ROUTING.md must be read at every session start (step 2 in startup sequence, after QUICKREF). Max size: 6,500 chars. If ROUTING.md is more than 7 days old, flag it stale at session start and do not use it as a routing reference until updated. ROUTING.md is a convenience layer — AGENTS.md and system-map.md are authoritative when conflicts arise.

---

## PR-054 — Gate Dual-Write (2026-03-30, permanent)
_Extends PR-044._

**Problem:** quality-gatekeeper was writing gate logs to memory/gates/ only. Task lock files had no gate record, making it impossible to know at task pickup whether a gate had been run.

**Rule:** After every gate review (pass OR fail), the gatekeeper writes to TWO locations:
1. `memory/gates/YYYY-MM-DD-gates.md` — full verdict, chronological audit log
2. Task lock file `## Plan Gate` or `## Output Gate` section — summary only (status + session key + date + issues found)

Both writes are mandatory when a task lock file exists.

---

## PR-055 — Skills Loaded Declaration (2026-03-30, permanent)

**Problem:** No audit trail for which skills were loaded for a task. Rex could not demonstrate which skill chain was used or whether the correct skills were consulted. Phase 2 of skill-performance-tracker could not distinguish correct routing from lucky guesses.

**Rule:** For every task using Plan Mode, fill `## Skills Loaded` in the task lock file BEFORE writing the Execution Plan. List every skill file actually read (path + purpose). Include `routing_source` field. Do not list skills you know exist but did not read. This is a configuration record, not an aspiration.

---

## PR-056 — system-map.md Staleness Rule (2026-03-30, permanent)

**Problem:** system-map.md was 16 days old and missing 13 skills. Routing decisions made from it were increasingly unreliable.

**Rule:** At session start, check system-map.md modification date. If >7 days old, flag it stale and do not use it as routing reference. nightly-mc-review STEP 0 includes an automated freshness check that appends a warning to the Telegram report footer when stale. Same rule applies to ROUTING.md (PR-053).
