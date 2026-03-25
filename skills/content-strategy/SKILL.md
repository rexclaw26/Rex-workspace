---
name: content-strategy
description: Data-driven content planning for Discover Crypto and Blockchain Basement. Builds monthly content calendars mapped to Hit Network's 6 content pillars (Bitcoin/macro, DeFi, AI, geopolitics, legislation, institutional adoption). Pulls from seo-audit (keyword gaps), news-aggregation (trending topics), and discord-analytics (community demand signals). Assigns topics to formats (article, YouTube, newsletter), prioritizes by SEO opportunity + trend timing + audience demand, tracks plan vs. actual. Trigger on "content calendar", "what should we create", "content plan", "content strategy", "what topics should we cover", or any request to plan content ahead. Feeds into article-writing (topic briefs with keyword targets), video-editing-director (video plan), and content-pipeline (execution tracker). NOT a replacement for content-pipeline — this is planning, not tracking.
---

# Content Strategy — Hit Network

Planning brain for all content production. Rex reacts to news by default. This skill makes Rex proactive.

**Brands:** Discover Crypto (primary) · Blockchain Basement (secondary)
**Pillars:** Bitcoin/Macro · DeFi & On-Chain · AI x Crypto · Geopolitics/Macro · Legislation · Institutional Adoption
**Audience:** Crypto-native to crypto-curious. Financial literacy assumed. Not beginners — real analysis.

Full frameworks: `references/calendar-framework.md`
Pillar strategy + competitive positioning: `references/pillars-and-competition.md`
Repurposing workflows: `references/repurposing-workflow.md`
Newsletter strategy: `references/newsletter-strategy.md`

---

## Workflow

### Step 1 — Pull Data Sources (always first)
Before building any calendar, load current signals:

- `seo-audit` → keyword gaps and search opportunities for each pillar
- `news-aggregation` → trending topics and upcoming market events
- `discord-analytics` → top community questions from the past 2 weeks
- `financial-analysis` → which content types drive revenue (if available)
- Prior month performance → top 10 articles by pageviews, top 5 YouTube by watch time

### Step 2 — Score Topics
Use the 3-factor scoring model before adding anything to the calendar:

| Factor | Weight |
|--------|--------|
| Search demand (Ahrefs/Google Trends volume) | 35% |
| Audience relevance (matches pillar + current market interest) | 35% |
| Strategic timing (tied to upcoming event or trend window) | 30% |

Score 1-10 per factor. Prioritize anything scoring 7+ overall. Breaking news bypasses scoring — always reactive.

### Step 3 — Assign Formats
Follow the Repurposing Waterfall: one pillar piece, cascaded across formats.

| Content Type | Primary Format | Secondary |
|---|---|---|
| Breaking news | X thread (speed) | Quick YouTube, newsletter alert |
| Deep analysis | YouTube long-form (20-30 min) | Article (SEO), email |
| Education/explainers | Article (SEO first) | YouTube mid (10-15 min), social clips |
| Market data/charts | X thread | Article embed |
| Evergreen guides | Article (SEO pillar) | YouTube long-form, recurring social |

### Step 4 — Build the Calendar
Monthly structure: see `references/calendar-framework.md`

**60/25/15 rule:**
- 60% Evergreen — long-term SEO traffic engine
- 25% Seasonal/Predictable — FOMC previews, quarterly cycle analysis, tax season
- 15% Reactive — reserved capacity for breaking news (never overschedule this)

Always maintain 2 weeks of pre-produced buffer content in the queue.

### Step 5 — Output Calendar
Deliver as a structured monthly plan:

```
## [Month] Content Calendar — Hit Network

### Pillar Coverage
[Check each pillar has minimum 2 pieces this month]

### Week 1 — Anchor Content
[Long-form deep dive + pillar article]

### Week 2 — Cluster Content
[Supporting articles, explainers, social amplification]

### Week 3 — Engagement + Community
[Opinion, "state of the market", Discord-driven topics]

### Week 4 — Evergreen Refresh
[Update top performers, create clips from month's videos]

### SEO Targets This Month
[Keyword targets from seo-audit — feeds article-writing]

### YouTube Plan
[Video topics, target audience per video, repurposing plan]

### Newsletter
[Topics for free tier vs. paid tier — see newsletter-strategy.md]

### Upcoming Events to Plan Around
[FOMC dates, ETF decisions, protocol upgrades, regulatory hearings]
```

### Step 6 — Push to Mission Control Calendar
After Kelly approves the monthly calendar, push content publish dates directly into Mission Control as `type:"content"` events. Use this pattern for each event:

```
upsertEvent({
  title: "[YouTube] Bitcoin ETF Analysis — Institutional Adoption",
  start: <unix timestamp ms of publish date>,
  end:   <start + 3600000>,
  type:  "content",
  agentCodename: "Rex",
})
```

Title format: `[FORMAT] Title — Pillar`
- FORMAT options: Article | YouTube | YouTube Short | Newsletter | X Thread
- These will appear teal on the Mission Control calendar with format icons

### Step 6.5 — Output Gate (fires before calendar is locked)

**PRE-OUTPUT GATE — must appear before every content calendar delivered to Kelly:**
```
⚙️ OUTPUT GATE — Content Strategy
LAW 1 │ Humanization  : ✅ PASS — REPORT mode
LAW 5 │ Sources       : ✅ TAGGED — keyword data from seo-audit [Source: | Date:], trend data from news-aggregation [Source: | Date:], community signals from discord-analytics [Source: | Period:]
LAW 6 │ Human Approval: ⏸ HOLDING — calendar will NOT be locked, pushed to Mission Control, or fed to downstream skills until Kelly approves
```
**⏸ CALENDAR NOT LOCKED. Presenting for Kelly review. Reply "approved" to proceed.**

---

### Step 7 — Feed Downstream Skills
After calendar is approved:
- Pass keyword targets + topic briefs → `article-writing` (use handoff format below)
- Pass video plan → `video-editing-director` + `thumbnail-moodboard`
- Log all planned content → `content-pipeline` (pipeline tracks execution)
- Pass plan vs. actual at month end → `weekly-scorecard`

---

## Handoff Format — Article-Writing Brief

When passing topic briefs to `article-writing`, always use this exact format. Never pass a vague topic title — the brief must be complete enough to start writing without follow-up questions.

```
## Article Brief — [Topic Title]

Topic: [One clear sentence describing the article]
Primary keyword: [Exact target keyword from seo-audit]
Secondary keywords: [2-3 related terms]
Search intent: [Informational / Commercial / Navigational]
Target word count: [800-1200 for news | 1500-2500 for evergreen]
Publication: [Discover Crypto / Blockchain Basement]
Pillar: [Bitcoin/Macro | DeFi | AI | Geopolitics | Legislation | Institutional]
Target publish date: [YYYY-MM-DD]

Key angles:
- [Angle 1]
- [Angle 2]
- [Angle 3]

Source material:
- [Link or data point 1]
- [Link or data point 2]

Notes: [Any specific requirements, tone direction, or existing content to reference/avoid]
```

## Handoff Format — SEO Keyword Input

When receiving keyword gaps from `seo-audit`, capture in this format before building the calendar:

```
Keyword: [exact term]
Monthly searches: [volume]
Current ranking: [position or "not ranking"]
Intent: [Informational/Commercial]
Pillar: [which content pillar]
Priority: [High/Medium/Low]
```

---

## Competitive Positioning

See `references/pillars-and-competition.md` for full analysis.

**Where we win:**
- Personality-driven analysis with actual depth (gap between CoinDesk's depth and Milk Road's personality)
- YouTube-native crypto education tied to real community
- Intermediate retail investors (2-4 years in crypto — underserved everywhere)
- On-chain data translated for normal people
- Actionable macro + crypto intersection in plain English

**Don't try to compete with:**
- CoinDesk on institutional credibility
- Decrypt on beginner simplification

---

## Integration

- **Pulls from:** `seo-audit`, `news-aggregation`, `discord-analytics`, `financial-analysis`
- **Feeds into:** `article-writing` (keyword briefs), `video-editing-director` (video plan), `thumbnail-moodboard` (visual themes), `content-pipeline` (execution), `weekly-scorecard` (plan vs. actual)
- **Distinct from `content-pipeline`:** This skill plans. Pipeline tracks.
