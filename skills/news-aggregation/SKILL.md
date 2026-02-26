---
name: news-aggregation
description: Crypto and economic news aggregation for Rex. Monitors crypto, on-chain, economic, and social sources every 30 minutes. Delivers a daily 7:00 AM briefing to Kelly with market snapshot, top 5 stories, and trending content ideas. Issues immediate Telegram alerts for breaking news scoring 8+ on both virality and relevance. Trigger on any news request, market update, "what's happening in crypto", daily briefing, or breaking news alert.
---

# Crypto & Economic News Aggregation

**Check frequency:** Every 30 minutes

---

## Sources

| Category | Sources |
|----------|---------|
| Crypto | CoinDesk, The Block, Decrypt, CoinTelegraph, Messari, Delphi Digital |
| On-chain | Arkham Intelligence alerts, Whale Alert, DefiLlama |
| Economic | Federal Reserve calendar, BLS data releases |
| Social | Crypto Twitter top 200 accounts, Reddit r/cryptocurrency |

---

## Daily Briefing Format

Deliver by **7:00 AM PST** to Kelly. See [briefing-template.md](references/briefing-template.md) for the full format.

**Summary structure:**
1. Market Snapshot (BTC, ETH, total market cap, Fear & Greed Index)
2. Top 5 Stories — each with source and relevance score (1-10)
3. Trending Topics — content ideas for Discover Crypto / Blockchain Basement

All price data must include `[Source: ...]` tag. Never use cached or remembered prices.

---

## Breaking News Protocol

Score each story on two dimensions:
- **Virality** (1-10): How fast is this spreading? Engagement, retweets, cross-platform pickup.
- **Relevance** (1-10): How relevant to Hit Network's audience and content strategy?

**Score 8+ on BOTH virality AND relevance → immediate Telegram alert to Kelly**

Alert format:
```
[BREAKING] [Headline]
Source: [source name + URL]
Virality: [score]/10 | Relevance: [score]/10
Summary: [2-3 sentences]
```

Wait for human approval before any posting or distribution.

---

## Anti-Hallucination

All prices, market data, and news sourced live. Never fabricate or estimate figures. If a source is unavailable, flag it rather than substituting data from memory.
