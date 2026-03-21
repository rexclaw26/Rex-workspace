// app/api/calendar/delete/route.ts
// DELETE handler — removes a calendarEvent from both Convex and Google Calendar.
// Accepts: { convexId: string, googleEventId?: string }
// Google Calendar deletion is attempted first (best-effort).
// Convex deletion always runs regardless of Google outcome.

import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// ── Config ────────────────────────────────────────────────────────────────────

const CALENDAR_ID = "rex@hitnetwork.io";
const GOG_BIN     = "/opt/homebrew/bin/gog";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud"
);

function shellEscape(str: string): string {
  return `'${str.replace(/'/g, "'\\''")}'`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let body: { convexId?: string; googleEventId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { convexId, googleEventId } = body;

  if (!convexId) {
    return NextResponse.json({ error: "convexId is required" }, { status: 400 });
  }

  const result: { convexDeleted: boolean; googleDeleted: boolean; googleError?: string } = {
    convexDeleted: false,
    googleDeleted: false,
  };

  // ── Step 1: Delete from Google Calendar (best-effort) ──────────────────────
  if (googleEventId) {
    try {
      execSync(
        `${GOG_BIN} calendar delete ${shellEscape(CALENDAR_ID)} ${shellEscape(googleEventId)} -y`,
        { encoding: "utf8", timeout: 15000 }
      );
      result.googleDeleted = true;
    } catch (err: any) {
      // Non-fatal — log the error but continue with Convex deletion
      result.googleError = err?.message ?? String(err);
    }
  }

  // ── Step 2: Delete from Convex ────────────────────────────────────────────
  try {
    await convex.mutation(api.calendar.deleteEvent, {
      id: convexId as Id<"calendarEvents">,
    });
    result.convexDeleted = true;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete from Convex", detail: err?.message, ...result },
      { status: 500 }
    );
  }

  return NextResponse.json(result);
}
