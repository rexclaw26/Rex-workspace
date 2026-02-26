---
name: mission-control
description: Mission Control operational dashboard for Rex. Guides the design, build, and maintenance of a Next.js + Convex real-time web application serving as the central command center for Hit Network's AI Digital Employees. Hosted locally, accessible via Tailscale VPN. Trigger on "Mission Control", "build the dashboard", "agent dashboard", "ops dashboard", "Convex app", or any request to build, update, or troubleshoot the Mission Control application.
---

# Mission Control — Operational Dashboard

**Stack:** Next.js + Convex (real-time) + Tailwind CSS
**Hosting:** Local, accessible via Tailscale VPN
**Per agent:** Each agent gets their own Mission Control instance with a role-specific component.

---

## Build Order

Build incrementally — get approval at each phase before proceeding:

1. **Scaffold** — Next.js app + Convex project + Tailwind setup
2. **Tasks Board** — Kanban: To Do → In Progress → In Review → Done
3. **Calendar View** — Color-coded recurring tasks, Google Calendar sync
4. **Memory Screen** — Searchable, categorized memory browser
5. **Role-Specific Component** — Forge: AI Operations dashboard (agent health, costs, deployment status)
6. **Google Workspace Sync** — Tasks → Google Sheets | Calendar → Google Calendar | Memory → Google Drive

See [build-guide.md](references/build-guide.md) for step-by-step instructions per phase.

---

## Architecture Overview

See [architecture.md](references/architecture.md) for:
- Full component tree
- Convex schema design
- Real-time data patterns
- Tailscale access config

---

## Google Workspace Sync

See [google-sync.md](references/google-sync.md) for:
- OAuth setup (Google Workspace)
- Sync logic per data type
- Conflict resolution (Convex vs. Google as source of truth)

---

## Forge-Specific Component (Role Identity)

The role-specific component for Forge / Rex:
- **AI Operations Dashboard:** All 6 agent uptime, error rates, API volumes
- **Cost Dashboard:** Per-agent spend, MTD, projected monthly
- **Skill Deployment Pipeline:** Current status of each skill across all agents
- **Alert Feed:** Security events, agent down, budget overrun flags

---

## Development Rules

- Propose architecture changes for approval before building
- Build and test locally before exposing via Tailscale
- Never expose dashboard publicly — Tailscale access only
- All agent data kept behind authentication
- Human approval required before any production deployment
