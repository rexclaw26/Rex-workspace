# TASK-010 — Phase 1 Rules System Review

**Status:** planned — waiting on trigger
**Owner:** Rex
**Priority:** medium
**Created:** 2026-03-26
**Trigger conditions (any one fires the review):**

---

## Trigger Conditions

This review fires when **ANY** of the following occur first:

| Trigger | Condition | Status |
|---------|-----------|--------|
| Date trigger | April 9, 2026 | ⏳ Pending |
| Task-count trigger | 8 HIGH/CRITICAL tasks completed under new system | ⏳ Count: 0/8 |
| Monday Scorecard verdict | Phase 1 flagged as ineffective | Reviewed each Monday |

---

## Review Criteria

When triggered, assess:

1. **Coverage:** Did Rex populate Critical Rules Snapshot on all HIGH/CRITICAL tasks since March 26?
2. **Utility:** Did Prior Context catch anything useful (prior decisions, blocked approaches, relevant history)?
3. **Error prevention:** Did the rules system catch or prevent any errors? (check error journal)
4. **Friction:** Did any task get blocked or slowed down by the rules system?
5. **Gaps:** Any rules that felt unnecessary or wrong for their task types?

**Metrics to count at review time:**
- HIGH/CRITICAL tasks completed since 2026-03-26
- Tasks where Critical Rules Snapshot was populated
- Tasks where Prior Context found relevant history
- Errors caught by the rules system

---

## Possible Outcomes

| Outcome | Action |
|---------|--------|
| Working well | Proceed to Phase 2 (completion gate) |
| Minor adjustments needed | Tweak Phase 1, stay in Phase 1 |
| Not working | Retire the system, revert to status quo |
| Phase 2 warranted | Propose Phase 2 + 3 implementation plan |

---

## Current State

**As of 2026-03-26 22:21 PDT:**
- What's done: Phase 1 built (rule-index.md, Critical Rules Snapshot, Prior Context, maintenance protocol)
- What's in progress: Watching for trigger conditions
- What's next: Wait for any trigger to fire
- Triggers: ⏳ 0/8 tasks | April 9 | Monday Scorecard

---

## Handoff Notes
- TASK-007 and TASK-009 are the first tasks running under the new system — they're the primary observation targets
- The Monday Scorecard review (Section 3 in the scorecard) is the most reliable trigger — fires every Monday regardless of task count
- Phase 2 = pre-completion gate (Rex must confirm all Critical Rules applied before reporting task complete)
- Phase 3 = rule subdivision (break HIGH rules into sub-categories for more targeted loading)
