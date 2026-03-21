# TASK LOCK — X Feed RSS Infrastructure (Railway Expansion)

**ID:** TASK-003
**Status:** planned — waiting on Kelly checklist
**Created:** 2026-03-07 09:45 PST
**Last updated:** 2026-03-07 09:45 PST
**Owner:** Rex
**Priority:** medium

---

## Objective
Expand the Railway RSS adapter to pull from a broader set of X accounts (configured by Kelly), tune relevance scoring for social post format, and document the endpoint for all Hit Network agents to use.

---

## Full Specification

### Existing Infrastructure (already live)
- Railway service: `https://feed-adapter-production.up.railway.app/rss`
- 44 X accounts currently monitored, 356 tweets cached
- Bearer Token: saved by Kelly as Railway env var (NOT in any Rex file — LAW 6)
- X API Basic: $100/mo, Invoice 4GWZSREZ-0001, Mar 6 2026, card ****7317
- Mission Control X Feed page pulls from this endpoint already

### What Still Needs Doing
From the original build plan in MEMORY.md:
1. Kelly to provide updated list of X accounts to monitor (current 44 may not be final)
2. Tune relevance scoring for social post content (shorter format vs. news articles)
3. Team access documentation — update Writer/Monitor/Analyst skills with endpoint
4. Load X API credits ($20–50 starting balance) — confirm billing active

### Kelly's Pending Checklist (blocking)
- [x] X account list confirmed — 44 accounts live in x-rss-adapter/server.js and deployed on Railway
- [ ] Kelly confirms X API credits loaded / billing active (still unconfirmed)

### Railway Service Files
Location: separate Railway-deployed repo (not in mission-control/)
Architecture: Node.js RSS adapter → Bearer Token auth → X API v2 → RSS XML → Convex headlines pipeline

---

## Locked Decisions

| Decision | Choice Made | Rationale |
|----------|-------------|-----------|
| X API route | Official X API Basic ($100/mo) | No ToS risk, no auth cookie maintenance, reliable |
| Hosting | Railway.app Pro | Kelly already subscribed — zero extra hosting cost |
| Auth | Bearer Token (no X account login) | Reads public tweets without any X account |
| DeFi tweets | Go in Altcoins column | Consistent categorization rule |

---

## Execution Plan

- [x] Step 1 — Railway service deployed and live
- [x] Step 2 — X API Basic subscription active ($100/mo)
- [x] Step 3 — Mission Control X Feed page built and working
- [x] Step 4 — X account list confirmed (44 accounts in server.js, live on Railway)
- [x] Step 5 — Railway service already running with this account list
- [ ] Step 6 — Tune relevance scoring for short social post format
- [ ] Step 7 — Document endpoint in Writer/Monitor/Analyst skills
- [ ] Step 8 — Confirm X API credits loaded / billing active

---

## Files

| File Path | Status | Role |
|-----------|--------|------|
| mission-control/app/x-feed/page.tsx | exists | X Feed Mission Control page |
| mission-control/app/api/x-feed/route.ts | exists | Fetches Railway RSS, categorizes |
| Railway service | deployed at feed-adapter-production.up.railway.app | RSS adapter (separate repo) |

---

## Sub-Agents
None spawned yet.

---

## Current State

**As of 2026-03-07 09:45 PST:**
- Done: Infrastructure live, X Feed page working, API active
- In progress: Nothing — waiting on Kelly checklist items
- Next: Kelly provides X account list → update Railway config
- Blockers: X API billing confirmation still needed from Kelly (account list already live)

---

## Handoff Notes
- Bearer Token is a Railway env var — never ask Rex to read or store it. Reference only.
- The Railway service is always-on — it will continue serving the current 44-account list until updated.
- Billing note: X API Basic is $100/mo flat. No per-call charges at Basic tier within rate limits.
- Kelly's pending action: load $20–50 X API credits and confirm billing active (separate from subscription).
