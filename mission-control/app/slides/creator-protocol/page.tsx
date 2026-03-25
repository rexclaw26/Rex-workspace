"use client";

import SlideViewer, {
  SlideHero, SlideContent, SlideTitle, SlideTable, SlideStats,
  BulletCard, Highlight, type SlideConfig,
} from "@/components/slides/SlideViewer";

const V  = "#7C3AED";  // Violet
const CY = "#06B6D4";  // Cyan
const EM = "#10B981";  // Emerald

const config: SlideConfig = {
  deckTitle: "Creator Protocol",
  deckSlug: "creator-protocol",
  accent: V,
  accentDim: "rgba(124,58,237,0.12)",
  bg: "#0F0E1A",
  bgCard: "#1A1830",
  slides: [

    // ── 1. HERO ───────────────────────────────────────────────────────────
    // FIX 1: desc shortened to one punchy sentence (~15 words)
    <SlideHero key={1}
      accent={V} bg="#0F0E1A"
      badge="Discover Crypto · Product #3 of 3"
      title="Creator Protocol"
      subtitle="Build your crypto brand with AI."
      tagline="From idea to channel. In hours."
      desc="The AI workflows behind 1.4M subscribers — research, scripts, thumbnails, and sponsorships — in one system."
    />,

    // ── 2. PROBLEM ────────────────────────────────────────────────────────
    <SlideContent key={2} accent={V}
      title="Starting a crypto channel in 2026 is harder than it looks."
      bullets={[
        { icon: "⏱️", head: "The barrier isn't ideas — it's execution", body: "Research takes 3+ hours. Scripts take 2+ hours. Thumbnails require design skills. SEO is its own discipline. Most aspiring creators spend 80% of their time on production." },
        { icon: "🔥", head: "Burnout before the algorithm rewards consistency", body: "Aspiring creators produce 2–3 videos, burn out, and quit before they hit the consistency threshold where YouTube starts sending organic traffic." },
        { icon: "🤖", head: "AI tools exist — but no crypto-specific system does", body: "Nobody has built a crypto-specific, AI-native workflow that explains exactly which tools to use, how to configure them, and how to run the production pipeline from start to finish." },
        { icon: "💰", head: "The earning potential is proven. The system isn't.", body: "75 viable crypto YouTube niches exist in 2025 [Subscribr.ai]. DeFi protocol sponsorships average $2K–$5K/video for established channels. The money is real — the path isn't documented anywhere." },
      ]}
    />,

    // ── 3. SOLUTION ───────────────────────────────────────────────────────
    <SlideContent key={3} accent={V}
      title="The Creator Protocol: your complete AI content system."
      bullets={[
        { icon: "⚙️", head: "Not a collection of prompts. An interconnected system.", body: "Topic research → AI script → thumbnail → distribution. Every stage connected. Every tool specified. Every workflow documented." },
        { icon: "✅", head: "Built from Discover Crypto's actual operation", body: "Not theory. Active systems used on a 1.4M subscriber channel. Kelly's real research workflow, scripting process, and thumbnail approach — documented for the first time." },
        { icon: "🔮", head: "AI-native from the ground up", body: "Designed for GPT-4, Claude, Perplexity, and Midjourney workflows in 2026. Not retrofitted for AI — built with AI as the foundation." },
        { icon: "🔄", head: "Updates when AI tools evolve. Buyers get lifetime access.", body: "Version 2.0 ships at Month 6. All buyers get it free. The 'AI tools change fast' objection is handled by design." },
      ]}
    />,

    // ── 4. MARKET OPPORTUNITY ─────────────────────────────────────────────
    // FIX 2: Reduced from 6 stats to 4 — removed "YouTube active creators 50M+" and "DC warm audience 2.9M+"
    <SlideStats key={4} accent={V}
      title="Two markets converging: crypto and creator economy."
      stats={[
        { label: "Creator economy value", value: "$250B+", sub: "2024 [Goldman Sachs]", color: V },
        { label: "Protocol sponsorship rate", value: "$2–5K/video", sub: "For channels >50K subs [Subscribr.ai 2025]", color: EM },
        { label: "Direct competitors", value: "Zero", sub: "No crypto-specific AI creator kit exists at any price", color: "#F59E0B" },
        { label: "Week 1 target revenue", value: "$10,575", sub: "225 × $47 launch price", color: CY },
      ]}
      note="Sources: Goldman Sachs 2024 | Subscribr.ai 2025 | research-ideas-1-5.md (competitive gap identified)"
    />,

    // ── 5. COMPETITIVE LANDSCAPE ──────────────────────────────────────────
    <SlideTable key={5} accent={V}
      title="A blue ocean. First to build wins."
      headers={["Competitor", "Product", "Price", "Crypto?", "AI-Native?"]}
      rows={[
        ["PromptBase", "Individual prompts", "$1.99–$9.99 each", "Some", "No"],
        ["Generic Gumroad packs", "Prompt bundles", "$17–$67", "No", "Partial"],
        ["ContentCreator.com", "Full video course", "$97–$297 est.", "No", "Yes"],
        ["Udemy creator courses", "Courses", "$14.99 (sale)", "No", "Partial"],
        [<strong key="us" style={{ color: V }}>Creator Protocol</strong>, <strong key="p" style={{ color: V }}>Complete system</strong>, <strong key="pr" style={{ color: EM }}>$67</strong>, <strong key="c" style={{ color: EM }}>Yes</strong>, <strong key="a" style={{ color: EM }}>Yes</strong>],
      ]}
      note="Nobody sells a crypto-specific, AI-native content creation system. Generic AI prompt packs lack crypto context. Crypto courses don't teach content creation. We're alone at the intersection."
    />,

    // ── 6. TARGET CUSTOMER ────────────────────────────────────────────────
    // FIX 3: Simplified to title + % + ONE line description (12 words max).
    // Trigger quotes removed from card face — kept as speaker notes below.
    <div key={6} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="Three buyers. One kit." />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
        {[
          {
            title: "The Aspiring Crypto Creator",
            pct: "50%",
            desc: "Understands crypto, has started a channel, needs a consistent production system.",
            // Speaker notes: "I want to build a channel like yours — what's your actual system?"
            color: V,
          },
          {
            title: "The DeFi Investor Who Documents",
            pct: "30%",
            desc: "Active on-chain voice who wants to scale to video and newsletters.",
            // Speaker notes: "I know my stuff — I just need the system to package it efficiently."
            color: CY,
          },
          {
            title: "The Marketing/Agency Professional",
            pct: "20%",
            desc: "Needs crypto content frameworks to deploy for clients fast.",
            // Speaker notes: "I need to understand crypto content and start creating fast."
            color: EM,
          },
        ].map((b) => (
          <div key={b.title} style={{ padding: "16px 20px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${b.color}30`, display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ padding: "4px 10px", borderRadius: "8px", background: `${b.color}15`, fontFamily: "var(--font-data)", fontSize: "11px", fontWeight: 700, color: b.color, flexShrink: 0 }}>{b.pct}</div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 3px" }}>{b.title}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // ── 7. PRODUCT DETAILS ────────────────────────────────────────────────
    // FIX 4: 7 section cards → 4 themed category cards. Highlight banner moved ABOVE grid as subtitle.
    <div key={7} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="7 sections. One complete operating system." />
      {/* Highlight banner as subtitle line above the grid */}
      <p style={{ fontFamily: "var(--font-data)", fontSize: "11px", color: V, letterSpacing: "0.08em", textTransform: "uppercase", margin: "10px 0 18px", opacity: 0.85 }}>
        Research · Scripts · Visuals · Monetization — every stage covered
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
        {[
          {
            title: "Research & Strategy",
            color: CY,
            line1: "AI research system: 40 prompts, 30-min deep research vs. 3 hrs manual.",
            line2: "30-day content calendar: pre-populated topics, batch schedule, Mon/Wed/Fri cadence.",
          },
          {
            title: "Scripts & Content",
            color: V,
            line1: "YouTube script framework: 5 proven structures, 20-hook library, full prompt chain.",
            line2: "X/Twitter thread system: 10 structures, turn one script into 5 pieces of social content.",
          },
          {
            title: "Visuals & Brand",
            color: EM,
            line1: "Thumbnail formula library: 15 formulas, Canva templates, Midjourney prompts, A/B framework.",
            line2: "Brand voice training prompts: teach any AI your tone — includes Kelly's voice prompt as reference.",
          },
          {
            title: "Monetization",
            color: "#F59E0B",
            line1: "Sponsorship & monetization guide: find protocol sponsors, cold outreach templates, rate card.",
            line2: "Best creator affiliate rates guide — turn your channel into a revenue engine from day one.",
          },
        ].map((s) => (
          <div key={s.title} style={{ padding: "16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}25` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: s.color, marginBottom: "10px" }}>{s.title}</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.55)", margin: "0 0 6px", lineHeight: 1.5 }}>{s.line1}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>{s.line2}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 8. PRICING ────────────────────────────────────────────────────────
    <div key={8} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="One price. Lifetime access. Includes all updates." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginTop: "20px" }}>
        {[
          { label: "Launch Price (48 hrs)", price: "$47", note: "Rewards early action · $20 off", highlight: true, color: V },
          { label: "Regular Price", price: "$67", note: "All 7 sections · lifetime access · all updates free", highlight: false, color: "rgba(255,255,255,0.5)" },
          { label: "Bundle with Cycle Playbook", price: "$130", note: "vs. $134 separate — investment strategy + content system", highlight: false, color: CY },
          { label: "90-Day Workshop Add-on", price: "$27", note: "'Your First 90 Days as a Crypto Creator' with Kelly", highlight: false, color: EM },
        ].map((t) => (
          <div key={t.label} style={{ padding: "20px", borderRadius: "12px", background: t.highlight ? `${V}12` : "rgba(255,255,255,0.04)", border: `1px solid ${t.highlight ? V : "rgba(255,255,255,0.08)"}`, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-data)", fontSize: "10px", color: t.color, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>{t.label}</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 800, color: t.highlight ? V : "#fff", margin: "0 0 6px" }}>{t.price}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.45)", margin: 0 }}>{t.note}</p>
          </div>
        ))}
      </div>
      <Highlight accent={V} text="Version 2.0 ships at Month 6 — all buyers get it free. Quarterly AI tool updates keep the system relevant." />
    </div>,

    // ── 9. REVENUE PROJECTIONS ────────────────────────────────────────────
    // FIX 5: Removed 3 Highlight banners below table. Key insight absorbed into SlideTable note prop.
    <div key={9} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="Lowest standalone. Highest ecosystem value." sub="0.015% warm reach = 225 Week 1 sales at $47. Month 2+ drip: 30–40/mo from YouTube SEO + organic." />
      <SlideTable accent={V}
        title=""
        headers={["Period", "Units", "Avg Price", "Revenue", "Cumulative"]}
        rows={[
          ["Week 1 (launch)", "225", "$47", "$10,575", "$10,575"],
          ["Weeks 2–4", "150", "$67", "$10,050", "$20,625"],
          ["Month 2", "50", "$67", "$3,350", "$23,975"],
          ["Month 6 (months 4–6)", "120", "$67", "$8,040", "$35,030"],
          ["Month 12 (months 7–12)", "150", "$67", "$10,050", "$45,080"],
        ]}
        note="Standalone 12-month: $45K–$55K · Academy conversions at 15% ($49/mo): +$35–50K ARR · Total ecosystem value: $90K–$120K"
      />
    </div>,

    // ── 10. BRAND IDENTITY ────────────────────────────────────────────────
    <div key={10} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="AI-native. Crypto-native. Creator-first." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: V, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Visual Identity</p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            {[{ hex: "#1E1B4B", name: "Deep Indigo" }, { hex: "#7C3AED", name: "Violet" }, { hex: "#06B6D4", name: "Cyan" }, { hex: "#10B981", name: "Emerald" }].map(c => (
              <div key={c.hex} style={{ textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "8px", background: c.hex, border: "1px solid rgba(255,255,255,0.15)", marginBottom: "4px" }} />
                <p style={{ fontFamily: "var(--font-data)", fontSize: "9px", color: "rgba(255,255,255,0.4)", margin: 0 }}>{c.hex}</p>
              </div>
            ))}
          </div>
          <BulletCard accent={V} items={["Logo: Stylized hexagon (blockchain) with integrated play button (creator)", "Typography: Outfit Bold headlines / JetBrains Mono for code elements", "Dark mode technical aesthetic — looks like serious infrastructure, not a digital freebie", "URL: creatorprotocol.io"]} />
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", color: V, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Messaging Pillars</p>
          <BulletCard accent={V} items={[
            "Operational proof — 'Built from the workflows behind 1.4M subscribers'",
            "AI efficiency — 'Compress 5 hours of content work into under 90 minutes'",
            "Crypto-specific — 'Not generic creator advice — built for the crypto niche'",
            "System not content — 'Not prompts, a protocol — an end-to-end operating system'",
          ]} />
        </div>
      </div>
    </div>,

    // ── 11. GO-TO-MARKET ──────────────────────────────────────────────────
    <SlideContent key={11} accent={V}
      title="Show it. Don't tell it."
      bullets={[
        { icon: "🎬", head: "The YouTube video IS the marketing", body: "'How I research, script, and thumbnail a YouTube video in 90 minutes using AI' — Kelly uses the Creator Protocol live on camera. The product sells itself by being demonstrated. Non-replicable by competitors." },
        { icon: "🧵", head: "X/Twitter thread on launch day", body: "'Here's the exact AI workflow I use to produce crypto content.' 10 tweets covering one system element each. Ends with Creator Protocol link. Educational first, product second." },
        { icon: "🤝", head: "Creator economy outreach (Week 2+)", body: "DM 50 crypto YouTube creators with 5K–100K subscribers. Affiliate offer: 30% commission. These creators ARE the target audience and want to earn. Mutual benefit with no risk." },
      ]}
    />,

    // ── 12. CONTENT & MARKETING ───────────────────────────────────────────
    <SlideContent key={12} accent={V}
      title="The product demonstrates itself."
      bullets={[
        { icon: "📸", head: "Pre-launch teaser series (Days -7 to 0)", body: "X/Twitter: 'Documenting exactly how we create content using AI. Something coming.' Instagram story: behind-the-scenes screenshot. YouTube community post: 'Sneak peek at our internal AI research workflow.'" },
        { icon: "🚀", head: "Launch week — show, don't tell", body: "Full YouTube video + X thread + Instagram reel simultaneously. Day 2: 'First 50 buyers' post. Day 5: thumbnail formula section clip for late conversions." },
        { icon: "📈", head: "Month 2+ — demonstrate commitment", body: "Monthly 'AI tool update' post showing what changed in the workflow. Creator spotlight: feature a buyer who launched using the protocol. Case study video at 3 months." },
        { icon: "🔍", head: "SEO targets", body: "how to start a crypto YouTube channel · crypto content creator AI tools · AI tools for YouTube creators · how to make crypto videos with AI" },
      ]}
    />,

    // ── 13. SALES FUNNEL — PART 1 ─────────────────────────────────────────
    // FIX 6: Original 9-step funnel split into two slides.
    // This slide: "Funnel Part 1 — Capture & Convert" — steps 1–4
    <div key={13} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="Funnel Part 1 — Capture & Convert" />
      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {[
          { stage: "Awareness", desc: "YouTube: 'I created a YouTube video in 90 minutes using AI — here's exactly how'", color: "rgba(255,255,255,0.2)" },
          { stage: "Landing Page", desc: "Hexagon-play logo · '$47 launch / $67 regular' · System map visual · Real Notion template screenshots · 30-day refund", color: "rgba(255,255,255,0.3)" },
          { stage: "Checkout", desc: "Gumroad — handles delivery, affiliate tracking, update distribution automatically", color: V + "50" },
          { stage: "Email 1 (instant)", desc: "Welcome + download links + 'Start with Section 1 (Research) and Section 4 (Calendar) first'", color: V + "80" },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <div style={{ width: "120px", flexShrink: 0, padding: "7px 10px", borderRadius: "6px", background: step.color, textAlign: "center", fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>{step.stage}</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.65)", margin: 0, flex: 1, lineHeight: 1.5 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 14. SALES FUNNEL — PART 2 ─────────────────────────────────────────
    // FIX 6 (continued): "Funnel Part 2 — Nurture & Scale" — steps 5–9
    // Compact rows: email name + one-line purpose only
    <div key={14} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="Funnel Part 2 — Nurture & Scale" />
      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { name: "Email 2 · Day 3", purpose: "Social proof: how one creator used this to launch their first 10 videos.", color: V },
          { name: "Email 3 · Day 7", purpose: "Academy upsell: accelerate your channel with Discover Crypto Academy ($49/mo).", color: "#2563EB" },
          { name: "Email 4 · Day 14", purpose: "Workshop upsell: 30-minute first channel workshop ($27).", color: CY },
          { name: "Email 5 + Ongoing", purpose: "Day 30: Launchpad bridge ($497–$997). Monthly AI tool updates + Version 2.0 referral trigger long-term.", color: EM },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", alignItems: "center", padding: "12px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${row.color}25` }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: row.color, flexShrink: 0, width: "130px" }}>{row.name}</span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>{row.purpose}</p>
          </div>
        ))}
      </div>
    </div>,

    // ── 15. 90-DAY PLAN ───────────────────────────────────────────────────
    // FIX 7: Was Slide 14. Stat cards row removed. Each phase reduced to 2 bullets max.
    <div key={15} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="The fastest build on the list. 7 days to launch-ready." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "20px" }}>
        {[
          { phase: "Days 1–7: Build", color: "rgba(255,255,255,0.2)", items: ["Rex builds all 7 product sections (Notion + PDF)", "Launch page + post-purchase email sequence ready"] },
          { phase: "Days 8–14: Launch Prep", color: V, items: ["YouTube video script + X/Twitter thread scheduled", "Affiliate links configured on Gumroad"] },
          { phase: "Day 15: Launch", color: CY, items: ["YouTube video + all social channels live simultaneously", "Affiliate DMs sent to 20–30 crypto creators"] },
          { phase: "Days 31–90: Scale", color: EM, items: ["Academy upsell sequence running (target 15% conversion)", "Second demo video + SEO blog post live"] },
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
    // FIX 8: Was Slide 15. Cut to 4 reasons (removed "market timing" as weakest).
    // Highlight banner removed — key phrase absorbed into reason 04 body text.
    <div key={16} style={{ padding: "20px 0" }}>
      <SlideTitle accent={V} text="First mover. No direct competition. Kelly IS the product." />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        {[
          { num: "01", head: "There is no direct competitor", body: "A crypto-specific, AI-native content creation system at any price point does not exist. Zero competition is a narrow window — we build it before others notice." },
          { num: "02", head: "Kelly's credibility is the entire value proposition", body: "'Built from the workflows behind 1.4M subscribers' is not marketing copy — it's a verifiable fact. Nobody else can say that. Generic AI prompt sellers have no such claim." },
          { num: "03", head: "Cheapest build on this list", body: "No infrastructure. No code. Rex builds the assets in 7 days. Launch in 14. The risk-adjusted return is the best in the portfolio." },
          { num: "04", head: "It feeds the Academy — that's the real return", body: "Creator-track buyers stay longest and convert to high-ticket most often. The $67 seeds $49/mo recurring, which seeds $497–$997. Selling the system behind our own success to the audience watching us build it — and no one else can say that." },
        ].map((r) => (
          <div key={r.num} style={{ display: "flex", gap: "14px", padding: "14px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: V, flexShrink: 0, width: "24px" }}>{r.num}</span>
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

export default function CreatorProtocolDeck() {
  return <SlideViewer config={config} />;
}
