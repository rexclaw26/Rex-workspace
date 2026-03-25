"use client";

import SlideViewer, {
  SlideHero, SlideContent, SlideTitle, SlideTable, SlideStats,
  BulletCard, Highlight, type SlideConfig,
} from "@/components/slides/SlideViewer";

const G  = "#10B981";  // Emerald
const AM = "#F59E0B";  // Amber
const RD = "#EF4444";  // Red

const config: SlideConfig = {
  deckTitle: "The Cycle Playbook",
  deckSlug: "crypto-cycle-playbook",
  accent: G,
  accentDim: "rgba(16,185,129,0.12)",
  bg: "#111827",
  bgCard: "#1A2333",
  slides: [

    // ── 1. HERO ───────────────────────────────────────────────────────────
    // FIX 1: desc shortened to one punchy sentence ~15 words. Tagline kept.
    <SlideHero key={1}
      accent={G} bg="#111827"
      badge="Discover Crypto · Product #2 of 3"
      title="The Cycle Playbook"
      subtitle="Know the cycle. Keep the gains."
      tagline="The playbook pros don't share."
      desc="The exact framework for navigating every bull and bear market — built from 3 lived cycles."
    />,

    // ── 2. PROBLEM ────────────────────────────────────────────────────────
    <SlideContent key={2} accent={G}
      title="Most crypto investors repeat the same cycle of pain."
      bullets={[
        { icon: "📈", head: "They buy near the top", body: "When price action is exciting, social media is euphoric, and everyone is a genius. Classic late-cycle retail behaviour." },
        { icon: "💎", head: "They HODL through the bear", body: "Because they were never taught when to sell. 'Just DCA' is not a framework — it's hope dressed up as strategy." },
        { icon: "😨", head: "They panic-sell at the bottom", body: "When the pain finally becomes unbearable and capitulation hits. Usually right before the next accumulation phase." },
        { icon: "🔁", head: "They repeat this indefinitely", body: "74% of retail investors reported losses in the 2022 bear market. Most had never studied cycle fundamentals. Bitcoin's 4-year halving cycle has repeated since 2012 — yet most retail investors don't know it exists." },
      ]}
    />,

    // ── 3. SOLUTION ───────────────────────────────────────────────────────
    <SlideContent key={3} accent={G}
      title="The Cycle Playbook: a framework, not a prediction."
      bullets={[
        { icon: "🗺️", head: "A concrete framework for each of the four phases", body: "Accumulation, Mark-Up, Distribution, Mark-Down. Exact on-chain signals, price action patterns, and portfolio moves for each." },
        { icon: "🔬", head: "We're not predicting — we're reading patterns", body: "Patterns that have repeated across every cycle since Bitcoin's creation. The framework is built on data, not conviction." },
        { icon: "✅", head: "Kelly's actual methodology — documented for the first time", body: "3 full cycles. Real capital. Real decisions. Now written down, explained, and executable for any serious investor." },
        { icon: "📚", head: "7 modules + PDF playbook + worksheets + case studies", body: "Everything you need to apply the framework in the current cycle and every cycle after. One purchase. Lifetime use." },
      ]}
    />,

    // ── 4. MARKET OPPORTUNITY ─────────────────────────────────────────────
    // FIX 2: Reduced from 6 stats to 4. Removed "US crypto owners 46M" and "Online course market $2.3B".
    <SlideStats key={4} accent={G}
      title="Millions of crypto investors need this."
      stats={[
        { label: "Global crypto users", value: "617M", sub: "2024 [Triple-A Global Crypto Adoption]", color: G },
        { label: "Benjamin Cowen charges", value: "$1,399/yr", sub: "For ongoing cycle analysis — we charge $97 once", color: RD },
        { label: "DC warm audience", value: "2.9M+", sub: "YouTube + X + Instagram combined reach", color: G },
        { label: "Week 1 target revenue", value: "$20,100", sub: "300 × $67 launch price", color: AM },
      ]}
      note="Sources: Triple-A 2024 | research-ideas-1-5.md (Benjamin Cowen pricing)"
    />,

    // ── 5. COMPETITIVE LANDSCAPE ──────────────────────────────────────────
    <SlideTable key={5} accent={G}
      title="There's nothing quite like this. That's the point."
      headers={["Competitor", "Price", "Cycle-Specific?", "Kelly's Credibility?"]}
      rows={[
        ["Udemy cycle courses", "$14.99–$29.99 (sale)", "Generic", "No"],
        ["Benjamin Cowen", "$1,399/year", "Yes", "No"],
        ["Ivan on Tech / Moralis", "$497–$997", "No", "No"],
        ["Telegram signal groups", "$99–$200/mo", "Partial", "No"],
        [<strong key="us" style={{ color: G }}>The Cycle Playbook</strong>, <strong key="p" style={{ color: G }}>$97 one-time</strong>, <strong key="c" style={{ color: G }}>Yes</strong>, <strong key="k" style={{ color: AM }}>Yes — Kelly, 1.4M</strong>],
      ]}
      note="Key insight: Benjamin Cowen charges $1,399/year for ongoing cycle analysis. We charge $97 once for the foundational framework. Different product, complementary position."
    />,

    // ── 6. TARGET CUSTOMER ────────────────────────────────────────────────
    // FIX 3: Simplified to title + % + one-line description (12 words max).
    // Trigger quotes and sensitivity notes moved to speaker notes below.
    <div key={6} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="Two buyers. One product." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "20px" }}>
        {[
          {
            title: "The Scarred Veteran",
            pct: "Primary",
            // Speaker notes: Trigger — "If I'd known this then, I'd be up instead of flat."
            // Speaker notes: Sensitivity — Low. $97 is nothing if they lost $10K+ in 2022.
            desc: "Made gains in 2021, lost most in 2022 — still believes.",
            color: G,
          },
          {
            title: "The Prepared New Entrant",
            pct: "Secondary",
            // Speaker notes: Trigger — "I'd rather spend $97 now than learn the expensive way."
            // Speaker notes: Sensitivity — Medium. $97 is meaningful but justifiable.
            desc: "Entered the 2025 bull cycle, doing research, avoiding rookie mistakes.",
            color: AM,
          },
        ].map((b) => (
          <div key={b.title} style={{ padding: "20px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${b.color}30` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#fff" }}>{b.title}</span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", fontWeight: 700, color: b.color, background: `${b.color}15`, padding: "2px 8px", borderRadius: "10px" }}>{b.pct}</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 7. PRODUCT DETAILS ────────────────────────────────────────────────
    // FIX 4: Regrouped 7 modules into 4 themed category cards.
    // Highlight banner moved ABOVE the grid as a subtitle.
    <div key={7} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="7 modules. One framework. Built from real cycles." />
      <Highlight accent={G} text="Included: PDF companion playbook (30p) · Cycle positioning worksheet · DCA calculator (Google Sheets) · On-chain signal quick reference card" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
        {[
          {
            category: "Phase Framework",
            modules: "Modules 1 + 5",
            desc: "The complete four-phase cycle system with on-chain indicators for each. Plus mark-down phase: capital preservation and avoiding bear traps.",
            color: G,
          },
          {
            category: "Accumulation & Growth",
            modules: "Modules 2 + 3",
            desc: "How and when to buy in accumulation. Staying disciplined in mark-up, altcoin rotation, and position sizing as the cycle matures.",
            color: G,
          },
          {
            category: "Distribution & Timing",
            modules: "Module 4",
            desc: "Kelly's actual take-profit strategy and pre-defined exits. On-chain signals for detecting cycle tops before retail notices.",
            color: AM,
          },
          {
            category: "Real-World Evidence",
            modules: "Modules 6 + 7",
            desc: "Three complete cycle case studies: 2017–18, 2020–21, 2022–23. Plus Kelly's monthly five-question 'where are we now?' checklist.",
            color: AM,
          },
        ].map((card) => (
          <div key={card.category} style={{ padding: "18px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${card.color}30` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#fff" }}>{card.category}</span>
              <span style={{ fontFamily: "var(--font-data)", fontSize: "9px", fontWeight: 700, color: card.color, background: `${card.color}15`, padding: "2px 8px", borderRadius: "10px", whiteSpace: "nowrap" }}>{card.modules}</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.55 }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 8. PRICING ────────────────────────────────────────────────────────
    <div key={8} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="$97 once. Value that compounds every cycle." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginTop: "20px" }}>
        {[
          { label: "Launch Price (72 hrs)", price: "$67", note: "Creates urgency · rewards fast action", highlight: true, color: G },
          { label: "Regular Price", price: "$97", note: "7 modules + PDF + worksheets + case studies", highlight: false, color: "rgba(255,255,255,0.5)" },
          { label: "Bundle with Creator Kit", price: "$130", note: "vs. $164 separate — saves $34", highlight: false, color: AM },
          { label: "Quarterly Workshop Add-on", price: "$47", note: "90-min live application with Kelly, each cycle", highlight: false, color: "rgba(255,255,255,0.5)" },
        ].map((t) => (
          <div key={t.label} style={{ padding: "20px", borderRadius: "12px", background: t.highlight ? `${G}12` : "rgba(255,255,255,0.04)", border: `1px solid ${t.highlight ? G : "rgba(255,255,255,0.08)"}`, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: t.color, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>{t.label}</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 800, color: t.highlight ? G : "#fff", margin: "0 0 6px" }}>{t.price}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.45)", margin: 0 }}>{t.note}</p>
          </div>
        ))}
      </div>
      <Highlight accent={G} text="Refund policy: 30-day full refund guarantee. Reduces buying friction. Chargeback risk is low for quality content products." />
    </div>,

    // ── 9. REVENUE PROJECTIONS ────────────────────────────────────────────
    // FIX 5: Removed both Highlight banners. Key insight absorbed into SlideTable note prop.
    <div key={9} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="Conservative projections with real assumptions." sub="Launch to 2.9M reach (1.5M net unique). 0.02% Week 1 conversion = 300 sales at $67. Month 2+ drip ~50/mo at $97." />
      <SlideTable accent={G}
        title=""
        headers={["Period", "Units", "Avg Price", "Revenue", "Cumulative"]}
        rows={[
          ["Week 1 (launch)", "300", "$67", "$20,100", "$20,100"],
          ["Weeks 2–4", "200", "$97", "$19,400", "$39,500"],
          ["Month 2", "75", "$97", "$7,275", "$46,775"],
          ["Month 6 (cumulative)", "150 (3 mos)", "$97", "$14,550", "$67,630"],
          ["Month 12 (cumulative)", "180 (6 mos)", "$97", "$17,460", "$85,090"],
        ]}
        note="Build cost: ~$0–$5,000 (Kelly time + editing + Rex production). 12-month base: $85K–$95K standalone. With upsells (workshops + Academy): $100K–$130K. ROI is extraordinary."
      />
    </div>,

    // ── 10. BRAND IDENTITY ────────────────────────────────────────────────
    <div key={10} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="Analytical. Confident. Kelly-native." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: G, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Visual Identity</p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            {[{ hex: "#111827", name: "Charcoal" }, { hex: "#10B981", name: "Emerald" }, { hex: "#F59E0B", name: "Amber" }, { hex: "#EF4444", name: "Signal Red" }].map(c => (
              <div key={c.hex} style={{ textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "8px", background: c.hex, border: "1px solid rgba(255,255,255,0.15)", marginBottom: "4px" }} />
                <p style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{c.hex}</p>
              </div>
            ))}
          </div>
          <BulletCard accent={G} items={["Logo: Four-phase cycle wheel — geometric, four colored quadrants", "Typography: Space Grotesk Bold headlines / JetBrains Mono data", "Chart-forward visual style — Kelly's annotated Bitcoin charts > any designed graphic", "URL: thecycleplaybook.com or cyclebook.io"]} />
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: G, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Messaging Pillars</p>
          <BulletCard accent={G} items={[
            "Real frameworks, not predictions — 'We don't predict. We prepare.'",
            "Built from lived experience — 'Kelly navigated 3 full cycles with real money'",
            "One-time investment for lifetime framework — 'Buy once. Use every cycle.'",
            "Actionable specificity — 'Not manage your risk. Exactly when and how to take profits.'",
          ]} />
        </div>
      </div>
    </div>,

    // ── 11. GO-TO-MARKET ──────────────────────────────────────────────────
    <SlideContent key={11} accent={G}
      title="Launched from trust. Driven by content."
      bullets={[
        { icon: "🎬", head: "Launch day — YouTube + X + Instagram simultaneously", body: "YouTube: 'The 4 phases of the crypto cycle' — Kelly on camera, real data. X/Twitter: 10-tweet breakdown. Instagram: 60-second 'Where are we now?' reel. Discord: founding member pricing pinned." },
        { icon: "📌", head: "Weeks 2–4 — End-screens + social proof", body: "CTAs added to top 50 educational videos. 'Student results' post at 2 weeks. Follow-up X thread answering top buyer questions (social proof + education in one)." },
        { icon: "🔗", head: "Ongoing — Affiliate program at 30% commission", body: "Other crypto creators with <100K subscribers have relevant audiences and few monetization options. They'll actively promote at 30%. Mutual benefit, no risk." },
      ]}
    />,

    // ── 12. CONTENT & MARKETING ───────────────────────────────────────────
    <SlideContent key={12} accent={G}
      title="The content sells itself when the quality is there."
      bullets={[
        { icon: "📺", head: "Pre-launch (Days -7 to 0)", body: "X/Twitter teaser series. Behind-the-scenes Instagram stories. 90-second Module 4 preview (the distribution phase clip — what most people get wrong)." },
        { icon: "🚀", head: "Launch week", body: "Full YouTube video + X thread + Instagram reel + Discord announcement. Every piece educational first, product second." },
        { icon: "🔄", head: "Month 2+ ongoing", body: "Monthly cycle update blog post with Playbook link. Any YouTube video covering MVRV, Pi Cycle, profit-taking → Playbook in description. Quarterly workshops ($47) for existing buyers." },
        { icon: "🔍", head: "SEO targets", body: "crypto market cycle course · when to take profits crypto · Bitcoin halving cycle explained · how to know when bull market ends · best crypto investing course 2026" },
      ]}
    />,

    // ── 13. SALES FUNNEL — Part 1: Discovery & Intent ────────────────────
    // FIX 6: Original 9-step funnel split into two slides. Part 1 = steps 1–4.
    <div key={13} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="Funnel Part 1 — Discovery & Intent" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { stage: "Awareness", desc: "YouTube: 'The 4 phases of the crypto market cycle'", color: "rgba(255,255,255,0.2)" },
          { stage: "Landing Page", desc: "Kelly headshot · tagline · $67 launch / $97 regular · module list · PDF preview · 30-day refund guarantee", color: "rgba(255,255,255,0.3)" },
          { stage: "Checkout", desc: "Gumroad — simple, trusted, one-click for returning users. Handles affiliate tracking natively.", color: G + "50" },
          { stage: "Email 1 (instant)", desc: "Welcome + access links + 'Start with Module 1, then Module 6 (case studies)'", color: G + "80" },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "120px", flexShrink: 0, padding: "5px 10px", borderRadius: "6px", background: step.color, textAlign: "center", fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>{step.stage}</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0, flex: 1 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 14. SALES FUNNEL — Part 2: Nurture & Upsell ──────────────────────
    // FIX 6 (continued): Steps 5–9. Tighter style — email name + one-line purpose, no stage labels.
    <div key={14} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="Funnel Part 2 — Nurture & Upsell" />
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { name: "Email 2 — Day 3", desc: "Immediate value: 'Here's where we are in the current cycle — apply Module 4 now.'", color: G },
          { name: "Email 3 — Day 7", desc: "Upsell: 'How Academy members go deeper' → Discover Crypto Academy ($49/mo).", color: "#2563EB" },
          { name: "Email 4 — Day 14", desc: "Add-on offer: TradingView setup guide ($27) — practical tool for applying the framework.", color: AM },
          { name: "Email 5 + Ongoing", desc: "Day 30: Quarterly Workshop ($47). Quarterly cycle update emails reinforce value and drive Academy conversions long-term.", color: AM },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "140px", flexShrink: 0, padding: "5px 10px", borderRadius: "6px", background: step.color, fontFamily: "var(--font-display)", fontSize: "9px", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>{step.name}</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0, flex: 1, paddingTop: "4px" }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 15. 90-DAY PLAN ───────────────────────────────────────────────────
    // FIX 7 (was Slide 14): Reduced to 2 bullets per phase card. Removed 3 stat cards row.
    <div key={15} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="From zero to launched in 14 days. Then let it run." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px", marginTop: "20px" }}>
        {[
          { phase: "Days 1–10: Build", color: "rgba(255,255,255,0.2)", items: ["Rex: Landing page, email sequences, PDF + worksheets designed", "Kelly: Records 7 modules (3–4 hours total)"] },
          { phase: "Days 11–14: Launch Prep", color: G, items: ["Rex: YouTube end-screens, X thread, Instagram scripts ready", "Kelly: Final review + approval of all assets"] },
          { phase: "Day 15: Launch", color: "#10B981", items: ["YouTube + X + Instagram + Discord go live simultaneously", "Monitor and respond to the first 48 hours personally"] },
          { phase: "Days 16–90: Scale", color: AM, items: ["End-screens on top 50 educational videos + affiliate activations", "30-day nurture sequence running + first quarterly workshop sold"] },
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
    // FIX 8 (was Slide 15): Cut to 4 reasons (removed "It's not a prediction").
    // Removed Highlight banner. Key phrase absorbed into reason 04 body.
    <div key={16} style={{ padding: "20px 0" }}>
      <SlideTitle accent={G} text="The simplest, fastest money on this list. And it compounds." />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        {[
          { num: "01", head: "Zero infrastructure", body: "No servers, no bots, no data pipelines. Record, upload, sell. Rex builds the entire product in 10 days. Launch in 14." },
          { num: "02", head: "The content already exists in Kelly's head", body: "Three full crypto cycles of lived experience, documented for the first time. Unique because no one else has Kelly's specific pattern of observation." },
          { num: "03", head: "$97 is in the impulse purchase zone", body: "For someone who lost money in crypto, $97 to understand why and how to prevent it is trivial. The emotional pain is the selling point." },
          { num: "04", head: "It's a funnel entry point", body: "Every Playbook buyer is a warm lead for the Academy. The $97 converts to $49/month recurring. The real revenue isn't the $97 — it's the compounding MRR it seeds. Every buyer is a future Academy member." },
        ].map((r) => (
          <div key={r.num} style={{ display: "flex", gap: "14px", padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: G, flexShrink: 0, width: "24px" }}>{r.num}</span>
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

export default function CyclePlaybookDeck() {
  return <SlideViewer config={config} />;
}
