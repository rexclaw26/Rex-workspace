# Content Pipeline — Convex Schema & UI Spec

## Convex Schema Extension

Add to `convex/schema.ts` in Mission Control:

```typescript
contentPieces: defineTable({
  title: v.string(),
  brand: v.union(
    v.literal("discover-crypto"),
    v.literal("blockchain-basement")
  ),
  stage: v.union(
    v.literal("idea"),
    v.literal("script-writing"),
    v.literal("thumbnail"),
    v.literal("filming"),
    v.literal("editing"),
    v.literal("review"),
    v.literal("published")
  ),
  assignedTo: v.optional(v.string()),     // host/creator name
  targetPublishDate: v.optional(v.number()), // Unix timestamp
  scriptContent: v.optional(v.string()),
  scriptApproved: v.optional(v.boolean()),
  thumbnailConcepts: v.optional(v.array(v.string())), // descriptions
  thumbnailApproved: v.optional(v.boolean()),
  publishedUrl: v.optional(v.string()),
  youtubeVideoId: v.optional(v.string()),
  notes: v.optional(v.string()),
  blockerFlag: v.optional(v.boolean()),
  stageEnteredAt: v.number(),             // When current stage was entered
  createdAt: v.number(),
  updatedAt: v.number(),

  // Performance snapshots
  metrics24h: v.optional(v.object({
    views: v.number(),
    ctr: v.number(),
    fetchedAt: v.number(),
  })),
  metrics7d: v.optional(v.object({
    views: v.number(),
    avgWatchTimeSec: v.number(),
    ctr: v.number(),
    likes: v.number(),
    comments: v.number(),
    fetchedAt: v.number(),
  })),
  metrics30d: v.optional(v.object({
    views: v.number(),
    avgWatchTimeSec: v.number(),
    likes: v.number(),
    comments: v.number(),
    subscriberDelta: v.number(),
    topTrafficSource: v.string(),
    fetchedAt: v.number(),
  })),
}),
```

## Convex Functions

```typescript
// convex/content.ts
// content.list       — query all pieces, filterable by stage/brand
// content.create     — add new idea
// content.advanceStage — move to next stage, trigger auto-actions
// content.updateMetrics — store performance snapshot
// content.flagBlocker — mark a piece as stuck
```

---

## UI Component Spec

### Pipeline Board (Kanban)

```
┌──────────┬──────────────┬───────────┬──────────┬─────────┬────────┬───────────┐
│  Idea    │Script Writing│ Thumbnail │ Filming  │ Editing │ Review │ Published │
├──────────┼──────────────┼───────────┼──────────┼─────────┼────────┼───────────┤
│ [Card]   │ [Card]       │ [Card]    │ [Card]   │ [Card]  │[Card] │ [Card]    │
│ [Card]   │              │ [Card]    │          │         │       │ [Card]    │
└──────────┴──────────────┴───────────┴──────────┴─────────┴────────┴───────────┘
```

### Content Card
- Title (truncated to 2 lines)
- Brand badge (DC orange / BB purple)
- Days in current stage
- ⚠️ Blocker flag (red if stuck >5 days)
- Target publish date
- Assigned person avatar

### Content Detail Panel (click to open)
- Full title + brand
- Stage progress bar
- Script view/edit (if generated)
- Thumbnail concepts gallery
- Performance metrics (if published)
- Notes field
- Action buttons: Advance Stage | Flag Blocker | Generate Asset
