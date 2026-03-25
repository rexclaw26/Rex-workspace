// convex/executionLog.ts
// Execution log queries and mutations for tracking task execution history

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("executionLog")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .order("desc")
      .collect();
  },
});

export const getBySkill = query({
  args: { skill: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("executionLog")
      .withIndex("by_skill", (q) => q.eq("skill", args.skill))
      .order("desc")
      .collect();
  },
});

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("started"),
      v.literal("progress"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("executionLog")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    return await ctx.db
      .query("executionLog")
      .order("desc")
      .take(limit);
  },
});

export const getTotalCostMTD = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const logs = await ctx.db.query("executionLog").collect();
    return logs
      .filter((l) => l.timestamp >= startOfMonth && l.cost)
      .reduce((sum, l) => sum + (l.cost || 0), 0);
  },
});

export const create = mutation({
  args: {
    taskId: v.id("tasks"),
    skill: v.string(),
    skillCode: v.string(),
    status: v.union(
      v.literal("started"),
      v.literal("progress"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    progress: v.optional(v.number()),
    stage: v.optional(v.string()),
    result: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    duration: v.optional(v.number()),
    tokensUsed: v.optional(v.number()),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("executionLog", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("executionLog"),
    status: v.union(
      v.literal("started"),
      v.literal("progress"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    progress: v.optional(v.number()),
    stage: v.optional(v.string()),
    result: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    duration: v.optional(v.number()),
    tokensUsed: v.optional(v.number()),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});
