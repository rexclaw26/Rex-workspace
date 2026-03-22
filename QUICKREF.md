# QUICKREF.md — Rex State Snapshot
_Read this FIRST, EVERY session. No exceptions. No skimming._
_Last updated: 2026-03-22 1:00 PM PDT_

## Active Right Now
- **TASK-007** — DC Data Hub — Major feature push complete (2026-03-22). Market Pulse card, forward-looking bull/bear (RSI + TwelveData), Hyperliquid liquidations, enriched Onchain Signals (SOPR/MVRV). Dev running on port 3000.
- **TASK-008** — Lex Architecture Integrations — COMPLETE + fully wired (extraPaths updated 2026-03-22)

## What's Live (permanent infrastructure)
| Service | URL | Status |
|---------|-----|--------|
| Mission Control | http://100.70.46.41:3000 | LIVE |
| DC Data Hub (local dev) | http://localhost:3000 | LIVE (port 3000) |
| DC Data Hub (Railway) | https://dc-data-hub-production-cff0.up.railway.app | LIVE |
| X RSS Feed | Railway (deployed) | LIVE |
| OpenClaw | localhost:30322 | LIVE |

## Open Tasks
| ID | Task | Status | Next Action |
|----|------|--------|-------------|
| TASK-007 | DC Data Hub | active — features built, Railway needs redeploy for new APIs | `railway up` from ~/dev/dc-data-hub |
| TASK-002 | Calendar focus bug | blocked | — |
| TASK-003 | X feed RSS | blocked | — |

## Last Session Summary (2026-03-22)
- **Memory system fully wired** — extraPaths updated (37 entries), SKILL-MAP.md built, gates + tracker fixed, PR-044 written
- **PR-044 added (PERMANENT)** — Zero-bypass gate enforcement. Gatekeeper fires on ALL written deliverables. No exceptions.
- **Model:** `anthropic/claude-sonnet-4-6` via `anthropic:manual` (token, no API credits)
- **TwelveData API key** added to DC Data Hub `.env.local` — RSI live for all 7 assets
- **Bull/Bear redesigned** — forward-looking RSI signals (not lagging price change)
- **Liquidations rebuilt** — Hyperliquid (was Binance futures, geo-blocked)
- **Onchain Signals enriched** — SOPR, LTH/STH-MVRV, whale accumulation, exchange flows, miner cost
- **Market Pulse card added** — grid card + full report viewer at `/report`
- **market-notes.md data lag fixed** — API routes now read `market-notes.md` first (always current)
- **GMAIL_HOOK fixed** — dated backup now overwrites on every ingest
- **Email gate violation** — Tim/Tailscale email: missing sig + em dash + humanization. PR-044 written.
- **Tailscale for Tim** — Kelly inviting tim@hitnetwork.com + hal@hitnetwork.io to Tailscale

## Blockers
- Nansen API key (awaiting from Kelly)
- DC Data Hub Railway needs redeploy to pick up new API routes (bull-bear, liquidations, onchain, market-pulse)
- Tim's Tailscale invite pending from Kelly

## Recent Decisions (last 7 days)
| Date | Decision | Status |
|------|----------|--------|
| 2026-03-22 | PR-044: Zero-bypass gate enforcement — ALL deliverables gated | PERMANENT |
| 2026-03-22 | Liquidations source: Hyperliquid (not CoinGlass — too expensive) | ACTIVE |
| 2026-03-22 | Bull/Bear: forward-looking RSI signals via TwelveData | ACTIVE |
| 2026-03-22 | DC Data Hub dev port = 3000 (not 3001 — .env.local fixed) | ACTIVE |
| 2026-03-22 | Market report ingestion: auto-convert HTML→MD on receipt | ACTIVE |
| 2026-03-22 | extraPaths maintenance: any new file → add immediately, Kelly applies | ACTIVE |
| 2026-03-21 | DC Data Hub password: dcgodmode26 | ACTIVE |
| 2026-03-21 | DXY signal inverted in Bull/Bear (rising = bearish for crypto) | ACTIVE |

## Key People
- Kelly Kellam — Principal. Telegram: 1011362712. PST timezone.
- TJ Shedd — Hit Network leadership
- Lex — Hit Network AI (GitHub: LexClaw/Lex-Workspace, operator: TJ)
- Hal — Hit Network Discord AI (operator: Tim, hal@hitnetwork.io)
- Tim — Hal's operator. Tailscale invite pending.

## Full Capabilities
See SELF.md
