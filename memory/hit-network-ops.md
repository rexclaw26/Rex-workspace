# Hit Network Memory — Operations & Infrastructure
**Last updated:** 2026-03-31 (dedup: removed ~7,600 chars duplicate Ready Posts block; trimmed Tech Watch List + Skill Routing System冗余)

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
- **Railway URL:** `https://mission-control-production-b7e2.up.railway.app` (public, password protected)
- **Railway service ID:** `4f2a644d-030c-443c-9846-116f1615c46f` (project `02441900-5c37-4d67-a45e-d08f1dcadbb1`)
- **⚠️ Railway projects index:** `memory/railway-projects.md` — full mapping of service IDs, repo sources, deployed URLs. ALWAYS check this before any Railway CLI operation.
- **Local Tailscale:** `http://100.70.46.41:3000` (home network only)
- **Password:** `Rexl@bacademy`
- **Railway-linked dir:** `/Users/rex/OpenClaw/workspace/mission-control/` → pushes to `dc-data-hub` repo (this is the Railway-linked copy)
- **Backup dir:** `/Users/rex/.openclaw/workspace/mission-control/` → `Rex-workspace` repo
- **Price grid:** 14 assets tracked (BTC, ETH, BNB, XRP, SOL, LINK, ADA, TAO, GOLD, SILV, DXY, NVDA, COIN, MSTR)
- **Dashboard agents:** Rex · Writer · Analyst · Monitor · Builder · Closer
- **Headlines pipeline:** Daily Insight + What We're Watching (collapsible sections)
- **Market report API:** `GET /api/marketreport` — reads latest `MARKET_REPORT_YYYYMMDD.md`

## X Feed Infrastructure (Live as of 2026-03-07)
- **Railway RSS adapter:** `https://feed-adapter-production.up.railway.app/rss`
- **X API:** $100/mo Basic tier (official route, no ToS risk)
- **44 X accounts** monitored in x-rss-adapter/server.js — deployed and live
- **Mission Control page:** `http://100.70.46.41:3000/x-feed` (local) or via Railway
- **Bearer Token:** Kelly's Railway env var — never stored in Rex files (LAW 6)

## Ready Posts — X Post Queue (Deployed 2026-03-27)
- **Mission Control page:** `/ready-posts` — Kelly browses queue, clicks COPY, pastes to X himself
- **No X API key needed** — human-in-the-loop approach
- **Convex table:** `xPostQueue` — stores generated posts with status flow: GENERATED → READY → COPIED → POSTED
- **Data sources:** X Feed (44 accounts) + DC Hub market data
- **Schedule:** 4:30–11 AM PT every 20 min | 11 PM–4:30 AM PT every 60 min
- **6 post formats:** Thread Starter, Breaking Take, Watch List, Thread Summary, Education, Data Drop
- **Scoring:** 40% authority / 25% velocity / 20% market impact / 15% novelty — skip if < 40
- **Kelly's tier 1 sources:** @coinbureau, @kobeissiletter, @BullTheoryio (scored higher)
- **Generation API:** `/api/generate-x-posts` — scored + humanized posts saved to queue
- **Status API:** `/api/x-post-status` — protected by `MC_API_SECRET` header auth

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

## Skill Routing System

See `ROUTING.md` — 16 task types, skill chains, staleness flag at 7 days. Full PR registry in `rule-registry.md`.

## Notes
- OpenClaw Gateway Port: `30322`
- **Restart method:** `npx openclaw gateway --port 30322` (Docker removed 2026-03-12 — never use Docker commands)
- Tailscale must be ON on iPhone for remote access

