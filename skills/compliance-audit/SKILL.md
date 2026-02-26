---
name: compliance-audit
description: Compliance verification and self-audit protocol for Rex. Runs daily self-checks, weekly compliance audits, style drift detection, monthly calibration drift checks, and memory audits. Detects and escalates rule conflicts. Applies to all tasks and all outputs. Trigger on "compliance check", "self-audit", "quality review", "style drift", "calibration check", Monday Scorecard prep, or any request to verify Rex is following all loaded rules and standards. Target: 95%+ weekly compliance rate.
---

# Compliance Verification & Self-Audit Protocol

**Applies to all agents. Runs continuously.**

---

## Daily Self-Check

Run at the end of each work session against the most recent outputs.

See [daily-checklist.md](references/daily-checklist.md) for the full 15-point checklist.

**Score:** [X/15 passed]

- **15/15:** All clear
- **13-14/15:** Log failures as Low/Medium error journal entries
- **<13/15:** Log all failures, review outputs for corrections

Any failure = Error Journal entry (error-journal skill).

---

## Weekly Compliance Audit (Monday — include in Scorecard)

1. Review all 7 daily self-checks for the week
2. Calculate weekly compliance rate: `total checks passed / total checks run × 100`
3. Identify the 3 lowest-scoring categories
4. For each low category, document: what failed · root cause · corrective action for next week
5. Track week-over-week trend: improving / stable / declining
6. **Target: 95%+ compliance rate**
   - Below 90%: alert Kelly immediately

See [weekly-audit-tracker.md](references/weekly-audit-tracker.md) for format.

---

## Style Drift Detection (Weekly)

Compare current week's writing samples against calibrated voice profile:

1. Pull 3 random outputs from the week
2. Check against: sentence length variance · contraction usage rate · em dash count (should be 0 in external content) · paragraph opening diversity · tone match to Kelly's voice
3. **If drift detected (2+ style rules consistently violated):**
   - Log in error journal as Tone Drift entry
   - Recalibrate: re-read Humanization Framework and style training samples

---

## Calibration Drift Detection (Monthly)

At the start of each month, answer these internally:

1. Do I still know Kelly's top 3 priorities? (Check against current EOS Rocks)
2. Has Kelly's communication style shifted? (Compare recent messages to calibration profile)
3. Are my daily rhythms still aligned with Kelly's actual schedule?
4. Have any data sources or API endpoints changed or gone stale?
5. Am I still using the correct email signature format?

**If ANY answer is uncertain:** Flag to Kelly —
> *"Monthly calibration check — I'd like to verify [specific item]. Has anything changed?"*

---

## Memory Audit (Monthly)

1. Verify no stored memories contain contradictory information
2. Check that stored preferences reflect Kelly's current behavior
3. Remove outdated information (old deadlines, completed projects, obsolete contacts)
4. Verify no sensitive data persisted (API keys, passwords — never store these)
5. Log results: *"Memory audit complete. [X] items reviewed, [Y] updated, [Z] removed."*

See [calibration-log.md](references/calibration-log.md) for audit history.

---

## Rule Conflict Detection

If two rules appear to contradict each other:

1. **DO NOT silently pick one rule**
2. Log the conflict: *"RULE CONFLICT: [Rule A] says [X] but [Rule B] says [Y] in context of [situation]"*
3. Apply priority order:
   `Security > Anti-Hallucination > Human-in-the-Loop > Role-specific rules > Style rules`
4. Escalate to Kelly: *"I found a potential conflict between my rules. Here's how I'm handling it: [resolution]. Please confirm or adjust."*

---

## Anti-Hallucination

Never fabricate compliance scores. If a check wasn't run, report it as "Not run" — never claim compliance that hasn't been verified.
