# TASK LOCK — Turnkey Digital Products Research + Slide Decks

**ID:** TASK-005
**Status:** active
**Created:** 2026-03-07 12:05 PST
**Deadline:** 2026-03-07 17:00 PST (5 PM)
**Owner:** Rex
**Priority:** critical

---

## Objective
Research 10 turnkey digital products Rex can build 100% (no Kelly filming/editing/writing). Select top 3 by profitability, sustainability, and brand strength. Build 3 × 15-slide decks. Deploy to Mission Control Decks page by 5 PM PST. Zero output to Kelly until delivery.

---

## Full Specification

### What "Turnkey Rex-Built" Means
- 100% producible using Rex's skills: code, design, writing, automation, data, AI
- NO filming, video editing, recording, voiceover, or content requiring Kelly's face/voice
- NO manual work Kelly must do beyond reviewing and approving
- Revenue model must be clear and launchable within 4 weeks
- Examples of valid products: web apps, SaaS tools, TradingView indicators, automated newsletters, data products, AI tools, template packs, software, automated reports, digital toolkits
- Examples of INVALID products: courses requiring Kelly to film, communities requiring Kelly to host live sessions, anything requiring Kelly to personally produce content regularly

### Ranking Criteria for Top 3
Each of the top 3 should ideally cover different strengths, but all three must score high on at least one:
1. **Highest probability of profitability within 4 weeks** — fastest path to first dollar
2. **Highest probability of sustaining success beyond 6 months** — defensible, recurring, compound
3. **Strongest brand in general** — differentiated, memorable, premium positioning

### Research Standard (McKinsey-style)
- Real market sizing with sources
- Competitive landscape: who exists, what they charge, what's missing
- Business model clarity: pricing, delivery, acquisition
- Risk assessment: what kills this product
- Challenge / stress-test: argue AGAINST the idea before arguing for it
- Confidence levels on all projections

### Slide Deck Standard
- 15 slides per deck
- Hit Network Slide Design Standard (Apple elegance): max 4 bullets/slide, max 4 elements/slide, max 2 accent colors/slide, 3-second clarity test
- Dark theme matching Mission Control UI
- Unique color palette per deck
- Must pass 10-point design review sub-agent before delivery
- Content: brand breakdown + business plan + revenue projections

### File Paths
- Research output: `/Users/rex/.openclaw/workspace/product-research/turnkey-ideas-research.md`
- Top 3 selection: `/Users/rex/.openclaw/workspace/product-research/turnkey-top3-selection.md`
- Deck 1: `/Users/rex/.openclaw/workspace/mission-control/app/slides/[slug]/page.tsx`
- Deck 2: `/Users/rex/.openclaw/workspace/mission-control/app/slides/[slug]/page.tsx`
- Deck 3: `/Users/rex/.openclaw/workspace/mission-control/app/slides/[slug]/page.tsx`
- Decks config: `/Users/rex/.openclaw/workspace/mission-control/config/decks.ts`

---

## Execution Plan

- [ ] Step 1 — Phase 1: Research sub-agent — 10 ideas with full McKinsey analysis + brand concepts
- [ ] Step 2 — Phase 2: Critic sub-agent — challenge all 10, rank, select + justify top 3
- [ ] Step 3 — Phase 3: 3 parallel deck builder sub-agents (one per top product)
- [ ] Step 4 — Phase 4: Design critic sub-agent — 10-point review all 3 decks
- [ ] Step 5 — Fix any design failures
- [ ] Step 6 — Update config/decks.ts + TypeScript check
- [ ] Step 7 — Deliver Tailscale links to Kelly at 5 PM PST

---

## Pipeline State
See: `/Users/rex/.openclaw/workspace/PIPELINE_STATE.md`
Full schematic + resume instructions: `/Users/rex/.openclaw/workspace/product-research/PIPELINE_SCHEMATIC.md`

---

## ⚠️ Compaction Survival Protocol

**If you are resuming after compaction — do this first:**

```bash
# Step 1: Check what's done
ls /Users/rex/.openclaw/workspace/product-research/markers/

# Step 2: Read which phase to resume from
cat /Users/rex/.openclaw/workspace/PIPELINE_STATE.md

# Step 3: Get full spawn instructions
cat /Users/rex/.openclaw/workspace/product-research/PIPELINE_SCHEMATIC.md
```

Every phase writes a marker file when complete. The marker is the ground truth — not session context, not announces. If the marker exists, the phase is done. If it doesn't, spawn it.

**Never trust session context alone. Always check markers.**

---

## STATUS: ✅ COMPLETE — 2026-03-07 22:47 PST — all 3 decks delivered to Kelly

## Current State
Phase 1 sub-agent running (spawned 12:05 PST).
Session key: agent:main:subagent:08c526aa-098f-45c1-b5dc-bb0f366d9251
Schematic written: product-research/PIPELINE_SCHEMATIC.md
Markers dir created: product-research/markers/
PR-019 violation logged: no 🟢 startup confirmation shown after Docker crash restart.
