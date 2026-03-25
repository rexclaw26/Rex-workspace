---
name: seo-audit
description: Comprehensive SEO auditor for Discover Crypto and Blockchain Basement — Hit Network's crypto/finance media brands. Diagnoses technical SEO, on-page optimization, E-E-A-T/YMYL compliance, keyword strategy, YouTube SEO, and AEO (Answer Engine Optimization for AI search). Tailored specifically for crypto, DeFi, macro finance, institutional adoption, and legislative content. Use when Kelly asks for an SEO audit, keyword research, ranking improvement, content optimization, YouTube optimization, or any organic traffic growth request. Feeds into content-strategy (keyword priorities) and article-writing (keyword targets). NOT used for X posts.
---

# SEO Audit — Hit Network

Crypto and finance content is YMYL (Your Money or Your Life). Google holds it to the highest E-E-A-T standards. Every audit must address this first.

**Brands:** Discover Crypto · Blockchain Basement
**Sites:** discovercrypto.com · blockchainbasement.com
**Content pillars:** Financial markets · AI · DeFi · Geopolitics/macro · Crypto legislation · Institutional adoption

Full technical standards: `references/technical-checklist.md`
Keyword strategy for Hit Network topics: `references/keyword-strategy.md`
YouTube SEO playbook: `references/youtube-seo.md`

---

## Audit Workflow

### Step 1 — Scope
Identify what's being audited:
- Full site audit (technical + on-page + content)
- Single page/article optimization
- YouTube channel/video optimization
- Keyword research for a topic
- Competitor gap analysis

### Step 2 — Technical Audit (full site only)
Run through `references/technical-checklist.md`. Flag every FAIL with priority (Critical / High / Medium).

Output: Prioritized fix list with exact recommendations.

### Step 3 — E-E-A-T Assessment
Crypto is YMYL. Check all signals:

**Experience:**
- Do authors have demonstrated crypto/finance experience?
- Are author bios present with credentials, social profiles, publications?
- Does content cite first-hand experience or analysis?

**Expertise:**
- Are claims backed by 5-7 authoritative sources minimum? [Source: linkbuilder.com, 2026]
- Is financial/market data sourced and dated?
- Are regulatory claims referenced to official sources (SEC.gov, CFTC.gov)?

**Authoritativeness:**
- Does the site have backlinks from recognized crypto/finance media?
- Are authors quoted or cited externally?
- Is the brand mentioned on third-party sites?

**Trustworthiness:**
- Is there a clear About page, editorial policy, and disclosures?
- Are affiliate relationships disclosed?
- Does the site have HTTPS with valid certificate?
- Are corrections published when content is updated?

**YMYL red flags (auto-flag these):**
- Specific price predictions presented as fact
- Investment advice without disclaimers
- Anonymous authorship on financial content
- Outdated prices or market data presented as current

### Step 4 — On-Page Optimization
For each page/article being audited:

**Title tag:**
- Format: `[Primary Keyword]: [Value Prop] | Discover Crypto`
- Length: 50-60 characters — primary keyword in first 60 chars
- Never keyword-stuff; one clear primary keyword

**Meta description:**
- 150-160 characters
- Primary keyword appears naturally
- Clear reason to click — not just a summary
- No duplicate meta descriptions across site

**Heading hierarchy:**
- One H1 per page — contains primary keyword
- H2s for main sections — contain secondary keywords
- H3s for subsections — never skip levels
- Question-format H2/H3 headings strongly preferred (AEO benefit)

**Content rules:**
- Primary keyword in first 100 words
- Semantic keyword coverage (related terms, not just exact match)
- Internal links: minimum 3 per article pointing to related content
- External links: authoritative sources only (CoinDesk, Bloomberg, gov sites, academic, on-chain data providers)
- Word count: 1,500–2,500 for evergreen guides; 800–1,200 for news articles
- Last updated date visible on evergreen content
- Direct answer in first 2-3 sentences under each heading (AEO)
- FAQ section at article end — schema-marked

**Schema markup:**
- NewsArticle on news (with image in all 3 ratios — see technical-checklist.md)
- Article on evergreen guides
- FAQPage when article has Q&A section
- BreadcrumbList on all pages
- Organization on homepage
- Person on all author pages

**What to avoid:**
- Thin content (under 300 words with no unique value)
- AI-generated content without human editorial review and expert sourcing
- Duplicate content across pages (canonicalize aggressively)
- Price predictions presented as facts without disclaimers
- Undated sources cited as current
- Anonymous authorship on any financial content

### Step 5 — Keyword Strategy
Load `references/keyword-strategy.md` for Hit Network topic keyword framework.

Quick intent mapping:
- **Informational** ("what is DeFi") → article content, educational
- **Navigational** ("Discover Crypto Bitcoin analysis") → brand/channel content
- **Transactional** ("buy Bitcoin 2026") → avoid — we're media, not exchange
- **Commercial investigation** ("best crypto exchanges 2026") → possible if editorially sound

### Step 6 — AEO (Answer Engine Optimization)
In 2026, crypto discovery increasingly happens through AI search (ChatGPT, Perplexity, Google AI Overviews). [Source: stupiddope.com, Feb 2026]

To get cited by AI engines:
- Structure content with clear question-format H2/H3 headings
- Include direct, concise answers in the first 2-3 sentences under each heading
- Use FAQ sections at article end — schema-marked
- Define crypto terms explicitly (AI engines pull definitions)
- Cite sources inline — AI engines cite content that cites sources
- Content with clear E-E-A-T signals gets cited more than thin content

### Step 7 — YouTube SEO
Load `references/youtube-seo.md` for the full YouTube optimization playbook.

Quick checklist:
- Title: Primary keyword first, 60-70 chars, clear value ("Bitcoin Just Did X — Here's What It Means")
- Description: Primary keyword in first 2 sentences, 200+ words, timestamps/chapters listed
- Chapters: Use timestamps with descriptive titles (not "Part 1") — helps AI engines chunk content
- Tags: 5-8 specific tags (not 30 generic ones)
- Thumbnail: Not audited here → use `thumbnail-moodboard` skill

---

## Output Format

### Full Site Audit Report
```
## SEO Audit — [Site] — [Date]

### Executive Summary
[3-4 bullets: biggest wins, biggest gaps, priority action]

### Technical (X issues found)
CRITICAL: [list]
HIGH: [list]
MEDIUM: [list]

### E-E-A-T Score: [Strong/Moderate/Weak]
[Specific gaps with fixes]

### On-Page (top 5 pages reviewed)
[Page: title, issues, recommendations]

### Keyword Opportunities
[5-10 specific keyword targets with intent labels]

### AEO Readiness: [Ready/Needs Work]
[Specific gaps]

### YouTube (if applicable)
[Video/channel specific recommendations]

### Priority Action Plan
1. [Highest impact fix — estimated effort]
2. ...
```

---

## Pre-Output Gate

**Must appear before every audit report, keyword analysis, or SEO deliverable presented to Kelly:**
```
⚙️ OUTPUT GATE — SEO Audit
LAW 5 │ Sources       : ✅ TAGGED — all audit findings include tool name + date. Keyword data sourced from [Ahrefs/Google Search Console/Google Trends | Date:]. No findings fabricated.
LAW 6 │ Human Approval: ⏸ HOLDING — no implementation begins, no changes made to site, until Kelly approves the priority list
```
**⏸ AUDIT DELIVERED FOR REVIEW. No site changes until Kelly confirms priorities.**

---

## Handoff Format — Content Strategy Output

When passing keyword opportunities to `content-strategy`, always use this format:

```
## SEO Keyword Input — [Date]

| Keyword | Monthly Searches | Current Ranking | Intent | Pillar | Priority |
|---------|-----------------|-----------------|--------|--------|----------|
| [term]  | [volume]        | [pos/"not ranking"] | [Info/Commercial] | [pillar] | [H/M/L] |
```

When passing article-level keyword targets to `article-writing`:
```
Primary keyword: [exact term]
Secondary keywords: [2-3 related terms]
Search intent: [Informational/Commercial/Navigational]
Recommended word count: [800-1200 news | 1500-2500 evergreen]
Key on-page notes: [H1 suggestion, FAQ angle, AEO opportunity]
```

---

## Integration

- Feeds **`content-strategy`** — keyword priorities and topic gaps become content calendar inputs (use handoff format above)
- Feeds **`article-writing`** — keyword targets passed to article briefs (use handoff format above)
- Feeds **`website-design`** — technical SEO requirements for any site build or redesign
- Feeds **`weekly-scorecard`** — monthly rankings summary
- Does NOT feed **`x-post-automator`** — X is algorithm-driven, not search-indexed

---

## Audit Cadence

| Audit type | Frequency |
|-----------|-----------|
| Full technical audit | Monthly |
| New article optimization | Every article |
| YouTube optimization | Every video |
| Keyword gap analysis | Quarterly |
| Competitor analysis | Quarterly |
| E-E-A-T review | Quarterly |
