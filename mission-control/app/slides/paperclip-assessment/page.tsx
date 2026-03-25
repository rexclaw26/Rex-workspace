'use client';

import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────
interface Slide {
  id: number;
  title: string;
  tag?: string;
  content: React.ReactNode;
}

// ── Shared UI primitives ─────────────────────────────────────────────────
function Tag({ children, color = 'orange' }: { children: React.ReactNode; color?: 'orange' | 'green' | 'red' | 'blue' | 'yellow' | 'gray' }) {
  const colors: Record<string, string> = {
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    green:  'bg-green-500/15 text-green-400 border-green-500/30',
    red:    'bg-red-500/15 text-red-400 border-red-500/30',
    blue:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
    yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    gray:   'bg-white/5 text-white/50 border-white/10',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border tracking-wide uppercase ${colors[color]}`}>
      {children}
    </span>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/4 p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">{children}</p>
  );
}

function Bullet({ children, icon = '→', color = 'text-orange-500' }: { children: React.ReactNode; icon?: string; color?: string }) {
  return (
    <li className="flex gap-3 items-start">
      <span className={`mt-0.5 shrink-0 ${color} font-bold`}>{icon}</span>
      <span className="text-white/80 text-sm leading-relaxed">{children}</span>
    </li>
  );
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

function Verdict({ level, label, children }: { level: 'pass' | 'fail' | 'caution' | 'neutral'; label: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    pass:    'border-green-500/40 bg-green-500/8',
    fail:    'border-red-500/40 bg-red-500/8',
    caution: 'border-yellow-500/40 bg-yellow-500/8',
    neutral: 'border-white/10 bg-white/4',
  };
  const icons: Record<string, string> = { pass: '✓', fail: '✗', caution: '⚠', neutral: '◎' };
  const colors: Record<string, string> = {
    pass: 'text-green-400', fail: 'text-red-400', caution: 'text-yellow-400', neutral: 'text-white/50',
  };
  return (
    <div className={`rounded-xl border p-4 ${styles[level]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-lg font-bold ${colors[level]}`}>{icons[level]}</span>
        <span className={`text-sm font-bold ${colors[level]}`}>{label}</span>
      </div>
      <p className="text-white/70 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

// ── All 15 slides ─────────────────────────────────────────────────────────
const slides: Slide[] = [
  // 1 ── Title + Executive Summary
  {
    id: 1,
    title: 'Paperclip Assessment',
    tag: 'Hit Network Internal | March 2026',
    content: (
      <div className="space-y-6">
        <div className="text-center space-y-3 pt-2">
          <p className="text-white/50 text-sm tracking-widest uppercase">Should We Implement It?</p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-orange-500/60 bg-orange-500/10">
            <span className="text-orange-400 text-2xl font-black tracking-tight">NOT YET</span>
            <Tag color="yellow">Revisit at 10+ agents</Tag>
          </div>
          <p className="text-white/60 text-sm max-w-xl mx-auto">Confidence: 72%. Paperclip solves real problems we don't have yet, and would add friction to a system that's working.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card>
            <SectionLabel>The Tool</SectionLabel>
            <p className="text-white/80 text-sm">Node.js server that runs an org chart of AI agents. Think corporate hierarchy for bots, with budgets, governance, and ticketing built in.</p>
          </Card>
          <Card>
            <SectionLabel>Our Situation</SectionLabel>
            <p className="text-white/80 text-sm">6 agents today, loosely coordinated via Discord and task lock files. It works. It's not chaos. We're not drowning yet.</p>
          </Card>
          <Card>
            <SectionLabel>The Call</SectionLabel>
            <p className="text-white/80 text-sm">Selective adoption of its cost-tracking and audit concepts, without the full install. Watch it mature. Revisit when we hit 10+ agents or cross-agent tasks start breaking.</p>
          </Card>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Tag color="green">MIT License</Tag>
          <Tag color="green">Self-hosted</Tag>
          <Tag color="blue">Node.js 20+ required</Tag>
          <Tag color="yellow">Early-stage project</Tag>
          <Tag color="gray">Docs: incomplete</Tag>
        </div>
      </div>
    ),
  },

  // 2 ── What Is Paperclip (no marketing fluff)
  {
    id: 2,
    title: 'What Is Paperclip, Actually',
    tag: 'No Marketing. Just the Tech.',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Strip the "zero-human company" pitch and here's what you get: a Node.js process with an embedded Postgres database and a React UI. It acts as a control plane over your existing agents.</p>
        <TwoCol
          left={
            <div className="space-y-3">
              <SectionLabel>What It Actually Does</SectionLabel>
              <ul className="space-y-2">
                <Bullet>Stores org chart data: agents, roles, reporting lines, budgets</Bullet>
                <Bullet>Issues heartbeat HTTP calls to your agents on a schedule</Bullet>
                <Bullet>Maintains a ticket system: every task is a thread with full tool-call logging</Bullet>
                <Bullet>Enforces budget limits: auto-pauses agents at 100% spend, warns at 80%</Bullet>
                <Bullet>Requires board approval for hiring new agents (governance gate)</Bullet>
                <Bullet>Provides goal-ancestry context: mission to project to task, all linked</Bullet>
              </ul>
            </div>
          }
          right={
            <div className="space-y-3">
              <SectionLabel>What It Is NOT</SectionLabel>
              <ul className="space-y-2">
                <Bullet icon="✗" color="text-red-400">Not a chatbot or conversation interface</Bullet>
                <Bullet icon="✗" color="text-red-400">Not an agent runtime, it doesn't run your code</Bullet>
                <Bullet icon="✗" color="text-red-400">Not a workflow builder with drag-and-drop</Bullet>
                <Bullet icon="✗" color="text-red-400">Not a prompt manager or model selector</Bullet>
                <Bullet icon="✗" color="text-red-400">Not a replacement for OpenClaw</Bullet>
              </ul>
              <div className="mt-4 p-3 rounded-lg border border-orange-500/30 bg-orange-500/8">
                <p className="text-orange-400 text-xs font-bold mb-1">Their Own Quote</p>
                <p className="text-white/70 text-sm italic">"If OpenClaw is an employee, Paperclip is the company."</p>
                <p className="text-white/50 text-xs mt-1">That's the most honest sentence in their docs. It's org infrastructure, not agent infrastructure.</p>
              </div>
            </div>
          }
        />
        <Card>
          <p className="text-white/60 text-xs"><span className="text-orange-400 font-bold">Tech Stack:</span> Node.js 20+ / pnpm 9+ / embedded Postgres (auto-managed) / React UI on same origin / MIT license / self-hosted / runs locally or in Docker / port 3100 by default</p>
        </Card>
      </div>
    ),
  },

  // 3 ── First Principles
  {
    id: 3,
    title: 'First Principles: The Real Problem It Solves',
    tag: 'Strip the Marketing',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Start from scratch. Forget the pitch. What fundamental coordination failures does Paperclip address?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <SectionLabel>Problem 1: No Shared Context</SectionLabel>
            <p className="text-white/70 text-sm mb-2">When you have many agents, they each operate with local context only. They don't know what the others are doing, what the company goals are, or why their task matters.</p>
            <p className="text-orange-400 text-xs font-bold">Paperclip's fix: goal-ancestry chain. Task knows its project, project knows its goal, goal knows the mission.</p>
          </Card>
          <Card>
            <SectionLabel>Problem 2: No Spend Visibility</SectionLabel>
            <p className="text-white/70 text-sm mb-2">Agents with API access can burn through token budgets fast. There's no natural stopping point unless you build one yourself.</p>
            <p className="text-orange-400 text-xs font-bold">Paperclip's fix: per-agent monthly budgets, atomic enforcement, hard pause at limit.</p>
          </Card>
          <Card>
            <SectionLabel>Problem 3: No Coordination Protocol</SectionLabel>
            <p className="text-white/70 text-sm mb-2">Who owns a task? If two agents try to act on the same thing, who wins? Without task checkout atomicity, you get double-work or conflicts.</p>
            <p className="text-orange-400 text-xs font-bold">Paperclip's fix: atomic task checkout. One agent holds a ticket at a time.</p>
          </Card>
          <Card>
            <SectionLabel>Problem 4: No Audit Trail</SectionLabel>
            <p className="text-white/70 text-sm mb-2">When something goes wrong with an autonomous agent, you need to know exactly what it did, when, and why. Without logging, you're flying blind post-mortem.</p>
            <p className="text-orange-400 text-xs font-bold">Paperclip's fix: immutable append-only audit log, full tool-call tracing per ticket.</p>
          </Card>
        </div>
        <Card>
          <SectionLabel>The Core Insight</SectionLabel>
          <p className="text-white/80 text-sm">Paperclip is solving the <span className="text-orange-400 font-bold">management layer</span> problem, not the execution layer problem. It doesn't care how your agents work. It cares about who they report to, what they're supposed to do, and whether they're staying in budget. That's genuinely useful at scale. The question is whether we're at that scale.</p>
        </Card>
      </div>
    ),
  },

  // 4 ── Our Current Setup
  {
    id: 4,
    title: 'Our Current Setup',
    tag: 'How We Coordinate Today',
    content: (
      <div className="space-y-5">
        <TwoCol
          left={
            <div className="space-y-3">
              <SectionLabel>Our 6 Active Agents</SectionLabel>
              <div className="space-y-2">
                {[
                  { name: 'Rex', owner: "Kelly's agent", role: 'Main orchestrator, content, strategy, ops, 30+ skills' },
                  { name: 'Lex Mercer', owner: "TJ's agent", role: 'ALE co-build, cross-agent coordination' },
                  { name: 'Hal', owner: "Tim's agent", role: 'Operational support' },
                  { name: 'Grant', owner: 'Hit Network', role: 'Supporting agent' },
                  { name: 'Nora', owner: 'Hit Network', role: 'Supporting agent' },
                  { name: 'Reid', owner: 'Hit Network', role: 'Supporting agent' },
                ].map((a) => (
                  <div key={a.name} className="flex gap-3 p-3 rounded-lg bg-white/4 border border-white/8">
                    <div className="w-1.5 rounded-full bg-orange-500 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-bold">{a.name} <span className="text-white/40 font-normal text-xs">— {a.owner}</span></p>
                      <p className="text-white/60 text-xs mt-0.5">{a.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
          right={
            <div className="space-y-3">
              <SectionLabel>How We Coordinate</SectionLabel>
              <ul className="space-y-2">
                <Bullet icon="◎">Discord #ale-build channel for cross-agent communication</Bullet>
                <Bullet icon="◎">Task lock files for multi-step, cross-session tasks</Bullet>
                <Bullet icon="◎">MEMORY.md + topic memory files for persistence</Bullet>
                <Bullet icon="◎">OpenClaw heartbeat system for scheduled tasks</Bullet>
                <Bullet icon="◎">Mission Control dashboard (Next.js + Convex) for visibility</Bullet>
                <Bullet icon="◎">Human-in-the-loop: Kelly approves external sends, financials, architecture</Bullet>
              </ul>
              <div className="mt-4 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/8">
                <p className="text-yellow-400 text-xs font-bold mb-1">What We're Missing</p>
                <ul className="space-y-1">
                  <Bullet icon="!" color="text-yellow-400">No shared org chart or formal hierarchy</Bullet>
                  <Bullet icon="!" color="text-yellow-400">No per-agent cost tracking</Bullet>
                  <Bullet icon="!" color="text-yellow-400">No formal audit log of agent decisions</Bullet>
                  <Bullet icon="!" color="text-yellow-400">No atomic task checkout between agents</Bullet>
                </ul>
              </div>
            </div>
          }
        />
      </div>
    ),
  },

  // 5 ── Gap Analysis
  {
    id: 5,
    title: 'Gap Analysis',
    tag: 'What We Have vs. What Paperclip Offers',
    content: (
      <div className="space-y-4">
        <p className="text-white/60 text-sm">Honest side-by-side. Green means we've got it covered. Yellow means partial. Red means genuinely missing.</p>
        <div className="space-y-2">
          {[
            { feature: 'Agent scheduling / heartbeats', us: 'OpenClaw heartbeat + cron skills', them: 'Built-in heartbeat scheduler per agent', gap: 'none', note: "We've got this." },
            { feature: 'Task tracking / ticketing', us: 'Task lock files + TASK_INDEX.md', them: 'Full ticket system with threads, tracing, audit', gap: 'partial', note: 'Ours is file-based. Theirs is database-backed. Theirs is better for multi-agent workflows.' },
            { feature: 'Cross-agent context sharing', us: 'Discord + MEMORY.md files', them: 'Goal-ancestry chain (mission to task)', gap: 'partial', note: "We share context, but it's manual and loose." },
            { feature: 'Per-agent cost budgeting', us: 'None', them: 'Monthly budgets, 80% warning, auto-pause at 100%', gap: 'missing', note: "Real gap. We have zero cost visibility per agent." },
            { feature: 'Audit log / decision tracing', us: 'Error journal (manual), session logs', them: 'Immutable append-only log, full tool-call trace', gap: 'partial', note: "We log errors. We don't log all decisions." },
            { feature: 'Governance / approval gates', us: "Kelly approves manually via Telegram", them: 'Structured board approval, hire gates, rollback', gap: 'partial', note: "Our governance is informal but works at 6 agents." },
            { feature: 'Org chart / hierarchy', us: 'None (flat structure)', them: 'Full org chart with roles, reporting lines', gap: 'missing', note: "We don't have this and haven't needed it yet." },
            { feature: 'Multi-company isolation', us: 'Not applicable (one company)', them: 'Full isolation per company on one install', gap: 'none', note: "We're one company. Not relevant right now." },
          ].map((row) => {
            const gapColors: Record<string, string> = {
              none: 'text-green-400',
              partial: 'text-yellow-400',
              missing: 'text-red-400',
            };
            const gapBg: Record<string, string> = {
              none: 'border-green-500/20 bg-green-500/5',
              partial: 'border-yellow-500/20 bg-yellow-500/5',
              missing: 'border-red-500/20 bg-red-500/5',
            };
            const gapLabels: Record<string, string> = { none: 'Covered', partial: 'Partial', missing: 'Missing' };
            return (
              <div key={row.feature} className={`p-3 rounded-lg border ${gapBg[row.gap]} space-y-2`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-white text-xs font-bold">{row.feature}</p>
                  <span className={`text-xs font-bold shrink-0 ${gapColors[row.gap]}`}>{gapLabels[row.gap]}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wide mb-0.5">Us</p>
                    <p className="text-white/70 text-xs">{row.us}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wide mb-0.5">Paperclip</p>
                    <p className="text-white/70 text-xs">{row.them}</p>
                  </div>
                </div>
                <p className="text-white/40 text-xs italic">{row.note}</p>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="text-center p-2 rounded-lg bg-green-500/8 border border-green-500/20"><p className="text-green-400 text-sm font-bold">2</p><p className="text-green-400/70 text-xs">Covered</p></div>
          <div className="text-center p-2 rounded-lg bg-yellow-500/8 border border-yellow-500/20"><p className="text-yellow-400 text-sm font-bold">4</p><p className="text-yellow-400/70 text-xs">Partial</p></div>
          <div className="text-center p-2 rounded-lg bg-red-500/8 border border-red-500/20"><p className="text-red-400 text-sm font-bold">2</p><p className="text-red-400/70 text-xs">Missing</p></div>
        </div>
      </div>
    ),
  },

  // 6 ── Where Paperclip Would Add Real Value
  {
    id: 6,
    title: 'Where Paperclip Would Add Real Value',
    tag: 'Genuine Wins',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Let's be honest about what it does well. These aren't hypothetical wins, they're real problems we'll hit.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Verdict level="pass" label="Cost Budgeting Per Agent">
            Right now we have zero visibility into what each agent spends per month. Rex could be consuming 10x what Hal uses and we'd have no idea until the bill arrives. Paperclip's per-agent budget cap with auto-pause is genuinely useful operational infrastructure. We need this eventually.
          </Verdict>
          <Verdict level="pass" label="Atomic Task Checkout">
            As we spin up more cross-agent workflows, the risk of two agents trying to work the same task grows. Our current file-based lock system works but it's brittle. Paperclip solves this with database-backed atomic checkout. That's the right architecture for 10+ agents.
          </Verdict>
          <Verdict level="pass" label="Audit Trail">
            We log errors. We don't log everything. If Rex or Lex does something that causes a business problem and we need to trace exactly what happened, we can't today. An immutable append-only audit log is real value for accountability.
          </Verdict>
          <Verdict level="pass" label="Goal-Ancestry Context">
            Today each agent has to independently understand the mission from its SOUL.md and skill files. Paperclip's goal chain means every task carries "why it matters" automatically. That's actually a smarter way to maintain alignment at scale.
          </Verdict>
        </div>
        <Card>
          <SectionLabel>The Honest Summary</SectionLabel>
          <p className="text-white/80 text-sm">These are real wins. They're not why we should implement today, they're why we should watch Paperclip closely. The value is real. The timing is early.</p>
        </Card>
      </div>
    ),
  },

  // 7 ── Where It's Redundant
  {
    id: 7,
    title: "Where Paperclip Is Redundant With What We Have",
    tag: "Don't Pay Twice",
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">A lot of what Paperclip offers, we've already built. Sometimes worse, sometimes actually better for our specific setup.</p>
        <div className="space-y-3">
          <Verdict level="neutral" label="Heartbeat Scheduling">
            We already have OpenClaw's heartbeat system running scheduled tasks across all agents. Rex runs news aggregation every 30 minutes, daily briefings at 7am, weekly scorecards on Monday. Adding Paperclip's heartbeat layer on top doesn't add value, it adds another thing to maintain.
          </Verdict>
          <Verdict level="neutral" label="Governance / Human Approval">
            Kelly already has human-in-the-loop control via Telegram. Every external send, financial decision, and architecture change requires approval. It's not a structured board approval UI, but it works and it's fast. Paperclip's governance layer would slow us down more than it helps right now.
          </Verdict>
          <Verdict level="neutral" label="Persistent Agent State">
            We use MEMORY.md files, topic memory files, and task lock files. It's file-based, which Paperclip correctly calls out as fragile. But it works for 6 agents. Their Postgres-backed persistence is better, but it's not solving a crisis we're having.
          </Verdict>
          <Verdict level="neutral" label="Dashboard / Visibility">
            We built Mission Control. It's live on Tailscale, it shows agent status, tasks, headlines, X feed. It's ours. Paperclip's dashboard would be a second UI we'd have to context-switch into. That's friction, not improvement.
          </Verdict>
        </div>
        <Card>
          <SectionLabel>The Redundancy Problem</SectionLabel>
          <p className="text-white/80 text-sm">Running two systems for the same problem means twice the maintenance, twice the failure surface, and split attention when things break. We shouldn't add Paperclip to areas where we're already covered, even if Paperclip's version is theoretically better.</p>
        </Card>
      </div>
    ),
  },

  // 8 ── Where It Could Break Things
  {
    id: 8,
    title: "Where Paperclip Could Break What's Working",
    tag: 'Real Risks',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">This is the section most tools skip. Let's not. Here's where implementation could actually hurt us.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Verdict level="fail" label="Agent Identity Fragmentation">
            Rex's identity lives in SOUL.md, hit-network-integrator, and 30+ skill files. That context loads every session. If we route Rex through Paperclip's goal-ancestry system instead, we risk splitting the identity layer. Which system wins when there's a conflict? That's a real architectural question with no clean answer today.
          </Verdict>
          <Verdict level="fail" label="Slowing Down Kelly's Workflow">
            Kelly sends a Telegram message, Rex acts. That's the current loop. It's fast. Paperclip introduces a ticket system as the interaction model. That means Kelly would need to create tickets, wait for agent responses there, and monitor a separate dashboard. That's a significant workflow change for an unclear benefit at 6 agents.
          </Verdict>
          <Verdict level="fail" label="Third Service to Keep Running">
            We already maintain OpenClaw gateway on macOS. We have Mission Control on Next.js and Convex. Adding Paperclip on port 3100 with its own Postgres instance means a third persistent service that can crash, drift, need updates, and break. Our macOS-hosted setup isn't exactly enterprise-grade already.
          </Verdict>
          <Verdict level="fail" label="Early-Stage Software Risk">
            Paperclip's docs are incomplete. The roadmap includes items like "ClipMart" and "better docs" which signal it's still early. Running early-stage, incomplete software as coordination infrastructure for six active business agents is a meaningful operational risk. If Paperclip has a bug that corrupts agent state, we have no fallback.
          </Verdict>
        </div>
        <Card>
          <p className="text-white/70 text-sm"><span className="text-red-400 font-bold">Bottom line:</span> The risk isn't that Paperclip is bad. It's that adding it now solves tomorrow's problems while creating today's operational overhead. That's a bad trade at our current scale.</p>
        </Card>
      </div>
    ),
  },

  // 9 ── Implementation Complexity + Cost
  {
    id: 9,
    title: 'Implementation Complexity + Cost',
    tag: 'Be Realistic',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">No sugarcoating here. This is what actually happens if we say yes.</p>
        <TwoCol
          left={
            <div className="space-y-3">
              <SectionLabel>Setup Effort</SectionLabel>
              <ul className="space-y-2">
                <Bullet icon="1.">Install Node.js 20+ + pnpm 9+, run onboard command, configure embedded Postgres</Bullet>
                <Bullet icon="2.">Define org chart: 6 agents, roles, hierarchy, reporting lines</Bullet>
                <Bullet icon="3.">Build OpenClaw adapters for each agent (Rex, Lex, Hal, Grant, Nora, Reid)</Bullet>
                <Bullet icon="4.">Define company mission and goal hierarchy in Paperclip's schema</Bullet>
                <Bullet icon="5.">Migrate task tracking from lock files to Paperclip tickets</Bullet>
                <Bullet icon="6.">Set per-agent budgets, test enforcement, verify audit logging</Bullet>
                <Bullet icon="7.">Integrate with Mission Control or decide on dashboard strategy</Bullet>
                <Bullet icon="8.">Train Kelly on new ticket-based workflow</Bullet>
              </ul>
            </div>
          }
          right={
            <div className="space-y-3">
              <SectionLabel>Realistic Time Estimate</SectionLabel>
              <div className="space-y-2">
                {[
                  { task: 'Initial install + config', time: '2-4 hours' },
                  { task: 'Agent adapter development', time: '1-2 days per agent' },
                  { task: 'Org chart + goal hierarchy', time: '4-6 hours' },
                  { task: 'Migration from lock files', time: '1-2 days' },
                  { task: 'Testing + stabilization', time: '1 week' },
                  { task: 'Total realistic estimate', time: '3-4 weeks', highlight: true },
                ].map((r) => (
                  <div key={r.task} className={`flex justify-between items-center p-2 rounded-lg ${r.highlight ? 'bg-orange-500/12 border border-orange-500/30' : 'bg-white/4 border border-white/8'}`}>
                    <span className={`text-xs ${r.highlight ? 'text-orange-400 font-bold' : 'text-white/70'}`}>{r.task}</span>
                    <span className={`text-xs font-bold ${r.highlight ? 'text-orange-400' : 'text-white/60'}`}>{r.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg bg-yellow-500/8 border border-yellow-500/30">
                <p className="text-yellow-400 text-xs font-bold mb-1">Financial Cost</p>
                <p className="text-white/70 text-xs">Paperclip itself is free. The cost is Rex's time: 3-4 weeks of implementation work that doesn't ship content, grow the audience, or drive revenue. That's the real price tag.</p>
              </div>
            </div>
          }
        />
      </div>
    ),
  },

  // 10 ── Steelman FOR
  {
    id: 10,
    title: 'Critic: Steelman FOR Implementation',
    tag: "Best Case for Yes",
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Let me argue the other side as hard as I can. Here's the strongest case for implementing Paperclip now.</p>
        <div className="space-y-3">
          <Card>
            <SectionLabel>Argument 1: We're Building While Flying</SectionLabel>
            <p className="text-white/80 text-sm">We're adding agents and skills constantly. Retrofitting a coordination layer at 15 or 20 agents is harder than building the infrastructure now at 6. Technical debt compounds. The pain of doing it later is always bigger than it looks from today.</p>
          </Card>
          <Card>
            <SectionLabel>Argument 2: The Cost Visibility Gap Is a Real Business Risk</SectionLabel>
            <p className="text-white/80 text-sm">We're spending real money on API calls and we can't attribute it by agent. One rogue loop or misconfigured schedule and we could burn hundreds of dollars before anyone notices. Paperclip's budget enforcement is insurance. Insurance is worth buying before you need it.</p>
          </Card>
          <Card>
            <SectionLabel>Argument 3: OpenClaw Already Has First-Class Paperclip Integration</SectionLabel>
            <p className="text-white/80 text-sm">The DEVELOPING.md has a full smoke test harness for OpenClaw: openclaw-join, board approval, one-time API key claim. Paperclip was built with OpenClaw as a first-class citizen. The integration path isn't theoretical, it's tested and documented. That's not nothing.</p>
          </Card>
          <Card>
            <SectionLabel>Argument 4: Early Adopter Advantage</SectionLabel>
            <p className="text-white/80 text-sm">Paperclip is early-stage. Getting in now means we understand it deeply when it matures, we can contribute to shaping how it works for media/content companies, and we've solved the migration problem before everyone else is fighting with it.</p>
          </Card>
        </div>
        <div className="p-3 rounded-lg bg-green-500/8 border border-green-500/30">
          <p className="text-green-400 text-xs font-bold">Steelman Rating: Legitimate. Arguments 2 and 3 are real.</p>
          <p className="text-white/60 text-xs mt-1">The "build now not later" argument is genuinely compelling. It doesn't change the recommendation, but it's not wrong either.</p>
        </div>
      </div>
    ),
  },

  // 11 ── Steelman AGAINST
  {
    id: 11,
    title: 'Critic: Steelman AGAINST Implementation',
    tag: 'Best Case for No',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Now the other direction. Here's the strongest case for staying out.</p>
        <div className="space-y-3">
          <Card>
            <SectionLabel>Argument 1: Our Coordination Works. Don't Fix What Isn't Broken.</SectionLabel>
            <p className="text-white/80 text-sm">Six agents coordinating via Discord and file-based locks has been running without major incident. We've built an entire skill ecosystem, a live dashboard, and a growing content operation on top of this setup. "It could be more formal" isn't a good reason to blow it up.</p>
          </Card>
          <Card>
            <SectionLabel>Argument 2: Paperclip's Docs Are Incomplete. That's a Red Flag.</SectionLabel>
            <p className="text-white/80 text-sm">The roadmap item "better docs" is a warning sign. Running coordination infrastructure with incomplete docs means we're debugging without a manual. That's how you spend a weekend fixing something that should take 10 minutes. Early-stage is fine for side projects. It's risky for production agent coordination.</p>
          </Card>
          <Card>
            <SectionLabel>Argument 3: The Real Problem Is Agent Count, Not Tool Count</SectionLabel>
            <p className="text-white/80 text-sm">Every coordination problem Paperclip solves gets worse with more agents. At 6 agents, those problems are manageable. At 20, they're not. But we're at 6. The answer to "we don't have coordination problems yet" isn't "add more coordination infrastructure." It's "add it when you have the problem."</p>
          </Card>
          <Card>
            <SectionLabel>Argument 4: Kelly's Time Budget Is Real</SectionLabel>
            <p className="text-white/80 text-sm">Rex implementing Paperclip for 3-4 weeks means 3-4 weeks of no new articles, no new skills, no content pipeline improvements, no revenue-focused work. That's a real opportunity cost. The question isn't "is Paperclip useful" — it's "is it more useful than what else Rex could build in those 3-4 weeks?"</p>
          </Card>
        </div>
        <div className="p-3 rounded-lg bg-red-500/8 border border-red-500/30">
          <p className="text-red-400 text-xs font-bold">Steelman Rating: These land harder than the FOR arguments at our current scale.</p>
          <p className="text-white/60 text-xs mt-1">Arguments 2 and 4 especially. Incomplete docs on production infrastructure and 3-4 weeks of opportunity cost are the deciding factors.</p>
        </div>
      </div>
    ),
  },

  // 12 ── Selective Adoption Options
  {
    id: 12,
    title: 'Selective Adoption Options',
    tag: "It Doesn't Have to Be All or Nothing",
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">The binary "implement or don't" framing isn't the only option. Here are three paths.</p>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-green-500/40 bg-green-500/6">
            <div className="flex items-center gap-3 mb-3">
              <Tag color="green">Option A</Tag>
              <p className="text-white font-bold">Adopt the Concepts, Not the Software</p>
            </div>
            <p className="text-white/70 text-sm mb-3">Take Paperclip's ideas and implement them natively in our stack, without running a new service. This means: building per-agent cost tracking in Mission Control, formalizing goal hierarchy in our MEMORY.md system, and adding a lightweight audit log skill.</p>
            <div className="flex flex-wrap gap-2">
              <Tag color="green">Low risk</Tag><Tag color="green">No new service</Tag><Tag color="green">Immediate value</Tag><Tag color="gray">More Rex build work</Tag>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-yellow-500/40 bg-yellow-500/6">
            <div className="flex items-center gap-3 mb-3">
              <Tag color="yellow">Option B</Tag>
              <p className="text-white font-bold">Install Paperclip in Observation Mode</p>
            </div>
            <p className="text-white/70 text-sm mb-3">Stand up a Paperclip instance, connect Rex only (not all agents), use it purely for its audit trail and cost tracking features while keeping our existing coordination methods. Don't migrate task management. Don't change Kelly's workflow. Just observe.</p>
            <div className="flex flex-wrap gap-2">
              <Tag color="yellow">Medium effort</Tag><Tag color="yellow">Partial value</Tag><Tag color="yellow">Learn before committing</Tag><Tag color="gray">Still another service running</Tag>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-orange-500/40 bg-orange-500/6">
            <div className="flex items-center gap-3 mb-3">
              <Tag color="orange">Option C</Tag>
              <p className="text-white font-bold">Full Implementation at the 10-Agent Trigger</p>
            </div>
            <p className="text-white/70 text-sm mb-3">Commit to implementing Paperclip fully when we hit 10 active agents or when we have a documented cross-agent coordination failure. Set the trigger now, so it's a decision we've already made rather than something we revisit repeatedly.</p>
            <div className="flex flex-wrap gap-2">
              <Tag color="orange">Clear trigger</Tag><Tag color="orange">No premature complexity</Tag><Tag color="orange">Docs likely better by then</Tag><Tag color="gray">Risk of delay spiral</Tag>
            </div>
          </div>
        </div>
        <Card>
          <p className="text-white/70 text-sm"><span className="text-orange-400 font-bold">Recommendation:</span> Option A now, with Option C trigger set at 10 agents. We get the conceptual value immediately without the service overhead.</p>
        </Card>
      </div>
    ),
  },

  // 13 ── Recommendation
  {
    id: 13,
    title: 'Recommendation',
    tag: 'The Call',
    content: (
      <div className="space-y-5">
        <div className="text-center py-4">
          <div className="inline-flex flex-col items-center gap-3">
            <p className="text-white/50 text-xs tracking-widest uppercase">Final Recommendation</p>
            <div className="px-8 py-4 rounded-2xl border-2 border-orange-500 bg-orange-500/10">
              <p className="text-orange-400 text-3xl font-black tracking-tight">NOT YET</p>
              <p className="text-white/60 text-sm mt-1">Revisit at 10+ agents</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-white/50 text-sm">Confidence:</p>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${i < 7 ? 'bg-orange-500' : 'bg-white/15'}`} />
                ))}
              </div>
              <p className="text-orange-400 text-sm font-bold">72%</p>
            </div>
          </div>
        </div>
        <TwoCol
          left={
            <div className="space-y-3">
              <SectionLabel>What We Do Now</SectionLabel>
              <ul className="space-y-2">
                <Bullet icon="✓" color="text-green-400">Build per-agent cost tracking in Mission Control (native, no new service)</Bullet>
                <Bullet icon="✓" color="text-green-400">Formalize goal hierarchy: add a company mission document that all agents reference</Bullet>
                <Bullet icon="✓" color="text-green-400">Add a lightweight audit-log skill that captures decision trace for cross-agent tasks</Bullet>
                <Bullet icon="✓" color="text-green-400">Star the Paperclip GitHub repo, watch for v1.0 or "docs complete" milestone</Bullet>
                <Bullet icon="✓" color="text-green-400">Set a formal revisit trigger: 10 agents or first cross-agent task failure</Bullet>
              </ul>
            </div>
          }
          right={
            <div className="space-y-3">
              <SectionLabel>Why Not Full Implementation</SectionLabel>
              <ul className="space-y-2">
                <Bullet icon="✗" color="text-red-400">Docs are incomplete (their own roadmap admits it)</Bullet>
                <Bullet icon="✗" color="text-red-400">3-4 week opportunity cost at a critical growth phase</Bullet>
                <Bullet icon="✗" color="text-red-400">Adds a third production service to maintain on macOS</Bullet>
                <Bullet icon="✗" color="text-red-400">Risk of identity/context fragmentation across Rex's skill system</Bullet>
                <Bullet icon="✗" color="text-red-400">We don't yet have the coordination failures it's designed to solve</Bullet>
              </ul>
              <div className="p-3 rounded-lg bg-white/4 border border-white/10 mt-3">
                <p className="text-white/50 text-xs">The 28% uncertainty: if Kelly decides that cost visibility and audit trails are urgent enough to justify the overhead right now, Option B (observation mode for Rex only) is a defensible call. It's not wrong, just premature.</p>
              </div>
            </div>
          }
        />
      </div>
    ),
  },

  // 14 ── Implementation Roadmap (If Yes)
  {
    id: 14,
    title: 'If Yes: Implementation Roadmap',
    tag: 'When the Trigger Fires',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">If we decide to implement, or when the 10-agent trigger fires, here's the right sequencing. Don't wing it.</p>
        <div className="space-y-3">
          {[
            {
              phase: 'Phase 1', duration: 'Week 1', title: 'Install + Single Agent Pilot',
              steps: ["Run `npx paperclipai onboard --yes`, configure embedded Postgres", "Connect Rex only via OpenClaw adapter (smoke test harness is already in their repo)", "Define Hit Network company mission + Rex's role, goals, and budget", "Validate heartbeat delivery and audit log capture"],
              color: 'border-blue-500/40 bg-blue-500/6',
            },
            {
              phase: 'Phase 2', duration: 'Week 2', title: 'Expand to All Agents',
              steps: ["Add Lex, Hal, Grant, Nora, Reid with their roles and budgets", "Define reporting hierarchy: who reports to whom", "Migrate task lock files to Paperclip tickets (keep lock files as fallback)", "Test cross-agent task delegation and atomic checkout"],
              color: 'border-yellow-500/40 bg-yellow-500/6',
            },
            {
              phase: 'Phase 3', duration: 'Week 3', title: 'Integrate With Mission Control',
              steps: ["Decide: embed Paperclip in Mission Control iframe, or link out", "Build per-agent cost widgets in Mission Control pulling from Paperclip API", "Archive old task lock file system (keep read-only backups)", "Kelly workflow update: ticket-first for cross-agent tasks"],
              color: 'border-orange-500/40 bg-orange-500/6',
            },
            {
              phase: 'Phase 4', duration: 'Week 4', title: 'Harden + Document',
              steps: ["Set up daily Postgres backups (Paperclip supports this natively)", "Write internal PAPERCLIP.md doc with our specific config and conventions", "Define what requires board approval vs. direct agent action", "Run a full audit and make sure no context fragmentation has crept in"],
              color: 'border-green-500/40 bg-green-500/6',
            },
          ].map((p) => (
            <div key={p.phase} className={`p-4 rounded-xl border ${p.color}`}>
              <div className="flex items-center gap-3 mb-3">
                <Tag color="gray">{p.phase}</Tag>
                <p className="text-white font-bold">{p.title}</p>
                <span className="ml-auto text-white/40 text-xs">{p.duration}</span>
              </div>
              <ul className="space-y-1">
                {p.steps.map((s, i) => (
                  <li key={i} className="text-white/70 text-sm flex gap-2">
                    <span className="text-white/30 shrink-0">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 15 ── Monitor + Revisit Triggers
  {
    id: 15,
    title: 'Monitor + Revisit Triggers',
    tag: 'When to Reopen This Deck',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">This isn't a permanent no. It's a "not yet" with defined conditions. Here's exactly when to revisit.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <SectionLabel>Trigger: Implement Immediately</SectionLabel>
            <div className="space-y-2">
              {[
                { trigger: 'We hit 10+ active agents', urgency: 'high' },
                { trigger: 'First confirmed cross-agent task conflict or double-work incident', urgency: 'high' },
                { trigger: 'Monthly API spend exceeds $500 and we can\'t attribute it by agent', urgency: 'high' },
                { trigger: 'Kelly requests formal org chart / reporting structure', urgency: 'medium' },
              ].map((t) => (
                <div key={t.trigger} className={`p-3 rounded-lg border flex gap-3 items-start ${t.urgency === 'high' ? 'border-red-500/30 bg-red-500/6' : 'border-yellow-500/30 bg-yellow-500/6'}`}>
                  <span className={`text-xs font-bold shrink-0 mt-0.5 ${t.urgency === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>{t.urgency === 'high' ? 'FIRE' : 'SOON'}</span>
                  <p className="text-white/80 text-sm">{t.trigger}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <SectionLabel>Trigger: Reassess Casually</SectionLabel>
            <div className="space-y-2">
              {[
                'Paperclip releases v1.0 or marks docs as complete',
                'Paperclip adds native Mission Control / Convex integration',
                'ClipMart launches (signals commercial maturity)',
                'Another Hit Network operator or peer company adopts it and reports back',
                'Q3 2026 planning: reassess tool stack regardless',
              ].map((t) => (
                <div key={t} className="p-3 rounded-lg border border-white/10 bg-white/4 flex gap-3 items-start">
                  <span className="text-blue-400 text-xs font-bold shrink-0 mt-0.5">WATCH</span>
                  <p className="text-white/70 text-sm">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Card>
          <SectionLabel>What We Build Now Instead</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-orange-500/8 border border-orange-500/20">
              <p className="text-orange-400 text-xs font-bold mb-1">Cost Tracker</p>
              <p className="text-white/60 text-xs">Per-agent spend widget in Mission Control. Native, no new service, immediate visibility.</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/8 border border-orange-500/20">
              <p className="text-orange-400 text-xs font-bold mb-1">Goal Hierarchy Doc</p>
              <p className="text-white/60 text-xs">MISSION.md: company mission to agent roles. All agents load it. Context without Paperclip.</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/8 border border-orange-500/20">
              <p className="text-orange-400 text-xs font-bold mb-1">Audit Log Skill</p>
              <p className="text-white/60 text-xs">Lightweight decision logging for all cross-agent tasks. File-based, searchable, no new infra.</p>
            </div>
          </div>
        </Card>
        <div className="text-center pt-2">
          <p className="text-white/30 text-xs">Paperclip Assessment | Hit Network Internal | Rex | March 2026</p>
          <p className="text-white/20 text-xs mt-1">Recommendation: NOT YET — Revisit at 10 agents | Confidence: 72%</p>
        </div>
      </div>
    ),
  },
];

// ── Main component ────────────────────────────────────────────────────────
export default function PaperclipAssessment() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const slide = slides[current];

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="border-b border-white/8 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/decks" className="text-white/40 hover:text-white/70 text-xs transition-colors">← Decks</a>
          <span className="text-white/20 text-xs">|</span>
          <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Paperclip Assessment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs">Slide {current + 1} of {total}</span>
          <div className="flex gap-1 ml-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'bg-orange-500 w-4 h-2' : 'bg-white/20 hover:bg-white/40 w-2 h-2'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Slide area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 py-8">

        {/* Slide header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-orange-500/60 text-xs font-bold tracking-widest uppercase">
              {String(slide.id).padStart(2, '0')}
            </span>
            {slide.tag && <Tag color="gray">{slide.tag}</Tag>}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{slide.title}</h1>
          <div className="mt-3 h-px bg-gradient-to-r from-orange-500/60 via-orange-500/20 to-transparent" />
        </div>

        {/* Slide content */}
        <div className="flex-1">
          {slide.content}
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div className="border-t border-white/8 px-6 py-4 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
        >
          ← Previous
        </button>

        <div className="text-center">
          <p className="text-white/30 text-xs">{slide.title}</p>
        </div>

        <button
          onClick={next}
          disabled={current === total - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
