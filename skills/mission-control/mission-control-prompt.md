# Mission Control Dashboard — Build Prompt

**Build a complete operational dashboard for Hit Network's AI Digital Employees.**

## Objective

Create a production-ready, locally-hosted Next.js dashboard that serves as the central command center for managing AI agents, tasks, costs, and knowledge base. The app should be accessible via Tailscale VPN and provide real-time insights into AI operations.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (via Prisma)
- **UI Components:** Shadcn/ui + Headless UI
- **Icons:** Lucide React
- **State:** React Query (TanStack Query) for data fetching
- **Charts:** Recharts
- **Deployment:** Local (localhost:3000), accessible via Tailscale
- **Build Location:** `/Users/rex/.openclaw/workspace/mission-control`

## Project Structure

```
mission-control/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Dashboard home)
│   ├── tasks/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── agents/
│   │   ├── page.tsx (Agent health monitor)
│   │   └── [id]/page.tsx
│   ├── costs/
│   │   └── page.tsx (Cost tracking dashboard)
│   ├── memory/
│   │   ├── page.tsx (Knowledge base browser)
│   │   └── search/
│   │       └── page.tsx
│   ├── calendar/
│   │   └── page.tsx (Recurring tasks & events)
│   └── api/
│       ├── tasks/
│       ├── agents/
│       ├── costs/
│       └── memory/
├── components/
│   ├── ui/ (Shadcn components)
│   ├── tasks/ (TaskBoard, TaskCard, TaskForm)
│   ├── agents/ (AgentHealth, AgentStats)
│   ├── costs/ (CostChart, SpendTable)
│   ├── memory/ (MemorySearch, MemoryCard)
│   └── calendar/ (CalendarView, EventForm)
├── lib/
│   ├── db.ts (SQLite connection)
│   ├── queries.ts (Data access layer)
│   └── utils.ts
├── prisma/
│   └── schema.prisma (Database schema)
├── scripts/
│   └── seed.ts (Initial data setup)
├── public/
└── package.json
```

## Database Schema (Prisma)

Create `prisma/schema.prisma` with these models:

**Agent Model:**
- id: String (cuid, primary key)
- name: String
- codename: String (optional)
- model: String (e.g., "anthropic/claude-sonnet-4-6")
- status: String ("active" | "inactive" | "error")
- uptime: Float (default 0)
- lastSeen: DateTime (default now())
- createdAt/updatedAt: DateTime (default now())
- relationships: Task[], Cost[], Memory[]

**Task Model:**
- id: String (cuid, primary key)
- title: String
- description: String (optional)
- status: String ("todo" | "in_progress" | "in_review" | "done")
- priority: String ("low" | "medium" | "high" | "urgent")
- dueDate: DateTime (optional)
- assignedTo: String (optional, agent name)
- createdAt/updatedAt: DateTime (default now())
- relationship: Agent? (optional)

**Cost Model:**
- id: String (cuid, primary key)
- date: DateTime (default now())
- agent: String
- provider: String ("anthropic" | "openrouter" | "claude-max" | "other")
- amount: Float
- category: String ("api" | "subscription" | "hosting" | "other")
- description: String (optional)
- createdAt: DateTime (default now())

**Memory Model:**
- id: String (cuid, primary key)
- title: String
- content: String
- category: String ("decision" | "lesson" | "context" | "reference" | "todo")
- tags: String[] (array)
- createdAt/updatedAt: DateTime (default now())

## UI Components — Build These

### 1. Dashboard Home (`app/page.tsx`)
- Header: "Mission Control — Hit Network AI Operations"
- Quick stats grid (4 cards): Agents Online, Active Tasks, Weekly Spend, Errors This Week
- Left column (70%): Tasks Board (Kanban) + Recent Activity Feed
- Right column (30%): Agent Health Overview + Quick Actions

### 2. Tasks Board (`app/tasks/page.tsx`)
- Columns: To Do (gray), In Progress (blue), In Review (yellow), Done (green)
- Cards show: Title, Priority badge, Due date, Assigned agent, Created date
- Click card → opens detailed view
- Drag & drop to change status (use @dnd-kit)
- Filter by: Status, Priority, Assigned Agent, Date Range

### 3. Agent Health Monitor (`app/agents/page.tsx`)
- Grid of agent cards (2x3):
  - Agent name + codename
  - Current model
  - Status indicator (🟢/🟡/🔴)
  - Uptime % (last 24h)
  - API calls today
  - Last seen timestamp
  - Error count (today)
- Click agent → opens detail view

### 4. Cost Tracking Dashboard (`app/costs/page.tsx`)
- Summary cards: Total Spend (MTD), Budget Remaining, Projected Monthly Spend, Top Expense Category
- Charts: Line chart (daily spend), Bar chart (by provider), Pie chart (by category)
- Table: All cost entries with sortable columns and export to CSV
- Budget alerts if > 80% used

### 5. Memory/Knowledge Base (`app/memory/page.tsx`)
- Search bar (full-text search)
- Filter by category and tags
- Memory cards show: Title, Category badge, Tags (up to 3), Created date, Excerpt
- Click card → opens full view with edit/delete buttons

### 6. Calendar View (`app/calendar/page.tsx`)
- Full calendar (month view, week/day toggle)
- Color-coded by category (Red: Ops, Blue: Content, Green: Dev, Yellow: Strategic)
- Click date → shows events for that day
- Add event modal with: Title, Date/time, Category, Description, Recurrence

### 7. API Routes
- `/api/tasks`: GET all, POST create
- `/api/tasks/[id]`: GET, PATCH, DELETE
- `/api/agents`: GET all with health, GET single
- `/api/costs`: GET all with filters, POST create
- `/api/memory`: GET all with search/filters, POST/PATCH/DELETE
- `/api/calendar`: GET all, POST create

## Styling Guidelines
- **Colors:** Primary: Blue-600, Success: Green-500, Warning: Yellow-500, Error: Red-500, Background: Gray-50, Cards: White
- **Typography:** Headings: Inter-600, Body: Inter-400, Code: JetBrains Mono
- **Spacing:** 4px units base, 16px card padding, 24px section gaps
- **Responsive:** Mobile (single column), Tablet (2 columns), Desktop (3-4 columns)

## Security
- Local-only, no authentication for now
- All data stored locally (SQLite)
- No external API calls unless explicitly triggered
- Document Tailscale-only access

## Initial Data Seeding
Create `scripts/seed.ts` with:

**6 Agents:**
1. Rex — Head of AI & Product Development
2. Content Agent — Article & Video Production
3. Social Agent — X/Twitter Automation
4. Analytics Agent — Discord & Web Data
5. Finance Agent — Invoicing & Cost Tracking
6. Ops Agent — System Monitoring & Maintenance

**3 Costs:**
- Claude Max: $200/month (2026-03-01)
- Anthropic: $25 credit (2026-03-02)
- OpenRouter: $20 credit (2026-03-02)

**4 Memories:**
- Calibration questionnaire answers
- Cost tracking baseline
- Error journal setup
- 90-Day Rocks (Q1 priorities)

## Deliverables
- [ ] Next.js 15 app scaffolded with TypeScript + Tailwind
- [ ] Prisma schema defined and migrated
- [ ] All 6 UI pages built and styled
- [ ] All API routes implemented
- [ ] Database seeded with initial data
- [ ] README.md with setup instructions
- [ ] Responsive and accessible UI

## Build Instructions

**Step 1:** Create project at `/Users/rex/.openclaw/workspace/mission-control`

**Step 2:** Install dependencies:
```bash
npm create next-app@latest . -- --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
npm install prisma --save-dev
npm install @prisma/client
npm install @dnd-kit/core @dnd-kit/sortable
npm install recharts
npm install @tanstack/react-query
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
```

**Step 3:** Initialize Prisma:
```bash
npx prisma init
# Then create schema.prisma with the models above
npx prisma migrate dev --name init
```

**Step 4:** Build all pages, components, and API routes

**Step 5:** Create seed script and run `npm run seed`

**Step 6:** Test at `http://localhost:3000`

---

**Start building now. Ask questions if requirements are unclear.**

---

END OF PROMPT
