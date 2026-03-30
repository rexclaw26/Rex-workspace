# TASK LOCK — [Task Name]
_Copy this file to tasks/TASK-[###]-[short-name].md. Fill every section. A new session with zero prior context must be able to pick this up and execute it._

**ID:** TASK-[###]
**Status:** planned | active | blocked | complete
**Created:** YYYY-MM-DD HH:MM PST
**Last updated:** YYYY-MM-DD HH:MM PST
**Owner:** Rex | Sub-agent
**Priority:** high | medium | low

---

## Objective
One sentence. What done looks like.

---

## Full Specification
Complete description. No assumed context. Everything needed to execute this task from a cold start — tools, APIs, models, design decisions, constraints. If a new instance of Rex reads only this section, they should be able to start immediately.

---

## Locked Decisions
Decisions that have been made and must NOT be re-litigated without explicit Kelly approval.

| Decision | Choice Made | Rationale |
|----------|-------------|-----------|
| [decision] | [choice] | [why] |

---

## Skills Loaded
_Fill this BEFORE Step 1 of Execution Plan. List every skill file actually read at task start with path. Do not list skills you know exist but did not read. This is a configuration record, not an aspiration._

**Skills declared at task start:**
| Skill | Path | Purpose for this task |
|-------|------|----------------------|
| [skill name] | skills/[name]/SKILL.md | [why loaded] |

**Routing source:** routing_md | keyword_match | always_active | manual

---

## Plan Gate
_Mandatory. Spawn a quality-gatekeeper sub-agent in PLAN REVIEW mode before beginning execution. Work does NOT start until this gate is APPROVED._

**Status:** ⏳ PENDING | ✅ APPROVED | ❌ NEEDS REVISION
**Critic session key:** [session key from sessions_spawn]
**Date reviewed:** YYYY-MM-DD HH:MM
**Issues found:** [none | list issues]
**Notes:** [any context on the review]

---

## Execution Plan
_Work begins only after Plan Gate = APPROVED._

Step-by-step. Update status as each step completes.

- [ ] Step 1 — [description]
- [ ] Step 2 — [description]
- [ ] Step 3 — [description]

_Mark steps with [x] when done. Add date completed._

---

## Files
All files this task creates, modifies, or depends on.

| File Path | Status | Role |
|-----------|--------|------|
| [path] | exists / pending | [what it is] |

---

## Sub-Agents
Any sub-agents spawned for this task.

| Session Key | Task Given | Status | Output Location |
|-------------|-----------|--------|-----------------|
| [key] | [task] | running / complete / failed | [file or location] |

**Sub-agent failure log:** [none | describe any timeouts, partial outputs, re-spawns]

---

## Current State
_Update this section every time you touch this task._

**As of [date time]:**
- What's done: [...]
- What's in progress: [...]
- What's next: [single next action]
- Blockers: [none / describe]

---

## Prior Context
_Read this before starting the task. Populate for HIGH and CRITICAL tasks only. For LOW tasks, mark N/A and skip._

**Domain:** [content | sponsors | infrastructure | finance/DeFi | SEO | general]
**Memory file checked:** [e.g., memory/sponsors.md — paste path checked]

**What we already know about this task:**
- [Bullet 1: relevant prior history, decisions made, why]
- [Bullet 2: connections to other systems or prior work]
- [Bullet 3: known blockers, failed approaches, data sources]
- [Bullet 4: if no prior context found — write "No prior context — new domain"]

**Note:** This is historical reference, not a binding constraint. Only ## Locked Decisions are binding.

---

## Critical Rules Snapshot
_Fill this section when task is HIGH or CRITICAL risk. Leave empty or mark N/A for LOW-priority tasks._

**Populate by:**
1. Query `rule-index.md` for your task type(s)
2. Copy full text of all CRITICAL rules applicable to your task type
3. Copy summaries of HIGH rules applicable

**Task types identified:** [e.g., coding + analysis]
**Risk level:** [HIGH | CRITICAL | LOW — derived from highest rule risk among your task types]

**CRITICAL rules — full text:**
```
[LAW-1 — Humanization]
[Paste verbatim from rule-index.md]

[LAW-5 — Anti-Hallucination]
[Paste verbatim from rule-index.md]

[LAW-6 — Security]
[Paste verbatim from rule-index.md]

[other applicable CRITICAL rules — paste full text from rule-index.md]
```

**HIGH rules — summary + enforcement note:**
```
[PR-046]: Complex tasks must use claude-sonnet-4-6 — enforced
[PR-047]: Sub-agent timeouts: 120s single pass, 280s 4-6 searches, split 7+
[other applicable HIGH rules]
```

**RULES APPLIED — mark as tasks complete:**
```
[ ] LAW-1: Humanization applied to all output
[ ] LAW-5: No unverified figures used
[ ] LAW-6: No credentials in any output
[ ] LAW-7: Quality gatekeeper confirmed (⚙️ Gatekeeper ✅)
[ ] PR-044: Zero-bypass gate — no deliverable without gate
[ ] [other rules loaded — confirm applied]
```

---

## Handoff Notes
Everything a fresh session needs to know that isn't obvious from the steps above. Edge cases, gotchas, decisions that were considered and rejected, quirks of the codebase, credentials needed (reference only — never write credentials here).

---

## Output Gate
_Mandatory. Spawn a quality-gatekeeper sub-agent in OUTPUT REVIEW mode before delivering anything to Kelly. Delivery does NOT happen until this gate is APPROVED._

**Status:** ⏳ PENDING | ✅ APPROVED | ❌ NEEDS REVISION
**Critic session key:** [session key from sessions_spawn]
**Date reviewed:** YYYY-MM-DD HH:MM
**Issues found:** [none | list issues and fixes applied]
**Notes:** [any context on the review]
