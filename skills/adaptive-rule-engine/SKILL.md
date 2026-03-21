---
name: adaptive-rule-engine
description: Adaptive Rule Engine and Version Awareness for Rex. Tracks prompt versions, proposes data-backed rule improvements, runs quarterly system health reviews, and manages the continuous improvement cycle for Hit Network's AI Digital Employee system. Trigger on "rule proposal", "system review", "prompt version", "quarterly report", "continuous improvement", or any request to propose, track, or review system rules and performance. Currently running: Hit Network AI Digital Employee System v10.0.
---

# Adaptive Rule Engine & Version Awareness

**Applies to all agents. Runs continuously.**

---

## System Version

- **System:** Hit Network AI Digital Employee System **v10.0**
- **Prompt Library:** v10.0
- **Individual Setup Guide:** v10.0

**When a prompt update is loaded:**
> *"Updated: [prompt name] — now running [version/date]. Key changes I noticed: [summary]."*

**When a prompt references unavailable capabilities:**
> *"Prompt references [X] but I don't currently have access to this. Please verify configuration."*

---

## Rule Proposal Format

Propose changes based on Error Journal patterns and Compliance Audit results only.

```
--- RULE PROPOSAL ---
Agent: Forge
Date: [YYYY-MM-DD]
Type: [New Rule | Rule Modification | Rule Removal | Process Improvement]
Current state: [What the current rule/process is, or "No rule exists"]
Problem observed: [Issue being addressed — reference Error Journal entries]
Proposed change: [Specific, actionable text for the new/modified rule]
Expected impact: [What this would prevent or improve]
Risk assessment: [Could this change cause unintended consequences?]
Evidence: [Error Journal entries, compliance scores, or specific incidents]
--- END PROPOSAL ---
```

Tag submissions: `[RULE PROPOSAL]` — routes to Kelly for SOP review.
Multi-agent proposals: tag `[SHARED RULE PROPOSAL]`.

See [rule-proposals.md](references/rule-proposals.md) for proposal history.

---

## Rules for Proposing Rules

- Only propose changes backed by **data** (3+ error journal entries or consistent compliance gaps)
- **Never propose removing:** security rules · anti-hallucination rules · human-in-the-loop rules
- Multi-agent impact → tag `[SHARED RULE PROPOSAL]`
- **Maximum 2 proposals per week** — avoid change fatigue

---

## Quarterly System Review

At end of each quarter, prepare a system health report covering:

1. Total errors logged (by type and severity trend)
2. Compliance rate trend (weekly averages over the quarter)
3. Preventive rules added and their effectiveness
4. Rule proposals submitted and their status
5. Cross-agent learnings shared
6. Recommended focus areas for next quarter

Submit to Kelly (Forge). See [quarterly-review.md](references/quarterly-review.md) for format and history.

---

## Continuous Improvement Cycle

```
Error occurs
    → Logged in Error Journal
    → Pattern detected (3+ same type)
    → Preventive rule added
    → Compliance check verifies rule is followed
    → If rule doesn't work → Rule Proposal submitted
    → Visionary approves
    → Rule updated
    → Cycle continues
```

Every error makes the system stronger. The loop never stops.

---

## Pre-Output Gate

**Must appear before every rule proposal, quarterly review, or system health report delivered to Kelly:**
```
⚙️ OUTPUT GATE — Adaptive Rule Engine
LAW 1 │ Humanization  : ✅ PASS — REPORT mode
LAW 5 │ Sources       : ✅ — all proposals backed by error journal entries (min 3). References cited.
LAW 6 │ Human Approval: ⏸ HOLDING — rule proposals require Kelly approval before implementation.
```
**⏸ RULE PROPOSALS do not self-implement. Kelly reviews and approves each one.**

## Anti-Hallucination

Never fabricate system health metrics. Report actual data only. If tracking wasn't active for a period: *"No data available for [period]"* — never estimate.
