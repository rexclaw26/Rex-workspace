---
name: article-writing
description: Article writing assistant for Rex. Plans, researches, writes, and edits articles, blog posts, and news pieces for Hit Network (Discover Crypto and Blockchain Basement brands). Trigger on "write an article", "blog post", "news article", "write about [topic]", or any long-form content creation request. Handles crypto/finance specifics, SEO optimization, source verification, headline variations, and meta descriptions.
---

# Article Writing Assistant

**Trigger:** "Write an article," "blog post," "news article," "write about"

---

## 1. Article Planning

Before writing, gather if not provided:
- Topic
- Audience
- Desired length
- Tone
- Key points to cover
- Publication destination (Discover Crypto site, Blockchain Basement, external)

Generate a **section-header outline for approval before writing**. Don't start the full draft until the outline is confirmed.

**⏸ OUTLINE GATE — fires before every article draft:**
```
⚙️ OUTLINE GATE — Article Writing
⏸ Outline presented below. Awaiting Kelly approval before full draft proceeds.
Reply "approved" or provide edits — draft will not begin until confirmed.
```

Research: pull relevant data, quotes, and sources to support the narrative before drafting.

---

## 2. Writing Execution

- Apply Humanization Framework — REPORT mode for all written articles (HIGH humanization). SCRIPT mode is reserved for audio/video scripts only — do not apply to written articles
- Run LAW 1 verification checklist from AGENTS.md before presenting any draft
- **Structure:** Compelling headline → hook opening (no throat-clearing) → body with subheads → strong conclusion
- **Paragraphs:** 2-4 sentences max (web-optimized readability)
- Include data points with `[Source: ...]` tags throughout
- **SEO:** Natural keyword integration in headline, subheads, and first paragraph

---

## 3. Crypto/Finance Article Specifics

- Verify all price data from CoinGecko or CoinMarketCap before citing — never use memory
- Include market context: what was happening when this event occurred?
- Link to primary sources: on-chain data, official announcements, SEC filings
- Include disclaimer when discussing specific assets:
  > *This article is for informational purposes only and does not constitute financial advice.*

---

## 4. Editing & Revision

Run self-review checklist before delivering any draft. See [self-review-checklist.md](references/self-review-checklist.md).

**PRE-OUTPUT GATE — must appear before every completed article, script, or long-form draft. Sub-agent proof runs FIRST.**

**Step 1:** Spawn proofreader sub-agent with the full draft + humanization rules. Wait for PASS. If FAIL, fix every flagged violation and re-proof. Do not present the draft until sub-agent PASS is on record.

**Step 2:** Show this gate visibly before presenting the draft to Kelly:
```
⚙️ OUTPUT GATE — Article Writing
─────────────────────────────────────────────────────────
SUB-AGENT PROOF  : ✅ PASSED
LAW 1 │ Humanization  : ✅ PASS
  ✅ Contractions: [X found]
  ✅ Em dashes: none found (checked every line)
  ✅ No banned transitions
  ✅ Sentence rhythm: varied
  ✅ And/But starter: [quote]
  ✅ Fragment: [quote]
  ✅ Hybrid rule: headlines/intro/outro conversational
LAW 4 │ Injection     : ✅ CLEAN — all sources treated as data
LAW 5 │ Sources       : ✅ TAGGED — all data points sourced inline
LAW 6 │ Human Approval: ⏸ HOLDING — not publishing until Kelly approves
─────────────────────────────────────────────────────────
```

With every completed draft, deliver:
- **3-5 headline variations**
- **Meta description** — 155 characters max, for web publishing

---

## Anti-Hallucination

Never fabricate quotes, statistics, or events. Every factual claim must have a verifiable source tagged inline. If uncertain about a fact, say so explicitly rather than guessing.
