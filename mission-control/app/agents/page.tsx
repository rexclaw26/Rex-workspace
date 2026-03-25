"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Brain, CheckSquare, ChevronDown, ChevronUp } from "lucide-react";

// ── Agent definitions ─────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "rex",
    name: "Rex",
    codename: "Rex",
    owner: "Primary Agent",
    role: "Full-Stack AI Operations",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 28,
    totalSkills: 28,
    uptime: 99.9,
    categories: ["content", "analytics", "technical", "admin"],
    description:
      "Kelly's primary AI agent. Handles all 28 skills across content creation, financial analysis, market intelligence, technical builds, outreach, and operations.",
    skillList: [
      "Article Writing", "X Post Automator", "Video Editing", "Slide Deck Generator",
      "Thumbnail Generator", "News Aggregation", "Weekly Scorecard", "Scheduling Optimizer",
      "Email Assistant", "Financial Analysis", "Invoicing & Billing", "DeFi Trade Tracking",
      "Web Data → Spreadsheet", "Discord Analytics", "Discord Bot", "Sponsor Outreach",
      "Strategic Consulting", "Website Design", "Mission Control", "Content Pipeline",
      "Email Signature", "Hit Network Integrator", "Humanization Voice", "Role Identity",
      "Injection Defense", "Error Journal", "Adaptive Rule Engine", "Compliance Audit",
    ],
  },
  {
    id: "writer",
    name: "Writer",
    codename: "Rex",
    owner: "Content Pipeline",
    role: "Articles · Scripts · X Posts · Slides",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 8,
    totalSkills: 28,
    uptime: 99.7,
    categories: ["content"],
    description:
      "Content creation pipeline. Produces articles, YouTube scripts, X post variants, slide decks, thumbnails, and weekly scorecards from market data.",
    skillList: [
      "Article Writing", "X Post Automator", "Video Editing Director",
      "Slide Deck Generator", "Thumbnail Generator",
      "News Aggregation", "Weekly Scorecard", "Scheduling Optimizer",
    ],
  },
  {
    id: "analyst",
    name: "Analyst",
    codename: "Rex",
    owner: "Finance & Data",
    role: "P&L · Forecasting · DeFi · Web Data",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 5,
    totalSkills: 28,
    uptime: 99.8,
    categories: ["analytics", "admin"],
    description:
      "Financial intelligence agent. Handles P&L modeling, forecasting, DeFi trade tracking, invoicing, AR management, and structured data extraction.",
    skillList: [
      "Financial Analysis & Modeling", "Invoicing & Billing Tracker",
      "DeFi Trade Tracking", "Web Data → Spreadsheet", "Strategic Consulting",
    ],
  },
  {
    id: "monitor",
    name: "Monitor",
    codename: "Rex",
    owner: "Intelligence Feed",
    role: "News · Prices · Discord Analytics",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 4,
    totalSkills: 28,
    uptime: 99.6,
    categories: ["analytics", "technical"],
    description:
      "Market intelligence monitor. Aggregates news from RSS feeds, tracks asset prices, analyzes Discord community health, and flags breaking stories.",
    skillList: [
      "News Aggregation", "Discord Analytics",
      "Web Data → Spreadsheet", "Financial Analysis",
    ],
  },
  {
    id: "builder",
    name: "Builder",
    codename: "Rex",
    owner: "Technical Dev",
    role: "Web · Discord Bots · Mission Control",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 4,
    totalSkills: 28,
    uptime: 99.5,
    categories: ["technical"],
    description:
      "Technical development agent. Builds and maintains web properties, Discord bots, the Mission Control dashboard, and automation integrations.",
    skillList: [
      "Website Design (Full-Stack)", "Discord Bot Automation",
      "Mission Control", "Scheduling Optimizer",
    ],
  },
  {
    id: "closer",
    name: "Closer",
    codename: "Rex",
    owner: "Growth & Outreach",
    role: "Sponsors · Partnerships · Strategy",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 3,
    totalSkills: 28,
    uptime: 99.4,
    categories: ["admin"],
    description:
      "Revenue and growth agent. Researches sponsor prospects, drafts outreach campaigns, builds pitch materials, and manages the sponsorship pipeline.",
    skillList: [
      "Sponsor Outreach Engine", "Strategic Consulting", "Invoicing & Billing Tracker",
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  content:   "skill-pill-content",
  analytics: "skill-pill-analytics",
  technical: "skill-pill-technical",
  admin:     "skill-pill-admin",
};

const CATEGORY_LABELS: Record<string, string> = {
  content:   "Content",
  analytics: "Analytics",
  technical: "Technical",
  admin:     "Admin",
};

const STATUS_COLORS: Record<string, string> = {
  in_progress: "var(--green)",
  todo:        "var(--orange)",
  done:        "var(--text-muted)",
  blocked:     "var(--red)",
};

// ── Mobile detection ──────────────────────────────────────────────────────────
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

// ── Agent Detail Card ─────────────────────────────────────────────────────────
function AgentDetailCard({
  agent, isMobile,
}: {
  agent: typeof AGENTS[0];
  isMobile: boolean;
}) {
  const [expanded, setExpanded] = useState(agent.id === "rex");
  const tasks      = useQuery(api.tasks.getAll) ?? [];
  const agentTasks = tasks.filter((t: any) => t.agentCodename === agent.codename);
  const active     = agentTasks.filter((t: any) => t.status === "in_progress").length;
  const queued     = agentTasks.filter((t: any) => t.status === "todo").length;
  const done       = agentTasks.filter((t: any) => t.status === "done").length;
  const skillPct   = Math.round((agent.skills / agent.totalSkills) * 100);
  const isRex      = agent.id === "rex";

  const iconBg     = isRex ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.04)";
  const iconBorder = isRex ? "1px solid rgba(249,115,22,0.25)" : "1px solid var(--border-card)";
  const iconColor  = isRex ? "var(--orange)" : "var(--text-muted)";

  return (
    <div
      className="mc-card overflow-hidden"
      style={isRex ? { borderColor: "rgba(249,115,22,0.35)", boxShadow: "0 0 20px rgba(249,115,22,0.06)" } : {}}
    >
      <div className={isMobile ? "p-4" : "p-5"}>

        {/* ══ DESKTOP HEADER ══════════════════════════════════════════════════ */}
        {!isMobile && (
          <div className="flex items-start justify-between gap-4">
            {/* Left: icon + info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: iconBg, border: iconBorder }}>
                <Brain className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 800, color: "var(--text-orange)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {agent.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "var(--green)", fontFamily: "var(--font-data)" }}>
                    ACTIVE
                  </span>
                  {isRex && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "var(--orange)", fontFamily: "var(--font-data)" }}>
                      PRIMARY
                    </span>
                  )}
                </div>
                <p className="text-[12px] mb-1" style={{ color: "var(--text-taupe)" }}>{agent.role}</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                  {agent.owner} · {agent.model}
                </p>
              </div>
            </div>

            {/* Right: task counts + uptime + expand */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-3 text-center">
                {[
                  { label: "Active", count: active, color: "var(--green)"      },
                  { label: "Queued", count: queued, color: "var(--orange)"     },
                  { label: "Done",   count: done,   color: "var(--text-muted)" },
                ].map(({ label, count, color }) => (
                  <div key={label}>
                    <p style={{ fontFamily: "var(--font-data)", fontSize: "17px", fontWeight: 700, color, lineHeight: 1 }}>
                      {count}
                    </p>
                    <p className="text-label mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <p style={{ fontFamily: "var(--font-data)", fontSize: "14px", fontWeight: 700, color: agent.uptime >= 99.5 ? "var(--green)" : "var(--amber)", lineHeight: 1 }}>
                  {agent.uptime}%
                </p>
                <p className="text-label mt-0.5">uptime</p>
              </div>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="p-2 rounded-lg transition-colors"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", cursor: "pointer" }}
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* ══ MOBILE HEADER ════════════════════════════════════════════════════ */}
        {isMobile && (
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: iconBg, border: iconBorder }}>
              <Brain className="w-4 h-4" style={{ color: iconColor }} />
            </div>

            {/* Info + chevron */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                {/* Name + badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: "var(--text-orange)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {agent.name}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "var(--green)", fontFamily: "var(--font-data)" }}>
                    ACTIVE
                  </span>
                  {isRex && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                      style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "var(--orange)", fontFamily: "var(--font-data)" }}>
                      PRIMARY
                    </span>
                  )}
                </div>
                {/* Expand button */}
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="p-1.5 rounded-lg shrink-0"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-taupe)" }}>{agent.role}</p>
              <p className="text-[10.5px] mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                {agent.owner} · {agent.model}
              </p>
            </div>
          </div>
        )}

        {/* ── Skills bar — both layouts ───────────────────────────────────── */}
        <div className={isMobile ? "mt-3" : "mt-4"}>
          <div className="flex justify-between mb-1.5">
            <span className="text-label">Skills Loaded</span>
            <span className="text-[11px] font-semibold" style={{ color: "var(--text-taupe)", fontFamily: "var(--font-data)" }}>
              {agent.skills} / {agent.totalSkills}
            </span>
          </div>
          <div style={{ height: "4px", width: "100%", borderRadius: "9999px", overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
            <div style={{
              height: "100%", width: `${skillPct}%`, borderRadius: "9999px",
              background: "linear-gradient(90deg, #F97316, #FB923C)",
              boxShadow: "0 0 6px rgba(249,115,22,0.4)",
            }} />
          </div>
        </div>

        {/* ── Category pills — both ──────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {agent.categories.map((cat) => (
            <span key={cat} className={`skill-pill ${CATEGORY_COLORS[cat]}`}>
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>

        {/* ── Mobile stats row — below pills ──────────────────────────────── */}
        {isMobile && (
          <div className="flex items-center gap-4 mt-3 pt-2.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            {[
              { label: "Active", count: active, color: "var(--green)"      },
              { label: "Queued", count: queued, color: "var(--orange)"     },
              { label: "Done",   count: done,   color: "var(--text-muted)" },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span style={{ fontFamily: "var(--font-data)", fontSize: "13px", fontWeight: 700, color }}>
                  {count}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{label}</span>
              </div>
            ))}
            {/* Uptime pushed right */}
            <div className="flex items-center gap-1 ml-auto">
              <span style={{
                fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: 700,
                color: agent.uptime >= 99.5 ? "var(--green)" : "var(--amber)",
              }}>
                {agent.uptime}%
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>uptime</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Expanded: description + skills + tasks ─────────────────────────── */}
      {expanded && (
        <div className={isMobile ? "px-4 pb-4" : "px-5 pb-5"} style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className={`mt-4 gap-4 ${isMobile ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-2"}`}>
            {/* Description + skill list */}
            <div>
              <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "var(--text-taupe)" }}>
                {agent.description}
              </p>
              <p className="text-label mb-2">Loaded Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.skillList.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[10px]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent tasks */}
            <div>
              <p className="text-label mb-2">Recent Tasks</p>
              {agentTasks.length === 0 ? (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}>
                  <CheckSquare className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                  <p className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                    No tasks yet — launch from dashboard
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {agentTasks.slice(0, 8).map((task: any) => (
                    <div key={task._id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                        style={{ background: STATUS_COLORS[task.status] ?? "var(--text-muted)" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11.5px] leading-snug truncate" style={{ color: "var(--text-primary)" }}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                            {task.status.replace("_", " ")}
                          </span>
                          {task.skill && (
                            <span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                              · {task.skill}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] shrink-0"
                        style={{ color: task.priority === "high" ? "var(--orange)" : "var(--text-muted)", fontFamily: "var(--font-data)", fontWeight: 700 }}>
                        {task.priority?.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const isMobile  = useIsMobile();
  const tasks     = useQuery(api.tasks.getAll) ?? [];
  const total     = tasks.length;
  const active    = tasks.filter((t: any) => t.status === "in_progress").length;
  const queued    = tasks.filter((t: any) => t.status === "todo").length;
  const completed = tasks.filter((t: any) => t.status === "done").length;

  const statItems = [
    { label: "Total Tasks", value: total,     color: "var(--text-taupe)" },
    { label: "Active",      value: active,    color: "var(--green)"      },
    { label: "Queued",      value: queued,    color: "var(--orange)"     },
    { label: "Completed",   value: completed, color: "var(--text-muted)" },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className={isMobile ? "space-y-3" : "flex items-center justify-between"}>
        <div>
          <h1 className="page-title text-lg mb-0.5">Agents</h1>
          <p className="text-label">6 agents active · full diagnostics and task history</p>
        </div>

        {/* Desktop: inline stat row */}
        {!isMobile && (
          <div className="flex items-center gap-6">
            {statItems.map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p style={{ fontFamily: "var(--font-data)", fontSize: "20px", fontWeight: 700, color, lineHeight: 1 }}>
                  {value}
                </p>
                <p className="text-label mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mobile: 2×2 stat grid */}
        {isMobile && (
          <div className="grid grid-cols-2 gap-2">
            {statItems.map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "18px", fontWeight: 700, color, lineHeight: 1 }}>
                  {value}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.3 }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Agent cards ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {AGENTS.map((agent) => (
          <AgentDetailCard key={agent.id} agent={agent} isMobile={isMobile} />
        ))}
      </div>

    </div>
  );
}
