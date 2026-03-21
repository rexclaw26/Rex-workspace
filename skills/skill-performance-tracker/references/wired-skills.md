# Wired Skills — Skill Performance Tracker

These skills have been wired to append a log entry to `execution-log.jsonl` at the end of each execution.

Add a skill to this list when its SKILL.md includes the tracker wiring note (see wiring-template below).

---

## Wiring Template

Add this block to the END of any skill's SKILL.md to wire it to the tracker:

```markdown
---

## Skill Performance Logging

At the end of this skill's execution, append one entry to the performance tracker:

**File:** `skills/skill-performance-tracker/references/execution-log.jsonl`
**Action:** Append (one JSON line, no pretty-print)
**Format:** `{"timestamp":"[ISO8601-with-offset]","skill_name":"[exact-folder-name]","task_type":"[3-10 word description]","outcome":"[success|fail|partial]","gate_result":"[pass|fail|skipped]","duration_ms":[integer],"error_notes":"[description or empty string]"}`

Silent — no output to Kelly.
```

---

## Currently Wired

| Skill | Date Wired | Notes |
|-------|-----------|-------|
| _(none yet — wiring happens in Phase 1 rollout)_ | — | — |

---

## Priority Wiring Order (suggested rollout)

Wire high-frequency skills first to build a useful data set quickly:

1. `article-writing` — fires most often
2. `x-post-automator` — high frequency, clear success/fail signal
3. `email-assistant` — external sends, high stakes
4. `seo-audit` — periodic but important
5. `news-aggregation` — daily cadence
6. `weekly-scorecard` — weekly, clear outcome
7. `quality-gatekeeper` — fires on every deliverable; gate_result is always relevant
8. `error-journal` — fires on failures; useful to track error-journal's own execution
9. All remaining skills — wire in batches of 3-4

**Always-active skills** (humanization-voice, injection-defense, compliance-audit) fire on every session. Wire these last — their high frequency will dominate the log and make pattern detection noisier in Phase 2.
