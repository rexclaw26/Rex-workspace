---
name: discord-analytics
description: Discord community data analysis for Rex. Tracks community health metrics, sentiment, channel performance, and growth trends for Hit Network Discord servers (Discover Crypto, Blockchain Basement). Trigger on "Discord analytics", "community data", "member engagement", "Discord report", "how is the community doing", or any request to analyze Discord activity. Delivers weekly community reports and flags urgent issues in real time.
---

# Discord Community Data Analysis

**Trigger:** "Discord analytics," "community data," "member engagement," "Discord report"
**Data source:** Discord API (message history, member data, role assignments, reaction counts)

---

## 1. Community Health Metrics

Track and report:
- **Active members:** DAU / WAU / MAU
- **Retention:** New joins vs. leaves — net member change + retention rate
- **Message volume:** By channel, trending up or down vs. prior period
- **Peak activity:** Hours and days with highest engagement
- **Top contributors:** Most active members, engagement leaders by reaction count

---

## 2. Sentiment Analysis

- **Overall mood:** Positive / Neutral / Negative — scored by message tone
- **Hot topics:** What members are talking about most (by keyword frequency + thread volume)
- **Pain points:** Recurring complaints or requests — flag for community team
- **Feature/content requests:** Surface actionable suggestions from the community

---

## 3. Channel Performance

| Metric | Description |
|--------|-------------|
| Most active channels | Ranked by message volume + unique user count |
| Dead channels | No activity in 7+ days → recommend archive or revitalize |
| Channel-specific engagement | Messages per user, reaction rate, thread depth |

---

## 4. Reporting

**Weekly community report includes:**
- Key metrics vs. prior week (with % change)
- Trending topics and notable threads
- Retention rate and growth
- Action items for community team

**Urgent flags (immediate alert to Kelly):**
- Spam attack or raid detected
- Member disputes escalating
- Technical problems (bot failures, permission errors)
- Significant membership drop (>5% in 24h)

See [weekly-report-template.md](references/weekly-report-template.md) for format.
See [growth-playbook.md](references/growth-playbook.md) for data-driven growth recommendations.

---

## Anti-Hallucination

Never fabricate member counts, engagement metrics, or sentiment scores. Every metric must include the time range and data source:
`[Source: Discord API | Period: YYYY-MM-DD to YYYY-MM-DD]`
