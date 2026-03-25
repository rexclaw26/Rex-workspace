// app/api/headlines/marketnotes/route.ts
// GET  — returns current marketnotes context for a given date (or full file)
// POST — ingests market-notes.md from filesystem, parses into dated sections,
//         stores each section in Convex with its own dataTimestamp.
//
// Canonical timestamp rule:
//   The section header "## YYYY-MM-DD —" is the authoritative date for that block.
//   dataTimestamp = that date at midnight UTC (epoch ms).
//   We do NOT use the email delivery time or file modification time.
//   Comparisons between market notes and RSS headlines use their respective
//   dataTimestamp / pubDate fields — newer always supersedes older on the same topic.

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import fs from "fs";
import path from "path";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud"
);

// ── File Lookup ────────────────────────────────────────────────────────────────
// rex-notes.md is Rex's canonical normalized file — always checked first.
// It's maintained by Rex, formatted exactly as the pipeline expects.
// Kelly's raw market-notes.md is kept as source material but not parsed directly.
const MARKETNOTES_PATHS = [
  // Primary: Rex's canonical normalized notes (maintained by Rex, updated daily)
  path.resolve(process.env.HOME ?? "/Users/rex", ".openclaw/workspace/rex-notes.md"),
  // Fallback: Kelly's raw notes (market-reports/ folder — where Gmail hook saves)
  path.resolve(process.env.HOME ?? "/Users/rex", ".openclaw/workspace/market-reports/market-notes.md"),
  // Legacy paths (workspace root)
  path.resolve(process.env.HOME ?? "/Users/rex", ".openclaw/workspace/marketnotes.md"),
  path.resolve(process.env.HOME ?? "/Users/rex", ".openclaw/workspace/market-notes.md"),
];

function readMarketNotesFromDisk(): { content: string; filePath: string } | null {
  for (const p of MARKETNOTES_PATHS) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8");
        if (content.trim().length > 0) return { content, filePath: p };
      }
    } catch {
      // continue
    }
  }
  return null;
}

// ── Date Section Parser ────────────────────────────────────────────────────────
// Splits market-notes.md into individual dated sections.
// Each section starts with: ## YYYY-MM-DD — [headline text]
// The date in the header is the canonical dataTimestamp for that section.
// Sections are returned newest-first (file is assumed to be ordered newest-first).

interface MarketNotesSection {
  date: string;         // YYYY-MM-DD
  dataTimestamp: number; // midnight UTC epoch ms
  headline: string;     // the text after the dash in the header
  content: string;      // full section content including the header line
}

const DATE_SECTION_RE = /^## (\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.*)/;

function parseMarketNotesSections(content: string): MarketNotesSection[] {
  const lines = content.split("\n");
  const sections: MarketNotesSection[] = [];

  let currentDate: string | null = null;
  let currentHeadline = "";
  let currentLines: string[] = [];

  const flushSection = () => {
    if (!currentDate || currentLines.length === 0) return;
    const sectionContent = currentLines.join("\n").trim();
    if (sectionContent.length < 50) return; // skip empty/near-empty sections

    // Parse date → midnight UTC timestamp
    // Use Date.UTC to avoid timezone issues
    const [year, month, day] = currentDate.split("-").map(Number);
    const dataTimestamp = Date.UTC(year, month - 1, day); // midnight UTC

    sections.push({
      date: currentDate,
      dataTimestamp,
      headline: currentHeadline,
      content: sectionContent,
    });
  };

  for (const line of lines) {
    const match = line.match(DATE_SECTION_RE);
    if (match) {
      flushSection();
      currentDate = match[1];
      currentHeadline = match[2].trim();
      currentLines = [line];
    } else if (currentDate) {
      currentLines.push(line);
    }
    // Lines before the first section header are skipped (e.g., doc title/preamble)
  }

  flushSection(); // flush the last section

  return sections; // newest first (assuming file is newest-first)
}

// ── GET — return knowledge doc for a specific date or the full file ────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // optional: YYYY-MM-DD

    if (date) {
      // Return specific date section
      const key = `marketnotes_${date}`;
      const doc = await convex.query(api.headlines.getKnowledge, { key });
      return NextResponse.json({
        ok: true,
        date,
        dataTimestamp: doc?.dataTimestamp ?? null,
        content: doc?.content ?? null,
        updatedAt: doc?.updatedAt ?? null,
      });
    }

    // Default: return full file entry
    const doc = await convex.query(api.headlines.getKnowledge, { key: "marketnotes" });
    return NextResponse.json({
      ok: true,
      content: doc?.content ?? null,
      date: doc?.date ?? null,
      updatedAt: doc?.updatedAt ?? null,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// ── POST — ingest market-notes.md from disk into Convex ───────────────────────
export async function POST() {
  try {
    const file = readMarketNotesFromDisk();

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "market-notes.md not found. Expected at market-reports/market-notes.md" },
        { status: 404 }
      );
    }

    const { content } = file;

    // 1. Store full file as "marketnotes" (always replaced — this is the latest version)
    // Use Pacific time for date — avoids UTC rollover at 4-8 PM PST/PDT
    // America/Los_Angeles auto-handles PST (UTC-8) ↔ PDT (UTC-7) transitions
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
    await convex.mutation(api.headlines.upsertKnowledge, {
      key: "marketnotes",
      content,
      date: today,
      dataTimestamp: undefined, // full file has no single dataTimestamp
    });

    // 2. Parse into date sections and store each one
    const sections = parseMarketNotesSections(content);
    let sectionsStored = 0;

    for (const section of sections) {
      await convex.mutation(api.headlines.upsertKnowledge, {
        key: `marketnotes_${section.date}`,
        content: section.content,
        date: section.date,
        dataTimestamp: section.dataTimestamp,
      });
      sectionsStored++;
    }

    // 3. Return summary
    const datesIngested = sections.map((s) => ({
      date: s.date,
      dataTimestamp: s.dataTimestamp,
      headline: s.headline,
      chars: s.content.length,
    }));

    return NextResponse.json({
      ok: true,
      synced: true,
      filePath: file.filePath,
      fileSize: content.length,
      sectionsFound: sections.length,
      sectionsStored,
      datesIngested,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Ingest failed" },
      { status: 500 }
    );
  }
}
