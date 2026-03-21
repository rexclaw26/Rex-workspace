# TASK LOCK — Slide Deck Redesign (3 Decks)

**ID:** TASK-001
**Status:** active
**Created:** 2026-03-07 09:30 PST
**Last updated:** 2026-03-07 09:45 PST
**Owner:** Rex
**Priority:** high

---

## Objective
Rebuild all three digital product slide decks (dc-academy, crypto-cycle-playbook, creator-protocol) to pass the 10-point Hit Network Slide Design Standard (Apple elegance). Re-deliver all three Tailscale links to Kelly via Telegram once the mandatory sub-agent design gate passes.

---

## Full Specification

### Context
Three 15-slide decks were built on 2026-03-07 from synthesis-top3.md research. Kelly's design feedback: "Apple elegance — professional, crisp, simple, easy to digest, our own branding." A 10-point design standard was then locked in. The existing decks need to be rebuilt to that standard.

### The 10-Point Design Standard (non-negotiable)
1. Whitespace — max 4 primary elements per slide
2. Info density — max 4 bullets per slide
3. Typography hierarchy — clear H1 → sub-heading → body
4. Color discipline — max 2 accent colors per slide
5. Visual balance — consistent padding/alignment
6. Apple clarity — message grasped in under 3 seconds
7. Brand compliance — Hit Network palette + fonts
8. Hero/title slides — generous whitespace, dominant headline
9. Table/data legibility — clean, high contrast
10. Cross-deck consistency — styles consistent slide-to-slide

### Design Rules for the Rebuild
- Max 4 bullets per slide. If a slide has more, split it or cut to essentials.
- Sales funnel slides (currently 9 steps each) → split into 2 slides (Awareness→Consideration / Decision→Retention) or redesign as a 5-step visual
- 7-module and 7-section grids → cut to 4 most important items OR split into 2 slides
- 90-day plan (4 phases × 4 bullets) → convert to 3-phase timeline OR split into 2 slides
- Brand identity slides (2 columns each with 4-item BulletCard) → pick ONE focus per slide, not two competing blocks
- The existing SlideViewer component, helpers (SlideHero, SlideContent, SlideTable, SlideStats, Highlight, BulletCard), and per-deck color palettes all stay the same

### Three Decks
| Deck | Slug | Accent | File |
|------|------|--------|------|
| Discover Crypto Academy | dc-academy | #2563EB (Blue) + #F59E0B (Gold) | app/slides/dc-academy/page.tsx |
| Crypto Cycle Playbook | crypto-cycle-playbook | #10B981 (Emerald) + #F59E0B (Amber) | app/slides/crypto-cycle-playbook/page.tsx |
| Creator Protocol | creator-protocol | #7C3AED (Violet) + #06B6D4 (Cyan) | app/slides/creator-protocol/page.tsx |

### Mission Control Path
`/Users/rex/.openclaw/workspace/mission-control/`

### Sub-Agent Design Gate (required before delivery)
After rebuild: spawn sub-agent with slide content. Wait for all 10 checks PASS. Show visible gate output. Only then send Tailscale links to Kelly via Telegram.

Gate format required in output:
```
⚙️ SLIDE DESIGN GATE — [Deck Name]
SUB-AGENT DESIGN REVIEW: ✅ PASSED
  ✅ 01 Whitespace ... (all 10 listed)
```

### Delivery
Send three Tailscale links to Kelly via Telegram (channel=telegram, target=1011362712):
- http://100.70.46.41:3000/slides/dc-academy
- http://100.70.46.41:3000/slides/crypto-cycle-playbook
- http://100.70.46.41:3000/slides/creator-protocol

---

## Locked Decisions

| Decision | Choice Made | Rationale |
|----------|-------------|-----------|
| SlideViewer component | Keep as-is | Navigation works fine; only content/density is the issue |
| Color palettes | Keep per-deck palettes | Brand differentiation; palettes are correct |
| Slide count | Keep 15 per deck | Can split dense slides into 2, staying at or near 15 |
| Source material | synthesis-top3.md | 1,678 lines of researched data — do not fabricate |
| Delivery format | Tailscale link to Kelly via Telegram | Same as original delivery |

---

## Execution Plan

- [x] Step 1 — Build initial three decks (done 2026-03-07 08:45 PST)
- [x] Step 2 — Kelly gives design feedback: Apple elegance standard
- [x] Step 3 — Lock 10-point design standard into SKILL.md + AGENTS.md + MEMORY.md
- [x] Step 4 — Spawn sub-agent design review on existing decks
- [x] Step 5 — Design review received: FAIL on checks 01, 02, 06. 10 priority fixes identified.
- [x] Step 6 — Spawned 3 parallel rebuild sub-agents (one per deck) 2026-03-07 10:14 PST
- [ ] Step 7 — Await rebuild completions (auto-announce)
- [ ] Step 8 — Run second sub-agent design review on rebuilt decks
- [ ] Step 9 — Show visible design gate output (all 10 checks)
- [ ] Step 10 — Send updated Tailscale links to Kelly via Telegram

---

## Files

| File Path | Status | Role |
|-----------|--------|------|
| mission-control/app/slides/dc-academy/page.tsx | exists (needs rebuild) | Academy deck |
| mission-control/app/slides/crypto-cycle-playbook/page.tsx | exists (needs rebuild) | Playbook deck |
| mission-control/app/slides/creator-protocol/page.tsx | exists (needs rebuild) | Protocol deck |
| mission-control/components/slides/SlideViewer.tsx | exists (keep as-is) | Navigation component |
| mission-control/config/decks.ts | exists (keep as-is) | Deck registry |
| product-research/synthesis-top3.md | exists | Source data — 1,678 lines |

---

## Sub-Agents

| Session Key | Task Given | Status | Output Location |
|-------------|-----------|--------|-----------------|
| agent:main:subagent:289f09f4-15a7-4689-a4bc-fff4742d07fd | 10-point design review of all 3 decks | ✅ complete | gateway.log 08:59 AM — FAIL on checks 01/02/06 |
| agent:main:subagent:c838a77f-241d-4aa8-86dd-086c485184ee | Rebuild dc-academy deck | ✅ complete | app/slides/dc-academy/page.tsx — 16 slides, TS clean |
| agent:main:subagent:ad73f859-ddf5-4ca9-abcd-53b8a85652c3 | Rebuild creator-protocol deck | ✅ complete | app/slides/creator-protocol/page.tsx — 16 slides, TS clean |
| agent:main:subagent:51f55213-3a84-44ba-a408-83982f46065c | Rebuild crypto-cycle-playbook deck | ⏳ running | app/slides/crypto-cycle-playbook/page.tsx — awaiting |

---

## Current State

**As of 2026-03-07 10:43 PST (second compaction flush):**
- Academy deck: rebuilt 16 slides, TS clean. NOT yet re-reviewed against 10-point standard.
- Creator Protocol deck: rebuilt 16 slides, TS clean. NOT yet re-reviewed.
- Playbook deck: sub-agent was running at first compaction (10:27 PST). State UNKNOWN — must check on session resume.
- Second compaction occurred at 10:43 AM — context was approaching limit.
- Next on resume: (1) Check Playbook sub-agent status. (2) Verify all 3 decks are TS clean. (3) Run second 10-point design review sub-agent across all 3. (4) Fix any remaining failures. (5) Show visible Slide Design Gate. (6) Send Tailscale links to Kelly via Telegram (short format).
- Blockers: Playbook rebuild state unknown.

---

## Handoff Notes
- The sub-agent review will auto-announce when done. When it lands, read the PASS/FAIL per slide and start with the worst offenders (funnel slides and module grids).
- The three worst known issues before the review lands: (1) Slides 13 in all decks — 9-step funnel, split into 2 slides. (2) Slide 7 in Playbook + Protocol — 7-item module/section grids, cut to 4 or split. (3) Slide 14 in all decks — 4 phases × 4 bullets, convert to timeline or split.
- TypeScript check: run `npx tsc --noEmit` from mission-control/ after any rebuild before delivering.
- Telegram response to Kelly: SHORT format per new rule. One line per deck + links. No walls of text.
