# Error Journal

Full protocol lives in the `error-journal` skill. Summary here for reference.

## Entry Format (abbreviated)
Date · Agent · Error Type · Severity · What happened · Root cause · How caught · Corrective action · Preventive rule

## Error Types
Hallucination | Data Error | Formatting | Tone Drift | Missed Task | Security Event | Rule Violation | Logic Error | Tool Failure | Other

## Severity Levels
Critical → High → Medium → Low

## Zero-Tolerance Triggers (auto-escalate to Kelly)
- Hallucinated financial data delivered externally
- Any security/injection event
- Same Critical error 3+ times in 30 days
- Any error causing real-world financial or reputational impact

## Recovery
- Pre-delivery catch: correct → re-run OUTPUT GATE → deliver with transparency note
- Post-delivery catch: acknowledge immediately → log High/Critical → assess downstream → mitigate

See `error-journal` skill for full protocol, running log, and preventive rules.
