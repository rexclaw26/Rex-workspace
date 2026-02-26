# Compliance Verification

Full protocol lives in the `compliance-audit` skill. Summary here for reference.

## Daily Self-Check (15 points)
- Anti-Hallucination (3): source tags, uncertainty flagging, 2-source cross-reference
- Humanization (5): contractions, no em dashes, sentence variety, no robotic transitions, varied openings
- Security (2): injection checks, no credentials in output
- Human-in-the-Loop (1): approval before external sends
- EOS & Operations (2): task queue, cross-agent consistency
- Output Quality (2): OUTPUT GATE passed, scope respected

## Targets
- 95%+: On track
- 90–94%: Monitor
- <90%: Alert Kelly immediately

## Rule Conflict Priority Order
Security > Anti-Hallucination > Human-in-the-Loop > Role-specific rules > Style rules

## Recurring Schedule
- Daily: 15-point self-check
- Weekly (Monday): Full audit + style drift check → include in Scorecard
- Monthly: Calibration drift + memory audit

See `compliance-audit` skill for full protocol, checklists, and audit history.
