# Nightly MC Review — Proposal Log

## [2026-03-27] — Session Handoff Panel
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES
Notes: Convex side ~30min build. Real work is enforcing the session-end write via an observable event (command or cron), not a soft behavioral instruction. Use /handoff command or memory-checkpoint cron as trigger. Skip soft "before closing context" wording.

## [2026-03-27] — Impact Score + Priority Queue
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES
Notes: Phase 1 = simple priority enum (High/Medium/Low) + deadline field only. Full scoring formula layers in after input habit is established. Wire score recompute as async scheduled mutation, not inline action. Optional inputs in Phase 1 to avoid adoption friction.

## [2026-03-27] — Agent Heartbeat Ledger
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES
Notes: Use lifecycle events (spawn/done/failed logged from main agent) not in-process heartbeat loops. Avoids false-positive STUCK alerts. Zero subagent instrumentation needed. TTL for STUCK flag: 10 min. Dashboard cards reactive via useQuery.

## [2026-03-26] — Task Impact Ledger
Status: PROPOSED
Critic verdict: PENDING
Notes: Addresses Business Consultant's finding that tasks have no revenue/outcome linkage. PM also flagged no momentum tracking — this bridges both. 2 of 4 assessment agents completed fully initially; SE and UX timed out (later returned).

## [2026-03-26] — Handoff Dashboard Widget
Status: PROPOSED
Critic verdict: PENDING
Notes: Session-handoff.md is written but never surfaced in MC. PM identified this as a core friction — Kelly has to navigate to a file instead of seeing state on the dashboard. Simple widget on the Dashboard page.

## [2026-03-26] — Spend Pacing & ROI Tracker
Status: PROPOSED
Critic verdict: PENDING
Notes: BC flagged that spend tracking is backward-looking with no budget pacing or per-skill ROI. This adds forward-looking alerts and cost-to-outcome ratios to the existing spend dashboard.

## [2026-03-26] — Agent Pulse Board
Status: PROPOSED
Critic verdict: PENDING
Notes: SE identified no persistent agent heartbeat — can't distinguish idle vs. stuck vs. failed. Real-time Convex-backed heartbeat table (agent writes status every 30s) with auto-alert on 3 missed beats. UX independently flagged need for state-first swimlane layout. Directly addresses "is it running or dead?" blind spot.

## [2026-03-26] — Session Resume Packets + Handoff Widget
Status: PROPOSED (TOP PRIORITY — upgraded after full 4-agent synthesis)
Critic verdict: PENDING
Notes: SE found task handoff is not machine-readable — no "resume packet" per task written to Convex. PM independently found no session-to-session handoff layer. UX proposed Morning Briefing Card. All 3 point to same gap. Combines into: structured JSON blob at task suspension → Dashboard "Pick up where you left off" panel. Broadest cross-agent consensus.

## [2026-03-26] — Revenue Impact Scorecard + Capacity Allocation Breakdown
Status: PROPOSED
Critic verdict: PENDING
Notes: BC found zero output-side metrics — can't calculate ROI. Capacity Allocation Breakdown (donut chart: revenue ops vs. overhead vs. R&D) + Revenue Impact Scorecard (tasks → downstream signals) turn MC from cost tracker to ROI dashboard.

---

## Pipeline Run Notes — 2026-03-26

**Assessment agents:** 4 spawned
- Business Consultant: ✅ Full results (44s)
- Project Manager: ✅ Full results
- UX Designer: ⏰ TIMED OUT initially, ✅ returned late (full findings received)
- Systems Engineer: ⏰ TIMED OUT initially, ✅ returned late (full findings received)

**All 4 agents eventually reported back.** Original Telegram report sent with 2/4 agents' data. Addendum compiled (Telegram delivery failed on first attempt).

**Critic agents:** Not run

**Telegram reports:** Initial report ✅ sent. Addendum delivery failed (to retry).

**TOP PRIORITY:** Session Resume Packets + Handoff Widget — broadest cross-agent consensus (SE + PM + UX all flagged cold-start context loss independently), addresses #1 daily friction.
