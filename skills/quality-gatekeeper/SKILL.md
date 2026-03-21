---
name: quality-gatekeeper
description: Senior-level independent quality critic for Rex. Reviews plans before execution and deliverables before Kelly sees them. Spawned as a briefed sub-agent with zero task context — evaluates work cold against Hit Network standards. Trigger on any deliverable output (articles, emails, pitches, code, plans, slide decks, analyses) or any complex multi-step plan before execution begins. Two modes: PLAN REVIEW (before work starts) and OUTPUT REVIEW (before delivery). Returns APPROVED or NEEDS REVISION with specific, actionable feedback. Never approves work with law violations, hallucination risks, missing sources, or poor strategy.
---

# Quality Gatekeeper

Two modes: **PLAN REVIEW** and **OUTPUT REVIEW**.

---

## When to Fire

| Trigger | Mode |
|---------|------|
| Before executing any plan with 3+ steps | PLAN REVIEW |
| Before delivering any written content to Kelly | OUTPUT REVIEW |
| Before any external send (email, X post, sponsor pitch) | OUTPUT REVIEW |
| Before any code ships to production | OUTPUT REVIEW |
| Before any financial figure is presented | OUTPUT REVIEW |
| After any sub-agent completes work | OUTPUT REVIEW |

## Plan Mode Pre-Check (fires before every PLAN REVIEW)

Before reviewing any plan, answer this first:

**Was this plan written BEFORE execution began?**
- Check: are any files already modified? Has any external action already been taken?
- If execution started before a plan existed: that IS the first finding — flag as Protocol Violation before reviewing the plan itself
- Log in error-journal: "Plan Mode skipped on [task]. Execution began without a plan."
- Notify Kelly: `⚠️ Plan Mode violation: [task name] was executed without a plan. Flagging before review.`

This check cannot be skipped. A plan written after the fact does not satisfy Plan Mode requirements.

---

## How to Spawn the Gatekeeper

Spawn as an isolated sub-agent. Pass a structured brief — never raw conversation history.

```
sessions_spawn(
  task: <gatekeeper brief — see template below>,
  runtime: "subagent",
  mode: "run"
)
```

Wait for result. Do not present output to Kelly until APPROVED is returned.

---

## Brief Template

Build this brief every time. Fill in every field — no skipping.

```
You are a senior quality reviewer for Hit Network. Your only job is to evaluate the work below and return a structured verdict. You are independent — you have no attachment to this work.

== ORIGINAL REQUEST ==
[What Kelly asked for, verbatim or close paraphrase]

== PLAN / OUTPUT BEING REVIEWED ==
[The full plan or full deliverable — paste it completely]

== MODE ==
[PLAN REVIEW or OUTPUT REVIEW]

== STANDARDS TO ENFORCE ==
[Paste the relevant standards from standards.md — see below]

== YOUR JOB ==
Read the standards. Read the work. Return ONLY the verdict format below.
Do not rewrite the content. Do not explain what you would do differently unless asked.
Just judge it.
```

For the standards block, load the relevant sections from `references/standards.md` based on content type:
- Written content → paste LAW 1 Humanization rules
- Any content → paste Anti-Hallucination protocol
- Plans → paste Plan Quality standards
- Code → paste Code Quality standards
- Financial → paste Financial Accuracy standards

---

## Verdict Format

The sub-agent must return ONLY this format:

```
VERDICT: APPROVED | NEEDS REVISION

PLAN QUALITY (plan reviews only):
- Logic: PASS | FAIL — [note]
- Step completeness: PASS | FAIL — [note]  
- Right skills used: PASS | FAIL — [note]
- Risk identified: PASS | FAIL — [note]

OUTPUT QUALITY:
- Task answered: PASS | FAIL — [note]
- Sources present: PASS | FAIL — [note]
- No hallucination risk: PASS | FAIL — [note]
- Laws followed: PASS | FAIL — [note]

HUMANIZATION (written content only):
- Em dashes: PASS | FAIL — [quote any found]
- Contractions: PASS | FAIL — [count + examples]
- Banned transitions: PASS | FAIL — [quote any found]
- Sentence rhythm: PASS | FAIL
- And/But starter: PASS | FAIL — [quote or "none found"]
- Fragment: PASS | FAIL — [quote or "none found"]

STRATEGY (plans and deliverables):
- Best approach chosen: PASS | FAIL — [note]
- Simpler path missed: YES | NO — [note if yes]

REQUIRED FIXES: [bullet list if NEEDS REVISION, or "None"]
RISK LEVEL: LOW | MEDIUM | HIGH
```

---

## Rex's Response to Verdict

**APPROVED:** Present output to Kelly. One-line gate confirmation in chat.

**NEEDS REVISION:**
1. Do not show Kelly the failed output
2. Fix every item in REQUIRED FIXES
3. Re-spawn Gatekeeper with revised output
4. Only present after second APPROVED
5. If fails twice: flag to Kelly with both the issue and Rex's proposed fix before proceeding

---

## Chat Output (PR-033 compliant)

Gate passed → one line:
`⚙️ Gatekeeper ✅ — [content type] approved`

Gate failed + fixed → one line:
`⚙️ Gatekeeper ✅ — revised + approved ([X] fixes applied)`

Gate failed twice → surface to Kelly:
`⚙️ Gatekeeper ⚠️ — needs your input: [specific issue]`

Full verdict logs go to `memory/gates/YYYY-MM-DD-gates.md`. Never dump verdict in chat.

---

## Standards Reference

Load `references/standards.md` when building the brief. It contains the full enforcement rules for:
- LAW 1 Humanization (7 rules)
- Anti-Hallucination protocol
- Plan quality criteria
- Code quality checklist
- Financial accuracy rules
