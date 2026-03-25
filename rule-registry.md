# Rule Registry — Rex
_Companion to AGENTS.md. Tracks rule lifecycle._
_Started: 2026-03-21 | Source of truth for all PRs: AGENTS.md_

## Permanent Rules (Grandfathered — in production before registry)

| PR | Rule Summary | Added | Last Triggered | Status |
|----|-------------|-------|---------------|--------|
| PR-009 | System message triage | 2026-03-08 | 2026-03-21 | PERMANENT |
| PR-010 | No duplicate cron delivery | 2026-03-08 | — | PERMANENT |
| PR-011 | Multi-step pipeline protocol | 2026-03-08 | — | PERMANENT |
| PR-012 | No fabricated dashboard metrics | 2026-03-07 | — | PERMANENT |
| PR-023 | Self-chaining pipeline sub-agents | 2026-03-08 | — | PERMANENT |
| PR-024 | Email send gate sequence | 2026-03-08 | — | PERMANENT |
| PR-031 | Infrastructure files off-limits | 2026-03-12 | — | PERMANENT |
| PR-032 | LAW 1 checklist integrity | 2026-03-12 | — | PERMANENT |
| PR-033 | Chat output precedence | 2026-03-13 | 2026-03-21 | PERMANENT |
| PR-036 | No filler narration | 2026-03-13 | 2026-03-21 | PERMANENT |
| PR-037 | Verify before acting | 2026-03-13 | 2026-03-21 | PERMANENT |
| PR-038 | Sub-agent timeout protocol | 2026-03-14 | 2026-03-21 | PERMANENT |
| PR-039 | Precise scope when claiming "no record" | 2026-03-20 | 2026-03-21 | PERMANENT |
| PR-040 | No fabrication under challenge | 2026-03-20 | — | PERMANENT |
| PR-041 | Verify financial figures before rewriting | 2026-03-20 | — | PERMANENT |
| PR-042 | Verify coding agent output before reporting done | 2026-03-21 | 2026-03-21 | PERMANENT |
| PR-043 | Coding agent session scope limit (max 5 files) | 2026-03-21 | 2026-03-21 | PERMANENT |
| PR-044 | Zero-bypass gate enforcement — gatekeeper fires on ALL written deliverables, no exceptions, gate line must precede draft | 2026-03-22 | 2026-03-22 | PERMANENT |
| PR-045 | Mandatory memory checkpoints — session_status check every turn, checkpoint fires at 55-min intervals, daily log canonical, 400-word max | 2026-03-23 | 2026-03-23 | PERMANENT |
| PR-046 | Mandatory model override — Haiku default, Sonnet required for coding/architecture/critic/security/multi-file/gatekeeper tasks | 2026-03-23 | 2026-03-23 | PERMANENT |
| PR-047 | Sub-agent and plan execution: 120s max per pass, partial results written immediately, continuation protocol on timeout, critic gets pre-written summary not live research | 2026-03-25 | — | PERMANENT |
| PR-048 | Gateway restart = `openclaw gateway install --force` only. `stop && start` leaves orphaned process on port. Alias: `openclaw-restart` in .zshrc | 2026-03-25 | — | PERMANENT |

## Rules in Testing (need 3 consecutive successes)
| PR | Rule | Testing Status | Evidence |
|----|------|---------------|----------|
_(none yet — new rules from 2026-03-22 onwards go here first)_

## Proposed Rules (awaiting Kelly approval)
| PR | Rule | Proposed | Rationale |
|----|------|---------|-----------|
_(none yet)_

## Retired Rules (90+ days untriggered — archived, not deleted)
_(none yet)_

## Shared Learnings Queue (for Lex/team coordination)
_(none yet — [SHARED LEARNING] entries queued here for routing)_

---

## Rule Proposal Format
When proposing a new rule, use this format and append here:

```
--- RULE PROPOSAL ---
PR: [next number after current highest]
Date: [date]
Type: New Rule | Rule Modification | Rule Removal
Current state: [what exists now, or "no rule"]
Problem observed: [error journal entries or incidents — need 3+ instances]
Proposed change: [specific, actionable rule text]
Expected impact: [what this prevents or improves]
Risk: [could this cause unintended side effects?]
Evidence: [error journal entries with dates]
--- END PROPOSAL ---
```

## Rule Lifecycle
```
Problem observed (3+ instances) → Rule proposed → Kelly approves → 
Testing [0/3] → 3 consecutive successes → PERMANENT (added to AGENTS.md) → 
90 days untriggered → Retirement review → Retired (archived here, removed from AGENTS.md)
```

**Exception:** Critical safety rules (injection defense, security, infrastructure, anti-hallucination) skip testing gate and go to AGENTS.md immediately.

## Governance Notes
- AGENTS.md is the single source of truth for active rule text
- This registry tracks lifecycle metadata only
- When retiring a rule: remove from AGENTS.md, archive full text here with retirement date and reason
- Maximum 2 new rule proposals per week (prevents rule inflation)
- Last PR number used: PR-048
