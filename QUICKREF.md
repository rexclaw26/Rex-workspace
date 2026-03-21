# QUICKREF.md — Rex State Snapshot
_Read this FIRST, EVERY session. No exceptions. No skimming._
_Last updated: 2026-03-21 4:52 PM PDT_

## Active Right Now
- **TASK-007** — DC Data Hub — FULLY BUILT (Days 1+2). Live on port 3001. Day 3 = Railway deploy + audit (next action).
- **TASK-008** — Lex Architecture Integrations — COMPLETE (commit 974239e)

## What's Live (permanent infrastructure)
| Service | URL | Status |
|---------|-----|--------|
| Mission Control | http://100.70.46.41:3000 | LIVE |
| DC Data Hub | http://100.70.46.41:3001 | LIVE |
| X RSS Feed | Railway (deployed) | LIVE |
| OpenClaw | localhost:34931 | LIVE |

## Open Tasks
| ID | Task | Status | Next Action |
|----|------|--------|-------------|
| TASK-007 | DC Data Hub | active — built, deploy pending | Railway login → deploy new project → Day 3 audit |
| TASK-006 | Build 3 Missing Skills | planned | Revisit after DC Hub deployed |

## Last Session Summary (2026-03-21)
- DC Data Hub Phase 1 + revisions complete (auth gate, 11 sections, ticker bar, X Feed categorized, Deeper Insight, Bull/Bear 5 assets, Watching parser fixed)
- Tank-shell-security, injection-defense v1.1, x-post-automator v2, first-principles-thinking skills pushed to GitHub
- Lex architecture assessment completed — 7 integrations planned (TASK-008)
- Security emails to Lex + Hal confirmed sent 2026-03-20 (5 sends, most recent 20:24)
- Tailscale issue resolved (phone was on wrong account — frankrussobiz@ vs rex@hitnetwork.io)
- PR-042, PR-043 added (coding agent verification + scope limits)
- Full workspace backup: ~/Desktop/openclaw-backups/openclaw-backup-2026-03-21-1308 (2.1GB)

## Blockers
- Nansen API key (awaiting from Kelly)
- Railway CLI needs `railway login` (browser auth required) before DC Data Hub can deploy
- Claude Code CLI credits subject to Claude.ai subscription limits (kelly@bitlabacademy.com)

## Recent Decisions (last 7 days)
| Date | Decision | Status |
|------|----------|--------|
| 2026-03-21 | DC Data Hub password: dcgodmode26 | ACTIVE |
| 2026-03-21 | Ticker bar = crypto only (no equities/commodities) | ACTIVE |
| 2026-03-21 | DXY signal inverted in Bull/Bear (rising = bearish for crypto) | ACTIVE |
| 2026-03-21 | No X/YT buttons on DC Hub (Mission Control only) | ACTIVE |
| 2026-03-21 | Dev port = 3001 (3000 reserved for Mission Control) | ACTIVE |
| 2026-03-21 | Tailscale account for devices: rex@hitnetwork.io (not frankrussobiz@) | ACTIVE |
| 2026-03-21 | Claude Code CLI = Claude.ai subscription, NOT API credits | ACTIVE |

## Key People
- Kelly Kellam — Principal. Telegram: 1011362712. PST timezone.
- TJ Shedd — Hit Network leadership
- Lex — Hit Network AI (GitHub: LexClaw/Lex-Workspace, operator: TJ)
- Hal — Hit Network Discord AI (operator: Tim)

## Full Capabilities
See SELF.md
