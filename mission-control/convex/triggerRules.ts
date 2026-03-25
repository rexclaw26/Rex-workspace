// convex/triggerRules.ts
// Trigger rule queries and mutations for auto-triggering tasks

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("triggerRules").collect();
  },
});

export const getEnabled = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("triggerRules").collect();
    return all.filter((r) => r.enabled);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    condition: v.string(),
    action: v.string(),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("triggerRules", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("triggerRules"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    condition: v.optional(v.string()),
    action: v.optional(v.string()),
    enabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const toggle = mutation({
  args: { id: v.id("triggerRules") },
  handler: async (ctx, args) => {
    const rule = await ctx.db.get(args.id);
    if (!rule) throw new Error("Trigger rule not found");
    await ctx.db.patch(args.id, {
      enabled: !rule.enabled,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("triggerRules") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
