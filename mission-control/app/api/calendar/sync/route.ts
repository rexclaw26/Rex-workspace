// app/api/calendar/sync/route.ts
// POST — One-way sync: Convex calendarEvents → Google Calendar (rex@hitnetwork.io)
// Convex is the source of truth. Never reads from Google Calendar.
//
// For each event:
//   - Has googleEventId → update the existing Google Calendar event
//   - No googleEventId  → create a new event, store returned ID in Convex

import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// ── Config ────────────────────────────────────────────────────────────────────

const CALENDAR_ID = "rex@hitnetwork.io";
const TZ          = "America/Los_Angeles";
const GOG_BIN     = "/opt/homebrew/bin/gog";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud"
);

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Convert unix milliseconds to an RFC3339 string in America/Los_Angeles.
 * e.g. "2026-03-14T10:00:00-07:00" (PDT) or "2026-12-01T10:00:00-08:00" (PST)
 *
 * Approach: format the instant twice via Intl — once as UTC wall-clock, once as
 * LA wall-clock. The difference is the UTC offset for that exact instant (handles
 * PDT/PST transitions automatically). Use the LA wall-clock as the local time.
 */
function toRFC3339(ms: number): string {
  const date = new Date(ms);

  const fmtOpts: Intl.DateTimeFormatOptions = {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  };

  const utcParts   = new Intl.DateTimeFormat("en-US", { ...fmtOpts, timeZone: "UTC" }).formatToParts(date);
  const localParts = new Intl.DateTimeFormat("en-US", { ...fmtOpts, timeZone: TZ  }).formatToParts(date);

  const getP = (parts: Intl.DateTimeFormatPart[], type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? "0");
  const getS = (parts: Intl.DateTimeFormatPart[], type: string) =>
    parts.find((p) => p.type === type)?.value ?? "00";

  // Compute offset in minutes: local - UTC wall-clock difference
  const utcMs = Date.UTC(
    getP(utcParts, "year"), getP(utcParts, "month") - 1, getP(utcParts, "day"),
    getP(utcParts, "hour"), getP(utcParts, "minute"), getP(utcParts, "second"),
  );
  const localMs = Date.UTC(
    getP(localParts, "year"), getP(localParts, "month") - 1, getP(localParts, "day"),
    getP(localParts, "hour"), getP(localParts, "minute"), getP(localParts, "second"),
  );
  const offsetMinutes = (localMs - utcMs) / 60000; // e.g. -420 for PDT, -480 for PST
  const sign          = offsetMinutes >= 0 ? "+" : "-";
  const absMin        = Math.abs(offsetMinutes);
  const offH          = String(Math.floor(absMin / 60)).padStart(2, "0");
  const offM          = String(absMin % 60).padStart(2, "0");

  // Local wall-clock parts
  const yyyy = getS(localParts, "year");
  const mm   = getS(localParts, "month");
  const dd   = getS(localParts, "day");
  let   hh   = getS(localParts, "hour");
  const min  = getS(localParts, "minute");
  const ss   = getS(localParts, "second");

  // Intl hour12:false can return "24" for midnight — normalize
  if (hh === "24") hh = "00";

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${sign}${offH}:${offM}`;
}

/**
 * Run a gog command synchronously. Returns stdout as a string.
 * Throws on non-zero exit.
 */
function runGog(args: string): string {
  return execSync(`${GOG_BIN} ${args}`, {
    encoding: "utf8",
    timeout:  15000,
  }).trim();
}

/**
 * Escape a string for safe use in a shell argument (single-quote wrapping).
 * Replaces any single quotes in the value with '\'' to avoid injection.
 */
function shellEscape(str: string): string {
  return `'${str.replace(/'/g, "'\\''")}'`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST() {
  const results = {
    synced:  0,
    created: 0,
    updated: 0,
    errors:  [] as string[],
  };

  let events: Awaited<ReturnType<typeof convex.query<typeof api.calendar.listEvents>>>;
  try {
    events = await convex.query(api.calendar.listEvents);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch events from Convex", detail: err?.message },
      { status: 500 }
    );
  }

  for (const event of events) {
    try {
      const summary = shellEscape(event.title);
      const from    = shellEscape(toRFC3339(event.start));
      const to      = shellEscape(toRFC3339(event.end));

      if (event.googleEventId) {
        // ── UPDATE existing Google Calendar event ──────────────────────────
        runGog(
          `calendar update ${shellEscape(CALENDAR_ID)} ${shellEscape(event.googleEventId)} ` +
          `--summary ${summary} --from ${from} --to ${to}`
        );
        results.updated++;
      } else {
        // ── CREATE new Google Calendar event ──────────────────────────────
        const output = runGog(
          `calendar create ${shellEscape(CALENDAR_ID)} ` +
          `--summary ${summary} --from ${from} --to ${to} -j`
        );

        // Parse the returned JSON to extract the event ID
        let googleEventId: string | null = null;
        try {
          const parsed = JSON.parse(output);
          // gog returns { id: "...", ... } or { event: { id: "..." } }
          googleEventId = parsed?.id ?? parsed?.event?.id ?? null;
        } catch {
          // Fallback: look for an id-like string in the output
          const match = output.match(/"id"\s*:\s*"([^"]+)"/);
          if (match) googleEventId = match[1];
        }

        if (googleEventId) {
          await convex.mutation(api.calendar.setGoogleEventId, {
            id:            event._id as Id<"calendarEvents">,
            googleEventId,
          });
        } else {
          results.errors.push(`Created event "${event.title}" but could not parse Google event ID from: ${output.slice(0, 200)}`);
        }

        results.created++;
      }

      results.synced++;
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      results.errors.push(`Event "${event.title}" (${event._id}): ${msg}`);
    }
  }

  return NextResponse.json(results);
}
