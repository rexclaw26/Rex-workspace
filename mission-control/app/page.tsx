"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import TaskLauncher from "@/components/tasks/TaskLauncher";
import {
  Users, CheckSquare, DollarSign, AlertCircle,
  Zap, Brain, Activity, Clock, TrendingUp, TrendingDown,
  ChevronDown, ChevronUp,
} from "lucide-react";

// ── Agent definitions ─────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "rex",
    name: "Rex",
    owner: "Primary Agent",
    role: "Full-Stack AI Operations",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 28,
    totalSkills: 28,
    categories: ["content", "analytics", "technical", "admin"],
    skillCodes: undefined as string[] | undefined,
  },
  {
    id: "writer",
    name: "Writer",
    owner: "Content Pipeline",
    role: "Articles · Scripts · X Posts · Slides",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 8,
    totalSkills: 28,
    categories: ["content"],
    skillCodes: ["article", "xpost", "video", "slide", "thumb", "news", "weekly", "scheduling"],
  },
  {
    id: "analyst",
    name: "Analyst",
    owner: "Finance & Data",
    role: "P&L · Forecasting · DeFi · Web Data",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 5,
    totalSkills: 28,
    categories: ["analytics", "admin"],
    skillCodes: ["financial", "invoicing", "defi", "web-data", "strategic"],
  },
  {
    id: "monitor",
    name: "Monitor",
    owner: "Intelligence Feed",
    role: "News · Prices · Discord Analytics",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 4,
    totalSkills: 28,
    categories: ["analytics", "technical"],
    skillCodes: ["discord-analytics", "web-data", "news", "financial"],
  },
  {
    id: "builder",
    name: "Builder",
    owner: "Technical Dev",
    role: "Web · Discord Bots · Mission Control",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 4,
    totalSkills: 28,
    categories: ["technical"],
    skillCodes: ["website", "discord-bot", "mission", "scheduling"],
  },
  {
    id: "closer",
    name: "Closer",
    owner: "Growth & Outreach",
    role: "Sponsors · Partnerships · Strategy",
    model: "Claude Sonnet 4.6",
    status: "active" as const,
    skills: 3,
    totalSkills: 28,
    categories: ["admin"],
    skillCodes: ["sponsor", "strategic", "invoicing"],
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

// ── Q2 Rocks — labels only; % requires Kelly input each Monday ────────────
const ROCKS = [
  { label: "AI Content Pipeline", color: "var(--orange)" },
  { label: "Newsletter $10K MRR", color: "var(--green)"  },
  { label: "Digital Products",    color: "var(--blue)"   },
  { label: "Members App MVP",     color: "#A78BFA"       },
];

// ── "User input needed" badge ─────────────────────────────────────────────
function InputNeeded() {
  return (
    <span style={{
      background:    "rgba(245,158,11,0.12)",
      border:        "1px solid rgba(245,158,11,0.35)",
      color:         "#F59E0B",
      fontSize:      "9px",
      fontFamily:    "var(--font-data)",
      fontWeight:    700,
      letterSpacing: "0.06em",
      textTransform: "uppercase" as const,
      padding:       "2px 7px",
      borderRadius:  "4px",
      whiteSpace:    "nowrap" as const,
    }}>
      User input needed
    </span>
  );
}

// ── Mobile detection ───────────────────────────────────────────────────────
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

// ── Mobile section type ────────────────────────────────────────────────────
type DashMobileSection = "agents" | "queue" | "activity" | "rocks" | null;

// ── Mobile accordion button ────────────────────────────────────────────────
function MobileAccordionButton({
  label, active, sub, onClick,
}: {
  label: string; active: boolean; sub?: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
      style={{
        background:    active ? "rgba(249,115,22,0.1)"  : "rgba(255,255,255,0.03)",
        border:        `1px solid ${active ? "rgba(249,115,22,0.4)" : "var(--border-subtle)"}`,
        color:         active ? "var(--orange)" : "var(--text-muted)",
        fontFamily:    "var(--font-display)",
        fontSize:      "12px",
        fontWeight:    700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor:        "pointer",
      }}
    >
      <div className="flex flex-col items-start gap-0.5">
        <span>{label}</span>
        {sub && (
          <span style={{
            fontSize: "10px", fontFamily: "var(--font-data)",
            textTransform: "none", letterSpacing: 0,
            color: active ? "rgba(249,115,22,0.7)" : "var(--text-muted)",
          }}>
            {sub}
          </span>
        )}
      </div>
      {active ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
    </button>
  );
}

// ── BTC / ETH live mini-cards ─────────────────────────────────────────────
function LivePriceMini({ fullWidth }: { fullWidth?: boolean }) {
  const [btc, setBtc] = useState<{ price: number; change24h: number } | null>(null);
  const [eth, setEth] = useState<{ price: number; change24h: number } | null>(null);

  const load = useCallback(async () => {
    try {
      const res  = await fetch("/api/prices");
      const data = await res.json();
      if (data.ok && data.prices) {
        const b = data.prices.find((p: any) => p.symbol === "BTC");
        const e = data.prices.find((p: any) => p.symbol === "ETH");
        if (b) setBtc({ price: b.price, change24h: b.change24h });
        if (e) setEth({ price: e.price, change24h: e.change24h });
      }
    } catch { /* silent fail */ }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const id = setInterval(load, 5 * 60_000);
    return () => clearInterval(id);
  }, [load]);

  if (!btc && !eth) return null;

  return (
    <div className={fullWidth ? "grid grid-cols-2 gap-2" : "flex items-center gap-2"}>
      {[{ label: "BTC", data: btc }, { label: "ETH", data: eth }].map(({ label, data }) => {
        if (!data) return null;
        const pos   = data.change24h >= 0;
        const col   = pos ? "var(--green)" : "var(--red)";
        const bg    = pos ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)";
        const bdr   = pos ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)";
        const price = data.price >= 10000
          ? "$" + data.price.toLocaleString("en-US", { maximumFractionDigits: 0 })
          : "$" + data.price.toLocaleString("en-US", { maximumFractionDigits: 2 });
        const change = `${pos ? "+" : ""}${data.change24h.toFixed(1)}%`;
        return (
          <div key={label}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl ${fullWidth ? "justify-between" : ""}`}
            style={{ background: bg, border: `1px solid ${bdr}` }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: "var(--orange)", letterSpacing: "0.06em" }}>
              {label}
            </span>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              {price}
            </span>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: 700, color: col }}>
              {change}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Animated Progress Bar ──────────────────────────────────────────────────
function ProgressBar({ pct, color, glow }: { pct: number; color: string; glow?: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(id);
  }, [pct]);
  return (
    <div style={{
      height: "4px", width: "100%", borderRadius: "9999px",
      overflow: "hidden", background: "rgba(255,255,255,0.06)",
    }}>
      <div style={{
        height: "100%", width: `${width}%`, borderRadius: "9999px",
        background: color, boxShadow: glow ?? `0 0 6px ${color}`,
        transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  );
}

// ── Relative Time ──────────────────────────────────────────────────────────
function relTime(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function useCurrentTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: true, timeZoneName: "short",
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ── Compact mobile agent row ───────────────────────────────────────────────
function AgentRowMobile({
  agent, lastTask, onLaunch,
}: {
  agent: typeof AGENTS[0];
  lastTask?: string;
  onLaunch: () => void;
}) {
  return (
    <div className="mc-card px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)" }}>
          <Brain className="w-3.5 h-3.5" style={{ color: "var(--orange)" }} />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--text-orange)" }}>
            {agent.name}
          </span>
          <Badge variant="active">active</Badge>
        </div>
        <button className="btn-launch shrink-0" onClick={onLaunch}>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Launch
          </span>
        </button>
      </div>
      <div className="flex items-center justify-between mt-2 pl-10">
        <p className="text-[11px] truncate" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
          {agent.role}
        </p>
        {lastTask && (
          <span className="text-[10px] shrink-0 ml-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
            {lastTask}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, sub, valueClass, trend, compact,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  valueClass: string;
  trend?: "up" | "down";
  compact?: boolean;
}) {
  return (
    <div className="mc-card" style={{ padding: compact ? "12px 14px" : "20px" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-label" style={{ fontSize: compact ? "9px" : undefined }}>{label}</span>
        <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      </div>
      <div className="flex items-end gap-1.5">
        <span
          className={`font-bold ${valueClass}`}
          style={{ fontFamily: "var(--font-display)", lineHeight: 1, fontSize: compact ? "20px" : "24px" }}
        >
          {value}
        </span>
        {trend && (
          trend === "up"
            ? <TrendingUp  className="w-3.5 h-3.5 mb-0.5" style={{ color: "var(--green)" }} />
            : <TrendingDown className="w-3.5 h-3.5 mb-0.5" style={{ color: "var(--text-muted)" }} />
        )}
      </div>
      <p style={{ fontSize: compact ? "9px" : "11px", marginTop: "6px", color: "var(--text-muted)" }}>{sub}</p>
    </div>
  );
}

// ── Agent Card (desktop) ───────────────────────────────────────────────────
// Skills display: "X skills assigned" for sub-agents (static config, not runtime state).
// Rex is the only agent with full library access (all 28 skills).
// "Configured" = agent is set up and accessible; no live heartbeat exists yet (Fix 7 pending).
function AgentCard({
  agent, onLaunch, lastTask,
}: {
  agent: typeof AGENTS[0];
  onLaunch: () => void;
  lastTask?: string;
}) {
  // Skill display — honest labels, no misleading X/28 ratio
  const skillLabel = agent.id === "rex"
    ? "28 skills · full library"
    : `${agent.skills} skills assigned`;

  // Status label — "Online" only for Rex (primary agent with session). Others are configured.
  const statusLabel = agent.id === "rex" ? "Online" : "Configured";
  const statusColor = agent.id === "rex" ? "var(--green)" : "var(--text-muted)";

  return (
    <div className="mc-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold" style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--text-orange)", letterSpacing: "0.04em" }}>
              {agent.name}
            </h3>
            <Badge variant="active">active</Badge>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
            {agent.owner} · {agent.role}
          </p>
        </div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)" }}>
          <Brain className="w-4 h-4" style={{ color: "var(--orange)" }} />
        </div>
      </div>

      {/* Model + status */}
      <div className="flex items-center justify-between text-[11px]">
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>{agent.model}</span>
        <span style={{ color: statusColor, fontFamily: "var(--font-data)", fontWeight: 700 }}>{statusLabel}</span>
      </div>

      {/* Skills — plain text, no progress bar (static config, not a tracked metric) */}
      <div className="flex items-center justify-between">
        <span className="text-label">Skills</span>
        <span className="text-[11px] font-semibold" style={{ color: "var(--text-taupe)", fontFamily: "var(--font-data)" }}>
          {skillLabel}
        </span>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {agent.categories.map((cat) => (
          <span key={cat} className={`skill-pill ${CATEGORY_COLORS[cat]}`}>{CATEGORY_LABELS[cat]}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[--border-subtle]">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
          <span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
            {lastTask ?? "No tasks yet"}
          </span>
        </div>
        <button className="btn-launch" onClick={onLaunch}>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Launch Task
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Task queue shared content ──────────────────────────────────────────────
function TaskQueueContent({ tasks }: { tasks: any[] }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-6">
        <CheckSquare className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>No tasks yet</p>
        <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>Launch a task from any agent card</p>
      </div>
    );
  }
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
      {tasks.slice(0, 8).map((task: any) => (
        <div key={task._id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{
            background: task.status === "in_progress" ? "var(--green)"
              : task.status === "done" ? "var(--text-muted)"
              : "var(--orange)",
          }} />
          <p className="text-xs truncate flex-1" style={{ color: "var(--text-primary)" }}>{task.title}</p>
          <span className="text-[10px] shrink-0" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
            {task.agentCodename}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Recent activity — real Convex task data ────────────────────────────────
function RecentActivityContent({ tasks }: { tasks: any[] }) {
  const recent = useMemo(() => {
    return [...tasks]
      .sort((a: any, b: any) => b.updatedAt - a.updatedAt)
      .slice(0, 6);
  }, [tasks]);

  if (recent.length === 0) {
    return (
      <div className="text-center py-4">
        <Activity className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>No activity yet</p>
        <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>Activity populates as tasks are created and updated</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recent.map((task: any) => {
        const dotColor =
          task.status === "done"        ? "var(--green)"
          : task.status === "in_progress" ? "var(--blue)"
          : task.status === "blocked"     ? "var(--red)"
          : "var(--orange)";
        return (
          <div key={task._id} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: dotColor }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-relaxed truncate" style={{ color: "var(--text-primary)" }}>
                {task.agentCodename} — {task.title}
              </p>
            </div>
            <span className="text-[10px] shrink-0" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
              {relTime(task.updatedAt)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Q2 Rocks — user input required for % ──────────────────────────────────
function RocksContent() {
  return (
    <div className="space-y-3">
      {ROCKS.map((rock) => (
        <div key={rock.label} className="flex items-center justify-between gap-3 py-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: rock.color }} />
            <span className="text-[11px] truncate" style={{ color: "var(--text-taupe)" }}>{rock.label}</span>
          </div>
          <InputNeeded />
        </div>
      ))}
      <p className="text-[9px] pt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
        Updated each Monday — provide % to Kelly
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const isMobile    = useIsMobile();
  const currentTime = useCurrentTime();

  const [launcher,   setLauncher]   = useState<{ agentName: string; skillCodes?: string[] } | null>(null);
  const [mobileOpen, setMobileOpen] = useState<DashMobileSection>("agents");
  const [spendMtd,   setSpendMtd]   = useState<number | null>(null);

  const toggleSection = useCallback((s: DashMobileSection) => {
    setMobileOpen((prev) => (prev === s ? null : s));
  }, []);

  // ── Fetch real MTD spend ──────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/spend")
      .then((r) => r.json())
      .then((d) => { if (d.ok && typeof d.currentMonthTotal === "number") setSpendMtd(d.currentMonthTotal); })
      .catch(() => {});
  }, []);

  const tasks = useQuery(api.tasks.getAll) ?? [];

  const agentLastTask = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of tasks) {
      const key = t.agentCodename.toLowerCase();
      if (!map[key] || t.updatedAt > map[key]) map[key] = t.updatedAt;
    }
    return map;
  }, [tasks]);

  const activeTasks  = tasks.filter((t) => t.status === "in_progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "todo").length;
  const agentsOnline = AGENTS.filter((a) => a.status === "active").length;

  // Real error count — update manually each time a journal entry is added
  // Last updated: 2026-03-07 (entry 13 added — PR-015 LAW 9 missed alert)
  const ERROR_COUNT = 13;

  const spendDisplay = spendMtd !== null
    ? "$" + spendMtd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const todayShort = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP HEADER
      ═══════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title text-lg mb-0.5">Mission Control</h1>
            <p className="text-label">{today}</p>
          </div>
          <LivePriceMini />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                {currentTime}
              </p>
              <p className="text-label">Pacific Time</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <div className="dot-online" style={{ width: 6, height: 6 }} />
              <span className="text-xs font-semibold" style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}>
                All Systems Configured
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MOBILE HEADER
      ═══════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title text-lg mb-0.5">Mission Control</h1>
              <p className="text-label">{todayShort}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <div className="dot-online" style={{ width: 6, height: 6 }} />
              <span className="text-xs font-semibold" style={{ color: "var(--green)", fontFamily: "var(--font-data)" }}>
                Online
              </span>
            </div>
          </div>
          <LivePriceMini fullWidth />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          STAT CARDS — always visible
      ═══════════════════════════════════════════════════════════ */}
      <div className={isMobile ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 lg:grid-cols-4 gap-4"}>
        <StatCard
          icon={<Users className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} />}
          label="Agents"
          value={`${agentsOnline}/6`}
          sub="Configured · no live heartbeat"
          valueClass="stat-positive"
          compact={isMobile}
        />
        <StatCard
          icon={<CheckSquare className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} />}
          label="Active Tasks"
          value={activeTasks + pendingTasks}
          sub={`${activeTasks} running · ${pendingTasks} queued`}
          valueClass="stat-orange"
          compact={isMobile}
        />
        <StatCard
          icon={<DollarSign className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} />}
          label="MTD AI Spend"
          value={spendDisplay}
          sub="March 2026 · all providers"
          valueClass="stat-neutral"
          compact={isMobile}
        />
        <StatCard
          icon={<AlertCircle className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} />}
          label="Errors Logged"
          value={ERROR_COUNT}
          sub="13 entries · 15 preventive rules"
          valueClass="stat-positive"
          trend="down"
          compact={isMobile}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP MAIN GRID
      ═══════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Agent Roster — 2/3 */}
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="page-title text-xs">Agent Roster</h2>
              <span className="text-label">{agentsOnline} / 6 active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AGENTS.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  lastTask={agentLastTask[agent.id] ? relTime(agentLastTask[agent.id]) : undefined}
                  onLaunch={() => setLauncher({ agentName: agent.name, skillCodes: agent.skillCodes })}
                />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Task Queue */}
            <div className="mc-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-orange)", fontFamily: "var(--font-display)" }}>
                  Task Queue
                </h3>
                <span className="text-label">{tasks.length} total</span>
              </div>
              <TaskQueueContent tasks={tasks} />
            </div>

            {/* Recent Activity — real task data */}
            <div className="mc-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-orange)", fontFamily: "var(--font-display)" }}>
                  Recent Activity
                </h3>
                <Activity className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
              </div>
              <RecentActivityContent tasks={tasks} />
            </div>

            {/* Q2 Rocks */}
            <div className="mc-card p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-orange)", fontFamily: "var(--font-display)" }}>
                Q2 Rock Progress
              </h3>
              <RocksContent />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MOBILE ACCORDION SECTIONS
      ═══════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div className="space-y-3">

          {/* AGENTS */}
          <MobileAccordionButton
            label="Agents" sub={`${agentsOnline}/6 active`}
            active={mobileOpen === "agents"} onClick={() => toggleSection("agents")}
          />
          {mobileOpen === "agents" && (
            <div className="space-y-2">
              {AGENTS.map((agent) => (
                <AgentRowMobile
                  key={agent.id}
                  agent={agent}
                  lastTask={agentLastTask[agent.id] ? relTime(agentLastTask[agent.id]) : undefined}
                  onLaunch={() => setLauncher({ agentName: agent.name, skillCodes: agent.skillCodes })}
                />
              ))}
            </div>
          )}

          {/* TASK QUEUE */}
          <MobileAccordionButton
            label="Task Queue" sub={`${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
            active={mobileOpen === "queue"} onClick={() => toggleSection("queue")}
          />
          {mobileOpen === "queue" && (
            <div className="mc-card p-4">
              <TaskQueueContent tasks={tasks} />
            </div>
          )}

          {/* ACTIVITY */}
          <MobileAccordionButton
            label="Activity" sub={`${Math.min(tasks.length, 6)} recent items`}
            active={mobileOpen === "activity"} onClick={() => toggleSection("activity")}
          />
          {mobileOpen === "activity" && (
            <div className="mc-card p-4">
              <RecentActivityContent tasks={tasks} />
            </div>
          )}

          {/* Q2 ROCKS */}
          <MobileAccordionButton
            label="Q2 Rocks" sub="Mar – Jun 2026"
            active={mobileOpen === "rocks"} onClick={() => toggleSection("rocks")}
          />
          {mobileOpen === "rocks" && (
            <div className="mc-card p-4">
              <RocksContent />
            </div>
          )}

        </div>
      )}

      {/* ── Task Launcher Modal ──────────────────────────────────── */}
      {launcher && (
        <TaskLauncher
          agentName={launcher.agentName}
          agentSkills={launcher.skillCodes}
          onClose={() => setLauncher(null)}
        />
      )}
    </div>
  );
}
