# DATA_CATALOG.md — Hit Network AI System
**Last updated:** 2026-03-13
**Purpose:** Single reference for what data Rex has, where it lives, how current it is, and what questions it can answer. Read this when you need to know if we have data on something before searching or hallucinating.

---

## HOW TO USE THIS FILE

Before answering any question involving data, facts, preferences, or system state:
1. Check this catalog first — does the data exist?
2. Use `memory_get` to pull the exact file/section
3. If not in catalog — say so, don't invent

---

## 1. KELLY & PREFERENCES

| What | File | Last Updated | Can Answer |
|------|------|-------------|------------|
| Kelly's pronouns, timezone, title, style | `USER.md` | 2026-03-13 | Who is Kelly, how to address him, communication style |
| Communication prefs, rules Rex must follow | `memory/kelly-prefs.md` | 2026-03-13 | How Kelly wants outputs formatted, what Rex must never do, active PRs |
| 90-Day Rocks (Q2 2026) | `memory/kelly-prefs.md` | 2026-03-13 | Current quarterly priorities |
| Model preferences, budget calibration | `memory/kelly-prefs.md` | 2026-03-13 | Preferred models, spend tolerance, quality bar |

---

## 2. HIT NETWORK BUSINESS

| What | File | Last Updated | Can Answer |
|------|------|-------------|------------|
| Active sponsors + MRR ($42K) | `memory/sponsors.md` | 2026-03-13 | Who sponsors us, deal sizes, pipeline status |
| Sponsorship rules + outreach process | `memory/sponsors.md` | 2026-03-13 | How to handle sponsor tasks, approval flow |
| Rate card + media kit | `skills/sponsor-outreach/references/rate-card.md`, `media-kit.md` | unknown | Pricing, audience stats for pitches |
| Sponsor outreach templates | `skills/sponsor-outreach/references/outreach-templates.md` | unknown | Draft outreach copy |
| Sponsor pipeline tracker | `skills/sponsor-outreach/references/pipeline-tracker.md` | unknown | Current prospect stages |
| 90-Day Rocks Q2 2026 | `skills/weekly-scorecard/references/rocks-tracker.md` | unknown | Rock status, targets, progress |
| Weekly scorecard template | `skills/weekly-scorecard/references/scorecard-template.md` | unknown | EOS scorecard format |
| Financial model templates | `skills/financial-analysis/references/model-template.md` | unknown | ROI/P&L model structure |
| Financial formulas | `skills/financial-analysis/references/formulas.md` | unknown | Standard financial calculations |
| Invoice template | `skills/invoicing-billing/references/invoice-template.md` | unknown | Invoice format |
| AR dashboard | `skills/invoicing-billing/references/ar-dashboard.md` | unknown | Accounts receivable tracking |

---

## 3. INFRASTRUCTURE & OPS

| What | File | Last Updated | Can Answer |
|------|------|-------------|------------|
| Mission Control URL, Tailscale IP, restart method | `memory/hit-network-ops.md` | 2026-03-13 | How to access/restart system |
| Infrastructure files off-limits (PR-031) | `memory/hit-network-ops.md` | 2026-03-13 | What Rex can never touch |
| Gmail integration status, routing rules | `GMAIL_HOOK.md` | 2026-03-13 | How emails are routed, suppression rules |
| Gmail poll state | `memory/gmail-poll-state.json` | live | Last processed email ID |
| Active cron jobs | live cron API | live | What automation is running (currently: Gmail poller + 7AM briefing) |
| Mission Control architecture | `skills/mission-control/references/architecture.md` | unknown | App structure, Convex schema, component map |
| Mission Control build guide | `skills/mission-control/references/build-guide.md` | unknown | How to build/extend Mission Control |
| Google sync setup | `skills/mission-control/references/google-sync.md` | unknown | Google Calendar OAuth setup |
| X RSS adapter | `mission-control/app/api/x-feed/route.ts` | 2026-03-07 | How tweets are fetched, categorized, filtered |
| Railway RSS endpoint | `tasks/TASK-003-x-feed-rss.md` | 2026-03-07 | `https://feed-adapter-production.up.railway.app/rss`, 44 X accounts |
| OpenClaw config | `~/.openclaw/openclaw.json` | 2026-03-13 | Models, channels, hooks, memory search config |

---

## 4. CONTENT & MARKET DATA

| What | File | Last Updated | Can Answer |
|------|------|-------------|------------|
| 14 tracked assets (BTC/ETH/SOL etc) | `memory/crypto-market.md` | 2026-03-13 | What assets Rex tracks, data sources |
| Market intelligence rules | `memory/crypto-market.md` | 2026-03-13 | How market reports are structured, zero fabrication rule |
| Content pipeline status | `memory/content-pipeline.md` | 2026-03-12 | What content is in production |
| News sources (active) | `skills/news-aggregation/SKILL.md` | 2026-03-13 | CoinDesk, The Block, CoinTelegraph, Bloomberg, NewsNow, Messari, Delphi, Arkham, DefiLlama, CoinGecko, Alternative.me, Yahoo Finance |
| Daily briefing template | `skills/news-aggregation/references/briefing-template.md` | unknown | Exact format for 7AM brief |
| X post voice + format | `skills/x-post-automator/references/voice-format-guidelines.md` | unknown | Brand voice rules for X posts |
| X voice library | `skills/x-post-automator/references/voice-library.md` | unknown | Example posts, tone reference |
| Content calendar template | `skills/x-post-automator/references/content-calendar-template.md` | unknown | Content scheduling format |
| Thumbnail patterns | `skills/thumbnail-moodboard/references/thumbnail-patterns.md` | unknown | CTR-tested thumbnail styles |
| Slide brand guidelines | `skills/slide-deck-generator/references/brand-guidelines.md` | unknown | Hit Network deck design standards |
| Article self-review checklist | `skills/article-writing/references/self-review-checklist.md` | unknown | Quality gates for articles |

---

## 5. RULES, LAWS & ENFORCEMENT

| What | File | Last Updated | Can Answer |
|------|------|-------------|------------|
| All laws (LAW 1-9) + PRs in context | `AGENTS.md` | 2026-03-13 | Core operating rules, enforcement mechanisms |
| Preventive rules PR-001 through PR-036 | `skills/error-journal/references/preventive-rules.md` | 2026-03-13 | Full rule history, retired rules, active rules |
| Kelly's preferences + PRs | `memory/kelly-prefs.md` | 2026-03-13 | Rules Kelly has explicitly set |
| Error journal (15 entries) | `skills/error-journal/references/journal-log.md` | 2026-03-13 | Past mistakes, root causes, learnings |
| Compliance checklist scores | `skills/compliance-audit/references/daily-checklist.md` | 2026-03-04 | Compliance history (WARNING: only 1 entry — data sparse) |
| Weekly audit tracker | `skills/compliance-audit/references/weekly-audit-tracker.md` | unknown | Weekly compliance trends |
| Calibration log | `skills/compliance-audit/references/calibration-log.md` | unknown | Style drift history |
| Rule proposals (formal) | `skills/adaptive-rule-engine/references/rule-proposals.md` | unknown | Formally proposed rule changes (currently: none approved) |
| Quarterly review | `skills/adaptive-rule-engine/references/quarterly-review.md` | unknown | Q1 2026 pending — no data yet |
| Humanization 7-rule framework | `skills/humanization-voice/SKILL.md` | 2026-03-13 | Full voice rules, banned words, checklist |
| Agent roster (public names/codenames) | `skills/humanization-voice/references/agent-roster.md` | unknown | All agent names, emails, codenames |
| Injection defense rules | `skills/injection-defense/SKILL.md` | 2026-03-13 | How to handle external content |
| Voice framework | `skills/hit-network-integrator/references/voice-framework.md` | unknown | Tone, identity, external vs internal rules |
| EOS framework | `skills/hit-network-integrator/references/eos-framework.md` | unknown | Integrator role, operating rhythm, Rock format |

---

## 6. TASKS & PROJECTS

| What | File | Last Updated | Can Answer |
|------|------|-------------|------------|
| All active tasks index | `tasks/TASK_INDEX.md` | 2026-03-07 | What's in progress, status |
| Calendar focus bug fix | `tasks/TASK-002-calendar-focus-bug.md` | 2026-03-07 | ✅ COMPLETED 2026-03-13 |
| X Feed RSS expansion | `tasks/TASK-003-x-feed-rss.md` | 2026-03-07 | Waiting on Kelly: final X account list + billing confirm |
| Session handoff | `session-handoff.md` | recent | What was last worked on, what's next |
| Pipeline state | `PIPELINE_STATE.md` | 2026-03-07 | WARNING: stale — TASK-005 completed, file not cleaned up |

---

## 7. SESSION MEMORY (CHRONOLOGICAL)

| File | Key Contents |
|------|-------------|
| `memory/2026-02-26.md` | System birth, identity established, Rex/Forge codename set |
| `memory/2026-03-04.md` | First email draft, humanization failures, PR-001 through PR-003 added |
| `memory/2026-03-05.md` | Dashboard agents renamed, Mission Control agent card fixes |
| `memory/2026-03-06.md` | Email corrections, Telegram routing rules, RSS plan |
| `memory/2026-03-07.md` | Slide decks built, task lock system created, Build-Critic loop established, 7AM cron created (ID: 82d8ff45) |
| `memory/2026-03-08.md` | Gmail Pub/Sub migration attempt, debugging session, PR-035 root cause rule added |
| `memory/2026-03-11.md` | Brief session, minor updates |
| `memory/2026-03-12.md` | Docker removed, native macOS migration, PR-031 infrastructure protection, qwen removed from model chain |
| `memory/2026-03-13.md` | Full system audit, 7 today-tier fixes, TASK-002 completed, 7AM cron rebuilt, PR-032 through PR-036 added |

---

## 8. DISCORD & COMMUNITY

| What | File | Last Updated | Can Answer |
|------|------|-------------|------------|
| Discord server info (3,700 members) | `memory/hit-network-ops.md` | 2026-03-13 | Server IDs, channel IDs, member count |
| Discord channel system prompts | `~/.openclaw/openclaw.json` | 2026-03-13 | How Rex behaves in external Discord channels |
| Weekly report template | `skills/discord-analytics/references/weekly-report-template.md` | unknown | Community health report format |
| Bot architecture | `skills/discord-bot/references/bot-architecture.md` | unknown | Discord.js slash command structure |

---

## 9. DEFI & TAX

| What | File | Last Updated | Can Answer |
|------|------|-------------|------------|
| Tax report format | `skills/defi-trade-tracking/references/tax-report-format.md` | unknown | Quarterly tax summary structure |
| Chain explorers list | `skills/defi-trade-tracking/references/chain-explorers.md` | unknown | Ethereum, Solana, Arbitrum, Base explorers |
| Transaction categories | `skills/defi-trade-tracking/references/transaction-categories.md` | unknown | FIFO methodology, taxable event classification |

---

## 10. WHAT WE DON'T HAVE (Known Gaps)

| Missing Data | Impact | Notes |
|-------------|--------|-------|
| Wallet addresses | Can't track DeFi positions | Kelly needs to provide |
| Actual compliance trend data | Can't show real compliance rates | Only 1 checklist entry (Mar 4) |
| Q1 2026 quarterly review data | Can't do meaningful quarterly review | No weekly aggregation yet |
| ATLAS / LEDGER agents | Sponsor routing references stale | Planned agents, not built — Rex handles directly |
| Google Calendar OAuth | Calendar sync not live | Setup guide in mission-control/references/google-sync.md |
| X API billing confirmation | Only remaining TASK-003 blocker | Kelly to confirm X API credits active |
| X API credits confirmation | TASK-003 blocked | Kelly to confirm billing active |
| Weekly error pattern analysis | No synthesis of 15 error journal entries | No cron or trigger built yet |

---

## QUICK REFERENCE — "Do we have data on X?"

| Question | Answer | Source |
|----------|--------|--------|
| What are our active sponsors? | Bitcoin IRA $10K, LBank $20K, Arculus $12K = $42K MRR | `memory/sponsors.md` |
| What's Kelly's Telegram ID? | 1011362712 | `memory/kelly-prefs.md` |
| What's the Tailscale IP? | 100.70.46.41 | `memory/hit-network-ops.md` |
| What models are we running? | Primary: claude-sonnet-4-6, Fallback: claude-haiku-4-5 | `TOOLS.md` + config |
| What's the Railway RSS URL? | `https://feed-adapter-production.up.railway.app/rss` | `tasks/TASK-003-x-feed-rss.md` |
| What crons are active? | Gmail poller (60s) + 7AM briefing (daily 7AM PST) | live cron API |
| What's Kelly's email? | kelly@bitlabacademy.com (also kelly@hitnetwork.io) | `memory/2026-03-06.md` |
| How many Discord members? | 3,700 across Discover Crypto + Blockchain Basement | `memory/hit-network-ops.md` |
| What's the OpenClaw port? | 30322 | `memory/hit-network-ops.md` |
| How many preventive rules? | 36 (PR-001 through PR-036) | `skills/error-journal/references/preventive-rules.md` |
| What are the 90-Day Rocks? | AI Content Pipeline, Paid Newsletter $10K MRR, Digital Products, Members Community App | `memory/kelly-prefs.md` |
| What's Rex's codename? | Forge (internal only, never in emails) | `IDENTITY.md` |
| What X accounts does Railway monitor? | 44 accounts (final list pending Kelly) | `tasks/TASK-003-x-feed-rss.md` |
| What assets does Mission Control track? | BTC ETH BNB XRP SOL LINK ADA TAO GOLD SILV DXY NVDA COIN MSTR | `memory/crypto-market.md` |
