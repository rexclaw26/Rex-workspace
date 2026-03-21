# Newsletter Template — Variant B (News-Heavy)

**When to use:** Quiet market days (BTC/ETH < 2% move), regulatory breakthroughs, partnership announcements, major policy shifts, adoption news.

---

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
    h1, h2, h3 { color: #111; }
    .headline-box { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .stat-mini { display: inline-block; margin-right: 15px; font-size: 0.9em; }
    .stat-mini strong { color: #2563eb; }
    .quote-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; font-style: italic; }
    .link-list a { color: #2563eb; text-decoration: none; }
    .link-list a:hover { text-decoration: underline; }
    .section-title { font-size: 1.1em; font-weight: bold; margin: 25px 0 10px; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <h1 style="color: #2563eb;">Discover Crypto — Daily Brief</h1>
  <p><strong>{{DATE}}</strong></p>
  <p>Good morning. Here's what's moving markets and what it means for your portfolio.</p>

  <!-- MARKET SNAPSHOT (MINIMAL CHARTS) -->
  <div style="margin: 20px 0; padding: 10px; background: #f9fafb; border-radius: 8px;">
    <span class="stat-mini"><strong>Bitcoin:</strong> ${{BTC_PRICE}} {{BTC_24H}}</span>
    <span class="stat-mini"><strong>Ethereum:</strong> ${{ETH_PRICE}} {{ETH_24H}}</span>
    <span class="stat-mini"><strong>Market Cap:</strong> ${{MKT_CAP}}</span>
    <span class="stat-mini"><strong>Fear & Greed:</strong> {{FNG_SCORE}} ({{FNG_LABEL}})</span>
  </div>

  <p style="font-size: 0.9em; color: #666;"><em>Markets are calm today — let's dive into what's actually moving.</em></p>

  <!-- MAJOR STORY (TEXT-FOCUSED) -->
  <div class="headline-box">
    <h2 style="margin-top: 0;">🗞️ {{MAIN_STORY_TITLE}}</h2>
    <p>{{MAIN_STORY_SUMMARY}}</p>
    <p><em><strong>The context:</strong> {{MAIN_STORY_CONTEXT}}</em></p>
    <p><em><strong>Why it matters:</strong> {{MAIN_STORY_IMPACT}}</em></p>
    <div class="quote-box">
      <strong>Key quote:</strong> "{{{MAIN_STORY_QUOTE}}}"
    </div>
  </div>

  <!-- SECONDARY STORY (WITH DATA VISUAL) -->
  <h3 class="section-title">📈 {{SECONDARY_STORY_TITLE}}</h3>
  <p>{{SECONDARY_STORY_SUMMARY}}</p>
  <p><em><strong>Key data:</strong></em></p>
  <ul>
    <li>{{DATA_POINT_1}}</li>
    <li>{{DATA_POINT_2}}</li>
    <li>{{DATA_POINT_3}}</li>
  </ul>
  <p><a href="{{DATA_SOURCE_LINK}}">View full data source →</a></p>

  <!-- THIRD STORY (PURE NEWS) -->
  <h3 class="section-title">💡 {{TERTIARY_STORY_TITLE}}</h3>
  <p>{{TERTIARY_STORY_SUMMARY}}</p>
  <p><a href="{{ARTICLE_LINK}}">Read original article →</a></p>

  <!-- WATCHLIST -->
  <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 25px 0;">
    <h3 style="margin-top: 0;">👀 What I'm Watching</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li>{{WATCH_1}}</li>
      <li>{{WATCH_2}}</li>
      <li>{{WATCH_3}}</li>
    </ul>
  </div>

  <!-- CONTENT ANGLES -->
  <h3 class="section-title">💡 Content Ideas for Today</h3>
  <p><strong>1. {{CONTENT_1_TITLE}}</strong></p>
  <p>{{CONTENT_1_DESCRIPTION}}</p>
  <p><strong>2. {{CONTENT_2_TITLE}}</strong></p>
  <p>{{CONTENT_2_DESCRIPTION}}</p>

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

## **Data Requirements for Variant B**

1. **Basic Price Data:** BTC/ETH prices, % change (minimal)
2. **Main Story:**
   - Full summary (2-3 paragraphs)
   - Context paragraph
   - 1-sentence impact
   - Key quote from source
3. **Secondary Story:**
   - 3 key data points
   - Link to source data
4. **Third Story:**
   - Pure news summary
   - Link to article
5. **Watchlist:** 3 specific things to track
6. **Content Ideas:** 2 specific angles for today

---

## **When to Deploy**
- ✅ BTC 24h move < 2%
- ✅ Regulatory news (legislation, court rulings)
- ✅ Partnership announcements (institutional, corporate)
- ✅ Adoption news (country-level, enterprise)
- ✅ Major policy shifts (Fed, SEC, CFTC)

## **Visual Notes**
- Minimal charts (maybe 1 small data viz)
- Focus on quotes, data points, context
- Use colored boxes to highlight key stories
- Prioritize readability over visuals
