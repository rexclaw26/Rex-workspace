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

| Metric | Source | Live? |
|--------|--------|-------|
| YouTube subscribers + views | YouTube Analytics API | ✅ Pull live via gog or API |
| X followers | X Analytics API | ✅ Pull live |
| Discord members | Discord API | ✅ Pull live |
| Weekly revenue | Stripe API | ✅ Pull live |
| Sponsor pipeline value | sponsor-outreach/references/pipeline-tracker.md | ✅ Active sponsors: $42K MRR |
| 90-Day Rock status | weekly-scorecard/references/rocks-tracker.md | ✅ Updated |
| Issues | error-journal/references/journal-log.md | ✅ Active |
| Content pipeline status | content-pipeline skill (Mission Control) | 🔲 Aspirational — use manual status until Mission Control is built |
| Compliance rate | compliance-audit/references/daily-checklist.md | ✅ Logging started 2026-03-04 |
| AI ops costs | role-identity cost dashboard | 🔲 Aspirational — report "not yet tracked" until dashboard is built |

**When a data source is unavailable:** Report `[Source unavailable — [reason] | Will be live when [X] is built]` — never estimate or omit silently.

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

## Pre-Output Gate

**Must appear before every scorecard delivered to Kelly:**
```
⚙️ OUTPUT GATE — Weekly Scorecard
LAW 1 │ Humanization  : ✅ PASS — REPORT mode
LAW 5 │ Sources       : ✅ TAGGED — all metrics sourced live with [Source: | Date:] tags
        Unavailable sources: [list or "none"] — reported honestly, not estimated
LAW 6 │ Human Approval: N/A — internal report
```

## Anti-Hallucination

Never fabricate metrics, subscriber counts, revenue figures, or Rock completion percentages. If a data source is unavailable on a given Monday, report: `[Source unavailable — last known value: X as of DATE]` rather than estimating. A scorecard with honest gaps is better than one with invented numbers.
