# QUICKREF — Active / Blockers / Decisions
_Last updated: 2026-03-28 13:14 PDT_

## Active
- **TASK-009 Ready Posts** — ✅ LIVE on Railway. Two-column (X Feed + Market Pulse). Generate buttons working. Phase 2 blocked on FRED API key.
- **TASK-007 DC Data Hub** — ✅ Live. Nansen section built but BLOCKED on API access — see Nansen blocker below.
- **Nansen Smart Money Phase 1** — 🔴 BLOCKED. Code complete + passing. Waiting on Kelly's direction on API access. See `memory/2026-03-28.md` for exact options A/B/C/D.
- **Railway GitHub auto-deploy** — not wired up yet. Kelly to connect in Railway dashboard: `rexclaw26/Rex-workspace`, branch `master`, Root Directory: `mission-control/`

## Blockers
- **Nansen API access** — `smart-money/netflow` requires x402 micropayment protocol. Standard API key doesn't work. Kelly deciding: paid plan / CLI OAuth / swap source / defer. Full decision tree in `memory/2026-03-28.md` → "Nansen Smart Money Integration" section.
- **FRED API key** — needed for TASK-009 Phase 2 macro data (blocking)
- **Gmail auth** — kelly@bitlabacademy.com not connected to gog (watchdog only picks up rex@hitnetwork.io)
- **CryptoQuant** — key set in Railway but free plan = 0 credits. $99/mo Professional needed for SOPR/MVRV.

## Recent Decisions
- **2026-03-27:** Railway projects index created (`memory/railway-projects.md`). Correct MC Railway service: `4f2a644d-030c-443c-9846-116f1615c46f`
- **2026-03-27:** PR-051 Railway Service Identity Gate added — check railway-projects.md before any Railway action
- **2026-03-27:** TASK-010 Phase 1 review triggers: 8 HIGH/CRITICAL tasks OR April 9 OR Monday Scorecard verdict (count: 0/8)
- **2026-03-27:** Git history scrubbed on both repos — ai-spend.json and API key references removed
- **2026-03-27:** Local MC uses `npm run dev` (dev mode), NOT `next start` (production has 307 redirect bug)

## Infrastructure URLs
| Service | URL | Notes |
|---------|-----|-------|
| DC Data Hub (Railway) | `https://dc-data-hub-production-cff0.up.railway.app/` | Auto-deploys from GitHub ✅ |
| MC Railway | `https://mission-control-production-b7e2.up.railway.app/` | Manual redeploy needed |
| MC Local | `http://localhost:3000` | Dev mode only |
| Mission Control Tailscale | `http://100.70.46.41:3000` | Remote access |

## Railway Service IDs (CHECK BEFORE ANY RAILWAY ACTION)
- **MC Railway:** `4f2a644d-030c-443c-9846-116f1615c46f` ← USE THIS
- **DC Data Hub Railway:** `a98ccb85-44f8-49e6-b314-e1d323e3695d`
- See `memory/railway-projects.md` for full index

## Last Session Summary (2026-03-28)
- **Nansen Phase 1 built** — 6 files, clean build, post-build critic PASS. BLOCKED on x402 API wall. Options A/B/C/D in `memory/2026-03-28.md`
- **API Cost Analysis deck** built — `/slides/api-cost-analysis` on Mission Control. CryptoQuant $99/mo, CoinGlass ~$79-149/mo, CoinGecko Analyst $129/mo
- **DC Hub chart fix** — Binance 451 geo-block → CoinGecko free API fallback
- **Ready Posts two-column** live on Railway — X Feed + Market Pulse, generate working
- **Error logged** — FRED API key committed to git (PR-050 violation), scrubbed, preventive rule added
- **Paper Boy** ran successfully — market data current

## Previous Session Summary (2026-03-27)
- **Railway deployment fix** — rogue nested dir deleted, `.railwayignore` added, CLI re-linked to correct source dir, clean deploy `4c8ed401` confirmed SUCCESS at 21:12
- **TASK-009 Ready Posts** — fully live on Railway ✅. X Feed + Market Pulse two-column. Generate working (0 errors). Dedup working.
- Railway deploy path: `cd ~/.openclaw/workspace/mission-control && railway up --service 4f2a644d-030c-443c-9846-116f1615c46f`
- Git history scrubbed on both repos (API key removed)
- Paper Boy pipeline ran successfully
- PR-051 added: Railway Service Identity Gate
- Phase 1 rules system built (rule-index.md, Critical Rules Snapshot in task templates)
- Error logged: failed to push Telegram update when task completed (PR to add)
