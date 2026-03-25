---
name: skill-performance-tracker
description: Passive execution logger for all Rex skills. Appends a JSONL record every time a skill completes — tracking skill name, task type, outcome, gate result, and any errors. Phase 1 of a 3-phase self-improving skill system. Silent by design — no output to Kelly, no alerts. Data feeds Phase 2 (pattern detector, week 2) and Phase 3 (amendment proposer, week 3 assessment). Always active alongside error-journal.
---

# Skill Performance Tracker — Phase 1

Silent execution logging. Runs after every skill invocation. No output. No alerts. Just data.

---

## What This Is Not

- Not a replacement for `error-journal` — error-journal logs mistakes and root causes. This logs execution outcomes for pattern detection.
- Not a quality gate — `quality-gatekeeper` handles that. This records whether the gate passed or failed.
- Not an amendment tool — that's Phase 3. This only observes.

---

## When to Log

Append a record after **every skill execution** that has a clear outcome. This includes:

- Any skill that produces a deliverable (article, email, report, X post, deck)
- Any skill that runs a quality gate
- Any skill that triggers a sub-agent
- Any skill that ends in an error or Kelly correction

**Skip logging for:**
- Heartbeat responses (HEARTBEAT_OK)
- Simple one-line lookups with no skill loaded
- Internal memory reads with no skill fired

---

## Log Format

One JSON object per line. Append to:
`skills/skill-performance-tracker/references/execution-log.jsonl`

```json
{
  "timestamp": "2026-03-17T19:10:00Z",
  "skill_name": "article-writing",
  "task_type": "article_draft",
  "outcome": "success",
  "gate_result": "pass",
  "duration_ms": 45000,
  "error_notes": ""
}
```

**Field definitions:**

| Field | Values | Notes |
|-------|--------|-------|
| `timestamp` | ISO 8601 UTC | When the skill completed |
| `skill_name` | skill folder name (e.g. `article-writing`) | Exact match to skills/ directory |
| `task_type` | short descriptor | e.g. `article_draft`, `email_reply`, `scorecard`, `x_post`, `sponsor_pitch` |
| `outcome` | `success` / `fail` / `partial` | `partial` = completed but with caveats or Kelly corrections |
| `gate_result` | `pass` / `fail` / `skipped` | Quality gate result. `skipped` if gate not applicable |
| `duration_ms` | integer | Rough wall-clock ms from skill load to completion. Estimate is fine. |
| `error_notes` | string | Brief note if outcome is fail/partial. Empty string if success. |

---

## How to Log

At the end of a skill execution, append one line to the JSONL file using the write tool.

**Do not rewrite the file.** Append only. If the file doesn't exist yet, create it with the first record.

Example append (pseudo):
```
Read existing file → append new JSON line → write back
```

Or use exec:
```bash
echo '{"timestamp":"...","skill_name":"...","task_type":"...","outcome":"success","gate_result":"pass","duration_ms":12000,"error_notes":""}' >> /Users/rex/.openclaw/workspace/skills/skill-performance-tracker/references/execution-log.jsonl
```

---

## Outcome Definitions

**success:** Skill completed as intended. Deliverable produced (if applicable). Gate passed (if applicable). No Kelly correction.

**partial:** Skill completed but one of:
- Kelly corrected the output
- Gate passed but output needed revision
- Task completed with a workaround
- Sub-agent timed out but result was usable

**fail:** One of:
- Skill produced no usable output
- Gate failed and content was not delivered
- Task was abandoned
- Error that required error-journal entry

---

## Relationship to Other Skills

**error-journal:** If outcome is `fail` or `partial` due to a mistake → ALSO log in error-journal per LAW 8. Both logs get entries. They serve different purposes.

**quality-gatekeeper:** Gate result goes in `gate_result` field. If gatekeeper fires, log its verdict.

**Phase 2 (coming week 2):** Pattern detector will read this JSONL and flag skills with 3+ fail/partial in 7 days.

**Phase 3 (week 3 assessment):** Amendment proposer will read patterns + LCM history to generate SKILL.md diff proposals for Kelly review.

---

## File Paths

| File | Purpose |
|------|---------|
| `skills/skill-performance-tracker/SKILL.md` | This file |
| `skills/skill-performance-tracker/references/execution-log.jsonl` | Master execution log |
| `skills/skill-performance-tracker/references/phase2-spec.md` | Phase 2 build spec (added week 2) |
| `skills/skill-performance-tracker/references/phase3-spec.md` | Phase 3 build spec (added week 3) |

---

## Phase Roadmap

| Phase | Scope | Timeline |
|-------|-------|----------|
| 1 — Logger | Passive JSONL logging after every skill execution | Now (live) |
| 2 — Detector | Weekly cron, flags skills with 3+ failures in 7 days, summary to Kelly | Week 2 |
| 3 — Proposer | LLM-generated SKILL.md diff proposals, Kelly review gate, git tracking | Week 3 assessment |
