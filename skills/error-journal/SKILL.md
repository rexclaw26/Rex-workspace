---
name: error-journal
description: Error Journal and Learning Protocol for Rex. Runs continuously across all tasks. Logs every mistake, near-miss, output gate failure, anti-hallucination violation, or quality issue with root cause analysis and preventive rules. Runs weekly pattern analysis for the Monday Scorecard. Surfaces cross-agent learnings to Kelly. Triggers zero-tolerance escalation for critical errors. Load for any quality review, error acknowledgment, Monday Scorecard prep, or continuous improvement discussion.
---

# Error Journal & Learning Protocol

**Applies to all agents. Run continuously.**

---

## Error Entry Format

Log immediately when: output is corrected by Kelly, fails the OUTPUT GATE, triggers anti-hallucination, or is flagged for any quality issue.

```
--- ERROR ENTRY ---
Date: [YYYY-MM-DD]
Agent: Forge
Error Type: [Hallucination | Data Error | Formatting | Tone Drift | Missed Task | Security Event | Rule Violation | Logic Error | Tool Failure | Other]
Severity: [Critical | High | Medium | Low]

What happened: [1-2 sentence factual description]
Root cause: [Missing data / wrong assumption / tool failure / prompt ambiguity / other]
What was affected: [Output type, recipient, downstream impact]
How it was caught: [OUTPUT GATE | Visionary correction | self-detection | cross-agent flag]
Corrective action taken: [What was done to fix it this time]
Preventive rule: [Specific, actionable rule to prevent recurrence]
Related past errors: [Reference similar prior entries — track patterns]
--- END ENTRY ---
```

See [journal-log.md](references/journal-log.md) for the running log.

---

## Error Recovery Protocol

### Caught BEFORE delivery (OUTPUT GATE):
1. DO NOT deliver the flagged output
2. Log the error
3. Identify root cause
4. Produce corrected version
5. Run OUTPUT GATE again on corrected version
6. Deliver only if it passes
7. Include note to Kelly: *"Note: My first version of this [had issue X]. I caught it in quality review and corrected it."*

### Caught AFTER delivery:
1. Immediately acknowledge: *"I made an error in [output]. Here's the correction: [corrected version]."*
2. Log with Severity = High or Critical
3. Assess downstream impact — did anyone act on wrong information?
4. If downstream impact exists: alert Kelly with a mitigation plan
5. Add a preventive rule

---

## Weekly Pattern Analysis (Monday Scorecard)

Every Monday, analyze the past 7 days of the error journal:

1. Total errors by type and severity
2. **Recurring patterns** — same error type 3+ times = `PATTERN ALERT`
3. Root cause clusters — are most errors from the same source?
4. Effectiveness of prior preventive rules — did they prevent recurrence?
5. New preventive rules recommended

See [preventive-rules.md](references/preventive-rules.md) for the accumulated rule set.

---

## Cross-Agent Learning

- Tag any preventive rule that applies to ALL agents: `[SHARED LEARNING]`
- Surface shared learnings to Kelly (Forge) for inclusion in the next Core Foundation update
- When Kelly shares a correction triggered by another agent's error, log it:
  > *"Learned from [Agent Codename]: [lesson]. Applied to my workflow: [how]."*

---

## Zero-Tolerance Errors (Auto-Escalate to Kelly)

Immediately escalate — no delay — for:
- Any hallucinated financial data delivered externally
- Any security or injection event
- Same Critical error occurring 3+ times in 30 days
- Any error that caused real-world financial or reputational impact

---

## Anti-Hallucination

Never fabricate error journal entries. If there are no errors to report: say *"No errors logged this period."* Never invent entries to appear thorough.
