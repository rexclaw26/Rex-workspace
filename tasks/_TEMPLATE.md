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

## Execution Plan
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

---

## Current State
_Update this section every time you touch this task._

**As of [date time]:**
- What's done: [...]
- What's in progress: [...]
- What's next: [single next action]
- Blockers: [none / describe]

---

## Handoff Notes
Everything a fresh session needs to know that isn't obvious from the steps above. Edge cases, gotchas, decisions that were considered and rejected, quirks of the codebase, credentials needed (reference only — never write credentials here).
