"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers, ExternalLink } from "lucide-react";

export interface SlideConfig {
  deckTitle: string;
  deckSlug: string;
  accent: string;
  accentDim: string;   // rgba with alpha for backgrounds
  bg: string;
  bgCard: string;
  slides: React.ReactNode[];
}

export default function SlideViewer({ config }: { config: SlideConfig }) {
  const { deckTitle, accent, accentDim, bg, bgCard, slides } = config;
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp"  ) prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", fontFamily: "var(--font-body)" }}>

      {/* ── Progress bar ──────────────────────────────────────────── */}
      <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: accent, transition: "width 0.4s ease", boxShadow: `0 0 8px ${accent}` }} />
      </div>

      {/* ── Top nav ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        {/* Back */}
        <Link href="/decks" style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.45)", fontSize: "11px", textDecoration: "none", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
          <Layers className="w-3 h-3" />
          Decks
        </Link>

        {/* Title + counter */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: accent, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
            {deckTitle}
          </p>
          <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            {current + 1} / {total}
          </p>
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[{ fn: prev, icon: <ChevronLeft className="w-4 h-4" />, disabled: current === 0 },
            { fn: next, icon: <ChevronRight className="w-4 h-4" />, disabled: current === total - 1 }]
            .map(({ fn, icon, disabled }, i) => (
            <button key={i} onClick={fn} disabled={disabled}
              style={{
                width: 32, height: 32, borderRadius: "8px", border: `1px solid ${disabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)"}`,
                background: disabled ? "transparent" : accentDim,
                color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: disabled ? "not-allowed" : "pointer", transition: "all 150ms",
              }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── Slide content ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 60px 24px 20px", overflowY: "auto", position: "relative" }}>
        <div style={{ width: "100%", maxWidth: "900px" }}>
          {slides[current]}
        </div>

        {/* ── Floating right-edge next arrow ──────────────────────── */}
        {current < total - 1 && (
          <button
            onClick={next}
            title="Next slide"
            style={{
              position: "fixed",
              right: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "80px",
              borderRadius: "12px 0 0 12px",
              background: accentDim,
              border: `1px solid rgba(255,255,255,0.15)`,
              borderRight: "none",
              color: "rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 50,
              transition: "background 150ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = accent + "55")}
            onMouseLeave={e => (e.currentTarget.style.background = accentDim)}
          >
            <ChevronRight style={{ width: 24, height: 24 }} />
          </button>
        )}

        {/* ── Floating right-edge prev arrow ──────────────────────── */}
        {current > 0 && (
          <button
            onClick={prev}
            title="Previous slide"
            style={{
              position: "fixed",
              right: "0",
              top: "calc(50% + 92px)",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "12px 0 0 12px",
              background: "rgba(255,255,255,0.06)",
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRight: "none",
              color: "rgba(255,255,255,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 50,
              transition: "background 150ms",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <ChevronLeft style={{ width: 18, height: 18 }} />
          </button>
        )}
      </div>

      {/* ── Dot nav ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0, flexWrap: "wrap" }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            title={`Slide ${i + 1}`}
            style={{
              width: i === current ? "20px" : "6px", height: "6px", borderRadius: "9999px",
              background: i === current ? accent : "rgba(255,255,255,0.18)",
              border: "none", cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0, flexShrink: 0,
            }} />
        ))}
      </div>

    </div>
  );
}

// ── Reusable slide layout helpers ─────────────────────────────────────────

export function SlideHero({ accent, bg, badge, title, subtitle, tagline, desc }: {
  accent: string; bg: string; badge?: string;
  title: string; subtitle?: string; tagline: string; desc: string;
}) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      {badge && (
        <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "20px", background: `${accent}20`, border: `1px solid ${accent}50`, color: accent, fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px" }}>
          {badge}
        </span>
      )}
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: "#fff", lineHeight: 1.05, marginBottom: "12px", letterSpacing: "-0.01em" }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 600, color: accent, marginBottom: "16px", letterSpacing: "0.01em" }}>
          {subtitle}
        </p>
      )}
      <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px, 1.8vw, 16px)", color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto 28px", lineHeight: 1.6 }}>
        {desc}
      </p>
      <div style={{ display: "inline-block", padding: "10px 24px", borderRadius: "10px", background: `${accent}15`, border: `1px solid ${accent}40`, fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: accent, letterSpacing: "0.05em" }}>
        {tagline}
      </div>
    </div>
  );
}

export function SlideContent({ accent, title, bullets, footer }: {
  accent: string; title: string; bullets: { icon?: string; head: string; body?: string }[]; footer?: string;
}) {
  return (
    <div style={{ padding: "20px 0" }}>
      <SlideTitle accent={accent} text={title} />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: "14px", padding: "16px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {b.icon && <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>{b.icon}</span>}
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{b.head}</p>
              {b.body && <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{b.body}</p>}
            </div>
          </div>
        ))}
      </div>
      {footer && <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "16px", textAlign: "center" }}>{footer}</p>}
    </div>
  );
}

export function SlideTitle({ accent, text, sub }: { accent: string; text: string; sub?: string }) {
  return (
    <div style={{ marginBottom: "4px" }}>
      <div style={{ width: "32px", height: "3px", borderRadius: "2px", background: accent, marginBottom: "12px" }} />
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
        {text}
      </h2>
      {sub && <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "6px" }}>{sub}</p>}
    </div>
  );
}

export function SlideTable({ accent, title, headers, rows, note }: {
  accent: string; title: string; headers: string[]; rows: (string | React.ReactNode)[][]; note?: string;
}) {
  return (
    <div style={{ padding: "20px 0" }}>
      <SlideTitle accent={accent} text={title} />
      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-data)", fontSize: "12px" }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ padding: "10px 14px", textAlign: "left", color: accent, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", fontSize: "10px", borderBottom: `2px solid ${accent}40`, background: `${accent}10` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: "10px 14px", color: ci === 0 ? "#fff" : "rgba(255,255,255,0.65)", borderBottom: "1px solid rgba(255,255,255,0.05)", verticalAlign: "middle" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "12px" }}>{note}</p>}
    </div>
  );
}

export function SlideStats({ accent, title, stats, note }: {
  accent: string; title: string;
  stats: { label: string; value: string; sub?: string; color?: string }[];
  note?: string;
}) {
  return (
    <div style={{ padding: "20px 0" }}>
      <SlideTitle accent={accent} text={title} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginTop: "24px" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: "20px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${(s.color || accent)}30`, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 800, color: s.color || accent, margin: "0 0 4px", lineHeight: 1 }}>
              {s.value}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.7)", margin: "0 0 2px", fontWeight: 600 }}>{s.label}</p>
            {s.sub && <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{s.sub}</p>}
          </div>
        ))}
      </div>
      {note && <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "14px", textAlign: "center" }}>{note}</p>}
    </div>
  );
}

export function SlideTwoCol({ accent, title, left, right }: {
  accent: string; title: string;
  left: React.ReactNode; right: React.ReactNode;
}) {
  return (
    <div style={{ padding: "20px 0" }}>
      <SlideTitle accent={accent} text={title} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </div>
  );
}

export function BulletCard({ accent, items }: { accent: string; items: string[] }) {
  return (
    <div style={{ padding: "16px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < items.length - 1 ? "10px" : 0 }}>
          <span style={{ color: accent, fontWeight: 700, flexShrink: 0, fontSize: "13px" }}>→</span>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.5 }}>{item}</p>
        </div>
      ))}
    </div>
  );
}

export function Highlight({ accent, text, sub }: { accent: string; text: string; sub?: string }) {
  return (
    <div style={{ padding: "16px 20px", borderRadius: "12px", background: `${accent}12`, border: `1px solid ${accent}35`, marginTop: "14px" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: accent, margin: sub ? "0 0 4px" : 0 }}>{text}</p>
      {sub && <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{sub}</p>}
    </div>
  );
}
