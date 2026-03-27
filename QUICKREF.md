# QUICKREF.md — Rex State Snapshot
_Read this FIRST, EVERY session. No exceptions. No skimming._
_Last updated: 2026-03-27 10:25 AM PDT_

## Active Right Now
- **TASK-009** — Ready Posts (X post queue) — DEPLOYED to Railway. Kelly browses queue, copies posts, posts manually to X himself. No X API key needed.
- **TASK-007** — DC Data Hub — Railway live. Day 3 audit + mobile responsive pass pending.
- **TASK-010** — Phase 1 Rules System Review — triggers: 8 HIGH/CRITICAL tasks OR April 9 OR Monday Scorecard verdict

## What's Live (permanent infrastructure)
| Service | URL | Status |
|---------|-----|--------|
| Mission Control (Railway) | https://mission-control-production-b7e2.up.railway.app | LIVE ✅ |
| Mission Control (local) | http://100.70.46.41:3000 | LIVE (Tailscale) |
| DC Data Hub (Railway) | https://dc-data-hub-production-cff0.up.railway.app | LIVE ✅ |
| DC Data Hub (local dev) | http://localhost:3000 | LIVE |
| OpenClaw Gateway | localhost:30322 | LIVE (v2026.3.23) |

## Open Tasks
| ID | Task | Status | Next Action |
|----|------|--------|-------------|
| TASK-009 | Ready Posts (X queue) | DEPLOYED | Test generation, add more X accounts |
| TASK-007 | DC Data Hub | active | Day 3 audit + mobile responsive pass |
| TASK-010 | Phase 1 Rules Review | planned | Triggers: 8 tasks OR April 9 |
| TASK-002 | Calendar focus bug | blocked | — |
| TASK-003 | X feed RSS | blocked | — |

## Last Session Summary (2026-03-27)
- **Ready Posts system deployed** — TASK-009 done. `/ready-posts` on Mission Control Railway. Kelly copies posts, posts manually. No X API needed.
- **Mission Control deployed to Railway** — `https://mission-control-production-b7e2.up.railway.app` — password: `Rexl@bacademy`
- **Two MC directories** — Railway-linked: `/Users/rex/OpenClaw/workspace/mission-control/` → pushes to `dc-data-hub` repo. Backup: `/Users/rex/.openclaw/workspace/mission-control/` → `Rex-workspace` repo.
- **Critic review** — All 6 fixes for Ready Posts passed. Build clean.
- **Phase 1 rules system** — review triggers set (April 9 / 8 tasks / Monday Scorecard)
- **Railway deploy** — Mission Control Railway service created, variables set, domain assigned

## Blockers
- Nansen API key (still pending)

## Last Session Summary (2026-03-27)
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
