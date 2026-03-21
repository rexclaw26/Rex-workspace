// convex/agents.ts
// Agent health queries + spawn execution function

import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// ── QUERIES ────────────────────────────────────────────
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agentHealth").collect();
  },
});

export const getByCodename = query({
  args: { codename: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("agentHealth").collect();
    return all.find((a) => a.codename === args.codename);
  },
});

// ── MUTATIONS ──────────────────────────────────────────
export const updateHealth = mutation({
  args: {
    codename: v.string(),
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("degraded")
    ),
    lastPing: v.number(),
    apiCallsToday: v.optional(v.number()),
    tokensConsumed: v.optional(v.number()),
    errorRate: v.optional(v.number()),
    avgResponseMs: v.optional(v.number()),
    costToday: v.optional(v.number()),
    costMTD: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("agentHealth").collect();
    const existing = all.find((a) => a.codename === args.codename);
    if (existing) {
      const { codename, ...updates } = args;
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("agentHealth", {
        codename: args.codename,
        status: args.status,
        lastPing: args.lastPing,
        apiCallsToday: args.apiCallsToday ?? 0,
        tokensConsumed: args.tokensConsumed ?? 0,
        errorRate: args.errorRate ?? 0,
        avgResponseMs: args.avgResponseMs ?? 0,
        costToday: args.costToday ?? 0,
        costMTD: args.costMTD ?? 0,
      });
    }
  },
});

// ── ACTIONS (Agent Execution) ──────────────────────────
export const spawn = action({
  args: {
    taskId: v.id("tasks"),
    skill: v.string(),
    skillCode: v.string(),
    taskDescription: v.string(),
    agentId: v.string(),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Log execution start
    await ctx.runMutation(api.executionLog.create, {
      taskId: args.taskId,
      skill: args.skill,
      skillCode: args.skillCode,
      status: "started",
      stage: "routing",
      progress: 0,
    });

    // Update task status to Running
    await ctx.runMutation(api.tasks.updateExecution, {
      id: args.taskId,
      resultStatus: "Running",
      executionProgress: 0,
      executionStage: "routing",
    });

    try {
      // Call sessions_spawn via REX_API_URL
      const rexApiUrl = process.env.REX_API_URL;
      if (!rexApiUrl) {
        throw new Error("REX_API_URL environment variable not set");
      }

      const response = await fetch(`${rexApiUrl}/sessions/spawn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: `Execute skill "${args.skill}" for task: ${args.taskDescription}`,
          agentId: args.agentId,
          model: args.model,
        }),
      });

      if (!response.ok) {
        throw new Error(`sessions_spawn failed: ${response.statusText}`);
      }

      const data = await response.json();
      const sessionKey = data.sessionKey || data.session_key;

      // Update progress to executing
      await ctx.runMutation(api.tasks.updateExecution, {
        id: args.taskId,
        executionProgress: 25,
        executionStage: "executing",
      });

      return { sessionKey, status: "started" };
    } catch (error: any) {
      // Log failure
      await ctx.runMutation(api.executionLog.create, {
        taskId: args.taskId,
        skill: args.skill,
        skillCode: args.skillCode,
        status: "failed",
        errorMessage: error.message || "Unknown error",
        stage: "routing",
      });

      await ctx.runMutation(api.tasks.updateExecution, {
        id: args.taskId,
        resultStatus: "Failed",
        executionProgress: 0,
        executionStage: "failed",
      });

      return { error: error.message, status: "failed" };
    }
  },
});
