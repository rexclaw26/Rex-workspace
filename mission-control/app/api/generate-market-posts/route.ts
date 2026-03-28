// app/api/generate-market-posts/route.ts
// Generates X posts from public market data APIs (CoinGecko, Fear & Greed).
// Falls back to DC Hub if reachable, but works independently.
// Saved to xPostQueue with sourceType: "market".
//
// Flow:
//   1. Fetch Fear & Greed from alternative.me
//   2. Fetch top crypto prices from CoinGecko
//   3. Generate posts via OpenRouter LLM
//   4. Save to xPostQueue with 24h expiry
//
// Returns: { generated: number, skipped: number, errors: string[] }

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
function pickFormat(text: string): PostFormat {
  const t = text.toLowerCase();
  if (/breaking|🚨|alert/.test(t)) return "BREAKING";
  if (/just in|announce|confirm/.test(t)) return "JUST IN";
  if (/data|report|numbers|cpi|gdp|jobs|payroll/.test(t)) return "DATA";
  if (/signal|indicator|pattern|divergence/.test(t)) return "SIGNAL";
  if (/watching|keep an eye|develop/.test(t)) return "WATCHING";
  return "WATCHING";
}

// ── Pick category ─────────────────────────────────────────────────────────────
function pickCategory(text: string): PostCategory {
  const t = text.toLowerCase();
  if (/bitcoin|btc|eth|ethereum|solana| XRP|bnb/.test(t)) return "btcEth";
  if (/macro|fed|inflation|jobs|gdp|rate/.test(t)) return "macro";
  if (/altcoin|defi|token|web3/.test(t)) return "altcoins";
  return "macro";
}

// ── Score candidate (0-100) ───────────────────────────────────────────────────
function scoreCandidate(text: string): number {
  let score = 50;
  if (/record|ath|all.time high|historic/.test(text)) score += 20;
  if (/crash|plunge|ban|reject|regulation/.test(text)) score += 15;
  if (/etf|inflow|outflow|adoption|institution/.test(text)) score += 10;
  if (/billion|trillion|\$[0-9]+[btmk]|\$[0-9]+\.[0-9]+[km]/.test(text)) score += 8;
  if (/fed|fomc|powell|sec|cftc|treasury/.test(text)) score += 8;
  if (text.length < 60) score -= 15;
  return Math.max(0, Math.min(100, score));
}

// ── Build post prompt ─────────────────────────────────────────────────────────
function buildPrompt(candidates: string[], format: PostFormat, attempt: number): string {
  const strict = attempt > 1
    ? "\nSTRICT: Previous output was over 280 characters. Output UNDER 280 chars. Count every character."
    : "";
  return `You are generating a single X post as @DiscoverCrypto (1M+ followers). Voice: sharp, conspiratorial, anti-establishment, bullish on crypto infrastructure. No hedge words. No em dashes. Use contractions. Numbers specific.

Pick the strongest data point below and write ONE post:

${candidates.map((c, i) => `${i + 1}. ${c}`).join("\n")}

FORMAT: ${format}
${format === "BREAKING" || format === "JUST IN" ? `[${format}:] [ALL CAPS HEADLINE]\n-> [data point]\n-> [consequence or bold take]` : `[Punchy opener]\n[Specific data point]\n[Closing thesis or question]`}

280 chars max.${strict}`;
}

// ── Main handler ────────────────────────────────────────────────────────────────
export async function POST() {
  const errors: string[] = [];
  let generated = 0;
  let skipped = 0;

  // ── Data fetching ────────────────────────────────────────────────────────

  // 1. Fear & Greed from alternative.me (public, no key)
  let fearGreed: { value: number; label: string } | null = null;
  try {
    const r = await fetch("https://api.alternative.me/fng/", {
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) {
      const d = await r.json();
      const item = d.data?.[0];
      if (item) {
        fearGreed = {
          value: parseInt(item.value),
          label: item.value_classification,
        };
      }
    }
  } catch (e: any) {
    errors.push(`Fear&Greed: ${e.message}`);
  }

  // 2. BTC price from CoinGecko (public)
  let btcPrice: number | null = null;
  let btcChange24h: number | null = null;
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
      { signal: AbortSignal.timeout(8000) }
    );
    if (r.ok) {
      const d = await r.json();
      btcPrice = d.bitcoin?.usd ?? null;
      btcChange24h = d.bitcoin?.usd_24h_change ?? null;
    }
  } catch (e: any) {
    errors.push(`CoinGecko: ${e.message}`);
  }

  // 3. ETH price from CoinGecko
  let ethPrice: number | null = null;
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true",
      { signal: AbortSignal.timeout(8000) }
    );
    if (r.ok) {
      const d = await r.json();
      ethPrice = d.ethereum?.usd ?? null;
    }
  } catch (e: any) {
    // silent - ETH is optional
  }

  // 4. Try DC Hub for extended market data (optional — don't fail if unreachable)
  let dcHubIntro: string | null = null;
  try {
    const r = await fetch(`${DC_HUB_URL}/api/market-pulse`, {
      signal: AbortSignal.timeout(6000),
    });
    if (r.ok) {
      const d = await r.json();
      dcHubIntro = d.intro ?? null;
    }
  } catch {
    // DC Hub unreachable — silent, we have Fear & Greed + prices
  }

  // ── Build candidates ──────────────────────────────────────────────────────
  type Candidate = { text: string; format: PostFormat; category: PostCategory };
  const candidates: Candidate[] = [];

  if (fearGreed) {
    const emoji = fearGreed.value <= 20 ? "😱" : fearGreed.value <= 40 ? "😰" : fearGreed.value <= 60 ? "😐" : "😎";
    const fgText = `Fear & Greed: ${fearGreed.value}/100 — ${fearGreed.label}${emoji}`;
    candidates.push({
      text: fgText,
      format: pickFormat(fgText),
      category: "macro",
    });
  }

  if (btcPrice) {
    const change = btcChange24h ? `${btcChange24h > 0 ? "+" : ""}${btcChange24h.toFixed(2)}%` : "";
    const btcText = `Bitcoin: $${btcPrice.toLocaleString()}${change ? ` (${change} 24h)` : ""}`;
    candidates.push({
      text: btcText,
      format: pickFormat(btcText),
      category: "btcEth",
    });
  }

  if (ethPrice) {
    const ethText = `Ethereum: $${ethPrice.toLocaleString()}`;
    candidates.push({
      text: ethText,
      format: pickFormat(ethText),
      category: "btcEth",
    });
  }

  if (dcHubIntro) {
    const introText = dcHubIntro.slice(0, 280);
    candidates.push({
      text: introText,
      format: pickFormat(introText),
      category: "macro",
    });
  }

  if (candidates.length === 0) {
    return NextResponse.json({
      generated: 0,
      skipped: 0,
      errors: errors.length > 0 ? errors : ["No market data available"],
    });
  }

  // Sort by score
  candidates.sort((a, b) => scoreCandidate(b.text) - scoreCandidate(a.text));
  const topCandidates = candidates.slice(0, 5);

  // ── Generate + save ──────────────────────────────────────────────────────
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const dayStart = todayStart.getTime();

  for (const candidate of topCandidates) {
    const candText = candidate.text;

    // Skip if score too low
    if (scoreCandidate(candText) < 35) { skipped++; continue; }

    // Dedup: check if this exact text was posted today
    try {
      const dup = await convex.query(api.xPostQueue.checkDuplicate, {
        sourceAuthor: "market-data",
        dayStart,
      });
      if (dup) { skipped++; continue; }
    } catch { /* convex unavailable — skip dedup */ }

    // Build prompt
    const prompt = buildPrompt([candText], candidate.format, 1);

    let content = "";
    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      try {
        const out = await callLLM(buildPrompt([candText], candidate.format, attempt));
        // Strip em-dashes
        content = out.replace(/—/g, "-").replace(/‒/g, "-").trim();
        // Quick sanity check — must have some content
        if (content.length < 20) throw new Error("Too short");
        break;
      } catch (e: any) {
        attempt++;
        if (attempt >= maxAttempts) {
          errors.push(`LLM failed: ${e.message}`);
          content = "";
        }
      }
    }

    if (!content) { skipped++; continue; }

    // 280-char final check
    if (content.length > 280) {
      // Last try with strict instruction
      try {
        const retry = await callLLM(buildPrompt([candText], candidate.format, 2));
        const stripped = retry.replace(/—/g, "-").trim();
        if (stripped.length <= 280) content = stripped;
        else { errors.push(`Too long (${content.length} chars), skipped`); skipped++; continue; }
      } catch {
        errors.push(`280-char retry failed, skipped`);
        skipped++;
        continue;
      }
    }

    // Save
    try {
      await convex.mutation(api.xPostQueue.create, {
        content,
        format: candidate.format,
        category: candidate.category,
        score: scoreCandidate(candText),
        sourceType: "market",
        sourceAuthor: "market-data",
      });
      generated++;
    } catch (e: any) {
      errors.push(`Save failed: ${e.message}`);
      skipped++;
    }
  }

  return NextResponse.json({ generated, skipped, errors });
}
