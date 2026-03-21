# Hit Network Memory — Crypto & Market Data
**Last updated:** 2026-03-12

## Context for Crypto Analysis
- **Discover Crypto:** YouTube-first crypto education/news channel, retail investor audience
- **Blockchain Basement:** Technical/DeFi-focused audience
- **Typical questions:** Market analysis, price context, on-chain signals, token-specific notes

## Price & Market Context (as of 2026-03-12)
- **14 assets tracked:** BTC, ETH, BNB, XRP, SOL, LINK, ADA, TAO, GOLD, SILV, DXY, NVDA, COIN, MSTR
- **Current focus:** Daily market reports, on-chain signals, breaking crypto news
- **Data sources:** CoinGecko (primary), CoinMarketCap (verification), X API v2 (social sentiment)

## Market Intelligence Rules
- **Daily market reports:** Produced by Kelly, stored in `market-reports/market-notes.md`
- **Rex normalization:** Rex maintains `rex-notes.md` in `## YYYY-MM-DD — [headline]` format
- **Convex sync:** API reads `rex-notes.md` → stores with `dataTimestamp` (midnight UTC)
- **ZERO fabrication:** Only data explicitly in Kelly's notes

## Key Narratives to Track (2026-03-12)
- Bitcoin ETF flows, institutional adoption
- Ethereum upgrades, Layer 2 growth
- DeFi TVL trends, new protocol launches
- Regulatory developments (SEC, CFTC)
- Macro factors: interest rates, inflation data

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
- Kelly's Telegram ID: `1011362712` (paired 2026-03-02)
- Morning brief cron: **INACTIVE** — was cron ID 82d8ff45, silently deleted during Docker→Mac migration on 2026-03-12. Not currently running. Needs rebuild.
- Use CoinGecko API for prices, X API v2 for social sentiment
