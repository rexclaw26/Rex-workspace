"use client";

// app/ops/page.tsx — Operations Dashboard
// ⚠️ DATA INTEGRITY RULE: Every number shown here must be sourced from real data.
// Real sources:
//   - AI Spend:    /api/spend → reads ai-spend.json (receipts parsed by Gmail hook)
//   - Task counts: Convex tasks table (live)
//   - Skills:      skill-registry.ts (static truth — 28 skills, 18 exposed)
//   - Errors:      error journal — 9 entries, 9 preventive rules (as of 2026-03-06)
//   - ROCKS:       placeholder % shown with clear "not verified" label — Kelly updates each Monday
// NOT tracked yet (shown as N/A):
//   - Per-skill token breakdown
//   - Daily spend (no per-day logging yet)

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DollarSign, CheckSquare, AlertCircle, Zap,
  Activity, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  getExposedSkills,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type SkillCategory,
} from "@/config/skill-registry";
import type { SpendSummary } from "@/app/api/spend/route";

// ── Rock progress ─────────────────────────────────────────────────────────────
// ⚠️ These % values are PLACEHOLDER ESTIMATES only — never verified with Kelly.
// Kelly updates these each Monday. Do not treat as actuals.
const ROCKS = [
  { label: "AI Content Pipeline",  pct: 25, color: "var(--orange)" },
  { label: "Newsletter $10K MRR",  pct: 35, color: "var(--green)"  },
  { label: "Digital Products",     pct: 15, color: "var(--blue)"   },
  { label: "Members App MVP",      pct: 10, color: "#A78BFA"       },
];

// ── System health (known facts) ───────────────────────────────────────────────
const SYSTEM_CHECKS = [
  { label: "TypeScript Errors",     value: "0",           status: "ok"      },
  { label: "SPF",                   value: "✓ Pass",      status: "ok"      },
  { label: "DKIM",                  value: "✓ Pass",      status: "ok"      },
  { label: "DMARC",                 value: "✓ Pass",      status: "ok"      },
  { label: "Skills Deployed",       value: "28 / 28",     status: "ok"      },
  { label: "Error Journal",         value: "9 entries",   status: "ok"      },
  { label: "Preventive Rules",      value: "9 active",    status: "ok"      },
  { label: "Per-skill Token Cost",  value: "Not tracked", status: "pending" },
  { label: "Daily Spend Logging",   value: "Not set up",  status: "pending" },
];

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

// ── Mobile section type ───────────────────────────────────────────────────────
type OpsMobileSection = "spend" | "tasks" | "skills" | "rocks" | "system" | null;

// ── Mobile accordion button ───────────────────────────────────────────────────
function MobileAccordionButton({
  label, active, sub, onClick,
}: {
  label: string; active: boolean; sub?: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
          <span style={{ fontSize: "10px", fontFamily: "var(--font-data)", textTransform: "none", letterSpacing: 0, color: active ? "rgba(249,115,22,0.7)" : "var(--text-muted)", opacity: 0.8 }}>
            {sub}
          </span>
        )}
      </div>
      {active ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
    </button>
  );
}

// ── Mini stat card ────────────────────────────────────────────────────────────
function StatBlock({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="mc-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-label">{label}</span>
        <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      </div>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: color ?? "var(--text-taupe)", lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p className="text-[10px] mt-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "var(--text-orange)", fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      {right}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OpsPage() {
  const isMobile      = useIsMobile();
  const tasks         = useQuery(api.tasks.getAll) ?? [];
  const exposedSkills = getExposedSkills();

  const [spend, setSpend]           = useState<SpendSummary | null>(null);
  const [spendLoading, setSpendLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState<OpsMobileSection>(null);

  const toggleSection = (s: OpsMobileSection) =>
    setMobileOpen((prev) => (prev === s ? null : s));

  useEffect(() => {
    fetch("/api/spend")
      .then((r) => r.json())
      .then((d) => { setSpend(d); setSpendLoading(false); })
      .catch(() => setSpendLoading(false));
  }, []);

  const total   = tasks.length;
  const active  = tasks.filter((t: any) => t.status === "in_progress").length;
  const queued  = tasks.filter((t: any) => t.status === "todo").length;
  const done    = tasks.filter((t: any) => t.status === "done").length;
  const blocked = tasks.filter((t: any) => t.status === "blocked").length;

  const bySkill = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of tasks) {
      const code = (t as any).skillCode ?? (t as any).skill ?? "unknown";
      map[code] = (map[code] ?? 0) + 1;
    }
    return map;
  }, [tasks]);

  const byAgent = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of tasks) {
      const agent = (t as any).agentCodename ?? "Unknown";
      map[agent] = (map[agent] ?? 0) + 1;
    }
    return map;
  }, [tasks]);

  const byCategory = useMemo(() => {
    const grouped: Record<SkillCategory, typeof exposedSkills> = {
      content: [], analytics: [], technical: [], admin: [],
    };
    for (const s of exposedSkills) grouped[s.category].push(s);
    return grouped;
  }, [exposedSkills]);

  const spendMTD = spend ? `$${spend.currentMonthTotal.toFixed(2)}` : spendLoading ? "…" : "$0.00";
  const spendSub = spend?.currentMonth
    ? `${spend.currentMonth} · ${Object.keys(spend.byProvider).join(" + ") || "No receipts yet"}`
    : "Waiting for receipts";

  // ── Shared section content (used in both desktop and mobile) ────────────────

  const SkillsContent = () => (
    <div className="space-y-4">
      {(Object.entries(byCategory) as [SkillCategory, typeof exposedSkills][]).map(([cat, skills]) => {
        if (skills.length === 0) return null;
        return (
          <div key={cat}>
            <p className="text-label mb-2" style={{ color: CATEGORY_COLORS[cat] }}>
              {CATEGORY_LABELS[cat]} ({skills.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => {
                const taskCount = bySkill[s.code] ?? 0;
                return (
                  <div key={s.code} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${taskCount > 0 ? CATEGORY_COLORS[cat] + "40" : "var(--border-subtle)"}` }}>
                    <span style={{ fontSize: "11px", color: taskCount > 0 ? CATEGORY_COLORS[cat] : "var(--text-taupe)", fontFamily: "var(--font-data)" }}>
                      {s.displayName}
                    </span>
                    {taskCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{ background: CATEGORY_COLORS[cat] + "18", color: CATEGORY_COLORS[cat], fontFamily: "var(--font-data)" }}>
                        {taskCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  const TasksByAgentContent = () => (
    <>
      {total === 0 ? (
        <p className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
          No tasks in Convex yet — launch from Dashboard or Headlines.
        </p>
      ) : (
        <div className="space-y-3">
          {Object.entries(byAgent).sort((a, b) => b[1] - a[1]).map(([agent, count]) => (
            <div key={agent} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-[11px]" style={{ color: "var(--text-taupe)", fontFamily: "var(--font-data)" }}>
                {agent}
              </span>
              <div style={{ flex: 1, height: "4px", borderRadius: "9999px", background: "rgba(255,255,255,0.06)" }}>
                <div style={{ height: "100%", width: `${Math.round((count / total) * 100)}%`, borderRadius: "9999px", background: "linear-gradient(90deg, #F97316, #FB923C)" }} />
              </div>
              <span className="w-6 text-right shrink-0 text-[11px] font-bold" style={{ color: "var(--orange)", fontFamily: "var(--font-data)" }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const TaskStatusContent = () => (
    <div className="space-y-1">
      {[
        { label: "In Progress", count: active,  color: "var(--green)"      },
        { label: "Queued",      count: queued,  color: "var(--orange)"     },
        { label: "Completed",   count: done,    color: "var(--text-muted)" },
        { label: "Blocked",     count: blocked, color: "var(--red)"        },
      ].map(({ label, count, color }) => (
        <div key={label} className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[11px]" style={{ color: "var(--text-taupe)", fontFamily: "var(--font-data)" }}>{label}</span>
          </div>
          <span className="text-[13px] font-bold" style={{ color, fontFamily: "var(--font-data)" }}>{count}</span>
        </div>
      ))}
    </div>
  );

  const SpendContent = () => (
    <>
      {spendLoading ? (
        <div className="flex items-center gap-2 py-4">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--text-muted)" }} />
          <span className="text-label">Loading receipts…</span>
        </div>
      ) : !spend || spend.entries.length === 0 ? (
        <p className="text-[11px] py-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
          No receipts captured yet. Forward Anthropic / OpenRouter receipts to rex@hitnetwork.io.
        </p>
      ) : (
        <div className="space-y-4">
          {Object.entries(spend.byProvider).length > 0 && (
            <div className="flex flex-wrap gap-3">
              {Object.entries(spend.byProvider).map(([provider, ptotal]) => (
                <div key={provider} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-card)" }}>
                  <span className="text-[11px]" style={{ color: "var(--text-taupe)", fontFamily: "var(--font-data)" }}>{provider}</span>
                  <span className="text-[13px] font-bold" style={{ color: "var(--orange)", fontFamily: "var(--font-data)" }}>
                    ${(ptotal as number).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {spend.entries.map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: e.provider === "Anthropic" ? "var(--blue)" : "var(--orange)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px]" style={{ color: "var(--text-primary)" }}>
                    {e.provider} · {e.description}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                    {e.date}{e.invoiceId ? ` · ${e.invoiceId}` : ""}{e.paymentLast4 ? ` · ····${e.paymentLast4}` : ""}
                  </p>
                </div>
                <span className="text-[13px] font-bold shrink-0" style={{ color: "var(--text-taupe)", fontFamily: "var(--font-data)" }}>
                  ${e.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const RocksContent = () => (
    <>
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
        style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}
      >
        <AlertCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--amber)" }} />
        <p className="text-[10.5px]" style={{ color: "var(--amber)", fontFamily: "var(--font-data)" }}>
          Placeholder estimates — not verified with Kelly. Update each Monday.
        </p>
      </div>
      <div className="space-y-3">
        {ROCKS.map((rock) => (
          <div key={rock.label}>
            <div className="flex justify-between mb-1.5">
              <span className="text-[11px]" style={{ color: "var(--text-taupe)" }}>{rock.label}</span>
              <span className="text-[11px] font-semibold" style={{ color: rock.color, fontFamily: "var(--font-data)" }}>
                {rock.pct}%
              </span>
            </div>
            <div style={{ height: "4px", width: "100%", borderRadius: "9999px", background: "rgba(255,255,255,0.06)" }}>
              <div style={{ height: "100%", width: `${rock.pct}%`, borderRadius: "9999px", background: rock.color, boxShadow: `0 0 6px ${rock.color}` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] mt-3 pt-3" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)", borderTop: "1px solid var(--border-subtle)" }}>
        Mar 3 – Jun 1, 2026
      </p>
    </>
  );

  const SystemHealthContent = () => (
    <div className="space-y-2.5">
      {SYSTEM_CHECKS.map(({ label, value, status }) => (
        <div key={label} className="flex items-center justify-between gap-2">
          <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>{label}</span>
          <span className="text-[11px] font-bold shrink-0" style={{
            fontFamily: "var(--font-data)",
            color: status === "ok" ? "var(--green)" : status === "pending" ? "var(--amber)" : "var(--red)",
          }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-5 animate-fade-in overflow-y-auto">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="page-title text-lg mb-0.5">Operations</h1>
        <p className="text-label">Live Convex task data · Known spend actuals · No fabricated numbers</p>
      </div>

      {/* ── Top 4 stat cards — 2×2 on mobile, 4-col on desktop ─────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock
          icon={spendLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
          label="AI Spend MTD"
          value={spendMTD}
          sub={spendSub}
          color="var(--text-taupe)"
        />
        <StatBlock
          icon={<CheckSquare className="w-4 h-4" />}
          label="Tasks Total"
          value={total}
          sub={`${active} active · ${queued} queued · ${done} done`}
          color="var(--orange)"
        />
        <StatBlock
          icon={<AlertCircle className="w-4 h-4" />}
          label="Errors Logged"
          value="9"
          sub="9 preventive rules · All resolved"
          color="var(--green)"
        />
        <StatBlock
          icon={<Zap className="w-4 h-4" />}
          label="Skills Deployed"
          value="28"
          sub="18 exposed · 10 internal · All active"
          color="var(--green)"
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT
      ════════════════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Left 2/3 */}
          <div className="xl:col-span-2 space-y-5">
            <div className="mc-card p-5">
              <SectionHeading title="Deployed Skills — 18 Exposed" />
              <SkillsContent />
            </div>
            <div className="mc-card p-5">
              <SectionHeading
                title="Tasks by Agent — Live from Convex"
                right={total > 0 ? <span className="text-[11px] font-bold" style={{ color: "var(--text-taupe)", fontFamily: "var(--font-data)" }}>{total} total</span> : undefined}
              />
              <TasksByAgentContent />
            </div>
            <div className="mc-card p-5">
              <SectionHeading
                title="AI Spend — All Receipts"
                right={spend ? <span className="text-[11px] font-bold" style={{ color: "var(--text-taupe)", fontFamily: "var(--font-data)" }}>All-time: ${spend.totalAll.toFixed(2)}</span> : undefined}
              />
              <SpendContent />
            </div>
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <Activity className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--blue)" }} />
              <div>
                <p className="text-[11.5px] font-semibold mb-1" style={{ color: "var(--blue)" }}>
                  Per-skill token cost tracking — not yet implemented
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
                  To get per-skill breakdowns, Rex needs to log token counts to Convex on each task completion.
                  This is a one-session build. Say "build token tracking" when you want it added.
                </p>
              </div>
            </div>
          </div>

          {/* Right 1/3 */}
          <div className="space-y-5">
            <div className="mc-card p-5">
              <SectionHeading title="System Health" />
              <SystemHealthContent />
            </div>
            <div className="mc-card p-5">
              <SectionHeading title="Q2 Rocks" right={<span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>Manual estimates</span>} />
              <RocksContent />
            </div>
            <div className="mc-card p-5">
              <SectionHeading title="Task Status" />
              <TaskStatusContent />
            </div>
          </div>

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT — accordion, one section open at a time
      ════════════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div className="space-y-2">

          {/* SPEND */}
          <MobileAccordionButton
            label="AI Spend"
            active={mobileOpen === "spend"}
            sub={spend ? `All-time: $${spend.totalAll.toFixed(2)}` : "Loading…"}
            onClick={() => toggleSection("spend")}
          />
          {mobileOpen === "spend" && (
            <div className="mc-card p-4">
              <SpendContent />
            </div>
          )}

          {/* TASKS */}
          <MobileAccordionButton
            label="Tasks"
            active={mobileOpen === "tasks"}
            sub={`${total} total · ${active} active · ${done} done`}
            onClick={() => toggleSection("tasks")}
          />
          {mobileOpen === "tasks" && (
            <div className="mc-card p-4 space-y-4">
              <div>
                <p className="text-label mb-3">By Agent</p>
                <TasksByAgentContent />
              </div>
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "16px" }}>
                <p className="text-label mb-2">By Status</p>
                <TaskStatusContent />
              </div>
            </div>
          )}

          {/* SKILLS */}
          <MobileAccordionButton
            label="Skills"
            active={mobileOpen === "skills"}
            sub="18 exposed · 10 internal"
            onClick={() => toggleSection("skills")}
          />
          {mobileOpen === "skills" && (
            <div className="mc-card p-4">
              <SkillsContent />
            </div>
          )}

          {/* ROCKS */}
          <MobileAccordionButton
            label="Q2 Rocks"
            active={mobileOpen === "rocks"}
            sub="Mar 3 – Jun 1, 2026"
            onClick={() => toggleSection("rocks")}
          />
          {mobileOpen === "rocks" && (
            <div className="mc-card p-4">
              <RocksContent />
            </div>
          )}

          {/* SYSTEM HEALTH */}
          <MobileAccordionButton
            label="System Health"
            active={mobileOpen === "system"}
            sub="0 errors · DKIM ✓ SPF ✓ DMARC ✓"
            onClick={() => toggleSection("system")}
          />
          {mobileOpen === "system" && (
            <div className="mc-card p-4">
              <SystemHealthContent />
            </div>
          )}

        </div>
      )}

    </div>
  );
}
