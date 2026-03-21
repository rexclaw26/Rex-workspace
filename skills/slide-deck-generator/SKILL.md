---
name: slide-deck-generator
description: Slide deck and pitch deck generator for Rex. Creates structured presentation content for Hit Network, Discover Crypto, and Blockchain Basement — including investor decks, sponsor pitches, internal presentations, and educational slide sets. Trigger on "make a presentation", "pitch deck", "slide deck", "slides for", or any request to build a presentation. Generates outline first for approval, then full slide content with speaker notes and visual suggestions.
---

# Slide Deck / Pitch Deck Generator

**Trigger:** "Make a presentation," "pitch deck," "slide deck," "slides for"

---

## ⚠️ MANDATORY GATE — Slide Design Review

**Before presenting ANY completed slide deck to Kelly, a sub-agent design review MUST run. No exceptions.**

This is a hard stop — no deck is delivered without it.

**Step 1 — Sub-agent Design Review**

Spawn a sub-agent with the full slide deck content and these exact instructions:

```
You are a senior presentation designer. Review these slides against the Hit Network Slide Design Standards below. Return a structured PASS/FAIL report covering every check. Be specific — cite the slide number and exact issue for every FAIL.

HIT NETWORK SLIDE DESIGN STANDARDS:
1. WHITESPACE: Each slide must breathe. No slide should have more than 4 primary elements. Dense grids of 6+ items = FAIL.
2. INFORMATION DENSITY: One key message per slide. Supporting points should expand, not compete. More than 4 bullet points on a single slide = FAIL.
3. TYPOGRAPHY HIERARCHY: Clear H1 → sub-heading → body text distinction on every slide. All text same size and weight = FAIL.
4. COLOR DISCIPLINE: Max 2 accent colors per slide. Rainbow multi-color schemes per slide = FAIL. Colors must match the deck's defined palette.
5. VISUAL BALANCE: Consistent padding, margins, and alignment throughout. Misaligned or inconsistent spacing = FAIL.
6. APPLE CLARITY TEST: A viewer should grasp the slide's core message in under 3 seconds. If they need to read all the text to understand it, the slide fails.
7. BRAND COMPLIANCE: Hit Network colors and fonts applied correctly. No off-brand colors or generic template styling.
8. HERO/TITLE SLIDES: Must have generous whitespace, dominant headline, minimal supporting text. Crowded hero = FAIL.
9. TABLE/DATA SLIDES: Tables must be clean, high contrast, legible at a glance. Tiny text or cramped columns = FAIL.
10. CONSISTENCY CHECK: Cards, borders, font sizes, and spacing must be visually consistent slide-to-slide throughout the deck.

For each check: PASS or FAIL. For FAIL: cite slide # and exact issue.
Final verdict: PASS (all 10 pass) or FAIL (any check fails).
```

**Step 2 — Visible Design Gate**

After sub-agent review completes, show this gate before presenting the deck to Kelly. Not optional. Not skippable. Must appear in output.

```
⚙️ SLIDE DESIGN GATE — [Deck Name]
─────────────────────────────────────────────────────────
SUB-AGENT DESIGN REVIEW : ✅ PASSED — [session key or "run complete"]
─────────────────────────────────────────────────────────
DESIGN CHECKS:
  ✅/❌ 01 — Whitespace: [result]
  ✅/❌ 02 — Info density: [result]
  ✅/❌ 03 — Typography hierarchy: [result]
  ✅/❌ 04 — Color discipline: [result]
  ✅/❌ 05 — Visual balance: [result]
  ✅/❌ 06 — Apple clarity (3-second test): [result]
  ✅/❌ 07 — Brand compliance: [result]
  ✅/❌ 08 — Hero/title slides: [result]
  ✅/❌ 09 — Table/data legibility: [result]
  ✅/❌ 10 — Cross-deck consistency: [result]
─────────────────────────────────────────────────────────
```

**If any check is ❌:** Fix the specific slides flagged. Run the sub-agent review again. Only present after all 10 pass.

**If the gate is missing:** That is a protocol violation. Treat it the same as a missing LAW 1 checklist.

---

## 1. Design Philosophy — Hit Network Slide Standard

Every deck must meet these non-negotiable standards before delivery:

### Apple Elegance Principle
Think Apple Keynote, not PowerPoint. The goal is:
- **Restraint over decoration** — what you remove matters as much as what you add
- **One idea per slide** — the viewer's eye goes to one thing, absorbs it, moves on
- **Big space = big confidence** — generous whitespace signals quality
- **Typography does the heavy lifting** — not decorative elements or gradients

### Hit Network Brand Application
- **Dark navy + orange** is the foundation: `bg #0B1120→#0F172A`, orange `#F97316`/`#EA580C`
- Each deck may have its own accent color palette **within** the dark navy base — this is what differentiates decks visually without breaking brand
- Maximum 2 accent colors per deck (e.g., blue + gold, or emerald + amber)
- Fonts: JetBrains Mono (headlines/display), Outfit (body), Share Tech Mono (data/numbers)

### Information Density Rules
| Element | Maximum |
|---------|---------|
| Bullets per slide | 4 |
| Words per bullet | 12 |
| Primary elements per slide | 4 |
| Accent colors per slide | 2 |
| Items in a stat grid | 6 (2×3 max) |
| Columns in a table | 5 |

### Slide Type Hierarchy (use in this order of preference)
1. **Impact stat** — 1–3 large numbers with labels. Most powerful.
2. **Single statement** — Big headline, 2 lines max, minimal support text.
3. **Grouped bullets (3–4 max)** — Each with icon + 1-line head + optional 1-line support.
4. **Comparison table** — Only when direct comparison drives the point.
5. **Two-column** — Only when two distinct parallel points need to coexist.
6. **Dense grid** — Last resort. If you're reaching for this, split the slide.

---

## 2. Deck Structure

Before building, gather if not provided:
- Purpose (pitch, internal update, educational, sponsor proposal)
- Audience
- Key message (the one thing they must leave knowing)
- Desired length (number of slides)
- Tone (formal pitch / energetic brand / educational)

**Generate outline for approval before building any content.**

**⏸ OUTLINE GATE — fires before every slide deck:**
```
⚙️ OUTLINE GATE — Slide Deck Generator
⏸ Outline presented below. Full deck will not be built until Kelly approves this structure.
Reply "approved" or provide edits.
```

**Standard structure:**
`Title → Agenda → Problem → Solution → Data/Evidence → Ask/CTA → Appendix`

**Pitch deck structure (investor/sponsor):**
`Problem → Solution → Market → Traction → Team → Ask`

---

## 3. Content Per Slide

For every slide, deliver:

| Element | Rule |
|---------|------|
| **Headline** | 1 clear takeaway statement — not a topic label |
| **Body** | 3–4 points max, 1 line each. Shorter = better. |
| **Visual Suggestion** | Chart type, image concept, or diagram where relevant |

Humanization level: MODERATE (Presentation mode). Professional and polished, still human.

---

## 4. Pitch Deck Specifics

For investor or sponsor audiences:
- Use: Problem → Solution → Market → Traction → Team → Ask
- Include competitive landscape slide with positioning matrix
- Financial projections with clearly stated assumptions (mark all as `PROJECTED`)
- Every metric: `[Source: ...]` tag required
- Include appendix slides for deep-dive questions

---

## 5. Brand Compliance

- Apply Hit Network / Discover Crypto brand tone: professional but energetic — not corporate-boring, not crypto-bro
- All data visualizations: clear, labeled, and sourced
- Flag any slide where brand assets (logos, colors) need to be applied by the designer

---

## Anti-Hallucination

Never fabricate metrics, revenue figures, or market data. Mark estimates as `[Estimate — methodology: ...]`. Flag any data points that need verification before the deck is presented.
