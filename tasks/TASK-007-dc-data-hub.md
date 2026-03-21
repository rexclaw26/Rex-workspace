# TASK-007 — Discover Crypto Data Hub

**Status:** active  
**Owner:** Rex  
**Priority:** high  
**Created:** 2026-03-18  
**Target:** 3-day build (Day 1: Foundation + API layer, Day 2: UI + all sections, Day 3: Polish + audit + deploy)

---

## Objective

Build a standalone public-facing data hub for Discover Crypto members and media team. Combines the best of DeFiLlama, Bitcoin Magazine Pro, and CoinGlass — cleaner and more streamlined. Free tier (stripped down) + paid member tier (full access). Modular dashboard — default layout set, members can customize.

---

## Full Specification

### Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel (standalone deployment, separate from Mission Control)
- **Repo:** New standalone repo — `dc-data-hub`
- **Auth:** Not in v1 — `isPremium` flag baked into component layer for future wiring
- **Data refresh:** Client-side polling every 5 minutes via React Query / SWR

### 10 Dashboard Sections

| # | Section | API Source | Refresh |
|---|---------|-----------|---------|
| 1 | Fear & Greed + BTC Dominance | alternative.me + CoinGecko | 5 min |
| 2 | Top 100 Crypto Prices (paginated 10/50) | CoinGecko /coins/markets | 5 min |
| 3 | Watching This Week | JSON file populated from Kelly's market report emails | Manual/weekly |
| 4 | Liquidations + Open Interest | CoinGlass free API | 5 min |
| 5 | On-Chain Signals | CryptoQuant free + Blockchain.com public | 15 min |
| 6 | Institutional BTC Leaderboard | BitcoinTreasuries.net parsed | Daily |
| 7 | Bull/Bear Score (Macro/Mid/Short) | Computed from CoinGecko + Finnhub + Fear&Greed | 5 min |
| 8 | Top Headlines (crypto) | CoinDesk + CoinTelegraph RSS | 15 min |
| 9 | Top X Headlines | Existing RSS adapter (Railway feed) | 15 min |
| 10 | Market Drivers | Finnhub free (SPX, DOW, NVDA, TSLA, META, GOLD, Silver, Copper, COIN, IREN, DXY, Oil) | 5 min |

### Free vs Paid Tier (v1)
- **Free:** Sections 1, 2 (top 10 only), 8, 9, 10 (delayed 15 min)
- **Paid:** All sections, real-time data, expandable price table (50), On-Chain Signals, Liquidations, Institutional data, Bull/Bear scores

### Bull/Bear Score Logic
- **Macro (monthly):** Fed stance + DXY 30-day trend + SPX vs 50-day MA → 🟢/◯/🔴
- **Mid-term (this week):** BTC 7-day momentum + Fear & Greed level + OI trend → 🟢/◯/🔴
- **Short-term (today):** BTC 24h change + liquidation direction + funding rate → 🟢/◯/🔴

### Nansen Integration (future)
- Stub On-Chain Signals section with free data
- Wire to Nansen API when Kelly secures key access from partner contact
- Need from Kelly: Nansen contact name/email for outreach re: partner API access

### UI/Design Direction
- Dark mode first (crypto audience expectation)
- Clean card-based modular layout
- Crisp typography, minimal chrome
- Modular drag-to-reorder dashboard (Phase 2 — not v1)
- Mobile responsive
- Reference: frontend-design-ultimate + superdesign skills

---

## Locked Decisions
- Standalone repo, NOT part of Mission Control
- Can reuse data logic/patterns from Mission Control but separate codebase
- Free APIs only for v1 — paid upgrade report delivered separately
- 3-day build split to manage Claude token load
- `isPremium` flag in components now, auth system added later
- Watching This Week = manual JSON populated from Kelly's email reports

---

## 3-Day Execution Plan

### Day 1 (2026-03-18): Foundation + API Layer — ✅ COMPLETE
- [x] Scaffold Next.js repo, Tailwind, shadcn/ui
- [x] All 10 API route handlers built
- [x] Bull/Bear scoring engine
- [x] isPremium flag + cache layer + TypeScript types
- [x] Watching This Week JSON schema
- [x] Clean build confirmed, 8/10 routes live data verified
- [ ] FIX NEEDED: Liquidations OI returning zeros (Binance futures endpoint) — fix in Day 2

### Day 2 (2026-03-18 — accelerated): UI Build — All 10 Sections — IN PROGRESS
- [ ] Layout shell: header, nav, modular grid
- [ ] Section 1: Fear & Greed gauge + BTC Dominance bar
- [ ] Section 2: Crypto prices table (paginated, expandable)
- [ ] Section 3: Watching This Week cards
- [ ] Section 4: Liquidations heatmap + OI chart
- [ ] Section 5: On-Chain Signals feed
- [ ] Section 6: Institutional BTC leaderboard table
- [ ] Section 7: Bull/Bear score display (3 timeframes × 2 assets)
- [ ] Section 8: Top Headlines cards
- [ ] Section 9: Top X Headlines feed
- [ ] Section 10: Market Drivers ticker row
- [ ] Free/paid gating applied to all sections
- [ ] Quality gate: design audit — every section reviewed against DC brand

### Day 3 (2026-03-20): Polish + Audit + Deploy
- [ ] Mobile responsive pass
- [ ] Loading states + error fallbacks for every API
- [ ] Performance audit (Lighthouse)
- [ ] Security audit (no keys exposed client-side)
- [ ] Quality Gatekeeper OUTPUT REVIEW
- [ ] Paid upgrade report written and delivered to Kelly
- [ ] Nansen outreach draft ready for Kelly approval
- [ ] Production Vercel deploy
- [ ] Deliver staging URL + repo link to Kelly

---

## Files
- Repo: `dc-data-hub` (new — not created yet)
- Vercel project: `dc-data-hub` (staging + prod)
- Watching This Week data: `public/data/watching-this-week.json`
- API routes: `app/api/` (Next.js server routes)

---

## APIs Needed (no keys yet)
- CoinGecko: free, no key required
- alternative.me: free, no key required
- Finnhub: free key needed — sign up at finnhub.io
- CoinGlass: free key needed — sign up at coinglass.com/pricing
- Railway RSS feed: already live

## ⚠️ Port Rule
ALWAYS run dc-data-hub dev server on port 3001: `npm run dev -- -p 3001`
Port 3000 is permanently reserved for Mission Control.

## What I Need From Kelly
- [ ] Finnhub API key (free signup: finnhub.io)
- [ ] CoinGlass API key (free signup: coinglass.com)
- [ ] Nansen contact name/email for partner API outreach
- [ ] Confirmation of domain/subdomain (e.g. data.discovercrypto.com or standalone)

---

## Current State
Planning complete. Waiting on API keys before Day 1 build starts.

## Handoff Notes
- Mission Control patterns to reuse: data fetching patterns, card component styles, color tokens
- Bull/Bear score is rules-based v1 — document the thresholds clearly so Kelly can tune them
- Watching This Week section intentionally manual — Kelly's market report emails are the source of truth
