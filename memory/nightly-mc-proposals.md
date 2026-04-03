# Nightly MC Review — Proposal Log

## 2026-04-02 — Session Cold-Start Card
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES — Complexity 3. Use Next.js Server Action (not Convex) to read task lock files and memory files directly on page load. Skip 6:55 AM pre-compute cron — file reads are sub-100ms and the cron adds a silently-failing moving part. Risk: Convex-filesystem sync lag would serve stale data; Server Action approach eliminates this entirely.
Notes: Addresses #1 daily friction (cold-start manual read chain). SE + PM + UX all independently flagged this. Build DashboardSessionBrief component with Server Action data fetch. Simple collapsible card — no sync layer needed.

## 2026-04-02 — Attention Zone + Nav Badges
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES — Complexity 3. Ship nav sidebar badges first (v1) — eliminates "visit every page" problem with 40% of the effort. Add AttentionZone banner in v2 once threshold tuning is validated. Risk: permanent yellow noise if 24h/2min thresholds aren't tuned from real data. Wire thresholds as Convex env vars, not hardcoded. Null-safe fallback required for existing cards missing last_moved.
Notes: Three moving pieces: schema migration (add last_moved to tasks), aggregation query, two UI components. Nav badges alone are a fast, high-value v1.

## 2026-04-02 — Daily ROI Scorecard Widget
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES — Complexity 3. Skip external API integrations (YouTube, X, GA) in v1. Ship spend tracking + cost-per-deliverable first (pure Convex data). Add "Rex's pick" manual field for the leverage recommendation. Risk: widget ignored within 2 weeks if engagement data isn't consistently logged. Design performance log table with generic engagement_score float so any source feeds same field without future schema changes.
Notes: Biz + UX + PM all independently identified ROI visibility gap. Addresses #3 strategic friction. Architecture is correct — decouple data ingestion from display layer from day one.

---

## Pipeline Run Notes — 2026-04-02

**Pre-flight:** system-map.md 3 days old ✅ | ROUTING.md 2 days old ✅ — both fresh
**Assessment agents:** 4/4 completed (all within 48s)
- Systems Engineer: ✅ Full results — Agent Heartbeat Panel, Session Cold-Start Injector
- Project Manager: ✅ Full results — Stream Status Board, Session Handoff Card
- UX Designer: ✅ Full results — Morning Triage Card, Time-In-Stage Heatmap
- Business Consultant: ✅ Full results — Revenue Attribution Layer, Daily ROI Scorecard
**Critic agents:** 3/3 completed — all APPROVED WITH CHANGES
**Telegram report:** sent to 1011362712
**Recommended to build first:** Proposal 1 (Session Cold-Start Card) — broadest cross-agent consensus, solves #1 daily friction, simplest correct implementation


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

## 2026-03-30 — Morning Briefing Panel
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES — fix mutation→Action for external API calls; skip headlines in v1
Notes: Critic flagged mutation vs Action distinction. Simpler v1: local Convex data only (tasks, errors, spend delta). Headlines add external complexity.

## 2026-03-30 — Session Handoff Panel
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES — complexity 2; nail Rex write trigger before building; drop inline editing from v1
Notes: Simplest proposal. Schema foundation for Proposal 3 also. Requires LAW 2 enforcement at session end.

## 2026-04-01 — Session Handoff Card
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES — Complexity 2. Skip Session Open modal; build Phase 1 as collapsible section on existing Dashboard. Risk: session detection misfires on page refresh — simpler inline approach avoids this entirely. Build lastSessionClosed field for future stall detection.

## 2026-04-01 — Morning Brief Card
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES — Complexity 3. Ship Phase 1 with blocked tasks + agent failures only (both Convex-native). Hold calendar + headlines until those integrations confirmed live. Risk: incomplete card looks complete → bad morning decisions. Phase 1 eliminates this.

## 2026-04-01 — Revenue Attribution Layer
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES — Complexity 3. Verify per-task AI cost tracking exists in Convex before building. Phase 1: manual revenue entries + total AI spend, no GA API, no per-task linking. GA integration and attribution logic in Phase 2.

## 2026-03-30 — Impact-Weighted Task Queue
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES — complexity 2; lastActivityAt must be server-side auto-update; ship stalled detector first
Notes: Requires stable schema from Proposal 2's handoff schema work as foundation. Stalled Tasks widget is standalone v1 deliverable.

## 2026-04-01 EVENING — Agent Heartbeat + SLA Monitor
Status: PROPOSED
Critic verdict: NOT REVIEWED (evening pipeline critics didn't fire)
Notes: SysEng finding — agents have no timestamped health signal. Ping every 60s to agent_heartbeats table, flag >2min silent as STUCK. Reactive stuck-agent discovery → proactive instant visibility. Requires agent instrumentation (Rex writes ping).

## 2026-04-01 EVENING — Task-Agent Junction Table
Status: PROPOSED
Critic verdict: NOT REVIEWED
Notes: SysEng finding — link task records to sub-agent session ID with partial completion %, checkpoint notes, resumption state. Failed sub-agent can be re-spawned from MC with full context. High value for long-running multi-step builds.

## 2026-04-01 EVENING — AI Spend Burn Sparkline
Status: PROPOSED
Critic verdict: NOT REVIEWED
Notes: UX finding — replace static AI spend total with 7-day daily cost sparkline on Dashboard. Trivial to build (Convex query + Recharts), immediately actionable. Lightweight version of Revenue Attribution Layer.

## 2026-04-01 EVENING — Daily Signal Score
Status: PROPOSED
Critic verdict: NOT REVIEWED
Notes: Biz finding — top-of-dashboard widget auto-computing 3 highest-ROI moves Kelly should make today from content gaps + sponsor staleness + trending signals. Pre-decides where to point agent work. AI-powered prioritization layer on top of MC.
