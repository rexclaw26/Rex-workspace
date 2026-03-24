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

## 2026-03-24 — Session Warm-Start System
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES
Notes: Complexity 2/5. Convex `sessionHandoff` table + Dashboard card. Single point of failure is Rex's session-close write — add isStale/TTL check. Simpler v1: flat JSON file via Next.js API route. Use generic `agentState` table with key field.

## 2026-03-24 — Live Agent Heartbeat Monitor
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES
Notes: Complexity 3/5. Skip 30s polling loop — write START on spawn + COMPLETE/FAILED on finish, flag no-COMPLETE after 5min as FAILED. Must define HTTP mutation integration point first. Convex table + useQuery subscription + badge UI is clean 2-3hr build.

## 2026-03-24 — Unified Cost + Impact Ledger
Status: PROPOSED
Critic verdict: APPROVED WITH CHANGES
Notes: Complexity 3/5. Define measuredImpact as concrete numeric type per category before writing schema. Build table + manual-entry panel first (2-3 weeks baseline), then add automated ROI scorecard. "Double down/cut" tags advisory-only until 4+ weeks of clean data.

<!-- New proposals are prepended above this line -->
