# Hit Network Memory — Operations & Infrastructure
**Last updated:** 2026-03-18

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

## X Feed Infrastructure (Planned)
- **Status:** Waiting on Kelly to complete pre-build checklist
- **X API:** $100/mo Basic tier (official route, no ToS risk)
- **Hosting:** Railway.app (Kelly has Pro, zero extra cost)
- **Pre-build checklist:**
  - [ ] Create throwaway Gmail
  - [ ] Create fresh X account on that Gmail
  - [ ] Sign up for X API Basic
  - [ ] Create Project + App
  - [ ] Generate Bearer Token
  - [ ] Share token with Rex securely
  - [x] X account list confirmed — 44 accounts live in x-rss-adapter/server.js

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
