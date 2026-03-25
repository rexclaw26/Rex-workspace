"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Layers, ExternalLink, Clock, CheckCircle2, FileEdit } from "lucide-react";
import { DECK_GROUPS, type DeckGroup, type SlideDeck } from "@/config/decks";

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

// ── Status dot + label ─────────────────────────────────────────────────────
const STATUS_CONFIG = {
  ready:    { color: "var(--green)",  icon: CheckCircle2, label: "Ready"    },
  building: { color: "var(--amber)",  icon: Clock,        label: "Building" },
  draft:    { color: "var(--blue)",   icon: FileEdit,     label: "Draft"    },
} as const;

function StatusBadge({ status }: { status: SlideDeck["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="flex items-center gap-1" style={{ fontFamily: "var(--font-data)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: cfg.color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block", flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

// ── Individual deck row ────────────────────────────────────────────────────
function DeckRow({ deck }: { deck: SlideDeck }) {
  const isReady = deck.status === "ready" || deck.status === "draft";

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all"
      style={{
        background: isReady ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isReady ? "var(--border-card)" : "var(--border-subtle)"}`,
        opacity: deck.status === "building" ? 0.65 : 1,
      }}>
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: isReady ? "var(--text-primary)" : "var(--text-muted)", letterSpacing: "0.02em" }}>
          {deck.title}
        </p>
        {deck.description && (
          <p className="mt-0.5 truncate" style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-muted)" }}>
            {deck.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={deck.status} />
        {isReady ? (
          <Link href={`/slides/${deck.slug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.35)",
              color: "var(--orange)",
              fontFamily: "var(--font-display)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}>
            Open <ExternalLink className="w-3 h-3" />
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-display)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
            Soon
          </span>
        )}
      </div>
    </div>
  );
}

// ── Desktop group card ─────────────────────────────────────────────────────
function GroupCard({ group, expanded, onToggle }: {
  group: DeckGroup;
  expanded: boolean;
  onToggle: () => void;
}) {
  const readyCount    = group.decks.filter((d) => d.status === "ready" || d.status === "draft").length;
  const buildingCount = group.decks.filter((d) => d.status === "building").length;

  return (
    <div className="mc-card overflow-hidden transition-all">
      {/* Card header — click to expand/collapse */}
      <button type="button" onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-5 transition-all"
        style={{
          background:    expanded ? "rgba(249,115,22,0.04)" : "transparent",
          borderBottom:  expanded ? "1px solid var(--border-subtle)" : "1px solid transparent",
          cursor:        "pointer",
          textAlign:     "left",
        }}>
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Color accent bar */}
          <div style={{ width: 3, borderRadius: 9999, background: group.accentColor, alignSelf: "stretch", flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 shrink-0" style={{ color: group.accentColor }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--text-orange)", letterSpacing: "0.04em" }}>
                {group.title}
              </h3>
            </div>
            <p style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--text-muted)" }}>
              {group.description}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-muted)" }}>
                {group.date}
              </span>
              <span style={{ width: 1, height: 10, background: "var(--border-subtle)", display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--text-muted)" }}>
                {group.decks.length} deck{group.decks.length !== 1 ? "s" : ""}
              </span>
              {readyCount > 0 && (
                <>
                  <span style={{ width: 1, height: 10, background: "var(--border-subtle)", display: "inline-block" }} />
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--green)", fontWeight: 700 }}>
                    {readyCount} ready
                  </span>
                </>
              )}
              {buildingCount > 0 && (
                <>
                  <span style={{ width: 1, height: 10, background: "var(--border-subtle)", display: "inline-block" }} />
                  <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "var(--amber)", fontWeight: 700 }}>
                    {buildingCount} building
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
          style={{
            background: expanded ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${expanded ? "rgba(249,115,22,0.35)" : "var(--border-subtle)"}`,
            color: expanded ? "var(--orange)" : "var(--text-muted)",
          }}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded deck list */}
      {expanded && (
        <div className="p-4 space-y-2">
          {group.decks.map((deck) => (
            <DeckRow key={deck.slug} deck={deck} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mobile accordion button ────────────────────────────────────────────────
function MobileAccordionButton({ group, active, onClick }: {
  group: DeckGroup;
  active: boolean;
  onClick: () => void;
}) {
  const readyCount = group.decks.filter((d) => d.status === "ready" || d.status === "draft").length;
  const sub = readyCount === group.decks.length
    ? `${group.decks.length} decks · all ready`
    : readyCount > 0
    ? `${group.decks.length} decks · ${readyCount} ready`
    : `${group.decks.length} decks · building`;

  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
      style={{
        background:    active ? "rgba(249,115,22,0.1)"  : "rgba(255,255,255,0.03)",
        border:        `1px solid ${active ? "rgba(249,115,22,0.4)" : "var(--border-subtle)"}`,
        color:         active ? "var(--orange)" : "var(--text-muted)",
        cursor:        "pointer",
      }}>
      <div className="flex flex-col items-start gap-0.5 text-left flex-1 min-w-0">
        <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
          {group.title}
        </span>
        <span style={{
          fontSize: "10px", fontFamily: "var(--font-data)",
          color: active ? "rgba(249,115,22,0.7)" : "var(--text-muted)",
        }}>
          {sub}
        </span>
      </div>
      {active ? <ChevronUp className="w-4 h-4 shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 shrink-0 ml-2" />}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function DecksPage() {
  const isMobile = useIsMobile();

  // Desktop: track which groups are expanded (multiple can be open)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(DECK_GROUPS.map((g) => [g.id, true])) // all open by default
  );

  // Mobile: single accordion (one open at a time)
  const [mobileOpen, setMobileOpen] = useState<string | null>(
    DECK_GROUPS[0]?.id ?? null
  );

  const toggleDesktop = (id: string) =>
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleMobile = (id: string) =>
    setMobileOpen((prev) => (prev === id ? null : id));

  const totalDecks = DECK_GROUPS.reduce((n, g) => n + g.decks.length, 0);
  const readyDecks = DECK_GROUPS.reduce(
    (n, g) => n + g.decks.filter((d) => d.status === "ready" || d.status === "draft").length, 0
  );

  return (
    <div className="p-6 space-y-5 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className={isMobile ? "space-y-2" : "flex items-center justify-between"}>
        <div>
          <h1 className="page-title text-lg mb-0.5">Decks</h1>
          <p className="text-label">Slide decks · Pitch decks · Business presentations</p>
        </div>
        <div className="flex items-center gap-3" style={{ alignSelf: "flex-start" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}>
            <Layers className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--orange)" }} />
            <span style={{ color: "var(--orange)", fontSize: "11px", fontFamily: "var(--font-data)", fontWeight: 700 }}>
              {readyDecks}/{totalDecks} ready
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          EMPTY STATE
      ════════════════════════════════════════════════════════════════ */}
      {DECK_GROUPS.length === 0 && (
        <div className="mc-card p-12 text-center">
          <Layers className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--text-muted)" }}>
            No decks yet
          </p>
          <p className="mt-1" style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "var(--text-muted)" }}>
            Slide decks appear here when Rex builds them. Each project group shows as a button.
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP — expandable group cards
      ════════════════════════════════════════════════════════════════ */}
      {!isMobile && DECK_GROUPS.length > 0 && (
        <div className="space-y-4">
          {DECK_GROUPS.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              expanded={expandedGroups[group.id] ?? true}
              onToggle={() => toggleDesktop(group.id)}
            />
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MOBILE — single accordion
      ════════════════════════════════════════════════════════════════ */}
      {isMobile && DECK_GROUPS.length > 0 && (
        <div className="space-y-3">
          {DECK_GROUPS.map((group) => (
            <div key={group.id}>
              <MobileAccordionButton
                group={group}
                active={mobileOpen === group.id}
                onClick={() => toggleMobile(group.id)}
              />
              {mobileOpen === group.id && (
                <div className="mt-2 space-y-2">
                  {group.decks.map((deck) => (
                    <DeckRow key={deck.slug} deck={deck} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
