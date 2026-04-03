# ROUTING.md — Skill Routing Table
_Last Verified: 2026-03-30 | Max size: 4,000 chars | Flag stale if >7 days old_
_This file is a routing convenience layer. It is derived from system-map.md (inventory) and AGENTS.md (rules). When they conflict, those are authoritative. Do not treat ROUTING.md as source of truth for rule definitions._

---

## Task Type Taxonomy

| Type | Trigger phrases |
|------|----------------|
| content | article, write, blog post, newsletter, script, caption, thread |
| x-post | tweet, X post, social post, post this, rewrite this post |
| research | search, find, what's happening, market update, briefing |
| analysis | analyze, financial model, forecast, P&L, ROI, should we |
| strategy | strategy, brainstorm, plan, McKinsey, first principles, pitch |
| email | email, inbox, reply to, draft a reply, send to |
| seo | SEO, keyword, rank, organic, optimize |
| design-ui | build a page, landing page, dashboard, frontend, UI, component |
| infra-code | fix this, deploy, build feature, refactor, Railway, Mission Control |
| slide-deck | slide deck, pitch deck, presentation, slides for |
| video | EDL, B-roll, edit this video, clip, video editing |
| sponsor | sponsor, outreach, brand deal, media kit, pipeline |
| finance | invoice, billing, AR, financial analysis, P&L |
| scheduling | schedule, calendar, meeting, agenda |
| discord | Discord analytics, community data, bot, Discord report |
| defi | DeFi, wallet, on-chain, trade history, tax |

---

## Skill Chains by Task Type

Each chain shows the skills to load in order. Always-active skills (humanization-voice, injection-defense, error-journal) apply to all tasks and don't need to be listed.

**content** (articles, newsletters, scripts):
1. `news-aggregation` — pull current context on the topic
2. `content-strategy` — check calendar alignment and keyword targets
3. `seo-audit` — pull keyword data if SEO-optimized output needed
4. `article-writing` — produce the content
5. `quality-gatekeeper` — OUTPUT REVIEW before delivery

**x-post** (X/Twitter posts):
1. `news-aggregation` — current context if topic-driven
2. `x-post-automator` — post format, DC voice, humanization rules
3. `quality-gatekeeper` — OUTPUT REVIEW before delivery

**research** (news, market briefings, data pulls):
1. `news-aggregation` — primary research skill
2. `web-data-spreadsheet` — if output is tabular/data
3. `quality-gatekeeper` — OUTPUT REVIEW if delivered to Kelly

**analysis** (financial models, ROI, P&L, strategy):
1. `financial-analysis` — primary analysis skill
2. `strategic-consulting` — if business decision framing needed
3. `quality-gatekeeper` — PLAN REVIEW + OUTPUT REVIEW (financial figures mandatory)

**strategy** (brainstorm, positioning, McKinsey):
1. `strategic-consulting` — primary skill
2. `quality-gatekeeper` — OUTPUT REVIEW before delivery

**email**:
1. `email-assistant` — triage, draft, manage Kelly's inbox
2. `email-signature` — signature format for any outbound
3. `quality-gatekeeper` — OUTPUT REVIEW before any send

**seo**:
1. `seo-audit` — keyword research, technical audit, optimization
2. `content-strategy` — if feeding into a content plan
3. `quality-gatekeeper` — OUTPUT REVIEW

**design-ui** (landing pages, dashboards, static sites):
- New project or major feature: `frontend-design-ultimate` (full component depth)
- Style guidance only: `superdesign` (UI patterns reference, not build guide)
- Full project with backend: `website-design` (project workflow + architecture)
- Always add: `quality-gatekeeper` — PLAN REVIEW before building

**infra-code** (Mission Control, Railway, fixes, refactors):
1. `mission-control` — if MC-specific
2. `coding-agent` skill (system) — sub-agent for build tasks
3. `quality-gatekeeper` — PLAN REVIEW before build + OUTPUT REVIEW after

**slide-deck**:
1. `slide-deck-generator` — structure, content, speaker notes
2. `quality-gatekeeper` — OUTPUT REVIEW before delivery

**video**:
1. `video-editing-director` — EDL, B-roll, clips
2. `thumbnail-moodboard` — if thumbnails needed
3. `quality-gatekeeper` — OUTPUT REVIEW

**sponsor**:
1. `sponsor-outreach` — research, pipeline, pitch drafts
2. `email-assistant` — for actual outreach emails
3. `quality-gatekeeper` — OUTPUT REVIEW (external send — mandatory)

**finance**:
1. `financial-analysis` — primary skill
2. `invoicing-billing` — if invoice/AR specific
3. `quality-gatekeeper` — OUTPUT REVIEW (financial figures — mandatory)

**scheduling**:
1. `scheduling-optimizer` — calendar, meeting prep, agenda
2. `quality-gatekeeper` — OUTPUT REVIEW before any calendar send

**discord**:
1. `discord-analytics` — community data
2. `discord-bot` — automation/bot work
3. `quality-gatekeeper` — OUTPUT REVIEW

**defi**:
1. `defi-trade-tracking` — wallet, on-chain, tax prep
2. `financial-analysis` — realized P&L, taxable event framing, cost basis
3. `quality-gatekeeper` — OUTPUT REVIEW

---

## Skill Hierarchy (overlap resolution)

When multiple design skills could apply, use this hierarchy:

| Situation | Use |
|-----------|-----|
| Building a new page or feature from scratch | `frontend-design-ultimate` |
| UI style reference / color / typography guidance only | `superdesign` |
| Full project with routing, backend, and architecture | `website-design` |
| SEO + content overlap | `seo-audit` for keywords, `article-writing` for production |
| Strategy + analysis overlap | `strategic-consulting` for framing, `financial-analysis` for numbers |
| Marketing overlap | `marketing-mode` is the strategic layer; load specific skill (seo-audit, x-post-automator) for execution |

---
