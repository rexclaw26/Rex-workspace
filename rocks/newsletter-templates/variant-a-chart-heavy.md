# Newsletter Template — Variant A (Chart-Heavy)

**When to use:** Market volatility days (BTC/ETH > 3% move), Fear & Greed swings, major on-chain events, liquidation spikes.

---

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
    h1, h2, h3 { color: #111; }
    .chart-container { margin: 20px 0; text-align: center; }
    .chart-placeholder { background: #f5f5f5; border: 2px dashed #ddd; padding: 40px; margin: 10px 0; border-radius: 8px; }
    .market-stats { display: flex; justify-content: space-between; margin: 20px 0; background: #f9f9f9; padding: 15px; border-radius: 8px; }
    .stat { text-align: center; }
    .stat-value { font-size: 1.5em; font-weight: bold; display: block; }
    .stat-label { font-size: 0.9em; color: #666; }
    .green { color: #22c55e; }
    .red { color: #ef4444; }
    .headline { font-size: 1.2em; font-weight: bold; margin: 15px 0 10px; }
    .chart-note { font-size: 0.85em; color: #888; font-style: italic; margin-top: 5px; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <h1 style="color: #2563eb;">Discover Crypto — Daily Brief</h1>
  <p><strong>{{DATE}}</strong></p>
  <p>Good morning. Here's what's moving markets and what it means for your portfolio.</p>

  <!-- MARKET SNAPSHOT (HEAVY CHART FOCUS) -->
  <div class="market-stats">
    <div class="stat">
      <span class="stat-label">Bitcoin</span>
      <span class="stat-value {{BTC_COLOR}}">${{BTC_PRICE}}</span>
      <span class="stat-value" style="font-size: 1em;">{{BTC_24H}}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Ethereum</span>
      <span class="stat-value {{ETH_COLOR}}">${{ETH_PRICE}}</span>
      <span class="stat-value" style="font-size: 1em;">{{ETH_24H}}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Fear & Greed</span>
      <span class="stat-value">{{FNG_SCORE}}</span>
      <span class="stat-value" style="font-size: 1em;">{{FNG_LABEL}}</span>
    </div>
  </div>

  <!-- CHARTS SECTION -->
  <div class="chart-container">
    <h3>📊 Key Visuals</h3>
    <!-- TradingView Widget -->
    <div class="chart-placeholder">
      <strong>BTC/USD — 24 Hour Chart</strong>
      <p>Link: <a href="{{TRADINGVIEW_BTC_URL}}">Open TradingView</a></p>
    </div>
    <div class="chart-placeholder">
      <strong>Fear & Greed Index — 30 Day Trend</strong>
      <p>Link: <a href="{{TRADINGVIEW_FNG_URL}}">Open F&G Chart</a></p>
    </div>
    <div class="chart-placeholder">
      <strong>{{ONCHAIN_METRIC_LABEL}}</strong>
      <p>Link: <a href="{{GLASSNODE_URL}}">Open Glassnode</a></p>
    </div>
  </div>

  <!-- HEADLINES (PRIORITIZED BY DATA IMPORTANCE) -->
  <div class="headline">1. {{MAIN_STORY_TITLE}}</div>
  <p>{{MAIN_STORY_SUMMARY}}</p>
  <p><em><strong>Why it matters:</strong> {{MAIN_STORY_IMPACT}}</em></p>

  <div class="headline">2. {{SECONDARY_STORY_TITLE}}</div>
  <p>{{SECONDARY_STORY_SUMMARY}}</p>
  <p><em><strong>Why it matters:</strong> {{SECONDARY_STORY_IMPACT}}</em></p>

  <div class="headline">3. {{TERTIARY_STORY_TITLE}}</div>
  <p>{{TERTIARY_STORY_SUMMARY}}</p>

  <!-- WATCHLIST (WITH LEVELS) -->
  <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 25px;">
    <h3 style="margin-top: 0;">👀 What I'm Watching</h3>
    <ul style="margin: 0;">
      <li><strong>BTC:</strong> Watch <strong>${{BTC_SUPPORT}}</strong> (Support) & ${{$BTC_RESISTANCE}}</li>
      <li><strong>ETH:</strong> Watch <strong>${{ETH_SUPPORT}}</strong> (Support)</li>
      <li><strong>On-Chain:</strong> {{WATCHLIST_ONCHAIN}}</li>
    </ul>
  </div>

  <!-- FOOTER -->
  <hr style="border: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 0.9em; color: #666;">
    <strong>Next Issue:</strong> Tomorrow, 7:00 AM PST<br>
    <strong>Founding Member Offer:</strong> Lock in $10/mo for life — <a href="{{SUBSTACK_LINK}}">Subscribe Now</a>
  </p>
  <p style="font-size: 0.8em; color: #999; margin-top: 20px;">
    <em>Disclaimer: This is for educational purposes only. Not financial advice. Past performance is not indicative of future results.</em>
  </p>

</body>
</html>
```

---

## **Data Requirements for Variant A**

1. **Price Data:** BTC/ETH live prices, 24h % change
2. **TradingView Links:** 
   - BTC/USD 24h candle
   - ETH/USD 24h candle
   - Fear & Greed Index (30d)
3. **On-Chain Data:** 
   - Whale activity % change
   - Exchange flow volume
   - MVRV/SOPR ratio
4. **Key Levels:** Support/Resistance for BTC & ETH
5. **Story Impact:** 1-sentence "Why it matters" for each headline

---

## **When to Deploy**
- ✅ BTC 24h move > 3%
- ✅ F&G Index change > 10 points
- ✅ Major liquidation event (> $100M)
- ✅ ETF inflow/outflow > $500M
- ✅ On-chain anomaly (whale accumulation, exchange dump)

## **Visual Notes**
- Use **green** for bullish, **red** for bearish
- Embed TradingView widget links (clickable)
- Chart placeholders should be large and prominent
- Min 3 charts per issue
