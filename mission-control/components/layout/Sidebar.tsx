"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, Users,
  Activity, Calendar, Zap, Newspaper, Twitter, Brain, Layers,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",  href: "/",          icon: LayoutDashboard, abbr: "D" },
  { label: "Headlines",  href: "/headlines", icon: Newspaper,        abbr: "H" },
  { label: "X Feed",     href: "/x-feed",   icon: Twitter,          abbr: "X" },
  { label: "Tasks",      href: "/tasks",     icon: CheckSquare,      abbr: "T" },
  { label: "Agents",     href: "/agents",    icon: Users,            abbr: "A" },
  { label: "Operations", href: "/ops",       icon: Activity,         abbr: "O" },
  { label: "Calendar",   href: "/calendar",  icon: Calendar,         abbr: "C" },
  { label: "Decks",      href: "/decks",     icon: Layers,           abbr: "K" },
  { label: "Memory",     href: "/memory",    icon: Brain,            abbr: "M" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">

      {/* ── Logo / Brand ────────────────────────────────────────────── */}
      <div className="border-b border-[--border-subtle]">

        {/* Desktop header — full REX + MISSION CONTROL */}
        <div className="hidden md:block px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "28px", color: "var(--text-orange)",
              letterSpacing: "0.05em", lineHeight: 1,
              textShadow: "0 0 18px rgba(249,115,22,0.4)",
            }}>
              REX
            </span>
            <div className="flex flex-col leading-none">
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "11px", color: "var(--text-taupe)",
                letterSpacing: "0.18em", textTransform: "uppercase",
              }}>MISSION</span>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "11px", color: "var(--text-taupe)",
                letterSpacing: "0.18em", textTransform: "uppercase",
              }}>CONTROL</span>
            </div>
          </div>
          <p className="mt-2 text-[10px] tracking-widest uppercase"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
            Hit Network · AI Operations
          </p>
        </div>

        {/* Mobile header — just REX centered */}
        <div className="md:hidden flex items-center justify-center py-4">
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "20px", color: "var(--text-orange)",
            letterSpacing: "0.05em", lineHeight: 1,
            textShadow: "0 0 18px rgba(249,115,22,0.4)",
          }}>
            REX
          </span>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}

      {/* Desktop nav — icon + full label */}
      <nav className="hidden md:flex flex-col flex-1 px-3 pt-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
              transition-all duration-150 group
              ${active
                ? "bg-orange-500/10 text-orange-400 border-l-2 border-orange-500 pl-[10px]"
                : "text-[--text-muted] hover:text-[--text-taupe] hover:bg-white/[0.04] border-l-2 border-transparent"
              }
            `}>
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                active ? "text-orange-400" : "text-[--text-muted] group-hover:text-[--text-taupe]"
              }`} />
              <span className="font-medium tracking-wide flex-1"
                style={{ fontFamily: "var(--font-body)", fontSize: "13px" }}>
                {label}
              </span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Mobile nav — letter buttons only, centered */}
      <nav className="md:hidden flex flex-col flex-1 items-center pt-3 gap-1">
        {navItems.map(({ label, href, abbr }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                borderLeft: active ? "2px solid var(--orange)" : "2px solid transparent",
                background: active ? "rgba(249,115,22,0.12)" : "transparent",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.05em",
                color: active ? "var(--orange)" : "var(--text-muted)",
                transition: "all 150ms",
                textDecoration: "none",
              }}
            >
              {abbr}
            </Link>
          );
        })}
      </nav>

      {/* ── Rex Status ──────────────────────────────────────────────── */}

      {/* Desktop status — full card */}
      <div className="hidden md:block px-4 pb-6 pt-4 border-t border-[--border-subtle]">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg bg-white/[0.03]">
          <div className="dot-online shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate"
              style={{ color: "var(--text-taupe)", fontFamily: "var(--font-display)" }}>
              Rex
            </p>
            <p className="text-[10px] truncate"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
              Sonnet 4.6 · Online
            </p>
          </div>
          <Zap className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-auto" />
        </div>
      </div>

      {/* Mobile status — just the green dot centered */}
      <div className="md:hidden flex justify-center pb-5 pt-3 border-t border-[--border-subtle]">
        <div className="dot-online" title="Rex Online" />
      </div>

    </aside>
  );
}
