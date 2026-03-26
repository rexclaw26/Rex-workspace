# QUICKREF.md — Rex State Snapshot
_Read this FIRST, EVERY session. No exceptions. No skimming._
_Last updated: 2026-03-25 1:15 PM PDT_

## Active Right Now
- **TASK-007** — DC Data Hub — Railway confirmed LIVE (2026-03-25). Features built through Mar 22. Railway URL: https://dc-data-hub-production-cff0.up.railway.app
- **TASK-008** — Lex Architecture Integrations — COMPLETE (2026-03-21)
- **Memory system overhaul** — Health scripts, entity index, recall log built (2026-03-25)

## What's Live (permanent infrastructure)
| Service | URL | Status |
|---------|-----|--------|
| Mission Control | http://100.70.46.41:3000 | LIVE (Tailscale) |
| DC Data Hub (local dev) | http://localhost:3000 | LIVE |
| DC Data Hub (Railway) | https://dc-data-hub-production-cff0.up.railway.app | LIVE ✅ |
| X RSS Feed | Railway | LIVE |
| OpenClaw Gateway | localhost:30322 | LIVE (v2026.3.23) |

## Open Tasks
| ID | Task | Status | Next Action |
|----|------|--------|-------------|
| TASK-007 | DC Data Hub | active — Railway live, Day 3 audit pending | Mobile responsive pass |
| TASK-002 | Calendar focus bug | blocked | — |
| TASK-003 | X feed RSS | blocked | — |

## Last Session Summary (2026-03-25)
- **LCM fixed** — tables created manually, engine connected (threshold=0.75, fires at 75% context pressure)
- **Memory scripts built** — rex-memory-health.py, rex-entity-index.py (95 entities), rex-recall-log.py
- **Paper Boy bugs fixed** — HTML glob all date formats, threshold raised to 500 chars
- **preventive-rules.md rebuilt** — "Forge"→"Rex", PR-038 through PR-048 added, duplicates removed
- **PR-047 added** — Sub-agent timeout handling (120s/pass, partial writes, continuation protocol)
- **PR-048 added** — Gateway restart = `install --force` only
- **openclaw-restart alias** created in .zshrc
- **SELF.md updated** — DC Data Hub Railway URL corrected
- **Session handoff updated** — Mar 25 state

## Blockers
- Nansen API key (still pending)
- sponsors.md 13 days stale — Kelly to confirm pipeline status

## Recent Decisions (last 7 days)
| Date | Decision | Status |
|------|----------|--------|
| 2026-03-25 | Gateway restart = `install --force` only (orphaned process bug) | PERMANENT |
| 2026-03-25 | Memory: fork Lex's architecture pattern, don't share DB | ACTIVE |
| 2026-03-25 | PR-047: Sub-agent timeout rules | PERMANENT |
| 2026-03-22 | PR-044: Zero-bypass gate enforcement — ALL deliverables gated | PERMANENT |
| 2026-03-22 | Liquidations: Hyperliquid (not CoinGlass) | ACTIVE |
| 2026-03-22 | Bull/Bear: forward-looking RSI via TwelveData | ACTIVE |
| 2026-03-22 | DC Data Hub dev port = 3000 | ACTIVE |
| 2026-03-21 | DC Data Hub password: dcgodmode26 | ACTIVE |
| 2026-03-21 | DXY inverted in Bull/Bear | ACTIVE |

## Key People
- Kelly Kellam — Principal. Telegram: 1011362712. PST timezone.
- TJ Shedd — Hit Network leadership
- Lex — Hit Network AI (GitHub: LexClaw/Lex-Workspace, operator: TJ)
- Hal — Hit Network Discord AI (operator: Tim)
- Tim — Hal's operator. Tailscale invite pending.

## Full Capabilities
See SELF.md
