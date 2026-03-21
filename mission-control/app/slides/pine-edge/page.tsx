"use client";

import SlideViewer, {
  SlideHero,
  SlideContent,
  SlideTitle,
  SlideTable,
  SlideStats,
  BulletCard,
  Highlight,
  type SlideConfig,
} from "@/components/slides/SlideViewer";

// ── PineEdge Palette ────────────────────────────────────────────────────────
const EM  = "#10B981"; // Emerald (primary)
const EM2 = "#34D399"; // Light Emerald (secondary)
const BG  = "#0A0F1E";
const CARD = "#111827";

const config: SlideConfig = {
  deckTitle: "PineEdge",
  deckSlug: "pine-edge",
  accent: EM,
  accentDim: "rgba(16,185,129,0.12)",
  bg: BG,
  bgCard: CARD,
  slides: [

    // ── 1. HERO ─────────────────────────────────────────────────────────────
    <SlideHero key={1}
      accent={EM} bg={BG}
      badge="Discover Crypto · Premium Indicator Suite"
      title="PineEdge"
      subtitle="6 Professional TradingView Indicators."
      tagline="Edge-first. Precision-built. Trusted brand."
      desc="Six Pine Script indicators delivering institutional-grade edge to serious retail traders."
    />,

    // ── 2. PROBLEM ──────────────────────────────────────────────────────────
    <SlideContent key={2} accent={EM}
      title="Retail traders are drowning in free noise."
      bullets={[
        {
          icon: "📉",
          head: "Free indicators are built for demos, not decisions",
          body: "TradingView's default indicators (RSI, MACD, Bollinger Bands) are overcrowded signals everyone watches. When everyone watches the same line, the edge disappears.",
        },
        {
          icon: "💸",
          head: "Premium suites cost $60–$120/month and require courses to use",
          body: "LuxAlgo, Market Cipher, and others charge enterprise pricing and require hours of YouTube tutorials before generating a single useful signal.",
        },
        {
          icon: "🔍",
          head: "Random Gumroad scripts have zero accountability",
          body: "Nameless Pine Script sellers charge $5–$50 per script with no support, no updates, and no brand standing behind the logic.",
        },
        {
          icon: "🧩",
          head: "No suite is built for crypto cycle awareness",
          body: "Existing indicator suites are generic — none are tuned for crypto's unique volatility, on-chain behavior, and multi-year market cycles.",
        },
      ]}
    />,

    // ── 3. SOLUTION ─────────────────────────────────────────────────────────
    <SlideContent key={3} accent={EM}
      title="Six precision indicators. One trusted brand. Zero fluff."
      bullets={[
        {
          icon: "📐",
          head: "Professional-grade Pine Script — crypto-tuned",
          body: "Every indicator is built specifically for crypto's volatility profile. Not ported from equities. Not generic. Designed for BTC, ETH, and major alts.",
        },
        {
          icon: "🔐",
          head: "Discord-gated access — leaks don't kill the product",
          body: "Access is tied to Discord membership, not a code string. Even if a script leaks, the ongoing updates, signals, and community stay gated.",
        },
        {
          icon: "🏷️",
          head: "Backed by Discover Crypto's 10-year credibility",
          body: "\"PineEdge by Discover Crypto\" converts instantly with Kelly's 1.4M YouTube audience. No unknown seller — a brand they already trust.",
        },
        {
          icon: "♻️",
          head: "Quarterly updates keep the suite sharp",
          body: "Pine Script v5 and v6 compatibility maintained every quarter (~4 hours Rex time). Subscribers always run the latest version.",
        },
      ]}
    />,

    // ── 4. MARKET OPPORTUNITY ───────────────────────────────────────────────
    <SlideStats key={4} accent={EM}
      title="TradingView has 50M+ users. We need 500."
      stats={[
        {
          label: "TradingView registered users",
          value: "50M+",
          sub: "50M+ accounts, 3M+ paying Premium [TradingView 2024]",
          color: EM,
        },
        {
          label: "Target customer pool",
          value: "~3M",
          sub: "Premium subscribers already paying $15–$60/month",
          color: EM2,
        },
        {
          label: "Discover Crypto warm audience",
          value: "1.4M",
          sub: "YouTube subscribers at 0.1% conversion = 1,400 prospects [DC channel]",
          color: EM,
        },
        {
          label: "Year 1 revenue target",
          value: "$200K+",
          sub: "$11.6K MRR + lifetime license sales by Month 12",
          color: EM2,
        },
      ]}
      note="Conversion target: 500 active subscribers (0.01% of TradingView Premium base). Highly achievable with brand leverage."
    />,

    // ── 5. COMPETITIVE LANDSCAPE ────────────────────────────────────────────
    <SlideTable key={5} accent={EM}
      title="Premium at $29. Competitors charge double for complexity."
      headers={["Competitor", "Price", "Crypto-Tuned?", "Brand Trust", "Weakness"]}
      rows={[
        ["LuxAlgo", "$59.99/month", "Partial", "Medium", "Steep learning curve, generic"],
        ["Market Cipher", "$99–$200/month", "Partial", "Medium", "Overpriced, complex UI"],
        ["Gumroad Scripts", "$5–$50 one-time", "No", "None", "No support, no updates"],
        ["TradingView Built-in", "Free", "No", "High", "Overcrowded, no edge"],
        [<strong key="us" style={{ color: EM }}>PineEdge</strong>, <strong key="p" style={{ color: EM }}>$29/month</strong>, <strong key="ct" style={{ color: EM }}>Yes</strong>, <strong key="bt" style={{ color: EM }}>High (DC brand)</strong>, <strong key="w" style={{ color: EM2 }}>—</strong>],
      ]}
      note="Only PineEdge combines crypto-specific tuning, brand accountability, and retail pricing in a single suite."
    />,

    // ── 6. TARGET CUSTOMER ──────────────────────────────────────────────────
    <div key={6} style={{ padding: "20px 0" }}>
      <SlideTitle accent={EM} text="Three traders. All already watching Kelly." />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
        {[
          {
            label: "The Active Crypto Trader",
            pct: "50%",
            desc: "Trades 3–7x per week on TradingView. Already paying for Premium ($30/month). Wants signals with brand credibility behind them.",
            color: EM,
          },
          {
            label: "The Serious HODLer Who Charts",
            pct: "30%",
            desc: "Charts entry/exit points manually. Looking for cycle-aware indicators to time accumulation and distribution zones.",
            color: EM2,
          },
          {
            label: "The DC Community Member",
            pct: "20%",
            desc: "Already in Discord. Trusts Kelly's analysis. Buys because of brand loyalty and social proof, not feature comparison.",
            color: EM,
          },
        ].map((p, i) => (
          <div key={i} style={{
            display: "flex", gap: "16px", alignItems: "center",
            padding: "16px 20px", borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${p.color}30`,
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "10px", flexShrink: 0,
              background: `${p.color}18`, border: `1px solid ${p.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-data)", fontSize: "14px", fontWeight: 800, color: p.color,
            }}>
              {p.pct}
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{p.label}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // ── 7. PRODUCT DETAILS ──────────────────────────────────────────────────
    <div key={7} style={{ padding: "20px 0" }}>
      <SlideTitle accent={EM} text="Six indicators. One coherent system." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
        {[
          { name: "EdgeBias", desc: "Multi-timeframe trend bias — never fight the dominant direction", tag: "Trend" },
          { name: "SmartFlow", desc: "Institutional money flow tracker — follow the big hands", tag: "Volume" },
          { name: "CycleZone", desc: "Bull / bear / accumulation / distribution phase detector", tag: "Cycle" },
          { name: "VolumePulse", desc: "Volume absorption zones and key profile levels per session", tag: "Volume" },
          { name: "MomentumEdge", desc: "Multi-signal divergence scanner — RSI + MACD + price action", tag: "Momentum" },
          { name: "LiquidityMap", desc: "Liquidity pools and stop-hunt zone visualization", tag: "S/R" },
        ].map((ind, i) => (
          <div key={i} style={{
            padding: "14px 16px", borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${EM}25`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: EM, margin: 0 }}>{ind.name}</p>
              <span style={{
                fontFamily: "var(--font-data)", fontSize: "9px", fontWeight: 700,
                color: EM2, letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "2px 7px", borderRadius: "6px", background: `${EM}15`,
              }}>{ind.tag}</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{ind.desc}</p>
          </div>
        ))}
      </div>
      <Highlight accent={EM}
        text="All six indicators are pre-configured to work together as a system."
        sub="EdgeBias sets direction. CycleZone sets phase. SmartFlow + VolumePulse confirm entries. MomentumEdge + LiquidityMap fine-tune timing."
      />
    </div>,

    // ── 8. PRICING ──────────────────────────────────────────────────────────
    <div key={8} style={{ padding: "20px 0" }}>
      <SlideTitle accent={EM} text="Three ways to access. One premium experience." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "20px" }}>
        {[
          {
            tier: "Monthly",
            price: "$29",
            cadence: "/month",
            features: ["All 6 indicators", "Discord access", "Quarterly updates", "Cancel anytime"],
            highlight: false,
          },
          {
            tier: "Annual",
            price: "$249",
            cadence: "/year",
            features: ["All 6 indicators", "Discord access", "Quarterly updates", "Save 28%"],
            highlight: true,
          },
          {
            tier: "Lifetime",
            price: "$499",
            cadence: "one-time",
            features: ["All 6 indicators", "Discord access", "All future updates", "Capped at 500 licenses"],
            highlight: false,
          },
        ].map((t, i) => (
          <div key={i} style={{
            padding: "20px 18px", borderRadius: "14px",
            background: t.highlight ? `${EM}18` : "rgba(255,255,255,0.04)",
            border: `1px solid ${t.highlight ? EM : "rgba(255,255,255,0.08)"}`,
            display: "flex", flexDirection: "column",
          }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: t.highlight ? EM : "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px" }}>
              {t.tier}
              {t.highlight && <span style={{ marginLeft: "8px", fontSize: "9px", background: EM, color: "#000", padding: "2px 6px", borderRadius: "4px" }}>BEST VALUE</span>}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "32px", fontWeight: 800, color: t.highlight ? EM : "#fff" }}>{t.price}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{t.cadence}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {t.features.map((f, j) => (
                <div key={j} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: t.highlight ? EM : EM2, fontSize: "11px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.65)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "14px", textAlign: "center" }}>
        7-day free trial on Monthly tier · Lifetime licenses capped at 500 for scarcity · Hosted on Whop
      </p>
    </div>,

    // ── 9. REVENUE PROJECTIONS ──────────────────────────────────────────────
    <div key={9} style={{ padding: "20px 0" }}>
      <SlideTitle accent={EM} text="Conservative ramp. Recurring floor." />
      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-data)", fontSize: "12px" }}>
          <thead>
            <tr>
              {["Metric", "Month 1", "Month 3", "Month 6", "Month 12"].map((h, i) => (
                <th key={i} style={{ padding: "10px 14px", textAlign: "left", color: EM, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", fontSize: "10px", borderBottom: `2px solid ${EM}40`, background: `${EM}10` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Active Subscribers", "54", "145", "290", "400"],
              ["Monthly ARPU", "$29", "$29", "$29", "$29"],
              ["MRR", "$1,566", "$4,205", "$8,410", "$11,600"],
              ["Lifetime License Sales (cumul.)", "$4,490", "$8,980", "$13,470", "$17,960"],
              ["Combined Monthly Revenue", "$1,940+", "$4,960+", "$9,285+", "$12,100+"],
            ].map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: "10px 14px",
                    color: ri === 2 ? EM : (ci === 0 ? "#fff" : "rgba(255,255,255,0.65)"),
                    fontWeight: ri === 2 ? 700 : 400,
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.7 }}>
          Assumptions: 1 YouTube mention (0.1% conversion from 200K impressions), 10 lifetime licenses/month at $449 avg, 8% monthly churn after Month 3. No paid acquisition. [Source: DC channel benchmarks + spec analysis]
        </p>
      </div>
    </div>,

    // ── 10. BRAND IDENTITY ──────────────────────────────────────────────────
    <div key={10} style={{ padding: "20px 0" }}>
      <SlideTitle accent={EM} text="Premium. Precise. Unmistakably Discover Crypto." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Name", value: "PineEdge" },
            { label: "Voice", value: "Professional, direct, no hype" },
            { label: "Typography", value: "Sharp display headers + clean data mono" },
            { label: "Vibe", value: "Bloomberg terminal meets retail trader" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontFamily: "var(--font-data)", fontSize: "9px", fontWeight: 700, color: EM, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>{item.label}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ padding: "20px", borderRadius: "14px", background: `${EM}15`, border: `1px solid ${EM}40`, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 800, color: EM, margin: "0 0 8px", letterSpacing: "-0.02em" }}>PineEdge</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>by Discover Crypto</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "Primary", hex: "#10B981", name: "Emerald" },
              { label: "Secondary", hex: "#34D399", name: "Light Emerald" },
            ].map((c, i) => (
              <div key={i} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                <div style={{ width: "100%", height: "32px", borderRadius: "6px", background: c.hex, marginBottom: "8px" }} />
                <p style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.5)", margin: 0 }}>{c.hex}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#fff", margin: "2px 0 0", fontWeight: 600 }}>{c.name}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontFamily: "var(--font-data)", fontSize: "9px", fontWeight: 700, color: EM, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Logo Concept</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>Pine tree silhouette with a razor-sharp edge line cutting through — precision meets nature (Pine Script + edge).</p>
          </div>
        </div>
      </div>
    </div>,

    // ── 11. GO-TO-MARKET ────────────────────────────────────────────────────
    <SlideContent key={11} accent={EM}
      title="Three phases. Zero Kelly production time."
      bullets={[
        {
          icon: "🔨",
          head: "Phase 1 — Build (Weeks 1–3)",
          body: "Rex builds 6 Pine Script indicators, tests across BTC/ETH/major alts. Sets up Whop storefront with monthly, annual, and lifetime tiers. Configures Discord private channel gating.",
        },
        {
          icon: "🚀",
          head: "Phase 2 — Soft Launch (Week 4)",
          body: "Announce to Discover Crypto Discord founding members (exclusive early pricing). Kelly adds PineEdge link to one existing video description. Landing page live on Whop.",
        },
        {
          icon: "📈",
          head: "Phase 3 — Scale (Month 2+)",
          body: "One dedicated YouTube mention in a chart analysis video. X thread showcasing indicator signals. Discord referral loop (members invite traders = social proof flywheel).",
        },
        {
          icon: "⚙️",
          head: "Ongoing — Quarterly maintenance only",
          body: "Pine Script version updates (~4 hours/quarter). New indicator added annually to reward long-term subscribers. Kelly touches nothing unless she wants to.",
        },
      ]}
    />,

    // ── 12. CONTENT & MARKETING ─────────────────────────────────────────────
    <div key={12} style={{ padding: "20px 0" }}>
      <SlideTitle accent={EM} text="Four channels. One coherent signal." />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
        {[
          {
            channel: "YouTube",
            icon: "▶️",
            tactic: "One dedicated chart analysis video using PineEdge indicators live",
            reach: "100K–200K views",
            cta: "Description link to Whop storefront",
          },
          {
            channel: "X / Twitter",
            icon: "𝕏",
            tactic: "Weekly signal screenshots from the suite — \"Here's what CycleZone just triggered\"",
            reach: "Est. 500K+ impressions",
            cta: "Link to 7-day free trial",
          },
          {
            channel: "Discord",
            icon: "💬",
            tactic: "Founding member cohort in existing DC Discord — exclusive early pricing and direct Q&A access",
            reach: "DC Discord community",
            cta: "Founding price (30% off) expires in 72 hours",
          },
          {
            channel: "Email List",
            icon: "📧",
            tactic: "Broadcast to existing DC email subscribers with sample indicator screenshot + trial CTA",
            reach: "50K+ subscribers assumed",
            cta: "0.5% conversion = 250 trial signups",
          },
        ].map((c, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr auto", gap: "12px", alignItems: "center", padding: "14px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <span style={{ fontSize: "16px", marginRight: "6px" }}>{c.icon}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: EM }}>{c.channel}</span>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.75)", margin: "0 0 3px", lineHeight: 1.4 }}>{c.tactic}</p>
              <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{c.cta}</p>
            </div>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: 700, color: EM2, whiteSpace: "nowrap" }}>{c.reach}</span>
          </div>
        ))}
      </div>
    </div>,

    // ── 13. FUNNEL PART 1 (Awareness → Intent) ──────────────────────────────
    <div key={13} style={{ padding: "20px 0" }}>
      <SlideTitle accent={EM} text="Funnel · Part 1 — Awareness to Intent" sub="How a TradingView user discovers PineEdge and decides to try it" />
      <div style={{ display: "flex", flexDirection: "column", gap: "0px", marginTop: "24px" }}>
        {[
          {
            step: "01",
            title: "YouTube / X Signal Drop",
            desc: "Trader sees Kelly use EdgeBias or CycleZone live in a chart analysis. Signal is visible, readable, clearly better than built-in indicators.",
            metric: "100K–200K impressions",
          },
          {
            step: "02",
            title: "Whop Landing Page Visit",
            desc: "Description link or tweet CTA sends trader to Whop storefront. Page shows all 6 indicators, pricing, Discord screenshots, and a sample signal chart.",
            metric: "Est. 1–2% click-through",
          },
          {
            step: "03",
            title: "7-Day Free Trial Sign-Up",
            desc: "Low-friction entry — no annual commitment required. Trader gets instant Discord access and all 6 indicators added to their TradingView account within minutes.",
            metric: "Target: 200 trials Month 1",
          },
          {
            step: "04",
            title: "First Signal Experience",
            desc: "Within 48 hours, trader adds indicators to a live chart and sees a CycleZone or SmartFlow trigger. The indicator does something TradingView defaults can't do. Intent forms.",
            metric: "Engagement within 48 hrs",
          },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "0px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "16px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                background: `${EM}20`, border: `2px solid ${EM}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: 800, color: EM,
              }}>{s.step}</div>
              {i < 3 && <div style={{ width: "2px", flex: 1, background: `${EM}30`, margin: "4px 0" }} />}
            </div>
            <div style={{ paddingBottom: i < 3 ? "20px" : "0", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>{s.title}</p>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: EM2, fontWeight: 700 }}>{s.metric}</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // ── 14. FUNNEL PART 2 (Convert → Retain → Upsell) ──────────────────────
    <div key={14} style={{ padding: "20px 0" }}>
      <SlideTitle accent={EM} text="Funnel · Part 2 — Convert to Retain to Upsell" sub="How a trial user becomes a subscriber, then a lifetime buyer" />
      <div style={{ display: "flex", flexDirection: "column", gap: "0px", marginTop: "24px" }}>
        {[
          {
            step: "05",
            title: "Trial Conversion (Day 7)",
            desc: "Automated Whop email at Day 5: \"Your trial expires in 2 days.\" 25–30% conversion expected. Monthly at $29 or Annual at $249. Annual upsell saves $99.",
            metric: "25–30% trial-to-paid",
          },
          {
            step: "06",
            title: "Retention via Quarterly Updates",
            desc: "Every quarter, Rex ships a Pine Script update. Subscribers get a Discord ping: \"v2.1 live — EdgeBias now supports multi-timeframe overlay.\" Active product keeps churn low.",
            metric: "8% monthly churn target",
          },
          {
            step: "07",
            title: "Lifetime License Offer (Month 3+)",
            desc: "Monthly subscribers who reach 90 days get a direct offer: \"Lock in PineEdge forever for $499 — only 500 licenses exist.\" Scarcity is real (capped). Drives one-time revenue spikes.",
            metric: "Est. 10 sales/month",
          },
          {
            step: "08",
            title: "Community Referral Loop",
            desc: "Discord community becomes social proof engine. Members share signals, post P&L screenshots attributing PineEdge setups. New traders find the Discord and convert organically.",
            metric: "10–15% organic referral lift",
          },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "0px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "16px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                background: `${EM2}20`, border: `2px solid ${EM2}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: 800, color: EM2,
              }}>{s.step}</div>
              {i < 3 && <div style={{ width: "2px", flex: 1, background: `${EM2}30`, margin: "4px 0" }} />}
            </div>
            <div style={{ paddingBottom: i < 3 ? "20px" : "0", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>{s.title}</p>
                <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: EM, fontWeight: 700 }}>{s.metric}</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // ── 15. WHY THIS WINS ───────────────────────────────────────────────────
    <div key={15} style={{ padding: "20px 0" }}>
      <SlideTitle accent={EM} text="Why PineEdge wins." />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
        {[
          {
            icon: "🏆",
            head: "Brand moat is unassailable at launch",
            body: "\"PineEdge by Discover Crypto\" converts instantly. A no-name Pine Script seller on Gumroad has zero trust. Kelly's 10-year credibility cannot be replicated by a new competitor overnight.",
            color: EM,
          },
          {
            icon: "🔁",
            head: "Recurring revenue with a lifetime kicker",
            body: "Subscriptions build the floor. Lifetime licenses deliver lump-sum cash. Month 12 target: $11,600 MRR floor + $4,490/month in lifetime sales = $16k+ combined monthly.",
            color: EM2,
          },
          {
            icon: "🛡️",
            head: "Leaks can't kill a Discord-gated product",
            body: "Even if a script leaks publicly, the Discord access, ongoing updates, and community stay gated. The product's value compounds — it doesn't depreciate the moment someone shares it.",
            color: EM,
          },
          {
            icon: "⚙️",
            head: "Truly zero Kelly time after launch",
            body: "Rex maintains Pine Script updates quarterly (~4 hours). Kelly's only touchpoint is one YouTube mention. Passive income in the strictest sense — validated software product, not education.",
            color: EM2,
          },
        ].map((b, i) => (
          <div key={i} style={{
            display: "flex", gap: "14px", padding: "16px 18px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${b.color}25`,
          }}>
            <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "2px" }}>{b.icon}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{b.head}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{b.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "16px", padding: "14px 20px", borderRadius: "12px", background: `${EM}18`, border: `1px solid ${EM}50`, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 800, color: EM, margin: 0 }}>
          Weighted Score: 7.55 / 10 — #2 of 10 products evaluated
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>
          Strongest Brand flag · Premium Differentiation · Zero Kelly production time · 100% Rex-buildable
        </p>
      </div>
    </div>,

  ],
};

export default function PineEdgeDeck() {
  return <SlideViewer config={config} />;
}
