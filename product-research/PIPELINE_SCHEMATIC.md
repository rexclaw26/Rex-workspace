# TASK-005 — Pipeline Schematic & Compaction Survival Guide
Created: 2026-03-07 12:14 PST
Deadline: 2026-03-07 17:00 PST
Last updated: 2026-03-07 12:14 PST

---

## ⚠️ COMPACTION RECOVERY INSTRUCTIONS

If you are a fresh Rex session reading this after compaction — READ THIS FIRST.

1. Read this entire file
2. Check which phases are complete by looking for MARKER files (see Phase Markers section)
3. Find the first incomplete phase
4. Resume from that phase using the instructions below
5. Do NOT re-run completed phases — check the marker files first

---

## Pipeline Overview

```
Phase 1: Research sub-agent
  → Writes: turnkey-ideas-research.md
  → Writes marker: PHASE1_COMPLETE

Phase 2: Critic sub-agent (ranks + selects top 3)
  → Reads: turnkey-ideas-research.md
  → Writes: turnkey-top3-selection.md
  → Writes marker: PHASE2_COMPLETE

Phase 3a/b/c: 3 Deck Builder sub-agents (parallel)
  → Reads: turnkey-top3-selection.md
  → Writes: mission-control/app/slides/[slug]/page.tsx (3 files)
  → Writes markers: PHASE3A_COMPLETE, PHASE3B_COMPLETE, PHASE3C_COMPLETE

Phase 4: Design Critic sub-agent
  → Reads: all 3 deck files
  → Writes: PHASE4_REVIEW.md (PASS/FAIL per slide per deck)
  → Writes marker: PHASE4_COMPLETE (only if all pass)

Phase 5: Fix any design failures (in-place edits by main session)
  → Writes marker: PHASE5_COMPLETE

Phase 6: Deploy (update config/decks.ts + TS check)
  → Writes marker: PHASE6_COMPLETE

Phase 7: Deliver to Kelly at 5 PM PST
  → Telegram message with 3 Tailscale links
```

---

## Phase Markers (check these to know what's done)

All marker files live in: `/Users/rex/.openclaw/workspace/product-research/markers/`

| Marker File | Means |
|---|---|
| `PHASE1_COMPLETE` | Research file written, 10 ideas with full analysis |
| `PHASE2_COMPLETE` | Top 3 selected, slugs defined, full spec written |
| `PHASE3A_COMPLETE` | Deck 1 built (slug in file content) |
| `PHASE3B_COMPLETE` | Deck 2 built (slug in file content) |
| `PHASE3C_COMPLETE` | Deck 3 built (slug in file content) |
| `PHASE4_COMPLETE` | All 3 decks passed 10-point design review |
| `PHASE5_COMPLETE` | All fixes applied, TypeScript clean |
| `PHASE6_COMPLETE` | config/decks.ts updated, decks live at Tailscale URLs |

**To check pipeline state after compaction:**
```bash
ls /Users/rex/.openclaw/workspace/product-research/markers/
cat /Users/rex/.openclaw/workspace/product-research/markers/PHASE2_COMPLETE  # shows top 3 slugs
```

---

## Key File Paths

| File | Purpose |
|---|---|
| `product-research/turnkey-ideas-research.md` | Phase 1 output — 10 ideas with full analysis |
| `product-research/turnkey-top3-selection.md` | Phase 2 output — top 3 selected, slugs, full specs |
| `product-research/markers/PHASE4_REVIEW.md` | Design critic report |
| `mission-control/app/slides/[slug]/page.tsx` | Each deck file |
| `mission-control/config/decks.ts` | Decks page registry |

---

## Build-Critic Gates (explicit)

This pipeline has TWO Build-Critic loops:

### Gate 1 — Research Critic (Phase 1 → Phase 2)
- **Builder:** Phase 1 sub-agent generates 10 ideas
- **Critic:** Phase 2 sub-agent challenges all 10, rejects weak ones, selects top 3
- **Pass condition:** Top 3 are genuinely differentiated, sourced, and profitable
- **Gate visible output:** Must appear in turnkey-top3-selection.md

### Gate 2 — Design Critic (Phase 3 → Phase 4)
- **Builder:** 3 deck builder sub-agents
- **Critic:** Phase 4 sub-agent runs 10-point Hit Network Slide Design Standard
- **Pass condition:** All 10 checks pass on all 3 decks
- **Gate visible output:** Must appear in PHASE4_REVIEW.md and in delivery message

---

## Sub-Agent Session Keys (filled in as they run)

| Phase | Label | Session Key | Status |
|---|---|---|---|
| Phase 1 | turnkey-research-phase1 | agent:main:subagent:08c526aa-098f-45c1-b5dc-bb0f366d9251 | running |
| Phase 2 | turnkey-critic-phase2 | TBD | pending |
| Phase 3a | turnkey-deck-builder-1 | TBD | pending |
| Phase 3b | turnkey-deck-builder-2 | TBD | pending |
| Phase 3c | turnkey-deck-builder-3 | TBD | pending |
| Phase 4 | turnkey-design-critic | TBD | pending |

---

## Cascade Logic (for main session to execute)

When Phase 1 auto-announces OR marker PHASE1_COMPLETE exists:
→ Read turnkey-ideas-research.md
→ Spawn Phase 2 critic sub-agent (see Phase 2 spawn instructions below)

When Phase 2 auto-announces OR marker PHASE2_COMPLETE exists:
→ Read turnkey-top3-selection.md to get 3 product slugs + specs
→ Spawn Phase 3a, 3b, 3c in parallel (one per deck)

When ALL THREE of PHASE3A_COMPLETE + PHASE3B_COMPLETE + PHASE3C_COMPLETE exist:
→ Spawn Phase 4 design critic

When Phase 4 auto-announces OR PHASE4_COMPLETE exists:
→ Read PHASE4_REVIEW.md
→ Fix any FAIL items (inline in main session — small edits only)
→ Run npx tsc --noEmit
→ Update config/decks.ts with new deck group
→ Write PHASE5_COMPLETE + PHASE6_COMPLETE markers
→ At 17:00 PST: send Tailscale links to Kelly via Telegram

---

## Phase 2 Spawn Instructions (critic sub-agent brief)

When spawning Phase 2, tell it to:
1. Read `/Users/rex/.openclaw/workspace/product-research/turnkey-ideas-research.md`
2. Challenge every idea — argue against each before ranking
3. Score each idea: profitability 4wk | sustainability 6mo | brand strength (each /10)
4. Select top 3 that collectively cover: fastest profit + most sustainable + strongest brand
5. For each of the top 3, define: product slug (URL-safe, kebab-case), deck color palette (hex), 15-slide outline
6. Write full output to `/Users/rex/.openclaw/workspace/product-research/turnkey-top3-selection.md`
7. Write marker: `echo "PHASE2 COMPLETE — [slug1] | [slug2] | [slug3]" > /Users/rex/.openclaw/workspace/product-research/markers/PHASE2_COMPLETE`

---

## Phase 3 Deck Builder Instructions

Each deck builder receives:
- The full spec for ONE product from turnkey-top3-selection.md
- The Hit Network Slide Design Standard (max 4 bullets, max 4 elements, max 2 accents per slide)
- The SlideViewer component path and available helpers
- Must write deck to `mission-control/app/slides/[slug]/page.tsx`
- Must write marker when done

---

## Delivery Format (5 PM Telegram)

```
⚙️ SLIDE DESIGN GATE — All 3 Decks
─────────────────────────────────────────────────────────
SUB-AGENT DESIGN REVIEW : ✅ PASSED — [session key]
[all 10 checks listed]
─────────────────────────────────────────────────────────
BUILD-CRITIC GATE
Research Critic  : ✅ PASSED — Phase 2 selected top 3 from 10
Deck Critic      : ✅ PASSED — all 3 decks cleared design review
─────────────────────────────────────────────────────────

🔵 [Product 1 Name] → http://100.70.46.41:3000/slides/[slug]
🟢 [Product 2 Name] → http://100.70.46.41:3000/slides/[slug]
🟣 [Product 3 Name] → http://100.70.46.41:3000/slides/[slug]

All live on Mission Control Decks page.
```

---

## Rules Compliance Checklist (this task)

| Rule | Status | Notes |
|---|---|---|
| PR-011 PIPELINE_STATE.md | ✅ | Written at task launch |
| PR-013 heavy builds in sub-agents | ✅ | All builds in sub-agents |
| PR-019 🟢 startup confirmation | ❌ VIOLATION | Not shown after Docker crash — logged |
| PR-016 LAW 9 session_status | ✅ | Checked: 72% — in range |
| Task Lock file | ✅ | TASK-005 written |
| Build-Critic gates | ✅ | Phase 2 critic + Phase 4 design critic |
| Slide Design Gate | ✅ | Phase 4 explicitly |
| Compaction survival | ✅ | This schematic + markers system |
| LAW 5 sources | ✅ | Sub-agent briefed to source all claims |
| Delivery time lock | ✅ | 5 PM PST, no output before |
