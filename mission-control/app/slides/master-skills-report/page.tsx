"use client";

import SlideViewer, {
  SlideHero, SlideContent, SlideTitle, SlideTable, SlideStats,
  SlideTwoCol, BulletCard, Highlight, type SlideConfig,
} from "@/components/slides/SlideViewer";

const A = "#F97316";   // Orange — primary accent
const V = "#8B5CF6";   // Violet — secondary accent
const G = "#22C55E";   // Green — data / cost
const R = "#EF4444";   // Red — warning / skip

const config: SlideConfig = {
  deckTitle: "Master Skills Report",
  deckSlug: "master-skills-report",
  accent: A,
  accentDim: "rgba(249,115,22,0.12)",
  bg: "#0B1120",
  bgCard: "#0F172A",
  slides: [

    // ── 1. HERO ──────────────────────────────────────────────────────────
    <SlideHero key={1}
      accent={A} bg="#0B1120"
      badge="Internal Report · Rex Analysis"
      title="Master Skills: What's Worth Installing"
      subtitle="339 skills evaluated. 25 selected. Here's why."
      tagline="Curated from LeoYeAI/openclaw-master-skills"
      desc="Rex's evaluation of 339 community skills — ranked by fit, cost, and immediate business value."
    />,

    // ── 2. OVERVIEW ──────────────────────────────────────────────────────
    <SlideStats key={2} accent={A}
      title="What we evaluated"
      stats={[
        { label: "Total Skills in Repo", value: "339", sub: "LeoYeAI/openclaw-master-skills on GitHub", color: A },
        { label: "Categories Reviewed", value: "5", sub: "Prompt · Marketing · Web · Mobile · Automation", color: V },
        { label: "Skills Shortlisted", value: "25", sub: "Across Priority, High-Value, and Mobile tiers", color: G },
        { label: "Auto-Installed", value: "0", sub: "Every selection required human review first", color: R },
      ]}
      note="Every selection evaluated for: fit to our stack, integration risk, cost, and immediate business value."
    />,

    // ── 3. PRIORITY TIER HEADER ──────────────────────────────────────────
    <div key={3} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "340px", textAlign: "center", padding: "20px" }}>
      <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "20px", background: `${A}20`, border: `1px solid ${A}50`, fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: A, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "28px" }}>
        Priority Tier
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
        Install These First
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(14px, 2.5vw, 18px)", color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: "520px" }}>
        Zero risk. No new dependencies. Immediate upgrade.
      </p>
    </div>,

    // ── 4. PRIORITY: PROMPT ENGINEERING ─────────────────────────────────
    <div key={4} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="Better prompts = better everything" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { icon: "🧠", skill: "prompt-engineering-expert", desc: "Designs and audits AI prompts for maximum output quality" },
          { icon: "⚡", skill: "prompt-engineering-patterns", desc: "Advanced techniques — chain-of-thought, few-shot, structured outputs" },
          { icon: "🔁", skill: "boost-prompt", desc: "Interactive refinement workflow — interrogates scope before building" },
        ].map((b) => (
          <div key={b.skill} style={{ display: "flex", gap: "12px", padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: "20px", flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: A, margin: "0 0 3px", letterSpacing: "0.03em" }}>{b.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: "8px", background: `${V}15`, border: `1px solid ${V}30` }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: V, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>How to integrate</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>Drop into workspace/skills/ — auto-triggers on any prompt design request</p>
        </div>
        <div style={{ padding: "12px 14px", borderRadius: "8px", background: `${G}15`, border: `1px solid ${G}30`, minWidth: "100px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: G, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Cost</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: G, margin: 0 }}>Free</p>
          <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: 0 }}>prompt only</p>
        </div>
      </div>
    </div>,

    // ── 5. PRIORITY: MARKETING + SEO ────────────────────────────────────
    <div key={5} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="23 marketing playbooks in one install" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { icon: "📈", skill: "marketing-mode", desc: "CRO, SEO, copy, ads, social — all in one skill" },
          { icon: "✍️", skill: "copywriting", desc: "Homepage, CTAs, landing pages — structured framework" },
          { icon: "🔍", skill: "seo-audit", desc: "Diagnose and fix SEO issues on Discover Crypto + Blockchain Basement" },
          { icon: "📅", skill: "content-strategy", desc: "Plan content calendars with data-driven decisions" },
        ].map((b) => (
          <div key={b.skill} style={{ display: "flex", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: A, margin: "0 0 2px", letterSpacing: "0.03em" }}>{b.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "14px", display: "flex", gap: "12px" }}>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: "8px", background: `${V}15`, border: `1px solid ${V}30` }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: V, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>How to integrate</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>Install all 4 — they each trigger on different content tasks, no overlap</p>
        </div>
        <div style={{ padding: "12px 14px", borderRadius: "8px", background: `${G}15`, border: `1px solid ${G}30`, minWidth: "100px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: G, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Cost</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: G, margin: 0 }}>Free</p>
        </div>
      </div>
    </div>,

    // ── 6. PRIORITY: WEB DESIGN & UI ────────────────────────────────────
    <div key={6} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="Every web build gets better immediately" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { icon: "🎨", skill: "frontend-design-ultimate", desc: "Production-grade React + Tailwind + shadcn/ui" },
          { icon: "💡", skill: "ui-ux-pro-max", desc: "UI/UX design intelligence for polished interfaces" },
          { icon: "✨", skill: "superdesign", desc: "Expert guidelines for beautiful, modern UI" },
          { icon: "📱", skill: "responsive-design", desc: "Container queries, fluid typography, CSS Grid mastery" },
        ].map((b) => (
          <div key={b.skill} style={{ display: "flex", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: A, margin: "0 0 2px", letterSpacing: "0.03em" }}>{b.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "14px", display: "flex", gap: "12px" }}>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: "8px", background: `${V}15`, border: `1px solid ${V}30` }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: V, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>How to integrate</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>All 4 stack without conflict — load as context during any web build</p>
        </div>
        <div style={{ padding: "12px 14px", borderRadius: "8px", background: `${G}15`, border: `1px solid ${G}30`, minWidth: "100px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: G, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Cost</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: G, margin: 0 }}>Free</p>
        </div>
      </div>
    </div>,

    // ── 7. PRIORITY: NEXT.JS STACK ──────────────────────────────────────
    <div key={7} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="We're on Next.js. These make Rex smarter about it." />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { icon: "🏗️", skill: "next-best-practices", desc: "RSC boundaries, data patterns, metadata, error handling" },
          { icon: "🚀", skill: "nextjs-app-router-patterns", desc: "Streaming, parallel routes, advanced data fetching" },
          { icon: "🔧", skill: "nodejs-backend-patterns", desc: "Middleware, error handling, production-ready patterns" },
          { icon: "🔍", skill: "code-review", desc: "Security, performance, maintainability checks before shipping" },
        ].map((b) => (
          <div key={b.skill} style={{ display: "flex", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: A, margin: "0 0 2px", letterSpacing: "0.03em" }}>{b.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "14px", display: "flex", gap: "12px" }}>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: "8px", background: `${V}15`, border: `1px solid ${V}30` }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: V, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>How to integrate</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>Install all 4 — they activate automatically on Next.js / Node.js tasks</p>
        </div>
        <div style={{ padding: "12px 14px", borderRadius: "8px", background: `${G}15`, border: `1px solid ${G}30`, minWidth: "100px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: G, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Cost</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: G, margin: 0 }}>Free</p>
        </div>
      </div>
    </div>,

    // ── 8. HIGH VALUE TIER HEADER ────────────────────────────────────────
    <div key={8} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "340px", textAlign: "center", padding: "20px" }}>
      <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "20px", background: `${V}20`, border: `1px solid ${V}50`, fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: V, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "28px" }}>
        High Value Tier
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
        High Value — Install Next
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(14px, 2.5vw, 18px)", color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: "520px" }}>
        Strong additions with minimal setup required.
      </p>
    </div>,

    // ── 9. HIGH VALUE: ANALYTICS + CRO ──────────────────────────────────
    <div key={9} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="Turn traffic into revenue" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { icon: "📊", skill: "analytics-tracking", desc: "Set up and audit analytics across all Hit Network properties" },
          { icon: "🧪", skill: "ab-test-setup", desc: "Plan and implement A/B tests — critical for landing page CRO" },
          { icon: "💰", skill: "page-cro", desc: "Optimize any marketing page for conversions" },
          { icon: "🎯", skill: "signup-flow-cro", desc: "Optimize signup, trial activation, first-run experience" },
        ].map((b) => (
          <div key={b.skill} style={{ display: "flex", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: V, margin: "0 0 2px", letterSpacing: "0.03em" }}>{b.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "8px", background: `${V}15`, border: `1px solid ${V}30` }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: V, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>How to integrate</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>Use alongside existing article-writing and website-design skills · Cost: <span style={{ color: G, fontWeight: 700 }}>Free</span></p>
      </div>
    </div>,

    // ── 10. HIGH VALUE: RESEARCH + CONTENT ──────────────────────────────
    <div key={10} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="Research faster. Create more." />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { icon: "🔬", skill: "deep-research-pro", desc: "Multi-source web research with cited reports", cost: "Free" },
          { icon: "📺", skill: "youtube-transcript", desc: "Fetch + summarize competitor and source videos", cost: "Free" },
          { icon: "🗞️", skill: "academic-deep-research", desc: "Rigorous methodology — full sourcing, no hallucination", cost: "Free" },
          { icon: "🖼️", skill: "nano-banana-pro", desc: "AI image generation/editing via Gemini 3 Pro", cost: "~$0.01–0.05/img" },
        ].map((b) => (
          <div key={b.skill} style={{ display: "flex", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", alignItems: "center" }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{b.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: V, margin: "0 0 2px", letterSpacing: "0.03em" }}>{b.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{b.desc}</p>
            </div>
            <div style={{ flexShrink: 0, padding: "4px 10px", borderRadius: "6px", background: b.cost === "Free" ? `${G}20` : `${A}20`, border: `1px solid ${b.cost === "Free" ? G : A}40` }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: 700, color: b.cost === "Free" ? G : A }}>{b.cost}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "8px", background: `${V}15`, border: `1px solid ${V}30` }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: V, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>How to integrate</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>deep-research-pro replaces ad hoc web research · nano-banana-pro needs Gemini API key</p>
      </div>
    </div>,

    // ── 11. HIGH VALUE: BROWSER AUTOMATION ──────────────────────────────
    <div key={11} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="Rex can see and control the web" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { icon: "🎭", skill: "playwright", desc: "Browser automation — forms, screenshots, data extraction" },
          { icon: "🤖", skill: "agent-browser", desc: "Rust-based headless browser CLI with Node.js fallback" },
          { icon: "🕷️", skill: "browser-use", desc: "Automates interactions for testing and data extraction" },
        ].map((b) => (
          <div key={b.skill} style={{ display: "flex", gap: "12px", padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: "20px", flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: V, margin: "0 0 3px", letterSpacing: "0.03em" }}>{b.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: "8px", background: `${V}15`, border: `1px solid ${V}30` }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: V, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>How to integrate</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>playwright needs <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "4px", fontFamily: "var(--font-data)", fontSize: "11px" }}>npm install playwright</code> — low-effort setup. Adds competitive research + scraping.</p>
        </div>
        <div style={{ padding: "12px 14px", borderRadius: "8px", background: `${G}15`, border: `1px solid ${G}30`, minWidth: "100px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: G, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Cost</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: G, margin: 0 }}>Free</p>
          <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: 0 }}>open source</p>
        </div>
      </div>
    </div>,

    // ── 12. MOBILE APP TIER HEADER ───────────────────────────────────────
    <div key={12} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "340px", textAlign: "center", padding: "20px" }}>
      <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "20px", background: `${G}20`, border: `1px solid ${G}50`, fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: G, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "28px" }}>
        Mobile App Tier
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
        Mobile App: Ready When You Are
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(14px, 2.5vw, 18px)", color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: "560px" }}>
        Install now. Activates automatically when we build the Hit Network app.
      </p>
    </div>,

    // ── 13. MOBILE APP SKILLS ────────────────────────────────────────────
    <div key={13} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="Full Expo toolkit — iOS + Android" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { icon: "📱", skill: "expo-building-native-ui", desc: "Beautiful native UI with Expo Router" },
          { icon: "🚀", skill: "expo-deployment", desc: "iOS App Store + Android Play Store end-to-end" },
          { icon: "🎨", skill: "expo-tailwind-setup", desc: "Tailwind CSS v4 in Expo — our existing style system" },
          { icon: "⚡", skill: "expo-native-data-fetching", desc: "Network requests, API calls, error handling" },
        ].map((b) => (
          <div key={b.skill} style={{ display: "flex", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: G, margin: "0 0 2px", letterSpacing: "0.03em" }}>{b.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "14px", display: "flex", gap: "12px" }}>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: "8px", background: `${G}15`, border: `1px solid ${G}30` }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: G, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>How to integrate</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>Install all Expo skills now — zero activation cost until app build begins</p>
        </div>
        <div style={{ padding: "12px 14px", borderRadius: "8px", background: `${G}15`, border: `1px solid ${G}30`, minWidth: "100px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: G, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Cost</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: G, margin: 0 }}>Free</p>
        </div>
      </div>
    </div>,

    // ── 14. WATCH LIST / SKIP ────────────────────────────────────────────
    <div key={14} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="What we're watching vs. skipping" />
      <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Watch List */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: A }} />
            <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: A, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Watch List</p>
          </div>
          {[
            { skill: "scrapling-official", reason: "Anti-bot scraping — legal gray area" },
            { skill: "agent-autonomy-kit", reason: "Needs full review before install" },
            { skill: "n8n-workflow-automation", reason: "Needs n8n infrastructure" },
          ].map((w) => (
            <div key={w.skill} style={{ padding: "10px 12px", borderRadius: "8px", background: `${A}10`, border: `1px solid ${A}25`, marginBottom: "8px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: A, margin: "0 0 3px" }}>{w.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>{w.reason}</p>
            </div>
          ))}
        </div>
        {/* Skip List */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: R }} />
            <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: R, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Skip</p>
          </div>
          {[
            { skill: "humanize-ai-text", reason: "Conflicts with our own framework" },
            { skill: "tiktok-viral-predictor", reason: "Not our platform" },
            { skill: "baidu-search", reason: "China-market tools" },
          ].map((s) => (
            <div key={s.skill} style={{ padding: "10px 12px", borderRadius: "8px", background: `${R}10`, border: `1px solid ${R}25`, marginBottom: "8px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: R, margin: "0 0 3px" }}>{s.skill}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>{s.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // ── 15. ROLLOUT PLAN ─────────────────────────────────────────────────
    <div key={15} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="The rollout plan" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { num: "01", icon: "🧠", head: "Prompt Engineering skills", body: "Immediate quality lift across everything", color: A },
          { num: "02", icon: "📈", head: "Marketing + SEO skills", body: "marketing-mode, copywriting, seo-audit, content-strategy", color: A },
          { num: "03", icon: "🎨", head: "Web Design skills", body: "frontend-design-ultimate, ui-ux-pro-max, superdesign, responsive-design", color: V },
          { num: "04", icon: "💻", head: "Next.js + Node skills", body: "next-best-practices, nextjs-app-router-patterns, nodejs-backend-patterns, code-review", color: V },
          { num: "05", icon: "📱", head: "Expo/mobile skills", body: "Install all now — activate when app build starts", color: G },
        ].map((step) => (
          <div key={step.num} style={{ display: "flex", gap: "14px", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${step.color}25`, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: step.color }}>{step.num}</span>
              <span style={{ fontSize: "16px" }}>{step.icon}</span>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>{step.head}</p>
              <p style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: "rgba(255,255,255,0.45)", margin: 0 }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "8px", background: `${G}15`, border: `1px solid ${G}30` }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0 }}>
          <span style={{ color: G, fontWeight: 700 }}>All Priority Tier installs</span> = copy folder to <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "4px", fontFamily: "var(--font-data)", fontSize: "11px" }}>~/.openclaw/workspace/skills/</code> — no code changes, no breaking anything
        </p>
      </div>
    </div>,

  ],
};

export default function MasterSkillsReportDeck() {
  return <SlideViewer config={config} />;
}
