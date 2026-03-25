# Mission Control — Step-by-Step Build Guide

Get approval at each phase before starting the next.

---

## Phase 1: Scaffold

```bash
# Create Next.js app
npx create-next-app@latest mission-control --typescript --tailwind --app

# Install Convex
cd mission-control
npm install convex
npx convex dev  # initializes project, creates convex/ directory

# Install UI dependencies
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install lucide-react
npm install recharts
npm install @clerk/nextjs  # or convex auth
```

**Deliverable:** Running Next.js app at localhost:3000 with Convex connected and live-reloading.

---

## Phase 2: Tasks Board (Kanban)

**Columns:** To Do | In Progress | In Review | Done

**Features:**
- Drag and drop cards between columns (dnd-kit)
- Card: title, priority badge, due date, agent tag
- Add task modal: title, description, priority, due date
- Real-time updates via Convex subscriptions
- Filter by agent codename

**Convex functions needed:**
- `tasks.list` — query all tasks (filterable by status/agent)
- `tasks.create` — mutation to add new task
- `tasks.updateStatus` — mutation on drag drop
- `tasks.update` — edit task details

---

## Phase 3: Calendar View

**Features:**
- Month, week, day views
- Color-coded by event type: ops (blue) · content (orange) · meeting (purple) · deadline (red)
- Recurring events displayed with repeat indicator
- Click event → detail panel
- Add event modal

**Convex functions needed:**
- `calendar.listRange` — query events between two timestamps
- `calendar.create` — create event
- `calendar.update` — edit event

---

## Phase 4: Memory Screen

**Features:**
- Grid/list of memory entries
- Search bar (full-text across content + tags)
- Filter by category: decision · preference · context · lesson · contact · other
- Add memory modal
- Click to expand full entry

**Convex functions needed:**
- `memory.list` — query memories (filterable)
- `memory.search` — text search
- `memory.create` — add memory
- `memory.update` — edit entry

---

## Phase 5: Role-Specific Component (Forge — AI Ops)

**Forge dashboard components:**

| Component | Data |
|-----------|------|
| Agent Health Grid | 6 cards, one per agent: status, last ping, error rate |
| Cost Dashboard | Per-agent spend today / MTD / projected |
| Skill Deployment Pipeline | Current skill deploy status per agent |
| Alert Feed | Real-time security events, downtime, budget alerts |

**Agent health updates:** Pinged every 5 minutes via Tailscale. Status auto-updates in Convex.

---

## Phase 6: Google Workspace Sync

See [google-sync.md](google-sync.md) for full OAuth and sync implementation.

**Sync mappings:**
- Tasks ↔ Google Sheets (append/update rows)
- Calendar ↔ Google Calendar (two-way sync)
- Memory → Google Drive (markdown files per entry)

---

## Testing Checklist (Each Phase)

- [ ] Real-time updates work (open two tabs, change in one, see in other)
- [ ] Mobile responsive (even if primary use is desktop)
- [ ] No console errors
- [ ] Auth working — only accessible to authorized users
- [ ] Tailscale access confirmed from another device
