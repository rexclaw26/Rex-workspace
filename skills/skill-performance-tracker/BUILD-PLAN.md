# Phase 1 Build Plan — skill-performance-tracker

**Status:** Ready to execute
**Prepared by:** Planning sub-agent
**Date:** 2026-03-17

---

## What Was Built (this session)

All files are created and ready. Rex needs to:
1. Wire priority skills (add the logging block to each SKILL.md)
2. Update `wired-skills.md` as each skill is wired
3. Start logging

---

## File Structure

```
skills/skill-performance-tracker/
├── SKILL.md                          ← skill definition + logging instructions
└── references/
    ├── execution-log.jsonl           ← master log (empty, ready for appends)
    ├── wired-skills.md               ← registry of wired skills + wiring template
    └── phase-roadmap.md              ← Phase 2 + 3 specs (not building yet)
```

---

## Skills That Need Wiring Notes Added

Copy the wiring block from `references/wired-skills.md` into the END of each skill's SKILL.md.

### Priority 1 — Wire immediately (high frequency, clear signal):

| Skill | SKILL.md path |
|-------|---------------|
| article-writing | `skills/article-writing/SKILL.md` |
| x-post-automator | `skills/x-post-automator/SKILL.md` |
| email-assistant | `skills/email-assistant/SKILL.md` |
| news-aggregation | `skills/news-aggregation/SKILL.md` |
| weekly-scorecard | `skills/weekly-scorecard/SKILL.md` |

### Priority 2 — Wire in week 1 (medium frequency):

| Skill | SKILL.md path |
|-------|---------------|
| seo-audit | `skills/seo-audit/SKILL.md` |
| quality-gatekeeper | `skills/quality-gatekeeper/SKILL.md` |
| error-journal | `skills/error-journal/SKILL.md` |
| financial-analysis | `skills/financial-analysis/SKILL.md` |
| strategic-consulting | `skills/strategic-consulting/SKILL.md` |
| sponsor-outreach | `skills/sponsor-outreach/SKILL.md` |

### Priority 3 — Wire after first data is flowing:

All remaining skills. Wire in batches to avoid session sprawl.

**Hold off on always-active skills** (humanization-voice, injection-defense, compliance-audit) — they fire every session. Wire these in Phase 2 when the pattern detector can handle high-frequency signals without noise.

---

## Risks & Edge Cases

### 1. Duration estimation is imprecise
Rex doesn't have a native session timer. Duration_ms will be an estimate based on conversation length and tool call count. This is acceptable for Phase 1 pattern detection — we're looking for order-of-magnitude differences (2 min vs 45 min), not millisecond precision. Convention: prefix estimated values with `~` in error_notes, e.g. `"error_notes": "~estimated duration"`.

### 2. Skill boundary ambiguity
Some tasks trigger multiple skills. Example: article-writing fires, which triggers quality-gatekeeper, which triggers humanization-voice. Log each separately. The skill that was explicitly invoked for Kelly's request is the primary entry. Sub-skill invocations (quality-gatekeeper as a gate, humanization-voice as always-active) get their own entries only once they're wired.

### 3. Log file corruption risk
JSONL is append-only and line-delimited — one bad line won't corrupt the file. But if Rex accidentally writes malformed JSON (missing closing brace, etc.), Phase 2's parser will choke on that line. Mitigation: validate JSON mentally before appending, or use a quick `python3 -c "import json; json.loads(line)"` check if suspicious.

### 4. Missed logging (session ends abruptly)
If a session ends before Rex appends the log entry, the execution is lost. This is acceptable — we're building a statistical picture, not an audit trail. No retry mechanism needed in Phase 1. Note: error-journal entries will still be logged because LAW 8 forces that separately.

### 5. Overlap with error-journal
The line: **error-journal logs WHY something failed; this tracker logs THAT something failed.** If Rex is tempted to write a detailed root cause in `error_notes`, that's an error-journal entry, not a tracker entry. Keep error_notes brief (≤15 words). Full analysis goes in error-journal.

### 6. always-active skills generate noise
humanization-voice, injection-defense, and compliance-audit fire on virtually every output. Wiring them in Phase 1 would make their entries dwarf all other skills in the log, skewing any future pattern analysis. Defer to Phase 2 when the pattern detector can apply per-skill thresholds.

### 7. No TASK_INDEX integration yet
Phase 1 doesn't update TASK_INDEX.md or lock files with logging status. That's fine — this skill runs post-execution. Phase 2 cron integration may need to account for long-running tasks logged across multiple sessions.

---

## Integration Notes

### With error-journal
No changes to error-journal SKILL.md needed. The tracker is additive. When an error-journal entry is written (failure/escalation), Rex should also log a tracker entry with `outcome: fail` and a brief error_notes reference.

### With quality-gatekeeper
Wire quality-gatekeeper to log after each gate verdict. The `gate_result` field is purpose-built for this. A gatekeeper NEEDS REVISION that gets fixed and re-approved = `gate_result: fail` (the first run failed, even if eventually resolved).

### With compliance-audit
Don't wire compliance-audit in Phase 1. It fires too often and its "outcome" is a score, not a binary — the current log format doesn't capture that nuance. Phase 2 can add a score field if needed.

### With Mission Control
Phase 1 has no Mission Control dashboard widget. The JSONL file is the only output. Phase 2/3 may surface a skill health panel in Mission Control — flag this as a Phase 3 design consideration.

---

## Phase 1 Success Criteria

Before assessing Phase 2:
- [ ] 20+ entries in execution-log.jsonl
- [ ] At least 5 distinct skills wired
- [ ] Zero log write errors
- [ ] Kelly has not noticed any chat output from this skill (it should be invisible)
- [ ] At least one fail/partial entry exists (confirms the full outcome range is being captured)
