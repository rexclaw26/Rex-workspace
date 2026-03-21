# Mission Control Builder Prompt
## Build Your Own AI Operations Command Center

---

This prompt builds a Mission Control dashboard for your AI agent system. It reads your existing OpenClaw workspace files to understand who your agent is, what skills they have, and what your business looks like. Then it builds a dashboard that's yours from the start. No forms to fill out. No manual setup steps.

---

## PART 1: Auto-Read Your Workspace

**Before writing a single line of code, read these files from the OpenClaw workspace:**

```
SOUL.md          — your agent's personality, vibe, and operating principles
IDENTITY.md      — agent name, role, emoji, avatar
USER.md          — who you're helping, their name, timezone, preferences, title
MEMORY.md        — long-term context, active projects, standing rules, brand data
AGENTS.md        — operational laws, enforcement rules, task protocols
skills/*/SKILL.md — every installed skill: what it does, what it triggers on
```

**From those files, extract and confirm:**
- Agent name and codename
- User's name, company, and business context
- Full skill list with categories (group into: content / analytics / technical / admin)
- Any sub-agents or specialized agent roles mentioned
- Quarterly goals or priorities (look for "Rocks", "OKRs", "Q goals", or similar)
- Brand preferences (accent colors, tone, naming conventions)
- Any data sources already wired up (price feeds, news pipelines, spend tracking, social feeds)
- Access method (Tailscale IP if mentioned, local network, or cloud)

**Then confirm what you found before building. Output a brief summary like:**

```
Found in workspace:
- Agent: [Name] — [role]
- User: [Name] at [Company]
- Skills: [X total] across [categories]
- Sub-agents: [list or "none defined"]
- Quarterly goals: [list or "not found"]
- Accent color: [color if specified, else "will use orange #F97316 as default"]
- Data sources: [list what's already wired]
- Access: [Tailscale / local / cloud]

Ready to build. Proceeding to Step 2.
```

If any critical info is missing (agent name, skills), ask for just that — one focused question, not the full form. Everything else defaults gracefully.

---

## PART 2: The Tech Stack

**Required dependencies:**
```bash
npx create-next-app@latest mission-control --typescript --tailwind --app
cd mission-control
npm install convex lucide-react
npx convex login    # creates your free Convex account if you don't have one
npx convex dev      # initializes the project and keeps the backend running — leave this open in a separate terminal
```

**Stack:**
- **Next.js 14+** (App Router): the framework
- **Convex**: real-time backend + database (tasks sync live without a refresh)
- **Tailwind CSS v4**: utility styles
- **TypeScript**: required, not optional
- **Lucide React**: icons throughout the UI

**One required setup step:** After running `npx convex dev`, create `app/ConvexClientProvider.tsx`:
```typescript
"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```
Convex will add `NEXT_PUBLIC_CONVEX_URL` to your `.env.local` automatically when you run `npx convex dev`.

---

## PART 3: Design System, Paste This First

The entire look and feel lives in `app/globals.css`. This is the foundation. Swap `--accent` for your brand color if you chose something other than orange.

```css
/* app/globals.css — Mission Control */
@import "tailwindcss";

:root {
  /* Background palette — deep navy */
  --bg-base:       #080E1C;
  --bg-primary:    #0B1325;
  --bg-secondary:  #0F1A30;
  --bg-card:       rgba(13, 22, 42, 0.85);
  --bg-elevated:   #152038;
  --bg-modal:      #0D1B33;

  /* Accent color — change this to your brand color */
  --accent:        #F97316;
  --accent-bright: #FB923C;
  --accent-dim:    rgba(249, 115, 22, 0.12);
  --accent-glow:   rgba(249, 115, 22, 0.25);
  --accent-border: rgba(249, 115, 22, 0.35);

  /* Text */
  --text-primary:  #E8DDD0;
  --text-taupe:    #C9B99A;
  --text-muted:    #6E7A90;
  --text-accent:   var(--accent);

  /* Status colors */
  --green:  #22C55E;
  --red:    #EF4444;
  --amber:  #F59E0B;
  --blue:   #3B82F6;

  /* Borders */
  --border-card:   rgba(255, 255, 255, 0.07);
  --border-hover:  rgba(249, 115, 22, 0.35);
  --border-active: rgba(249, 115, 22, 0.6);
  --border-subtle: rgba(255, 255, 255, 0.04);

  /* Fonts */
  --font-display: 'JetBrains Mono', monospace;
  --font-body:    'Outfit', sans-serif;
  --font-data:    'Share Tech Mono', monospace;

  --sidebar-width: 220px;
}

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; font-family: var(--font-body); color: var(--text-primary); -webkit-font-smoothing: antialiased; overflow: hidden; }

/* Background */
.mission-bg {
  min-height: 100vh;
  background-color: var(--bg-base);
  background-image:
    radial-gradient(ellipse 60% 50% at 85% 95%, rgba(249,115,22,0.06) 0%, transparent 70%),
    radial-gradient(ellipse 70% 50% at 10% 5%, rgba(59,130,246,0.06) 0%, transparent 70%),
    radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(160deg, #0B1325 0%, #080E1C 50%, #0A1020 100%);
  background-size: 100% 100%, 100% 100%, 28px 28px, 100% 100%;
}

/* Cards */
.mc-card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-card);
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
}
.mc-card:hover {
  border-color: var(--border-hover);
  box-shadow: 0 0 24px rgba(249,115,22,0.08), 0 4px 24px rgba(0,0,0,0.4);
  transform: translateY(-1px);
}

/* Sidebar */
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background: rgba(8,14,28,0.92);
  border-right: 1px solid var(--border-subtle);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Typography */
.page-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.text-label {
  font-family: var(--font-data);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Skill pills */
.skill-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-family: var(--font-data);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter 0.15s;
  border: 1px solid transparent;
}
.skill-pill-content   { background: rgba(249,115,22,0.1);  color: #FB923C; border-color: rgba(249,115,22,0.2);  }
.skill-pill-analytics { background: rgba(59,130,246,0.1);  color: #60A5FA; border-color: rgba(59,130,246,0.2);  }
.skill-pill-technical { background: rgba(34,197,94,0.1);   color: #4ADE80; border-color: rgba(34,197,94,0.2);   }
.skill-pill-admin     { background: rgba(168,85,247,0.1);  color: #C084FC; border-color: rgba(168,85,247,0.2);  }
.skill-pill.selected  { filter: brightness(1.3); font-weight: 700; }

/* Launch button */
.btn-launch {
  padding: 5px 12px;
  border-radius: 6px;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(249,115,22,0.1);
  border: 1px solid rgba(249,115,22,0.3);
  color: var(--accent);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-launch:hover { background: rgba(249,115,22,0.18); border-color: rgba(249,115,22,0.5); }

/* Status dot */
.dot-online {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 6px var(--green);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 6px var(--green); }
  50%       { box-shadow: 0 0 12px var(--green); }
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-panel {
  width: 100%; max-width: 540px; max-height: 85vh;
  overflow-y: auto;
  background: var(--bg-modal);
  border: 1px solid var(--border-card);
  border-radius: 16px;
}

/* Approval gate banner */
.gate-banner {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 14px; border-radius: 10px;
  background: rgba(249,115,22,0.06);
  border: 1px solid rgba(249,115,22,0.2);
}

/* Animations */
@keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.3s ease forwards; }
@keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-up { animation: fade-up 0.25s ease forwards; }

/* Scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(249,115,22,0.4); }
```

Add Google Fonts to your `app/layout.tsx` head:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" />
```

---

## PART 4: Convex Backend

**`convex/schema.ts`:**
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title:         v.string(),
    description:   v.string(),
    skill:         v.string(),
    skillCode:     v.string(),
    agentCodename: v.string(),
    priority:      v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    status:        v.union(v.literal("todo"), v.literal("in_progress"), v.literal("in_review"), v.literal("done")),
    notes:         v.optional(v.string()),
    createdAt:     v.number(),
    updatedAt:     v.number(),
  })
  .index("by_status", ["status"])
  .index("by_agent", ["agentCodename"]),
});
```

**`convex/tasks.ts`:**
```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("tasks").order("desc").collect(),
});

export const create = mutation({
  args: {
    title: v.string(), description: v.string(),
    skill: v.string(), skillCode: v.string(),
    agentCodename: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("in_review"), v.literal("done")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("tasks", { ...args, createdAt: now, updatedAt: now });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("in_review"), v.literal("done")),
  },
  handler: async (ctx, args) =>
    ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() }),
});
```

---

## PART 5: Your Skill Registry

**`config/skill-registry.ts`**, replace the examples with YOUR skills from Part 1.

```typescript
export type SkillCategory = "content" | "analytics" | "technical" | "admin";

export interface SkillEntry {
  code:        string;        // short kebab-case id
  displayName: string;        // what shows on skill pills in the UI
  fullName:    string;        // full name for task records
  category:    SkillCategory;
  exposed:     boolean;       // false = internal, won't show in Task Launcher
  description: string;        // one sentence
}

// ── YOUR SKILLS GO HERE ───────────────────────────────────────────────────
// Replace these examples with the skills you listed in Part 1.
export const SKILL_REGISTRY: Record<string, SkillEntry> = {
  // CONTENT
  "email": {
    code: "email", displayName: "Email", fullName: "Email Assistant",
    category: "content", exposed: true,
    description: "Draft and manage email communications",
  },
  "x-post": {
    code: "x-post", displayName: "X Post", fullName: "X Post Writer",
    category: "content", exposed: true,
    description: "Write and schedule X posts",
  },
  // ANALYTICS
  "financial": {
    code: "financial", displayName: "Finance", fullName: "Financial Analysis",
    category: "analytics", exposed: true,
    description: "P&L, forecasting, modeling",
  },
  // TECHNICAL
  "website": {
    code: "website", displayName: "Website", fullName: "Website Design",
    category: "technical", exposed: true,
    description: "Build and maintain web properties",
  },
  // ADMIN
  "scheduling": {
    code: "scheduling", displayName: "Scheduling", fullName: "Scheduling Optimizer",
    category: "admin", exposed: true,
    description: "Manage calendar and time blocks",
  },
  // Add all your skills here — one entry per skill
};

export function getExposedSkills() {
  return Object.values(SKILL_REGISTRY).filter((s) => s.exposed);
}

export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  content: "skill-pill-content",
  analytics: "skill-pill-analytics",
  technical: "skill-pill-technical",
  admin: "skill-pill-admin",
};

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  content: "Content",
  analytics: "Analytics",
  technical: "Technical",
  admin: "Admin",
};
```

---

## PART 6: Your Agent Roster

In `app/page.tsx`, define your agents. Replace these examples with the agents from Part 1.

```typescript
// Rules for defining agents:
// - skillCodes: undefined  → this agent sees ALL skills (use for your primary agent only)
// - skillCodes: ["email", "x-post"]  → this agent only sees these skills in the Task Launcher
// - status: "active" means the agent is configured and usable
// - statusLabel: use "Online" only for agents with a live session; use "Configured" for sub-agents

const AGENTS = [
  {
    id: "primary",
    name: "[Your Agent Name]",          // e.g., "Rex", "Atlas", "Nova"
    owner: "Primary Agent",
    role: "[What this agent does]",     // e.g., "Full-Stack AI Operations"
    model: "Claude Sonnet 4.6",         // or whichever model you use
    status: "active" as const,
    skills: 12,                         // total number of skills in your registry
    categories: ["content", "analytics", "technical", "admin"],
    skillCodes: undefined,              // undefined = access to ALL skills
  },
  // Example sub-agent — duplicate this block for each additional agent
  // {
  //   id: "writer",
  //   name: "Writer",
  //   owner: "Content Pipeline",
  //   role: "Articles · Email · Social",
  //   model: "Claude Sonnet 4.6",
  //   status: "active" as const,
  //   skills: 3,
  //   categories: ["content"],
  //   skillCodes: ["email", "x-post", "article"],  // only these skills show in their launcher
  // },
];
```

---

## PART 7: Core Layout

**`app/layout.tsx`** structure:
```typescript
// Wrap everything in ConvexClientProvider + Sidebar
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>{ /* Google Fonts links here */ }</head>
      <body className="mission-bg">
        <ConvexClientProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

**`components/layout/Sidebar.tsx`**, define your nav items. Each needs: `label`, `href`, `icon` (from lucide-react), and `abbr` (single letter for mobile collapsed view).

Nav collapses to icon-only on mobile. Active state = orange left border + subtle orange background.

---

## PART 8: Task Launcher Modal

**`components/tasks/TaskLauncher.tsx`**, the modal that fires from every agent card's "Launch Task" button.

It does four things:
1. Shows only the skills assigned to that specific agent (from `skillCodes`)
2. Groups skills by category with colored pills
3. Requires a description and at least one skill selected
4. Shows an **Approval Gate**, a checkbox the user must tick before launch is allowed. This enforces human-in-the-loop before anything external happens.

On submit, it writes to Convex with: title, description, skill, agent name, priority, status=`"todo"`.

The approval gate looks like this and can't be bypassed:
```
⚙ Approval Gate: Human review required before any external action
(emails, posts, financial operations)
[ ] I'll review the output before anything goes external
```

---

## PART 9: Dashboard Page Structure

**Desktop (3-column grid):**
- Left 2/3: Agent card grid (2 columns)
- Right 1/3: Task queue, Recent activity, Quarterly goals

**Mobile (accordion):**
- Header with live price mini-cards (if you have a price feed)
- Accordion sections: Agents | Task Queue | Activity | Goals
- Sidebar collapses to 40px icon-only nav

**Stat cards row (always visible, top of page):**
- Agents configured
- Active + queued task count (live from Convex)
- MTD AI spend (from `/api/spend`, if you set up spend tracking)
- Errors logged (manual count from your error journal)

**Mobile detection hook, use this everywhere:**
```typescript
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}
```

---

## PART 10: Task Kanban Board

**`app/tasks/page.tsx`**, 4 columns: To Do | In Progress | In Review | Done

Tasks update in real-time via Convex. Cards show: title, agent name, skill, priority dot, last updated. Drag-and-drop is optional, status can also update via a dropdown on each card.

---

## PART 11: Operations Page

**`app/ops/page.tsx`**, your system health and spend dashboard.

Sections to include:
- **AI Spend**, reads from `ai-spend.json` via `/api/spend`. Show MTD total and per-provider breakdown.
- **Skill Status**, maps your skill registry, one card per skill, shows status
- **System Health**, known facts only (TypeScript errors, email authentication status, etc.)
- **Quarterly Goals**, your Rocks with progress bars. Mark as "User input needed" until you update them each week.

---

## PART 12: Memory Page

**`app/memory/page.tsx`**, a searchable browser of your agent's memory files.

Reads via `/api/memory` route. Shows `MEMORY.md`, daily logs, session handoffs. Renders markdown. Search filters by filename or content.

---

## PART 13: AI Spend Tracker (Recommended)

Create `workspace/ai-spend.json` with empty entries:
```json
{ "entries": [] }
```

Create `/api/spend/route.ts` that reads this file and returns:
- MTD total
- Per-provider breakdown
- Full entry list

Each entry follows this structure:
```json
{
  "id": "receipt-[id]",
  "provider": "Anthropic",
  "amount": 50.00,
  "currency": "USD",
  "date": "2026-03-06",
  "month": "2026-03",
  "description": "One-time credit purchase",
  "invoiceId": "",
  "receiptId": "2120-3424-1548",
  "paymentLast4": "7317",
  "source": "receipt-email",
  "addedAt": "2026-03-08T19:50:57.000Z"
}
```

If you have a Gmail hook, wire it to auto-parse Anthropic and OpenRouter receipts into this file automatically.

---

## PART 14: Mobile Responsiveness

**Two key patterns:**

**1. Accordion sections on mobile:**
Wrap each dashboard panel (agents, tasks, activity, goals) in an accordion toggle. Only one open at a time. Active accordion gets orange border + orange text.

**2. Sidebar icon-only collapse:**
On screens under 768px, hide the full label nav and show only 40x40px icon buttons with single-letter abbreviations. The green status dot at the bottom stays centered.

---

## PART 15: Data Integrity Rules

These prevent a dashboard full of made-up numbers.

1. **Never hardcode a metric that should be dynamic.** If spend isn't tracked yet, show "Not configured", not a guessed figure.
2. **No ratio format (X/Y) or progress bars for static data.** If the denominator is hardcoded, don't use a progress bar.
3. **Mark user-required inputs clearly.** Quarterly goal percentages need your input each week, show a "User input needed" badge until provided.
4. **Status badges reflect real state only.** Don't show "Online" for agents without a live heartbeat. Show "Configured" instead.
5. **Every stat card must have a documented data source.** Add a comment at the top of the file naming the source for each number displayed.

---

## PART 16: Optional Pages

Add these if they match your workflow:

| Page | Route | What It Does |
|------|-------|--------------|
| Headlines | `/headlines` | News aggregation feed with category tags, sentiment, and tier scoring |
| Social Feed | `/social-feed` | Monitor social accounts via RSS adapter (works with X, Reddit, etc.) |
| Calendar | `/calendar` | Task scheduling with email invite capability |
| Decks | `/decks` | Host and view slide decks built by your agent |

---

## PART 17: Build Order

Do these in sequence. Don't skip ahead.

```
1.  Create Next.js project + install dependencies
2.  Run: npx convex dev (keep running in separate terminal)
3.  Paste globals.css design system
4.  Add Google Fonts to layout.tsx
5.  Create convex/schema.ts + convex/tasks.ts
6.  Create config/skill-registry.ts with YOUR skills
7.  Build app/layout.tsx (root layout)
8.  Build components/layout/Sidebar.tsx with YOUR nav items
9.  Build components/tasks/TaskLauncher.tsx (skill modal)
10. Build app/page.tsx (Dashboard) with YOUR agents
11. Build app/tasks/page.tsx (Kanban board)
12. Build app/ops/page.tsx (Operations)
13. Build app/memory/page.tsx (Memory browser)
14. Create ai-spend.json + /api/spend route (if tracking spend)
15. Add optional pages as needed
16. Test on mobile: verify accordion nav and sidebar collapse
17. Configure access (Tailscale / local / cloud)
```

---

## PART 18: Customization Checklist

Before going live, verify:
- [ ] Company name in `app/layout.tsx` metadata title
- [ ] Your agent name in Sidebar brand header
- [ ] `--accent` color updated in globals.css to match your brand
- [ ] All agents in `AGENTS` array match your actual team
- [ ] All skills in `config/skill-registry.ts` match your actual skills
- [ ] Quarterly goals updated to your actual goals
- [ ] `ai-spend.json` created (even if empty: `{ "entries": [] }`)
- [ ] Access method configured and tested on mobile

---

## How to Use This Prompt

Paste this entire document into your AI coding assistant (Claude Code, Cursor, Windsurf, or similar). Then say:

> "Build Mission Control using the spec above. My OpenClaw workspace is at [path to your workspace]. Start with Part 1 — read my workspace files and confirm what you find before writing any code."

That's it. The AI reads your workspace, confirms what it found, and builds everything from there. The design, architecture, and data integrity rules are already baked in. And if it can't find something, it'll ask — one question at a time, not a whole intake form.
