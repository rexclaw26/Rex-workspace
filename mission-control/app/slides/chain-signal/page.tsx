"use client";

import SlideViewer, {
  SlideConfig,
  SlideHero,
  SlideContent,
  SlideTable,
  SlideStats,
  SlideTwoCol,
  BulletCard,
  Highlight,
  SlideTitle,
} from "@/components/slides/SlideViewer";

// ── ChainSignal palette ───────────────────────────────────────────────────
const P = "#3B82F6";     // Blue — primary
const S = "#818CF8";     // Indigo — secondary
const BG = "#0A0F1E";
const CARD = "#111827";
const DIM = "rgba(59,130,246,0.12)";
const SUCCESS = "#22C55E";
const WARN = "#F59E0B";

// ── Reusable sub-components ──────────────────────────────────────────────

function FunnelStep({
  step,
  title,
  bullets,
  accent,
}: {
  step: number;
  title: string;
  bullets: string[];
  accent: string;
}) {
  return (
    <div
      style={{
        padding: "18px 20px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${accent}30`,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-10px",
          left: "18px",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-data)",
          fontSize: "11px",
          fontWeight: 700,
          color: "#fff",
        }}
      >
        {step}
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "13px",
          fontWeight: 700,
          color: "#fff",
          margin: "6px 0 8px",
        }}
      >
        {title}
      </p>
      {bullets.map((b, i) => (
        <div
          key={i}
          style={{ display: "flex", gap: "8px", marginBottom: i < bullets.length - 1 ? "6px" : 0 }}
        >
          <span style={{ color: accent, fontWeight: 700, flexShrink: 0, fontSize: "12px" }}>→</span>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.6)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {b}
          </p>
        </div>
      ))}
    </div>
  );
}

function PersonaCard({
  name,
  age,
  portfolio,
  behavior,
  pain,
  likelihood,
  accent,
}: {
  name: string;
  age: string;
  portfolio: string;
  behavior: string;
  pain: string;
  likelihood: string;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${accent}25`,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "13px",
          fontWeight: 700,
          color: accent,
          margin: "0 0 8px",
        }}
      >
        {name}
      </p>
      {[
        { label: "Age", val: age },
        { label: "Portfolio", val: portfolio },
        { label: "Behavior", val: behavior },
        { label: "Pain", val: pain },
        { label: "Conversion", val: likelihood },
      ].map(({ label, val }, i) => (
        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: i < 4 ? "5px" : 0 }}>
          <span
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              minWidth: "72px",
              flexShrink: 0,
              paddingTop: "1px",
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.4,
            }}
          >
            {val}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── 15 slides ─────────────────────────────────────────────────────────────

const slides: React.ReactNode[] = [

  // ── Slide 1: Hero ────────────────────────────────────────────────────
  <SlideHero
    key="s1"
    accent={P}
    bg={BG}
    badge="By Discover Crypto · 1.4M Subscribers"
    title="ChainSignal"
    subtitle="AI Trading Intelligence Dashboard"
    tagline="Signal the cycle. Trade with conviction."
    desc="Real-time on-chain alerts and cycle signals for active crypto traders."
  />,

  // ── Slide 2: Problem ─────────────────────────────────────────────────
  <SlideContent
    key="s2"
    accent={P}
    title="The Problem"
    bullets={[
      {
        icon: "📊",
        head: "Data overload, zero signal",
        body: "Active traders juggle 10+ tools — Glassnode, Nansen, CoinGecko, TradingView. No unified layer synthesizes the noise into action.",
      },
      {
        icon: "💸",
        head: "Institutional pricing for retail needs",
        body: "Glassnode ($799/mo), Nansen ($150/mo). Tools built for hedge funds — not for the $50K portfolio retail trader who just wants clean signals.",
      },
      {
        icon: "🧭",
        head: "No cycle context",
        body: "Most tools show raw data but never answer the core question: where are we in the macro cycle? Traders guess instead of knowing.",
      },
      {
        icon: "😰",
        head: "Emotional trading fills the void",
        body: "Without systematic signals, traders buy fear and sell greed. No framework = consistent losses at cycle turns.",
      },
    ]}
  />,

  // ── Slide 3: Solution ────────────────────────────────────────────────
  <SlideContent
    key="s3"
    accent={P}
    title="The Solution"
    bullets={[
      {
        icon: "⚡",
        head: "AI-synthesized trading signals",
        body: "On-chain data (MVRV, SOPR, exchange flows, whale behavior) processed by AI into clear, actionable alerts — not raw charts.",
      },
      {
        icon: "🖥️",
        head: "Unified signal dashboard",
        body: "One screen. All key cycle metrics. Visual cycle positioning map shows exactly where we are in the macro structure.",
      },
      {
        icon: "🔔",
        head: "Real-time threshold alerts",
        body: "Custom SMS, email, and Discord notifications when key on-chain thresholds cross. No monitoring required — ChainSignal watches for you.",
      },
      {
        icon: "💰",
        head: "Retail pricing",
        body: "$29–$79/month vs. $150–$799/month for institutional tools. Premium intelligence at 10% of the cost.",
      },
    ]}
  />,

  // ── Slide 4: Market Opportunity ──────────────────────────────────────
  <SlideStats
    key="s4"
    accent={P}
    title="Market Opportunity"
    stats={[
      {
        label: "Active Retail Crypto Traders",
        value: "50M+",
        sub: "Globally — growing YoY",
        color: P,
      },
      {
        label: "Paid Analytics Market",
        value: "$2.4B",
        sub: "22% CAGR (industry estimates)",
        color: S,
      },
      {
        label: "DC Audience → Subscribers",
        value: "1,400",
        sub: "1.4M subs × 0.1% conversion",
        color: P,
      },
      {
        label: "Revenue Ceiling (Mo. 12)",
        value: "$72K",
        sub: "1,600 subscribers × $45 ARPU",
        color: SUCCESS,
      },
    ]}
    note="Conversion benchmark: influencer SaaS launch campaigns (0.05%–0.2% conversion)"
  />,

  // ── Slide 5: Competitive Landscape ──────────────────────────────────
  <SlideTable
    key="s5"
    accent={P}
    title="Competitive Landscape"
    headers={["Tool", "Price/Mo", "Strength", "Weakness"]}
    rows={[
      [
        <span key="cs" style={{ color: P, fontWeight: 700 }}>
          ChainSignal ★
        </span>,
        "$29–$79",
        "Brand trust + unified AI signals",
        "—",
      ],
      ["Token Metrics", "$39–$99", "AI token ratings", "Complex; no brand trust"],
      ["Glassnode", "$29–$799", "Deep on-chain data", "Not trader-friendly"],
      ["Nansen", "$150+", "Wallet intelligence", "Too expensive for retail"],
      ["TradingView", "$14–$60", "Charts + community", "No on-chain signal layer"],
    ]}
    note="ChainSignal is the only retail-priced, brand-backed, on-chain AI signal dashboard in this space."
  />,

  // ── Slide 6: Target Customer ─────────────────────────────────────────
  <div key="s6" style={{ padding: "20px 0" }}>
    <SlideTitle accent={P} text="Target Customer" />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "14px",
        marginTop: "20px",
      }}
    >
      <PersonaCard
        name="The Active Trader"
        age="25–40"
        portfolio="$25K–$250K in crypto"
        behavior="Trades 3–5× per week. Already pays for 2–3 analytics tools."
        pain="Wants systematic signals, not scattered data. Tired of noise."
        likelihood="High — already budget-allocated for tools."
        accent={P}
      />
      <PersonaCard
        name="The Serious HODLer"
        age="30–50"
        portfolio="$50K–$500K in crypto"
        behavior="Holds 6–18 months. Reads Glassnode for free but can't justify $150/mo."
        pain="Needs cycle entry/exit signals to time allocation shifts."
        likelihood="High — trusts Kelly's 10-year track record."
        accent={S}
      />
      <PersonaCard
        name="The DeFi Participant"
        age="25–40"
        portfolio="$10K–$100K, active in DeFi"
        behavior="Bridges, stakes, farms. Needs macro context for timing."
        pain="On-chain data exists but interpreting it takes hours."
        likelihood="Medium — price-sensitive, converts on clear value demo."
        accent={P}
      />
    </div>
  </div>,

  // ── Slide 7: Product Details ─────────────────────────────────────────
  <SlideTwoCol
    key="s7"
    accent={P}
    title="Product Details"
    left={
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          {
            icon: "📡",
            head: "Live Signal Dashboard",
            body: "MVRV, SOPR, exchange flows, whale accumulation — all real-time, all in one screen.",
          },
          {
            icon: "🔔",
            head: "Smart Alert Engine",
            body: "Customizable thresholds. SMS / email / Discord. Fires only when conditions are genuinely significant.",
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 5px",
              }}
            >
              {item.icon} {item.head}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: "rgba(255,255,255,0.55)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {item.body}
            </p>
          </div>
        ))}
      </div>
    }
    right={
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          {
            icon: "🗺️",
            head: "Cycle Positioning Map",
            body: "Visual macro cycle overview — accumulation, markup, distribution, markdown. Know the phase instantly.",
          },
          {
            icon: "📋",
            head: "Weekly AI Report",
            body: "Plain-English on-chain summary. What the data means, what to watch, and the cycle outlook for the week ahead.",
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 5px",
              }}
            >
              {item.icon} {item.head}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: "rgba(255,255,255,0.55)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {item.body}
            </p>
          </div>
        ))}
      </div>
    }
  />,

  // ── Slide 8: Pricing ─────────────────────────────────────────────────
  <div key="s8" style={{ padding: "20px 0" }}>
    <SlideTitle accent={P} text="Pricing" />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px",
        marginTop: "22px",
      }}
    >
      {[
        {
          tier: "Starter",
          price: "$29",
          period: "/month",
          features: ["Live signal dashboard", "Weekly AI report", "Email alerts"],
          accent: "rgba(255,255,255,0.35)",
          highlight: false,
        },
        {
          tier: "Pro",
          price: "$49",
          period: "/month",
          features: ["Everything in Starter", "Real-time SMS alerts", "Discord notifications"],
          accent: P,
          highlight: true,
        },
        {
          tier: "Elite",
          price: "$79",
          period: "/month",
          features: ["Everything in Pro", "Private Discord community", "Monthly deep-dive PDF"],
          accent: S,
          highlight: false,
        },
        {
          tier: "Lifetime",
          price: "$799",
          period: "one-time",
          features: ["Pro features forever", "Limited to 100 spots", "Founding member badge"],
          accent: WARN,
          highlight: false,
        },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            padding: "18px 16px",
            borderRadius: "14px",
            background: item.highlight ? `${P}18` : "rgba(255,255,255,0.04)",
            border: `1px solid ${item.highlight ? P + "50" : "rgba(255,255,255,0.08)"}`,
            position: "relative",
          }}
        >
          {item.highlight && (
            <span
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                background: P,
                color: "#fff",
                fontFamily: "var(--font-data)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                padding: "3px 10px",
                borderRadius: "20px",
                whiteSpace: "nowrap",
              }}
            >
              MOST POPULAR
            </span>
          )}
          <p
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "10px",
              fontWeight: 700,
              color: item.accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "0 0 6px",
            }}
          >
            {item.tier}
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "3px", marginBottom: "12px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {item.price}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {item.period}
            </span>
          </div>
          {item.features.map((f, fi) => (
            <div key={fi} style={{ display: "flex", gap: "7px", marginBottom: fi < item.features.length - 1 ? "6px" : 0 }}>
              <span style={{ color: item.accent, fontSize: "11px", flexShrink: 0 }}>✓</span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.4,
                }}
              >
                {f}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
    <p
      style={{
        fontFamily: "var(--font-data)",
        fontSize: "10px",
        color: "rgba(255,255,255,0.3)",
        marginTop: "14px",
        textAlign: "center",
      }}
    >
      Annual billing: 2 months free · 14-day free trial on Starter and Pro
    </p>
  </div>,

  // ── Slide 9: Revenue Projections ─────────────────────────────────────
  <div key="s9" style={{ padding: "20px 0" }}>
    <SlideTitle accent={P} text="Revenue Projections" />
    <div style={{ marginTop: "20px", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-data)",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr>
            {["Metric", "Month 1", "Month 3", "Month 6", "Month 12"].map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  color: P,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fontSize: "10px",
                  borderBottom: `2px solid ${P}40`,
                  background: `${P}10`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Subscribers", "120", "350", "750", "1,600"],
            ["Blended ARPU", "$38", "$41", "$43", "$45"],
            ["Churn Rate", "10%", "9%", "8%", "8%"],
          ].map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "10px 14px",
                    color: ci === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.55)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          <tr style={{ background: `${P}12` }}>
            {["MRR", "$4,560", "$14,350", "$32,250", "$72,000"].map((cell, ci) => (
              <td
                key={ci}
                style={{
                  padding: "12px 14px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "14px",
                  color: ci === 0 ? "#fff" : SUCCESS,
                  borderBottom: `1px solid ${P}30`,
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
    <div
      style={{
        marginTop: "14px",
        padding: "12px 16px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-data)",
          fontSize: "10px",
          color: "rgba(255,255,255,0.4)",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        Assumptions: 1 YouTube mention (1.4M subs, 0.1% conversion = 1,400 trial signups, 20% trial-to-paid) · 8% monthly churn · Tier mix: 50% Starter, 35% Pro, 15% Elite · No paid acquisition
      </p>
    </div>
  </div>,

  // ── Slide 10: Brand Identity ─────────────────────────────────────────
  <div key="s10" style={{ padding: "20px 0" }}>
    <SlideTitle accent={P} text="Brand Identity" />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px",
        marginTop: "22px",
      }}
    >
      {[
        {
          icon: "🎨",
          label: "Color Palette",
          value: "Electric Blue + Indigo",
          sub: "#3B82F6 · #818CF8 · Deep Navy bg",
          accent: P,
        },
        {
          icon: "✍️",
          label: "Voice",
          value: "Confident & Data-Native",
          sub: "Trader-native, precise, zero fluff",
          accent: S,
        },
        {
          icon: "🔤",
          label: "Typography",
          value: "Display + Data fonts",
          sub: "Headers: Display · Stats: Mono · Body: Clean sans",
          accent: P,
        },
        {
          icon: "⚡",
          label: "Vibe",
          value: "Bloomberg meets Retail",
          sub: "Institutional precision at retail price",
          accent: S,
        },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            padding: "18px 16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${item.accent}25`,
          }}
        >
          <div style={{ fontSize: "20px", marginBottom: "8px" }}>{item.icon}</div>
          <p
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "10px",
              color: item.accent,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "0 0 4px",
            }}
          >
            {item.label}
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 4px",
            }}
          >
            {item.value}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.45)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {item.sub}
          </p>
        </div>
      ))}
    </div>
    <Highlight
      accent={P}
      text='"ChainSignal by Discover Crypto" — 10 years of credibility baked into the name.'
      sub="Logo: Signal pulse icon with chain link motif. Immediate recognition for the DC audience."
    />
  </div>,

  // ── Slide 11: Go-to-Market ───────────────────────────────────────────
  <div key="s11" style={{ padding: "20px 0" }}>
    <SlideTitle accent={P} text="Go-to-Market" />
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "22px" }}>
      {[
        {
          phase: "Phase 1 — Build",
          window: "Weeks 1–4",
          items: [
            "Next.js dashboard + Convex backend + CoinGecko / Glassnode API integrations",
            "Smart alert engine (SMS via Twilio, email via SendGrid, Discord bot)",
            "Beta invite queue: 100 founding member spots at Starter pricing",
          ],
          accent: P,
        },
        {
          phase: "Phase 2 — Soft Launch",
          window: "Week 4–6",
          items: [
            "Founding member cohort goes live — exclusive pricing, direct feedback loop",
            "Landing page with live signal teaser (previews dashboard without full access)",
            "Discord announcement + X thread with dashboard screenshots",
          ],
          accent: S,
        },
        {
          phase: "Phase 3 — Scale",
          window: "Month 2+",
          items: [
            "1 YouTube video: \u201CI Built a Crypto Intelligence Dashboard\u201D \u2014 100K\u2013200K views",
            "10% recurring affiliate commission for crypto creators promoting ChainSignal",
            "Lifetime offer to first 100 founding members (creates urgency, front-loads cash)",
          ],
          accent: P,
        },
      ].map((phase, i) => (
        <div
          key={i}
          style={{
            padding: "16px 18px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${phase.accent}25`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {phase.phase}
            </span>
            <span
              style={{
                fontFamily: "var(--font-data)",
                fontSize: "10px",
                color: phase.accent,
                background: `${phase.accent}18`,
                border: `1px solid ${phase.accent}35`,
                padding: "2px 9px",
                borderRadius: "20px",
              }}
            >
              {phase.window}
            </span>
          </div>
          {phase.items.map((item, ii) => (
            <div key={ii} style={{ display: "flex", gap: "8px", marginBottom: ii < phase.items.length - 1 ? "6px" : 0 }}>
              <span style={{ color: phase.accent, fontWeight: 700, flexShrink: 0, fontSize: "12px" }}>→</span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>,

  // ── Slide 12: Content & Marketing ────────────────────────────────────
  <SlideTwoCol
    key="s12"
    accent={P}
    title="Content & Marketing"
    left={
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${P}25`,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 6px",
            }}
          >
            📺 YouTube
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.55)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            1 dedicated video: "I Built a Crypto Intelligence Dashboard" — 100K–200K views expected. Description CTA links directly to ChainSignal trial.
          </p>
        </div>
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${S}25`,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 6px",
            }}
          >
            🐦 X / Twitter
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.55)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Daily signal snapshot posts with dashboard screenshots. Thread on launch day — "The exact signals I use to time my crypto trades."
          </p>
        </div>
      </div>
    }
    right={
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${P}25`,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 6px",
            }}
          >
            💬 Discord
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.55)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Founding member cohort with exclusive pricing. Early access builds social proof before public launch.
          </p>
        </div>
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${S}25`,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 6px",
            }}
          >
            🤝 Affiliate Program
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.55)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            10% recurring commission. Partner with 5–10 crypto creators. Compounding channel growth with zero paid ad spend.
          </p>
        </div>
      </div>
    }
  />,

  // ── Slide 13: Funnel Part 1 ──────────────────────────────────────────
  <div key="s13" style={{ padding: "20px 0" }}>
    <SlideTitle
      accent={P}
      text="Customer Funnel — Part 1"
      sub="Awareness → Trial (Steps 1–4)"
    />
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "24px" }}>
      <FunnelStep
        step={1}
        title="YouTube Discovery"
        bullets={[
          'Viewer watches "I Built a Crypto Intelligence Dashboard" — 100K–200K views',
          "Video description: link to ChainSignal landing page + 14-day free trial offer",
        ]}
        accent={P}
      />
      <FunnelStep
        step={2}
        title="Landing Page"
        bullets={[
          "Live signal preview teaser — shows dashboard without full access",
          "Value prop: $29/mo vs. $150/mo for Nansen. CTA: Start Free Trial",
        ]}
        accent={S}
      />
      <FunnelStep
        step={3}
        title="Trial Sign-Up"
        bullets={[
          "14-day free trial — email + credit card required (reduces tire-kicker churn)",
          "Instant dashboard access + welcome email with setup guide",
        ]}
        accent={P}
      />
      <FunnelStep
        step={4}
        title="Onboarding Hook"
        bullets={[
          "First real-time alert fires within 24 hours — immediate value delivery",
          "Email day 7: 'Your trial ends in 7 days — here's what you've been tracking'",
        ]}
        accent={S}
      />
    </div>
  </div>,

  // ── Slide 14: Funnel Part 2 ──────────────────────────────────────────
  <div key="s14" style={{ padding: "20px 0" }}>
    <SlideTitle
      accent={P}
      text="Customer Funnel — Part 2"
      sub="Conversion → Lifetime Value (Steps 5–8)"
    />
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "24px" }}>
      <FunnelStep
        step={5}
        title="Trial → Paid Conversion (Day 14)"
        bullets={[
          "20% trial-to-paid conversion target. Starter at $29/mo as default.",
          "In-app upsell: 'Add real-time SMS alerts for $20 more/month'",
        ]}
        accent={P}
      />
      <FunnelStep
        step={6}
        title="Retention via Signal Accuracy"
        bullets={[
          "Daily dashboard usage creates habit. Weekly AI report reinforces value.",
          "When a signal proves accurate, users share on X — organic amplification loop",
        ]}
        accent={S}
      />
      <FunnelStep
        step={7}
        title="Tier Upsell (Month 3)"
        bullets={[
          "Pro users offered Elite: 'Add private Discord + monthly deep-dive for $30 more'",
          "Target: 15% of Pro → Elite conversion",
        ]}
        accent={P}
      />
      <FunnelStep
        step={8}
        title="Lifetime Offer (Month 6)"
        bullets={[
          "6-month subscribers get exclusive lifetime access offer ($799, 100 spots only)",
          "Creates urgency. Front-loads $79K cash. Reduces long-term churn permanently.",
        ]}
        accent={S}
      />
    </div>
  </div>,

  // ── Slide 15: Why This Wins ──────────────────────────────────────────
  <div key="s15" style={{ padding: "20px 0" }}>
    <SlideTitle accent={P} text="Why This Wins" />
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "22px" }}>
      {[
        {
          number: "01",
          head: "Unmatched brand moat",
          body: "1.4M YouTube subscribers can't be bought overnight. One mention = 1,400 first-wave subscribers. Token Metrics can clone the features. They can't clone 10 years of Kelly's credibility.",
          accent: P,
        },
        {
          number: "02",
          head: "Real SaaS — not templates, not a newsletter",
          body: "A full Next.js web dashboard with live data, smart alerts, and AI reports. This is software. It compounds. It scales. It has a real revenue ceiling.",
          accent: S,
        },
        {
          number: "03",
          head: "$72K MRR ceiling — and it goes higher",
          body: "1,600 subscribers × $45 ARPU = $72K MRR by month 12. With a lifetime offer and affiliate program, $100K MRR is achievable by month 18.",
          accent: P,
        },
        {
          number: "04",
          head: "Zero Kelly production time",
          body: "Rex builds and maintains the data pipeline. AI generates weekly reports. Alerts fire automatically. Kelly's only job: one YouTube video at launch.",
          accent: S,
        },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "16px",
            padding: "16px 18px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${item.accent}25`,
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-data)",
              fontSize: "22px",
              fontWeight: 800,
              color: `${item.accent}50`,
              flexShrink: 0,
              lineHeight: 1,
              minWidth: "28px",
            }}
          >
            {item.number}
          </span>
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 4px",
              }}
            >
              {item.head}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: "rgba(255,255,255,0.6)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {item.body}
            </p>
          </div>
        </div>
      ))}
    </div>
    <div
      style={{
        marginTop: "16px",
        padding: "14px 20px",
        borderRadius: "12px",
        background: `${P}15`,
        border: `1px solid ${P}40`,
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "15px",
          fontWeight: 800,
          color: P,
          margin: 0,
        }}
      >
        ChainSignal — the signal layer that active traders have been waiting for.
      </p>
    </div>
  </div>,
];

// ── Page export ───────────────────────────────────────────────────────────

const config: SlideConfig = {
  deckTitle: "ChainSignal",
  deckSlug: "chain-signal",
  accent: P,
  accentDim: DIM,
  bg: BG,
  bgCard: CARD,
  slides,
};

export default function ChainSignalDeck() {
  return <SlideViewer config={config} />;
}
