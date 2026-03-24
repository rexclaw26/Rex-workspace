# Nightly Mission Control Proposals Log
_Rolling log — newest first. Updated nightly by nightly-mc-review skill._
_Status values: PROPOSED / APPROVED / BUILDING / COMPLETE_

---

## 2026-03-23 — Session Handoff Auto-Loader
Status: PROPOSED
Critic verdict: APPROVED
Notes: Complexity 2/5. Reads session-handoff.md on dashboard load, renders as dismissible banner. No new Rex behaviors required — handoff file already written at session end per protocol. Build this first.

## 2026-03-23 — Stall Detection + Alerts
Status: PROPOSED
Critic verdict: APPROVED
Notes: Complexity 2/5. Convex scheduled function compares task updatedAt timestamps; flags tasks stalled 48h+. Make threshold configurable. Low false-positive risk since task updates are consistent.

## 2026-03-23 — Daily Decision Queue
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES
Notes: Start with file-based version (memory/daily-decisions.md written by Rex at session end, rendered by dashboard widget). Upgrade to Convex-backed queue with mutations after workflow is proven. Complexity 3/5 for full version, 1/5 for file-based MVP.

<!-- New proposals are prepended above this line -->
