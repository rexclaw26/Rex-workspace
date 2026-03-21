// app/api/headlines/fetch/route.ts
// Called by the "Update Headlines" button on the headlines page.
// Does two things:
//   1. Triggers Convex fetchAndStore action → pulls live RSS feeds
//   2. Syncs market-notes.md (if file exists) → calls marketnotes POST route
//      which parses date sections and stores each with its canonical dataTimestamp

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
// Falls back to Kelly's raw market-notes.md if rex-notes.md is missing.
const MARKETNOTES_PATHS = [
  path.resolve(process.env.HOME ?? "/Users/rex", ".openclaw/workspace/rex-notes.md"),
  path.resolve(process.env.HOME ?? "/Users/rex", ".openclaw/workspace/market-reports/market-notes.md"),
  path.resolve(process.env.HOME ?? "/Users/rex", ".openclaw/workspace/marketnotes.md"),
  path.resolve(process.env.HOME ?? "/Users/rex", ".openclaw/workspace/market-notes.md"),
];

// Same date-section parser as marketnotes/route.ts (duplicated to avoid cross-route imports)
const DATE_SECTION_RE = /^## (\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.*)/;

function parseAndSyncMarketNotes(content: string): Promise<unknown>[] {
  const lines = content.split("\n");
  const sections: Array<{ date: string; dataTimestamp: number; content: string }> = [];

  let currentDate: string | null = null;
  let currentLines: string[] = [];

  const flush = () => {
    if (!currentDate || currentLines.join("").trim().length < 50) return;
    const [year, month, day] = currentDate.split("-").map(Number);
    sections.push({
      date: currentDate,
      dataTimestamp: Date.UTC(year, month - 1, day),
      content: currentLines.join("\n").trim(),
    });
  };

  for (const line of lines) {
    const match = line.match(DATE_SECTION_RE);
    if (match) {
      flush();
      currentDate = match[1];
      currentLines = [line];
    } else if (currentDate) {
      currentLines.push(line);
    }
  }
  flush();

  // Pacific time — avoids UTC rollover making "today" show tomorrow's date after ~4-8 PM PST/PDT
  // America/Los_Angeles auto-handles PST→PDT transitions (no manual DST offset math needed)
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });

  return [
    // Full file
    convex.mutation(api.headlines.upsertKnowledge, {
      key: "marketnotes",
      content,
      date: today,
    }),
    // Each date section with its own dataTimestamp
    ...sections.map((s) =>
      convex.mutation(api.headlines.upsertKnowledge, {
        key: `marketnotes_${s.date}`,
        content: s.content,
        date: s.date,
        dataTimestamp: s.dataTimestamp,
      })
    ),
  ];
}

export async function POST() {
  try {
    // 1. Trigger live RSS fetch → store in Convex
    const rssResult = await convex.action(api.headlines.fetchAndStore, {});

    // 2. Sync market-notes.md if it exists on disk
    let marketNotesStatus = "not_found";
    let sectionsFound = 0;

    for (const p of MARKETNOTES_PATHS) {
      try {
        if (fs.existsSync(p)) {
          const content = fs.readFileSync(p, "utf-8");
          if (content.trim().length > 0) {
            const mutations = parseAndSyncMarketNotes(content);
            await Promise.all(mutations);
            sectionsFound = mutations.length - 1; // minus the full-file entry
            marketNotesStatus = "synced";
            break;
          }
        }
      } catch {
        // continue to next path
      }
    }

    return NextResponse.json({
      ok: true,
      fetched: rssResult.fetched,
      inserted: rssResult.inserted,
      errors: rssResult.errors,
      marketNotes: marketNotesStatus,
      marketNotesSections: sectionsFound,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Fetch failed" },
      { status: 500 }
    );
  }
}
