# Daily Briefing Template

Deliver by 7:00 AM PST. Apply REPORT mode humanization (LAW 1 in AGENTS.md).

---

## Header
```
🌅 GOOD MORNING KELLY — Daily Market Briefing
[Day], [Month Date, Year] | 7:00 AM PST
```

---

## 📊 Market Snapshot
[Source: CoinGecko + Alternative.me — live as of 7:00 AM PST]

- **BTC:** $[price] | 24h: [%] | Market Cap: $[amount]
- **ETH:** $[price] | 24h: [%]
- **Total Crypto Market Cap:** $[amount] | 24h: [%]
- **BTC Dominance:** [%]
- **24h Volume:** $[amount]
- **Fear & Greed:** [score] — [label]

**Macro context:** [Gold spot, Silver, Nvidia, any Tier 2 items with notable moves]

---

## ₿ BITCOIN
[Status label: ⚡ BREAKING | 🟢 BULLISH | 🔴 BEARISH | ⚖️ NEUTRAL]

**[Headline]**

[3-5 sentence narrative covering: price context, key event, on-chain signals, analyst reads]

*[Source: name — URL]*

---

## Ξ ETHEREUM
[Status label]

**[Headline]**

[3-5 sentence narrative]

*[Source: name — URL]*

---

## 🌐 CRYPTO MARKET
[Status label]

**[Headline]**

[3-5 sentence narrative covering: altcoins, institutional moves, regulatory, broader market cap]

*[Source: name — URL]*

---

## 📰 BIG STORIES (Tier 2)
*Include only when there is significant news. Each story:*

**[CATEGORY]: [Headline]**
Why it matters: [1 sentence]
[2-3 sentence summary]
[Sentiment label: 🟢 / 🔴 / ⚖️]
*[Source: name — URL]*

---

## 💡 CONTENT ANGLES FOR TODAY

1. **"[Title]"** — [Platform suggestion]. [1-2 sentence pitch: why this angle, why today]
2. **"[Title]"** — [Platform suggestion]. [1-2 sentence pitch]
3. **"[Title]"** — [Platform suggestion]. [1-2 sentence pitch]

---

## ⚠️ WATCH LIST

1. **[Item]** — [What to watch for, what triggers next action]
2. **[Item]** — [What to watch for]
3. **[Item]** — [What to watch for]
4. **[Item]** (if applicable)

---

## Footer
```
Briefing delivered 7:00 AM PST | Data: CoinGecko + Alternative.me (live) | News: Brave Search (live)
```

---

## Notes for Cron Job Execution
- Pull ALL market data live at time of send — never use cached prices
- Tier 1 (always cover): BTC, ETH, Total Market Cap, Fear & Greed
- Tier 2 (cover when significant): Gold/Silver, Nvidia, MSTR, Metaplanet ($MTPLF), Binance, geopolitics, Clarity Act, FATF
- Every price and data point needs [Source: ...] tag
- Content Angles should be actionable today — tied to breaking news where possible
- Watch List should have 3-4 items that are actively developing stories
