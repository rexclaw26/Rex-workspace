"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ACCENT = "#F97316";

const slides = [
  {
    slideNumber: 1,
    type: "title",
    title: "DC AI Content Pipeline",
    subtitle: "60-Day X Education Strategy — AI Avatar + Video Production Plan",
    tag: "Discover Crypto | Internal Strategy Deck | March 2026",
  },
  {
    slideNumber: 2,
    type: "bullets",
    title: "60 Posts. 60 Videos. Zero Studio.",
    points: [
      "60-day educational content calendar for X",
      "Each post: high-CTR copy + 60-second AI video",
      "Hyper-realistic female AI avatar as DC brand host",
      "Charts, walkthroughs, and visual breakdowns embedded in video",
      "Target: maximum virality + educational authority on X",
    ],
  },
  {
    slideNumber: 3,
    type: "split",
    title: "Two Tools. One Pipeline.",
    leftLabel: "HeyGen — AI Avatar Presenter",
    leftPoints: ["Lip-synced talking head", "Custom branded female avatar", "Handles script delivery", "$29–49/mo"],
    rightLabel: "Kling 3.0 — B-Roll & Visuals",
    rightPoints: ["Chart animations", "Market walkthroughs", "Visual definitions", "~$0.126/sec API"],
    note: "ElevenLabs voiceover already integrated — no additional cost.",
  },
  {
    slideNumber: 4,
    type: "bullets",
    title: "Meet the DC Host",
    points: [
      "Custom-designed female AI avatar — not a stock HeyGen template",
      "Face generated via Midjourney/Flux for unique DC identity",
      "Personality: authoritative yet approachable — crypto educator energy",
      "Name TBD (options: Nova, Sage, Aria)",
      "Owns a distinct visual identity no competitor has",
    ],
  },
  {
    slideNumber: 5,
    type: "steps",
    title: "From Idea to Posted in Hours",
    steps: [
      "Rex generates script + X post copy (optimized for CTR + virality)",
      "ElevenLabs renders voiceover from script",
      "HeyGen renders avatar presenter lip-synced to audio",
      "Kling 3.0 generates b-roll: charts, definitions, visual breakdowns",
      "Video assembled (avatar + b-roll cut together)",
      "Kelly approves final video + post copy",
      "Scheduled and posted to X via existing infrastructure",
    ],
  },
  {
    slideNumber: 6,
    type: "table",
    title: "Cost Per Video — Full Breakdown",
    rows: [
      { component: "Avatar presenter (60 sec)", tool: "HeyGen ($29/mo ÷ 60 videos)", cost: "~$0.48" },
      { component: "Voiceover", tool: "ElevenLabs (already paying)", cost: "~$0.00" },
      { component: "B-roll / chart visuals (30 sec)", tool: "Kling 3.0 API @ $0.126/sec", cost: "~$3.78" },
      { component: "Script + post copy", tool: "Rex (Claude token)", cost: "~$0.05" },
      { component: "Total per video", tool: "", cost: "~$4.31", highlight: true },
      { component: "60-video monthly run", tool: "", cost: "~$259/mo", highlight: true },
    ],
    note: "Traditional 60-second branded video production: $500–2,000 per video. AI pipeline: 99% cost reduction.",
  },
  {
    slideNumber: 7,
    type: "budget",
    title: "Monthly Investment",
    items: [
      { label: "HeyGen Creator plan", cost: "$29/mo", note: "Unlimited avatar videos" },
      { label: "Kling 3.0 API (60 videos × 30sec b-roll)", cost: "~$226/mo", note: "" },
      { label: "ElevenLabs", cost: "$0", note: "Already in budget" },
      { label: "TOTAL", cost: "~$255/mo", note: "60 videos per month", highlight: true },
    ],
    compare: "Traditional equivalent = $30,000–120,000/mo",
  },
  {
    slideNumber: 8,
    type: "pillars",
    title: "60 Posts Across 6 Pillars",
    pillars: [
      { number: 1, name: "Bitcoin & Macro", count: 10, topics: "Fed policy, cycles, store of value" },
      { number: 2, name: "DeFi & On-Chain", count: 10, topics: "Protocols, yield, smart money" },
      { number: 3, name: "AI & Crypto", count: 10, topics: "AI tokens, agents, infrastructure" },
      { number: 4, name: "Geopolitics & Bitcoin", count: 10, topics: "Nation-states, reserves, Hormuz" },
      { number: 5, name: "Legislation & Regulation", count: 10, topics: "SEC/CFTC, bills, compliance" },
      { number: 6, name: "Institutional Adoption", count: 10, topics: "ETFs, treasuries, Wall Street" },
    ],
  },
  {
    slideNumber: 9,
    type: "formula",
    title: "The High-CTR Post Formula",
    lines: [
      { line: "LINE 1 (Hook)", description: "Bold claim or contrarian statement", example: "Most people have no idea what just happened to crypto." },
      { line: "LINE 2–3 (Context)", description: "The setup — what changed, why it matters", example: "" },
      { line: "LINE 4–5 (Education)", description: "The key insight — what they need to know", example: "" },
      { line: "LINE 6 (CTA)", description: "Call to action driving video views", example: "Watch the 60-second breakdown 👇" },
      { line: "VIDEO", description: "Attached — avatar explains visually", example: "" },
    ],
    note: "Hook = 80% of CTR. Rex A/B tests 3 hook variants per post.",
  },
  {
    slideNumber: 10,
    type: "checklist",
    title: "To Launch in 7 Days",
    checklist: [
      "Approve avatar vibe + name (Nova / Sage / Aria / custom)",
      "Sign up for HeyGen Creator ($29/mo)",
      "Rex generates avatar face concepts (Midjourney)",
      "Rex builds 60-day content calendar",
      "Rex writes batch 1 scripts (posts 1–10)",
      "Test video render — approve quality",
      "Schedule batch 1 to X",
    ],
  },
];

function SlideCard({ slide, index }: { slide: typeof slides[0]; index: number }) {
  const base = "relative bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-8 min-h-[320px] flex flex-col";

  const SlideNum = () => (
    <div className="absolute top-4 right-5 text-xs font-mono text-[#444]">{slide.slideNumber} / {slides.length}</div>
  );

  if (slide.type === "title") {
    return (
      <div className={`${base} items-center justify-center text-center`}>
        <SlideNum />
        <div className="text-xs font-mono tracking-widest uppercase mb-6" style={{ color: ACCENT }}>{(slide as any).tag}</div>
        <h1 className="text-4xl font-bold text-white mb-4">{slide.title}</h1>
        <p className="text-lg text-[#888] max-w-2xl">{(slide as any).subtitle}</p>
      </div>
    );
  }

  if (slide.type === "bullets") {
    return (
      <div className={base}>
        <SlideNum />
        <h2 className="text-2xl font-bold text-white mb-6">{slide.title}</h2>
        <ul className="space-y-3 flex-1">
          {(slide as any).points.map((p: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
              <span className="text-[#ccc] text-base leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (slide.type === "split") {
    const s = slide as any;
    return (
      <div className={base}>
        <SlideNum />
        <h2 className="text-2xl font-bold text-white mb-6">{slide.title}</h2>
        <div className="grid grid-cols-2 gap-6 flex-1">
          {[{ label: s.leftLabel, points: s.leftPoints }, { label: s.rightLabel, points: s.rightPoints }].map((col, ci) => (
            <div key={ci} className="bg-[#161616] border border-[#222] rounded-lg p-5">
              <div className="text-sm font-semibold mb-4" style={{ color: ACCENT }}>{col.label}</div>
              <ul className="space-y-2">
                {col.points.map((p: string, i: number) => (
                  <li key={i} className="text-[#ccc] text-sm flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-[#444]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {s.note && <p className="mt-4 text-xs text-[#666] border-t border-[#1e1e1e] pt-3">{s.note}</p>}
      </div>
    );
  }

  if (slide.type === "steps") {
    return (
      <div className={base}>
        <SlideNum />
        <h2 className="text-2xl font-bold text-white mb-6">{slide.title}</h2>
        <ol className="space-y-3 flex-1">
          {(slide as any).steps.map((step: string, i: number) => (
            <li key={i} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-black" style={{ background: ACCENT }}>{i + 1}</span>
              <span className="text-[#ccc] text-sm leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (slide.type === "table") {
    const s = slide as any;
    return (
      <div className={base}>
        <SlideNum />
        <h2 className="text-2xl font-bold text-white mb-6">{slide.title}</h2>
        <div className="flex-1 overflow-hidden rounded-lg border border-[#222]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left px-4 py-2.5 text-[#666] font-medium">Component</th>
                <th className="text-left px-4 py-2.5 text-[#666] font-medium">Tool</th>
                <th className="text-right px-4 py-2.5 text-[#666] font-medium">Cost / Video</th>
              </tr>
            </thead>
            <tbody>
              {s.rows.map((row: any, i: number) => (
                <tr key={i} className={`border-b border-[#1a1a1a] ${row.highlight ? "bg-[#161616]" : ""}`}>
                  <td className={`px-4 py-2.5 ${row.highlight ? "font-semibold text-white" : "text-[#ccc]"}`}>{row.component}</td>
                  <td className="px-4 py-2.5 text-[#666] text-xs">{row.tool}</td>
                  <td className={`px-4 py-2.5 text-right font-mono ${row.highlight ? "font-bold" : ""}`} style={{ color: row.highlight ? ACCENT : "#aaa" }}>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {s.note && <p className="mt-3 text-xs text-[#555]">{s.note}</p>}
      </div>
    );
  }

  if (slide.type === "budget") {
    const s = slide as any;
    return (
      <div className={base}>
        <SlideNum />
        <h2 className="text-2xl font-bold text-white mb-6">{slide.title}</h2>
        <div className="space-y-3 flex-1">
          {s.items.map((item: any, i: number) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${item.highlight ? "border-orange-500/30 bg-orange-500/5" : "border-[#1e1e1e] bg-[#161616]"}`}>
              <div>
                <span className={`text-sm font-medium ${item.highlight ? "text-white" : "text-[#ccc]"}`}>{item.label}</span>
                {item.note && <span className="text-xs text-[#555] ml-2">{item.note}</span>}
              </div>
              <span className={`font-mono font-bold text-sm ${item.highlight ? "" : "text-[#aaa]"}`} style={{ color: item.highlight ? ACCENT : undefined }}>{item.cost}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#1e1e1e] text-xs text-[#555]">
          vs. <span className="text-[#e55]">{s.compare}</span>
        </div>
      </div>
    );
  }

  if (slide.type === "pillars") {
    return (
      <div className={base}>
        <SlideNum />
        <h2 className="text-2xl font-bold text-white mb-6">{slide.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
          {(slide as any).pillars.map((p: any) => (
            <div key={p.number} className="bg-[#161616] border border-[#222] rounded-lg p-4">
              <div className="text-xs font-mono mb-1" style={{ color: ACCENT }}>PILLAR {p.number} · {p.count} POSTS</div>
              <div className="text-sm font-semibold text-white mb-1">{p.name}</div>
              <div className="text-xs text-[#666]">{p.topics}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === "formula") {
    const s = slide as any;
    return (
      <div className={base}>
        <SlideNum />
        <h2 className="text-2xl font-bold text-white mb-6">{slide.title}</h2>
        <div className="space-y-3 flex-1">
          {s.lines.map((l: any, i: number) => (
            <div key={i} className="flex items-start gap-4 bg-[#161616] border border-[#1e1e1e] rounded-lg px-4 py-3">
              <span className="text-xs font-mono font-bold flex-shrink-0 pt-0.5" style={{ color: ACCENT, minWidth: 120 }}>{l.line}</span>
              <div>
                <div className="text-sm text-[#ccc]">{l.description}</div>
                {l.example && <div className="text-xs text-[#666] mt-1 italic">"{l.example}"</div>}
              </div>
            </div>
          ))}
        </div>
        {s.note && <p className="mt-3 text-xs text-[#555] border-t border-[#1e1e1e] pt-3">{s.note}</p>}
      </div>
    );
  }

  if (slide.type === "checklist") {
    return (
      <div className={base}>
        <SlideNum />
        <h2 className="text-2xl font-bold text-white mb-6">{slide.title}</h2>
        <ul className="space-y-3 flex-1">
          {(slide as any).checklist.map((item: string, i: number) => (
            <li key={i} className="flex items-center gap-3 bg-[#161616] border border-[#1e1e1e] rounded-lg px-4 py-3">
              <span className="w-4 h-4 rounded border border-[#444] flex-shrink-0" />
              <span className="text-[#ccc] text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

export default function DcAiPipelineDeck() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back */}
        <Link href="/decks" className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-white mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Decks
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: ACCENT }}>Discover Crypto · March 2026</div>
          <h1 className="text-3xl font-bold text-white mb-2">DC AI Content Pipeline</h1>
          <p className="text-[#666]">60-Day X Education Strategy — AI Avatar + Video Production Plan</p>
        </div>

        {/* Slides */}
        <div className="space-y-6">
          {slides.map((slide, i) => (
            <SlideCard key={i} slide={slide} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[#1e1e1e] text-center text-xs text-[#444]">
          Discover Crypto · Internal Strategy · March 2026 · Built by Rex
        </div>
      </div>
    </div>
  );
}
