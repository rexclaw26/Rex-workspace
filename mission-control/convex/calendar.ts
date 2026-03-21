// convex/calendar.ts
// Calendar event queries and mutations for Mission Control.
// Supports Google Calendar one-way push sync (Convex → Google Calendar).

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── QUERIES ────────────────────────────────────────────

/** Return all calendar events. Used by the sync API route. */
export const listEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("calendarEvents").collect();
  },
});

// ── MUTATIONS ──────────────────────────────────────────

/**
 * Store the Google Calendar event ID on a calendarEvent after creation.
 * Called by the sync route after successfully creating a Google Calendar event.
 */
export const setGoogleEventId = mutation({
  args: {
    id: v.id("calendarEvents"),
    googleEventId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { googleEventId: args.googleEventId });
  },
});

/**
 * Create or update a calendar event.
 * If `id` is provided, patches the existing record.
 * Otherwise, inserts a new one.
 */
export const upsertEvent = mutation({
  args: {
    id:             v.optional(v.id("calendarEvents")),
    title:          v.string(),
    start:          v.number(),
    end:            v.number(),
    color:          v.optional(v.string()),
    recurring:      v.optional(v.string()),
    agentCodename:  v.string(),
    googleEventId:  v.optional(v.string()),
    type: v.union(
      v.literal("ops"),
      v.literal("content"),
      v.literal("meeting"),
      v.literal("deadline")
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    if (id) {
      await ctx.db.patch(id, fields);
      return id;
    }
    return await ctx.db.insert("calendarEvents", fields);
  },
});

/**
 * Delete a calendar event by Convex ID.
 * The API route handles Google Calendar deletion separately before calling this.
 */
export const deleteEvent = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
