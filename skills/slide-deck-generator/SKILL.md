---
name: slide-deck-generator
description: Slide deck and pitch deck generator for Rex. Creates structured presentation content for Hit Network, Discover Crypto, and Blockchain Basement — including investor decks, sponsor pitches, internal presentations, and educational slide sets. Trigger on "make a presentation", "pitch deck", "slide deck", "slides for", or any request to build a presentation. Generates outline first for approval, then full slide content with speaker notes and visual suggestions.
---

# Slide Deck / Pitch Deck Generator

**Trigger:** "Make a presentation," "pitch deck," "slide deck," "slides for"

---

## 1. Deck Structure

Before building, gather if not provided:
- Purpose (pitch, internal update, educational, sponsor proposal)
- Audience
- Key message (the one thing they must leave knowing)
- Desired length (number of slides)
- Tone (formal pitch / energetic brand / educational)

**Generate outline for approval before building any content.**

**Standard structure:**
`Title → Agenda → Problem → Solution → Data/Evidence → Ask/CTA → Appendix`

**Pitch deck structure (investor/sponsor):**
`Problem → Solution → Market → Traction → Team → Ask`

See [slide-templates.md](references/slide-templates.md) for full structure options.

---

## 2. Content Per Slide

For every slide, deliver:

| Element | Rule |
|---------|------|
| **Headline** | 1 clear takeaway statement — not a topic label |
| **Body** | 3-5 bullet points max, 1 line each |
| **Speaker Notes** | Full talking points for the presenter |
| **Visual Suggestion** | Chart type, image concept, or diagram where relevant |

Humanization level: MODERATE (Presentation mode). Professional and polished, still human.

---

## 3. Pitch Deck Specifics

For investor or sponsor audiences:
- Use: Problem → Solution → Market → Traction → Team → Ask
- Include competitive landscape slide with positioning matrix
- Financial projections with clearly stated assumptions (mark all as `PROJECTED`)
- Every metric: `[Source: ...]` tag required
- Include appendix slides for deep-dive questions

---

## 4. Brand Compliance

- Apply Hit Network / Discover Crypto brand tone: professional but energetic — not corporate-boring, not crypto-bro
- All data visualizations: clear, labeled, and sourced
- Flag any slide where brand assets (logos, colors) need to be applied by the designer

See [brand-guidelines.md](references/brand-guidelines.md) for color palette and visual standards.

---

## Output Format

Deliver each slide as:
```
SLIDE [N]: [Slide Title]
Headline: [Takeaway statement]
Bullets:
  • [Point 1]
  • [Point 2]
  • [Point 3]
Speaker Notes: [Full talking points]
Visual: [Suggestion for chart/image/diagram]
Data Flags: [Any figures needing verification]
```

---

## Anti-Hallucination

Never fabricate metrics, revenue figures, or market data. Mark estimates as `[Estimate — methodology: ...]`. Flag any data points that need verification before the deck is presented.
