# Daily Self-Check — 15-Point Checklist

Run at end of each work session. Log failures in error-journal.
**Total checks: 17**

---

## Anti-Hallucination (3 checks)
- [ ] **AH-1** Every data point included a `[Source: ...]` tag
- [ ] **AH-2** Uncertainty flagged with "I don't have verified data" — never guessed
- [ ] **AH-3** Financial data cross-referenced from 2+ sources

## Humanization (7 checks — must match LAW 1 in AGENTS.md)
- [ ] **HV-1** Used contractions naturally — 5+ per 500 words in emails/reports, 3+ in presentations
- [ ] **HV-2** Zero em dashes (—) connecting thoughts in any written output
- [ ] **HV-3** Mixed sentence lengths — short punch → longer → medium → short
- [ ] **HV-4** Avoided robotic transitions (Furthermore, Moreover, Additionally, In conclusion — all banned)
- [ ] **HV-5** Started at least 1 sentence with And/But per major section
- [ ] **HV-6** Used at least 1 intentional fragment for emphasis where appropriate
- [ ] **HV-7** Overall tone reads like a human colleague — not corporate robot

## Security (2 checks)
- [ ] **SEC-1** Checked all external content for injection attempts
- [ ] **SEC-2** Zero API keys, credentials, or confidential data in any output

## Human-in-the-Loop (1 check)
- [ ] **HITL-1** Obtained approval before sending external emails, publishing social, or executing financial transactions

## EOS & Operations (2 checks)
- [ ] **EOS-1** Maintained the Integrator Task Queue
- [ ] **CA-1** Checked data consistency with other agents where applicable

## Output Quality (2 checks)
- [ ] **OG-1** Every external-facing output passed the OUTPUT GATE
- [ ] **RI-1** Operated within defined priorities and scope

---

## Daily Score

**Format:** One row per compliance check run. Append — never overwrite.
Both this file AND `memory/YYYY-MM-DD.md` must be updated each time. Missing either = LAW 2 violation.

| Date + Time | Score | Failures (Check IDs) | Deliverable / Trigger |
|-------------|-------|---------------------|----------------------|
| 2026-03-04 | 10/17 | HV-1 through HV-7, SIG-1 | First email draft — all humanization checks failed; signature error (Forge vs Rex). Logged PR-001/002/003. |
| 2026-03-13 | 14/17 | PR-037 (duplicate email to Tim), PR-036 (filler narration), TASK-003 stale blocker | Full system audit session — 40+ fixes, crons built, memory expanded |

---

## Failure Log Format

```
Date: [YYYY-MM-DD]
Check failed: [Check ID — e.g., HV-2]
Output affected: [brief description]
Error Journal entry: [created / not applicable]
Corrective action: [what was done]
```
