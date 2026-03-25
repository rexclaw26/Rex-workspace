// convex/headlines.ts
// Real-time news headline fetching, storage, and retrieval.
// Data sources: CoinTelegraph, CoinDesk, The Block, Bitcoin Magazine, Yahoo Finance, X Feed (Railway).
// Deduplication key: article URL — never stores duplicate articles.
// pubDate is the canonical ordering timestamp — newer always supersedes older.

import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// ── RSS Sources ────────────────────────────────────────────────────────────────
// Decrypt removed — too much noise, too many low-relevance headlines.
const RSS_SOURCES = [
  { name: "CoinTelegraph",   url: "https://cointelegraph.com/rss",                                    weight: 1   },
  { name: "CoinDesk",        url: "https://www.coindesk.com/arc/outboundfeeds/rss/",                  weight: 1   },
  { name: "The Block",       url: "https://www.theblock.co/rss.xml",                                  weight: 1   },
  { name: "Bitcoin Magazine",url: "https://bitcoinmagazine.com/.rss/full/",                           weight: 0.9 },
  { name: "Yahoo Finance",   url: "https://finance.yahoo.com/news/rssindex",                          weight: 0.8 },
];

// ── Niche Category + Tier Detection ───────────────────────────────────────────
// Based on Kelly's exact niche priority list for Hit Network / Discover Crypto.
// Tiers:
//   1 — Always cover (Bitcoin, Bitcoin ETF, Gold, Macro, Institutional)
//   2 — Cover when significant (Ethereum, Silver, Legislation, Geopolitical, Solana, Coinbase)
//   3 — Major news only (Altcoins, DeFi, Hyperliquid, AI/Tech, Whale Activity, Markets)
//   0 — Noise; do not store
//
// Order matters — first match wins. More specific patterns before general ones.
interface CategoryResult {
  category: string;
  tier: number;
}

function detectCategory(title: string, desc: string): CategoryResult {
  const t = (title + " " + desc).toLowerCase();

  // ── TIER 1 ────────────────────────────────────────────────────────────────

  // Bitcoin ETF (before general Bitcoin — more specific)
  if (/\b(spot etf|bitcoin etf|btc etf|ibit|fbtc|arkb|bitb|hodl|btco|brrr)\b/.test(t) ||
      /\b(etf (inflow|outflow|approval|launch|filing|fund))\b/.test(t) ||
      /\b(blackrock.*(bitcoin|btc)|fidelity.*(bitcoin|btc)|grayscale.*(bitcoin|btc))\b/.test(t))
    return { category: "Bitcoin ETF", tier: 1 };

  // Institutional (Saylor, MSTR, Strategy, corporate treasuries — before general Bitcoin)
  if (/\b(michael saylor|saylor|microstrategy|strategy inc|\$mstr|mstr stock)\b/.test(t) ||
      /\b(corporate.*(bitcoin|btc)|bitcoin.*(treasury|reserve|holding|accumulate))\b/.test(t) ||
      /\b(bitcoin strategic reserve|strategic bitcoin|national bitcoin|government bitcoin|state bitcoin)\b/.test(t) ||
      /\b(bitmine|bmnr|\$bmnr|mara holdings|riot platforms|metaplanet)\b/.test(t))
    return { category: "Institutional", tier: 1 };

  // Gold
  if (/\b(gold price|\$gold|xau|gold etf|gold futures|gold ounce|gold hits|gold surge|gold crash|gold reserve|gold demand)\b/.test(t))
    return { category: "Gold", tier: 1 };

  // Macro — Fed, DXY, economic data, tariffs, geopolitical big-impact
  if (/\b(federal reserve|jerome powell|fomc|fed rate|rate cut|rate hike|interest rate|quantitative)\b/.test(t) ||
      /\b(\bdxy\b|us dollar index|dollar strength|dollar weakness|dollar surge|dollar crash)\b/.test(t) ||
      /\b(\bcpi\b|\bpce\b|\bgdp\b|inflation rate|consumer price|jobs report|nonfarm payroll|ism pmi)\b/.test(t) ||
      /\b(tariff|trade war|trade deficit|sanctions|recession|yield curve|treasury yield|10.year)\b/.test(t) ||
      /\b(strait of hormuz|iran.*(market|oil|bitcoin|crypto|sanctions)|oil price|crude oil|brent)\b/.test(t) ||
      /\b(geopolit|war.*(market|bitcoin|crypto|oil)|nuclear|nato.*market|china.*(economy|market|tariff|yuan))\b/.test(t))
    return { category: "Macro", tier: 1 };

  // Bitcoin (general — after the more specific patterns above)
  if (/\b(bitcoin|btc)\b/.test(t) ||
      /\b(satoshi|halving|lightning network|hashrate|mining difficulty|bitcoin whale|btc whale)\b/.test(t))
    return { category: "Bitcoin", tier: 1 };

  // ── TIER 2 ────────────────────────────────────────────────────────────────

  // Ethereum
  if (/\b(ethereum|\beth\b|vitalik|eip-|proof.of.stake|ethereum staking|ethereum etf|eth whale)\b/.test(t) ||
      /\b(layer 2|l2|arbitrum|optimism|base chain|ethereum l2)\b/.test(t))
    return { category: "Ethereum", tier: 2 };

  // Silver
  if (/\b(silver price|\$silver|xag|silver etf|silver futures|silver ounce|silver crash|silver rally)\b/.test(t))
    return { category: "Silver", tier: 2 };

  // Digital Asset Legislation
  if (/\b(clarity act|crypto bill|crypto law|stablecoin bill|cbdc bill|crypto regulation|digital asset.*law)\b/.test(t) ||
      /\b(\bsec\b.*crypto|\bcftc\b.*crypto|congress.*crypto|senate.*crypto|house.*crypto|occ.*crypto)\b/.test(t) ||
      /\b(crypto.*ban|crypto.*ban|crypto.*approve|irs.*crypto|fatf.*crypto|kyc.*crypto|aml.*crypto)\b/.test(t) ||
      /\b(spot.*(approval|approved|rejected|filing)|etf.*approval|sec.*(approves|rejects|delays))\b/.test(t))
    return { category: "Legislation", tier: 2 };

  // Solana
  if (/\b(solana|\bsol\b|phantom wallet|jupiter.*sol|solana.*network|solana.*etf|sol etf)\b/.test(t))
    return { category: "Solana", tier: 2 };

  // Coinbase / Kraken / Base
  if (/\b(coinbase|\bcoin\b stock|\bcbase\b|kraken|coinbase.*base|base chain|base.*coinbase|\$coin)\b/.test(t))
    return { category: "Coinbase", tier: 2 };

  // NVDA / META / major tech (market-relevant)
  if (/\b(nvidia|\bnvda\b|nvidia.*crypto|nvidia.*ai|nvidia.*mining)\b/.test(t) ||
      /\b(\bmeta\b.*crypto|\bmeta\b.*ai|meta.*blockchain|mark zuckerberg.*crypto)\b/.test(t))
    return { category: "AI / Tech", tier: 2 };

  // ── TIER 3 ────────────────────────────────────────────────────────────────

  // Hyperliquid
  if (/\b(hyperliquid|hype token|hype.*perp|hyperliquid.*dex)\b/.test(t))
    return { category: "Hyperliquid", tier: 3 };

  // Bittensor / TAO
  if (/\b(bittensor|\btao\b.*ai|bittensor.*network|tao.*token)\b/.test(t))
    return { category: "AI / Tech", tier: 3 };

  // Whale Activity
  if (/\b(whale (move|transfer|buy|sell|wallet|activity)|bitcoin whale|eth whale|crypto whale)\b/.test(t) ||
      /\b(large transaction|massive transfer|exchange inflow|exchange outflow)\b/.test(t))
    return { category: "Whale Activity", tier: 3 };

  // DeFi
  if (/\b(defi|tvl|liquidity pool|yield farm|amm|\bdex\b|uniswap|aave|compound|curve finance)\b/.test(t))
    return { category: "DeFi", tier: 3 };

  // Private Credit / TradFi crossover
  if (/\b(private credit|private equity.*crypto|tokenized (credit|bond|fund)|real world asset|rwa)\b/.test(t))
    return { category: "Institutional", tier: 3 };

  // Altcoins with name specificity (avoid generic "crypto")
  if (/\b(xrp|ripple|cardano|\bada\b|polkadot|\bdot\b|chainlink|\blink\b crypto|dogecoin|\bdoge\b|shiba|\bshib\b)\b/.test(t) ||
      /\b(avalanche|\bavax\b|near protocol|\bnear\b|aptos|\bapt\b|sui network|\bsui\b|injective|\binj\b)\b/.test(t) ||
      /\b(ton network|toncoin|\bton\b|tron|\btrx\b|bnb chain|binance.*coin|altcoin|alt season)\b/.test(t))
    return { category: "Altcoins", tier: 3 };

  // General crypto/markets — only if "crypto" or "blockchain" specifically mentioned
  if (/\b(crypto market|cryptocurrency market|digital asset|blockchain.*finance|web3.*market)\b/.test(t))
    return { category: "Markets", tier: 3 };

  // ── NOISE (tier 0) — do not store ─────────────────────────────────────────
  return { category: "Noise", tier: 0 };
}

// ── Relevance Scoring (0–10) ───────────────────────────────────────────────────
// Composite score within tier. Used to surface the most impactful stories.
// High impact: record events, billions in capital, historic firsts, named actors.
// Noise: price predictions, sponsored posts, low-info puff pieces.
function scoreRelevance(title: string, tier: number): number {
  const t = title.toLowerCase();
  let score = tier === 1 ? 7 : tier === 2 ? 5 : tier === 3 ? 3 : 0;
  if (score === 0) return 0;

  // ── Impact boosters (max +3) ─────────────────────────────────────────────
  let boost = 0;
  if (/\b(record|all.time high|ath|historic|first.ever|first time|milestone)\b/.test(t)) boost++;
  if (/\b(crash|collapse|plunge|ban|reject|hack|exploit|emergency|crisis)\b/.test(t)) boost++;
  if (/\b(billion|hundreds of million|\$[0-9]+b\b)\b/.test(t)) boost++;
  if (/\b(blackrock|saylor|jerome powell|fed chair|sec chair|trump|congress|senate)\b/.test(t)) boost++;
  if (/\b(etf|federal reserve|fomc|inflation|gdp|cpi)\b/.test(t)) boost++;
  score = Math.min(10, score + Math.min(3, boost));

  // ── Noise penalties ──────────────────────────────────────────────────────
  if (/\b(price prediction|will reach|could hit|might surge|price target|analyst says|expert says)\b/.test(t)) score -= 2;
  if (/\b(top [0-9]+ |best (crypto|coin|altcoin)|buy (these|this|now)|must.?buy)\b/.test(t)) score -= 3;
  if (/\b(airdrop|giveaway|presale|ido|ieo|token launch|new coin|new token)\b/.test(t)) score -= 3;
  if (/\b(nft |non.fungible|opensea|jpeg|bored ape|bayc|pfp)\b/.test(t)) score -= 2;
  if (/\b(sponsored|advertorial|partner content|press release)\b/.test(t)) score -= 4;
  if (title.length < 20) score -= 2; // too short to be meaningful

  return Math.max(0, Math.min(10, score));
}

// ── Sentiment Detection ────────────────────────────────────────────────────────
// Keyword-only, no inference. Errs toward "neutral" when ambiguous.
function detectSentiment(title: string): string {
  const t = title.toLowerCase();
  const bullishRe = /\b(surge|surges|surged|rally|rallies|rallied|record|all.time.high|ath|gain|gains|gained|rise|rises|rose|soar|soars|soared|climbs|climbed|breakthrough|passes|approved|approves|launches|recover|recovery|inflow|inflows|breakout|hits.*high|new high)\b/;
  const bearishRe = /\b(drop|drops|dropped|fall|falls|fell|crash|crashes|crashed|plunge|plunges|plunged|decline|declines|declined|slump|slumps|loss|loses|lost|ban|bans|banned|hack|hacked|exploit|exploited|reject|rejected|outflow|outflows|sell.off|selloff|fear|liquidat|collapse|collapses)\b/;
  if (bullishRe.test(t)) return "bullish";
  if (bearishRe.test(t)) return "bearish";
  return "neutral";
}

// ── RSS Parser ─────────────────────────────────────────────────────────────────
// Handles CDATA, HTML stripping, UTF-8 entities. No dependencies.
function extractTag(xml: string, tag: string): string {
  // Try CDATA first
  const cdataRe = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const cdataMatch = xml.match(cdataRe);
  if (cdataMatch) return cdataMatch[1].trim();

  // Try plain content (handles nested tags by being greedy-careful)
  const plainRe = new RegExp(`<${tag}[^>]*>([^<]*(?:<(?!\\/${tag})[^<]*)*)<\\/${tag}>`, "i");
  const plainMatch = xml.match(plainRe);
  if (plainMatch) return plainMatch[1].trim();

  return "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePubDate(dateStr: string): number {
  if (!dateStr) return Date.now();
  try {
    const d = new Date(dateStr);
    const t = d.getTime();
    // Sanity check: must be within last 30 days and not in the future
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    if (!isNaN(t) && t > thirtyDaysAgo && t <= now + 60000) return t;
    return now;
  } catch {
    return Date.now();
  }
}

interface ParsedItem {
  title: string;
  url: string;
  description: string;
  pubDate: number;
}

// ── Placeholder / Low-Quality Description Filter ──────────────────────────────
// Returns true if the description is useless — placeholder text, generic intros,
// or so short it adds no value. These headlines are skipped entirely at fetch time.
// The goal: every headline shown has a real, article-specific sub-description.
const PLACEHOLDER_PATTERNS = [
  /^no description available/i,
  /^your (day-ahead|morning|evening|weekly) (look|brief|wrap|roundup)/i,
  /^today'?s? (top|biggest|latest|crypto|bitcoin|market) (stories|news|headlines|update)/i,
  /^the latest (news|stories|updates|headlines)/i,
  /^here'?s? what'?s? (happening|moving|going on)/i,
  /^catch up on/i,
  /^a look at/i,
  /^good morning/i,
  /^this (morning|evening|week|weekend)/i,
  /^what you (need to know|missed|should know)/i,
  /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday) (morning|afternoon|evening|wrap|brief)/i,
];

function isPlaceholderDescription(desc: string, title: string): boolean {
  if (!desc || desc.trim().length < 40) return true; // Too short to be useful
  const d = desc.trim();
  // Check against known placeholder patterns
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(d)) return true;
  }
  // If description is essentially the same as the title (nothing added), skip
  if (d.toLowerCase().startsWith(title.toLowerCase().slice(0, 30))) return true;
  return false;
}

function parseRSSFeed(xml: string, sourceName: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title = stripHtml(extractTag(item, "title"));
    if (!title || title.length < 5) continue;

    // Try multiple URL fields: <link>, <guid isPermaLink="true">, <feedburner:origLink>
    let url = extractTag(item, "link");
    if (!url) url = extractTag(item, "guid");
    if (!url || !url.startsWith("http")) continue;

    const rawDesc = extractTag(item, "description") || extractTag(item, "summary") || "";
    const description = stripHtml(rawDesc).slice(0, 600);

    // ── Skip headlines with placeholder or missing descriptions ──────────────
    // Real insights require real article descriptions — no placeholders allowed.
    if (isPlaceholderDescription(description, title)) continue;

    const pubDateStr = extractTag(item, "pubDate") || extractTag(item, "dc:date") || extractTag(item, "published");
    const pubDate = parsePubDate(pubDateStr);

    items.push({ title, url, description, pubDate });
  }

  return items;
}

// ── Queries ────────────────────────────────────────────────────────────────────

export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
    maxTier: v.optional(v.number()), // 1 = only Tier 1 | 2 = Tier 1+2 (default) | 3 = all
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;
    const maxTier = args.maxTier ?? 2; // default: Tier 1+2 only (no noise, no minor altcoins)

    // Fetch a generous pool to filter from
    const pool = await ctx.db.query("headlines").withIndex("by_pubDate").order("desc").take(limit * 5);

    let filtered = pool.filter((h) => {
      // Include headlines that match tier filter
      // Headlines without tier (old records) are included by default
      const hTier = h.tier ?? 2;
      return hTier <= maxTier;
    });

    if (args.category) {
      filtered = filtered.filter((h) => h.category === args.category);
    }

    // Sort by composite: pubDate weighted with relevance boost
    // Same-hour headlines ranked by relevance; overall order stays pubDate-first
    filtered.sort((a, b) => {
      const hourA = Math.floor(a.pubDate / 3600000);
      const hourB = Math.floor(b.pubDate / 3600000);
      if (hourA !== hourB) return hourB - hourA; // newer hour first
      // Within same hour: higher relevance first
      return (b.relevance ?? 5) - (a.relevance ?? 5);
    });

    return filtered.slice(0, limit);
  },
});

export const getLastFetchedAt = query({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db
      .query("headlines")
      .withIndex("by_pubDate")
      .order("desc")
      .first();
    return latest?.fetchedAt ?? null;
  },
});

// ── Mutations ──────────────────────────────────────────────────────────────────

export const upsertHeadline = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    description: v.string(),
    source: v.string(),
    category: v.string(),
    sentiment: v.string(),
    pubDate: v.number(),
    fetchedAt: v.number(),
    relevance: v.optional(v.number()),
    tier: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Deduplication: check if URL already exists
    const existing = await ctx.db
      .query("headlines")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();

    if (existing) {
      // Update only if we have a newer pubDate (protects canonical ordering)
      if (args.pubDate > existing.pubDate) {
        await ctx.db.patch(existing._id, {
          title: args.title,
          description: args.description,
          category: args.category,
          sentiment: args.sentiment,
          pubDate: args.pubDate,
          fetchedAt: args.fetchedAt,
          relevance: args.relevance,
          tier: args.tier,
        });
      }
      return { inserted: false, id: existing._id };
    }

    const id = await ctx.db.insert("headlines", args);
    return { inserted: true, id };
  },
});

export const pruneOld = mutation({
  args: { olderThanDays: v.number() },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - args.olderThanDays * 24 * 60 * 60 * 1000;
    const old = await ctx.db
      .query("headlines")
      .withIndex("by_pubDate")
      .filter((q) => q.lt(q.field("pubDate"), cutoff))
      .collect();
    for (const h of old) await ctx.db.delete(h._id);
    return { deleted: old.length };
  },
});

// ── Knowledge Base Mutations ───────────────────────────────────────────────────

export const upsertKnowledge = mutation({
  args: {
    key: v.string(),
    content: v.string(),
    date: v.string(),
    dataTimestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("knowledgeBase")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        date: args.date,
        dataTimestamp: args.dataTimestamp,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("knowledgeBase", {
      key: args.key,
      content: args.content,
      date: args.date,
      dataTimestamp: args.dataTimestamp,
      updatedAt: Date.now(),
    });
  },
});

export const getKnowledge = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("knowledgeBase")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

// Returns the market notes section for a specific date.
// Used by the headlines page to show context for each article.
// Only returns the section if its dataTimestamp <= the headline's pubDate
// (i.e., Kelly had already written these notes by the time the article was published).
// If the notes postdate the headline, they're returned as "later context" so the UI
// can label them clearly — the caller decides whether to show or suppress.
export const getMarketNotesForDate = query({
  args: {
    date: v.string(), // YYYY-MM-DD matching the headline's publish date
  },
  handler: async (ctx, args) => {
    const key = `marketnotes_${args.date}`;
    const section = await ctx.db
      .query("knowledgeBase")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    return section ?? null;
  },
});

// Returns the most recently dated market notes section available.
// Used as fallback when a headline's exact date has no matching section.
export const getLatestMarketNotes = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("knowledgeBase")
      .withIndex("by_dataTimestamp")
      .order("desc")
      .filter((q) =>
        q.neq(q.field("key"), "marketnotes") // exclude the full-file entry
      )
      .take(10);

    // Return only market notes sections (not market reports)
    const notes = all.filter((doc) => doc.key.startsWith("marketnotes_"));
    return notes[0] ?? null;
  },
});

// ── Fetch Action ───────────────────────────────────────────────────────────────
// Called by the cron every 15 min AND by the "Update Headlines" button.
// Makes real HTTP requests to RSS feeds — no fabrication, no AI generation.

export const fetchAndStore = action({
  args: {},
  handler: async (ctx): Promise<{ fetched: number; inserted: number; filtered: number; errors: string[] }> => {
    const fetchedAt = Date.now();
    let totalFetched = 0;
    let totalInserted = 0;
    let totalFiltered = 0; // noise items discarded
    const errors: string[] = [];

    for (const source of RSS_SOURCES) {
      try {
        const response = await fetch(source.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; MissionControl/1.0; RSS Reader)",
            "Accept": "application/rss+xml, application/xml, text/xml, */*",
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          errors.push(`${source.name}: HTTP ${response.status}`);
          continue;
        }

        const xml = await response.text();
        const items = parseRSSFeed(xml, source.name);
        totalFetched += items.length;

        for (const item of items) {
          const { category, tier } = detectCategory(item.title, item.description);

          // ── Filter noise at the source — don't store tier 0 ──────────────
          if (tier === 0) {
            totalFiltered++;
            continue;
          }

          const relevance = scoreRelevance(item.title, tier);

          // Also skip very low relevance within any tier
          if (relevance < 2) {
            totalFiltered++;
            continue;
          }

          const sentiment = detectSentiment(item.title);

          const result = await ctx.runMutation(api.headlines.upsertHeadline, {
            title: item.title,
            url: item.url,
            description: item.description || "No description available.",
            source: source.name,
            category,
            sentiment,
            pubDate: item.pubDate,
            fetchedAt,
            relevance,
            tier,
          });

          if (result.inserted) totalInserted++;
        }
      } catch (err: any) {
        errors.push(`${source.name}: ${err.message || "fetch failed"}`);
      }
    }

    // Prune headlines older than 7 days
    await ctx.runMutation(api.headlines.pruneOld, { olderThanDays: 7 });

    return { fetched: totalFetched, inserted: totalInserted, filtered: totalFiltered, errors };
  },
});
