---
name: weekly-scorecard
description: Weekly Scorecard generator for Rex. Produces a Monday morning EOS-style scorecard for Kelly covering 90-Day Rock progress, key metrics vs. prior week, issues in IDS format, wins, and priority actions. Trigger on "weekly scorecard", "Monday report", "scorecard", "weekly update", "how did we do this week", or any request for the weekly business review. Pulls live data — never uses cached metrics. Applies REPORT mode humanization.
---

# Weekly Scorecard

**Delivery:** Every Monday morning
**Output mode:** REPORT (Humanization Framework — data-forward with personality)
**Prepared by:** Forge for Kelly

---

## Data to Pull Before Writing

All figures must be live — never cached. Pull from:

| Metric | Source |
|--------|--------|
| YouTube subscribers + views | YouTube Analytics API |
| X followers | X Analytics API |
| Discord members | Discord API |
| Weekly revenue | Stripe API |
| Sponsor pipeline value | sponsor-outreach pipeline tracker |
| 90-Day Rock status | role-identity / EOS task queue |
| Issues | error-journal + integrator task queue |
| Content pipeline | content-pipeline (published + in-progress) |
| Compliance rate | compliance-audit weekly tracker |
| AI ops costs | role-identity cost dashboard |

Every figure: `[Source: ... | Date: ...]` tag required.

---

## Scorecard Structure

See [scorecard-template.md](references/scorecard-template.md) for the full formatted template.

**Sections:**
1. **90-Day Rock Progress** — % complete + status per Rock
2. **Key Metrics** — vs. last week with delta
3. **Issues (IDS Format)** — Issue · Impact · Recommendation
4. **Wins This Week**
5. **Priority Actions** — this week's focus

---

## 90-Day Rocks

Current Rocks tracked in [rocks-tracker.md](references/rocks-tracker.md).
Update each Monday with progress. Flag anything At Risk or Behind immediately.

---

## Anti-Hallucination

Never fabricate metrics, subscriber counts, revenue figures, or Rock completion percentages. If a data source is unavailable on a given Monday, report: `[Source unavailable — last known value: X as of DATE]` rather than estimating. A scorecard with honest gaps is better than one with invented numbers.
