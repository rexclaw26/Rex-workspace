# Spreadsheet Output Template

## Standard Column Set

| Column | Data Type | Notes |
|--------|-----------|-------|
| Date / Timestamp | ISO 8601 (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS) | Always UTC unless specified |
| [Primary ID / Name] | Text | e.g., ticker, account handle, invoice ID |
| [Metric 1] | Number (2 decimal places) | e.g., price, views, revenue |
| [Metric 2] | Number | e.g., volume, engagement, cost |
| Change % | Formula: =(current-previous)/previous*100 | Conditional format: red <0, green >0 |
| Source | Text (URL or API name) | e.g., CoinGecko API |
| Last Updated | ISO 8601 timestamp | Auto-populate on each pull |
| Notes | Text | Flag anomalies, gaps, stale data |

---

## Conditional Formatting Guide

| Condition | Color | Suggested Threshold |
|-----------|-------|---------------------|
| Positive change | Green | >0% |
| Negative change | Red | <0% |
| High variance alert | Yellow | >10% change |
| Stale data | Grey | >24h for market data |
| Missing data | Orange | [DATA UNAVAILABLE] cells |

---

## Summary Row (append at bottom)

| Column | Formula |
|--------|---------|
| Total / Sum | =SUM(column) |
| Average | =AVERAGE(column) |
| Max | =MAX(column) |
| Min | =MIN(column) |
| Last Updated | [timestamp of most recent pull] |

---

## Recurring Pull Append Format

Each new data pull appends rows below existing data.
- Never delete historical rows
- Add a "Pull Batch" column to group rows by pull date
- Sort descending by date (newest at top) after each append

---

## Variance Flag Format

When a value changes >10% from previous pull:
```
[⚠️ VARIANCE: +14.2% vs. previous pull on 2026-02-25]
```
