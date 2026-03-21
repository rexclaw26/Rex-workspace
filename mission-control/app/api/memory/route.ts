// app/api/memory/route.ts
// Read-only memory file browser for Mission Control.
// Reads MEMORY.md (long-term) + memory/YYYY-MM-DD.md (daily logs) from the workspace.
// Returns a structured list of files with their content for display.

import { NextResponse } from "next/server";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const WORKSPACE = join(process.env.HOME || "/Users/rex", ".openclaw/workspace");

export interface MemoryFile {
  id: string;          // "memory" | "2026-03-06"
  label: string;       // "Long-Term Memory" | "March 6, 2026"
  type: "longterm" | "daily";
  date?: string;       // YYYY-MM-DD for daily files
  content: string;     // raw markdown content
  size: number;        // bytes
  modified?: number;   // file mtime epoch ms
}

export interface MemoryResponse {
  ok: boolean;
  files: MemoryFile[];
  error?: string;
}

export async function GET(): Promise<NextResponse<MemoryResponse>> {
  try {
    const files: MemoryFile[] = [];

    // ── Long-term MEMORY.md ──────────────────────────────────────────────────
    const memoryMdPath = join(WORKSPACE, "MEMORY.md");
    if (existsSync(memoryMdPath)) {
      const content = readFileSync(memoryMdPath, "utf-8");
      files.push({
        id: "memory",
        label: "Long-Term Memory",
        type: "longterm",
        content,
        size: Buffer.byteLength(content, "utf-8"),
      });
    }

    // ── Daily memory files memory/YYYY-MM-DD.md ──────────────────────────────
    const memoryDir = join(WORKSPACE, "memory");
    if (existsSync(memoryDir)) {
      const entries = readdirSync(memoryDir)
        .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
        .sort()
        .reverse(); // newest first

      for (const filename of entries) {
        const date = filename.replace(".md", ""); // "2026-03-06"
        const filePath = join(memoryDir, filename);
        const content = readFileSync(filePath, "utf-8");
        // Format date label: "March 6, 2026"
        const dateObj = new Date(date + "T12:00:00"); // noon UTC to avoid TZ offset issues
        const label = dateObj.toLocaleDateString("en-US", {
          month: "long", day: "numeric", year: "numeric",
        });
        files.push({
          id: date,
          label,
          type: "daily",
          date,
          content,
          size: Buffer.byteLength(content, "utf-8"),
        });
      }
    }

    return NextResponse.json({ ok: true, files });
  } catch (err: any) {
    return NextResponse.json({ ok: false, files: [], error: err.message }, { status: 500 });
  }
}
