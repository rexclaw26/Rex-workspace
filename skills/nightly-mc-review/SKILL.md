# nightly-mc-review

**Trigger phrase:** `NIGHTLY_MC_REVIEW`

Fires when Rex receives the exact message: `NIGHTLY_MC_REVIEW — Run the nightly Mission Control review per skills/nightly-mc-review/SKILL.md`

This skill runs a full nightly pipeline: 4 parallel assessment agents → synthesis → 3 parallel critic agents → Telegram report.

---

## Mission Control Context (pass to all agents)

Mission Control is a Next.js + Convex app at `/Users/rex/.openclaw/workspace/mission-control/`.

**Pages:** `/` (Dashboard: agent status cards, task launcher, AI spend tracker, market widgets), `/agents` (agent management, skill overview), `/tasks` (kanban task tracking), `/memory` (memory browser), `/headlines` (news feed), `/ops` (operations panel), `/calendar` (calendar view), `/decks` (presentation decks), `/x-feed` (X/Twitter feed), `/slides` (slide presentations).

**Regular work:** content pipeline (articles, X posts, YouTube scripts), DC Data Hub builds, Discord bot management, SEO audits, sponsor outreach, financial analysis, market briefings, agent architecture improvements.

**Recurring friction:** task handoff between sessions, memory gaps, agent status visibility, knowing what's blocked vs active, context for new sessions.

**Stack:** Next.js + Convex + Tailwind CSS. Hosted at `http://100.70.46.41:3000` (Tailscale).

---

## Pipeline Steps

### STEP 0 — Pre-flight Checks (inline, no sub-agent needed)

Run before spawning any agents. These are local file checks, not network calls.

**a) System-map freshness check:**
```bash
MAP_FILE="$HOME/.openclaw/workspace/skills/skill-intake-protocol/references/system-map.md"
MAP_MTIME=$(stat -f %m "$MAP_FILE" 2>/dev/null || echo 0)
MAP_AGE_DAYS=$(( ( $(date +%s) - $MAP_MTIME ) / 86400 ))
if [ $MAP_AGE_DAYS -gt 7 ]; then
  echo "⚠️ STALE: system-map.md is ${MAP_AGE_DAYS} days old — routing reference unreliable. Update before next session."
  SYSTEM_MAP_WARNING="⚠️ system-map.md is ${MAP_AGE_DAYS} days old — update needed"
else
  SYSTEM_MAP_WARNING=""
fi
```

**b) ROUTING.md freshness check:**
```bash
ROUTING_FILE="$HOME/.openclaw/workspace/ROUTING.md"
if [ -f "$ROUTING_FILE" ]; then
  ROUTING_MTIME=$(stat -f %m "$ROUTING_FILE" 2>/dev/null || echo 0)
  ROUTING_AGE_DAYS=$(( ( $(date +%s) - $ROUTING_MTIME ) / 86400 ))
  if [ $ROUTING_AGE_DAYS -gt 7 ]; then
    ROUTING_WARNING="⚠️ ROUTING.md is ${ROUTING_AGE_DAYS} days old — update needed"
  else
    ROUTING_WARNING=""
  fi
else
  ROUTING_WARNING="⚠️ ROUTING.md does not exist — create it"
fi
```

Append any warnings to the Telegram report footer in STEP 4.

---

### STEP 1 — Spawn 4 Assessment Agents (parallel)

Spawn all 4 simultaneously. Wait for all to complete before proceeding to Step 2. Timeout per agent: 240 seconds. If an agent times out or errors, use a placeholder result: `[AGENT TIMED OUT — no findings available]`.

---

#### AGENT 1 PROMPT — Systems Engineer

```
You are a senior systems engineer reviewing Mission Control, a Next.js + Convex ops dashboard for an AI agent workspace.

CONTEXT:
- Pages: Dashboard (agent status, task launcher, AI spend, market widgets), /agents, /tasks (kanban), /memory (memory browser), /headlines (news feed), /ops, /calendar, /decks, /x-feed, /slides
- Daily work: content pipeline, Discord bot management, SEO audits, sponsor outreach, financial analysis, market briefings, DC Data Hub builds
- Stack: Next.js + Convex + Tailwind CSS
- Recurring friction: task handoff between sessions, memory gaps, agent status visibility, blocked vs active visibility, cold-start context

Evaluate Mission Control from a systems engineering perspective. Answer exactly:
1. What technical capabilities does Mission Control lack that would reduce daily friction?
2. What agent monitoring and visibility gaps exist (e.g., can we tell if an agent is running, stuck, or failed)?
3. What automation opportunities are missing (e.g., auto-triggers, webhooks, scheduled data refresh)?

RETURN FORMAT (follow exactly):
FINDINGS:
• [Finding 1 — specific, actionable]
• [Finding 2 — specific, actionable]
• [Finding 3 — specific, actionable]

FEATURE IDEAS:
• IDEA-A: [Feature name] — [1-sentence description of what it does and why it matters]
• IDEA-B: [Feature name] — [1-sentence description of what it does and why it matters]
```

---

#### AGENT 2 PROMPT — Project Manager

```
You are an experienced project manager reviewing Mission Control, a Next.js + Convex ops dashboard for an AI agent workspace.

CONTEXT:
- Pages: Dashboard (agent status, task launcher, AI spend, market widgets), /agents, /tasks (kanban), /memory, /headlines, /ops, /calendar, /decks, /x-feed, /slides
- Daily work: content pipeline (articles, X posts, YouTube scripts), DC Data Hub builds, Discord bot management, SEO audits, sponsor outreach, financial analysis, market briefings
- Recurring friction: task handoff between sessions, projects stalling between sessions, no momentum tracking, hard to know what's blocked vs active across concurrent streams
- Kelly (the human) juggles 5-8 concurrent work streams

Evaluate Mission Control from a project management perspective. Answer exactly:
1. What workflow and task management gaps exist (beyond basic kanban)?
2. Where do projects typically stall or lose momentum between sessions?
3. What planning or tracking tools would help Kelly stay on top of multiple concurrent streams?

RETURN FORMAT (follow exactly):
FINDINGS:
• [Finding 1 — specific, actionable]
• [Finding 2 — specific, actionable]
• [Finding 3 — specific, actionable]

FEATURE IDEAS:
• IDEA-A: [Feature name] — [1-sentence description of what it does and why it matters]
• IDEA-B: [Feature name] — [1-sentence description of what it does and why it matters]
```

---

#### AGENT 3 PROMPT — Web Designer / UX

```
You are a senior web designer and UX specialist reviewing Mission Control, a Next.js + Convex ops dashboard for an AI agent workspace.

CONTEXT:
- Pages: Dashboard (agent status cards, task launcher, AI spend tracker, market data widgets), /agents, /tasks (kanban), /memory (memory browser), /headlines, /ops, /calendar, /decks, /x-feed, /slides
- Stack: Next.js + Convex + Tailwind CSS
- Primary user: Kelly — checks the dashboard first thing in the morning to understand what's happening and decide what to do
- Goal: dashboard should be actionable at a glance, not just informational
- Recurring friction: not knowing what's blocked vs active, no clear "what needs attention now" signal

Evaluate Mission Control from a UX and visual design perspective. Answer exactly:
1. What visual or UX improvements would make the dashboard more useful at a glance?
2. What data visualizations are missing that would surface important patterns?
3. What would make the dashboard more actionable (drives decisions) vs just informational (shows data)?

RETURN FORMAT (follow exactly):
FINDINGS:
• [Finding 1 — specific, actionable]
• [Finding 2 — specific, actionable]
• [Finding 3 — specific, actionable]

FEATURE IDEAS:
• IDEA-A: [Feature name] — [1-sentence description of what it does and why it matters]
• IDEA-B: [Feature name] — [1-sentence description of what it does and why it matters]
```

---

#### AGENT 4 PROMPT — Business Consultant

```
You are a strategic business consultant reviewing Mission Control, a Next.js + Convex ops dashboard for an AI agent workspace at a crypto media company (Hit Network — Discover Crypto, Blockchain Basement brands).

CONTEXT:
- Pages: Dashboard (agent status, task launcher, AI spend tracker, market data), /agents, /tasks (kanban), /memory, /headlines, /ops, /calendar, /decks, /x-feed, /slides
- Business: crypto media (YouTube, articles, X/Twitter), Discord community management, sponsor sales, DeFi fund tracking
- Kelly's role: Head of AI & Product Development — needs strategic visibility into what's moving the needle
- AI budget: tracked in dashboard (OpenAI, Anthropic, OpenRouter spend)
- Recurring friction: no clear ROI visibility on AI work, hard to see which projects are driving revenue vs. just busy work

Evaluate Mission Control from a business strategy perspective. Answer exactly:
1. What strategic visibility does Mission Control lack (e.g., what's working, what's not, revenue impact)?
2. What ROI and impact metrics should Kelly see daily to make better resource allocation decisions?
3. What would help Kelly make faster, better-informed decisions about where to focus agent work?

RETURN FORMAT (follow exactly):
FINDINGS:
• [Finding 1 — specific, actionable]
• [Finding 2 — specific, actionable]
• [Finding 3 — specific, actionable]

FEATURE IDEAS:
• IDEA-A: [Feature name] — [1-sentence description of what it does and why it matters]
• IDEA-B: [Feature name] — [1-sentence description of what it does and why it matters]
```

---

### STEP 2 — Synthesis

After all 4 agents return, synthesize their findings. This runs inline (no subagent needed — context is small enough).

**Synthesis task:**
Collect all 8 feature ideas (2 per agent) plus the 12 findings (3 per agent). Identify the 3 most impactful, distinct, buildable ideas — prioritizing ideas that address multiple agents' findings simultaneously.

For each of the 3 selected proposals, write:
1. **Name** — short, memorable (3-5 words)
2. **One-line description** — what it does
3. **Why now** — why this is the top priority at this moment
4. **Integration plan** — which pages/components need to be built or modified (bullet list, 3 items)
5. **Expected impact** — 1 sentence on what changes for Kelly

Store the 3 proposals in memory before proceeding to Step 3.

---

### STEP 3 — Spawn 3 Critic Agents (parallel)

One critic per proposal. Spawn all 3 simultaneously. Timeout per critic: 180 seconds. If a critic times out, use: `APPROVED — timeout, no critique available`.

---

#### CRITIC AGENT PROMPT TEMPLATE

```
You are a senior technical reviewer. Evaluate the following Mission Control feature proposal critically and honestly.

PROPOSAL: [Insert proposal name + description]
INTEGRATION PLAN: [Insert 3 bullet plan]

Mission Control stack: Next.js (App Router), Convex (real-time DB + serverless functions), Tailwind CSS, deployed locally at http://100.70.46.41:3000 via Tailscale.

Evaluate on exactly these 4 questions:
1. Is this actually buildable with the current stack (Next.js, Convex, Tailwind)? Any missing capabilities?
2. What's the real complexity vs. estimated? (1 = trivial, 5 = major project)
3. What's the primary failure risk if we build this?
4. Is there a simpler version that delivers 80% of the value with 20% of the effort?

RETURN FORMAT (follow exactly):
VERDICT: [APPROVED / APPROVED WITH CHANGES / REDESIGN NEEDED]
COMPLEXITY: [1-5] — [one-line explanation]
RISK: [one sentence on the main failure mode]
SIMPLER VERSION: [one sentence on a reduced-scope alternative, or "No — build it as proposed"]
NOTES: [1-2 sentences of specific actionable feedback]
```

---

### STEP 4 — Assemble Telegram Report

Format the final report. Split across up to 3 messages (stay under 4096 chars each). Send to Telegram chat ID `1011362712`.

```
🏗️ NIGHTLY MISSION CONTROL REVIEW — [YYYY-MM-DD]
━━━━━━━━━━━━━━━━━━━━━━━

💡 PROPOSAL 1: [Name]
[2-sentence description]
📋 Plan:
• [Step 1]
• [Step 2]
• [Step 3]
✅ Critic: [VERDICT] — [1-sentence note]

━━━━━━━━━━━━━━━━━━━━━━━

💡 PROPOSAL 2: [Name]
[2-sentence description]
📋 Plan:
• [Step 1]
• [Step 2]
• [Step 3]
✅ Critic: [VERDICT] — [1-sentence note]

━━━━━━━━━━━━━━━━━━━━━━━

💡 PROPOSAL 3: [Name]
[2-sentence description]
📋 Plan:
• [Step 1]
• [Step 2]
• [Step 3]
✅ Critic: [VERDICT] — [1-sentence note]

━━━━━━━━━━━━━━━━━━━━━━━
🎯 Recommended to build first: Proposal [X]
Reason: [1 sentence]

React with ✅ to greenlight Proposal 1, ✨ for 2, 🚀 for 3
```

---

### STEP 5 — Log to Proposals File

After sending the Telegram report, append the 3 proposals to `/Users/rex/.openclaw/workspace/memory/nightly-mc-proposals.md` (newest first):

```
## [YYYY-MM-DD] — [Proposal 1 Name]
Status: PROPOSED
Critic verdict: [verdict]
Notes: [any follow-up or caveats from critic]

## [YYYY-MM-DD] — [Proposal 2 Name]
Status: PROPOSED
Critic verdict: [verdict]
Notes: [any follow-up or caveats from critic]

## [YYYY-MM-DD] — [Proposal 3 Name]
Status: PROPOSED
Critic verdict: [verdict]
Notes: [any follow-up or caveats from critic]
```

---

## Timeout Handling

| Scenario | Action |
|---|---|
| Assessment agent times out (>240s) | Use placeholder: `[AGENT TIMED OUT — no findings]`. Continue with remaining agents. Synthesize from available data. |
| Fewer than 2 agents return | Send fallback Telegram: `⚠️ NIGHTLY MC REVIEW — [Date]: Pipeline degraded. Only [N] of 4 assessment agents completed. Review manually tomorrow.` |
| Critic agent times out (>180s) | Use: `APPROVED — timeout, no critique available` |
| Telegram send fails | Write report to `/Users/rex/.openclaw/workspace/memory/nightly-mc-proposals.md` with a `## DELIVERY FAILED` header. Log error. |
| Full pipeline fails | Write error to `/Users/rex/.openclaw/workspace/memory/nightly-mc-proposals.md` with timestamp and error summary. |

---

## Execution Notes

- Each subagent prompt is self-contained — pass the full prompt text, not a reference to this file
- Do not wait for Kelly's confirmation before running — this is an automated overnight job
- Log run start and completion times in today's daily memory file
- Total expected runtime: 20-40 minutes depending on model speed and agent concurrency
- Run at maximum 8 concurrent subagents (OpenClaw default limit)
