# QUICKREF.md — Rex State Snapshot
_Read this FIRST, EVERY session. No exceptions. No skimming._
_Last updated: 2026-03-26 10:21 PM PDT_

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

## Last Session Summary (2026-03-26)
- **Rules management system Phase 1 built** — `rule-index.md` created (CRITICAL/HIGH/STANDARD rule classification by task type)
- **`## Critical Rules Snapshot`** added to `_TEMPLATE.md` — Rex pastes full text of applicable CRITICAL rules at start of HIGH/CRITICAL tasks
- **`## Prior Context`** added to `_TEMPLATE.md` — Rex checks relevant memory file and writes 3-5 bullets before HIGH/CRITICAL tasks
- **Maintenance protocol** added to `rule-registry.md` — Rex updates rule-index.md when creating/modifying rules
- **TASK-007 + TASK-009** retrofitted with both new sections
- **Phase 2 + 3 deferred** — completion gate and full pre-task loading deferred, watching Phase 1 effectiveness first
- **Phase 1 review triggers set:**
  - Monday Scorecard: Phase 1 verdict every Monday
  - Date trigger: April 9, 2026
  - Task-count trigger: after 8 HIGH/CRITICAL tasks completed under new system

## Blockers
- X account post-only API key (needed for TASK-009)
- Nansen API key (still pending)
- Railway deploy for DC Data Hub needs manual Redeploy click (Railway infra flaky)

## Recent Decisions (last 7 days)
| Date | Decision | Status |
|------|----------|--------|
| 2026-03-26 | Phase 1 rules system: rule-index.md + Critical Rules Snapshot + Prior Context | ACTIVE — review triggers set |
| 2026-03-26 | Phase 2 + 3 deferred — watching Phase 1 effectiveness first | DEFERRED |
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
