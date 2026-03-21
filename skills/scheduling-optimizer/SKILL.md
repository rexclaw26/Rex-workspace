---
name: scheduling-optimizer
description: Scheduling optimizer for Rex. Handles calendar analysis, meeting prep, time-block optimization, and scheduling coordination for Kelly at Hit Network. Trigger on calendar review requests, scheduling requests, "optimize my schedule", meeting prep, agenda generation, or post-meeting follow-ups. Proposes time options and drafts invites but never confirms meetings without human approval.
---

# Scheduling Optimizer

**Trigger:** Calendar review, scheduling request, "optimize my schedule," meeting prep.

---

## 1. Calendar Analysis

Review upcoming schedule and deliver:
- Today's agenda with time blocks and preparation notes
- Conflicts or back-to-back meetings that need buffer time
- Open blocks suitable for deep work vs. meetings
- Upcoming deadlines from task boards that need calendar blocks

---

## 2. Meeting Prep

Before any scheduled meeting:
- Generate agenda based on context (prior meetings, ongoing projects, pending items)
- Prepare briefing doc: attendee backgrounds, last interaction notes, open action items
- Suggest 3-5 talking points or questions

After any meeting:
- Draft follow-up email with action items and deadlines (route through email-assistant for send approval)

---

## 3. Time-Block Optimization

When asked to optimize Kelly's schedule:
- Cluster similar tasks (e.g., all calls in one block)
- Protect deep work blocks — minimum 90-minute uninterrupted windows
- Creative/strategic work → mornings
- Administrative tasks → afternoons
- Flag meetings that could be emails instead

---

## 4. Scheduling Coordination

When asked to schedule a meeting:
1. Propose 3 time options based on availability
2. Draft calendar invite with: agenda, location/link, prep materials
3. Flag timezone differences for external attendees
4. **Never confirm a meeting without explicit human approval**

**PRE-ACTION GATE — sub-agent proof required for any scheduling email going to external attendees. (PR-008)**

**For internal calendar proposals to Kelly:** Gate only, no sub-agent proof needed.
**For any email going to external attendees (invites, follow-ups, confirmations):** Sub-agent proof FIRST.

**Step 1 (external emails only):** Spawn proofreader sub-agent with the email draft + humanization rules. Wait for PASS before presenting.

**Step 2:** Show gate:
```
⚙️ OUTPUT GATE — Scheduling Optimizer
─────────────────────────────────────────────────────────
SUB-AGENT PROOF  : ✅ PASSED (external email) | N/A (internal proposal)
LAW 1 │ Humanization  : ✅ PASS — EMAIL mode for correspondence, REPORT mode for agendas
LAW 6 │ Human Approval: ⏸ HOLDING — not confirming, booking, or sending invite until Kelly approves
─────────────────────────────────────────────────────────
```
**⏸ MEETING NOT CONFIRMED. Presenting options for Kelly's selection and approval.**

---

## Humanization

Apply Humanization Framework — EMAIL mode for all calendar correspondence and scheduling communications. REPORT mode for agendas and briefing docs. Run LAW 1 verification checklist from AGENTS.md before delivering any written output.

## Anti-Hallucination

Never fabricate calendar entries or meeting details. If calendar access isn't available, say so clearly and work only from what Kelly provides.
