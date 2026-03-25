// convex/tasks.ts
// Task queries and mutations — extended for v2 interactive execution

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── QUERIES ────────────────────────────────────────────
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status as any))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getSubtasks = query({
  args: { parentId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_parentId", (q) => q.eq("parentId", args.parentId))
      .collect();
  },
});

export const getCompletedCount = query({
  args: {},
  handler: async (ctx) => {
    const done = await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", "done"))
      .collect();
    return done.length;
  },
});

export const getTotalCount = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tasks").collect();
    return all.length;
  },
});

export const getIncomplete = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tasks").collect();
    return all.filter((t) => t.status !== "done");
  },
});

export const getCompleted = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", "done"))
      .collect();
  },
});

// ── MUTATIONS ──────────────────────────────────────────
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("in_review"),
      v.literal("done")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    agentCodename: v.string(),
    dueDate: v.optional(v.number()),
    skill: v.optional(v.string()),
    skillCode: v.optional(v.string()),
    parentId: v.optional(v.id("tasks")),
    chainConfig: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("tasks", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("in_review"),
        v.literal("done")
      )
    ),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      )
    ),
    skill: v.optional(v.string()),
    skillCode: v.optional(v.string()),
    result: v.optional(v.string()),
    resultStatus: v.optional(
      v.union(
        v.literal("Completed"),
        v.literal("Failed"),
        v.literal("NeedsReview"),
        v.literal("Running"),
        v.literal("Cancelled")
      )
    ),
    notes: v.optional(v.string()),
    executionProgress: v.optional(v.number()),
    executionStage: v.optional(v.string()),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("in_review"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const updateExecution = mutation({
  args: {
    id: v.id("tasks"),
    resultStatus: v.optional(
      v.union(
        v.literal("Completed"),
        v.literal("Failed"),
        v.literal("NeedsReview"),
        v.literal("Running"),
        v.literal("Cancelled")
      )
    ),
    result: v.optional(v.string()),
    executionProgress: v.optional(v.number()),
    executionStage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const addExecutionHistory = mutation({
  args: {
    id: v.id("tasks"),
    entry: v.object({
      timestamp: v.number(),
      skill: v.string(),
      skillCode: v.string(),
      resultStatus: v.string(),
      duration: v.number(),
      tokensUsed: v.optional(v.number()),
      cost: v.optional(v.number()),
      summary: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    const history = task.executionHistory || [];
    history.push(args.entry);
    await ctx.db.patch(args.id, {
      executionHistory: history,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
