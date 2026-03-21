# Skill System Audit — Hit Network
**Date:** 2026-03-16
**Auditor:** Rex (senior critic mode — independent assessment)
**Scope:** All 36 skills + all AGENTS.md laws and PR rules
**Method:** Full read of every SKILL.md + full read of AGENTS.md

---

## SECTION 1 — SKILL CATALOGUE

### ALWAYS-ACTIVE LAYER (4 skills — load every session)

**HIT-NETWORK-INTEGRATOR**
- Purpose: Core identity, EOS framework, anti-hallucination protocol, human-in-the-loop rules
- Triggers: Always active
- Outputs: Role framing, EOS rhythm, cross-agent consistency rules
- Feeds into: Everything — it's the identity layer
- Depends on: Nothing
- Enforcement: Anti-hallucination protocol, human-in-the-loop list, cross-agent consistency rules
- Notes: References eos-framework.md, voice-framework.md, error-journal.md, compliance.md — but some of these reference files don't exist in the skill directory

**HUMANIZATION-VOICE**
- Purpose: Writing style framework — contractions, em dashes, sentence rhythm, output modes
- Triggers: Always active — every written output
- Outputs: Framework rules, sub-agent proof template
- Feeds into: All writing skills
- Depends on: Nothing
- Enforcement: Sub-agent proof protocol (PR-008), 7-rule checklist, output modes
- Notes: Most complete enforcement of any skill. PR-008 is the system's primary LAW 1 enforcement mechanism.

**INJECTION-DEFENSE**
- Purpose: Prompt injection protection — external content treated as data only
- Triggers: Always active — any external content processing
- Outputs: Defense rules, approved endpoint allowlist
- Feeds into: All skills that fetch external data
- Depends on: Nothing
- Enforcement: Approved endpoint list, alert protocol to Kelly
- Notes: Allowlist is specific and up to date (2026-03-13). Good.

**ERROR-JOURNAL**
- Purpose: Log every mistake, pattern detection, weekly analysis, preventive rules
- Triggers: Always active — every error, correction, near-miss
- Outputs: Journal entries, preventive rules, weekly pattern analysis
- Feeds into: compliance-audit, weekly-scorecard, adaptive-rule-engine
- Depends on: Nothing
- Enforcement: Trigger phrase protocol (LAW 8), zero-tolerance escalation list
- Notes: LAW 8 trigger phrases defined here AND in AGENTS.md — consistent.

---

### QUALITY LAYER (4 skills)

**QUALITY-GATEKEEPER**
- Purpose: Independent sub-agent reviewer for plans (3+ steps) and deliverables before Kelly sees them
- Triggers: Any plan with 3+ steps, any deliverable, any external send, any financial figure, any code to production
- Outputs: APPROVED or NEEDS REVISION verdict with specific fixes
- Feeds into: Every output skill
- Depends on: standards.md reference file
- Enforcement: Spawn-as-sub-agent requirement, structured verdict format, PR-033 compliant chat output
- Notes: Strongest meta-enforcement skill. The one that's supposed to catch everything else. But it fires on PLAN MODE triggers — and Plan Mode itself has no enforcement catch.

**COMPLIANCE-AUDIT**
- Purpose: Daily self-checks, weekly audit, style drift, calibration drift, memory audit
- Triggers: "compliance check", "self-audit", end of every session
- Outputs: Compliance scores, drift reports, audit log
- Feeds into: weekly-scorecard, error-journal, adaptive-rule-engine
- Depends on: daily-checklist.md, weekly-audit-tracker.md, calibration-log.md
- Enforcement: 17-point daily checklist, 95% target, Kelly alert below 90%
- Notes: CRITICAL GAP — daily checklist is in a references file but there's no mechanism that FORCES it to run. It's self-triggered. Can be skipped silently.

**ADAPTIVE-RULE-ENGINE**
- Purpose: Track system version, propose rule changes based on error patterns, quarterly health reviews
- Triggers: "rule proposal", "system review", "quarterly report"
- Outputs: Rule proposals, quarterly health reports, version tracking
- Feeds into: Kelly → AGENTS.md updates
- Depends on: error-journal, compliance-audit
- Enforcement: Proposal format, max 2/week, data-backed requirement (3+ entries), Kelly approval required
- Notes: Good governance structure. But no mechanism ensures quarterly reviews actually happen on schedule.

**SKILL-INTAKE-PROTOCOL**
- Purpose: 6-phase safety evaluation for every new skill before installation
- Triggers: Any request to install, add, or integrate a new skill
- Outputs: Security audit, integration map, Kelly approval gate, install + verify checklist
- Feeds into: Every new skill install
- Depends on: system-map.md reference file (which needs to be kept current)
- Enforcement: 6-phase mandatory sequence, Kelly approval in Phase 5, verification checklist post-install
- Notes: CRITICAL GAP — system-map.md doesn't appear to exist or be current. Phase 1 says "read it first" but if it's empty/stale, the entire intake breaks.

---

### CONTENT CREATION CLUSTER

**ARTICLE-WRITING**
- Purpose: Plan, research, write, edit articles and blog posts for Discover Crypto / Blockchain Basement
- Triggers: "write an article", "blog post", "news article", "write about"
- Outputs: Outline (gated), full draft, 3-5 headline variations, meta description
- Feeds into: content-pipeline (script stage), x-post-automator (hooks), seo-audit (optimization)
- Depends on: humanization-voice, seo-audit (keyword targets from content-strategy brief)
- Enforcement: OUTLINE GATE (approval before draft), sub-agent proof (PR-008), full output gate
- Notes: One of the best-enforced skills. Both gates present and specific.

**X-POST-AUTOMATOR**
- Purpose: Draft X posts and threads for @discovercrypto — always 3 versions, Kelly posts manually
- Triggers: "draft a tweet", "X post", "X thread", "social media post"
- Outputs: 3 post versions per request, thread structures, 5-7 day calendars
- Feeds into: content-pipeline (social amplification)
- Depends on: humanization-voice, news-aggregation (breaking news hooks)
- Enforcement: Sub-agent proof (PR-008), full output gate, "Kelly manually posts" hard rule
- Notes: Strong enforcement. Discover Crypto ONLY rule clearly stated.

**CONTENT-STRATEGY**
- Purpose: Build monthly content calendars from data signals — planning, not tracking
- Triggers: "content calendar", "content plan", "content strategy", "what should we create"
- Outputs: Monthly calendar, SEO targets, YouTube plan, newsletter plan, Mission Control events
- Feeds into: article-writing (topic briefs), video-editing-director (video plan), thumbnail-moodboard (themes), content-pipeline (execution), weekly-scorecard (plan vs actual)
- Depends on: seo-audit (keyword gaps), news-aggregation (trending), discord-analytics (demand), financial-analysis (revenue data)
- Enforcement: No explicit output gate. No sub-agent proof requirement.
- Notes: HIGH GAP — this skill produces significant strategic deliverables (monthly calendar) with no output gate and no humanization enforcement mechanism.

**VIDEO-EDITING-DIRECTOR**
- Purpose: Generate EDLs, B-roll suggestions, clip selections, post-production checklists
- Triggers: "edit this video", "video editing", "clip this", "B-roll", "highlights"
- Outputs: EDL with timestamps, B-roll map, 3-5 social clips, post-production checklist
- Feeds into: content-pipeline (editing stage), thumbnail-moodboard (visual direction)
- Depends on: transcript or summary from Kelly
- Enforcement: Output gate present, LAW 6 holding
- Notes: Works from transcripts — anti-hallucination well-handled.

**THUMBNAIL-MOODBOARD**
- Purpose: Generate 3 thumbnail concepts per video, A/B variations, mood boards
- Triggers: "thumbnail", "mood board", "video thumbnail", "visual concepts"
- Outputs: 3 concepts with layout/emotion/text/color specs, mood board elements, CTR recommendations
- Feeds into: content-pipeline (thumbnail stage), video-editing-director (visual direction)
- Depends on: real CTR analytics (or flags as best practice)
- Enforcement: Output gate present, LAW 6 holding
- Notes: Good anti-hallucination on CTR data.

**SLIDE-DECK-GENERATOR**
- Purpose: Build presentation content — pitch decks, sponsor decks, internal decks
- Triggers: "make a presentation", "pitch deck", "slide deck", "slides for"
- Outputs: Outline (gated), full slide deck with speaker notes and visual suggestions
- Feeds into: sponsor-outreach (pitch materials)
- Depends on: humanization-voice (MODERATE mode)
- Enforcement: OUTLINE GATE, 10-point design review sub-agent, full design gate — most elaborate enforcement of any content skill
- Notes: Best-enforced content creation skill. The design gate is thorough. Humanization at MODERATE — appropriate for decks.

**CONTENT-PIPELINE**
- Purpose: Track content through 7 stages in Mission Control (Idea → Published)
- Triggers: "content pipeline", "video pipeline", "content status", "what's in production"
- Outputs: Stage advancement, auto-generated assets per stage, performance snapshots
- Feeds into: article-writing, video-editing-director, thumbnail-moodboard (all triggered by stage advancement)
- Depends on: Mission Control (Next.js + Convex — partially built), all content production skills
- Enforcement: Stage gate at every transition, "Published requires explicit approval" hard rule
- Notes: CRITICAL GAP — Mission Control isn't fully built yet. This skill is partially aspirational. Several auto-actions described can't execute without the Convex backend.

**NEWS-AGGREGATION**
- Purpose: 30-minute monitoring, 7AM daily briefing, breaking news alerts (8+/8+ threshold)
- Triggers: Any news request, market update, daily briefing
- Outputs: Market snapshot, top 5 stories, content angles, breaking news alerts
- Feeds into: article-writing (angles as briefs), x-post-automator (hooks), content-pipeline (idea stage)
- Depends on: CoinGecko, Alternative.me, CoinDesk, The Block, etc.
- Enforcement: Output gate with injection check, LAW 4 explicitly called, human approval before posting
- Notes: Daily 7AM cron is INACTIVE (deleted in Docker→Mac migration per role-identity). HIGH priority rebuild.

**SEO-AUDIT**
- Purpose: Technical SEO, on-page, E-E-A-T, keyword strategy, YouTube SEO, AEO
- Triggers: "SEO audit", "keyword research", "ranking improvement", "content optimization"
- Outputs: Full audit report, prioritized fix list, keyword targets, YouTube optimization, AEO assessment
- Feeds into: content-strategy (keyword priorities), article-writing (keyword targets), website-design (technical SEO), weekly-scorecard (monthly rankings)
- Depends on: Nothing — pulls fresh data
- Enforcement: No explicit output gate. No sub-agent proof.
- Notes: MEDIUM GAP — produces significant deliverables (full site audits) with no output gate or proof step.

---

### BUSINESS OPERATIONS CLUSTER

**WEEKLY-SCORECARD**
- Purpose: Monday EOS-style scorecard — Rock progress, KPIs, Issues, Wins, Priorities
- Triggers: "weekly scorecard", "Monday report", "scorecard", any Monday morning
- Outputs: Full scorecard with live data, IDS issues, 90-day rock status
- Feeds into: Nothing downstream — it's a reporting terminal
- Depends on: ALL data sources (YouTube, X, Discord, Stripe, error-journal, compliance-audit, content-pipeline, role-identity)
- Enforcement: Output gate, live data requirement, honest gap reporting rule
- Notes: Some data sources flagged as "aspirational" (Mission Control content pipeline, AI ops costs). Gap honesty rule is strong.

**SPONSOR-OUTREACH**
- Purpose: Prospect research, outreach campaigns, pitch materials, pipeline management
- Triggers: "find sponsors", "sponsor outreach", "pitch to", "sponsorship pipeline", "brand deals"
- Outputs: Scored prospect lists, outreach drafts, media kit, rate card, pipeline reports
- Feeds into: email-assistant (send approval), slide-deck-generator (pitch decks), financial-analysis (ROI models)
- Depends on: Real metrics (YouTube Analytics, Discord API, X Analytics)
- Enforcement: Pre-send gate, LAW 6 explicit hold, "NEVER send without Kelly approval"
- Notes: Gate present but uses self-check not sub-agent proof for humanization. Should mirror email-assistant's PR-008 flow.

**EMAIL-ASSISTANT**
- Purpose: Inbox triage, draft replies, email composition, scheduled sends
- Triggers: Any email request, inbox review, "check my email"
- Outputs: Priority-bucketed inbox, draft replies, composed emails, schedule proposals
- Feeds into: scheduling-optimizer (meeting follow-ups)
- Depends on: Gmail access, humanization-voice, email-signature
- Enforcement: PR-024 hard stop (can't call gog gmail send without sub-agent PASS), sub-agent proof mandatory, full output gate
- Notes: One of the most rigorously enforced skills. PR-024 is a real hard stop.

**EMAIL-SIGNATURE**
- Purpose: Standard signature templates for all 6 agents, public/codename rules
- Triggers: Any email drafting or signature request
- Outputs: Formatted signatures for internal/external use, agent public name roster
- Feeds into: email-assistant, sponsor-outreach, all external correspondence
- Depends on: Nothing
- Enforcement: Simple rules — no gate needed for a reference skill
- Notes: Contains full agent roster (Lex/TJ, Hal/Tim, Merlin/Deezy, Joe/Drew, Rex/Kelly, Vance/Bryan).

**FINANCIAL-ANALYSIS**
- Purpose: Financial analysis, model building, ROI calculations, P&L, forecasting
- Triggers: "financial analysis", "build a model", "forecast", "ROI calculation", "P&L"
- Outputs: Analysis summary, 3-scenario models, ROI calculations, range forecasts
- Feeds into: sponsor-outreach (ROI models), strategic-consulting (data support), weekly-scorecard
- Depends on: Stripe, exchange APIs, user-provided spreadsheets
- Enforcement: Output gate, 2+ source requirement for key figures, PROJECTED vs ACTUAL labeling
- Notes: Strong data integrity. No sub-agent proof — but financial analysis is structured data, not prose-heavy deliverables. Acceptable.

**INVOICING-BILLING**
- Purpose: Generate invoices, track AR, manage overdue follow-ups, produce AR reports
- Triggers: "create an invoice", "billing", "track invoices", "AR report"
- Outputs: Invoices, AR dashboard, overdue follow-up emails, billing reports
- Feeds into: financial-analysis (revenue data), weekly-scorecard
- Depends on: Stripe/billing system
- Enforcement: Pre-send gate, LAW 6 hold, sequential invoice number requirement
- Notes: Gate uses self-check for humanization on emails — should use sub-agent proof like email-assistant.

**SCHEDULING-OPTIMIZER**
- Purpose: Calendar analysis, meeting prep, time-block optimization, scheduling coordination
- Triggers: Calendar requests, "optimize my schedule", meeting prep
- Outputs: Agenda, meeting prep briefing, time-block plan, 3 scheduling options, follow-up drafts
- Feeds into: email-assistant (meeting follow-ups)
- Depends on: Calendar access (gog)
- Enforcement: Pre-action gate, LAW 6 hold, "never confirm without approval"
- Notes: Gate uses self-check for humanization on correspondence — should use sub-agent proof.

**DEFI-TRADE-TRACKING**
- Purpose: Monitor wallet transactions, FIFO P&L calculation, tax event flagging, quarterly tax reports
- Triggers: "DeFi trades", "track positions", "tax prep", "P&L", "wallet transactions"
- Outputs: Transaction history, P&L reports, tax summaries, accountant-ready reports
- Feeds into: financial-analysis (asset data)
- Depends on: CoinGecko, on-chain explorers (Etherscan, Solscan, Arbiscan, Basescan)
- Enforcement: Output gate, block number + tx hash requirement, CPA review recommendation
- Notes: Strong data integrity. Tax disclaimer is prominent and correct.

---

### STRATEGY LAYER

**STRATEGIC-CONSULTING**
- Purpose: McKinsey-style frameworks, brainstorming, competitive benchmarking, trend monitoring
- Triggers: "strategy session", "brainstorm", "McKinsey analysis", "growth strategy", "should we do X"
- Outputs: Issue trees, hypothesis analysis, recommendation matrix, executive memos, weekly trends brief
- Feeds into: content-strategy (strategic direction), financial-analysis (data support), sponsor-outreach (strategic framing)
- Depends on: Web search, external sources
- Enforcement: Output gate present, confidence levels required
- Notes: Gate present. No sub-agent proof — but memos are analytical not prose-heavy in the LAW 1 sense. Still should run proof for external-facing memos.

**MARKETING-MODE**
- Purpose: 140+ marketing tactics, 23 disciplines, strategy selection, psychology frameworks
- Triggers: Marketing strategy, copywriting, SEO, conversion optimization, paid advertising requests
- Outputs: Strategy recommendations, framework application, routing to specialist skills
- Feeds into: seo-audit, x-post-automator, content-strategy, financial-analysis (routes to all)
- Depends on: All specialist skills for execution
- Enforcement: Hierarchy rule defined — routes to specialist skills, never overrides them
- Notes: Good hierarchy rule. But the skill itself has no output gate — it's an orchestration layer, which is correct.

**CONTENT-STRATEGY**
(See above — notable that it's both in strategy and content clusters but has NO output gate)

---

### TECHNICAL / INFRASTRUCTURE CLUSTER

**WEBSITE-DESIGN**
- Purpose: Full-stack web builds — React/Next.js + Tailwind, backend, DeFi fund sites
- Triggers: "build a page", "website design", "frontend", "backend", "landing page"
- Outputs: Architecture proposal (gated), incremental builds with docs
- Feeds into: mission-control (component builds), seo-audit (technical SEO integration)
- Depends on: Tech stack (Node/Python/Next.js), existing infrastructure
- Enforcement: ARCHITECTURE GATE, DEPLOYMENT GATE, incremental approval pattern
- Notes: Two gates (architecture + deploy) — strong. No humanization check needed (code output).

**FRONTEND-DESIGN-ULTIMATE**
- Purpose: Production-grade static sites with bold aesthetics — React/Tailwind/shadcn/ui
- Triggers: Landing pages, marketing sites, dashboards, any static web UI
- Outputs: Single-file or multi-file React/Next.js builds
- Feeds into: website-design, mission-control
- Depends on: node, npm
- Enforcement: Design-thinking-first approach, bold aesthetic direction — no formal gates
- Notes: Community skill from ClawHub. No Hit Network-specific enforcement baked in. Overlaps with website-design and superdesign — hierarchy rule needed.

**SUPERDESIGN (frontend-design)**
- Purpose: Expert frontend design guidelines — beautiful, modern UIs
- Triggers: Building landing pages, dashboards, any user interface
- Outputs: ASCII wireframes, theme guidelines, animation plans, implementation
- Feeds into: website-design, mission-control
- Depends on: Nothing
- Enforcement: None — guideline skill
- Notes: Overlaps with frontend-design-ultimate AND website-design. Three UI skills with no clear hierarchy. HIGH GAP.

**MISSION-CONTROL**
- Purpose: Design/build/maintain Next.js + Convex operational dashboard for all 6 agents
- Triggers: "Mission Control", "build the dashboard", "agent dashboard"
- Outputs: Architecture plans, build phases, Google Workspace sync specs
- Feeds into: content-pipeline (Convex backend), role-identity (AI ops component), all data-driven skills
- Depends on: Next.js, Convex, Tailwind, Tailscale
- Enforcement: Incremental build approval pattern (get approval at each phase)
- Notes: Status is "prompt ready — awaiting Claude Code execution." Not fully built. Several skills depend on it.

**DISCORD-BOT**
- Purpose: Build/configure Discord bots for Discover Crypto and Blockchain Basement
- Triggers: "Discord bot", "automate Discord", "bot commands", "build a bot"
- Outputs: Bot code (Discord.js/discord.py), slash commands, moderation rules, cron jobs
- Feeds into: discord-analytics (data layer), mission-control (data aggregation)
- Depends on: discord-analytics (for informed feature decisions)
- Enforcement: STAGING GATE + PRODUCTION DEPLOY GATE, token security rules
- Notes: Two deployment gates — strong. Security rules (no hardcoded tokens) are explicit.

**WEB-DATA-SPREADSHEET**
- Purpose: Pull data from APIs and web sources, structure into spreadsheet-ready format
- Triggers: "pull data from", "scrape", "get data and put it in a spreadsheet", "compile data"
- Outputs: CSV/table datasets with source + timestamp columns, formulas, conditional formatting guidance
- Feeds into: financial-analysis, weekly-scorecard, discord-analytics, sponsor-outreach (metrics)
- Depends on: CoinGecko, CoinMarketCap, DefiLlama, Stripe, YouTube/X/Discord APIs
- Enforcement: Output gate (injection + sources + LAW 6), stale data flagging (>24h market, >7d other)
- Notes: LAW 1 humanization not in this gate — correct, it's data output not prose.

**PROMPT-ENGINEERING-EXPERT**
- Purpose: Expert guidance on prompt writing, system prompt design, optimization, anti-patterns
- Triggers: Any prompt design, optimization, or debugging request
- Outputs: Optimized prompts, system prompt architectures, test cases
- Feeds into: skill-intake-protocol (custom skill builds), adaptive-rule-engine
- Depends on: Nothing
- Enforcement: None — advisory skill
- Notes: Underspecified for Hit Network. No Hit Network context baked in. No output gate. Should be used as part of skill-intake-protocol Phase 4 explicitly.

---

### PERSONAL OPERATIONS

**ROLE-IDENTITY**
- Purpose: Forge/Rex operating config — daily rhythm, system monitoring, AI ops budget, skill deployment pipeline
- Triggers: Daily reports, system health checks, agent monitoring, cost tracking, skill deployment
- Outputs: Systems reports, cost dashboards, dev summaries, skill deployment status
- Feeds into: weekly-scorecard (AI ops component)
- Depends on: All 6 agent systems, Tailscale, Gmail, OpenClaw gateway
- Enforcement: Output gate (LAW 1/5/6), pre-delivery checklist
- Notes: Daily 7AM cron INACTIVE — flagged as ❌ in skill. Needs rebuild.

**DISCORD-ANALYTICS**
- Purpose: Track community health metrics, sentiment, channel performance for Hit Network Discord servers
- Triggers: "Discord analytics", "community data", "Discord report"
- Outputs: Weekly community reports, urgent flags, growth recommendations
- Feeds into: discord-bot (automation features), content-strategy (community demand signals), weekly-scorecard
- Depends on: Discord API
- Enforcement: Output gate (injection + sources + LAW 6), injection defense explicitly called for Discord content
- Notes: Good injection defense for Discord content — smart given the attack surface.

---

## SECTION 2 — CRITICAL GAPS

### CRITICAL

**C1 — Mission Control is partially aspirational**
Multiple skills (content-pipeline, role-identity, weekly-scorecard) reference Mission Control features that aren't built yet. Weekly scorecard explicitly flags content pipeline and AI ops costs as "🔲 Aspirational." These gaps create false confidence — Rex looks like it has comprehensive tracking when key data sources don't exist yet.
- Files affected: content-pipeline/SKILL.md, role-identity/SKILL.md, weekly-scorecard/SKILL.md
- Fix: Add explicit "BUILD STATUS" flags in each dependent skill stating what's live vs. aspirational. Currently only weekly-scorecard does this honestly.

**C2 — Daily 7AM briefing cron is DEAD**
The most visible Rex output — the daily briefing — has no delivery mechanism. role-identity explicitly marks it ❌ INACTIVE. But news-aggregation SKILL.md describes it as if it works. The disconnect between what the skill says and what actually runs is the infrastructure destruction pattern from PR-031/PR-038.
- Fix: Rebuild the cron. Or add explicit "MANUAL TRIGGER REQUIRED" to news-aggregation until it's rebuilt.

**C3 — Three overlapping UI design skills with no hierarchy**
`website-design`, `frontend-design-ultimate`, and `superdesign` all cover frontend UI work. No hierarchy rule exists between them. Any UI request could trigger any of the three with different procedures, different aesthetic approaches, and different enforcement. The skill-intake-protocol hierarchy rule says to define hierarchy explicitly — this was never done for these three.
- Files: website-design/SKILL.md, frontend-design-ultimate/SKILL.md, superdesign/SKILL.md
- Fix: Add hierarchy rule to each. Recommended: website-design = full-stack builds (primary), frontend-design-ultimate = high-visual static sites (secondary, routes through website-design gates), superdesign = design reference/guidelines only (not a builder).

**C4 — Compliance audit has no forcing function**
The 17-point daily checklist is supposed to run "at the end of each work session" — but there's nothing that triggers it. It's entirely self-initiated. Every other enforcement mechanism in the system (output gates, sub-agent proofs, PR-024 hard stops) fires at a specific moment in a workflow. The compliance check fires on... good intentions. This is the definition of a paper tiger.
- Fix: Add compliance self-check to session close protocol in AGENTS.md. Make LAW 2 (session close) explicitly call compliance-audit. Currently LAW 2 references "compliance check timing" but it's not in AGENTS.md (truncated).

---

### HIGH

**H1 — content-strategy has NO output gate**
This skill builds the monthly content calendar that drives all downstream content work. It's a significant deliverable — pulling from 4+ data sources, setting keyword targets, assigning formats, pushing to Mission Control calendar. But it has zero output gate, zero humanization enforcement, no sub-agent proof. Every other major deliverable skill has at least an output gate. This one just... delivers.
- Fix: Add output gate to content-strategy/SKILL.md with LAW 1 (REPORT mode), LAW 5 (sources tagged), LAW 6 (Kelly approval before calendar is locked).

**H2 — seo-audit has NO output gate**
Full site audits, E-E-A-T assessments, keyword strategies — all delivered without an output gate or humanization check. Given this feeds directly into content-strategy and article-writing, errors here cascade.
- Fix: Add output gate. At minimum: LAW 5 (all audit findings sourced), LAW 6 (approval before any implementation begins).

**H3 — sponsor-outreach uses self-check for humanization, not sub-agent proof**
Email-assistant has PR-024 (hard stop before gog gmail send without sub-agent PASS). Sponsor outreach emails are externally sent to business prospects — arguably higher stakes than routine email. But the gate shows a self-check checklist, not the sub-agent proof requirement from PR-008. Inconsistency with the same law (LAW 1) across two email-sending skills.
- Fix: Add sub-agent proof step to sponsor-outreach/SKILL.md mirroring email-assistant's PR-024 gate.

**H4 — invoicing-billing uses self-check for humanization on follow-up emails**
Same issue as H3. Follow-up emails to clients about overdue invoices are external, high-stakes correspondence. Self-check only.
- Fix: Add sub-agent proof requirement for any external-facing email communication in invoicing-billing/SKILL.md.

**H5 — scheduling-optimizer uses self-check for humanization on calendar correspondence**
Scheduling emails go to external attendees. Self-check only. Consistent pattern: any skill that sends external emails should use sub-agent proof, not self-check.
- Fix: Same as H3, H4.

**H6 — skill-intake-protocol depends on system-map.md that doesn't appear to exist or be current**
Phase 1 says "read references/system-map.md before evaluating any skill." If this file is stale or empty, Phase 1 is skipped silently and the entire intake runs without accurate system context. No verification that the file is current before proceeding.
- Fix: Add verification step to Phase 1: "If system-map.md is empty, stale (>30 days), or missing — STOP and rebuild it before proceeding with intake."

**H7 — adaptive-rule-engine quarterly reviews have no scheduling mechanism**
The skill says to run quarterly system health reviews "at end of each quarter." But there's no cron, no calendar reminder, no session startup check. It runs on memory. Given that session memory doesn't persist without file reads, this will be missed.
- Fix: Add quarterly review date tracking to memory/kelly-prefs.md and flag it in TASK_INDEX.md when due.

**H8 — Plan Mode trigger has no catch**
AGENTS.md defines when Plan Mode is REQUIRED (3+ steps, file modifications, external sends, financial figures, etc.). But the quality-gatekeeper only fires if Plan Mode actually activates — there's no check that ensures Plan Mode itself wasn't silently skipped. If Rex starts executing a 4-step plan without writing a plan first, nothing catches it.
- Fix: Add a Plan Mode self-check to the quality-gatekeeper trigger: "Before reviewing any plan, confirm this plan was created before execution began. If no plan exists for a 3+ step task, that IS the first finding."

---

### MEDIUM

**M1 — strategic-consulting output gate doesn't require sub-agent proof for external memos**
Strategic memos may go to Kelly only (internal) or may be used in sponsor pitches, investor decks, etc. The gate self-checks humanization. For external-facing strategic output, sub-agent proof should apply.

**M2 — prompt-engineering-expert has no Hit Network context baked in**
It's a generic community skill. When used to design new skills, it has no awareness of our LAW 1 requirements, PR rules, output gate patterns, or brand voice. Skills built with it need a separate Hit Network review pass.
- Fix: Add a "Hit Network overlay" section to the skill that instructs it to enforce LAW 1, PR-008, output gates, and injection defense in any skill it helps design.

**M3 — news-aggregation cross-skill integration section is informative but not enforced**
The skill says "breaking news alerts trigger immediate content action." But there's no defined handoff format, no trigger that fires article-writing or x-post-automator from a breaking news score. It's guidance, not automation.

**M4 — defi-trade-tracking has no explicit coordination with financial-analysis**
These two skills both deal with financial data for Kelly. If a DeFi P&L figure and a Stripe revenue figure are both used in the same weekly scorecard, there's no defined cross-reference check. The hit-network-integrator says cross-agent numbers must match — but no skill-level mechanism enforces this.

**M5 — email-signature is a reference-only skill with no wiring to email-assistant**
The email-assistant skill doesn't explicitly reference email-signature. If someone loads email-assistant without email-signature, signatures could be wrong or missing. Should be a hard dependency.

---

### LOW

**L1 — thumbnail-moodboard CTR performance tracking is aspirational**
The skill says to track CTR by style and make quarterly recommendations — but there's no mechanism to actually collect or store CTR data. It's described as a capability but requires YouTube Analytics integration that doesn't appear to be live.

**L2 — video-editing-director requires transcript but has no transcript request protocol**
It says "works from transcripts when direct video access isn't available" — but doesn't define how/when to request the transcript from Kelly. Minor workflow gap.

**L3 — discord-analytics growth-playbook.md exists but no explicit review cadence**
The skill references quarterly performance recommendations from the growth playbook. No schedule enforced.

---

## SECTION 3 — ORCHESTRATION MAP

### How skills SHOULD connect (ideal state)

```
INTELLIGENCE LAYER
news-aggregation → content-strategy → article-writing → content-pipeline
                                    → x-post-automator
                                    → video-editing-director → thumbnail-moodboard
discord-analytics → content-strategy
seo-audit → content-strategy → article-writing

QUALITY LAYER (fires at every deliverable transition)
quality-gatekeeper ← [article-writing, x-post, sponsor, email, slide-deck, financial]
humanization-voice ← [all writing skills]
injection-defense ← [news-agg, email, discord, web-data, any external fetch]
error-journal ← [all skills on failure/correction]

BUSINESS LAYER
sponsor-outreach → email-assistant → [send]
                 → slide-deck-generator → [pitch deck]
                 → financial-analysis → [ROI model]
strategic-consulting → [any downstream execution skill]
marketing-mode → [seo-audit | x-post-automator | content-strategy | financial-analysis]

REPORTING LAYER
weekly-scorecard ← [all data sources]
compliance-audit ← [all daily outputs]
adaptive-rule-engine ← [error-journal, compliance-audit]

INFRASTRUCTURE LAYER
mission-control ← [content-pipeline, role-identity, all agent data]
website-design ← [frontend-design-ultimate | superdesign] (hierarchy TBD)
discord-bot ← discord-analytics
```

### How skills ACTUALLY connect today (real state)

**What works:**
- article-writing → sub-agent proof → quality-gatekeeper ✅
- email-assistant → PR-024 hard stop → sub-agent proof ✅
- x-post-automator → sub-agent proof ✅
- slide-deck-generator → design review sub-agent ✅
- news-aggregation → manual content action (no automation) ⚠️
- discord-analytics → discord-bot (informally, no defined handoff) ⚠️

**What's broken or undefined:**
- content-strategy → article-writing: no defined brief format passed
- seo-audit → content-strategy: "keyword priorities" mentioned but no format defined
- news-aggregation breaking news → x-post-automator: no automated handoff
- sponsor-outreach → email-assistant: described as route but no defined handoff
- all skills → compliance-audit: self-triggered only, no forcing function
- Mission Control as data hub: partially built, several integrations aspirational

### BIGGEST SINGLE ORCHESTRATION FAILURE POINT

**The content publish flow has no defined handoff formats between skills.**

news-aggregation produces "content angles." content-strategy consumes "keyword gaps + trending topics." article-writing needs "topic briefs with keyword targets." These are described as connections, but no format standard exists. Each handoff is ad-hoc. When Rex hands off from news-aggregation to content-strategy to article-writing, the data format isn't specified — so each link in the chain works differently every time. This means:
- Keyword targets might not make it from seo-audit to article-writing
- Content angles might be summarized differently each time they pass from news to strategy
- The quality of the final article depends entirely on whether the brief was complete — but brief quality is undefined

---

## SECTION 4 — SPECIFIC RECOMMENDATIONS (ranked by impact)

### R1 — Define content handoff formats (CRITICAL)
**What:** Add a "HANDOFF FORMAT" section to news-aggregation, seo-audit, and content-strategy specifying the exact structure they pass to downstream skills.
**Why:** The biggest quality gap in the system. Undefined handoffs = inconsistent article briefs = inconsistent output quality.
**Files:** news-aggregation/SKILL.md, seo-audit/SKILL.md, content-strategy/SKILL.md
**What to add:**
```
## Handoff Format (to article-writing)
When passing topic briefs to article-writing, always include:
- Topic: [one clear sentence]
- Primary keyword: [exact target keyword]
- Secondary keywords: [2-3 related terms]
- Search intent: [Informational/Commercial/Navigational]
- Target word count: [800-1200 news | 1500-2500 evergreen]
- Key angles: [2-3 bullet points]
- Source material: [links or data points to incorporate]
- Publication: [Discover Crypto / Blockchain Basement]
- Deadline: [if applicable]
```

### R2 — Add output gate to content-strategy (HIGH)
**What:** Add the standard output gate block to content-strategy/SKILL.md before calendar delivery.
**Files:** content-strategy/SKILL.md
**Add before Step 7:**
```
**PRE-OUTPUT GATE — must appear before every content calendar delivered to Kelly:**
⚙️ OUTPUT GATE — Content Strategy
LAW 1 │ Humanization  : ✅ PASS — REPORT mode
LAW 5 │ Sources       : ✅ TAGGED — all keyword data from seo-audit, trend data from news-aggregation
LAW 6 │ Human Approval: ⏸ HOLDING — calendar locked and pushed to Mission Control only after Kelly approves
```

### R3 — Add output gate to seo-audit (HIGH)
**What:** Add output gate to seo-audit/SKILL.md.
**Files:** seo-audit/SKILL.md — add after Output Format section.
**Add:**
```
**PRE-OUTPUT GATE — must appear before every audit report delivered to Kelly:**
⚙️ OUTPUT GATE — SEO Audit
LAW 5 │ Sources       : ✅ TAGGED — all findings sourced (tool name + date)
LAW 6 │ Human Approval: ⏸ HOLDING — no implementation begins until Kelly approves priority list
```

### R4 — Upgrade sponsor-outreach, invoicing, and scheduling-optimizer to sub-agent proof (HIGH)
**What:** Replace self-check humanization gates with sub-agent proof (PR-008) for any external-facing email.
**Files:** sponsor-outreach/SKILL.md, invoicing-billing/SKILL.md, scheduling-optimizer/SKILL.md
**Why:** Three skills that send external emails currently self-check humanization. Email-assistant (highest stakes email skill) requires sub-agent PASS. The others don't. Inconsistent application of the same law.

### R5 — Define UI skill hierarchy (CRITICAL)
**What:** Add explicit hierarchy rules to all three UI skills.
**Files:** website-design/SKILL.md, frontend-design-ultimate/SKILL.md, superdesign/SKILL.md
**Add to each:**
```
## Hierarchy Rule
For Hit Network builds:
- website-design: PRIMARY — full-stack builds, architecture gate required, deployment gate required
- frontend-design-ultimate: SECONDARY — high-visual static sites, routes through website-design deployment gate
- superdesign: REFERENCE ONLY — design guidelines, not a builder skill. Load for design direction, not code output.
When in doubt: use website-design. It has the most complete enforcement.
```

### R6 — Fix compliance-audit forcing function (CRITICAL)
**What:** Add compliance self-check as a required step in session close protocol.
**Files:** AGENTS.md (session close section / LAW 2)
**Add to LAW 2:**
```
Session close REQUIRES (in order):
1. Run compliance-audit daily self-check against today's outputs
2. Log any failures in error-journal
3. Write session-handoff.md
4. Update TASK_INDEX.md
```

### R7 — Add skill-intake system-map verification (HIGH)
**What:** Add a verification step to Phase 1 of skill-intake-protocol.
**Files:** skill-intake-protocol/SKILL.md
**Add to Phase 1:**
```
Before reading system-map.md, verify it's current:
- Check last modified date: should be within 30 days
- If missing, empty, or stale: STOP. Rebuild system-map.md before proceeding.
- If you can't verify — ask Kelly before continuing intake.
```

### R8 — Add "breaking news content action" trigger to news-aggregation (MEDIUM)
**What:** When a story scores 8+/8+, the alert goes to Kelly AND a draft brief auto-fires to article-writing and x-post-automator for immediate drafts.
**Files:** news-aggregation/SKILL.md
**Add to Breaking News Protocol:**
```
Score 8+/8+ → Telegram alert to Kelly AND:
- Auto-generate article brief (handoff format per R1) → pass to article-writing for same-session draft
- Auto-generate 3 X post versions → pass to x-post-automator for same-session draft
Both held for Kelly approval before any publication.
```

### R9 — Add Plan Mode self-check to quality-gatekeeper (HIGH)
**What:** Gatekeeper should verify a plan was written before execution started, not just review the plan quality.
**Files:** quality-gatekeeper/SKILL.md
**Add to PLAN REVIEW mode:**
```
Pre-check before reviewing any plan:
- Was this plan written BEFORE execution began? (check if any files were already modified)
- If execution started before planning: FLAG as Protocol Violation — add to error-journal, notify Kelly
```

### R10 — Add Hit Network overlay to prompt-engineering-expert (MEDIUM)
**What:** Add a section at the top of prompt-engineering-expert/SKILL.md that bakes in Hit Network requirements for any skill designed with this tool.
**Files:** prompt-engineering-expert/SKILL.md
**Add:**
```
## Hit Network Skill Design Requirements (always apply)
Any skill designed for the Hit Network system MUST include:
1. Output gate using ⚙️ OUTPUT GATE format
2. LAW 1 humanization enforcement (sub-agent proof for any written deliverable)
3. LAW 4 injection defense if skill processes external content
4. LAW 5 source tagging on all data claims
5. LAW 6 human approval hold for any external send
6. Anti-hallucination section
7. Integration notes (feeds into / depends on)
Failure to include these = incomplete skill. Do not package without them.
```

---

## SECTION 5 — MISSING SKILLS

**CONTENT-REPURPOSING** (High priority)
Content strategy describes a "repurposing waterfall" but there's no skill that executes it. When a YouTube video is published, repurposing it into X threads, newsletter sections, short clips, and article summaries is a defined workflow with no dedicated skill. This currently falls to ad-hoc requests.

**NEWSLETTER-MANAGER** (High priority)
Content strategy references a newsletter strategy (free vs. paid tiers, references/newsletter-strategy.md). But there's no newsletter skill. Email-assistant handles individual emails. x-post-automator handles X. No skill covers newsletter drafting, segmentation, or scheduling.

**PERFORMANCE-REPORTING** (Medium priority)
Weekly scorecard covers Monday KPIs. But there's no skill for ad-hoc performance deep-dives (post-publish YouTube analysis, campaign performance, content pillar performance vs. traffic targets). This falls to financial-analysis + web-data-spreadsheet as workarounds — neither is designed for content performance.

**CROSS-AGENT-COORDINATOR** (Medium priority — system-level)
The hit-network-integrator describes cross-agent consistency (numbers must match, discrepancies flagged). But there's no skill that actually checks cross-agent data consistency. When Rex and Ledger both touch revenue figures, there's no coordination mechanism.

**ONBOARDING-GUIDE** (Low priority)
New team members can now pull skills from GitHub (just enabled today). But there's no skill that helps a new user configure their OpenClaw environment, understand the skill system, or install the right skills for their role. A README exists in the repo, but a guided skill would be more effective.

---

## SECTION 6 — ENFORCEMENT SCORECARD

| Law / Rule | Enforcement Level | Notes |
|-----------|------------------|-------|
| LAW 1 — Humanization | PARTIAL | Enforced in 8 skills via sub-agent proof. 5 external-sending skills use self-check only. Content-strategy and seo-audit have no check. |
| LAW 4 — Injection Defense | ENFORCED | Explicitly called in news-aggregation, discord-analytics, email-assistant, financial-analysis, defi-trade-tracking, web-data-spreadsheet. |
| LAW 5 — Source Tagging | ENFORCED | Every skill with data outputs requires [Source: ...] tags. Financial-analysis requires 2+ sources. |
| LAW 6 — Human Approval | ENFORCED | Every external-sending skill has explicit approval hold. |
| LAW 8 — Trigger Phrases | ENFORCED | Defined in error-journal and referenced in AGENTS.md. |
| PR-008 — Sub-agent proof | PARTIAL | Applied in 4 skills (article-writing, x-post, email-assistant, slide-deck). Missing in 5 external-sending skills. |
| PR-024 — Gmail hard stop | ENFORCED | Defined in email-assistant. Hard stop before gog gmail send. |
| PR-031 — Infrastructure off-limits | PAPER TIGER | Named in AGENTS.md. No skill-level mechanism prevents file edits to docker-compose.yml. Pure rule, no catch. |
| PR-033 — Chat output minimal | ENFORCED | Quality-gatekeeper and most output gates follow this. |
| PR-037 — Verify before acting | PAPER TIGER | Defined in AGENTS.md. No skill-level enforcement. Any skill that sends external content can bypass this without a check. |
| PR-038 — Sub-agent timeout protocol | PARTIAL | Sizing table in AGENTS.md. No skill-level enforcement of pre-spawn sizing check. |
| Plan Mode triggers | PAPER TIGER | AGENTS.md defines when plan mode is required. Quality-gatekeeper reviews plans but can't catch a skipped plan. |
| Compliance audit daily run | PAPER TIGER | No forcing function. Self-triggered only. |
| Quarterly adaptive review | PAPER TIGER | No schedule mechanism. |
| Cross-agent data consistency | PAPER TIGER | Defined in hit-network-integrator. No execution mechanism. |

**Paper tigers (require attention):**
1. PR-031 (infrastructure off-limits) — most dangerous given past incident
2. PR-037 (verify before acting) — caused duplicate email incident
3. Plan Mode enforcement — caused quality issues on multi-step tasks
4. Compliance audit daily check — no forcing function
5. Cross-agent consistency — no mechanism

---

*End of audit. 36 skills read in full. All AGENTS.md laws and PR rules assessed.*
*Full report: memory/skill-audit-2026-03-16.md*
