// app/api/x-feed/route.ts
// Fetches RSS from Railway feed-adapter, parses tweets, and routes into:
//   headlines — BREAKING / alert posts (shown above columns, excluded from columns)
//   btc-eth   — Bitcoin, Ethereum, ETFs, institutional BTC/ETH
//   macro     — Economy, Fed, Gold, Oil, AI, Inflation, Geopolitical
//   altcoins  — Altcoins, DeFi, On-Chain, Liquidations, Regulation
// Filters out tweets that don't match any focus topic.
// 5-minute in-memory cache to avoid hammering Railway.

import { NextResponse } from "next/server";

export interface XTweet {
  id: string;
  text: string;
  author: string;
  url: string;
  pubDate: number;
  column: "headline" | "btc-eth" | "macro" | "altcoins";
}

export interface XFeedData {
  headlines: XTweet[];
  btcEth: XTweet[];
  macro: XTweet[];
  altcoins: XTweet[];
  fetchedAt: number;
  totalFetched: number;
  filtered: number;
}

// ── Headline detector ─────────────────────────────────────────────────────────
// Posts matching any rule go to X HEADLINES and are excluded from columns.
// Rules (from Kelly):
//   1. First word is BREAKING
//   2. First char is 🚨
//   3. First char is 🇺🇸
//   4. First char is ⚡
//   5. First word is NEW
//   6. Starts with RED ALERT
//   7. First word is CAUTION
//   8. CRASH in first line
//   9. BREAKING OUT in first line (case-insensitive)
//  10. CRASHING in first line (case-insensitive)

// ── Spam / promo filter ───────────────────────────────────────────────────────
// Posts matching any phrase here are dropped before headline or column routing.
const SPAM_PHRASES = [
  "new video is up",
];

function isSpam(text: string): boolean {
  const lower = text.toLowerCase();
  return SPAM_PHRASES.some((phrase) => lower.includes(phrase));
}

// ── Headline detector ─────────────────────────────────────────────────────────
function isHeadlinePost(text: string): boolean {
  const firstLine = text.split("\n")[0].trim();

  // Rules 2-4: leading emoji
  if (text.startsWith("🚨") || text.startsWith("🇺🇸") || text.startsWith("⚡")) return true;

  // Rules 1, 5, 6, 7: first word(s)
  if (/^BREAKING\b/i.test(firstLine)) return true;
  if (/^NEW\b/i.test(firstLine)) return true;
  if (/^RED ALERT\b/i.test(firstLine)) return true;
  if (/^CAUTION\b/i.test(firstLine)) return true;

  // Rules 8-10: anywhere in first line
  if (/\bCRASH\b/i.test(firstLine)) return true;
  if (/BREAKING OUT/i.test(firstLine)) return true;
  if (/\bCRASHING\b/i.test(firstLine)) return true;

  // Rule 11: anywhere in full text
  if (/going parabolic/i.test(text)) return true;

  return false;
}

// ── Keyword lists ─────────────────────────────────────────────────────────────
const BTC_ETH_TERMS = [
  "bitcoin", "btc", " eth ", "ethereum", "bitcoin dominance", "btc dominance",
  "bitcoin etf", "btc etf", "eth etf", "bitcoin etfs", "spot bitcoin",
  "spot btc", "bitcoin treasury", "btc treasury", "digital asset",
  "michael saylor", "mstr", "saylor", "bitcoin price", "btc price",
  "ethereum price", "eth price", "ibit", "blackrock bitcoin", "grayscale bitcoin",
  "fidelity bitcoin", "bitcoin halving", "halving", "lightning network",
  "taproot", "bitcoin miner", "hash rate", "bitcoin supply",
];

const ALTCOIN_TERMS = [
  "altcoin", " alts ", "alt season", "altseason",
  "defi", "on-chain", " onchain", "on chain",
  "liquidation", "liquidations", "charles hoskinson",
  "cardano", " ada ", "solana", " sol ", " xrp", "ripple", " bnb",
  "binance", "dogecoin", " doge", "shiba inu", "avalanche", " avax",
  "chainlink", " link ", "polygon", " matic", "polkadot", " dot ",
  "uniswap", " uni ", " aave ", "compound", "maker dao", "hyperliquid",
  " dex ", "nft", "memecoin", "meme coin", "stablecoin",
  " usdt", " usdc", "tether", "defi tvl", " tvl", "open interest",
  "perpetual", " perp", "tao ", "bittensor", "rlusd",
];

const MACRO_TERMS = [
  "economy", "federal reserve", "the fed", "fomc", " gold ", "gold price",
  "silver price", " silver ", "copper", " crude", " oil ", "oil price",
  "brent", "nasdaq", "s&p 500", " equities", "stock market", "dow jones",
  "inflation", "cpi ", "pce ", "recession", "gdp", "unemployment",
  "jobs report", "payroll", "interest rate", "rate cut", "rate hike",
  "yield curve", " treasury", "tariff", "stagflation", "powell",
  "janet yellen", "artificial intelligence", "nvidia", " nvda",
  "coinbase", "ray dalio", "tom lee", "peter thiel",
  "tokenization", "real world asset", " rwa", "private credit",
  "yen", "dollar", "dxy", "currency", "geopolit", "war ", " iran",
  "trump", "election", " sec ", " cftc", "crypto regulation",
  "crypto bill", "stablecoin regulation", "ath ", "all time high",
  "macro", "breaking",
];

const ALL_RELEVANT_TERMS = [
  ...BTC_ETH_TERMS, ...ALTCOIN_TERMS, ...MACRO_TERMS,
  "crypto", "market cap", "whale", "exchange", "mining", "options",
  "futures", " etf", "regulation", "bank", "institutional",
];

function categorize(text: string): "btc-eth" | "macro" | "altcoins" | null {
  const lower = " " + text.toLowerCase() + " ";
  const isRelevant = ALL_RELEVANT_TERMS.some((t) => lower.includes(t));
  if (!isRelevant) return null;
  if (BTC_ETH_TERMS.some((t) => lower.includes(t))) return "btc-eth";
  if (ALTCOIN_TERMS.some((t) => lower.includes(t))) return "altcoins";
  if (MACRO_TERMS.some((t) => lower.includes(t))) return "macro";
  return null;
}

// ── RSS parser ────────────────────────────────────────────────────────────────
function parseRssItems(xml: string): Array<{
  title: string; description: string; link: string;
  pubDate: string; author: string; guid: string;
}> {
  const items: ReturnType<typeof parseRssItems> = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`));
      return (m?.[1] ?? m?.[2] ?? "").trim();
    };
    items.push({
      title: get("title"), description: get("description"),
      link: get("link"), pubDate: get("pubDate"),
      author: get("author"), guid: get("guid"),
    });
  }
  return items;
}

// ── In-memory cache ───────────────────────────────────────────────────────────
let cache: XFeedData | null = null;
let cacheTime = 0;
const CACHE_MS = 5 * 60 * 1000;
const RAILWAY_RSS = "https://feed-adapter-production.up.railway.app/rss";

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  const now = Date.now();
  const { searchParams } = new URL(request.url);
  const forceBust = searchParams.get("bust") === "1";

  if (!forceBust && cache && now - cacheTime < CACHE_MS) return NextResponse.json(cache);

  try {
    const res = await fetch(RAILWAY_RSS, {
      headers: { "User-Agent": "MissionControl/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      if (cache) return NextResponse.json(cache);
      return NextResponse.json({ error: `RSS fetch failed: ${res.status}` }, { status: 502 });
    }

    const xml = await res.text();
    const rawItems = parseRssItems(xml);

    const headlines: XTweet[] = [];
    const btcEth:   XTweet[] = [];
    const macro:    XTweet[] = [];
    const altcoins: XTweet[] = [];
    let filtered = 0;

    for (const item of rawItems) {
      const fullText = `${item.title} ${item.description}`;
      const tweetText = item.description || item.title;
      const idMatch = item.guid.match(/status\/(\d+)/);
      const id = idMatch ? idMatch[1] : item.guid;
      const author = item.author.replace(/^@/, "");
      const pubDate = item.pubDate ? new Date(item.pubDate).getTime() : now;

      // Drop spam/promo posts before any routing
      if (isSpam(tweetText)) { filtered++; continue; }

      // Rule 1: headline posts go to X HEADLINES, excluded from columns
      if (isHeadlinePost(tweetText)) {
        headlines.push({ id, text: tweetText, author, url: item.link || item.guid, pubDate, column: "headline" });
        continue;
      }

      // Rule 2: categorize into columns; filter irrelevant
      const column = categorize(fullText);
      if (!column) { filtered++; continue; }

      const tweet: XTweet = { id, text: tweetText, author, url: item.link || item.guid, pubDate, column };
      if (column === "btc-eth")    btcEth.push(tweet);
      else if (column === "macro") macro.push(tweet);
      else                          altcoins.push(tweet);
    }

    const sort = (arr: XTweet[]) =>
      arr.sort((a, b) => b.pubDate - a.pubDate).slice(0, 50);

    cache = {
      headlines: sort(headlines),
      btcEth:    sort(btcEth),
      macro:     sort(macro),
      altcoins:  sort(altcoins),
      fetchedAt:    now,
      totalFetched: rawItems.length,
      filtered,
    };
    cacheTime = now;
    return NextResponse.json(cache);

  } catch (err: any) {
    if (cache) return NextResponse.json(cache);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
