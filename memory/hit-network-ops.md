# Hit Network Memory — Operations & Infrastructure
**Last updated:** 2026-03-26

## ⚠️ PERMANENT RULE — Mission Control Port Protection (added 2026-03-18)

**Mission Control MUST always be running on port 3000. Non-negotiable.**

- Mission Control runs at `http://100.70.46.41:3000` (Tailscale IP, permanent)
- Port 3000 is RESERVED for Mission Control exclusively
- Any new dev server, data hub, or project **must use a different port** (3001, 3002, etc.)
- Before spawning any new dev server: check `lsof -i :3000` to confirm Mission Control is on port 3000
- Never run `npm run dev` for any non-Mission Control project without specifying an alternate port: `npm run dev -- -p 3001`
- If Mission Control goes down accidentally: `cd ~/.openclaw/workspace/mission-control && npm run dev > /tmp/mission-control.log 2>&1 &`
- Root cause of 2026-03-18 outage: dc-data-hub dev server launched without specifying port, defaulted to 3000, knocked Mission Control off

## Content Topics & Editorial Focus
*Confirmed by Kelly 2026-03-14 — bake into ALL custom skill builds*

**Brands:** Discover Crypto · Blockchain Basement

**Core content pillars:**
1. **Financial markets** — macro, equities, commodities, Fed policy, rates
2. **Artificial intelligence** — AI news, tools, intersection with crypto/finance
3. **Decentralized finance (DeFi)** — protocols, on-chain data, yield, liquidity
4. **Politics + macro financial impact** — geopolitics, sanctions, dollar dominance, war/risk-off
5. **Crypto asset legislation** — US regulatory landscape (Clarity Act, SEC, CFTC), international (FATF, EU MiCA)
6. **Institutional crypto adoption** — ETFs, corporate treasuries (MSTR, Metaplanet), sovereign adoption

**Audience:** Crypto-native to crypto-curious. Financial literacy assumed. Not beginner explainers — real analysis with real data.

**Stack:** Next.js App Router + Convex + Tailwind CSS + React
**Sites:** Discover Crypto (primary), Blockchain Basement (secondary)

## Mission Control
- **Status:** Running, Next.js + Convex
- **Price grid:** 14 assets tracked (BTC, ETH, BNB, XRP, SOL, LINK, ADA, TAO, GOLD, SILV, DXY, NVDA, COIN, MSTR)
- **Dashboard agents:** Rex · Writer · Analyst · Monitor · Builder · Closer
- **Headlines pipeline:** Daily Insight + What We're Watching (collapsible sections)
- **Market report API:** `GET /api/marketreport` — reads latest `MARKET_REPORT_YYYYMMDD.md`

## X Feed Infrastructure (Live as of 2026-03-07)
- **Railway RSS adapter:** `https://feed-adapter-production.up.railway.app/rss`
- **X API:** $100/mo Basic tier (official route, no ToS risk)
- **44 X accounts** monitored in x-rss-adapter/server.js — deployed and live
- **Mission Control page:** `http://100.70.46.41:3000/x-feed`
- **Bearer Token:** Kelly's Railway env var — never stored in Rex files (LAW 6)

## Automated X Posting System (In Progress — Session 2026-03-26)
**Full plan from 3-critic panel: social media specialist + AI systems engineer + data aggregation critic**

### Architecture
- **Run on Railway** — new service `x-poster-worker`, always-on, 15-min polling
- **Breaking news fast lane:** poll every 2 min, fires only when 3+ monitored accounts hit same topic within 10 min
- **Redis (Railway add-on ~$10/mo)** for: seen-hash store, post count tracking, rate limit counter
- **LLM use:** copy generation ONLY after scoring passes threshold. ~500 calls/mo ≈ $3-5 on minimax. Not used for classification.
- **Kelly provides:** X account API key (post-only scoped) + FRED API key

### Scoring Engine
| Signal | Source | Weight |
|---|---|---|
| Source authority | Hardcoded tier whitelist | 40% |
| Velocity | Same story on 3+ monitored accounts in 15 min | 25% |
| Market impact | Price correlation from /api/prices | 20% |
| Novelty | Hash dedup vs last 4h of posts | 15% |

**Urgency multiplier:** `base_score × (1 + abs(price_change% / 5))`

### Source Authority Tiers
| Tier | Examples | Auto-post eligible? |
|---|---|---|
| 1 — Wire | Reuters, Bloomberg, AP, WSJ | Yes, low threshold |
| 2 — Crypto Tier-1 | CoinDesk, The Block, Decrypt, Cointelegraph, **@coinbureau, @kobeissiletter, @BullTheoryio** | Yes |
| 3 — Institutional X | BlackRock, SEC, Fed Reserve, Fidelity | Yes |
| 4 — Influencer | Saylor, Raoul Pal (500K+), @cointelegraph | Needs corroboration |
| 5 — Community | General crypto accounts | Hold for review |

### Post Formats (6 Total)
| Format | When to use | Example |
|---|---|---|
| **BREAKING:** | Confirmed event only — SEC filing, official announcement, on-chain confirmation. Never price moves alone. | "BREAKING: SEC approves spot Bitcoin ETF options" |
| **JUST IN:** | First-wave from tier-1 outlets | "JUST IN: BlackRock's IBIT records largest single-day inflow" |
| **CHART:** / **NUMBER:** | On-chain data, ETF flows, stats (swap for "DATA:" — weak CTR) | "BTC exchange outflows hit a 3-year high" |
| **WATCHING:** | Developing story, not yet confirmed (swap "WATCH:" → "WATCHING:") | "WATCHING: Senate vote on Clarity Act scheduled Thursday" |
| **SIGNAL:** | On-chain: whale moves, exchange flows, funding rates | "SIGNAL: Exchange BTC reserves at 4-year low" |
| **THREAD 🧵** | Legislation mechanics, ETF deep dives, macro context. Drives saves + follows. | Multi-tweet explainer |

**Rules:** 220 char cap on news posts. One emoji max, front-loaded. Zero hashtags on BREAKING:. One max on THREAD:/SIGNAL:.

### Cadence
- **12-15 posts/day**
- **4:30 AM–11 PM PST** (Asia open through US evening)
- **Deprioritize 1–4 AM** unless genuinely breaking with major impact
- **Minimum 25-min gaps** between posts
- **Windows:** 6–8 AM (pre-market, institutional), 12–1 PM (lunch scroll), 5–7 PM (post-market), 9–11 PM (Asia)

### Topic Ratio (rolling 24h window)
- Bitcoin + macro: **35%**
- Altcoins (ETH/SOL/XRP/ADA/TAO): **30%**
- Legislation + ETFs + institutional: **25%**
- On-chain/data signals: **10%**

### Deduplication (3 layers)
1. **URL fingerprint** — never post same source URL twice
2. **Headline semantic similarity** — cosine sim >0.75 vs last 4h → skip
3. **Entity + event matching** — same entity + same event type within 3h → suppress lower-scoring dup

### Macro Trigger Architecture (Key Decision)
The X feed from 44 monitored accounts IS the macro intelligence layer. Use it as the primary trigger:
1. Monitored accounts post on CPI/PPI/jobs → X feed picks it up (velocity signal)
2. Cross-reference with FRED API → verify exact number and get official data point
3. Rewrite in Discover Crypto voice with number-led hook

This is better than polling FRED and hoping — the X accounts detect stories faster and the FRED API provides ground truth verification.

### Data Sources
**Already wired:**
- DC Data Hub `/api/headlines` — categorized news headlines
- Railway RSS adapter — 44 X accounts with engagement counts
- `/api/prices` — crypto prices (CoinGecko)
- Twelve Data API — gold/silver (Kelly confirmed already set up)

**To add (Phase 1 — mostly free):**
- FRED API (free) — CPI, PPI, jobs, Fed Funds Rate, Treasury yields. Get key at: fred.stlouisfed.org
- Farside Investors (free) — daily BTC/ETH ETF inflows/outflows
- SoSoValue (free) — ETF flow data, structured
- SEC EDGAR RSS (free) — 8-K and 13-F filings for MSTR, BlackRock, Fidelity
- Congress.gov RSS (free) — Clarity Act, FIT21, stablecoin bill status

### Humanization Rules (Non-Negotiable)
Every generated post MUST:
- Zero em dashes
- Use contractions naturally
- Written like a human — succinct, to the point
- Hook in first 5 words: lead with a number, dollar amount, percentage, or named entity
- No filler, no corporate tone

### Risk Kill Switches
1. **Rumor amplification:** velocity high + source below tier 3 → hold for human review
2. **Same-topic streak:** 3 posts in a row same primary topic → pause + flag Kelly
3. **High-volatility:** BTC >5% move in 1hr → suspend CHART:/NUMBER: posts
4. **Dead man's switch:** no posts in 6hrs during market hours (6AM–6PM PST) → Telegram alert
5. **Price staleness:** reject price-correlated posts if price data >15 min old

### Implementation Phases
**Phase 1 (this week, mostly free):**
- [ ] Get FRED API key
- [ ] Get X account API key (post-only scope)
- [ ] Add FRED macro integration to pipeline
- [ ] Add Farside/SoSoValue ETF flow data
- [ ] Add SEC EDGAR RSS for institutional filings

**Phase 2 (one sprint):**
- [ ] Deploy x-poster-worker on Railway
- [ ] Set up Redis for state management
- [ ] Build scoring engine against existing headlines API
- [ ] Configure posting formats and humanization prompts

**Phase 3 (iterative):**
- [ ] Tune source authority taxonomy based on performance
- [ ] Add breaking news fast lane (2-min poll)
- [ ] THREAD: format for legislation deep dives

### Cost Estimate
| Item | Monthly |
|---|---|
| Railway x-poster-worker | ~$5-10 |
| Railway Redis | ~$10 |
| LLM calls (~500/mo) | ~$3-5 |
| Metals-API (gold/silver) | already on Twelve Data |
| X API upgrade (if needed) | TBD |
| **Total** | **~$18-25/mo** |

### X API Note
Current X API Basic plan has post limits. At 12-15 posts/day (~450/mo), may need Pro tier. Verify cap before launch. Post-only scoped key reduces risk of misuse.

### Skills Referenced
- `x-post-automator` skill already exists — handles manual drafting with humanization
- New `x-post-automator` will be built to handle automated pipeline
- Humanization rules from `skills/humanization-voice/SKILL.md` apply to all posts
- Discover Crypto voice examples available in Mission Control X Feed data

### Session Context
- **Date:** 2026-03-26
- **Kelly's priorities:** Humanization above all, 4:30 AM–11 PM posting window, no em dashes, contractions, hook-led posts, source authority tiers with his specific account list
- **Next action:** Kelly to provide X account post-only API key (FRED key received and verified ✅)

## Gmail Integration
- **Status:** Partially working
- **Account:** rex@hitnetwork.io
- **Blocked:** hitnetwork.io domain not verified in Resend
- **Need:** GoDaddy DNS records for `ns59/ns60.domaincontrol.com`
- **Fallback:** Calendar invites work, but email sends blocked until domain verified

## Discord Integration
- **Members:** 3,700 across Discover Crypto + Blockchain Basement
- **Skills:** `discord-analytics` (#14), `discord-bot` (#18)
- **Weekly reports:** Community health metrics for Monday Scorecard

## Remote Access
- **Tailscale IP:** `100.70.46.41` (permanent)
- **Local WiFi:** Dynamic (home network only)
- **"Leaving house" trigger:** Check Mac reachable, send Tailscale IP to Kelly

## Email Send Hard Gate (PR-024)
- **Rule:** `gog gmail send` cannot execute without sub-agent proof PASS
- **Flow:** Draft → spawn proofreader → PASS → OUTPUT GATE → Kelly approves → send
- **Failure:** LAW 7 + LAW 1 violation

## Gateway Management
- **Method:** Native macOS via npx (Docker removed as of 2026-03-12)
- **Command:** `npx openclaw gateway --port 30322`
- **Home directory:** `/Users/rex/` (NOT /home/node/)
- **Config:** `~/.openclaw/openclaw.json`
- **To restart:** Stop the Terminal process, re-run `npx openclaw gateway --port 30322`
- **NEVER:** Reference Docker commands (docker compose up/down/exec) — Docker is gone

## 🚨 INFRASTRUCTURE FILES — PERMANENTLY OFF-LIMITS FOR REX (PR-031, added 2026-03-12)

Rex caused a 4-hour outage by editing `docker-compose.yml`. These files are NEVER to be touched:

| File | Why It's Off-Limits |
|------|---------------------|
| `~/OpenClaw/openclaw/docker-compose.yml` | Controls Docker container env — removing API key passthrough kills all models |
| `~/.openclaw/models.json` | Model routing config — wrong edits break all provider fallbacks |
| `~/.openclaw/agents/*/auth-profiles.json` | Auth/billing state — editing this can trigger 3-hour lockouts |
| Any `.env` file anywhere on system | Credential store — Rex never touches these |
| Any file in `~/.openclaw/agents/` | Runtime auth + billing state |

**Rule:** Rex suggests changes with exact diffs. Kelly applies them. No exceptions.

## Notes
- OpenClaw Gateway Port: `30322`
- **Restart method:** `npx openclaw gateway --port 30322` (Docker removed 2026-03-12 — never use Docker commands)
- Tailscale must be ON on iPhone for remote access

## Tech Watch List
| Tool | Current Version | Status | Cron ID | Watch Since |
|------|----------------|--------|---------|-------------|
| Cognee (topoteretes/cognee) | v0.5.4 (2026-03-05) | Not Ready — Python-only, async bug #2120, pre-1.0 | 9c90dcd0 | 2026-03-13 |

**Cognee notes:** Knowledge graph + vector hybrid memory for AI agents. Interesting for cross-agent memory sharing. Blockers: Python-only (we're Node.js), async bug freezes event loops, remote Docker deployment issues. Revisit at v1.0 or when Node.js SDK ships.
