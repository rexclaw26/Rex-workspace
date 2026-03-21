// app/api/marketreport/route.ts
// Reads today's (or most recent) market report .md file and extracts:
//   - intro:        the opening paragraph (Daily Insight)
//   - quote:        the pull-quote from the report intro
//   - marketPulse:  the ### Market Pulse section text
//   - watching:     the ## What We're Watching items (title + body)
//
// Source: /Users/rex/.openclaw/workspace/market-reports/MARKET_REPORT_YYYYMMDD.md
// Falls back to most recent available file if today's isn't found.

import { NextResponse } from "next/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const REPORTS_DIR = join(process.env.HOME || "/Users/rex", ".openclaw/workspace/market-reports");

export interface WatchingItem {
  title: string;
  body: string;
}

export interface MarketReportData {
  date: string;           // YYYY-MM-DD
  reportTitle: string;    // the main H1 headline
  intro: string;          // opening editorial paragraph
  quote: string;          // pull-quote (if present)
  quoteAuthor: string;    // quote attribution
  marketPulse: string;    // ### Market Pulse body text
  watching: WatchingItem[]; // ## What We're Watching items
}

// ── Strip HTML tags, collapse whitespace ──────────────────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ── Find the best report file ─────────────────────────────────────────────────
function findReportFile(): { path: string; date: string } | null {
  const todayStr = new Date()
    .toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" })
    .replace(/-/g, ""); // YYYYMMDD

  try {
    const files = readdirSync(REPORTS_DIR)
      .filter((f) => /^MARKET_REPORT_\d{8}\.md$/.test(f))
      .sort()
      .reverse(); // newest first

    if (files.length === 0) return null;

    // Prefer today's
    const todayFile = files.find((f) => f.includes(todayStr));
    const chosen = todayFile ?? files[0];
    const dateStr = chosen.replace("MARKET_REPORT_", "").replace(".md", "");
    const date = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;

    return { path: join(REPORTS_DIR, chosen), date };
  } catch {
    return null;
  }
}

// ── Summary format (Gmail hook output) ───────────────────────────────────────
// When Kelly's report arrives via email, the Gmail hook generates a compact
// summary .md with sections like ## Key Narrative, ## Macro Environment, etc.
// Detect by presence of "**Report generated:**" metadata header.
function isSummaryFormat(text: string): boolean {
  return text.includes("**Report generated:**");
}

function parseSummaryFormat(raw: string, date: string): MarketReportData {
  const lines = raw.split("\n");

  // Title: first ## heading that looks like a headline (not the main # title)
  const titleLine = lines.find((l) => /^## [A-Z]/.test(l) && !/DISCOVER CRYPTO/.test(l));
  const reportTitle = titleLine ? titleLine.replace(/^## /, "").trim() : "";

  // Intro: ## Key Narrative section
  const narrativeMatch = raw.match(/## Key Narrative\n([\s\S]*?)(?=\n## |$)/);
  const intro = narrativeMatch
    ? narrativeMatch[1].replace(/\*\*/g, "").replace(/\*/g, "").trim()
    : "";

  // Market Pulse: ## Macro Environment bullets (first 4)
  const macroMatch = raw.match(/## Macro Environment\n([\s\S]*?)(?=\n## |$)/);
  let marketPulse = "";
  if (macroMatch) {
    const bullets = macroMatch[1]
      .split("\n")
      .filter((l) => /^- /.test(l.trim()))
      .map((l) => l.trim().replace(/^- /, "").replace(/\*\*/g, "").replace(/\*/g, ""))
      .filter((l) => l.length > 10)
      .slice(0, 4);
    marketPulse = bullets.join(" · ");
  }

  // What We're Watching: build from ETF Flows, Options, Institutional, Regulatory
  const watchConfig: Array<[string, string]> = [
    ["ETF Flows", "## ETF Flows"],
    ["Options & Derivatives", "## Options Activity"],
    ["Institutional Activity", "## Institutional & On-Chain"],
    ["Regulatory", "## Regulatory"],
  ];

  const watching: WatchingItem[] = [];
  for (const [title, header] of watchConfig) {
    const escaped = header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = raw.match(new RegExp(`${escaped}\\n([\\s\\S]*?)(?=\\n## |$)`));
    if (match) {
      const bullets = match[1]
        .split("\n")
        .filter((l) => /^[-*]/.test(l.trim()))
        .map((l) => l.trim().replace(/^[-*] /, "").replace(/\*\*/g, "").replace(/\*/g, ""))
        .filter((l) => l.length > 10)
        .slice(0, 3);
      if (bullets.length > 0) {
        watching.push({ title, body: bullets.join(". ") + "." });
      }
    }
  }

  return { date, reportTitle, intro, quote: "", quoteAuthor: "", marketPulse, watching };
}

// ── Parse report content ──────────────────────────────────────────────────────
//
// The markdown files produced from Kelly's HTML reports do NOT reliably use
// ###/#### heading prefixes — headings are often just indented plain text.
// All section detection below works on trimmed line content, not markdown syntax.
//
function parseReport(raw: string, date: string): MarketReportData {
  // Route to summary parser if this is a Gmail hook output file
  if (isSummaryFormat(raw)) return parseSummaryFormat(raw, date);
  const text = raw;

  // Pre-compute trimmed lines once — used for section boundary detection
  const allLines   = text.split("\n");
  const trimmed    = allLines.map((l) => l.trim());

  // Helper: find first line index where trimmed content matches a test
  const findLine = (test: (l: string) => boolean, after = 0) =>
    trimmed.findIndex((l, i) => i >= after && test(l));

  // ── Report title: the main # heading ──────────────────────────────────────
  const titleMatch = text.match(/#{1,2}\s+(.{20,}?)(?:\n|<)/);
  const reportTitle = titleMatch ? stripHtml(titleMatch[1]).trim() : "";

  // ── Intro paragraph ───────────────────────────────────────────────────────
  // The editorial opener — longest substantive paragraph before the price snapshot
  let intro = "";
  const introSection = text.split(/Market Snapshot|Market Pulse/i)[0] || text;
  const introParagraphs = introSection
    .split(/\n{2,}|<\/p>|<\/div>/)
    .map((p) => stripHtml(p).trim())
    .filter((p) => {
      if (p.length < 80) return false;
      if (/^\$[\d,]+/.test(p)) return false;
      if (/^(BTC|ETH|SOL|XRP|LINK)/.test(p)) return false;
      if (/EXTREME FEAR|FEAR.{0,5}GREED/i.test(p)) return false;
      if (/^#{1,4}/.test(p)) return false;
      if (/DISCOVER CRYPTO/i.test(p)) return false;
      if (/^(THURSDAY|MONDAY|TUESDAY|WEDNESDAY|FRIDAY|SATURDAY|SUNDAY)/i.test(p) && p.length < 60) return false;
      return true;
    })
    .sort((a, b) => b.length - a.length);
  intro = introParagraphs[0] ?? "";

  // ── Pull-quote ────────────────────────────────────────────────────────────
  let quote = "";
  let quoteAuthor = "";
  const quoteMatch = text.match(/[""""]([^""""\n]{40,})[""""]\s*[—–-]\s*([^\n<"]+)/);
  if (quoteMatch) {
    quote = quoteMatch[1].trim();
    quoteAuthor = stripHtml(quoteMatch[2]).trim();
  }

  // ── Market Pulse ──────────────────────────────────────────────────────────
  // Detect "Market Pulse" as a standalone trimmed line; take the first
  // substantive paragraph that follows it (works with or without ### prefix).
  let marketPulse = "";
  const pulseIdx = findLine((l) => /^#{0,3}\s*Market Pulse\s*$/i.test(l));
  if (pulseIdx >= 0) {
    const afterPulse = trimmed.slice(pulseIdx + 1).join("\n");
    const paras = afterPulse.split(/\n\s*\n/);
    for (const para of paras) {
      const p = stripHtml(para).replace(/\s+/g, " ").trim();
      if (p.length > 50) {
        marketPulse = p;
        break;
      }
    }
  }
  // Fallback: old regex for ### Market Pulse format
  if (!marketPulse) {
    const pulseMatch = text.match(/###\s*Market Pulse\s*([\s\S]*?)(?=\n##|\n###|$)/i);
    if (pulseMatch) marketPulse = stripHtml(pulseMatch[1]).trim();
  }

  // ── What We're Watching ───────────────────────────────────────────────────
  // Strategy: find the section by text content (not heading syntax), extract
  // all lines up to the next major section, split into blank-line-separated
  // blocks, then pair short blocks (titles) with the longer block that follows
  // (body). Works for both the old single-space-indent and new deep-indent formats.
  const watching: WatchingItem[] = [];

  const watchIdx = findLine((l) => /^What We.re Watching$/i.test(l));
  if (watchIdx >= 0) {
    // End of watch section = next line that looks like a major section header
    const SECTION_ENDS = /^(The Stories|Sources|Key Takeaways|Data Sources|About|Disclaimer)$/i;
    const endIdx = findLine((l) => SECTION_ENDS.test(l), watchIdx + 1);

    const watchLines = allLines
      .slice(watchIdx + 1, endIdx > 0 ? endIdx : undefined)
      .map((l) => l.trim());

    // Split into blocks separated by blank lines; collapse each block to single string
    const blocks = watchLines
      .join("\n")
      .split(/\n\s*\n/)
      .map((b) => stripHtml(b).replace(/\s+/g, " ").trim())
      .filter((b) => b.length > 5);

    // Pair: short block (≤ 80 chars) → title; immediately following longer block → body
    let i = 0;
    while (i < blocks.length) {
      const maybeTitle = blocks[i];
      const maybeBody  = blocks[i + 1];

      const looksLikeTitle =
        maybeTitle.length <= 80 &&
        maybeBody  !== undefined &&
        maybeBody.length > 30 &&
        maybeBody.length > maybeTitle.length;

      const isSource =
        /^(Market Data|Sources|CoinMarketCap|Analyst|Data Source|Macro Research)/i.test(maybeTitle) ||
        /CoinMarketCap|Yahoo Finance|Goldman Sachs|Federal Reserve|Glassnode/i.test(
          (maybeBody ?? "").slice(0, 80)
        );

      if (looksLikeTitle && !isSource) {
        watching.push({ title: maybeTitle, body: maybeBody });
        i += 2;
      } else {
        i += 1;
      }
    }
  }

  return { date, reportTitle, intro, quote, quoteAuthor, marketPulse, watching };
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET() {
  const found = findReportFile();

  if (!found) {
    return NextResponse.json({
      ok: false,
      error: "No market report found. Email today's market report to rex@hitnetwork.io.",
    });
  }

  try {
    const raw = readFileSync(found.path, "utf-8");
    const data = parseReport(raw, found.date);
    return NextResponse.json({ ok: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
