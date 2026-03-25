"use client";

import SlideViewer, {
  SlideConfig,
  SlideHero,
  SlideContent,
  SlideTitle,
  SlideTable,
  SlideStats,
  SlideTwoCol,
  BulletCard,
} from "@/components/slides/SlideViewer";

// ── CycleEdge Pro color tokens ─────────────────────────────────────────────
const PRIMARY   = "#F97316"; // Orange
const SECONDARY = "#FBBF24"; // Amber
const BG        = "#0A0F1E";
const BG_CARD   = "#111827";
const ACCENT_DIM = "rgba(249,115,22,0.15)";

// ── Slide 1: Hero ──────────────────────────────────────────────────────────
const Slide1 = () => (
  <SlideHero
    accent={PRIMARY}
    bg={BG}
    badge="AI-Generated · Retail-Priced · Trusted by 1.4M Subscribers"
    title="CycleEdge Pro"
    subtitle="Weekly AI-Powered Crypto Cycle Intelligence"
    tagline="Know where you are in the cycle. Position before everyone else does."
    desc="Automated weekly on-chain analysis, cycle positioning, and investment thesis — straight to your inbox."
  />
);

// ── Slide 2: Problem ───────────────────────────────────────────────────────
const Slide2 = () => (
  <SlideContent
    accent={PRIMARY}
    title="The Problem"
    bullets={[
      {
        icon: "📊",
        head: "Information overload",
        body: "Retail investors drown in data from 10+ sources — Glassnode, Nansen, CoinGecko — with no unified signal.",
      },
      {
        icon: "💸",
        head: "Institutional pricing locks out retail",
        body: "$150–$799/month for tools designed for quants, not regular investors.",
      },
      {
        icon: "🧭",
        head: "No cycle framework exists at retail price",
        body: "Most tools show data but never explain where you are in the market cycle.",
      },
      {
        icon: "🕳️",
        head: "Free alternatives lack trust and depth",
        body: "Milk Road is free but shallow. Messari is institutional but impersonal. The middle is empty.",
      },
    ]}
  />
);

// ── Slide 3: Solution ──────────────────────────────────────────────────────
const Slide3 = () => (
  <SlideContent
    accent={PRIMARY}
    title="The Solution"
    bullets={[
      {
        icon: "⚡",
        head: "Weekly AI-generated cycle report",
        body: "MVRV, SOPR, holder behavior, and macro positioning — synthesized every Monday automatically.",
      },
      {
        icon: "🗣️",
        head: "Plain English interpretation",
        body: "On-chain metrics explained for non-quants. Bloomberg-grade analysis at retail reading level.",
      },
      {
        icon: "🤖",
        head: "Fully automated delivery",
        body: "AI pipeline publishes every Monday. Zero manual writing from Kelly. Beehiiv handles billing.",
      },
      {
        icon: "💰",
        head: "Retail pricing — finally",
        body: "$15–$79/month vs. $150–$799/month for institutional equivalents. Same insight, 10× cheaper.",
      },
    ]}
  />
);

// ── Slide 4: Market Opportunity ────────────────────────────────────────────
const Slide4 = () => (
  <SlideStats
    accent={PRIMARY}
    title="Market Opportunity"
    stats={[
      {
        label: "Paid Newsletter Market",
        value: "$4B+",
        sub: "18% CAGR globally · Source: Industry Reports 2024–2025",
        color: PRIMARY,
      },
      {
        label: "Crypto Retail Buyers",
        value: "50K",
        sub: "Willing to pay $20–$100/mo · Source: Beehiiv crypto data, Messari user estimates",
        color: SECONDARY,
      },
      {
        label: "DC Audience Conversion",
        value: "7,000",
        sub: "1.4M subs × 0.5% · Source: Influencer campaign benchmarks",
        color: PRIMARY,
      },
      {
        label: "Competitor Gap",
        value: "0",
        sub: "Trusted 10yr personality doing automated cycle analysis · Source: Rex competitive analysis",
        color: SECONDARY,
      },
    ]}
    note="Sources: Industry Reports 2024–2025 · Beehiiv crypto data · Messari user counts · Influencer benchmark studies"
  />
);

// ── Slide 5: Competitive Landscape ────────────────────────────────────────
const Slide5 = () => (
  <SlideTable
    accent={PRIMARY}
    title="Competitive Landscape"
    headers={["Product", "Price", "Model", "Weakness"]}
    rows={[
      [
        <span key="us" style={{ color: PRIMARY, fontWeight: 700 }}>CycleEdge Pro ✦</span>,
        "$15–$79/mo",
        "Weekly cycle report + alerts",
        "—",
      ],
      ["Messari Pro", "~$25/mo", "Research platform + newsletter", "Complex, institutional, not cycle-focused"],
      ["Glassnode Insights", "Free", "On-chain newsletter", "No revenue model; data-heavy, hard to parse"],
      ["The Block Research", "$500+/mo", "Institutional research", "Way too expensive for retail"],
      ["Milk Road", "Free", "Daily crypto news (ad-supported)", "Not deep research; no cycle framework"],
    ]}
    note="Pricing based on publicly available plans as of early 2026. Messari pricing approximate."
  />
);

// ── Slide 6: Target Customer ───────────────────────────────────────────────
const Slide6 = () => {
  const personas = [
    {
      emoji: "🏦",
      name: "Dana — The Serious HODLer",
      age: "30–50 · Portfolio: $50K–$500K",
      pain: "Reads Glassnode free; can't justify $150/mo for institutional tools",
      conversion: "High",
    },
    {
      emoji: "📈",
      name: "Alex — The Active Trader",
      age: "25–40 · Portfolio: $25K–$250K",
      pain: "Trades 3–5×/week; needs cycle context to time entries and exits",
      conversion: "High",
    },
    {
      emoji: "🔬",
      name: "Jordan — The Self-Directed Investor",
      age: "28–45 · Portfolio: $10K–$100K",
      pain: "Follows crypto YouTubers; needs structured analysis, not scattered free content",
      conversion: "Medium",
    },
  ];

  return (
    <div style={{ padding: "20px 0" }}>
      <SlideTitle accent={PRIMARY} text="Target Customer" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginTop: "24px" }}>
        {personas.map((p, i) => (
          <div
            key={i}
            style={{
              padding: "20px 18px",
              borderRadius: "14px",
              background: BG_CARD,
              border: `1px solid ${i % 2 === 0 ? PRIMARY : SECONDARY}30`,
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{p.emoji}</div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{p.name}</p>
            <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: i % 2 === 0 ? PRIMARY : SECONDARY, margin: "0 0 10px", fontWeight: 600 }}>{p.age}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: "0 0 12px", lineHeight: 1.5 }}>{p.pain}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Conversion:</span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: 700, color: p.conversion === "High" ? "#22C55E" : SECONDARY }}>{p.conversion}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Slide 7: Product Details ───────────────────────────────────────────────
const Slide7 = () => (
  <div style={{ padding: "20px 0" }}>
    <SlideTitle accent={PRIMARY} text="Product Details" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginTop: "24px" }}>
      {[
        {
          icon: "📋",
          label: "Weekly Cycle Report",
          color: PRIMARY,
          items: ["MVRV ratio analysis (BTC + major alts)", "SOPR interpretation (realized P/L trends)", "Holder behavior metrics (whale accumulation)", "Macro positioning vs. fiat liquidity cycles"],
        },
        {
          icon: "🔔",
          label: "Cycle Alerts",
          color: SECONDARY,
          items: ["SMS/email when key thresholds cross (e.g. MVRV > 3.0)", "Whale accumulation spike notifications", "Customizable thresholds per subscriber"],
        },
        {
          icon: "📄",
          label: "Monthly Deep-Dive PDF",
          color: PRIMARY,
          items: ["10–15 page cycle trend analysis", "Sector rotations + allocation ideas", "On-chain visualizations with plain-English commentary"],
        },
        {
          icon: "💬",
          label: "Private Discord Community",
          color: SECONDARY,
          items: ["Analyst tier only", "Weekly Q&A thread (automated)", "Exclusive cycle drops before newsletter goes live"],
        },
      ].map((cat, i) => (
        <div
          key={i}
          style={{
            padding: "18px 16px",
            borderRadius: "12px",
            background: BG_CARD,
            border: `1px solid ${cat.color}25`,
          }}
        >
          <div style={{ fontSize: "22px", marginBottom: "8px" }}>{cat.icon}</div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: cat.color, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat.label}</p>
          {cat.items.map((item, j) => (
            <div key={j} style={{ display: "flex", gap: "8px", marginBottom: j < cat.items.length - 1 ? "6px" : 0 }}>
              <span style={{ color: cat.color, flexShrink: 0, fontSize: "11px", marginTop: "1px" }}>→</span>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.4 }}>{item}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ── Slide 8: Pricing ───────────────────────────────────────────────────────
const Slide8 = () => {
  const tiers = [
    {
      name: "Trial",
      price: "Free",
      period: "14 days · no credit card",
      features: ["Weekly cycle report (1 issue)", "Sample deep-dive preview"],
      color: "rgba(255,255,255,0.4)",
      highlight: false,
    },
    {
      name: "Basic",
      price: "$15",
      period: "/month · or $149/year",
      features: ["Weekly cycle report", "Email delivery every Monday"],
      color: PRIMARY,
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month · or $279/year",
      features: ["Everything in Basic", "Monthly deep-dive PDF", "Cycle alerts (SMS + email)"],
      color: PRIMARY,
      highlight: true,
    },
    {
      name: "Analyst",
      price: "$79",
      period: "/month · or $749/year",
      features: ["Everything in Pro", "Private Discord community", "Quarterly AI portfolio stress test"],
      color: SECONDARY,
      highlight: false,
    },
  ];

  return (
    <div style={{ padding: "20px 0" }}>
      <SlideTitle accent={PRIMARY} text="Pricing" sub="Annual billing saves 2 months · reduces churn" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "24px" }}>
        {tiers.map((t, i) => (
          <div
            key={i}
            style={{
              padding: "20px 16px",
              borderRadius: "14px",
              background: t.highlight ? `${PRIMARY}15` : BG_CARD,
              border: `1px solid ${t.highlight ? PRIMARY : t.color + "30"}`,
              position: "relative",
            }}
          >
            {t.highlight && (
              <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: PRIMARY, color: "#000", fontFamily: "var(--font-data)", fontSize: "9px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Most Popular
              </div>
            )}
            <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: t.color, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>{t.name}</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: "#fff", margin: "0 0 2px", lineHeight: 1 }}>{t.price}</p>
            <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.35)", margin: "0 0 14px" }}>{t.period}</p>
            {t.features.map((f, j) => (
              <div key={j} style={{ display: "flex", gap: "7px", marginBottom: j < t.features.length - 1 ? "6px" : 0 }}>
                <span style={{ color: t.color, fontSize: "11px", flexShrink: 0 }}>✓</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.4 }}>{f}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Slide 9: Revenue Projections ───────────────────────────────────────────
const Slide9 = () => (
  <SlideTable
    accent={PRIMARY}
    title="Revenue Projections"
    headers={["Metric", "Month 1", "Month 3", "Month 6", "Month 12"]}
    rows={[
      ["Subscribers", "200", "450", "800", "1,800"],
      ["Blended ARPU", "$22", "$23", "$24", "$26"],
      [
        <span key="mrr" style={{ color: PRIMARY, fontWeight: 700 }}>MRR</span>,
        <span key="m1" style={{ color: PRIMARY, fontWeight: 700 }}>$4,400</span>,
        <span key="m3" style={{ color: PRIMARY, fontWeight: 700 }}>$10,350</span>,
        <span key="m6" style={{ color: PRIMARY, fontWeight: 700 }}>$19,200</span>,
        <span key="m12" style={{ color: SECONDARY, fontWeight: 700 }}>$46,800</span>,
      ],
      ["Monthly Churn", "10%", "9%", "8%", "8%"],
      ["Operating Cost", "~$150/mo", "~$150/mo", "~$200/mo", "~$250/mo"],
    ]}
    note="Assumptions: 1 YouTube mention (200K+ impressions, 0.1% → trial, 25% trial-to-paid) · No paid acquisition · Beehiiv Pro $99/mo + OpenAI API ~$50/mo"
  />
);

// ── Slide 10: Brand Identity ───────────────────────────────────────────────
const Slide10 = () => (
  <div style={{ padding: "20px 0" }}>
    <SlideTitle accent={PRIMARY} text="Brand Identity" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>

      {/* Logo concept */}
      <div style={{ padding: "28px 20px", borderRadius: "14px", background: BG_CARD, border: `1px solid ${PRIMARY}25`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 900, color: PRIMARY, letterSpacing: "-0.03em", lineHeight: 1 }}>
          Cycle<span style={{ color: SECONDARY }}>Edge</span>
        </div>
        <div style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Pro · Cycle Intelligence
        </div>
        <div style={{ width: "80px", height: "2px", background: `linear-gradient(90deg, ${PRIMARY}, ${SECONDARY})`, borderRadius: "2px" }} />
        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.45)", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
          Cycle sine wave + sharp arrow.<br />Edge = precision.
        </p>
      </div>

      {/* Brand attributes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { label: "Voice", value: "Clinical but accessible — not academic", color: PRIMARY },
          { label: "Typography", value: "IBM Plex Mono (data) + Inter (body)", color: SECONDARY },
          { label: "Palette", value: "Orange + Amber on Deep Navy", color: PRIMARY },
          { label: "Positioning", value: "Bloomberg for retail crypto investors", color: SECONDARY },
        ].map((attr, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: "10px", background: BG_CARD, border: `1px solid rgba(255,255,255,0.06)`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: 700, color: attr.color, textTransform: "uppercase", letterSpacing: "0.07em", flexShrink: 0 }}>{attr.label}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.65)", textAlign: "right" }}>{attr.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Slide 11: Go-to-Market ─────────────────────────────────────────────────
const Slide11 = () => {
  const phases = [
    {
      phase: "Phase 1",
      label: "Build",
      timing: "Weeks 1–2",
      color: PRIMARY,
      steps: [
        "Set up Beehiiv with 3 paid tiers",
        "Build data pipeline (CoinGecko + Glassnode APIs)",
        "Configure AI report generation (GPT-4o)",
        "Test reports with internal team",
      ],
    },
    {
      phase: "Phase 2",
      label: "Soft Launch",
      timing: "Weeks 3–4",
      color: SECONDARY,
      steps: [
        "Launch landing page with free sample download",
        "Announce to existing email list (50K+ assumed)",
        "Discord founding-member cohort (exclusive pricing)",
        "50–100 beta subscribers",
      ],
    },
    {
      phase: "Phase 3",
      label: "Scale",
      timing: "Month 2+",
      color: PRIMARY,
      steps: [
        "1 dedicated YouTube video: \"State of the Cycle\"",
        "X thread campaign with cycle metric snapshots",
        "Beehiiv referral program ($10/mo credit per referral)",
        "Affiliate partnerships with 5–10 crypto creators",
      ],
    },
  ];

  return (
    <div style={{ padding: "20px 0" }}>
      <SlideTitle accent={PRIMARY} text="Go-to-Market" sub="Zero paid acquisition. Distribution-first." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginTop: "24px" }}>
        {phases.map((p, i) => (
          <div key={i} style={{ padding: "20px 16px", borderRadius: "14px", background: BG_CARD, border: `1px solid ${p.color}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.phase}</span>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 800, color: "#fff", margin: "0 0 2px" }}>{p.label}</p>
            <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.35)", margin: "0 0 14px" }}>{p.timing}</p>
            {p.steps.map((s, j) => (
              <div key={j} style={{ display: "flex", gap: "8px", marginBottom: j < p.steps.length - 1 ? "8px" : 0 }}>
                <span style={{ color: p.color, fontSize: "11px", flexShrink: 0, marginTop: "1px" }}>→</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.4 }}>{s}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Slide 12: Content & Marketing ─────────────────────────────────────────
const Slide12 = () => (
  <div style={{ padding: "20px 0" }}>
    <SlideTitle accent={PRIMARY} text="Content & Marketing" sub="Four channels. Zero cold outreach." />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginTop: "24px" }}>
      {[
        {
          icon: "▶️",
          channel: "YouTube",
          color: PRIMARY,
          detail: "1 dedicated \"Where Are We in the Crypto Cycle?\" video",
          metric: "100K–200K views expected",
        },
        {
          icon: "𝕏",
          channel: "X / Twitter",
          color: SECONDARY,
          detail: "Weekly snapshot posts: cycle metric + newsletter link",
          metric: "1M+ impressions per thread",
        },
        {
          icon: "💬",
          channel: "Discord",
          color: PRIMARY,
          detail: "Founding-member cohort with exclusive pricing + early access",
          metric: "High-intent, low-funnel audience",
        },
        {
          icon: "📧",
          channel: "Email List",
          color: SECONDARY,
          detail: "50K+ subscriber base → 0.5% conversion minimum",
          metric: "250+ subscribers on day one",
        },
      ].map((ch, i) => (
        <div key={i} style={{ padding: "20px 16px", borderRadius: "12px", background: BG_CARD, border: `1px solid ${ch.color}25` }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>{ch.icon}</div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: ch.color, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{ch.channel}</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.65)", margin: "0 0 8px", lineHeight: 1.5 }}>{ch.detail}</p>
          <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.35)", margin: 0 }}>{ch.metric}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Slide 13: Funnel Part 1 (Awareness → Intent) ───────────────────────────
const Slide13 = () => {
  const steps = [
    {
      num: "01",
      label: "YouTube View",
      color: PRIMARY,
      desc: "Viewer watches \"Where Are We in the Crypto Cycle?\" — description includes free sample + 14-day trial link.",
    },
    {
      num: "02",
      label: "Landing Page Visit",
      color: SECONDARY,
      desc: "Sample report download, pricing tiers, social proof. CTA: \"Start 14-day free trial — no credit card required.\"",
    },
    {
      num: "03",
      label: "Free Trial Sign-up",
      color: PRIMARY,
      desc: "Email capture. Instant Week 1 report access. Onboarding series introduces MVRV, SOPR, holder behavior.",
    },
    {
      num: "04",
      label: "Trial Engagement",
      color: SECONDARY,
      desc: "Subscriber reads first report. Day 7 reminder: \"Your trial ends in 7 days.\" Value is demonstrated before ask.",
    },
  ];

  return (
    <div style={{ padding: "20px 0" }}>
      <SlideTitle accent={PRIMARY} text="Funnel — Part 1" sub="Awareness → Intent · Steps 1–4" />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px 18px", borderRadius: "12px", background: BG_CARD, border: `1px solid ${s.color}25` }}>
            <div style={{ fontFamily: "var(--font-data)", fontSize: "20px", fontWeight: 900, color: s.color, flexShrink: 0, lineHeight: 1, minWidth: "30px" }}>{s.num}</div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Slide 14: Funnel Part 2 (Nurture → Upsell) ────────────────────────────
const Slide14 = () => {
  const steps = [
    {
      num: "05",
      label: "Trial Conversion (Day 14)",
      color: PRIMARY,
      desc: "25% trial-to-paid conversion. Basic at $15/mo. Immediate upsell: \"Add deep-dive PDF + alerts for $14 more.\"",
    },
    {
      num: "06",
      label: "Retention (Month 1–2)",
      color: SECONDARY,
      desc: "Weekly reports keep subscribers engaged. Cycle alerts prove value in real time. Churn drops to 8% by month 4.",
    },
    {
      num: "07",
      label: "Tier Upsell (Month 3)",
      color: PRIMARY,
      desc: "Pro subscribers offered Analyst tier: \"Add private Discord + quarterly stress test for $50 more.\" 15% convert.",
    },
    {
      num: "08",
      label: "Annual Billing (Month 6+)",
      color: SECONDARY,
      desc: "Monthly subscribers offered annual plan: \"Save 2 months.\" 30% convert. Annual subscribers have 50% lower churn.",
    },
  ];

  return (
    <div style={{ padding: "20px 0" }}>
      <SlideTitle accent={PRIMARY} text="Funnel — Part 2" sub="Nurture → Upsell · Steps 5–8" />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px 18px", borderRadius: "12px", background: BG_CARD, border: `1px solid ${s.color}25` }}>
            <div style={{ fontFamily: "var(--font-data)", fontSize: "20px", fontWeight: 900, color: s.color, flexShrink: 0, lineHeight: 1, minWidth: "30px" }}>{s.num}</div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Slide 15: Why This Wins ────────────────────────────────────────────────
const Slide15 = () => (
  <div style={{ padding: "20px 0" }}>
    <SlideTitle accent={PRIMARY} text="Why This Wins" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginTop: "28px" }}>
      {[
        {
          num: "1",
          color: PRIMARY,
          head: "Unclaimed niche",
          body: "Nobody owns cycle analysis + plain English + trusted 10-year brand. Messari is institutional. Glassnode is data-dense. Milk Road is free. The middle is empty.",
        },
        {
          num: "2",
          color: SECONDARY,
          head: "Uncopiable moat",
          body: "Kelly's 10-year credibility cannot be replicated overnight. Competitors clone features. They can't clone trust.",
        },
        {
          num: "3",
          color: PRIMARY,
          head: "Compounding recurring revenue",
          body: "800–1,800 subscribers × $24–$26 ARPU = $19K–$46K MRR. Compounds monthly. Not a one-time sale.",
        },
        {
          num: "4",
          color: SECONDARY,
          head: "Truly zero Kelly time",
          body: "Rex generates reports via AI pipeline. Kelly's only role is optional 10-min/week review. No production dependency.",
        },
      ].map((r, i) => (
        <div key={i} style={{ padding: "24px 18px", borderRadius: "14px", background: BG_CARD, border: `1px solid ${r.color}30` }}>
          <div style={{ fontFamily: "var(--font-data)", fontSize: "28px", fontWeight: 900, color: r.color, marginBottom: "10px", lineHeight: 1 }}>{r.num}</div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{r.head}</p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>{r.body}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Deck Config ────────────────────────────────────────────────────────────
const config: SlideConfig = {
  deckTitle: "CycleEdge Pro",
  deckSlug: "cycle-edge-pro",
  accent: PRIMARY,
  accentDim: ACCENT_DIM,
  bg: BG,
  bgCard: BG_CARD,
  slides: [
    <Slide1  key="s1"  />,
    <Slide2  key="s2"  />,
    <Slide3  key="s3"  />,
    <Slide4  key="s4"  />,
    <Slide5  key="s5"  />,
    <Slide6  key="s6"  />,
    <Slide7  key="s7"  />,
    <Slide8  key="s8"  />,
    <Slide9  key="s9"  />,
    <Slide10 key="s10" />,
    <Slide11 key="s11" />,
    <Slide12 key="s12" />,
    <Slide13 key="s13" />,
    <Slide14 key="s14" />,
    <Slide15 key="s15" />,
  ],
};

export default function CycleEdgeProDeck() {
  return <SlideViewer config={config} />;
}
