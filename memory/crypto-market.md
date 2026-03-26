# Hit Network Memory — Crypto & Market Data
**Last Refreshed:** 2026-03-25

## Context for Crypto Analysis
- **Discover Crypto:** YouTube-first crypto education/news channel, retail investor audience
- **Blockchain Basement:** Technical/DeFi-focused audience
- **Typical questions:** Market analysis, price context, on-chain signals, token-specific notes

## Price & Market Context (as of 2026-03-25)
- **14 assets tracked:** BTC, ETH, BNB, XRP, SOL, LINK, TAO, ADA, DOT, NEAR, ATOM, GOLD, SILV, DXY, NVDA, COIN, MSTR
- **Current focus:** Daily market reports, on-chain signals, breaking crypto news, Iran geopolitical escalation
- **Data sources:** CoinGecko (primary), CoinMarketCap (verification), X API v2 (social sentiment), Fear & Greed Index

## Market Intelligence Rules
- **Daily market reports:** Produced by Kelly, stored in `market-reports/market-notes.md`
- **Rex normalization:** Rex maintains `rex-notes.md` in `## YYYY-MM-DD — [headline]` format
- **Convex sync:** API reads `rex-notes.md` → stores with `dataTimestamp` (midnight UTC)
- **Refresh policy:** This file must be updated at least once daily from market-notes.md
- **ZERO fabrication:** Only data explicitly in Kelly's notes

## Key Narratives to Track (2026-03-25)

### Geopolitical / Macro
- Iran-US tensions dominant near-term narrative (5-day ceasefire fragile, outcome within 48h)
- 30-year mortgage above 7% (first time since August 2025)
- US unemployment duration at 4-year high (25.7 weeks)
- Manufacturing/construction employment at historic lows (~15% of US jobs)

### Crypto Market Structure
- Fear & Greed at **14** (Extreme Fear) — near COVID-era lows
- Altcoin Season Index: **49/100** (Not Altcoin Season — BTC dominance elevated)
- Institutional accumulation NOT capitulating despite extreme fear readings
- TAO +19.8% in one day (Grayscale ETF appetite for AI-adjacent exposure)

### Bitcoin & Ethereum
- BTC holding $71.5K level with +2.4% daily, breaking above key resistance
- ETH breaking above $2,180 with +2.5% daily momentum
- SOL +3.3% with strong momentum
- XRP +1.2%, LINK +3.9%, ADA +4.2% — broad alt rally despite fear

### Precious Metals
- Gold at $4,551.90 (+4.4% today) — 10 consecutive up days, longest streak since 1920
- GLD AUM near record $181B (doubled in under 1 year) — institutional safe-haven demand
- Silver $72.97 (+5.9%) — metals rally on war premium

### Regulatory
- SEC/CFTC: 68 pages of guidance released but NOT finalized — regulatory clarity still pending
- Franklin Templeton + Ondo tokenized ETFs advancing (institutional crypto infrastructure)

### What We're Watching
1. **Iran Ceasefire Stability** — Any escalation reverses entire narrative within 48 hours
2. **Fear & Greed 14 Historical Precedent** — Last time: 2023 bear market bottom → multi-month accumulation followed
3. **Deribit $14.16B Expiry (March 27)** — Max pain pinned near $71K. BTC hold = rally extends. Below $71K = gravitational pull.
4. **30-Year Mortgage Above 7%** — Consumer stress visible, inflation expectations affected
5. **Gold $181B AUM Inflection** — If AUM continues higher → more escalation priced in

## On-Chain Signals to Monitor
- Exchange flows (inflows/outflows)
- Whale wallet movements
- Stablecoin supply changes
- Network activity (transactions, active addresses)

## Content Angles for Discover Crypto
- Retail-friendly explanations of complex topics
- Weekly roundups: top 5 stories, top 3 mistakes, what to watch
- Technical analysis for beginners
- DeFi explained simply

## Notes
- Kelly's Telegram ID: `1011362712`
- Morning brief cron: active — cron ID `2d7261a0` (7 AM daily)
- Use CoinGecko API for prices, X API v2 for social sentiment
- Market data refreshed from: `market-reports/market-notes.md` (updated daily)
