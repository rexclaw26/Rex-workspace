# Hit Network Skill System Map
**Last updated:** 2026-03-14
**Total skills installed:** 27

---

## Layer 1 — Always-Active (fire on every session, no trigger needed)

| Skill | What it does |
|-------|-------------|
| `humanization-voice` | 7-rule humanization on ALL written output |
| `injection-defense` | Guards against prompt injection from external content |
| `error-journal` | Logs every mistake with root cause + preventive rules |
| `compliance-audit` | Daily 17-point self-check after every deliverable |
| `hit-network-integrator` | Core identity, anti-hallucination, EOS framework |
| `quality-gatekeeper` | Senior critic sub-agent — PLAN REVIEW + OUTPUT REVIEW |
| `skill-performance-tracker` | Passive JSONL execution logger — appends record after every skill invocation |

---

## Layer 2 — Operational Skills (triggered by task type)

### Content Production
| Skill | Trigger | Pulls from | Feeds into |
|-------|---------|-----------|-----------|
| `news-aggregation` | News requests, 7AM briefing | Web sources | `article-writing`, `x-post-automator`, `weekly-scorecard` |
| `article-writing` | "write an article", "blog post" | `news-aggregation`, `seo-audit`* | `x-post-automator`, `content-pipeline` |
| `x-post-automator` | "tweet", "X post", "thread" | `news-aggregation`, `content-strategy`* | `content-pipeline` |
| `video-editing-director` | "edit video", "B-roll" | `content-pipeline` | `content-pipeline` |
| `thumbnail-moodboard` | "thumbnail", "mood board" | Topic/content brief | `content-pipeline` |
| `content-pipeline` | "pipeline", "what's in production" | All content skills | Kelly approval |
| `slide-deck-generator` | "pitch deck", "slides for" | `strategic-consulting` | Kelly |

*pending skill install

### Business
| Skill | Trigger | Pulls from | Feeds into |
|-------|---------|-----------|-----------|
| `email-assistant` | Any email request | — | External (after approval) |
| `email-signature` | Any email composition | — | `email-assistant` |
| `scheduling-optimizer` | Calendar/meeting requests | Calendar data | Kelly approval |
| `sponsor-outreach` | "find sponsors", "pitch to" | `financial-analysis`, `strategic-consulting` | `email-assistant` |
| `financial-analysis` | "ROI", "P&L", "forecast" | Live data sources | `sponsor-outreach`, `weekly-scorecard` |
| `invoicing-billing` | "invoice", "AR" | Billing system | Kelly approval |
| `strategic-consulting` | "strategy", "brainstorm" | `news-aggregation`, `financial-analysis` | `slide-deck-generator`, `sponsor-outreach` |
| `weekly-scorecard` | "weekly scorecard", Monday | `content-pipeline`, `discord-analytics`, `financial-analysis`, `news-aggregation` | Kelly |

### Technical
| Skill | Trigger | Pulls from | Feeds into |
|-------|---------|-----------|-----------|
| `website-design` | "build a page", "landing page" | `ui-ux-pro-max`*, `frontend-design-ultimate`* | `code-review`* → deployment gate |
| `mission-control` | "Mission Control", "dashboard" | Convex data | Kelly |
| `discord-analytics` | "Discord analytics" | Discord API | `discord-bot`, `weekly-scorecard` |
| `discord-bot` | "Discord bot", "automate Discord" | `discord-analytics` | Discord server |

### Personal/Financial
| Skill | Trigger | Pulls from | Feeds into |
|-------|---------|-----------|-----------|
| `defi-trade-tracking` | "DeFi trades", "tax prep" | On-chain data | Tax report |
| `web-data-spreadsheet` | "pull data", "compile data" | APIs | Spreadsheet output |

### System/Meta
| Skill | Trigger | Pulls from | Feeds into |
|-------|---------|-----------|-----------|
| `adaptive-rule-engine` | "rule proposal", "system review" | `error-journal` | Rule proposals → Kelly |
| `role-identity` | Daily reports, system health | Live system data | Kelly |
| `quality-gatekeeper` | All plans (3+ steps) + all deliverables | Task context | Approval/revision loop |
| `skill-intake-protocol` | Any new skill install request | System map (this file) | Skill installation |

*pending install

---

## Layer 3 — Pending Install (approved, not yet installed)

| Skill | Source | Status | Notes |
|-------|--------|--------|-------|
| `prompt-engineering-expert` | openclaw/skills — tomstools11 | ✅ INSTALLED 2026-03-14 | Hierarchy rule: n/a |
| `marketing-mode` | openclaw/skills — thesethrose | ✅ INSTALLED 2026-03-14 | Hierarchy rule injected |
| `superdesign` | openclaw/skills — mpociot | ✅ INSTALLED 2026-03-14 | Clean install |
| `frontend-design-ultimate` | kesslerio GitHub repo | ✅ INSTALLED 2026-03-14 | Clean install |
| `seo-audit` | Custom build | Not started | Research first, Hit Network specific |
| `content-strategy` | Custom build | Not started | 6 content pillars baked in |
| `copywriting` | Custom build | Not started | Hit Network brand voice |
| `ui-ux-pro-max` | Custom build | Not started | Mission Control context |
| `next-best-practices` | Custom build | Not started | App Router + Convex + Tailwind |
| `code-review` | Custom build | Not started | Security-first, our stack |
| `prompt-engineering-patterns` | Custom build | Not started | Companion to expert |
| Expo mobile (4 skills) | TBD | Dormant | Install when app build starts |

---

## Orchestration Flows (current state)

### Content Publish Flow
```
news-aggregation + seo-audit* + discord-analytics
    → content-strategy* (calendar)
    → article-writing (outline gate → draft → sub-agent proof)
    → x-post-automator (social cut, 3 versions → Kelly approves)
    → content-pipeline (logged)
    → Kelly approves → Published
```
*pending install

### Sponsor Pitch Flow
```
strategic-consulting (positioning memo)
    → marketing-mode* (campaign strategy layer)
    → financial-analysis (ROI model)
    → copywriting* (pitch copy framework)
    → sponsor-outreach (personalized draft → sub-agent proof)
    → slide-deck-generator (deck if needed → design sub-agent review)
    → email-assistant (send gate)
    → Kelly approves → Sent
```
*pending install

### Weekly Scorecard Flow
```
seo-audit* (monthly rankings)
    + content-pipeline (published this week)
    + discord-analytics (community health)
    + financial-analysis (revenue)
    + news-aggregation (top stories)
    + content-strategy* (plan vs. actual)
    → weekly-scorecard (assembles EOS scorecard)
    → error-journal (flags issues)
    → Kelly (Monday morning)
```
*pending install

---

## SEO Scope Rule
*(confirmed Kelly 2026-03-14)*

`seo-audit` feeds: articles, YouTube titles/descriptions, website pages only.
`seo-audit` does NOT feed: X posts (algorithm-driven, not search-indexed), Discord, internal docs.
X posts driven by: `news-aggregation` (trending) + `content-strategy` (thematic alignment).

---

## Overlap Hierarchy Rules

| New Skill | Overlaps With | Hierarchy Rule |
|-----------|--------------|----------------|
| `marketing-mode` | `seo-audit`, `copywriting`, `x-post-automator` | marketing-mode = strategic layer (selects playbook). Specific skills = execution layer (run their own full gates). marketing-mode never overrides specific skill procedures. |
| `frontend-design-ultimate` | `website-design` | frontend-design-ultimate = component-level depth. website-design = project architecture + full workflow. Load together on frontend tasks. |
| `superdesign` | `website-design`, `slide-deck-generator` | superdesign = UI guidelines reference. website-design and slide-deck-generator remain the workflow owners. |
| `content-strategy` | `content-pipeline` | content-strategy = planning (what to make). content-pipeline = execution tracking (what's in flight). Not redundant — complementary. |

---

## Consolidation Decisions
*(not standalone skills — folded into existing)*

| Skill Name | Decision | Location |
|-----------|----------|----------|
| `nodejs-backend-patterns` | Reference file | `website-design/references/nodejs-patterns.md` |
| `nextjs-app-router-patterns` | Reference file | `next-best-practices/references/nextjs-patterns.md` (after next-best-practices is built) |

---

## Update Log

| Date | Change |
|------|--------|
| 2026-03-14 | System map created. 26 skills mapped. 4 community + 7 custom + 4 Expo pending. skill-intake-protocol installed as skill #27. |
| 2026-03-14 | Installed 4 community skills: prompt-engineering-expert, marketing-mode (+ hierarchy rule), superdesign, frontend-design-ultimate. Total: 31 skills. |
| 2026-03-17 | Installed lossless-claw LCM plugin (context engine, not a skill). Session reset set to 7-day idle. |
| 2026-03-17 | Built skill-performance-tracker Phase 1 (passive execution logger). Added to always-active layer. |
