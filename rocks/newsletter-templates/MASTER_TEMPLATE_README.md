# Newsletter Template System — Master Guide

**Location:** `/rocks/newsletter-templates/`

**Purpose:** Flexible, smart chart integration system for Discover Crypto daily newsletter.

---

## 🎯 How to Choose the Right Template

### **Variant A: Chart-Heavy**
**Use when:**
- ✅ BTC 24h move > 3% (up or down)
- ✅ Fear & Greed Index swings > 10 points
- ✅ Major liquidation event (> $100M)
- ✅ ETF inflow/outflow > $500M
- ✅ On-chain anomalies (whale accumulation, exchange dumps)
- **Chart count:** 3-5 charts per issue

**File:** `variant-a-chart-heavy.md`

---

### **Variant B: News-Heavy**
**Use when:**
- ✅ BTC 24h move < 2% (quiet market)
- ✅ Regulatory news (legislation, court rulings)
- ✅ Partnership announcements (institutional, corporate)
- ✅ Adoption news (country-level, enterprise)
- ✅ Major policy shifts (Fed, SEC, CFTC)
- **Chart count:** 0-1 charts per issue

**File:** `variant-b-news-heavy.md`

---

### **Variant C: Hybrid/Balanced**
**Use when:**
- ✅ BTC 24h move 2-3% (moderate volatility)
- ✅ Mixed news (some data + some qualitative)
- ✅ General market updates
- ✅ No extreme movements, but enough to warrant charts
- **Chart count:** 1-2 charts per issue

**File:** `variant-hybrid-balanced.md`

---

## 📋 Selection Logic (For Rex/AI)

When processing a market report or creating a newsletter:

1. **Check BTC 24h change:**
   - > 3% → Use **Variant A**
   - < 2% → Use **Variant B**
   - 2-3% → Use **Variant C**

2. **Check F&G Index change:**
   - > 10 points → Use **Variant A**
   - < 5 points → Use **Variant B**
   - 5-10 points → Use **Variant C**

3. **Check major events:**
   - Liquidations > $100M → Use **Variant A**
   - ETF flows > $500M → Use **Variant A**
   - Regulatory breakthroughs → Use **Variant B**
   - Mixed events → Use **Variant C**

4. **Override if needed:**
   - If Kelly specifically requests "chart-heavy" or "news-heavy" → use that variant regardless
   - If market data is unreliable → default to **Variant C**

---

## 🧩 Data Requirements by Variant

### **Variant A (Chart-Heavy)**
**Must include:**
- BTC/ETH live prices + % change
- TradingView BTC/USD 24h chart link
- TradingView ETH/USD 24h chart link
- Fear & Greed Index chart link (30d)
- 1 on-chain metric chart (Glassnode or similar)
- Key support/resistance levels for BTC & ETH
- 3 news stories with "Why it matters"
- Watchlist with specific levels

**Optional:**
- Additional altcoin charts
- ETF flow charts
- Volume profile data

---

### **Variant B (News-Heavy)**
**Must include:**
- Basic price data (minimal)
- 1 major story with full context
- 1 key quote from source
- 3 data points for secondary story
- Link to source data
- 3 quick news items
- Watchlist with 3 specific things
- 2 content ideas

**Optional:**
- 1 small data viz (if available)
- Infographic links

---

### **Variant C (Hybrid)**
**Must include:**
- Basic price data
- 1 embedded chart for main story
- 1 metric box for secondary story
- 3 quick hits (no charts)
- Watchlist with 3 items
- 1 content idea

**Optional:**
- Additional chart (if relevant)
- Extra data metrics

---

## 🎨 Design Notes

### **Color Coding:**
- **Green (#22c55e):** Bullish, positive, up
- **Red (#ef4444):** Bearish, negative, down
- **Blue (#2563eb):** Neutral, informational
- **Yellow/Orange (#f59e0b):** Watchlist, attention needed

### **Chart Placement:**
- **Variant A:** Charts prominently displayed (top of issue)
- **Variant B:** Charts minimal or absent (focus on text)
- **Variant C:** 1-2 charts strategically placed

### **Readability:**
- All templates use clean, modern design
- Max 600px width for email compatibility
- Responsive for mobile
- Clear hierarchy (H1, H2, H3)
- Link text clearly labeled

---

## 🔄 Testing Plan

**Week 1:** Test each variant on different market conditions
- Variant A: Volatile market day
- Variant B: Quiet regulatory day
- Variant C: Balanced market day

**Feedback needed from Kelly:**
1. Which variant do you prefer on average?
2. Are charts too frequent, too rare, or just right?
3. Any specific chart sources you prefer (TradingView, Glassnode, etc.)?
4. Should we add more variants (e.g., "Crypto-Only", "Institutional Focus")?

---

## 🚀 Next Steps

1. **Review all 3 variants** (links below)
2. **Pick a favorite** (or say "use all based on market conditions")
3. **Start testing** on next 3 newsletter issues
4. **Iterate** based on your feedback

---

## 📁 File Structure

```
rocks/newsletter-templates/
├── MASTER_TEMPLATE_README.md (this file)
├── variant-a-chart-heavy.md
├── variant-b-news-heavy.md
└── variant-hybrid-balanced.md
```

---

**Created:** 2026-03-03  
**Last Updated:** 2026-03-03  
**Status:** ✅ Ready for testing
