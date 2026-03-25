// convex/schema.ts
// Mission Control v2 — Full Convex database schema
// Extends Phase 1-5 schema with interactive execution fields + new tables

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ── TASKS (Extended from Phase 2) ────────────────────
  tasks: defineTable({
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
    googleSheetRowId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),

    // ── NEW FIELDS (v2 Interactive Execution) ──
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
    parentId: v.optional(v.id("tasks")),
    executionProgress: v.optional(v.number()),
    executionStage: v.optional(v.string()),
    chainConfig: v.optional(v.string()),
    executionHistory: v.optional(
      v.array(
        v.object({
          timestamp: v.number(),
          skill: v.string(),
          skillCode: v.string(),
          resultStatus: v.string(),
          duration: v.number(),
          tokensUsed: v.optional(v.number()),
          cost: v.optional(v.number()),
          summary: v.optional(v.string()),
        })
      )
    ),
  })
    .index("by_status", ["status"])
    .index("by_skill", ["skill"])
    .index("by_priority", ["priority"])
    .index("by_parentId", ["parentId"]),

  // ── CALENDAR EVENTS (Phase 3 — unchanged) ────────────
  calendarEvents: defineTable({
    title: v.string(),
    start: v.number(),
    end: v.number(),
    color: v.optional(v.string()),
    recurring: v.optional(v.string()),
    agentCodename: v.string(),
    googleEventId: v.optional(v.string()),
    type: v.union(
      v.literal("ops"),
      v.literal("content"),
      v.literal("meeting"),
      v.literal("deadline")
    ),
  }),

  // ── MEMORIES (Phase 4 — unchanged) ───────────────────
  memories: defineTable({
    content: v.string(),
    category: v.union(
      v.literal("decision"),
      v.literal("preference"),
      v.literal("context"),
      v.literal("lesson"),
      v.literal("contact"),
      v.literal("other")
    ),
    tags: v.array(v.string()),
    agentCodename: v.string(),
    googleDriveId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // ── AGENT HEALTH (Phase 5 — unchanged) ───────────────
  agentHealth: defineTable({
    codename: v.string(),
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("degraded")
    ),
    lastPing: v.number(),
    apiCallsToday: v.number(),
    tokensConsumed: v.number(),
    errorRate: v.number(),
    avgResponseMs: v.number(),
    costToday: v.number(),
    costMTD: v.number(),
    tailscaleIp: v.optional(v.string()),
  }),

  // ── EXECUTION LOG (NEW — v2) ─────────────────────────
  executionLog: defineTable({
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
    timestamp: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_skill", ["skill"])
    .index("by_status", ["status"]),

  // ── TRIGGER RULES (NEW — v2) ──────────────────────────
  triggerRules: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    condition: v.string(),
    action: v.string(),
    enabled: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // ── SKILL CHAINS (NEW — v2) ───────────────────────────
  skillChains: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // ── HEADLINES (Live News Feed) ────────────────────────
  // Populated every 15 min by fetchHeadlines cron action.
  // url is the deduplication key — never store the same article twice.
  //
  // Category list (Kelly's exact niches, priority-ordered):
  //   Tier 1 (always): Bitcoin | Bitcoin ETF | Gold | Macro | Institutional
  //   Tier 2 (significant): Ethereum | Silver | Legislation | Geopolitical | Solana | Coinbase
  //   Tier 3 (major only): Altcoins | DeFi | Hyperliquid | AI / Tech | Whale Activity | Markets
  //   Filtered (never stored): noise / irrelevant
  //
  // relevance: 0-10 composite score; tier 0 headlines are discarded at fetch time.
  headlines: defineTable({
    title: v.string(),
    url: v.string(),
    description: v.string(),              // cleaned RSS description — real article text only
    source: v.string(),                   // "CoinTelegraph" | "CoinDesk" | "The Block" | "Yahoo Finance" | "Bitcoin Magazine"
    category: v.string(),                 // niche category from Kelly's list
    sentiment: v.string(),                // "bullish" | "bearish" | "neutral"
    pubDate: v.number(),                  // original publish time (unix ms) — canonical for ordering
    fetchedAt: v.number(),                // when Rex fetched this
    relevance: v.optional(v.number()),    // 0-10 relevance score; used for quality filtering
    tier: v.optional(v.number()),         // 1 | 2 | 3 — topic priority tier
  })
    .index("by_pubDate", ["pubDate"])
    .index("by_url", ["url"])
    .index("by_source_pubDate", ["source", "pubDate"])
    .index("by_category_pubDate", ["category", "pubDate"]),

  // ── KNOWLEDGE BASE ────────────────────────────────────
  // marketnotes.md sections + daily market reports stored here.
  //
  // Key formats:
  //   "marketnotes"              — full file (replaced on every ingest)
  //   "marketnotes_YYYY-MM-DD"   — single date section from market-notes.md
  //   "market_report_YYYY-MM-DD" — daily HTML report (text-extracted)
  //
  // Canonical ordering: dataTimestamp comes from the document itself
  //   (the ## YYYY-MM-DD section header → midnight UTC epoch ms).
  //   Always compare dataTimestamp vs headline pubDate to decide which is newer.
  //   updatedAt is ingestion time only — NOT used for canonical ordering.
  knowledgeBase: defineTable({
    key: v.string(),                       // unique identifier
    content: v.string(),                   // full text content
    date: v.string(),                      // YYYY-MM-DD the data covers
    dataTimestamp: v.optional(v.number()), // epoch ms from doc itself (section date → midnight UTC)
    updatedAt: v.number(),                 // ingestion time — NOT canonical
  })
    .index("by_key", ["key"])
    .index("by_date", ["date"])
    .index("by_dataTimestamp", ["dataTimestamp"]),
});
