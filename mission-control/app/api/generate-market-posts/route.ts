// app/api/generate-market-posts/route.ts
// Generates X posts from DC Hub market data (Fear & Greed, prices, headlines).
// Saved to xPostQueue with sourceType: "market".
//
// Flow:
//   1. Fetch market-pulse + headlines from local DC Hub APIs
//   2. Extract key data points (Fear & Greed, price levels, ETF flows, etc.)
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

type PostFormat = "BREAKING" | "JUST IN" | "DATA" | "WATCHING" | "SIGNAL" | "THREAD";
type PostCategory = "btcEth" | "macro" | "altcoins" | "legislation" | "onchain";

// ── Call OpenRouter LLM ────────────────────────────────────────────────────────
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
  });
  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

// ── Build post prompt ────────────────────────────────────────────────────────────
function buildMarketPrompt(dataPoint: string, format: PostFormat, strict: boolean): string {
  const strictNote = strict
    ? "\nSTRICT: count every character. Stay under 280. Period."
    : "";

  const formatTemplates: Record<PostFormat, string> = {
    BREAKING: `[BREAKING]: [ALL CAPS HEADLINE]\n-> [data point]\n-> [consequence]\n[closing question]`,
    "JUST IN": `[JUST IN]: [what happened]\n-> [key data point]\n-> [market implication]\n[bold closing take]`,
    DATA: `[DATA]: [metric name: value]\n-> [what this means]\n-> [context]\n[closing question targeting crypto traders]`,
    WATCHING: `[WATCHING]: [situation developing]\n-> [key level to watch]\n-> [what confirms the thesis]\n[question that makes traders think]`,
    SIGNAL: `[SIGNAL]: [indicator/event]\n-> [what it suggests]\n-> [historical precedent]\n[thesis-building question]`,
    THREAD: `[THREAD/${format}]: [topic]\n-> [point 1: data]\n-> [point 2: implication]\n-> [point 3: what to watch]\n[closing thesis statement]`,
  };

  return `You are generating a single X (Twitter) post as @DiscoverCrypto (1M+ followers). Sharp, conspiratorial, bullish on crypto infrastructure. Direct. No hedge words.

DATA POINT:
"${dataPoint}"

FORMAT: ${format}
${formatTemplates[format]}

RULES:
- 280 characters MAX — hard limit
- Numbers specific ($8.24T not "trillions"), include actual figures
- No hedge words: no "could", "might", "possibly", "may"
- No AI-speak: no "game-changer", "landscape", "unprecedented"
- ZERO em dashes — use regular hyphen: -
- Only use the data provided — no fabrication${strictNote}

Output ONLY the post text, nothing else.`;
}

// ── Pick format based on content type ─────────────────────────────────────────
function pickFormat(dataPoint: string): PostFormat {
  const lower = dataPoint.toLowerCase();
  if (/fear\s*&\s*greed|extreme\s*fear|extreme\s*greed|fear\s*index/i.test(lower)) return "DATA";
  if (/etf\s*flow|inflow|outflow|etf\s*approve|cme\s*futures/i.test(lower)) return "DATA";
  if (/breaking|just\s*in|announce|confirm|ruling/i.test(lower)) return "JUST IN";
  if (/sec|cftc|finra|congress|senate|bill|law|regulation/i.test(lower)) return "SIGNAL";
  if (/on.chain|wallet|exchange\s*flow| Whale/i.test(lower)) return "SIGNAL";
  if (/watch|keep\s*an\s*eye|developing|monitor/i.test(lower)) return "WATCHING";
  return "WATCHING";
}

// ── Market data types ───────────────────────────────────────────────────────────
interface MarketPulse {
  date: string;
  fearGreed?: { value: number; label: string };
  intro?: string;
  takeaways?: Array<{ label: string; summary: string }>;
}

interface Headline {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: number;
}

// ── Main POST handler ──────────────────────────────────────────────────────────
export async function POST(request: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });
  }

  const errors: string[] = [];
  let generated = 0;
  let skipped = 0;

  try {
    // 1. Fetch market-pulse — use relative URL for Next.js internal routing
    let marketPulse: MarketPulse | null = null;
    try {
      const mpRes = await fetch(`/api/market-pulse`, {
        signal: AbortSignal.timeout(10000),
      });
      if (mpRes.ok) {
        const ct = mpRes.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) {
          marketPulse = await mpRes.json();
        } else {
          errors.push(`market-pulse returned ${mpRes.status} (${ct}), skipping`);
        }
      } else {
        errors.push(`market-pulse fetch failed: ${mpRes.status}`);
      }
    } catch (e: any) {
      errors.push(`market-pulse fetch error: ${e.message}`);
    }

    // 2. Fetch headlines — use relative URL for Next.js internal routing
    let headlines: Headline[] = [];
    try {
      const hlRes = await fetch(`/api/headlines`, {
        signal: AbortSignal.timeout(10000),
      });
      if (hlRes.ok) {
        const ct = hlRes.headers.get("content-type") ?? "";
        if (ct.includes("application/json")) {
          const data = await hlRes.json();
          headlines = (data.headlines ?? []).slice(0, 5);
        } else {
          errors.push(`headlines returned ${hlRes.status} (${ct}), skipping`);
        }
      } else {
        errors.push(`headlines fetch failed: ${hlRes.status}`);
      }
    } catch (e: any) {
      errors.push(`headlines fetch error: ${e.message}`);
    }

    // 3. Build candidate data points
    type Candidate = { text: string; format: PostFormat; category: PostCategory; url?: string };
    const candidates: Candidate[] = [];

    // Fear & Greed data points
    if (marketPulse?.fearGreed) {
      const fg = marketPulse.fearGreed;
      candidates.push({
        text: `Fear & Greed: ${fg.value}/100 (${fg.label}). ${marketPulse.intro?.slice(0, 200) ?? ""}`,
        format: pickFormat(`fear greed ${fg.value}`),
        category: "macro",
      });
    }

    // Key takeaways from market pulse
    if (marketPulse?.takeaways) {
      for (const t of marketPulse.takeaways.slice(0, 3)) {
        candidates.push({
          text: `${t.label}: ${t.summary}`,
          format: pickFormat(t.label + " " + t.summary),
          category: "macro",
        });
      }
    }

    // Top headlines
    for (const hl of headlines) {
      candidates.push({
        text: `${hl.source}: ${hl.title}`,
        format: pickFormat(hl.title),
        category: "btcEth",
        url: hl.url,
      });
    }

    if (candidates.length === 0) {
      return NextResponse.json({
        generated: 0,
        skipped: 0,
        errors: errors.length > 0 ? errors : ["No market data available from market-pulse or headlines"],
      });
    }

    // 4. Dedup check (market data — dedup by content hash for the day)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const dayStart = todayStart.getTime();

    for (const candidate of candidates) {
      // Simple dedup: check if this exact content was already posted today
      const contentHash = candidate.text.slice(0, 80);
      try {
        const isDupe = await convex.query(api.xPostQueue.checkDuplicate, {
          sourceAuthor: contentHash,
          dayStart,
        });
        if (isDupe) {
          skipped++;
          continue;
        }
      } catch {
        // Non-fatal
      }

      // 5. Generate post via LLM
      let content = "";
      let attempt = 0;
      const maxAttempts = 2;

      while (attempt < maxAttempts) {
        attempt++;
        try {
          const prompt = buildMarketPrompt(candidate.text, candidate.format, attempt === 2);
          content = (await callLLM(prompt)).trim();
          content = content.replace(/\u2014/g, "-").replace(/\u2013/g, "-");

          if (content.length > 280) {
            if (attempt < maxAttempts) continue;
            errors.push(`Post too long (${content.length} chars) — skipped`);
            skipped++;
            content = "";
            break;
          }

          // Skip "I can't make a post" meta-responses
          const cantPostPatterns = [
            /cannot fabricate/i, /no compliant post/i, /cannot make a post/i,
            /sorry,? i can'?t/i, /i can'?t generate/i, /no post (is )?possible/i,
          ];
          if (cantPostPatterns.some((p) => p.test(content))) {
            errors.push(`Unusable market data — skipped`);
            skipped++;
            content = "";
            break;
          }
          break;
        } catch (err: any) {
          errors.push(`LLM failed: ${err.message}`);
          skipped++;
          content = "";
          break;
        }
      }

      if (!content) continue;

      // 6. Save to xPostQueue
      try {
        await convex.mutation(api.xPostQueue.create, {
          content,
          format: candidate.format,
          category: candidate.category,
          score: 65, // market data posts start at 65 (no X-specific penalties)
          sourceType: "market",
          sourceAuthor: candidate.url ? new URL(candidate.url).hostname.replace("www.", "") : "market-pulse",
          sourceUrl: candidate.url,
        });
        generated++;
      } catch (err: any) {
        errors.push(`Save failed: ${err.message}`);
        skipped++;
      }
    }

    return NextResponse.json({ generated, skipped, errors });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
