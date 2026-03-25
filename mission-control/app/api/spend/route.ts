// app/api/spend/route.ts
// Reads /Users/rex/.openclaw/workspace/ai-spend.json and returns aggregated spend data.
// Called by the Ops page to display real AI cost tracking.
//
// No cache — file is small and always needs to reflect latest appended receipts.

import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const SPEND_FILE = join(process.env.HOME || "/Users/rex", ".openclaw/workspace/ai-spend.json");

export interface SpendEntry {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  date: string;       // YYYY-MM-DD
  month: string;      // YYYY-MM
  description: string;
  invoiceId: string;
  receiptId: string;
  paymentLast4: string;
  source: string;
  addedAt: string;
}

export interface SpendSummary {
  entries: SpendEntry[];
  totalAll: number;
  byProvider: Record<string, number>;
  byMonth: Record<string, number>;           // month → total
  byProviderMonth: Record<string, Record<string, number>>; // provider → month → total
  currentMonth: string;                      // YYYY-MM
  currentMonthTotal: number;
}

export async function GET() {
  try {
    const raw = readFileSync(SPEND_FILE, "utf-8");
    const data: { entries: SpendEntry[] } = JSON.parse(raw);
    const entries = data.entries ?? [];

    // Current month in Pacific Time
    const currentMonth = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Los_Angeles",
    }).slice(0, 7); // YYYY-MM

    // Aggregate
    let totalAll = 0;
    const byProvider: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    const byProviderMonth: Record<string, Record<string, number>> = {};

    for (const e of entries) {
      totalAll += e.amount;

      byProvider[e.provider] = (byProvider[e.provider] ?? 0) + e.amount;

      byMonth[e.month] = (byMonth[e.month] ?? 0) + e.amount;

      if (!byProviderMonth[e.provider]) byProviderMonth[e.provider] = {};
      byProviderMonth[e.provider][e.month] =
        (byProviderMonth[e.provider][e.month] ?? 0) + e.amount;
    }

    const currentMonthTotal = byMonth[currentMonth] ?? 0;

    const summary: SpendSummary = {
      entries: entries.sort((a, b) => b.date.localeCompare(a.date)), // newest first
      totalAll: Math.round(totalAll * 100) / 100,
      byProvider,
      byMonth,
      byProviderMonth,
      currentMonth,
      currentMonthTotal: Math.round(currentMonthTotal * 100) / 100,
    };

    return NextResponse.json({ ok: true, ...summary });
  } catch (err: any) {
    // File missing or malformed — return empty state (not an error in the UI)
    return NextResponse.json({
      ok: true,
      entries: [],
      totalAll: 0,
      byProvider: {},
      byMonth: {},
      byProviderMonth: {},
      currentMonth: new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" }).slice(0, 7),
      currentMonthTotal: 0,
      _note: "ai-spend.json not found or empty",
    });
  }
}
