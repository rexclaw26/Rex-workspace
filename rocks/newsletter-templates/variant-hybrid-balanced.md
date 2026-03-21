# Newsletter Template — Variant C (Hybrid/Balanced)

**When to use:** Moderate volatility (BTC/ETH 2-3% move), mixed news days (some data-heavy stories + some qualitative), general market updates.

---

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
    h1, h2, h3 { color: #111; }
    .chart-inline { display: inline-block; vertical-align: middle; margin: 10px 15px; }
    .story-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .story-card.featured { border-left: 4px solid #2563eb; background: #eff6ff; }
    .story-card.standard { border-left: 4px solid #9ca3af; }
    .metric-box { display: inline-block; margin: 5px 10px; padding: 8px 12px; background: #f3f4f6; border-radius: 6px; font-size: 0.9em; }
    .metric-box.green { background: #d1fae5; border: 1px solid #10b981; }
    .metric-box.red { background: #fee2e2; border: 1px solid #ef4444; }
    .chart-mini { width: 100%; height: 150px; background: #f9fafb; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin: 10px 0; }
    .link-box { background: #fef3c7; padding: 12px; border-radius: 6px; margin: 15px 0; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <h1 style="color: #2563eb;">Discover Crypto — Daily Brief</h1>
  <p><strong>{{DATE}}</strong></p>
  <p>Good morning. Here's what's moving markets and what it means for your portfolio.</p>

  <!-- MARKET SNAPSHOT (BALANCED CHARTS) -->
  <div style="margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong>Bitcoin:</strong> ${{BTC_PRICE}} 
        <span class="metric-box {{BTC_COLOR}}">{{BTC_24H}}</span>
        <span class="chart-mini">[TradingView: BTC/USD 1h]</span>
      </div>
      <div style="text-align: right;">
        <strong>Market Sentiment:</strong> {{FNG_SCORE}} - {{FNG_LABEL}}
        <br>
        <span class="chart-mini">[F&G Chart: 7d]</span>
      </div>
    </div>
  </div>

  <!-- FEATURED STORY (WITH CHART) -->
  <div class="story-card featured">
    <h2 style="margin-top: 0;">🗞️ {{MAIN_STORY_TITLE}}</h2>
    <p>{{MAIN_STORY_SUMMARY}}</p>
    <p><em><strong>Key data:</strong> {{KEY_DATA_POINT}}</em></p>
    <div class="chart-mini" style="background: #dbeafe;">
      [Embedded Chart: {{CHART_DESCRIPTION}}]
    </div>
    <p><a href="{{CHART_LINK}}">View full chart →</a></p>
  </div>

  <!-- SECONDARY STORY (MINIMAL VISUALS) -->
  <div class="story-card standard">
    <h3 style="margin-top: 0;">📈 {{SECONDARY_STORY_TITLE}}</h3>
    <p>{{SECONDARY_STORY_SUMMARY}}</p>
    <p><em><strong>Impact:</strong> {{SECONDARY_STORY_IMPACT}}</em></p>
    <div class="metric-box {{COLOR_CLASS}}">{{DATA_METRIC}}</div>
  </div>

  <!-- QUICK NEWS (NO VISUALS) -->
  <h3 style="margin: 25px 0 15px;">💬 Quick Hits</h3>
  <div style="padding-left: 20px;">
    <p><strong>{{QUICK_HIT_1_TITLE}}</strong><br>{{QUICK_HIT_1_SUMMARY}}</p>
    <p><strong>{{QUICK_HIT_2_TITLE}}</strong><br>{{QUICK_HIT_2_SUMMARY}}</p>
    <p><strong>{{QUICK_HIT_3_TITLE}}</strong><br>{{QUICK_HIT_3_SUMMARY}}</p>
  </div>

  <!-- WATCHLIST -->
  <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 25px 0;">
    <h3 style="margin-top: 0;">👀 Watchlist</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li>{{WATCH_1}}</li>
      <li>{{WATCH_2}}</li>
      <li>{{WATCH_3}}</li>
    </ul>
  </div>

  <!-- CONTENT IDEAS -->
  <h3 style="margin: 25px 0 15px;">💡 Content Ideas</h3>
  <div class="link-box">
    <strong>{{CONTENT_IDEA_1}}</strong><br>
    <span style="font-size: 0.9em; color: #666;">{{CONTENT_1_REASON}}</span>
  </div>

  <!-- FOOTER -->
  <hr style="border: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 0.9em; color: #666;">
    <strong>Next Issue:</strong> Tomorrow, 7:00 AM PST<br>
    <strong>Founding Member Offer:</strong> Lock in $10/mo for life — <a href="{{SUBSTACK_LINK}}">Subscribe Now</a>
  </p>
  <p style="font-size: 0.8em; color: #999; margin-top: 20px;">
    <em>Disclaimer: This is for educational purposes only. Not financial advice.</em>
  </p>

</body>
</html>
```

---

## **Data Requirements for Variant C**

1. **Basic Price Data:** BTC/ETH, % change
2. **Main Story:**
   - Full summary
   - 1 key data point
   - 1 embedded chart
   - Chart link
3. **Secondary Story:**
   - Summary
   - 1 metric box (green/red)
4. **Quick Hits:** 3 short news items (no charts)
5. **Watchlist:** 3 specific items
6. **Content Ideas:** 1 idea with reasoning

---

## **When to Deploy**
- ✅ BTC 24h move 2-3%
- ✅ Mixed news (some data + some qualitative)
- ✅ General market updates
- ✅ No extreme volatility, but enough to warrant charts

## **Visual Notes**
- 1-2 charts maximum
- Metric boxes for quick data
- Feature story gets the chart
- Quick hits have no visuals
- Balanced readability
