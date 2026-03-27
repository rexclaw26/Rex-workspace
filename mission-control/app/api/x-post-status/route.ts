// app/api/x-post-status/route.ts
// Status transition API for xPostQueue entries.
// Called by external systems (OpenClaw cron, generation script).
// Page uses Convex mutations directly via useMutation.
//
// POST body: { postId: string, action: "copy" | "posted" | "delete" }

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud"
);

export async function POST(request: Request) {
  // Simple shared-secret auth — prevents accidental or unauthorized queue mutations
  const secret = request.headers.get("x-mc-secret");
  if (!process.env.MC_API_SECRET || secret !== process.env.MC_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { postId: string; action: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { postId, action } = body;
  if (!postId || !action) {
    return NextResponse.json({ error: "Missing postId or action" }, { status: 400 });
  }
  if (!["copy", "posted", "delete"].includes(action)) {
    return NextResponse.json({ error: "action must be copy | posted | delete" }, { status: 400 });
  }

  const id = postId as Id<"xPostQueue">;

  try {
    if (action === "copy") {
      await convex.mutation(api.xPostQueue.updateStatus, { id, status: "copied" });
      return NextResponse.json({ ok: true, status: "copied" });
    }

    if (action === "posted") {
      await convex.mutation(api.xPostQueue.updateStatus, {
        id,
        status: "posted",
        postedAt: Date.now(),
      });
      return NextResponse.json({ ok: true, status: "posted" });
    }

    if (action === "delete") {
      await convex.mutation(api.xPostQueue.remove, { id });
      return NextResponse.json({ ok: true, deleted: true });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
