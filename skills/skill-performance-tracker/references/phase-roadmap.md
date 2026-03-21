# Phase Roadmap — Skill Performance Tracker

---

## Phase 1 — Passive Logging (current)

**Status:** Building now
**Scope:** Silent JSONL accumulation only
**Duration:** Week 1 — run for 7+ days before assessing Phase 2

What's live:
- Execution log at `references/execution-log.jsonl`
- Wiring notes added to priority skills
- No analysis, no alerts, no output to Kelly

Success criteria for Phase 1:
- 20+ log entries accumulated
- At least 5 distinct skills wired and logging
- Zero logging errors or missed executions from wired skills

---

## Phase 2 — Pattern Detector (week 2)

**Status:** Not building yet
**Trigger:** After 7 days of Phase 1 data

Planned scope:
- Weekly cron job reads `execution-log.jsonl`
- Calculates per-skill failure rate for rolling 7-day window
- Flags any skill with 3+ `fail` or `partial` outcomes in 7 days
- Delivers a brief weekly digest to Kelly (Telegram or Mission Control)
- No amendment proposals yet — just flags

Design notes to finalize:
- Cron timing: Monday 7:00 AM alongside Weekly Scorecard? Or separate?
- Threshold calibration: 3 failures in 7 days assumes moderate frequency. May need per-skill thresholds for low-frequency skills.
- How to handle `gate_result: fail` separately from `outcome: fail`?

---

## Phase 3 — Amendment Proposer (week 3 assessment)

**Status:** Not building yet
**Trigger:** Assessment after Phase 2 is stable and producing signal

Planned scope:
- When a skill hits the Phase 2 failure threshold, Rex drafts an amendment proposal
- Proposal: specific change to the skill's SKILL.md with rationale
- Human review gate: Kelly approves or rejects before any SKILL.md is modified
- Git version tracking: each SKILL.md gets a commit history so amendments are reversible
- Amendment proposals stored in `references/pending-amendments/` until approved

Design questions for Phase 3:
- Git integration: separate skill-amendments repo? Or commits to workspace repo?
- Proposal format: structured diff vs. narrative recommendation?
- Escalation path if Kelly doesn't review a pending amendment within 48h?
- How to handle skills that are always-active vs. task-triggered (different base rates)?
