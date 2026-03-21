# Skill System Analysis & Wiring Plan
**Date:** 2026-03-14
**Status:** Draft — awaiting Kelly review before any changes

---

## Part 1: Full Skill Inventory (26 skills)

### Always-Active Layer (run on every session, no trigger needed)
These aren't skills I "load" — they're laws baked into AGENTS.md and run constantly:

| Skill | What it does |
|-------|-------------|
| `humanization-voice` | Every written output passes 7-rule humanization check |
| `injection-defense` | Guards against prompt injection from external content |
| `error-journal` | Logs every mistake, near-miss, quality failure automatically |
| `compliance-audit` | Self-check after every deliverable turn |
| `hit-network-integrator` | Core identity, anti-hallucination, EOS framework |

### Operational Layer (triggered by task type)

| Skill | Trigger | What it really does |
|-------|---------|-------------------|
| `article-writing` | "write an article", "blog post" | Plans → outline gate → writes → humanizes |
| `news-aggregation` | News requests, 7AM briefing cron | Monitors sources, scores virality + relevance, alerts on 8+ stories |
| `x-post-automator` | "tweet", "X post", "thread" | Drafts with brand voice, queues for approval |
| `video-editing-director` | "edit video", "B-roll", "repurpose" | EDLs, clip selections, post-production checklists |
| `thumbnail-moodboard` | "thumbnail", "mood board" | Visual concepts, A/B test variants, CTR tracking |
| `content-pipeline` | "pipeline", "what's in production" | 7-stage tracker (Idea → Published) inside Mission Control |
| `slide-deck-generator` | "pitch deck", "slides for" | Outline first → full slide content with speaker notes |
| `website-design` | "build a page", "landing page" | React/Next.js + Tailwind, architecture first |
| `mission-control` | "Mission Control", "dashboard" | Next.js + Convex app guidance |
| `email-assistant` | Any email request | Triage → draft → approval gate before send |
| `email-signature` | Any email composition | Correct signature format for every email |
| `scheduling-optimizer` | Calendar/meeting requests | Analysis + options, never confirms without approval |
| `sponsor-outreach` | "find sponsors", "pitch to" | Research → draft → approval gate before send |
| `financial-analysis` | "ROI", "P&L", "model", "forecast" | Sourced figures, confidence levels, never estimates as actuals |
| `invoicing-billing` | "invoice", "AR", "who owes us" | Invoice generation, AR tracking, escalation protocol |
| `strategic-consulting` | "strategy", "brainstorm", "should we" | McKinsey frameworks, competitive analysis, exec memos |
| `defi-trade-tracking` | "DeFi trades", "tax prep", "P&L" | FIFO P&L, taxable events, CPA handoff |
| `web-data-spreadsheet` | "pull data", "scrape", "build a dataset" | API pulls, structured tabular output |
| `discord-analytics` | "Discord analytics", "community data" | Health metrics, sentiment, channel performance |
| `discord-bot` | "Discord bot", "automate Discord" | Bot dev in Discord.js or discord.py |

### System Layer (meta — run on rules/versioning/quality)

| Skill | What it does |
|-------|-------------|
| `adaptive-rule-engine` | Tracks system version (v10.0), proposes rule improvements from error data |
| `compliance-audit` | Daily 17-point self-check, weekly audit, monthly calibration |
| `error-journal` | Running error log with root cause + preventive rules |
| `role-identity` | Kelly's (Forge's) operating config, daily rhythm, budget tracking |

---

## Part 2: What's Working Well

**Clear triggers, no overlap:**
- Article writing, X posts, email, slides, invoicing — each has clean, distinct trigger phrases that don't step on each other.
- The always-active layer (humanization, injection defense, error journal) runs silently without needing to be invoked.

**Strong content production chain:**
`news-aggregation` → `article-writing` → `x-post-automator` → `content-pipeline`
These four already flow naturally together. News surfaces a story, article skill writes it, X skill clips it for social, pipeline tracks it.

**Video production chain:**
`thumbnail-moodboard` → `video-editing-director` → `content-pipeline`
Thumbnail concepts feed the pipeline, EDLs guide editing, pipeline tracks status.

---

## Part 3: What's NOT Wired (Current Gaps)

### Gap 1: No sub-agent critique loop on written content
Right now when Rex writes an article or email, it's self-reviewed only (Rex checks its own work). There's no independent sub-agent running the LAW 1 proof check as a separate pass. The template exists in AGENTS.md but it's not consistently spawned.

**Fix:** Any deliverable content (article, email, X thread, slide deck, sponsor pitch) should spawn a proofreader sub-agent automatically, get PASS/FAIL back, then present content only after PASS.

### Gap 2: Skills don't explicitly call each other
`sponsor-outreach` should pull from `financial-analysis` to include ROI data in pitches. It doesn't. `article-writing` should pull from `news-aggregation` for source material. It kind of does informally, but it's not explicit in the skill file. `strategic-consulting` should feed `slide-deck-generator` when a strategy memo becomes a presentation. No handoff defined.

**Fix:** Define explicit "downstream skills" in each skill file so the chain is automatic, not accidental.

### Gap 3: `weekly-scorecard` has no live data pipeline
The Monday Scorecard skill exists but it manually reaches for data. It should auto-pull from: `content-pipeline` (what published), `news-aggregation` (top stories), `discord-analytics` (community health), `financial-analysis` (revenue metrics). None of those connections are formally wired.

**Fix:** Scorecard skill gets an explicit data-pull checklist that hits each data source before writing.

### Gap 4: `error-journal` outputs don't feed `adaptive-rule-engine`
Errors get logged. The adaptive rule engine is supposed to propose improvements based on error patterns. But there's no explicit trigger for the rule engine to review the journal and surface patterns. It's manual.

**Fix:** After every 5 error log entries, adaptive-rule-engine should auto-review and propose a rule update for Kelly approval.

### Gap 5: No task routing intelligence
When Kelly asks for something complex — "write an article about this news story and schedule X posts for it" — Rex handles it in one skill context. But it should be orchestrated: news-aggregation confirms the story is real and sourced, article-writing produces the draft, proofreader sub-agent verifies, x-post-automator creates the social cut, content-pipeline logs it. That full chain isn't wired.

---

## Part 4: Proposed Wiring Changes

### Priority 1 — Sub-agent critique loop (biggest quality win)
Add to: `article-writing`, `email-assistant`, `sponsor-outreach`, `x-post-automator`, `slide-deck-generator`

**Pattern:**
```
1. Rex produces draft
2. Rex spawns sub-agent with LAW 1 proofreader template
3. Sub-agent returns PASS or FAIL with specific violations
4. If FAIL: Rex fixes violations, re-runs sub-agent
5. If PASS: Present to Kelly
```

### Priority 2 — Explicit skill chains
Define "feeds into" and "pulls from" for each skill:

| Skill | Pulls from | Feeds into |
|-------|-----------|-----------|
| `article-writing` | `news-aggregation` (source material) | `x-post-automator`, `content-pipeline` |
| `sponsor-outreach` | `financial-analysis` (ROI data), `strategic-consulting` (positioning) | `email-assistant` (final send) |
| `strategic-consulting` | `financial-analysis`, `news-aggregation` | `slide-deck-generator`, `weekly-scorecard` |
| `news-aggregation` | web sources | `article-writing`, `x-post-automator`, `weekly-scorecard` |
| `weekly-scorecard` | `content-pipeline`, `discord-analytics`, `financial-analysis`, `news-aggregation` | `error-journal` (issues flagged) |
| `thumbnail-moodboard` | `article-writing`/`video-editing-director` (topic/content) | `content-pipeline` |
| `video-editing-director` | `content-pipeline` (stage trigger) | `content-pipeline` (advance stage) |

### Priority 3 — Complex task orchestration routing
Define standard multi-skill task flows:

**"Write and publish a piece of content"**
1. `news-aggregation` → verify story + sources
2. `article-writing` → draft + outline gate
3. Sub-agent proofreader → PASS required
4. `x-post-automator` → social cut for approval
5. `content-pipeline` → log as "Review" stage
6. Human approves → `content-pipeline` advances to "Published"

**"Build a sponsor pitch"**
1. `strategic-consulting` → positioning memo
2. `financial-analysis` → ROI model for sponsor
3. `sponsor-outreach` → personalized pitch draft
4. Sub-agent proofreader → PASS required
5. `slide-deck-generator` → deck version if needed
6. Human approves → `email-assistant` handles send

**"Weekly Scorecard"**
1. `content-pipeline` → what published this week
2. `discord-analytics` → community health
3. `news-aggregation` → top 5 stories
4. `financial-analysis` → revenue metrics
5. `weekly-scorecard` → assembles EOS scorecard
6. `error-journal` → flag any quality issues from the week

---

## Part 5: New Skills to Install (from Master Skills Report)

### Install Now (Priority — zero risk, immediate value)
- `prompt-engineering-expert` — better prompts = better everything
- `prompt-engineering-patterns` — chain-of-thought, few-shot, structured outputs
- `boost-prompt` — interactive prompt refinement
- `marketing-mode` — 23 marketing playbooks in one
- `copywriting` — homepage, CTAs, landing pages
- `seo-audit` — diagnose + fix SEO on DC + BB
- `content-strategy` — data-driven content calendars
- `frontend-design-ultimate` — production React/Tailwind
- `ui-ux-pro-max` — UI/UX design intelligence
- `superdesign` — expert guidelines for modern UI
- `responsive-design` — container queries, fluid typography
- `next-best-practices` — RSC, data patterns, metadata
- `nextjs-app-router-patterns` — streaming, parallel routes
- `nodejs-backend-patterns` — middleware, error handling
- `code-review` — security + performance checks before shipping

### Install Now (Mobile — zero activation cost until app build)
- `expo-building-native-ui`
- `expo-deployment`
- `expo-tailwind-setup`
- `expo-native-data-fetching`

### Install After Review (High Value)
- `analytics-tracking` — needs GA/analytics access setup
- `ab-test-setup` — needs testing framework decision
- `page-cro` + `signup-flow-cro` — needs access to analytics data
- `deep-research-pro` — replaces ad hoc web research
- `youtube-transcript` — fetch + summarize competitor videos
- `playwright` — browser automation (needs `npm install playwright`)

### Skip / Watch
- `humanize-ai-text` — conflicts with our own framework
- `scrapling-official` — legal gray area
- `agent-autonomy-kit` — needs full security review first

---

## Part 6: Recommended Implementation Order

1. **Today:** Write the sub-agent critique loop into the 5 key skill files — biggest quality win, no installs needed
2. **Today:** Add explicit "pulls from / feeds into" section to each skill file
3. **Today:** Define the 3 standard multi-skill task flows in AGENTS.md
4. **This week:** Install all 15 Priority tier community skills (copy to workspace/skills/)
5. **This week:** Install 4 Expo mobile skills
6. **Next week:** Install High Value tier after review

---

## Decision Points for Kelly

1. **Sub-agent critique loop** — Do you want EVERY article/email to run through a proofreader sub-agent, or only on specific content types? (adds 30-60 seconds to each deliverable)

2. **Community skill installation** — Want me to install all 15 Priority tier skills in one shot, or review each one first?

3. **Orchestration flows** — The 3 multi-skill flows above: do these match how you think about the work, or do you want to adjust them?

4. **Expo mobile** — Install now (dormant until needed) or wait until app build actually starts?
