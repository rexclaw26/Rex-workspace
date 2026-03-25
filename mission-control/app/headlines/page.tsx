"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import PriceTicker from "@/components/prices/PriceTicker";
import {
  RefreshCw, Twitter, Youtube, CheckCircle2,
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
  BookOpen, Newspaper, AlertCircle, Eye,
} from "lucide-react";
import type { MarketReportData } from "@/app/api/marketreport/route";
import type { AssetPrice } from "@/app/api/prices/route";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ConvexHeadline {
  _id: string;
  title: string;
  url: string;
  description: string;
  source: string;
  category: string;
  sentiment: string;
  pubDate: number;
  fetchedAt: number;
  relevance?: number; // 0–10 impact score
  tier?: number;      // 1 | 2 | 3
}

// ── Style maps ────────────────────────────────────────────────────────────────

// Category colors mapped to Kelly's niche list
// Tier 1: bright/saturated | Tier 2: medium | Tier 3: muted
const CATEGORY_STYLE: Record<string, string> = {
  // ── Tier 1 ─────────────────────────────────────────────────────────────
  "Bitcoin":       "bg-orange-500/20 text-orange-400 border-orange-500/35",
  "Bitcoin ETF":   "bg-amber-500/20 text-amber-300 border-amber-500/35",
  "Gold":          "bg-yellow-500/20 text-yellow-300 border-yellow-500/35",
  "Macro":         "bg-red-500/15 text-red-300 border-red-400/30",
  "Institutional": "bg-purple-500/20 text-purple-300 border-purple-500/35",
  // ── Tier 2 ─────────────────────────────────────────────────────────────
  "Ethereum":      "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Silver":        "bg-slate-400/15 text-slate-300 border-slate-400/25",
  "Legislation":   "bg-violet-500/15 text-violet-300 border-violet-400/25",
  "Geopolitical":  "bg-rose-500/15 text-rose-300 border-rose-400/25",
  "Solana":        "bg-green-500/15 text-green-400 border-green-500/25",
  "Coinbase":      "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  // ── Tier 3 ─────────────────────────────────────────────────────────────
  "Altcoins":      "bg-pink-500/12 text-pink-400 border-pink-500/20",
  "DeFi":          "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
  "Hyperliquid":   "bg-indigo-500/12 text-indigo-400 border-indigo-500/20",
  "AI / Tech":     "bg-teal-500/12 text-teal-400 border-teal-500/20",
  "Whale Activity":"bg-fuchsia-500/12 text-fuchsia-400 border-fuchsia-500/20",
  "Markets":       "bg-slate-500/10 text-slate-400 border-slate-500/18",
  // ── Default ────────────────────────────────────────────────────────────
  default:         "bg-slate-500/12 text-slate-400 border-slate-500/20",
};

function getCategoryStyle(cat: string): string {
  return CATEGORY_STYLE[cat] ?? CATEGORY_STYLE.default;
}

// ── Relative time ─────────────────────────────────────────────────────────────

function relTime(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function fmtTime(ms: number): string {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// ── Mobile detection ──────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ── Mobile section type ───────────────────────────────────────────────────────
type HeadlineMobileSection = "prices" | "insights" | "watching" | "stories" | null;

// ── Mobile accordion button ───────────────────────────────────────────────────
function MobileAccordionButton({
  label, active, count, onClick,
}: {
  label: string; active: boolean; count?: number; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
      style={{
        background:    active ? "rgba(249,115,22,0.1)"  : "rgba(255,255,255,0.03)",
        border:        `1px solid ${active ? "rgba(249,115,22,0.4)" : "var(--border-subtle)"}`,
        color:         active ? "var(--orange)" : "var(--text-muted)",
        fontFamily:    "var(--font-display)",
        fontSize:      "12px",
        fontWeight:    700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor:        "pointer",
      }}
    >
      <span>{label}</span>
      <div className="flex items-center gap-2">
        {count !== undefined && count > 0 && (
          <span style={{
            fontSize: "10px", fontFamily: "var(--font-data)",
            background: active ? "rgba(249,115,22,0.18)" : "rgba(255,255,255,0.06)",
            color: active ? "var(--orange)" : "var(--text-muted)",
            padding: "2px 8px", borderRadius: "9999px",
          }}>
            {count}
          </span>
        )}
        {active ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </div>
    </button>
  );
}

// ── Mobile price list ─────────────────────────────────────────────────────────
function fmtMobilePrice(price: number): string {
  if (price === 0) return "—";
  if (price >= 10000) return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1000)  return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (price >= 1)     return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function MobilePriceList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [prices, setPrices]   = useState<AssetPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPrices = useCallback(async () => {
    try {
      const res  = await fetch("/api/prices");
      const data = await res.json();
      if (data.ok && data.prices?.length > 0) setPrices(data.prices);
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchPrices(); }, [fetchPrices, refreshTrigger]);

  if (loading) return (
    <div className="mc-card p-4">
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg animate-pulse"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ width: 32, height: 12, borderRadius: 4, background: "rgba(255,255,255,0.07)" }} />
            <div style={{ width: 52, height: 12, borderRadius: 4, background: "rgba(255,255,255,0.05)" }} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mc-card p-3">
      <div className="grid grid-cols-2 gap-2">
        {prices.map((asset) => (
          <div key={asset.symbol}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: "var(--orange)", letterSpacing: "0.05em" }}>
              {asset.symbol}
            </span>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
              {fmtMobilePrice(asset.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cron Health Indicator ─────────────────────────────────────────────────────
// Shows last successful RSS fetch time with color-coded freshness:
//   Green  = synced within 20 min (healthy)
//   Yellow = synced 20–60 min ago (slightly stale)
//   Red    = synced > 60 min ago or never (stale / error)

function CronStatus({ lastFetchedAt }: { lastFetchedAt: number | null | undefined }) {
  if (lastFetchedAt === undefined) return null; // still loading from Convex
  if (!lastFetchedAt) {
    return (
      <div className="flex items-center gap-1.5">
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--red)", flexShrink: 0 }} />
        <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
          No feed data
        </span>
      </div>
    );
  }
  const mins = Math.floor((Date.now() - lastFetchedAt) / 60000);
  const color = mins < 20 ? "var(--green)" : mins < 60 ? "var(--amber)" : "var(--red)";
  const label = mins < 1 ? "synced just now"
    : mins < 60 ? `synced ${mins}m ago`
    : `synced ${Math.floor(mins / 60)}h ago`;
  return (
    <div className="flex items-center gap-1.5">
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
        {label}
      </span>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const toast = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 4000); };
  return { msg, toast };
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function HeadlinesPage() {
  const isMobile = useIsMobile();

  const [refreshing, setRefreshing] = useState(false);
  const [fetchResult, setFetchResult] = useState<{ inserted: number; errors: string[] } | null>(null);
  const [taskStatus, setTaskStatus] = useState<Record<string, "idle" | "sent">>({});
  const [marketNotes, setMarketNotes] = useState<string | null>(null);
  const [marketReport, setMarketReport] = useState<MarketReportData | null>(null);
  const [diOpen, setDiOpen] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);
  const [priceRefresh, setPriceRefresh] = useState(0);
  const { msg: toastMsg, toast } = useToast();

  // Mobile accordion — one section open at a time
  const [mobileOpen, setMobileOpen] = useState<HeadlineMobileSection>(null);
  const toggleSection = useCallback((s: HeadlineMobileSection) => {
    setMobileOpen((prev) => (prev === s ? null : s));
  }, []);

  // Fetch today's market report sections (intro, pulse, watching)
  useEffect(() => {
    fetch("/api/marketreport")
      .then((r) => r.json())
      .then((d) => { if (d.ok) setMarketReport(d); })
      .catch(() => {});
  }, []);

  const createTask = useMutation(api.tasks.create);

  // Live Convex queries — updates in real time as cron inserts new headlines
  const headlines = useQuery(api.headlines.getRecent, { limit: 25 }) ?? [];
  const lastFetchedAt = useQuery(api.headlines.getLastFetchedAt, {});
  const knowledgeDoc = useQuery(api.headlines.getKnowledge, { key: "marketnotes" });

  // Load marketnotes content from Convex knowledge base
  useEffect(() => {
    if (knowledgeDoc?.content) {
      setMarketNotes(knowledgeDoc.content);
    }
  }, [knowledgeDoc]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setFetchResult(null);
    setPriceRefresh((n) => n + 1); // force PriceTicker to re-fetch immediately
    try {
      const res = await fetch("/api/headlines/fetch", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setFetchResult({ inserted: data.inserted, errors: data.errors ?? [] });
        const msg = data.inserted > 0
          ? `✓ ${data.inserted} new headlines added${data.marketNotes === "synced" ? " · Market notes synced" : ""}`
          : `✓ Headlines current — no new stories${data.marketNotes === "synced" ? " · Market notes synced" : ""}`;
        toast(msg);
        if (data.errors?.length > 0) {
          console.warn("RSS fetch errors:", data.errors);
        }
      } else {
        toast(`✗ Update failed: ${data.error}`);
      }
    } catch (e: any) {
      toast(`✗ Network error: ${e.message}`);
    } finally {
      setRefreshing(false);
    }
  }, [toast]);

  // Auto-fetch on first load if no headlines exist yet
  useEffect(() => {
    if (headlines !== undefined && headlines.length === 0) {
      handleRefresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headlines === undefined]);

  const handleXPost = async (hl: ConvexHeadline) => {
    const key = `xpost-${hl._id}`;
    // Optimistic UI — button goes green immediately
    setTaskStatus((p) => ({ ...p, [key]: "sent" }));
    toast("⏳ Generating 3 X post versions → Telegram...");
    try {
      const res = await fetch("/api/headline-xpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: hl }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Unknown error");
      toast("✓ 3 X post versions sent to Telegram");
    } catch (e: any) {
      // Revert optimistic update on failure
      setTaskStatus((p) => ({ ...p, [key]: "idle" }));
      toast(`✗ X Post failed: ${e.message}`);
    }
  };

  const handleYTScript = async (hl: ConvexHeadline) => {
    const key = `yt-${hl._id}`;
    try {
      await createTask({
        title: `YT Script: ${hl.title.slice(0, 80)}`,
        description:
          `Write a 5–7 minute YouTube script for Discover Crypto.\n\n` +
          `HEADLINE: ${hl.title}\n` +
          `SOURCE: ${hl.source} | PUBLISHED: ${new Date(hl.pubDate).toLocaleString()}\n` +
          `URL: ${hl.url}\n\n` +
          `ARTICLE SUMMARY: ${hl.description}\n\n` +
          `INSTRUCTIONS:\n` +
          `- Target 700–1,000 words (5–7 min speaking pace)\n` +
          `- Reference ONLY verifiable facts from the article and Rex's knowledge base\n` +
          `- Draw historical context from marketnotes.md and prior market reports when relevant\n` +
          `- Structure: Hook (30s) → Context (60s) → Main Analysis (3–4 min) → Takeaway + CTA (30–60s)\n` +
          `- Tone: conversational, confident, educational — not hype, no speculation presented as fact\n` +
          `- Apply Humanization Framework throughout\n` +
          `- Include B-roll notes and on-screen text suggestions\n` +
          `- Email completed script to kelly@bitlabacademy.com\n` +
          `- Subject: "YT Script: ${hl.title.slice(0, 60)}"\n` +
          `- CC: rex@hitnetwork.io`,
        skill: "article-writing",
        skillCode: "article",
        agentCodename: "Rex",
        priority: "high",
        status: "todo",
        notes: `Delivery: kelly@bitlabacademy.com | Category: ${hl.category} | pubDate: ${hl.pubDate}`,
      });
      setTaskStatus((p) => ({ ...p, [key]: "sent" }));
      toast("✓ YT Script queued — Rex will email kelly@bitlabacademy.com when complete");
    } catch (e: any) {
      toast(`✗ ${e.message}`);
    }
  };

  // ── Loading state ──────────────────────────────────────

  const isLoading = headlines === undefined;

  return (
    <div className="p-6 space-y-5 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-lg mb-0.5">Headlines</h1>
          <p className="text-label">Real Time News &amp; Discover Crypto Insights</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <CronStatus lastFetchedAt={lastFetchedAt} />
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all"
            style={{
              background: refreshing ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.07)",
              borderColor: "rgba(249,115,22,0.35)",
              color: "var(--orange)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
              boxShadow: refreshing ? "0 0 14px rgba(249,115,22,0.2)" : "none",
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Updating..." : "Update Data"}
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          DESKTOP LAYOUT — full price ticker, DI panel, headlines list
      ════════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <>
          <PriceTicker refreshTrigger={priceRefresh} />

          {marketReport && (
            <>
              <div className={!diOpen && !watchOpen ? "flex gap-3 items-stretch" : ""}>
                <div className={!diOpen && !watchOpen ? "flex-1 min-w-0" : ""}>
                  <DailyInsightCard report={marketReport} open={diOpen} onToggle={() => setDiOpen((v) => !v)} />
                </div>
                {!diOpen && !watchOpen && marketReport.watching.length > 0 && (
                  <div style={{ width: "280px", flexShrink: 0 }}>
                    <WatchingPanel items={marketReport.watching} date={marketReport.date} open={false} onToggle={() => setWatchOpen(true)} />
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ display: "flow-root" }}>
            {(diOpen || watchOpen) && marketReport && marketReport.watching.length > 0 && (
              <div style={{ float: "right", width: "300px", marginLeft: "20px", marginBottom: "8px" }}>
                <WatchingPanel items={marketReport.watching} date={marketReport.date} open={watchOpen} onToggle={() => setWatchOpen((v) => !v)} />
              </div>
            )}
            <div className="space-y-3">
              {fetchResult?.errors && fetchResult.errors.length > 0 && (
                <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-400 mb-0.5">Some sources unavailable:</p>
                    {fetchResult.errors.map((e, i) => <p key={i} className="text-[11px] text-red-400/70">{e}</p>)}
                  </div>
                </div>
              )}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin" style={{ color: "var(--orange)" }} />
                  <p className="text-label">Loading headlines from Convex...</p>
                </div>
              )}
              {!isLoading && headlines.length === 0 && !refreshing && (
                <div className="mc-card p-12 text-center">
                  <Newspaper className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                  <p className="font-semibold mb-1" style={{ color: "var(--text-taupe)" }}>No headlines yet</p>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Click "Update Headlines" to fetch the latest stories.</p>
                  <button onClick={handleRefresh} className="btn-launch">Fetch Data Now</button>
                </div>
              )}
              {!isLoading && headlines.length > 0 && (
                <>
                  <p className="text-label">{headlines.length} stories · sorted by publish time</p>
                  {(headlines as ConvexHeadline[]).map((hl) => (
                    <HeadlineCard key={hl._id} headline={hl} marketNotes={marketNotes}
                      xStatus={taskStatus[`xpost-${hl._id}`] ?? "idle"}
                      ytStatus={taskStatus[`yt-${hl._id}`] ?? "idle"}
                      onXPost={() => handleXPost(hl)} onYTScript={() => handleYTScript(hl)} />
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════
          MOBILE LAYOUT — accordion, one section open at a time
      ════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div className="space-y-2">

          {/* PRICES */}
          <MobileAccordionButton label="PRICES" active={mobileOpen === "prices"} onClick={() => toggleSection("prices")} />
          {mobileOpen === "prices" && <MobilePriceList refreshTrigger={priceRefresh} />}

          {/* DAILY INSIGHTS */}
          {marketReport && (
            <>
              <MobileAccordionButton label="Daily Insights" active={mobileOpen === "insights"} onClick={() => toggleSection("insights")} />
              {mobileOpen === "insights" && (
                <div className="mc-card p-4 space-y-4" style={{ borderColor: "rgba(249,115,22,0.2)" }}>
                  {marketReport.intro && (
                    <p style={{ color: "var(--text-primary)", fontSize: "13px", lineHeight: "1.75" }}>
                      {marketReport.intro}
                    </p>
                  )}
                  {marketReport.marketPulse && (
                    <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Market Pulse
                      </p>
                      <p style={{ color: "var(--text-taupe)", fontSize: "13px", lineHeight: "1.75" }}>
                        {marketReport.marketPulse}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* WATCHING */}
          {marketReport && marketReport.watching.length > 0 && (
            <>
              <MobileAccordionButton label="Watching" active={mobileOpen === "watching"} count={marketReport.watching.length} onClick={() => toggleSection("watching")} />
              {mobileOpen === "watching" && (
                <div className="mc-card overflow-hidden">
                  {marketReport.watching.map((item, i) => (
                    <div key={i} className="px-4 py-3" style={i > 0 ? { borderTop: "1px solid var(--border-subtle)" } : {}}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.03em", marginBottom: "4px" }}>
                        {item.title}
                      </p>
                      <p style={{ color: "var(--text-muted)", fontSize: "11.5px", lineHeight: "1.6" }}>
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STORIES */}
          <MobileAccordionButton label="Stories" active={mobileOpen === "stories"} count={isLoading ? undefined : headlines.length} onClick={() => toggleSection("stories")} />
          {mobileOpen === "stories" && (
            <div className="space-y-3">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin" style={{ color: "var(--orange)" }} />
                  <p className="text-label">Loading…</p>
                </div>
              )}
              {!isLoading && headlines.length === 0 && (
                <div className="mc-card p-8 text-center">
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No stories yet — tap Update Data</p>
                </div>
              )}
              {!isLoading && (headlines as ConvexHeadline[]).map((hl) => (
                <HeadlineCard key={hl._id} headline={hl} marketNotes={marketNotes}
                  xStatus={taskStatus[`xpost-${hl._id}`] ?? "idle"}
                  ytStatus={taskStatus[`yt-${hl._id}`] ?? "idle"}
                  onXPost={() => handleXPost(hl)} onYTScript={() => handleYTScript(hl)}
                  isMobile />
              ))}
            </div>
          )}

        </div>
      )}

      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl animate-fade-up"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid rgba(249,115,22,0.35)",
            color: "var(--text-primary)",
            fontSize: "13px",
            maxWidth: "460px",
            boxShadow: "0 0 30px rgba(249,115,22,0.12), 0 8px 32px rgba(0,0,0,0.55)",
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}

// ── Daily Insight Card ────────────────────────────────────────────────────────
function DailyInsightCard({
  report, open, onToggle,
}: {
  report: MarketReportData;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="mc-card overflow-hidden"
      style={{ borderColor: "rgba(249,115,22,0.2)" }}
    >
      {/* Header row — always visible, click to toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-5 py-4 transition-colors"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <BookOpen className="w-4 h-4 shrink-0" style={{ color: "var(--orange)" }} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--text-orange)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Daily Insight
        </span>
        <span
          className="text-[10px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}
        >
          {report.date}
        </span>
        {!open && report.intro && (
          <span
            className="flex-1 truncate text-[11px] ml-2"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
          >
            {report.intro.slice(0, 90)}…
          </span>
        )}
        <span className="ml-auto shrink-0" style={{ color: "var(--text-muted)" }}>
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-5 space-y-4 animate-fade-up" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {/* Intro paragraph */}
          {report.intro && (
            <p style={{ color: "var(--text-primary)", fontSize: "13.5px", lineHeight: "1.75", paddingTop: "14px" }}>
              {report.intro}
            </p>
          )}

          {/* Market Pulse */}
          {report.marketPulse && (
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
              <p
                className="mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Market Pulse
              </p>
              <p style={{ color: "var(--text-taupe)", fontSize: "13px", lineHeight: "1.75" }}>
                {report.marketPulse}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── What We're Watching Panel ─────────────────────────────────────────────────
function WatchingPanel({
  items, date, open, onToggle,
}: {
  items: { title: string; body: string }[];
  date: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mc-card overflow-hidden">
      {/* Header — always visible, click to toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-5 py-4 transition-colors"
        style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <Eye className="w-4 h-4 shrink-0" style={{ color: "var(--orange)" }} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--text-orange)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          What We&apos;re Watching
        </span>
        <span
          className="text-[10px] ml-1"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}
        >
          {items.length}
        </span>
        <span className="ml-auto shrink-0" style={{ color: "var(--text-muted)" }}>
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>

      {/* Items — only shown when expanded */}
      {open && (
        <div className="animate-fade-up" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {items.map((item, i) => (
            <div key={i} className="px-5 py-4" style={i > 0 ? { borderTop: "1px solid var(--border-subtle)" } : {}}>
              <p
                className="mb-1.5"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "0.03em",
                }}
              >
                {item.title}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "11.5px", lineHeight: "1.65" }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Headline Card ─────────────────────────────────────────────────────────────

function HeadlineCard({
  headline: hl,
  marketNotes,
  xStatus,
  ytStatus,
  onXPost,
  onYTScript,
  isMobile = false,
}: {
  headline: ConvexHeadline;
  marketNotes: string | null;
  xStatus: "idle" | "sent";
  ytStatus: "idle" | "sent";
  onXPost: () => void;
  onYTScript: () => void;
  isMobile?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const context: ContextResult | null = expanded ? extractRelevantContext(marketNotes, hl) : null;

  const sentimentIcon =
    hl.sentiment === "bullish" ? <TrendingUp  className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />
    : hl.sentiment === "bearish" ? <TrendingDown className="w-3.5 h-3.5" style={{ color: "var(--red)" }} />
    : <Minus className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />;

  const sentimentBg =
    hl.sentiment === "bullish" ? "rgba(34,197,94,0.1)" :
    hl.sentiment === "bearish" ? "rgba(239,68,68,0.1)" :
    "rgba(148,163,184,0.08)";

  const sentimentBorder =
    hl.sentiment === "bullish" ? "rgba(34,197,94,0.2)" :
    hl.sentiment === "bearish" ? "rgba(239,68,68,0.2)" :
    "rgba(148,163,184,0.15)";

  const sentimentColor =
    hl.sentiment === "bullish" ? "var(--green)" :
    hl.sentiment === "bearish" ? "var(--red)" :
    "var(--text-muted)";

  return (
    <div className="mc-card overflow-hidden">
      <div className={isMobile ? "p-4" : "p-5"}>
        <div className="flex items-start gap-4">

          {/* Sentiment icon */}
          <div
            className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: sentimentBg, border: `1px solid ${sentimentBorder}` }}
          >
            {sentimentIcon}
          </div>

          {/* Content — always full-width on mobile (no button column alongside) */}
          <div className="flex-1 min-w-0 space-y-2">
            <a
              href={hl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold leading-snug hover:underline block"
              style={{ color: "var(--text-primary)", fontSize: isMobile ? "13px" : "14px", textDecoration: "none" }}
            >
              {hl.title}
            </a>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border tracking-wide ${getCategoryStyle(hl.category)}`}
                style={{ fontFamily: "var(--font-data)" }}
              >
                {hl.category}
              </span>
              <span className="text-label">{hl.source}</span>
              <span className="text-label">·</span>
              <span className="text-label" title={new Date(hl.pubDate).toLocaleString()}>
                {relTime(hl.pubDate)}
              </span>
              <span className="text-[10px] font-bold" style={{ color: sentimentColor, fontFamily: "var(--font-data)" }}>
                {hl.sentiment.toUpperCase()}
              </span>
            </div>

            {/* Description — 2-line clamp collapsed, full when Deeper Insight open */}
            {hl.description && hl.description.length > 5 && (
              <p style={{
                color: "var(--text-taupe)", fontSize: "12.5px", lineHeight: "1.65",
                ...(expanded ? {} : {
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }),
              }}>
                {hl.description}
              </p>
            )}

            {/* Deeper Insight toggle */}
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1.5 transition-colors mt-1"
              style={{
                color: expanded ? "var(--orange)" : "var(--text-muted)",
                fontSize: "11px", fontFamily: "var(--font-data)", letterSpacing: "0.04em",
                background: "none", border: "none", padding: 0, cursor: "pointer",
              }}
            >
              <BookOpen className="w-3 h-3" />
              {expanded ? "Close" : "Deeper Insight"}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Action buttons — desktop only (right column) */}
          {!isMobile && (
            <div className="flex flex-col gap-2 shrink-0 ml-2">
              <ActionBtn icon={<Twitter className="w-3 h-3" />} label="X Post"    sent={xStatus === "sent"}  sentLabel="Sent"   onClick={onXPost}   color="orange" />
              <ActionBtn icon={<Youtube className="w-3 h-3" />} label="YT Script" sent={ytStatus === "sent"} sentLabel="Queued" onClick={onYTScript} color="indigo" />
            </div>
          )}
        </div>

        {/* Action buttons — mobile only (bottom row, full width) */}
        {isMobile && (
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <ActionBtn icon={<Twitter className="w-3 h-3" />} label="X Post"    sent={xStatus === "sent"}  sentLabel="Sent"   onClick={onXPost}   color="orange" fullWidth />
            <ActionBtn icon={<Youtube className="w-3 h-3" />} label="YT Script" sent={ytStatus === "sent"} sentLabel="Queued" onClick={onYTScript} color="indigo" fullWidth />
          </div>
        )}
      </div>

      {/* ── Deep Dive ──────────────────────────────────────────────── */}
      {expanded && (
        <div
          className="px-5 pb-5 animate-fade-up"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="mt-4 space-y-3">

            {/* Article source / link row */}
            <div className="flex items-center gap-2 px-1">
              <Newspaper className="w-3 h-3 shrink-0" style={{ color: "var(--text-muted)" }} />
              <span className="text-label">
                {hl.source} · {new Date(hl.pubDate).toLocaleString()} ·{" "}
                <a
                  href={hl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "var(--orange)" }}
                >
                  Read full article ↗
                </a>
              </span>
            </div>

            {/* Market Notes context — date-matched section from Kelly's market-notes.md */}
            {context ? (
              <div
                className="p-4 rounded-xl"
                style={{
                  background: context.isNewer ? "rgba(99,102,241,0.04)" : "rgba(249,115,22,0.04)",
                  border: context.isNewer ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(249,115,22,0.15)",
                }}
              >
                {/* Header row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <BookOpen className="w-3 h-3 shrink-0" style={{ color: context.isNewer ? "#818CF8" : "var(--orange)" }} />
                  <span
                    style={{
                      color: context.isNewer ? "#818CF8" : "var(--orange)",
                      fontSize: "10px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Discover Crypto Insights · {context.sectionDate}
                    {context.subsection ? ` · ${context.subsection}` : ""}
                  </span>
                  {context.isNewer && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                      style={{ background: "rgba(99,102,241,0.12)", color: "#818CF8", fontFamily: "var(--font-data)" }}>
                      LATER CONTEXT
                    </span>
                  )}
                  {context.isCurrentDay && !context.isNewer && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                      style={{ background: "rgba(34,197,94,0.1)", color: "var(--green)", fontFamily: "var(--font-data)" }}>
                      SAME-DAY
                    </span>
                  )}
                </div>
                {/* Section title from the ## header */}
                {context.sectionHeadline && (
                  <p className="mb-2 text-[11px]"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)", fontStyle: "italic" }}>
                    {context.sectionHeadline}
                  </p>
                )}
                <InsightLines content={context.content} accent={context.isNewer ? "#818CF8" : "var(--orange)"} />
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}
              >
                <BookOpen className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                <p className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                  No market notes for {new Date(hl.pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} —
                  {" "}email market-notes.md to rex@hitnetwork.io to add depth here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Market notes context result type ─────────────────────────────────────────

interface ContextResult {
  content: string;
  sectionDate: string;       // YYYY-MM-DD of the market notes section used
  sectionHeadline: string;   // text after the dash in the ## header
  dataTimestamp: number;     // epoch ms (midnight UTC of sectionDate)
  isCurrentDay: boolean;     // notes section date === headline publish date
  isNewer: boolean;          // notes section is from a LATER date than the headline
  subsection: string | null; // which subsection was matched (e.g. "Crypto", "Macro")
}

// ── Extract context — date-first, category-second matching ────────────────────
// 1. Parse market-notes.md into ## YYYY-MM-DD sections
// 2. Find the section whose date best matches the headline's pubDate
// 3. Within that section, find the subsection matching the headline category
// 4. Returns a ContextResult with metadata so UI can label timing correctly
function extractRelevantContext(marketnotes: string | null, headline: ConvexHeadline): ContextResult | null {
  if (!marketnotes || marketnotes.trim().length < 100) return null;

  const headlineDate = new Date(headline.pubDate).toISOString().split("T")[0]; // YYYY-MM-DD

  // ── Parse all date sections ──────────────────────────────────────────────
  const DATE_SECTION_RE = /^## (\d{4}-\d{2}-\d{2})\s*[—–-]\s*(.*)/;
  const lines = marketnotes.split("\n");

  const sections: Array<{
    date: string;
    sectionHeadline: string;
    dataTimestamp: number;
    content: string;
  }> = [];

  let currentDate: string | null = null;
  let currentSectionHeadline = "";
  let currentLines: string[] = [];

  const flush = () => {
    if (!currentDate || currentLines.join("").trim().length < 50) return;
    const [year, month, day] = currentDate.split("-").map(Number);
    sections.push({
      date: currentDate,
      sectionHeadline: currentSectionHeadline,
      dataTimestamp: Date.UTC(year, month - 1, day),
      content: currentLines.join("\n").trim(),
    });
  };

  for (const line of lines) {
    const m = line.match(DATE_SECTION_RE);
    if (m) {
      flush();
      currentDate = m[1];
      currentSectionHeadline = m[2].trim();
      currentLines = [line];
    } else if (currentDate) {
      currentLines.push(line);
    }
  }
  flush();

  if (sections.length === 0) return null;

  // ── Find best matching section ───────────────────────────────────────────
  // Priority: exact date > most recent section on/before headline date > newest overall
  const matched =
    sections.find((s) => s.date === headlineDate) ||
    sections
      .filter((s) => s.date <= headlineDate)
      .sort((a, b) => b.date.localeCompare(a.date))[0] ||
    sections[0];

  if (!matched) return null;

  // ── Category → subsection header mapping ────────────────────────────────
  // Primary: rex-notes.md section names (Rex's canonical format)
  // Fallback: Kelly's raw market-notes.md section names (older entries)
  const categorySubsections: Record<string, string[]> = {
    "Bitcoin":        ["### BITCOIN",       "### INSTITUTIONAL", "### KEY_NARRATIVE",
                       "### Crypto",        "### On-Chain & Mining", "### Key Narrative"],
    "Bitcoin ETF":    ["### BITCOIN",       "### INSTITUTIONAL", "### KEY_NARRATIVE",
                       "### Crypto",        "### Institutional & Regulatory"],
    "Gold":           ["### MACRO",         "### KEY_NARRATIVE",
                       "### Commodities",   "### Macro Environment"],
    "Macro":          ["### MACRO",         "### KEY_NARRATIVE",
                       "### Macro Environment", "### Equities", "### Commodities"],
    "Institutional":  ["### INSTITUTIONAL", "### BITCOIN",       "### KEY_NARRATIVE",
                       "### Institutional & Regulatory"],
    "Ethereum":       ["### ETHEREUM",      "### INSTITUTIONAL", "### KEY_NARRATIVE",
                       "### Crypto",        "### Institutional & Regulatory"],
    "Silver":         ["### MACRO",         "### KEY_NARRATIVE",
                       "### Commodities",   "### Macro Environment"],
    "Legislation":    ["### POLICY",        "### INSTITUTIONAL", "### KEY_NARRATIVE",
                       "### Institutional & Regulatory"],
    "Geopolitical":   ["### MACRO",         "### KEY_NARRATIVE",
                       "### Macro Environment"],
    "Solana":         ["### BITCOIN",       "### KEY_NARRATIVE",
                       "### Crypto"],
    "Coinbase":       ["### INSTITUTIONAL", "### BITCOIN",       "### KEY_NARRATIVE",
                       "### Institutional & Regulatory"],
    "Altcoins":       ["### BITCOIN",       "### KEY_NARRATIVE",
                       "### Crypto"],
    "DeFi":           ["### ETHEREUM",      "### KEY_NARRATIVE",
                       "### Crypto",        "### On-Chain & Mining"],
    "Hyperliquid":    ["### BITCOIN",       "### KEY_NARRATIVE",
                       "### Crypto"],
    "AI / Tech":      ["### MACRO",         "### KEY_NARRATIVE",
                       "### Macro Environment"],
    "Whale Activity": ["### BITCOIN",       "### ETHEREUM",      "### KEY_NARRATIVE",
                       "### On-Chain & Mining"],
    "Markets":        ["### KEY_NARRATIVE", "### BITCOIN",       "### MACRO",
                       "### Crypto",        "### Equities"],
  };

  const subsectionHeaders = categorySubsections[headline.category] || ["### Crypto", "### Key Narrative"];

  // ── Extract raw subsection content ──────────────────────────────────────
  let rawContent = "";
  let matchedSubsection: string | null = null;

  for (const header of subsectionHeaders) {
    const escaped = header.replace(/[/\\.+?^${}()|[\]]/g, "\\$&");
    const subRe = new RegExp(`${escaped}[\\s\\S]*?(?=\\n### |\\n## |$)`, "i");
    const subMatch = matched.content.match(subRe);
    if (subMatch) {
      const sub = subMatch[0].replace(/^### [^\n]+\n/, "").trim();
      if (sub.length > 50) {
        rawContent = sub;
        matchedSubsection = header.replace(/^### /, "");
        break;
      }
    }
  }

  // Fallback to Key Narrative
  if (!rawContent) {
    const narrativeMatch = matched.content.match(/### Key Narrative[\s\S]*?(?=\n### |$)/i);
    if (narrativeMatch) {
      rawContent = narrativeMatch[0].replace(/^### [^\n]+\n/, "").trim();
      matchedSubsection = "Key Narrative";
    }
  }

  if (!rawContent || rawContent.length < 30) return null;

  // ── Strip stale live-price lines ─────────────────────────────────────────
  // Lines like "- BTC $72,459 (+1.10% report) — narrative text" should have the
  // price prefix stripped but the narrative tail kept.
  // Lines that are ONLY a price (no narrative after) are removed entirely.
  //
  // Regex notes:
  //   [^)]* inside the paren group handles variants like "(+1.10% report)" or "(+8.02%)"
  //   STALE_PRICE_PREFIX_RE matches the price portion up to and including the dash separator
  //   STALE_PRICE_ONLY_RE matches lines that are nothing but a price (no narrative)

  const STALE_PRICE_ONLY_RE   = /^[-*•]?\s*[A-Z]{2,6}[\s:]+\$[\d,]+(\.\d+)?\s*\([+-][\d.]+%[^)]*\)\s*$/;
  const STALE_PRICE_PREFIX_RE = /^[-*•]?\s*[A-Z]{2,6}[\s:]+\$[\d,]+(\.\d+)?\s*\([+-][\d.]+%[^)]*\)\s*[—–-]\s*/;

  const allLines = rawContent.split("\n");
  const cleanLines = allLines.flatMap(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 5) return [];
    // Remove snapshot-style key:value lines: "btc: $71,680" or "snapshot_time: ~14:53 UTC"
    if (/^[-*]?\s*(snapshot_time|date|btc|eth|sol|xrp|bnb|link|ada|tao|mstr|dxy|coin|gold|silver|oil|fear_greed|regime|altcoin_season|btc_rsi|snapshot):\s/i.test(trimmed)) return [];
    // Remove raw SNAPSHOT section header lines if they bleed through
    if (/^#+\s*SNAPSHOT\s*$/i.test(trimmed)) return [];
    // Remove lines that are only a stale price (no narrative follows)
    if (STALE_PRICE_ONLY_RE.test(trimmed)) return [];
    // Strip stale price prefix — keep the narrative tail after the dash
    if (STALE_PRICE_PREFIX_RE.test(trimmed)) {
      const narrative = trimmed.replace(STALE_PRICE_PREFIX_RE, "").trim();
      return narrative.length >= 5 ? [narrative] : [];
    }
    return [line];
  });

  // ── Score each line against headline title keywords ──────────────────────
  // Extract meaningful keywords from the headline title (skip common words)
  const STOP_WORDS = new Set(["the","a","an","in","on","at","to","for","of","and","or","is","are","was","were","with","from","by","as","its","it","this","that","new","says","report","amid","after","before","could","would","will","how","why","what","when","who"]);
  const titleKeywords = headline.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));

  // Score each line: +2 per keyword match, +2 for historical/contextual indicators
  const scoredLines = cleanLines.map(line => {
    const l = line.toLowerCase();
    let score = 0;
    for (const kw of titleKeywords) {
      if (l.includes(kw)) score += 2;
    }
    // Bonus: historical patterns ("before", "previously", "signal", "when X happened")
    if (/\b(before|previous|historical|signal|pattern|first time|last time|last |prior |since |when )\b/.test(l)) score += 2;
    // Bonus: specific dates/months = temporal context
    if (/\b(january|february|march|april|may|june|july|august|september|october|november|december|q[1-4]|2024|2025|2026)\b/.test(l)) score += 1;
    // Bonus: numbers with magnitude = institutional/significant
    if (/\$[\d]+[mb]|\b\d+[,.]\d+[mb]|\bbillion|\bmillion\b/.test(l)) score += 1;
    // Small base score for being in the right section
    score += 0.5;
    return { line, score };
  });

  // Sort by score descending, take top 5 most relevant lines
  const topLines = scoredLines
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .sort((a, b) => cleanLines.indexOf(a.line) - cleanLines.indexOf(b.line)) // restore original order
    .map(s => s.line);

  // ── If KEY_NARRATIVE, keep it as flowing text (not bullet-filtered) ──────
  // Narrative paragraphs need full sentences for context — don't chop them
  let extractedContent: string;
  if (matchedSubsection === "Key Narrative" || matchedSubsection === "KEY_NARRATIVE") {
    // Strip price lines only, keep full narrative
    extractedContent = cleanLines.join("\n").trim().slice(0, 700);
  } else {
    extractedContent = topLines.join("\n").trim();
  }

  if (!extractedContent || extractedContent.length < 30) return null;

  return {
    content: extractedContent,
    sectionDate: matched.date,
    sectionHeadline: matched.sectionHeadline,
    dataTimestamp: matched.dataTimestamp,
    isCurrentDay: matched.date === headlineDate,
    isNewer: matched.dataTimestamp > headline.pubDate,
    subsection: matchedSubsection,
  };
}

// ── Insight Lines ─────────────────────────────────────────────────────────────
// Normalizes raw market-notes content into clean bullet lines.
// Strips leading `- `, `* `, `• `, `N. ` markers so display is consistent
// regardless of how Kelly formatted the source entry.

function InsightLines({ content, accent }: { content: string; accent: string }) {
  const lines = content
    .split("\n")
    .map(l => l.trim())
    // Strip common list prefixes: "- ", "* ", "• ", "1. ", "12. " etc.
    .map(l => l.replace(/^[-*•]\s+/, "").replace(/^\d{1,2}\.\s+/, "").trim())
    .filter(l => l.length > 5);

  if (lines.length === 0) return null;

  return (
    <div className="space-y-1.5" style={{ paddingTop: "2px" }}>
      {lines.map((line, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <span
            style={{
              color: accent,
              fontSize: "10px",
              lineHeight: "1.75",
              marginTop: "1px",
              flexShrink: 0,
              opacity: 0.7,
            }}
          >
            ●
          </span>
          <span style={{ color: "var(--text-taupe)", fontSize: "13px", lineHeight: "1.75" }}>
            {line}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Action Button ─────────────────────────────────────────────────────────────

function ActionBtn({
  icon, label, sent, sentLabel, onClick, color, fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  sent: boolean;
  sentLabel: string;
  onClick: () => void;
  color: "orange" | "indigo";
  fullWidth?: boolean;
}) {
  const idle = color === "orange"
    ? { bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.25)", text: "var(--orange)" }
    : { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)", text: "#818CF8" };
  const done = { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)", text: "var(--green)" };
  const s = sent ? done : idle;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={sent}
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        fontFamily: "var(--font-display)",
        letterSpacing: "0.05em",
        minWidth: fullWidth ? 0 : "88px",
        width: fullWidth ? "100%" : undefined,
        cursor: sent ? "default" : "pointer",
        opacity: sent ? 0.85 : 1,
      }}
    >
      {sent ? <CheckCircle2 className="w-3 h-3" /> : icon}
      {sent ? sentLabel : label}
    </button>
  );
}
