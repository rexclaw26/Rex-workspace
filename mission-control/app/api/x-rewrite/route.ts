// app/api/x-rewrite/route.ts
// Direct execution endpoint for X post rewrites.
// Receives tweet data → calls OpenRouter LLM → sends 3 versions to Kelly's Telegram.
// No task queue needed — executes inline and returns immediately.

import { NextResponse } from "next/server";
import type { XTweet } from "@/app/api/x-feed/route";

const OPENROUTER_API_KEY  = process.env.OPENROUTER_API_KEY  ?? "";
const TELEGRAM_BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN  ?? "";
const TELEGRAM_CHAT_ID    = process.env.TELEGRAM_KELLY_CHAT_ID ?? "1011362712";
const MODEL               = "anthropic/claude-sonnet-4-6";

// ── Send to Telegram ──────────────────────────────────────────────────────────
async function sendTelegram(text: string): Promise<void> {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
}

// ── Call OpenRouter ───────────────────────────────────────────────────────────
async function callLLM(prompt: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://mission-control.hitnetwork.io",
      "X-Title": "Mission Control - X Rewrite",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
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

// ── Build rewrite prompt ──────────────────────────────────────────────────────
function buildPrompt(tweet: XTweet): string {
  return `You are rewriting a post as @DiscoverCrypto on X (1M+ followers). This account covers crypto, macro, DeFi, tokenization, and institutional finance.

CORE VOICE: Sharp, conspiratorial, bullish on crypto infrastructure, distrustful of official narratives. Bad macro news always frames as a crypto unlock or validation. Direct address to audience ("Are you seeing it?", "Who's hedging?"). No hedge words. No AI-speak.

SOURCE POST (from @${tweet.author}):
"${tweet.text}"

SOURCE URL: ${tweet.url}

Produce exactly 3 versions. Each is a DIFFERENT FORMAT TYPE — not the same post at different lengths.

---

VERSION 1 — BREAKING ALERT (SUCCINCT)
Same structure as Version 2 — BREAKING opener + ALL CAPS headline + arrow bullets + closing question. But tighter: fewer bullets (2-3 max), shorter headline, more compressed. Different hook angle than Version 2. The goal is variety in the opening framing, not variety in format.

Real example of this format:
"BREAKING: S&P 500 RECLAIMS 6,800 AS TRUMP SIGNALS END TO IRAN WAR
-> +$2 TRILLION added since overnight lows
War off. Risk on back on?"

---

VERSION 2 — BREAKING ALERT
Hard news format. Pick the right opener based on urgency:
- BREAKING: → standard hard news
- 🚨 BREAKING → highest urgency (gov data, regulatory rulings, market shocks)
- BREAKING (but super sneaky): → buried/revised data the mainstream is ignoring
- JUST IN: → expected data release that just confirmed/matched expectations
- RED ALERT: → catastrophic scenario, systemic risk
- 🚨 BIG WIN → regulatory win, bullish milestone

Structure:
[OPENER] [ALL CAPS HEADLINE]
-> [data point or consequence]
-> [data point or consequence]
-> [closing question or bold take on its own line]

Arrow rules: -> starts each bullet, one per line, NEVER inline between sentences.
Each -> line must fit on ONE line without wrapping — max ~60 chars per bullet. Cut every filler word. Every word earns its place.
No character cap on total post length — as many bullets as the story needs, but each bullet stays tight.
Source attribution goes in the headline itself when available: "TRUMP CONSIDERS TROOPS TO MIDDLE EAST per Reuters" — not in a bullet.
Close with 2 lines: one punchy statement + one rhetorical question on separate lines. Don't pile crypto thesis into bullets AND the close — pick one lane. Let the close land clean.

Real examples of this format:
"BREAKING: HYPERLIQUID 100X GROWTH IN 6 MONTHS
-> HIP-3 OPEN INTEREST HITS $1.43B
-> Trade .xyz owns 90% of HIP-3 activity
-> 23 of top 30 pairs are tokenized stocks & commodities
Crypto rails on the path to dominate tradfi… Are you seeing it yet?"

"BREAKING: U.S. TREASURY BUYS BACK $15 BILLION IN DEBT, 🚨LARGEST BUYBACK IN HISTORY
-> Bond yields drop
-> Borrowing gets easier
-> Liquidity floods the system
Is it too late? Or is this the unlock crypto needed?"

"🚨 BREAKING (but super sneaky): 710k jobs just vanished from the books… Gov revised numbers down for the 13th month running. That's 55k ghost jobs every month. Since Jan 2024: 24/25 months revised -> LOWER. Economy strong? Really?"

"BREAKING: S&P 500 RECLAIMS 6,800 AS TRUMP SIGNALS END TO IRAN WAR
-> +$2 TRILLION added since overnight lows
War off. Risk on back on?"

---

VERSION 3 — BREAKING ALERT (DIFFERENT HOOK ANGLE)
Same structure as Version 2 — BREAKING/ALERT opener + ALL CAPS headline + arrow bullets + closing question. Different hook in the headline. Can use a different urgency opener (RED ALERT, JUST IN, 🚨 BIG WIN, BREAKING (but super sneaky)) if the angle warrants it. Bullet count similar to Version 2. The closing question takes a different angle than V2 — different emotion or audience challenge.

Real example of this format:
"BREAKING: US MONEY MARKET FUNDS AT ALL-TIME HIGH $8.24 TRILLION
-> Largest wall of sidelined cash in history
-> +58% surge since Dec 2022
-> Fidelity, JPMorgan, Schwab, Vanguard & BlackRock hold $4.76T of it
Where does this go next?"

---

RULES (ALL VERSIONS):
- Numbers always specific ($8.24T not "trillions", 55k not "tens of thousands")
- Historical comparison anchoring when relevant ("longest streak since Dec 2023", "dwarfs Russia-Ukraine by 10x")
- No hedge words: no "could", "might", "possibly", "seems", "may"
- No AI-speak: no "game-changer", "landscape", "delve", "unprecedented", "it's worth noting"
- ZERO em dashes anywhere. Use a regular hyphen-dash: "- @handle" not "— @handle". Em dash is an AI fingerprint. Always use "-".
- Emoji is functional not decorative: 🚨 = urgent alarm, ✅ = validation list, 🧩 = complicating pivot
- Only facts present in the source — no fabrication
- Conspiratorial/skeptical tone toward official narratives when the story warrants it
- Bad macro always connects to crypto thesis — not just "bad news" but "here's why Bitcoin/DeFi/crypto was built for this"
- Closing question targets the audience's identity and worldview: "Are you still asking why people are leaving fiat?" not just "Where does this go next?"
- When relevant, include a crypto-thesis bullet in the arrow list itself ("Bitcoin's fixed supply of 21M was built for exactly this moment")

Output ONLY the 3 versions in this exact format, nothing else:

VERSION 1:
[text]

VERSION 2:
[text]

VERSION 3:
[text]`;
}

// ── Format for Telegram ───────────────────────────────────────────────────────
function formatForTelegram(tweet: XTweet, llmOutput: string): string {
  // Strip any em dashes or en dashes — LLM must not generate them, but catch stragglers
  const cleaned = llmOutput.replace(/\u2014/g, "-").replace(/\u2013/g, "-");

  return `🐦 <b>X REWRITE</b> — @${tweet.author}\n\n${cleaned}\n\n<a href="${tweet.url}">View original ↗</a>`;
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });
  }
  if (!TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 500 });
  }

  let tweet: XTweet;
  try {
    const body = await request.json();
    tweet = body.tweet;
    if (!tweet?.text) throw new Error("Missing tweet data");
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const prompt   = buildPrompt(tweet);
    const llmOut   = await callLLM(prompt);
    const message  = formatForTelegram(tweet, llmOut);
    await sendTelegram(message);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[x-rewrite]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
