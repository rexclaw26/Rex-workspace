"use client";

import SlideViewer, {
  SlideHero, SlideContent, SlideTitle, SlideTable, SlideStats,
  SlideTwoCol, BulletCard, Highlight, type SlideConfig,
} from "@/components/slides/SlideViewer";

const A = "#2563EB";   // Electric Blue
const G = "#F59E0B";   // Gold

const config: SlideConfig = {
  deckTitle: "Discover Crypto Academy",
  deckSlug: "dc-academy",
  accent: A,
  accentDim: "rgba(37,99,235,0.15)",
  bg: "#0A0E27",
  bgCard: "#0F1535",
  slides: [

    // ── 1. HERO ───────────────────────────────────────────────────────────
    // FIX 1: desc shortened to one punchy sentence (~15 words)
    <SlideHero key={1}
      accent={A} bg="#0A0E27"
      badge="Discover Crypto · Product #1 of 3"
      title="Discover Crypto Academy"
      subtitle="Master crypto. Build wealth. Join the community."
      tagline="Learn crypto. Think different."
      desc="The only structured crypto curriculum backed by 1.4M subscribers and a decade of trust."
    />,

    // ── 2. PROBLEM ────────────────────────────────────────────────────────
    <SlideContent key={2} accent={A}
      title="Crypto education is broken."
      bullets={[
        { icon: "📺", head: "YouTube has 50M+ crypto videos — none in order", body: "Viewers learn random fragments from whoever's trending, not a coherent curriculum." },
        { icon: "📚", head: "Binance Academy and Coinbase Learn are built for everyone", body: "Generic content that teaches no one deeply. They optimise for breadth, not outcomes." },
        { icon: "❌", head: "The same 5 mistakes repeat every cycle", body: "Buying tops, panic-selling bottoms, ignoring on-chain signals, misunderstanding DeFi risk, having no exit strategy." },
        { icon: "📉", head: "74% of retail investors reported losses in the 2022 bear", body: "Most had never studied market cycle fundamentals. The education gap is the financial gap." },
      ]}
    />,

    // ── 3. SOLUTION ───────────────────────────────────────────────────────
    <SlideContent key={3} accent={A}
      title="One platform. One path. Real results."
      bullets={[
        { icon: "🗺️", head: "A structured, progressive curriculum on Skool", body: "Four tracks: Crypto Basics → Trading Strategy → DeFi Mastery → Wealth Strategy. Start at zero, finish with a framework." },
        { icon: "🎙️", head: "Monthly live Q&As with Kelly — not pre-recorded fluff", body: "Direct access to the person behind 1.4M subscribers. Real answers to real market questions." },
        { icon: "🤝", head: "A real community of serious learners", body: "Skool forum, study groups, member spotlights. Community accountability outperforms solo learning every time." },
        { icon: "🔄", head: "Always current — curriculum evolves with the market", body: "New modules added as protocols evolve, regulation shifts, and new cycles emerge." },
      ]}
    />,

    // ── 4. MARKET OPPORTUNITY ─────────────────────────────────────────────
    // FIX 2: Removed "Online course industry $2.3B" and "Conversion 0.035%" cards — keeping 4
    <SlideStats key={4} accent={A}
      title="The market is ready."
      stats={[
        { label: "YouTube subscribers", value: "1.4M", sub: "Warm audience, already trusts Kelly", color: G },
        { label: "X/Twitter followers", value: "1M+", sub: "Active, crypto-native audience", color: A },
        { label: "CryptoAcademy.us price", value: "$249/mo", sub: "We charge $49/mo — 5x cheaper", color: "#EF4444" },
        { label: "Academy target — 12 months", value: "$29K/mo", sub: "650 members at blended $45", color: G },
      ]}
      note="Sources: Business of Apps Jan 2026 | Discover Crypto internal data | CryptoAcademy.us pricing"
    />,

    // ── 5. COMPETITIVE LANDSCAPE ──────────────────────────────────────────
    <SlideTable key={5} accent={A}
      title="We're priced to win — and we have the audience."
      headers={["Competitor", "Price", "Audience", "Community"]}
      rows={[
        ["CryptoAcademy.us", "$249/month", "Unknown", "Yes"],
        ["Pomp's Crypto Academy", "$799/cohort", "Millions (Pomp)", "Limited"],
        ["Token Metrics", "$39–$200/mo", "N/A (tool)", "No"],
        ["Binance Academy", "Free", "Binance brand", "No"],
        [<strong key="us" style={{ color: A }}>Discover Crypto Academy</strong>, <strong key="p" style={{ color: "#10B981" }}>$49/month</strong>, <strong key="a" style={{ color: G }}>1.4M YouTube</strong>, <strong key="c" style={{ color: "#10B981" }}>Yes — Skool</strong>],
      ]}
      note="CryptoAcademy.us charges 5× more. We have more distribution than any of them. Lowest-priced premium option with largest warm audience."
    />,

    // ── 6. TARGET CUSTOMER ────────────────────────────────────────────────
    // FIX 3: Simplified to title + % + ONE line description (12 words max)
    // Speaker notes: "The New Entrant" → "The free videos only go so far — I need the full framework." | Sensitivity: avoid implying they've made mistakes already
    // Speaker notes: "The Experienced But Lost" → "The next cycle is here and I'm not getting it wrong again." | Sensitivity: don't shame past losses
    // Speaker notes: "The Serious Builder" → "Time is money. $49/mo vs. 20 hours of research." | Sensitivity: appeal to efficiency, not status
    <div key={6} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="Three buyers. One platform." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "14px", marginTop: "20px" }}>
        {[
          { title: "The New Entrant", pct: "40%", desc: "Bought BTC/ETH, scared of mistakes, needs a real learning path.", color: A },
          { title: "The Experienced But Lost", pct: "35%", desc: "Survived two cycles, still losing — needs a proper strategy framework.", color: G },
          { title: "The Serious Builder", pct: "25%", desc: "High earner, time-poor. Wants curated content and direct Kelly access.", color: "#10B981" },
        ].map((a) => (
          <div key={a.title} style={{ padding: "18px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${a.color}30` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#fff" }}>{a.title}</span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "10px", fontWeight: 700, color: a.color }}>{a.pct}</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{a.desc}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 7. PRODUCT DETAILS ────────────────────────────────────────────────
    <div key={7} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="Four tracks. 20+ modules. Live Q&As." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginTop: "20px" }}>
        {[
          { num: "01", title: "Crypto Fundamentals", modules: "Blockchain · Bitcoin · Ethereum · Security · Market Cycles", color: A },
          { num: "02", title: "Trading Strategy", modules: "On-chain metrics · Chart reading · Risk management · DCA · When to take profits", color: G },
          { num: "03", title: "DeFi Mastery", modules: "Liquidity pools · Yield farming · Cross-chain · Protocol risk · Advanced strategies", color: "#10B981" },
          { num: "04", title: "Wealth Strategy", modules: "Portfolio construction · Tax-aware management · Exit strategy · Building income streams", color: "#A78BFA" },
        ].map((t) => (
          <div key={t.num} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${t.color}30` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "10px", color: t.color, letterSpacing: "0.15em", marginBottom: "6px" }}>TRACK {t.num}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{t.title}</div>
            <div style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{t.modules}</div>
          </div>
        ))}
      </div>
      <Highlight accent={A} text="Community: Skool forum · Monthly live Q&A · Study groups · Resource library · Member spotlights" />
    </div>,

    // ── 8. PRICING ────────────────────────────────────────────────────────
    <div key={8} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="Simple pricing. Real value." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginTop: "20px" }}>
        {[
          { tier: "Monthly", price: "$49/mo", best: "Try it out, flexible", extras: "Full library · Community · Monthly Q&A · Progress tracking", highlight: false },
          { tier: "Annual", price: "$397/yr", best: "Save $191 ($33/mo)", extras: "Everything + 2 exclusive masterclasses + priority Q&A queue", highlight: true },
          { tier: "Lifetime ★", price: "$997", best: "Launch only · founding members", extras: "Everything + founding channel + 1× 30-min strategy call with Kelly", highlight: false },
        ].map((t) => (
          <div key={t.tier} style={{ padding: "20px", borderRadius: "14px", background: t.highlight ? `${A}15` : "rgba(255,255,255,0.04)", border: `1px solid ${t.highlight ? A : "rgba(255,255,255,0.08)"}`, position: "relative" }}>
            {t.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: A, color: "#fff", fontSize: "9px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.1em", fontFamily: "var(--font-display)", whiteSpace: "nowrap" }}>BEST VALUE</div>}
            <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: t.highlight ? A : "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>{t.tier}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>{t.price}</div>
            <div style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: A, marginBottom: "12px" }}>{t.best}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{t.extras}</div>
          </div>
        ))}
      </div>
      <Highlight accent={G} text="Founding Member Launch Price: $39/mo locked for life (first 48 hours only)" sub="Regular price goes to $49/mo after launch window closes. Creates urgency without desperation." />
    </div>,

    // ── 9. REVENUE PROJECTIONS ────────────────────────────────────────────
    // FIX 4: Removed both Highlight banners. Combined key insight into SlideTable note prop.
    <div key={9} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="Conservative path to $20K+ MRR." sub="Assumptions: 0.014% YouTube conversion at launch · 8% monthly churn · 50 net new members/mo · $45 blended ARPU" />
      <SlideTable accent={A}
        title=""
        headers={["Period", "Members", "MRR", "Cumulative Revenue"]}
        rows={[
          ["Month 1 (Launch)", "200", "$9,000", "$9,000"],
          ["Month 3", "300", "$13,500", "$36,000"],
          ["Month 6", "450", "$20,250", "$90,000"],
          ["Month 12", "650", "$29,250", "$225,000"],
        ]}
        note="Skool overhead: ~$360/mo at $9K MRR. Lifetime launch (50 × $997 = $49,850) + 12-month recurring = $300K–$350K total potential."
      />
    </div>,

    // ── 10. BRAND IDENTITY ────────────────────────────────────────────────
    <div key={10} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="A premium brand that extends what already works." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: A, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Visual Identity</p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            {[{ hex: "#0A0E27", name: "Deep Navy" }, { hex: "#2563EB", name: "Electric Blue" }, { hex: "#F59E0B", name: "Gold" }, { hex: "#10B981", name: "Emerald" }].map(c => (
              <div key={c.hex} style={{ textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "8px", background: c.hex, border: "1px solid rgba(255,255,255,0.15)", marginBottom: "4px" }} />
                <p style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{c.hex}</p>
              </div>
            ))}
          </div>
          <BulletCard accent={A} items={["Logo: Compass-rose fused with blockchain node network", "Typography: Sora Bold headlines / Inter body", "Dark mode first — matches how crypto people actually work", "URL: dcacademy.io"]} />
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: A, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Brand Voice Principles</p>
          <BulletCard accent={A} items={[
            "Specific over general — 'When MVRV hits 3.5, here's the protocol' not 'manage your risk'",
            "Earned not claimed — '1.4M subscribers have watched us think out loud'",
            "Direct not corporate — 'This is what Kelly does with his own money'",
            "Ambitious not vague — 'At 12 months you'll have a complete framework'",
          ]} />
        </div>
      </div>
    </div>,

    // ── 11. GO-TO-MARKET ──────────────────────────────────────────────────
    <SlideContent key={11} accent={A}
      title="We have the audience. We just have to open the door."
      bullets={[
        { icon: "🚀", head: "Phase 1 — Founding Member Launch (Week 1–2)", body: "YouTube video: 'I built the academy I wish I had 10 years ago.' Discord-first access. $39/mo founding price (48hr window). X/Twitter 7-post thread. Instagram 5-story countdown." },
        { icon: "🔄", head: "Phase 2 — Content Funnel (Month 2–4)", body: "Every YouTube video ends with a 30-second Academy teaser. Monthly 'free lesson' publicly released. Q&A clips become Instagram Reels and Twitter shorts." },
        { icon: "📈", head: "Phase 3 — Paid + Partner Acquisition (Month 4+)", body: "YouTube pre-roll targeting crypto/investing audiences. Affiliate program: $10/mo recurring commission for member referrals. Co-lives with non-competing crypto creators." },
      ]}
    />,

    // ── 12. CONTENT & MARKETING ───────────────────────────────────────────
    // FIX 5: Replaced 8-row table with SlideContent 4 bullets
    <SlideContent key={12} accent={A}
      title="The content plan that turns viewers into members."
      bullets={[
        { icon: "📹", head: "Weekly long-form video (YouTube → X/Instagram clips)", body: "Core education content that builds trust and drives top-of-funnel traffic every week." },
        { icon: "🎙️", head: "Monthly live Q&A for members (Skool → highlight clips to social)", body: "Exclusive access for paying members; clip highlights become public FOMO content." },
        { icon: "🎁", head: "Monthly free module preview (YouTube → Academy link)", body: "One taste of premium content each month — lowers conversion friction, increases sign-ups." },
        { icon: "📧", head: "Weekly email nurture for non-members (Email → Academy sign-up)", body: "5-email sequence targeting leads: problem → value → social proof → offer → urgency." },
      ]}
    />,

    // ── 13. SALES FUNNEL — PART 1 ─────────────────────────────────────────
    // FIX 6: Split 9-step funnel into two slides. Part 1 = steps 1–4 (Getting Attention)
    <div key={13} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="Funnel Part 1 — Getting Attention" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          { stage: "Awareness", desc: "YouTube video (organic reach or paid pre-roll targeting crypto/investing keywords)", color: "rgba(255,255,255,0.2)" },
          { stage: "Landing Page", desc: "YouTube end screen → Academy landing page with curriculum, pricing, and social proof", color: "rgba(255,255,255,0.3)" },
          { stage: "Trial Intent", desc: "Free Starter Module available instantly — no signup required, lowers friction", color: A + "60" },
          { stage: "Email Capture", desc: "Lead magnet: '5 frameworks Kelly uses to read market cycles' PDF to capture email", color: A + "90" },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "120px", flexShrink: 0, padding: "7px 10px", borderRadius: "6px", background: step.color, textAlign: "center", fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, color: "#fff", letterSpacing: "0.07em", textTransform: "uppercase" }}>{step.stage}</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.65)", margin: 0, flex: 1 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 14. SALES FUNNEL — PART 2 ─────────────────────────────────────────
    // FIX 6 (continued): Part 2 = steps 5–9 (Converting & Retaining)
    <div key={14} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="Funnel Part 2 — Converting & Retaining" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          { stage: "Nurture", desc: "5-email sequence over 10 days: problem → value → social proof → product → urgency", color: A },
          { stage: "Conversion", desc: "Academy sign-up: Monthly ($49/mo) or Annual ($397/yr) — founding price $39/mo", color: "#10B981" },
          { stage: "Activation", desc: "Onboarding flow recommends starting module based on self-reported experience level", color: "#10B981" },
          { stage: "Upsell + Referral", desc: "Day 30: Annual upgrade offer. Day 90: Launchpad cohort. Affiliate dashboard live from day one — $10/mo per referral.", color: G },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "120px", flexShrink: 0, padding: "7px 10px", borderRadius: "6px", background: step.color + (step.color.length === 7 ? "30" : ""), textAlign: "center", fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, color: "#fff", letterSpacing: "0.07em", textTransform: "uppercase", border: `1px solid ${step.color}60` }}>{step.stage}</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.65)", margin: 0, flex: 1 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 15. 90-DAY PLAN ───────────────────────────────────────────────────
    // FIX 7: Was Slide 14. Reduced each phase card to 2 bullets — most important action + key milestone.
    <div key={15} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="90 days to $20K/month MRR." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px", marginTop: "20px" }}>
        {[
          { phase: "Days 1–14: Build", color: "rgba(255,255,255,0.2)", items: ["Rex: Skool setup, module structure, welcome sequence", "Kelly: 4–6 core module videos (Tracks 1–2)"] },
          { phase: "Days 15–21: Launch", color: A, items: ["Day 15: Discord founding members + $39/mo pricing", "Target: 150–200 founding members in first week"] },
          { phase: "Days 22–45: Stabilize", color: "#10B981", items: ["First live Q&A for founding members", "Free module preview on YouTube → conversion push"] },
          { phase: "Days 46–90: Scale", color: G, items: ["YouTube pre-roll campaign ($500–2K/mo)", "Target: 350–500 members = $15–22K MRR"] },
        ].map((p) => (
          <div key={p.phase} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: `1px solid ${p.color}` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: p.color, marginBottom: "10px" }}>{p.phase}</div>
            {p.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                <span style={{ color: p.color, flexShrink: 0, fontSize: "10px", marginTop: "2px" }}>✓</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.4 }}>{item}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>,

    // ── 16. WHY THIS WINS ─────────────────────────────────────────────────
    // FIX 8: Was Slide 15. Removed Highlight banner. Cut to 4 reason rows.
    // Absorbed Highlight key phrase into reason 04 body text.
    <div key={16} style={{ padding: "20px 0" }}>
      <SlideTitle accent={A} text="The academy that shouldn't have taken this long to exist." />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        {[
          { num: "01", head: "Distribution moat", body: "1.4M YouTube subscribers is a warm funnel that took a decade to build. No competitor has it." },
          { num: "02", head: "Price-to-value gap", body: "Competitors charge 3–5× more with smaller, less credible audiences. We're the obvious choice for anyone who knows Discover Crypto." },
          { num: "03", head: "Community compounds", body: "Once serious crypto learners form around the Academy, it becomes self-sustaining. Members teach members. Network effects build a moat." },
          { num: "04", head: "Kelly is the product", body: "Every live Q&A, every direct response from Kelly — that's value no algorithm-only platform can replicate. The audience, trust, and content already exist. The Academy is just the structured version — and charging fairly for it." },
        ].map((r) => (
          <div key={r.num} style={{ display: "flex", gap: "14px", padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: A, flexShrink: 0, width: "24px" }}>{r.num}</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 3px" }}>{r.head}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{r.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,

  ],
};

export default function DcAcademyDeck() {
  return <SlideViewer config={config} />;
}
