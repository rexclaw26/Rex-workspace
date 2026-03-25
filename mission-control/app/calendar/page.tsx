"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Calendar, CheckSquare, Clock, AlertCircle, X, RefreshCw,
  FileText, Video, Mail, Newspaper, Zap,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toLocalDateStr(date: Date): string {
  return date.toLocaleDateString("en-CA");
}
function todayStr(): string {
  return toLocalDateStr(new Date());
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_HEADERS     = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_HEADERS_MOB = ["S","M","T","W","T","F","S"];

const PRIORITY_COLOR: Record<string, string> = {
  high:   "var(--orange)",
  medium: "var(--blue)",
  low:    "var(--text-muted)",
};
const STATUS_COLOR: Record<string, string> = {
  in_progress: "var(--green)",
  todo:        "var(--orange)",
  done:        "var(--text-muted)",
  blocked:     "var(--red)",
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--border-card)",
  borderRadius: "8px",
  padding: "8px 11px",
  fontSize: "12px",
  color: "var(--text-primary)",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

// ── Content event constants ───────────────────────────────────────────────────
const CONTENT_TEAL = "#2dd4bf";
const CONTENT_TEAL_DIM = "rgba(45,212,191,0.15)";
const CONTENT_TEAL_BORDER = "rgba(45,212,191,0.35)";

const CONTENT_PILLARS = [
  "Bitcoin / Macro",
  "DeFi & On-Chain",
  "AI x Crypto",
  "Geopolitics / Macro",
  "Legislation",
  "Institutional Adoption",
];

const CONTENT_FORMATS = [
  "Article",
  "YouTube",
  "YouTube Short",
  "Newsletter",
  "X Thread",
];

const FORMAT_ICON: Record<string, React.ReactNode> = {
  "Article":       <FileText className="w-3 h-3" />,
  "YouTube":       <Video className="w-3 h-3" />,
  "YouTube Short": <Zap className="w-3 h-3" />,
  "Newsletter":    <Mail className="w-3 h-3" />,
  "X Thread":      <Newspaper className="w-3 h-3" />,
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormData {
  title:       string;
  emailInvite: string;
  datetime:    string;
  description: string;
  eventType:   "task" | "content";
  pillar:      string;
  format:      string;
}

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
type CalMobileSection = "day" | "upcoming" | null;

// ── Mobile accordion button ───────────────────────────────────────────────────
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
          <span style={{ fontSize: "10px", fontFamily: "var(--font-data)", textTransform: "none", letterSpacing: 0, color: active ? "rgba(249,115,22,0.7)" : "var(--text-muted)" }}>
            {sub}
          </span>
        )}
      </div>
      {active ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
    </button>
  );
}

// ── Task row ──────────────────────────────────────────────────────────────────
function TaskRow({ task, showDate, onRemove }: { task: any; showDate?: boolean; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}>
      <div className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: STATUS_COLOR[task.status] ?? "var(--text-muted)" }} />
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] truncate" style={{ color: "var(--text-primary)" }}>{task.title}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
          {showDate && task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " · "
            : ""}
          {task.agentCodename} · {task.status.replace("_", " ")}
        </p>
      </div>
      <span style={{ fontSize: "10px", fontFamily: "var(--font-data)", fontWeight: 700, color: PRIORITY_COLOR[task.priority] ?? "var(--text-muted)" }}>
        {task.priority?.toUpperCase()}
      </span>
      {onRemove && (
        <button type="button" onClick={onRemove} title="Remove" className="shrink-0 p-1 rounded transition-colors"
          style={{ color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", lineHeight: 1 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ── Day panel ─────────────────────────────────────────────────────────────────
// Defined OUTSIDE CalendarPage so it has a stable component reference.
// Receives all data + callbacks as explicit props — no closure captures.
function DayPanel({
  selectedLabel, selectedTasks, selectedContent,
  showForm, formData, formSaving,
  onOpenForm, onCloseForm, onSubmitForm, onFormChange, onRemove, onRemoveContent,
}: {
  selectedLabel:    string;
  selectedTasks:    any[];
  selectedContent:  any[];
  showForm:         boolean;
  formData:         FormData;
  formSaving:       boolean;
  onOpenForm:       () => void;
  onCloseForm:      () => void;
  onSubmitForm:     () => void;
  onFormChange:     (field: keyof FormData, value: string) => void;
  onRemove:         (id: string) => void;
  onRemoveContent:  (id: string) => void;
}) {
  // Imperative focus on form open — avoids autoFocus cursor-stealing on re-renders
  const titleRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (showForm) {
      // Small delay to let the form mount before focusing
      const t = setTimeout(() => titleRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [showForm]);
  return (
    <div className="mc-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: "var(--orange)" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: "var(--text-orange)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {selectedLabel}
          </h3>
        </div>
        {!showForm && (
          <button type="button" onClick={onOpenForm} title="Add task or meeting"
            className="flex items-center justify-center w-6 h-6 rounded-lg transition-all"
            style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "var(--orange)", cursor: "pointer", fontSize: "16px", lineHeight: 1, fontWeight: 300 }}>
            +
          </button>
        )}
      </div>

      {/* Content events */}
      {selectedContent.length > 0 && (
        <div className="space-y-2 mb-3">
          <p style={{ fontSize: "9px", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.1em", color: CONTENT_TEAL, textTransform: "uppercase", marginBottom: 4 }}>Content</p>
          {selectedContent.map((ev: any) => {
            const parts = ev.title?.match(/^\[(.+?)\] (.+?) — (.+)$/);
            const fmt   = parts?.[1] ?? "Content";
            const ttl   = parts?.[2] ?? ev.title;
            const pillar = parts?.[3] ?? "";
            return (
              <div key={ev._id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                style={{ background: CONTENT_TEAL_DIM, border: `1px solid ${CONTENT_TEAL_BORDER}` }}>
                <span style={{ color: CONTENT_TEAL, flexShrink: 0 }}>{FORMAT_ICON[fmt] ?? <FileText className="w-3 h-3" />}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] truncate" style={{ color: "var(--text-primary)" }}>{ttl}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: CONTENT_TEAL, fontFamily: "var(--font-data)", opacity: 0.8 }}>{fmt} · {pillar}</p>
                </div>
                <button type="button" onClick={() => onRemoveContent(ev._id)} title="Remove"
                  className="shrink-0 p-1 rounded transition-colors"
                  style={{ color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", lineHeight: 1 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Task list */}
      {selectedTasks.length === 0 && selectedContent.length === 0 && !showForm ? (
        <div className="py-4 text-center">
          <CheckSquare className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
          <p className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
            No tasks scheduled — tap <span style={{ color: "var(--orange)" }}>+</span> to add one
          </p>
        </div>
      ) : selectedTasks.length > 0 ? (
        <div className="space-y-2">
          {selectedTasks.map((task: any) => (
            <TaskRow key={task._id} task={task} onRemove={() => onRemove(task._id)} />
          ))}
        </div>
      ) : null}

      {/* Inline add form */}
      {showForm && (
        <div className="mt-4 pt-4 space-y-3"
          style={{ borderTop: selectedTasks.length > 0 ? "1px solid var(--border-subtle)" : "none" }}>
          {/* Event type toggle */}
          <div className="flex gap-2">
            {(["task", "content"] as const).map((t) => (
              <button key={t} type="button" onClick={() => onFormChange("eventType", t)}
                style={{
                  flex: 1, padding: "6px", borderRadius: "8px", fontSize: "10px",
                  fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.07em",
                  textTransform: "uppercase", cursor: "pointer", transition: "all 150ms",
                  background: formData.eventType === t
                    ? (t === "content" ? CONTENT_TEAL_DIM : "rgba(249,115,22,0.12)")
                    : "rgba(255,255,255,0.03)",
                  border: formData.eventType === t
                    ? `1px solid ${t === "content" ? CONTENT_TEAL_BORDER : "rgba(249,115,22,0.35)"}`
                    : "1px solid var(--border-subtle)",
                  color: formData.eventType === t
                    ? (t === "content" ? CONTENT_TEAL : "var(--orange)")
                    : "var(--text-muted)",
                }}>
                {t === "task" ? "Task / Meeting" : "Content Event"}
              </button>
            ))}
          </div>

          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: formData.eventType === "content" ? CONTENT_TEAL : "var(--text-orange)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {formData.eventType === "content" ? "Add Content Event" : "Add Task / Meeting"}
          </p>

          {/* 1. Task name */}
          <div>
            <label style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)", marginBottom: "5px", letterSpacing: "0.05em" }}>
              TASK NAME *
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="e.g. Review sponsor deck with Kelly"
              value={formData.title}
              onChange={(e) => onFormChange("title", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmitForm()}
              style={INPUT_STYLE}
            />
          </div>

          {/* Content-specific fields */}
          {formData.eventType === "content" && (
            <>
              <div>
                <label style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)", marginBottom: "5px", letterSpacing: "0.05em" }}>PILLAR</label>
                <select value={formData.pillar} onChange={(e) => onFormChange("pillar", e.target.value)} style={{ ...INPUT_STYLE, cursor: "pointer" }}>
                  {CONTENT_PILLARS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)", marginBottom: "5px", letterSpacing: "0.05em" }}>FORMAT</label>
                <select value={formData.format} onChange={(e) => onFormChange("format", e.target.value)} style={{ ...INPUT_STYLE, cursor: "pointer" }}>
                  {CONTENT_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </>
          )}

          {/* 2. Email invite — tasks only */}
          {formData.eventType === "task" && (
          <div>
            <label style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)", marginBottom: "5px", letterSpacing: "0.05em" }}>
              EMAIL INVITE <span style={{ opacity: 0.5 }}>(optional)</span>
            </label>
            <input
              type="email"
              placeholder="e.g. kelly@bitlabacademy.com"
              value={formData.emailInvite}
              onChange={(e) => onFormChange("emailInvite", e.target.value)}
              style={INPUT_STYLE}
            />
          </div>
          )}

          {/* 3. Date & time */}
          <div>
            <label style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)", marginBottom: "5px", letterSpacing: "0.05em" }}>
              DATE & TIME
            </label>
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => onFormChange("datetime", e.target.value)}
              style={{ ...INPUT_STYLE, colorScheme: "dark" }}
            />
          </div>

          {/* 4. Description */}
          <div>
            <label style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)", marginBottom: "5px", letterSpacing: "0.05em" }}>
              WHAT IS IT / DESCRIPTION
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Monthly check-in on Q2 rock progress"
              value={formData.description}
              onChange={(e) => onFormChange("description", e.target.value)}
              style={{ ...INPUT_STYLE, resize: "none", lineHeight: "1.5" }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onCloseForm}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "11px", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.06em", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="button" onClick={onSubmitForm} disabled={!formData.title.trim() || formSaving}
              style={{
                flex: 2, padding: "8px", borderRadius: "8px", fontSize: "11px",
                fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.06em",
                background: formData.title.trim() ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${formData.title.trim() ? "rgba(249,115,22,0.4)" : "var(--border-subtle)"}`,
                color: formData.title.trim() ? "var(--orange)" : "var(--text-muted)",
                cursor: formData.title.trim() ? "pointer" : "default",
                opacity: formSaving ? 0.6 : 1,
              }}>
              {formSaving ? "Saving…" : "Add Task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Upcoming panel ────────────────────────────────────────────────────────────
function UpcomingPanel({ upcoming, onRemove }: { upcoming: any[]; onRemove: (id: string) => void }) {
  return (
    <div className="mc-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4" style={{ color: "var(--orange)" }} />
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: "var(--text-orange)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Upcoming
        </h3>
      </div>
      {upcoming.length === 0 ? (
        <div className="py-4 text-center">
          <p className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>No upcoming tasks</p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map((task: any) => (
            <TaskRow key={task._id} task={task} showDate onRemove={() => onRemove(task._id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Calendar grid ─────────────────────────────────────────────────────────────
function CalGrid({
  year, month, cells, todayDateStr, tasksByDate, contentByDate, activeFilter, isMobile,
  onPrev, onNext, onSelectDay,
}: {
  year: number; month: number; cells: (number | null)[];
  todayDateStr: string; tasksByDate: Record<string, any[]>;
  contentByDate: Record<string, any[]>;
  activeFilter: "all" | "content" | "tasks";
  isMobile: boolean; selected: string | null;
  onPrev: () => void; onNext: () => void;
  onSelectDay: (dateStr: string) => void;
}) {
  return (
    <div className="mc-card" style={{ padding: isMobile ? "12px" : "20px" }}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="p-2 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)", border: "1px solid var(--border-subtle)", cursor: "pointer", background: "transparent" }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? "13px" : "15px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.06em" }}>
          {MONTHS[month]} {year}
        </h2>
        <button onClick={onNext} className="p-2 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)", border: "1px solid var(--border-subtle)", cursor: "pointer", background: "transparent" }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {(isMobile ? DAY_HEADERS_MOB : DAY_HEADERS).map((d, i) => (
          <div key={i} className="text-center text-label py-1" style={{ fontSize: isMobile ? "10px" : undefined }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`blank-${idx}`} className="aspect-square" />;
          const dateStr      = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday      = dateStr === todayDateStr;
          const dayTasks     = activeFilter === "content" ? [] : (tasksByDate[dateStr] ?? []);
          const dayContent   = activeFilter === "tasks"   ? [] : (contentByDate[dateStr] ?? []);
          const hasTasks     = dayTasks.length > 0;
          const hasContent   = dayContent.length > 0;
          return (
            <button key={dateStr} onClick={() => onSelectDay(dateStr)}
              className="aspect-square rounded-lg flex flex-col items-center justify-start pt-1 gap-0.5 transition-all"
              style={{
                cursor: "pointer",
                border: isToday ? "1px solid rgba(59,130,246,0.3)" : hasContent ? `1px solid ${CONTENT_TEAL_BORDER}` : "1px solid transparent",
                background: isToday ? "rgba(59,130,246,0.06)" : hasContent ? CONTENT_TEAL_DIM : hasTasks ? "rgba(255,255,255,0.02)" : "transparent",
              }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: isMobile ? "11px" : "12px", fontWeight: isToday ? 700 : 400, color: isToday ? "var(--blue)" : hasContent ? CONTENT_TEAL : "var(--text-primary)", lineHeight: 1 }}>
                {day}
              </span>
              <div className="flex gap-0.5 flex-wrap justify-center">
                {hasContent && dayContent.slice(0, 2).map((_: any, i: number) => (
                  <div key={`c${i}`} style={{ width: 4, height: 4, borderRadius: "50%", background: CONTENT_TEAL }} />
                ))}
                {hasTasks && dayTasks.slice(0, 2).map((t: any, i: number) => (
                  <div key={`t${i}`} style={{ width: 4, height: 4, borderRadius: "50%", background: PRIORITY_COLOR[t.priority] ?? "var(--text-muted)" }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 pt-3 flex-wrap" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        {[
          { color: "var(--orange)",     label: "High" },
          { color: "var(--blue)",       label: "Medium" },
          { color: "var(--text-muted)", label: "Low" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)" }}>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: CONTENT_TEAL }} />
          <span style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)" }}>Content</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.3)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)" }}>Today</span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const isMobile = useIsMobile();
  const today    = new Date();

  const [year,     setYear]     = useState(today.getFullYear());
  const [month,    setMonth]    = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(todayStr());
  const [mobileOpen, setMobileOpen] = useState<CalMobileSection>("day");

  // Add-task form state
  const [showForm,   setShowForm]   = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [formData,   setFormData]   = useState<FormData>({
    title: "", emailInvite: "", datetime: "", description: "",
    eventType: "task", pillar: CONTENT_PILLARS[0], format: CONTENT_FORMATS[0],
  });

  // Google Calendar sync state
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [syncMsg,   setSyncMsg]   = useState<string | null>(null);

  const handleSyncToGoogle = useCallback(async () => {
    setSyncState("syncing");
    setSyncMsg(null);
    try {
      const res  = await fetch("/api/calendar/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSyncState("error");
        setSyncMsg(data?.error ?? "Sync failed");
      } else {
        setSyncState("done");
        setSyncMsg(
          `Synced ${data.synced} event${data.synced !== 1 ? "s" : ""} to Google Calendar` +
          (data.errors?.length ? ` (${data.errors.length} error${data.errors.length > 1 ? "s" : ""})` : "")
        );
        // Auto-clear after 5 s
        setTimeout(() => { setSyncState("idle"); setSyncMsg(null); }, 5000);
      }
    } catch (err: any) {
      setSyncState("error");
      setSyncMsg(err?.message ?? "Network error");
    }
  }, []);

  const tasks        = useQuery(api.tasks.getAll) ?? [];
  const removeTask   = useMutation(api.tasks.remove);
  const createTask   = useMutation(api.tasks.create);
  const contentEvents = useQuery(api.calendar.listEvents) ?? [];
  const upsertEvent  = useMutation(api.calendar.upsertEvent);
  const deleteEvent  = useMutation(api.calendar.deleteEvent);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<"all" | "content" | "tasks">("all");

  const toggleSection = (s: CalMobileSection) =>
    setMobileOpen((prev) => (prev === s ? null : s));

  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    for (const t of tasks) {
      if (!t.dueDate) continue;
      const key = toLocalDateStr(new Date(t.dueDate));
      if (!map[key]) map[key] = [];
      map[key].push(t);
    }
    return map;
  }, [tasks]);

  const contentByDate = useMemo(() => {
    const map: Record<string, typeof contentEvents> = {};
    for (const e of contentEvents) {
      if (!e.start) continue;
      const key = toLocalDateStr(new Date(e.start));
      if (!map[key]) map[key] = [];
      map[key].push(e);
    }
    return map;
  }, [contentEvents]);

  const selectedTasks = selected ? (tasksByDate[selected] ?? []) : [];
  const selectedContent = selected ? (contentByDate[selected] ?? []) : [];

  const upcoming = useMemo(() => {
    const nowMs = Date.now();
    return tasks
      .filter((t: any) => t.status !== "done" && (!t.dueDate || t.dueDate >= nowMs))
      .sort((a: any, b: any) => {
        if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt - a.createdAt;
      })
      .slice(0, 10);
  }, [tasks]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const daysInMonth  = getDaysInMonth(year, month);
  const firstDow     = getFirstDayOfWeek(year, month);
  const todayDateStr = todayStr();

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedLabel = selected
    ? new Date(selected + "T12:00:00").toLocaleDateString("en-US", {
        weekday: isMobile ? "short" : "long", month: "short", day: "numeric",
      })
    : "Select a Date";

  // Form handlers
  const handleOpenForm = useCallback(() => {
    const datePrefix = selected ?? todayStr();
    setFormData({ title: "", emailInvite: "", datetime: `${datePrefix}T09:00`, description: "", eventType: "task", pillar: CONTENT_PILLARS[0], format: CONTENT_FORMATS[0] });
    setShowForm(true);
  }, [selected]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({ title: "", emailInvite: "", datetime: "", description: "", eventType: "task", pillar: CONTENT_PILLARS[0], format: CONTENT_FORMATS[0] });
  }, []);

  const handleFormChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmitForm = useCallback(async () => {
    if (!formData.title.trim()) return;
    setFormSaving(true);
    try {
      const startMs = formData.datetime ? new Date(formData.datetime).getTime() : Date.now();

      if (formData.eventType === "content") {
        // Create content calendar event
        const label = `[${formData.format}] ${formData.title.trim()} — ${formData.pillar}`;
        await upsertEvent({
          title:         label,
          start:         startMs,
          end:           startMs + 3600000,
          type:          "content",
          agentCodename: "Rex",
        });
      } else {
        // Create task (existing flow)
        const dueDate = startMs;
        const email   = formData.emailInvite.trim();
        const notes   = email ? `INVITE: ${email}` : undefined;
        await createTask({
          title:         formData.title.trim(),
          description:   formData.description.trim() || undefined,
          dueDate,
          notes,
          status:        "todo",
          priority:      "medium",
          agentCodename: "Rex",
        });
        if (email) {
          fetch("/api/calendar-invite", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to:          email,
              taskTitle:   formData.title.trim(),
              datetime:    formData.datetime || undefined,
              description: formData.description.trim() || undefined,
            }),
          }).catch((e) => console.error("Invite send failed:", e));
        }
      }
      handleCloseForm();
    } catch (e) {
      console.error("Failed to create event:", e);
    } finally {
      setFormSaving(false);
    }
  }, [formData, createTask, upsertEvent, handleCloseForm]);

  const handleSelectDay = useCallback((dateStr: string) => {
    setSelected(dateStr);
    if (isMobile) setMobileOpen("day");
  }, [isMobile]);

  const handleRemove = useCallback((id: string) => {
    removeTask({ id: id as any });
  }, [removeTask]);

  return (
    <div className="p-6 space-y-5 animate-fade-in">

      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "tasks", "content"] as const).map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{
              padding: "5px 14px", borderRadius: "8px", fontSize: "11px",
              fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.07em",
              textTransform: "uppercase", cursor: "pointer", transition: "all 150ms",
              background: activeFilter === f
                ? (f === "content" ? CONTENT_TEAL_DIM : "rgba(249,115,22,0.12)")
                : "rgba(255,255,255,0.03)",
              border: activeFilter === f
                ? `1px solid ${f === "content" ? CONTENT_TEAL_BORDER : "rgba(249,115,22,0.35)"}`
                : "1px solid var(--border-subtle)",
              color: activeFilter === f
                ? (f === "content" ? CONTENT_TEAL : "var(--orange)")
                : "var(--text-muted)",
            }}>
            {f === "all" ? "All" : f === "tasks" ? "Tasks" : "Content"}
          </button>
        ))}
        <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)", marginLeft: 4 }}>
          {contentEvents.length} content events · {tasks.length} tasks
        </span>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className={isMobile ? "space-y-2" : "flex items-center justify-between"}>
        <div>
          <h1 className="page-title text-lg mb-0.5">Calendar</h1>
          <p className="text-label">Task schedule · Mission Control planner</p>
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-2 flex-wrap" style={{ alignSelf: "flex-start" }}>
          {/* Sync result / error message */}
          {syncMsg && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
              style={{
                background: syncState === "error" ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                border:     `1px solid ${syncState === "error" ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
              }}>
              <span style={{
                color:      syncState === "error" ? "var(--red, #ef4444)" : "var(--green, #22c55e)",
                fontSize:   "11px",
                fontFamily: "var(--font-data)",
              }}>
                {syncMsg}
              </span>
            </div>
          )}

          {/* Sync to Google button */}
          <button
            type="button"
            onClick={handleSyncToGoogle}
            disabled={syncState === "syncing"}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all"
            style={{
              background:  syncState === "syncing" ? "rgba(249,115,22,0.05)" : "rgba(249,115,22,0.1)",
              border:      "1px solid rgba(249,115,22,0.3)",
              color:       "var(--orange)",
              fontSize:    "11px",
              fontFamily:  "var(--font-display)",
              fontWeight:  700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor:      syncState === "syncing" ? "default" : "pointer",
              opacity:     syncState === "syncing" ? 0.6 : 1,
            }}
          >
            <RefreshCw
              className="w-3.5 h-3.5 shrink-0"
              style={{ animation: syncState === "syncing" ? "spin 1s linear infinite" : undefined }}
            />
            {syncState === "syncing" ? "Syncing…" : "Sync to Google"}
          </button>

          {/* Status badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <AlertCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--blue)" }} />
            <span style={{ color: "var(--blue)", fontSize: "11px", fontFamily: "var(--font-data)" }}>
              rex@hitnetwork.io
            </span>
          </div>
        </div>
      </div>

      {/* Spin keyframe (inline — avoids global CSS dependency) */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT
      ════════════════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <CalGrid
              year={year} month={month} cells={cells}
              todayDateStr={todayDateStr} tasksByDate={tasksByDate}
              contentByDate={contentByDate} activeFilter={activeFilter}
              isMobile={false} selected={selected}
              onPrev={prevMonth} onNext={nextMonth} onSelectDay={handleSelectDay}
            />
          </div>
          <div className="space-y-4">
            <DayPanel
              selectedLabel={selectedLabel}
              selectedTasks={activeFilter === "content" ? [] : selectedTasks}
              selectedContent={activeFilter === "tasks" ? [] : selectedContent}
              showForm={showForm}
              formData={formData}
              formSaving={formSaving}
              onOpenForm={handleOpenForm}
              onCloseForm={handleCloseForm}
              onSubmitForm={handleSubmitForm}
              onFormChange={handleFormChange}
              onRemove={handleRemove}
              onRemoveContent={(id) => deleteEvent({ id: id as any })}
            />
            <UpcomingPanel upcoming={upcoming} onRemove={handleRemove} />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT
      ════════════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div className="space-y-3">
          <CalGrid
            year={year} month={month} cells={cells}
            todayDateStr={todayDateStr} tasksByDate={tasksByDate}
            contentByDate={contentByDate} activeFilter={activeFilter}
            isMobile selected={selected}
            onPrev={prevMonth} onNext={nextMonth} onSelectDay={handleSelectDay}
          />
          <MobileAccordionButton
            label={selectedLabel} active={mobileOpen === "day"}
            sub={selectedTasks.length === 0 ? "No tasks" : `${selectedTasks.length} task${selectedTasks.length > 1 ? "s" : ""}`}
            onClick={() => toggleSection("day")}
          />
          {mobileOpen === "day" && (
            <DayPanel
              selectedLabel={selectedLabel}
              selectedTasks={activeFilter === "content" ? [] : selectedTasks}
              selectedContent={activeFilter === "tasks" ? [] : selectedContent}
              showForm={showForm}
              formData={formData}
              formSaving={formSaving}
              onOpenForm={handleOpenForm}
              onCloseForm={handleCloseForm}
              onSubmitForm={handleSubmitForm}
              onFormChange={handleFormChange}
              onRemove={handleRemove}
              onRemoveContent={(id) => deleteEvent({ id: id as any })}
            />
          )}
          <MobileAccordionButton
            label="Upcoming" active={mobileOpen === "upcoming"}
            sub={upcoming.length === 0 ? "No tasks" : `${upcoming.length} task${upcoming.length > 1 ? "s" : ""}`}
            onClick={() => toggleSection("upcoming")}
          />
          {mobileOpen === "upcoming" && (
            <UpcomingPanel upcoming={upcoming} onRemove={handleRemove} />
          )}
        </div>
      )}

    </div>
  );
}
