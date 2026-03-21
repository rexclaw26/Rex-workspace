# TASK LOCK — Calendar Focus Bug Fix (DayPanel)

**ID:** TASK-002
**Status:** blocked → ready to execute (no external dependency)
**Created:** 2026-03-07 08:00 PST
**Last updated:** 2026-03-07 09:45 PST
**Owner:** Rex
**Priority:** medium

---

## Objective
Fix the cursor-stealing bug on the Calendar page: typing in the email invite field causes the cursor to jump back to the task name field. Extract `DayPanel` (and `UpcomingPanel` if needed) as top-level components outside of `CalendarPage` to eliminate the remount-on-render cycle.

---

## Full Specification

### The Bug
On the Calendar page, when creating a new task:
1. User types in the TASK NAME field (autoFocus is set)
2. User tabs or clicks to EMAIL INVITE field
3. User starts typing — cursor jumps back to TASK NAME field

### Root Cause (confirmed)
`DayPanel` is defined **inside** `CalendarPage` as an inner function component. Every time `formData` state updates (on each keystroke), React re-renders `CalendarPage`, which re-evaluates the function body, and creates a brand-new `DayPanel` component reference. React sees a different component identity → unmounts the old `DayPanel` → mounts the new one → `autoFocus` on the title field fires again → cursor stolen.

This is a standard React "component defined inside render" anti-pattern.

### The Fix
Move `DayPanel` (and `UpcomingPanel` if it has the same pattern) OUT of `CalendarPage` to the module top level. Pass all required values as explicit props instead of closing over them.

### File to Edit
`/Users/rex/.openclaw/workspace/mission-control/app/calendar/page.tsx`
~625 lines total

### Steps
1. Read full file at offset 1 to understand all closures DayPanel uses
2. Identify every variable, state, and callback DayPanel closes over from CalendarPage
3. Extract DayPanel as a top-level `const DayPanel = React.memo(({ prop1, prop2, ... }: DayPanelProps) => {...})` above CalendarPage
4. Define a `DayPanelProps` interface with explicit types for each prop
5. Do the same audit for UpcomingPanel — extract if it has the same issue
6. Update CalendarPage to pass all required props down
7. Run `npx tsc --noEmit` from mission-control/ to confirm zero errors
8. Verify: typing in email invite field no longer steals cursor

### What DayPanel is known to close over (pre-read estimate — verify in file)
- `selectedDay` (Date state)
- `dayTasks` (derived/filtered tasks array)
- `formOpen` (boolean state)
- `formData` (object state — the one causing the issue)
- `setFormOpen` (setter)
- `setFormData` (setter)
- `handleCreateTask` (callback / Convex mutation call)
- Possibly `createTask` mutation ref

---

## Locked Decisions

| Decision | Choice Made | Rationale |
|----------|-------------|-----------|
| Fix approach | Extract to top-level component | Cleanest fix; React.memo alone doesn't help since the component identity itself changes |
| React.memo | Use on extracted component | Prevents unnecessary re-renders even after extraction |

---

## Execution Plan

- [x] Step 1 — Diagnose root cause (done)
- [x] Step 2 — Confirm fix approach: extract DayPanel to top level
- [ ] Step 3 — Read full calendar/page.tsx to map all closures
- [ ] Step 4 — Extract DayPanel with explicit props + interface
- [ ] Step 5 — Extract UpcomingPanel if same pattern
- [ ] Step 6 — Update CalendarPage to pass props
- [ ] Step 7 — TypeScript check (zero errors)
- [ ] Step 8 — Confirm bug is fixed

---

## Files

| File Path | Status | Role |
|-----------|--------|------|
| mission-control/app/calendar/page.tsx | exists (~625 lines, needs edit) | The file to fix |

---

## Sub-Agents
None needed — single-file targeted refactor.

---

## Current State

**As of 2026-03-07 09:45 PST:**
- Done: Root cause diagnosed, fix approach confirmed
- In progress: Nothing — task is queued behind TASK-001
- Next: Read full calendar/page.tsx → extract DayPanel
- Blockers: None — can execute any time, just deprioritized behind slide redesign

---

## Handoff Notes
- This is a React component extraction refactor, not a logic change. The form, the Convex mutations, the UI — all stay exactly the same. Only the component's location in the file changes.
- The key signal that it's fixed: typing in the email invite field should NOT cause the cursor to jump to the task name field.
- Do NOT use `useRef` to track focus as a workaround — that's a band-aid. The real fix is extracting the component.
- If `UpcomingPanel` is also defined inside `CalendarPage`, it should be extracted too even if it doesn't have the autoFocus issue, to prevent future bugs.
