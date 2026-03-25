// app/api/prices/route.ts
// Aggregates live asset prices for the Mission Control price ticker.
//
// Crypto (8 assets): CoinGecko free API — no auth, updates ~60s, very reliable
// Stocks/Commodities (4 assets): Yahoo Finance v8 chart API — unofficial but stable
//
// In-memory cache: 60 seconds — shared across all clients hitting this endpoint.
// Prevents rate limiting; all browser tabs share one upstream fetch per minute.

import { NextResponse } from "next/server";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AssetPrice {
  symbol: string;   // BTC, ETH, GOLD, NVDA, etc.
  name: string;     // Bitcoin, Ethereum, Gold, etc.
  price: number;    // current USD price
  change24h: number; // 24h % change — positive = green, negative = red
  type: "crypto" | "stock" | "commodity";
}

// ── Cache ──────────────────────────────────────────────────────────────────────
let cache: { data: AssetPrice[]; ts: number } | null = null;
const CACHE_TTL_MS = 60_000; // 60 seconds

// ── CoinGecko IDs → display info ───────────────────────────────────────────────
const CRYPTO_ASSETS: Array<{ id: string; symbol: string; name: string }> = [
  { id: "bitcoin",       symbol: "BTC",  name: "Bitcoin"   },
  { id: "ethereum",      symbol: "ETH",  name: "Ethereum"  },
  { id: "binancecoin",   symbol: "BNB",  name: "BNB"       },
  { id: "ripple",        symbol: "XRP",  name: "XRP"       },
  { id: "solana",        symbol: "SOL",  name: "Solana"    },
  { id: "chainlink",     symbol: "LINK", name: "Chainlink" },
  { id: "cardano",       symbol: "ADA",  name: "Cardano"   },
  { id: "bittensor",     symbol: "TAO",  name: "Bittensor" },
];

// ── Yahoo Finance symbols → display info ───────────────────────────────────────
const TRAD_ASSETS: Array<{ ticker: string; symbol: string; name: string; type: "stock" | "commodity" }> = [
  { ticker: "GC=F",  symbol: "GOLD", name: "Gold",         type: "commodity" },
  { ticker: "SI=F",  symbol: "SILV", name: "Silver",       type: "commodity" },
  { ticker: "DX=F",  symbol: "DXY",  name: "USD Index",    type: "commodity" },
  { ticker: "NVDA",  symbol: "NVDA", name: "Nvidia",       type: "stock"     },
  { ticker: "COIN",  symbol: "COIN", name: "Coinbase",     type: "stock"     },
  { ticker: "MSTR",  symbol: "MSTR", name: "MicroStrategy",type: "stock"     },
];

// ── Fetch crypto via CoinGecko ─────────────────────────────────────────────────
async function fetchCrypto(): Promise<AssetPrice[]> {
  const ids = CRYPTO_ASSETS.map((a) => a.id).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "MissionControl/1.0" },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const data: Record<string, { usd: number; usd_24h_change: number }> = await res.json();

  return CRYPTO_ASSETS.map((asset) => {
    const d = data[asset.id];
    return {
      symbol:    asset.symbol,
      name:      asset.name,
      price:     d?.usd ?? 0,
      change24h: d?.usd_24h_change ?? 0,
      type:      "crypto" as const,
    };
  }).filter((a) => a.price > 0);
}

// ── Fetch individual Yahoo Finance asset ───────────────────────────────────────
async function fetchYahooAsset(
  ticker: string,
  symbol: string,
  name: string,
  type: "stock" | "commodity"
): Promise<AssetPrice | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=2d`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? meta.regularMarketPreviousClose ?? 0;
    const change24h = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;

    if (price <= 0) return null;

    return { symbol, name, price, change24h, type };
  } catch {
    return null;
  }
}

// ── GET handler ────────────────────────────────────────────────────────────────
export async function GET() {
  // Return cached data if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    return NextResponse.json({ ok: true, prices: cache.data, cached: true, ts: cache.ts });
  }

  try {
    // Fetch crypto + traditional assets in parallel
    const [cryptoResults, ...tradResults] = await Promise.allSettled([
      fetchCrypto(),
      ...TRAD_ASSETS.map((a) => fetchYahooAsset(a.ticker, a.symbol, a.name, a.type)),
    ]);

    const prices: AssetPrice[] = [];

    // Crypto
    if (cryptoResults.status === "fulfilled") {
      prices.push(...cryptoResults.value);
    }

    // Traditional assets
    for (const result of tradResults) {
      if (result.status === "fulfilled" && result.value) {
        prices.push(result.value);
      }
    }

    // Maintain display order: crypto first (as listed), then trad assets
    const orderedSymbols = [
      ...CRYPTO_ASSETS.map((a) => a.symbol),
      ...TRAD_ASSETS.map((a) => a.symbol),
    ];
    prices.sort((a, b) => orderedSymbols.indexOf(a.symbol) - orderedSymbols.indexOf(b.symbol));

    cache = { data: prices, ts: Date.now() };

    return NextResponse.json({ ok: true, prices, cached: false, ts: cache.ts });
  } catch (err: any) {
    // Return stale cache on error rather than failing the UI
    if (cache) {
      return NextResponse.json({ ok: true, prices: cache.data, cached: true, stale: true, ts: cache.ts });
    }
    return NextResponse.json({ ok: false, error: err.message, prices: [] }, { status: 500 });
  }
}
