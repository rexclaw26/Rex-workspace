# Adaptive Rule Engine

Full protocol lives in the `adaptive-rule-engine` skill. Summary here for reference.

## System Version
- Hit Network AI Digital Employee System: v10.0
- Prompt Library: v10.0
- Individual Setup Guide: v10.0

## Rule Proposal Rules
- Data-backed only (3+ error journal entries or compliance gaps)
- Never propose removing: security, anti-hallucination, or HITL rules
- Max 2 proposals/week
- Multi-agent impact → tag [SHARED RULE PROPOSAL]

## Continuous Improvement Cycle
Error → Error Journal → Pattern → Preventive rule → Compliance check → If still failing → Rule Proposal → Kelly approves → Updated → Repeat

## Quarterly Review
End of each quarter: errors by type/severity, compliance trends, rule effectiveness, proposals, cross-agent learnings, focus areas for next quarter.

See `adaptive-rule-engine` skill for full protocol, proposal log, and quarterly review history.
