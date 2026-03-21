---
name: sponsor-outreach
description: Sponsor outreach engine for Rex. Researches prospects, drafts personalized outreach campaigns, builds pitch materials, and manages the sponsorship pipeline for Hit Network (Discover Crypto, Blockchain Basement). Trigger on "find sponsors", "sponsor outreach", "pitch to", "sponsorship pipeline", "brand deals", "media kit", or any request related to sponsorship or brand partnership development. Never sends outreach without human approval.
---

# Sponsor Outreach Engine

**Trigger:** "Find sponsors," "sponsor outreach," "pitch to," "sponsorship pipeline," "brand deals"

---

## 1. Prospect Research

**Target sponsor categories:**
- Crypto: exchanges, protocols, wallets
- Fintech: trading platforms, payment tools
- Education: courses, learning platforms
- Hardware: mining equipment, cold wallets
- Adjacent: VPNs, productivity tools popular with crypto audience

**For each prospect, research and deliver:**
- Company overview (product, stage, recent news/funding)
- Target audience overlap with Hit Network
- Estimated budget range (based on company size and sponsorship history)

**Scoring matrix (1-10 each):**
| Dimension | Description |
|-----------|-------------|
| Fit | How well their product aligns with our audience |
| Budget likelihood | Company size + known sponsorship activity |
| Relationship warmth | Cold / warm intro / existing connection |
| Strategic value | Beyond money — distribution, credibility, co-marketing |

See [pipeline-tracker.md](references/pipeline-tracker.md) for full prospect tracking format.

---

## 2. Outreach Templates

**Cold outreach structure:** Personalized intro → audience value prop → specific partnership ideas → soft CTA

**Follow-up sequence:**
- **Day 3:** Value-add follow-up (share relevant insight or content)
- **Day 7:** Case study or social proof share
- **Day 14:** Final touch — keep the door open

**Identity rules:**
- Always use Public Name (Rex) in external outreach
- Email signature — ALL sponsor outreach signs off as:
  `Rex | Hit Network / Sent on behalf of Kelly, Head of AI & Product Development / Hit Network | Discover Crypto`
- Apply Humanization Framework — EMAIL mode = MAXIMUM (LAW 1 in AGENTS.md)
- **NEVER send without Kelly's explicit approval**

**PRE-SEND GATE — sub-agent proof runs FIRST. Hard stop. (PR-008)**

Sponsor outreach is external, business-critical correspondence. The same sub-agent proof required for email-assistant applies here — no exceptions.

**Step 1:** Spawn proofreader sub-agent with full draft + humanization rules (use template from humanization-voice/SKILL.md). Wait for PASS. If FAIL, fix every flagged violation and re-proof. Do not present draft until PASS is on record.

**Step 2:** Show this gate before presenting to Kelly:
```
⚙️ OUTPUT GATE — Sponsor Outreach
─────────────────────────────────────────────────────────
SUB-AGENT PROOF  : ✅ PASSED
LAW 1 │ Humanization  : ✅ PASS — EMAIL mode (MAXIMUM)
  ✅ Contractions: [X found]
  ✅ Em dashes: none found
  ✅ No banned transitions
  ✅ Sentence rhythm: varied
  ✅ And/But starter: [quote]
  ✅ Fragment: [quote]
  ✅ Subject/intro/outro: conversational
LAW 5 │ Sources       : ✅ TAGGED — all audience metrics sourced [Source: | Date:]
LAW 6 │ Human Approval: ⏸ HOLDING — not sending until Kelly says "send"
─────────────────────────────────────────────────────────
```
**⏸ OUTREACH NOT SENT. Draft presented for approval only.**

See [outreach-templates.md](references/outreach-templates.md) for full email scripts.

---

## 3. Pitch Materials

**Media kit includes:**
- Audience demographics (age, geography, crypto experience level)
- Reach metrics: YouTube subscribers, views/month, Discord members, X followers
- Engagement rates: avg views, comments, click-through
- Past sponsor results / case studies (where available and verified)

**Custom proposals:** Tailored to each prospect's goals and budget.

**Rate card:** Standard packages with pricing and deliverables. See [rate-card.md](references/rate-card.md) — live document with real pricing anchored to active sponsor deals.

**Media kit:** Built with real metrics. See [media-kit.md](references/media-kit.md) — use this for all outreach, not the template.

All metrics must include `[Source: YouTube Analytics / Discord API / X Analytics | Date: ...]`

---

## 4. Pipeline Management

**Deal stages:** `Cold → Contacted → Meeting → Proposal → Negotiation → Closed → Lost`

**Weekly pipeline report includes:**
- New prospects added
- Status changes
- Expected close dates
- Total pipeline value (PROJECTED — not booked revenue)

**Auto-flag:** Any deal in Negotiation stage for >14 days without movement → surface to Kelly with recommended action.

---

## Anti-Hallucination

Never fabricate audience metrics, engagement rates, or past sponsor results. All numbers sourced from verified analytics platforms. If data isn't available yet, mark clearly as `[PENDING — pull from analytics]` rather than estimating.
