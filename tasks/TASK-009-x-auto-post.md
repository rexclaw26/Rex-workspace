# TASK LOCK — READY POST: X Content Queue System

**ID:** TASK-009
**Status:** active — building
**Created:** 2026-03-26 13:48 PST
**Last updated:** 2026-03-27 08:12 PST
**Owner:** Rex
**Priority:** high

---

## Objective
Build an automated X content generation system with a "READY POST" page on Mission Control. Rex generates posts on a schedule using the X Feed + market data + scoring engine. Kelly reviews the queue and manually posts what he wants. No X API key needed.

---

## Architecture (Revised 2026-03-27)

### What We Are NOT Building (vs original plan)
- ~~Railway x-poster-worker~~ — skipped
- ~~Redis~~ — skipped
- ~~X API key + auto-posting~~ — skipped
- ~~FRED API key for now~~ — deferred

### What We ARE Building
1. **READY POST page** on Mission Control (`/ready-posts`)
2. **Convex table** `xPostQueue` — stores generated posts with status
3. **OpenClaw cron jobs** — trigger post generation on schedule
4. **Scoring engine** — uses existing X Feed data + market data to score stories
5. **Post generation** — LLM generates content in Discover Crypto voice

### Generation Schedule
- **4:30 AM – 11:00 PM PT:** Every 20 minutes (OpenClaw cron job)
- **11:00 PM – 4:30 AM PT:** Every 60 minutes (OpenClaw cron job)
- Kelly opens `/ready-posts` anytime and scrolls through the queue

### Post Status Flow
```
GENERATED → READY (in queue) → COPIED (Kelly copied, about to post) → POSTED (Kelly confirmed)
```

---

## What We Keep From the Original Plan

### Scoring Engine (unchanged)
| Signal | Source | Weight |
|---|---|---|
| Source authority | Hardcoded tier whitelist | 40% |
| Velocity | Same story on 3+ monitored accounts in 15 min | 25% |
| Market impact | Price correlation from /api/prices | 20% |
| Novelty | Hash dedup vs last 4h of posts | 15% |

### Source Authority Tiers (unchanged)
| Tier | Examples | Auto-post eligible? |
|---|---|---|
| 1 — Wire | Reuters, Bloomberg, AP, WSJ | Yes |
| 2 — Crypto Tier-1 | CoinDesk, The Block, Decrypt, Cointelegraph, @coinbureau, @kobeissiletter, @BullTheoryio | Yes |
| 3 — Institutional | BlackRock, SEC, Fed Reserve, Fidelity | Yes |
| 4 — Influencer | Saylor, Raoul Pal | Needs corroboration |
| 5 — Community | General crypto accounts | Hold for review |

### Post Formats (unchanged)
| Format | When | Example |
|---|---|---|
| **BREAKING:** | Confirmed event — SEC filing, official announcement | "BREAKING: SEC approves spot Bitcoin ETF options" |
| **JUST IN:** | First-wave from tier-1 outlets | "JUST IN: BlackRock's IBIT records largest single-day inflow" |
| **DATA:** | On-chain data, ETF flows, stats | "BTC exchange outflows hit a 3-year high" |
| **WATCHING:** | Developing story, not yet confirmed | "WATCHING: Senate vote on Clarity Act scheduled Thursday" |
| **SIGNAL:** | On-chain: whale moves, exchange flows, funding rates | "SIGNAL: Exchange BTC reserves at 4-year low" |
| **THREAD:** | Legislation mechanics, ETF deep dives | Multi-tweet explainer |

### Humanization Rules (non-negotiable)
- Zero em dashes
- Use contractions naturally
- Hook in first 5 words: lead with number, dollar amount, %, or named entity
- 220 char cap on news posts
- One emoji max, front-loaded
- Zero hashtags on BREAKING:, one max on THREAD:/SIGNAL:

### Topic Ratio (rolling 24h)
- Bitcoin + macro: 35%
- Altcoins: 30%
- Legislation + ETFs + institutional: 25%
- On-chain/data signals: 10%

---

## READY POST Page Spec

### Location
`/ready-posts` tab in Mission Control (adds to existing X Feed tab)

### Convex Table: `xPostQueue`
```typescript
{
  _id: string,           // Convex generated
  content: string,       // The post text (220 char cap applied)
  format: "BREAKING" | "JUST IN" | "DATA" | "WATCHING" | "SIGNAL" | "THREAD",
  category: "btcEth" | "macro" | "altcoins" | "legislation" | "onchain",
  score: number,         // 0-100 from scoring engine
  status: "ready" | "copied" | "posted",  // default: "ready"
  sourceAuthor?: string, // @handle if from X Feed
  sourceUrl?: string,    // Link to source
  createdAt: number,     // timestamp ms
  postedAt?: number,     // when Kelly marked posted
}
```

### UI Layout
```
[READY POSTS]  [GENERATE NOW]  ← header
─────────────────────────────────
Filter: [ALL] [READY] [COPIED] [POSTED]
─────────────────────────────────
[POST CARD]
Format badge: BREAKING
Content: "BTC exchange outflows hit a 3-year high as..."
Source: @coinbureau · 14m ago
Score: 78
─────────────────────────────────
[COPY] [MARK COPIED] [MARK POSTED] [DELETE]
```

### Buttons
- **COPY:** Copies content to clipboard, auto-marks as COPIED
- **MARK COPIED:** Mark as COPIED (already copied manually)
- **MARK POSTED:** Mark as POSTED (Kelly posted to X)
- **DELETE:** Remove from queue

### Filter States
- **ALL:** Everything in queue
- **READY:** Status = ready, sorted by score descending
- **COPIED:** Kelly has copied, may be actively posting
- **POSTED:** History of posted content (can filter by date)

---

## Data Sources for Generation

### Primary Sources (already live)
- **X Feed (Railway RSS adapter):** `https://feed-adapter-production.up.railway.app/rss`
  - 44 X accounts, categorized: btcEth / macro / altcoins
  - Pulled via `/api/x-feed` on Mission Control
- **DC Hub market data:** `/api/marketnotes`, `/api/prices`
- **Market Pulse:** `/api/market-pulse`

### Generation Logic
1. Cron fires every 20 min (4:30 AM – 11 PM PT)
2. Fetch latest X Feed data (categories: btcEth, macro, altcoins)
3. Fetch latest market data
4. For each category, score top 3 stories using scoring engine
5. If score >= threshold (TBD, probably 60): generate post
6. Save to Convex `xPostQueue`
7. Do NOT post to X — queue for Kelly to review

### Cadence Rules
- 4:30 AM – 11 PM PT: generate every 20 min
- 11 PM – 4:30 AM PT: generate every 60 min
- 12-15 posts/day target
- Min 25-min gap between posts in queue
- Same-topic dedup: don't add same format + same source URL within 4h

---

## OpenClaw Cron Setup

```javascript
// .openclaw.json cron section
{
  "name": "x-post-generation",
  "when": "0 11-22,4-10 * * *",  // 4:30 AM to 11 PM PT every 20 min via wrapper
  "timezone": "America/Los_Angeles",
  "task": "generate-x-posts"
}
```

Actually: OpenClaw cron minimum is every 15 min. 20-min cadence achieved via:
- Cron fires every 15 min
- Internal check: only generates if 20+ min since last generation (tracked in Convex)

---

## Execution Plan

- [ ] Step 1: Create Convex table `xPostQueue`
- [ ] Step 2: Build `/ready-posts` page UI (filters, post cards, COPY button)
- [ ] Step 3: Wire up COPY to clipboard + status transitions
- [ ] Step 4: Build post generation script (X Feed → score → generate → save)
- [ ] Step 5: Add OpenClaw cron jobs (every-15-min wrapper with 20-min check)
- [ ] Step 6: Add "GENERATE NOW" button on page
- [ ] Step 7: Test end-to-end
- [ ] Step 8: Tune scoring threshold

---

## Blocking Items
- None — everything needed is already live

## Pending (Deferred)
- FRED API integration (Phase 2)
- SEC EDGAR RSS, Farside, SoSoValue (Phase 2)
- Breaking news fast lane (2-min poll) (Phase 2)

---

## Files
| Path | Role |
|---|---|
| `mission-control/app/ready-posts/page.tsx` | New page |
| `mission-control/convex/xPostQueue.ts` | Convex table schema |
| `mission-control/app/api/generate-x-posts/route.ts` | Generation API |
| `memory/hit-network-ops.md` | Full plan + source tiers + formats |

---

## Handoff Notes
- No X API key needed — Kelly posts manually
- Queue never auto-posts — always Kelly's choice
- DC Hub X Feed is the primary data source (44 accounts, already categorized)
- Generation is LLM (minimax) — copy generation only, ~500 calls/mo ≈ $3-5
- Cron runs via OpenClaw, not Railway
