# TASK LOCK — Automated X Posting System (Phase 1)

**ID:** TASK-009
**Status:** planned — waiting on Kelly for API keys
**Created:** 2026-03-26 13:48 PST
**Owner:** Rex
**Priority:** high

---

## Objective
Build an automated X content pipeline that:
1. Monitors X feed from 44 accounts for macro/crypto signals
2. Cross-references with FRED API for macro data verification
3. Scores and filters stories automatically
4. Generates and posts content in Discover Crypto voice (humanized)
5. Runs on Railway with Redis for state management

---

## What Was Decided (2026-03-26 Session)

### Architecture
- Railway `x-poster-worker` service, always-on, 15-min polling
- Breaking news fast lane: 2-min poll, fires only on 3+ source velocity spike
- Redis for: seen-hash dedup store, post counter, rate limit tracking
- LLM (minimax): copy generation only, NOT classification
- Kelly provides: X account post-only API key + FRED API key

### Scoring
- Source authority (40%) + velocity (25%) + market impact (20%) + novelty (15%)
- Urgency multiplier: base × (1 + abs(price_change% / 5))
- BREAKING: requires 2 independent signals (source tier + velocity OR price correlation)

### Source Authority Tiers
| Tier | Examples |
|---|---|
| 1 — Wire | Reuters, Bloomberg, AP, WSJ |
| 2 — Crypto Tier-1 | CoinDesk, The Block, Decrypt, Cointelegraph, @coinbureau, @kobeissiletter, @BullTheoryio |
| 3 — Institutional X | BlackRock, SEC, Fed, Fidelity |
| 4 — Influencer | Saylor, Raoul Pal (500K+) |
| 5 — Community | General accounts |

### Post Formats (6)
- **BREAKING:** — confirmed events only (SEC filing, official announcement, on-chain confirmation)
- **JUST IN:** — first-wave from tier-1 outlets
- **CHART:** or **NUMBER:** — on-chain data, ETF flows, stats (replaces weak "DATA:")
- **WATCHING:** — developing story not yet confirmed (not "WATCH:")
- **SIGNAL:** — whale moves, exchange flows, funding rates
- **THREAD 🧵** — legislation, ETF mechanics, macro deep dives

### Cadence
- 12-15 posts/day
- 4:30 AM–11 PM PST window
- Deprioritize 1–4 AM unless major breaking
- Minimum 25-min gaps
- Topic ratio: BTC/macro 35% | Alts 30% | Legislation/ETF 25% | On-chain 10%

### Humanization Rules (non-negotiable)
- Zero em dashes
- Contractions
- Hook in first 5 words: number, dollar amount, percentage, or named entity
- Succinct, no filler, no corporate tone

### Macro Trigger Architecture
X feed from 44 accounts → primary trigger for macro topics.
Cross-reference with FRED API → verify exact number.
Rewrite in Discover Crypto voice → post.

### Data Sources to Add
1. FRED API (free) — CPI, PPI, jobs, Fed Funds Rate, Treasury yields
2. Farside Investors (free) — daily BTC/ETH ETF inflows/outflows
3. SoSoValue (free) — structured ETF flow data
4. SEC EDGAR RSS (free) — 8-K, 13-F for MSTR, BlackRock, Fidelity
5. Congress.gov RSS (free) — Clarity Act, FIT21, stablecoin bills

### Risk Kill Switches
1. High velocity + low authority → hold for human review
2. 3 consecutive same-topic posts → pause + flag Kelly
3. BTC >5% move in 1hr → suspend CHART:/NUMBER: posts
4. No posts in 6hrs during market hours → Telegram alert
5. Price data >15 min stale → reject price-correlated posts

---

## Pending From Kelly
- [x] ~~FRED API key~~ — received and verified ([REDACTED-FRED-KEY]), stored in tasks/TASK-009-api-keys.md
- [ ] X account post-only API key

---

## Phase 1 Checklist (After Keys Received)
- [x] ~~Verify FRED API key works~~ — confirmed 2026-03-26, latest CPI returned
- [ ] Verify X API key post-only access
- [ ] Add FRED API key to Railway env vars (FRED_API_KEY)
- [ ] Add FRED macro data to DC Data Hub pipeline
- [ ] Add Farside ETF flow data
- [ ] Add SEC EDGAR RSS feed
- [ ] Deploy x-poster-worker skeleton to Railway
- [ ] Set up Redis
- [ ] Build scoring engine
- [ ] Configure posting formats + humanization prompts
- [ ] Connect X API for posting
- [ ] Configure dead man's switch (Telegram alert)
- [ ] Test with human-in-loop mode before going fully automated

---

## Cost
~$18-25/mo incremental (Railway worker $5-10 + Redis $10 + LLM $3-5)

## Skills
- `x-post-automator` (existing) — manual drafting
- `humanization-voice/SKILL.md` — applies to all posts
- New automated pipeline skill to be built

## Docs / Memory
- Full plan in: `memory/hit-network-ops.md` — "Automated X Posting System (In Progress)"
