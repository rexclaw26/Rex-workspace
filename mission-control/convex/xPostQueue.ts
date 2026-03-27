// convex/xPostQueue.ts
// Queries and mutations for the X post queue.
// Table definition lives in schema.ts (xPostQueue).

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Queries ───────────────────────────────────────────────────────────────────

// All non-expired posts, newest first
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const posts = await ctx.db
      .query("xPostQueue")
      .order("desc")
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .collect();
    return posts;
  },
});

// Posts filtered by status, newest first
export const getByStatus = query({
  args: {
    status: v.union(v.literal("ready"), v.literal("copied"), v.literal("posted")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const posts = await ctx.db
      .query("xPostQueue")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .order("desc")
      .collect();
    return posts;
  },
});

// Check if a post from this author already exists today (dedup check)
export const checkDuplicate = query({
  args: {
    sourceAuthor: v.string(),
    dayStart: v.number(), // midnight UTC timestamp for today
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("xPostQueue")
      .filter((q) =>
        q.and(
          q.eq(q.field("sourceAuthor"), args.sourceAuthor),
          q.gte(q.field("createdAt"), args.dayStart)
        )
      )
      .first();
    return existing !== null;
  },
});

// ── Mutations ─────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    content: v.string(),
    format: v.union(
      v.literal("BREAKING"), v.literal("JUST IN"), v.literal("DATA"),
      v.literal("WATCHING"), v.literal("SIGNAL"), v.literal("THREAD")
    ),
    category: v.union(
      v.literal("btcEth"), v.literal("macro"), v.literal("altcoins"),
      v.literal("legislation"), v.literal("onchain")
    ),
    score: v.number(),
    sourceType: v.union(v.literal("x"), v.literal("market")),
    sourceAuthor: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("xPostQueue", {
      ...args,
      status: "ready",
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000, // 24h TTL
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("xPostQueue"),
    status: v.union(v.literal("ready"), v.literal("copied"), v.literal("posted")),
    postedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = { status: args.status };
    if (args.postedAt !== undefined) patch.postedAt = args.postedAt;
    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("xPostQueue") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
