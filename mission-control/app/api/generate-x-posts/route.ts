// app/api/generate-x-posts/route.ts
// Generates X posts from the current x-feed and saves them to xPostQueue.
// Called by OpenClaw cron and the [GENERATE NOW] button in /ready-posts.
//
// Flow:
//   1. Fetch top stories from /api/x-feed
//   2. Score and pick candidates (top 3 per category)
//   3. Dedup: skip if same sourceAuthor already has a post today
//   4. Generate post via OpenRouter LLM
//   5. Save to xPostQueue with 24h expiry
//
// Returns: { generated: number, skipped: number, errors: string[] }

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { XFeedData, XTweet } from "@/app/api/x-feed/route";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud"
);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const MODEL = "anthropic/claude-sonnet-4-6";

// ── Category mapping ───────────────────────────────────────────────────────────
type PostCategory = "btcEth" | "macro" | "altcoins" | "legislation" | "onchain";
type PostFormat = "BREAKING" | "JUST IN" | "DATA" | "WATCHING" | "SIGNAL" | "THREAD";

const feedCategoryMap: Record<string, PostCategory> = {
  btcEth: "btcEth",
  macro: "macro",
  altcoins: "altcoins",
};

// ── Score a tweet for post-worthiness (0-100) ─────────────────────────────────
function scoreTweet(tweet: XTweet): number {
  const text = tweet.text.toLowerCase();
  let score = 50;

  // Boost: urgency signals
  if (/breaking|just in|alert|🚨/.test(text)) score += 20;
  if (/record|ath|all.time high|historic/.test(text)) score += 15;
  if (/billion|trillion|\$[0-9]+b|\$[0-9]+t/.test(text)) score += 10;
  if (/bitcoin|btc|ethereum|eth/.test(text)) score += 8;
  if (/fed|fomc|powell|sec|cftc|trump/.test(text)) score += 8;
  if (/crash|plunge|ban|hack|reject/.test(text)) score += 12;
  if (/etf|inflow|outflow|adoption/.test(text)) score += 6;

  // Penalty: low signal
  if (text.length < 80) score -= 15;
  if (/prediction|price target|will reach|could hit/.test(text)) score -= 10;
  if (/sponsored|ad|promo|check out my/.test(text)) score -= 30;

  return Math.max(0, Math.min(100, score));
}

// ── Pick the best format for the content ──────────────────────────────────────
function pickFormat(tweet: XTweet): PostFormat {
  const text = tweet.text.toLowerCase();
  if (/breaking|🚨|red alert/.test(text)) return "BREAKING";
  if (/just in|just announced|confirmed/.test(text)) return "JUST IN";
  if (/data|report|numbers|cpi|gdp|jobs|payroll/.test(text)) return "DATA";
  if (/watching|keep an eye|developing/.test(text)) return "WATCHING";
  if (/signal|indicator|pattern|divergence/.test(text)) return "SIGNAL";
  return "WATCHING"; // default — neutral, non-alarmist
}

// ── Call OpenRouter LLM ────────────────────────────────────────────────────────
async function callLLM(prompt: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://mission-control.hitnetwork.io",
      "X-Title": "Mission Control - X Post Generator",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ── Build generation prompt ────────────────────────────────────────────────────
function buildPrompt(tweet: XTweet, format: PostFormat, isRetry = false): string {
  const strictNote = isRetry
    ? "\nSTRICT: Your previous output exceeded 280 characters. This time output EXACTLY under 280 characters. Count every character before submitting."
    : "";
  return `You are generating a single X (Twitter) post as @DiscoverCrypto (1M+ followers). This account covers crypto, macro, DeFi, tokenization, and institutional finance.

VOICE: Sharp, conspiratorial, bullish on crypto infrastructure, distrustful of official narratives. Direct. No hedge words. No AI-speak. No em dashes.

SOURCE POST (from @${tweet.author}):
"${tweet.text}"

FORMAT REQUIRED: ${format}

Generate ONE post in this format:
${format === "BREAKING" || format === "JUST IN" ? `[${format}:] [ALL CAPS HEADLINE]
-> [data point or consequence]
-> [data point or consequence]
[closing question or bold take]` : `[Punchy opening statement]
[Supporting data point]
[Closing question or crypto thesis angle]`}

RULES:
- 280 characters MAX
- Numbers specific ($8.24T not "trillions")
- No hedge words: no "could", "might", "possibly"
- No AI-speak: no "game-changer", "landscape", "unprecedented"
- ZERO em dashes. Use regular hyphen: -
- Only facts from the source — no fabrication
- Closing question targets the audience's identity and worldview${strictNote}

Output ONLY the post text, nothing else.`;
}

// ── Main POST handler ──────────────────────────────────────────────────────────
export async function POST(request: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY not configured" },
      { status: 500 }
    );
  }

  const errors: string[] = [];
  let generated = 0;
  let skipped = 0;

  try {
    // 1. Fetch x-feed
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
    const feedRes = await fetch(`${baseUrl}/api/x-feed`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!feedRes.ok) {
      return NextResponse.json(
        { error: `x-feed fetch failed: ${feedRes.status}` },
        { status: 502 }
      );
    }
    const feedData: XFeedData = await feedRes.json();

    // 2. Build candidate list — top 3 per category by score
    const candidates: Array<{ tweet: XTweet; category: PostCategory }> = [];

    for (const [feedKey, category] of Object.entries(feedCategoryMap)) {
      const tweets = feedData[feedKey as keyof XFeedData] as XTweet[];
      if (!Array.isArray(tweets)) continue;

      const scored = tweets
        .map((t) => ({ tweet: t, score: scoreTweet(t), category: category as PostCategory }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      candidates.push(...scored.map((s) => ({ tweet: s.tweet, category: s.category })));
    }

    // 3. Dedup + generate
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const dayStart = todayStart.getTime();

    for (const { tweet, category } of candidates) {
      const author = tweet.author;

      // Dedup: skip if this author already has a post today
      try {
        const isDupe = await convex.query(api.xPostQueue.checkDuplicate, {
          sourceAuthor: author,
          dayStart,
        });
        if (isDupe) {
          skipped++;
          continue;
        }
      } catch {
        // Non-fatal: proceed without dedup check
      }

      const score = scoreTweet(tweet);

      // Minimum score gate — skip low-signal tweets before wasting an LLM call
      if (score < 40) {
        skipped++;
        continue;
      }

      const format = pickFormat(tweet);

      // 4. Generate post via LLM
      let content = "";
      let attempt = 0;
      const maxAttempts = 2;

      while (attempt < maxAttempts) {
        attempt++;
        try {
          const prompt = buildPrompt(tweet, format, attempt === 2);
          content = (await callLLM(prompt)).trim();
          // Strip em dashes if LLM added any
          content = content.replace(/\u2014/g, "-").replace(/\u2013/g, "-");

          // Enforce 280 char limit — retry once with stricter prompt, then skip
          if (content.length > 280) {
            if (attempt < maxAttempts) continue; // retry with stricter prompt
            errors.push(`Post too long (${content.length} chars) for @${author} — skipped`);
            skipped++;
            content = ""; // ensure we don't save it
            break;
          }

          // Skip "I can't make a post" meta-responses — not real posts
          const cantPostPatterns = [
            /cannot fabricate/i,
            /no compliant post/i,
            /cannot make a post/i,
            /sorry,? i can'?t/i,
            /i can'?t generate/i,
            /no post (is )?possible/i,
            /only a (youtube|youtube) promo/i,
          ];
          if (cantPostPatterns.some((p) => p.test(content))) {
            errors.push(`Unusable source @${author} — no valid post possible`);
            skipped++;
            content = "";
            break;
          }
          break; // success
        } catch (err: any) {
          errors.push(`LLM failed for @${author}: ${err.message}`);
          skipped++;
          content = "";
          break;
        }
      }

      // 5. Save to xPostQueue — only if we have valid content
      if (!content) {
        // Already counted in skipped above
        continue;
      }
      try {
        await convex.mutation(api.xPostQueue.create, {
          content,
          format,
          category,
          score,
          sourceAuthor: author,
          sourceUrl: tweet.url,
        });
        generated++;
      } catch (err: any) {
        errors.push(`Save failed for @${author}: ${err.message}`);
        skipped++;
      }
    }

    return NextResponse.json({ generated, skipped, errors });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
