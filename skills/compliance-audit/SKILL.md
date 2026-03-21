---
name: compliance-audit
description: Compliance verification and self-audit protocol for Rex. Runs daily self-checks, weekly compliance audits, style drift detection, monthly calibration drift checks, and memory audits. Detects and escalates rule conflicts. Applies to all tasks and all outputs. Trigger on "compliance check", "self-audit", "quality review", "style drift", "calibration check", Monday Scorecard prep, or any request to verify Rex is following all loaded rules and standards. Target: 95%+ weekly compliance rate.
---

# Compliance Verification & Self-Audit Protocol

**Applies to all agents. Runs continuously.**

---

## Daily Self-Check — When It Fires (LAW 2 — mandatory)

**The compliance self-check is NOT a "session close" event — sessions have no formal close.**

It fires on these triggers (per LAW 2 in AGENTS.md):
1. **After any turn that produces a deliverable output** (written content, built feature, research output, deck, analysis, any external-facing work)
2. **When Kelly explicitly ends the session** (goodbye, signing off, leaving)

Do not wait. Do not skip. These are the only two triggers — both are mandatory.

**After the check runs, results MUST be written to BOTH files immediately:**

**File 1 — `memory/YYYY-MM-DD.md`** (append):
```
## Compliance Check — [HH:MM]
Trigger: [deliverable produced: describe what / session end]
Score: [X/17 points]
Failures: [list check IDs + brief note, or "none"]
Handoff: updated ✅
```

**File 2 — `skills/compliance-audit/references/daily-checklist.md`** (append row to Daily Score table):
```
| YYYY-MM-DD HH:MM | [X/17] | [check IDs that failed, or "none"] | [brief note on what was produced] |
```

**If either file is missing the entry after a deliverable turn — the check did not run. Both files required. One without the other = LAW 2 violation.**

---

See [daily-checklist.md](references/daily-checklist.md) for the full 17-point checklist.

**Thresholds:**
- **17/17:** All clear
- **15-16/17:** Log failures as Low/Medium error journal entries
- **<15/17:** Log all failures, review outputs for corrections, alert Kelly if below 14/17

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

## Pre-Output Gate

**Must appear before every compliance report, audit, or drift check delivered to Kelly:**
```
⚙️ OUTPUT GATE — Compliance Audit
LAW 1 │ Humanization  : ✅ PASS — REPORT mode
LAW 5 │ Sources       : ✅ — scores based on actual checked outputs, not estimated
LAW 6 │ Human Approval: N/A — internal audit report
```

## Anti-Hallucination

Never fabricate compliance scores. If a check wasn't run, report it as "Not run" — never claim compliance that hasn't been verified.
