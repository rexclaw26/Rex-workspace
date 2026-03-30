// config/decks.ts
// Rex updates this file each time new slide decks are built.
// Each DeckGroup = one expandable project button on the Decks page.
// Each SlideDeck inside = one clickable link to /slides/[slug].

export type DeckStatus = "ready" | "building" | "draft";

export interface SlideDeck {
  title: string;
  slug: string;          // links to /slides/[slug]
  description?: string;
  status: DeckStatus;
}

export interface DeckGroup {
  id: string;
  title: string;         // button label shown on Decks page
  description: string;   // one-line summary shown when collapsed
  date: string;          // display date
  accentColor: string;   // CSS color var or hex for the group's accent
  decks: SlideDeck[];
}

// ── Active Deck Groups ─────────────────────────────────────────────────────
// Add new groups here as Rex builds them. Most recent at top.

export const DECK_GROUPS: DeckGroup[] = [
  {
    id: "api-cost-analysis-march-2026",
    title: "DC Data Hub — API Integration Cost Analysis",
    description: "11-slide decision framework for CoinGlass, CryptoQuant, and price chart integrations. Budget caps $150/$100. Recommended path: CryptoQuant Professional $99/mo + free charts.",
    date: "March 28, 2026",
    accentColor: "#F97316",
    decks: [
      {
        title: "DC Data Hub: API Cost Analysis",
        slug: "api-cost-analysis",
        description: "CoinGlass vs CryptoQuant vs free charts. Budget scenarios, tier breakdowns, and a 3-phase action plan.",
        status: "ready",
      },
    ],
  },
  {
    id: "paperclip-assessment-march-2026",
    title: "Paperclip Assessment — Should We Implement?",
    description: "15-slide first-principles analysis of Paperclip (agent org-chart orchestrator). Verdict: NOT YET. Real value at 10+ agents. Selective adoption plan included. Confidence: 72%.",
    date: "March 19, 2026",
    accentColor: "#F97316",
    decks: [
      {
        title: "Paperclip: Should Hit Network Implement It?",
        slug: "paperclip-assessment",
        description: "Gap analysis, steelman for/against, selective adoption options, implementation roadmap, and revisit triggers.",
        status: "ready",
      },
    ],
  },
  {
    id: "dc-ai-pipeline-march-2026",
    title: "DC AI Content Pipeline — 60-Day X Strategy",
    description: "AI avatar + video production plan for 60 educational X posts. HeyGen + Kling 3.0 stack. ~$4.31/video. Full cost breakdown, workflow, and launch checklist.",
    date: "March 18, 2026",
    accentColor: "#F97316",
    decks: [
      {
        title: "DC AI Content Pipeline",
        slug: "dc-ai-pipeline",
        description: "60-day X education strategy with AI avatar host. Cost per video, tool stack, content pillars, CTR formula, and 7-day launch plan.",
        status: "ready",
      },
    ],
  },
  {
    id: "master-skills-report-march-2026",
    title: "Master Skills Report — Rex Analysis",
    description: "339 skills evaluated from LeoYeAI/openclaw-master-skills. 25 selected across marketing, web design, mobile, browser automation, and prompt engineering.",
    date: "March 14, 2026",
    accentColor: "#F97316",
    decks: [
      {
        title: "OpenClaw Master Skills — What's Worth Installing",
        slug: "master-skills-report",
        description: "Priority, High-Value, and Mobile tiers with integration paths and cost breakdown.",
        status: "ready",
      },
    ],
  },
  {
    id: "turnkey-products-march-2026",
    title: "Turnkey Digital Products — Rex Built",
    description: "10 ideas researched, top 3 selected by business critic. 100% Rex-buildable — no filming, no editing, no Kelly production time required.",
    date: "March 7, 2026",
    accentColor: "var(--orange)",
    decks: [
      {
        title: "CycleEdge Pro",
        slug: "cycle-edge-pro",
        description: "Automated crypto market cycle newsletter. $22/mo. Fastest to profit — 4 weeks to $4.4K MRR.",
        status: "ready",
      },
      {
        title: "PineEdge",
        slug: "pine-edge",
        description: "Premium TradingView Pine Script indicator suite. $29-49/mo. Strongest brand potential.",
        status: "ready",
      },
      {
        title: "ChainSignal",
        slug: "chain-signal",
        description: "AI-powered crypto alert SaaS dashboard. $19-99/mo. Highest revenue ceiling — $72K MRR potential.",
        status: "ready",
      },
    ],
  },
  {
    id: "digital-products-march-2026",
    title: "Digital Product Launch — Top 3",
    description: "Competitive research across 10 ideas → top 3 selected → full brand breakdown, business plan, and revenue projections for each. 15 slides per deck.",
    date: "March 7, 2026",
    accentColor: "var(--orange)",
    decks: [
      {
        title: "Discover Crypto Academy",
        slug: "dc-academy",
        description: "Skool community + curriculum. $49/mo. Path to $20K+ MRR. Score: 26/30.",
        status: "ready",
      },
      {
        title: "The Cycle Playbook",
        slug: "crypto-cycle-playbook",
        description: "One-time $97 digital course. 4-phase market cycle framework. Fastest cash. Score: 20/30.",
        status: "ready",
      },
      {
        title: "Creator Protocol",
        slug: "creator-protocol",
        description: "AI content creation system. $67 one-time. Blue ocean — zero direct competitors. Score: 21/30.",
        status: "ready",
      },
    ],
  },
];
