# Mission Control — Architecture

## Tech Stack

| Layer | Choice | Purpose |
|-------|--------|---------|
| Framework | Next.js 14 (App Router) | SSR + client components |
| Real-time backend | Convex | Live data sync, mutations, queries |
| Styling | Tailwind CSS | Utility-first design |
| Auth | Clerk (or Convex Auth) | Secure access, Tailscale-aware |
| Drag & drop | @dnd-kit | Kanban board interactions |
| Calendar | FullCalendar or react-big-calendar | Calendar view |
| Charts | Recharts | Agent metrics, cost dashboards |
| Icons | Lucide React | Consistent icon library |

## Project Structure

```
mission-control/
├── app/
│   ├── layout.tsx              # Root layout, Convex provider
│   ├── page.tsx                # Dashboard home / overview
│   ├── tasks/
│   │   └── page.tsx            # Kanban board
│   ├── calendar/
│   │   └── page.tsx            # Calendar view
│   ├── memory/
│   │   └── page.tsx            # Memory browser
│   ├── ops/
│   │   └── page.tsx            # Forge role-specific: AI Ops dashboard
│   └── api/
│       ├── google/
│       │   └── route.ts        # Google Workspace sync endpoints
│       └── agents/
│           └── route.ts        # Agent health ping endpoints
├── components/
│   ├── kanban/
│   │   ├── Board.tsx
│   │   ├── Column.tsx
│   │   └── Card.tsx
│   ├── calendar/
│   │   └── CalendarView.tsx
│   ├── memory/
│   │   ├── MemoryGrid.tsx
│   │   └── MemorySearch.tsx
│   └── ops/
│       ├── AgentHealthCard.tsx
│       ├── CostDashboard.tsx
│       └── AlertFeed.tsx
├── convex/
│   ├── schema.ts               # Database schema
│   ├── tasks.ts                # Task queries/mutations
│   ├── calendar.ts             # Calendar queries/mutations
│   ├── memory.ts               # Memory queries/mutations
│   └── agents.ts               # Agent health data
└── lib/
    ├── google.ts               # Google API client
    └── tailscale.ts            # Tailscale access helpers
```

## Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("in_review"),
      v.literal("done")
    ),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    agentCodename: v.string(),        // "Forge", "Nexus", etc.
    dueDate: v.optional(v.number()),  // Unix timestamp
    googleSheetRowId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  calendarEvents: defineTable({
    title: v.string(),
    start: v.number(),              // Unix timestamp
    end: v.number(),
    color: v.optional(v.string()),  // brand color coding
    recurring: v.optional(v.string()), // cron expression
    agentCodename: v.string(),
    googleEventId: v.optional(v.string()),
    type: v.union(
      v.literal("ops"),
      v.literal("content"),
      v.literal("meeting"),
      v.literal("deadline")
    ),
  }),

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

  agentHealth: defineTable({
    codename: v.string(),
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("degraded")),
    lastPing: v.number(),
    apiCallsToday: v.number(),
    tokensConsumed: v.number(),
    errorRate: v.number(),          // percentage
    avgResponseMs: v.number(),
    costToday: v.number(),          // USD
    costMTD: v.number(),            // USD
    tailscaleIp: v.optional(v.string()),
  }),
});
```

## Tailscale Access

- App runs on `localhost:3000`
- Accessible via Tailscale at `http://[machine-name]:3000`
- No public internet exposure
- Auth layer validates Tailscale IP range
