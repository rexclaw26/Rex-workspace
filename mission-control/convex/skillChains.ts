// convex/skillChains.ts
// Skill chain (workflow template) queries and mutations

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("skillChains").collect();
  },
});

export const getById = query({
  args: { id: v.id("skillChains") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    steps: v.array(
      v.object({
        skill: v.string(),
        skillCode: v.string(),
        requiresApproval: v.boolean(),
        config: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("skillChains", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("skillChains"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    steps: v.optional(
      v.array(
        v.object({
          skill: v.string(),
          skillCode: v.string(),
          requiresApproval: v.boolean(),
          config: v.optional(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("skillChains") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
