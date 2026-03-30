// app/api/generate-market-posts/route.ts
// Generates X posts from DC Hub headlines + Fear & Greed + BTC price.
// Primary source: DC Hub /api/headlines (10 curated stories).
// Secondary: alternative.me Fear & Greed, CoinGecko BTC price.
//
// Flow:
//   1. Fetch headlines from DC Hub (primary)
//   2. Fetch Fear & Greed + BTC price (supplemental context)
//   3. Generate one post per headline via LLM
//   4. Save to xPostQueue with 24h expiry

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud"
);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const MODEL = "anthropic/claude-sonnet-4-6";
const DC_HUB_URL = "https://dc-data-hub-production-cff0.up.railway.app";

type PostFormat = "BREAKING" | "JUST IN" | "DATA" | "WATCHING" | "SIGNAL" | "THREAD";
type PostCategory = "btcEth" | "macro" | "altcoins" | "legislation" | "onchain";

type Headline = {
  title: string;
  url?: string;
  source?: string;
  pubDate?: number;
};

// ── OpenRouter LLM ─────────────────────────────────────────────────────────────
async function callLLM(prompt: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://mission-control.hitnetwork.io",
      "X-Title": "Mission Control - Market Post Generator",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

// ── Pick format ────────────────────────────────────────────────────────────────
function pickFormat(title: string): PostFormat {
  const t = title.toLowerCase();
  if (/breaking|🚨|urgent|alert/.test(t)) return "BREAKING";
  if (/just in|announce|confirm|launch/.test(t)) return "JUST IN";
  if (/data|report|numbers|cpi|gdp|jobs|payroll|fee|%/.test(t)) return "DATA";
  if (/signal|indicator|pattern|odds|predict/.test(t)) return "SIGNAL";
  if (/watch|eye|develop|explor/.test(t)) return "WATCHING";
  return "WATCHING";
}

// ── Pick category ─────────────────────────────────────────────────────────────
function pickCategory(title: string): PostCategory {
  const t = title.toLowerCase();
  if (/bitcoin|btc|ethereum|eth|solana|sol|bnb|xrp|miner/.test(t)) return "btcEth";
  if (/sec|cftc|law|regulat|congress|legis|ban|california|govern/.test(t)) return "legislation";
  if (/defi|altcoin|token|nft|web3|stablecoin|usdc|usdt/.test(t)) return "altcoins";
  if (/chain|on-chain|whale|wallet|transaction/.test(t)) return "onchain";
  if (/macro|fed|inflation|jobs|gdp|rate|nasdaq|stock|market|economy/.test(t)) return "macro";
  return "macro";
}

// ── Build post prompt ─────────────────────────────────────────────────────────
function buildPrompt(headline: Headline, format: PostFormat, context: string, isRetry: boolean): string {
  const strict = isRetry
    ? "\nSTRICT: Your last output exceeded 280 characters. This time output UNDER 280 chars. Count every character."
    : "";

  return `You are writing a single X post as @DiscoverCrypto (1M+ followers). Crypto/macro audience.

Voice: Sharp, conspiratorial, bullish on crypto infrastructure, skeptical of institutions. Direct. No hedge words. No em dashes. Use contractions. Numbers specific.

NEWS HEADLINE: "${headline.title}"
${headline.source ? `Source: ${headline.source}` : ""}
${context ? `\nMARKET CONTEXT: ${context}` : ""}

Write ONE punchy X post that:
- Hooks with the most surprising or controversial angle of this story
- Adds your own take or connects it to the bigger crypto narrative
- Ends with a question or bold prediction that drives engagement
- Uses NO em dashes, NO "I'm", NO "Let's", NO "This is huge"
- Sounds like a sharp crypto analyst, not a news bot

FORMAT: ${format}
${format === "BREAKING" || format === "JUST IN"
    ? `[${format}:] [PUNCHY ALL-CAPS HEADLINE]\n-> [key data or consequence]\n-> [your take]`
    : `[Hook — most surprising angle]\n[Specific data or implication]\n[Closing question or bold take]`}

280 characters MAX. Output only the post, no explanations.${strict}`;
}

// ── Main handler ────────────────────────────────────────────────────────────────
export async function POST() {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });
  }

  const errors: string[] = [];
  let generated = 0;
  let skipped = 0;

  // ── 1. Fetch headlines from DC Hub (primary source) ───────────────────────
  let headlines: Headline[] = [];
  try {
    const r = await fetch(`${DC_HUB_URL}/api/headlines`, {
      signal: AbortSignal.timeout(10000),
    });
    if (r.ok) {
      const raw = await r.text();
      try {
        const parsed = JSON.parse(raw);
        // DC Hub returns an array directly
        headlines = Array.isArray(parsed) ? parsed : (parsed.headlines ?? []);
      } catch {
        errors.push("Headlines: JSON parse failed");
      }
    } else {
      errors.push(`Headlines: DC Hub returned ${r.status}`);
    }
  } catch (e: any) {
    errors.push(`Headlines: ${e.message}`);
  }

  if (headlines.length === 0) {
    return NextResponse.json({
      generated: 0,
      skipped: 0,
      errors: errors.length > 0 ? errors : ["No headlines available from DC Hub"],
    });
  }

  // ── 2. Fetch supplemental context (Fear & Greed + BTC price) ──────────────
  let marketContext = "";
  try {
    const [fgRes, btcRes] = await Promise.allSettled([
      fetch("https://api.alternative.me/fng/", { signal: AbortSignal.timeout(5000) }),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true", {
        signal: AbortSignal.timeout(5000),
      }),
    ]);

    const parts: string[] = [];
    if (fgRes.status === "fulfilled" && fgRes.value.ok) {
      const d = await fgRes.value.json();
      const item = d.data?.[0];
      if (item) parts.push(`Fear & Greed: ${item.value}/100 (${item.value_classification})`);
    }
    if (btcRes.status === "fulfilled" && btcRes.value.ok) {
      const d = await btcRes.value.json();
      const price = d.bitcoin?.usd;
      const change = d.bitcoin?.usd_24h_change;
      if (price) parts.push(`BTC: $${price.toLocaleString()}${change ? ` (${change > 0 ? "+" : ""}${change.toFixed(1)}% 24h)` : ""}`);
    }
    marketContext = parts.join(" | ");
  } catch {
    // Context is supplemental — silent fail
  }

  // ── 3. Dedup + generate per headline ──────────────────────────────────────
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const dayStart = todayStart.getTime();

  for (const headline of headlines) {
    if (!headline.title) { skipped++; continue; }

    // Dedup key per headline (by title prefix)
    const dedupKey = `headline:${headline.title.slice(0, 60)}`;

    try {
      const dup = await convex.query(api.xPostQueue.checkDuplicate, {
        sourceAuthor: dedupKey,
        dayStart,
      });
      if (dup) { skipped++; continue; }
    } catch { /* convex unavailable — skip dedup */ }

    const format = pickFormat(headline.title);
    const category = pickCategory(headline.title);

    // Generate with up to 2 attempts
    let content = "";
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const raw = await callLLM(buildPrompt(headline, format, marketContext, attempt > 1));
        // Strip em-dashes and remove any leading format label the LLM included
        const stripped = raw
          .replace(/—/g, "-").replace(/‒/g, "-")
          .replace(/^(BREAKING:|JUST IN:|DATA:|WATCHING:|SIGNAL:|THREAD:)\s*/i, "")
          .replace(/^\[?(BREAKING|JUST IN|DATA|WATCHING|SIGNAL|THREAD)\]?[:\s\n]+/i, "")
          .trim();
        // Filter meta-responses
        if (
          stripped.includes("I can't") ||
          stripped.includes("I cannot") ||
          stripped.includes("As an AI") ||
          stripped.toLowerCase().includes("i don't have")
        ) {
          errors.push(`LLM meta-response for: ${headline.title.slice(0, 40)}`);
          break;
        }
        if (stripped.length < 20) { throw new Error("Too short"); }
        if (stripped.length > 280) {
          if (attempt < 2) continue; // retry with strict instruction
          errors.push(`Still too long (${stripped.length} chars): ${headline.title.slice(0, 40)}`);
          break;
        }
        content = stripped;
        break;
      } catch (e: any) {
        if (attempt >= 2) errors.push(`LLM failed: ${e.message}`);
      }
    }

    if (!content) { skipped++; continue; }

    // Save to xPostQueue
    try {
      await convex.mutation(api.xPostQueue.create, {
        content,
        format,
        category,
        score: 70, // headlines are pre-curated — baseline score is high
        sourceType: "market",
        sourceAuthor: dedupKey,
        sourceUrl: headline.url,
      });
      generated++;
    } catch (e: any) {
      errors.push(`Save failed: ${e.message}`);
      skipped++;
    }
  }

  return NextResponse.json({ generated, skipped, errors });
}
