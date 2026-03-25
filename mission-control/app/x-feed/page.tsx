"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PriceTicker from "@/components/prices/PriceTicker";
import { RefreshCw, ExternalLink, Twitter, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import type { XTweet, XFeedData } from "@/app/api/x-feed/route";
import type { AssetPrice } from "@/app/api/prices/route";

// ── Relative time ─────────────────────────────────────────────────────────────
function relTime(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Text truncation helpers ───────────────────────────────────────────────────
const MAX_CHARS = 275;

function fullText(text: string): string {
  return text.length <= MAX_CHARS ? text : text.slice(0, MAX_CHARS) + "…";
}

// Generates CSS clamp style for any line count
function clampStyle(lines: number): React.CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

// ── Mobile detection ──────────────────────────────────────────────────────────
// Defaults to false (desktop) on SSR to prevent hydration mismatch.
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
type MobileSection = "prices" | "breaking" | "btcEth" | "macro" | "altcoins" | null;

// ── Mobile accordion button ───────────────────────────────────────────────────
// Full-width toggle button. Active state uses per-section accent color.
// Clicking the active section closes it; clicking a different one opens it.
function MobileAccordionButton({
  label,
  active,
  count,
  onClick,
  accentColor = "var(--orange)",
  activeBg   = "rgba(249,115,22,0.1)",
  activeBorder = "rgba(249,115,22,0.4)",
}: {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
  accentColor?: string;
  activeBg?: string;
  activeBorder?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
      style={{
        background:   active ? activeBg   : "rgba(255,255,255,0.03)",
        border:       `1px solid ${active ? activeBorder : "var(--border-subtle)"}`,
        color:        active ? accentColor : "var(--text-muted)",
        fontFamily:   "var(--font-display)",
        fontSize:     "12px",
        fontWeight:   700,
        letterSpacing:"0.1em",
        textTransform:"uppercase",
        cursor:       "pointer",
      }}
    >
      <span>{label}</span>
      <div className="flex items-center gap-2">
        {count !== undefined && count > 0 && (
          <span style={{
            fontSize: "10px",
            fontFamily: "var(--font-data)",
            background: active ? `${accentColor}22` : "rgba(255,255,255,0.06)",
            color: active ? accentColor : "var(--text-muted)",
            padding: "2px 8px",
            borderRadius: "9999px",
          }}>
            {count}
          </span>
        )}
        {active
          ? <ChevronUp  className="w-4 h-4 shrink-0" />
          : <ChevronDown className="w-4 h-4 shrink-0" />
        }
      </div>
    </button>
  );
}

// ── Mobile price list ─────────────────────────────────────────────────────────
// Shows ticker + price only — no % change (per spec).
// Fetches from /api/prices on mount. Separate from PriceTicker so desktop stays unchanged.
function fmtMobilePrice(price: number): string {
  if (price === 0) return "—";
  if (price >= 10000) return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1000)  return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (price >= 1)     return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function MobilePriceList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [prices, setPrices] = useState<AssetPrice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = useCallback(async () => {
    try {
      const res  = await fetch("/api/prices");
      const data = await res.json();
      if (data.ok && data.prices?.length > 0) setPrices(data.prices);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrices(); }, [fetchPrices, refreshTrigger]);

  if (loading) {
    return (
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
  }

  return (
    <div className="mc-card p-3">
      <div className="grid grid-cols-2 gap-2">
        {prices.map((asset) => (
          <div
            key={asset.symbol}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}
          >
            <span style={{
              fontFamily: "var(--font-display)", fontSize: "11px",
              fontWeight: 700, color: "var(--orange)", letterSpacing: "0.05em",
            }}>
              {asset.symbol}
            </span>
            <span style={{
              fontFamily: "var(--font-data)", fontSize: "12px",
              fontWeight: 700, color: "var(--text-primary)",
            }}>
              {fmtMobilePrice(asset.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Headline Alert Card ────────────────────────────────────────────────────────
// clampLines: 2 on desktop, 1 on mobile (half-length preview per spec)
function HeadlineAlertCard({
  tweet,
  sent,
  onRewrite,
  clampLines = 2,
}: {
  tweet: XTweet;
  sent: boolean;
  onRewrite: () => void;
  clampLines?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [tweet.text]);

  const displayText = expanded ? fullText(tweet.text) : tweet.text;

  return (
    <div
      className="mc-card p-4 space-y-2"
      style={{ borderColor: "rgba(249,115,22,0.4)", background: "rgba(249,115,22,0.04)" }}
    >
      {/* Top row: @author · time · Rewrite */}
      <div className="flex items-center gap-2">
        <a
          href={`https://x.com/${tweet.author}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:underline shrink-0"
        >
          <Twitter className="w-3 h-3 shrink-0" style={{ color: "var(--orange)", opacity: 0.8 }} />
          <span style={{ color: "var(--orange)", fontSize: "11px", fontFamily: "var(--font-data)", fontWeight: 700 }}>
            @{tweet.author}
          </span>
        </a>
        <span style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)" }}>
          · {relTime(tweet.pubDate)}
        </span>
        <div style={{ flex: 1 }} />
        <button
          type="button" onClick={onRewrite} disabled={sent}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0"
          style={{
            background: sent ? "rgba(34,197,94,0.1)" : "rgba(29,161,242,0.08)",
            border: sent ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(29,161,242,0.25)",
            color: sent ? "var(--green)" : "#1DA1F2",
            fontFamily: "var(--font-display)", letterSpacing: "0.05em",
            cursor: sent ? "default" : "pointer",
          }}
        >
          {sent ? <><CheckCircle2 className="w-3 h-3" />Sent</> : <><Twitter className="w-3 h-3" />Rewrite</>}
        </button>
      </div>

      {/* Tweet text — clampLines controls preview depth (1 on mobile, 2 on desktop) */}
      <p
        ref={expanded ? undefined : textRef}
        style={{
          color: "var(--text-primary)", fontSize: "13px", lineHeight: "1.6",
          fontWeight: 500, wordBreak: "break-word",
          ...(expanded ? {} : clampStyle(clampLines)),
        }}
      >
        {displayText}
      </p>

      {/* Bottom row: Read more · View on X */}
      <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid rgba(249,115,22,0.15)" }}>
        {clamped ? (
          <button type="button" onClick={() => setExpanded((v) => !v)}
            style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
            {expanded ? "Show less ▲" : "Read more ▼"}
          </button>
        ) : <span />}
        <a href={tweet.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 hover:underline"
          style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)" }}>
          <ExternalLink className="w-2.5 h-2.5" />View on X
        </a>
      </div>
    </div>
  );
}

// ── Column config ─────────────────────────────────────────────────────────────
const COLUMNS: Array<{
  key: keyof Pick<XFeedData, "btcEth" | "macro" | "altcoins">;
  label: string;
  accent: string;
  border: string;
  badgeBg: string;
  badgeText: string;
}> = [
  { key: "btcEth",   label: "Bitcoin & Ethereum", accent: "#F97316", border: "rgba(249,115,22,0.25)",  badgeBg: "rgba(249,115,22,0.12)",  badgeText: "#F97316" },
  { key: "macro",    label: "Macro",               accent: "#A78BFA", border: "rgba(167,139,250,0.25)", badgeBg: "rgba(167,139,250,0.12)", badgeText: "#A78BFA" },
  { key: "altcoins", label: "Altcoins",             accent: "#34D399", border: "rgba(52,211,153,0.25)",  badgeBg: "rgba(52,211,153,0.1)",   badgeText: "#34D399" },
];

// Mobile column button config — matches desktop accent colors exactly
const MOBILE_COLUMNS: Array<{
  key:          "btcEth" | "macro" | "altcoins";
  label:        string;
  accentColor:  string;
  activeBg:     string;
  activeBorder: string;
}> = [
  { key: "btcEth",   label: "BTC/ETH", accentColor: "#F97316", activeBg: "rgba(249,115,22,0.1)",  activeBorder: "rgba(249,115,22,0.4)"  },
  { key: "macro",    label: "MACRO",   accentColor: "#A78BFA", activeBg: "rgba(167,139,250,0.1)", activeBorder: "rgba(167,139,250,0.4)" },
  { key: "altcoins", label: "ALTS",    accentColor: "#34D399", activeBg: "rgba(52,211,153,0.1)",  activeBorder: "rgba(52,211,153,0.4)"  },
];

// ── Tweet Card ────────────────────────────────────────────────────────────────
function TweetCard({
  tweet, accent, sent, onRewrite,
}: {
  tweet: XTweet; accent: string; sent: boolean; onRewrite: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped]   = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [tweet.text]);

  const displayText = expanded ? fullText(tweet.text) : tweet.text;

  return (
    <div className="mc-card p-4 space-y-2" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      {/* Top row: @author · time · Rewrite */}
      <div className="flex items-center gap-2">
        <a href={`https://x.com/${tweet.author}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:underline shrink-0">
          <Twitter className="w-3 h-3 shrink-0" style={{ color: accent, opacity: 0.8 }} />
          <span className="font-bold" style={{ color: accent, fontSize: "11px", fontFamily: "var(--font-data)" }}>
            @{tweet.author}
          </span>
        </a>
        <span style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)" }}>
          · {relTime(tweet.pubDate)}
        </span>
        <div style={{ flex: 1 }} />
        <button type="button" onClick={onRewrite} disabled={sent}
          title={sent ? "Sent to Telegram" : "Send 3 rewritten versions to Telegram"}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0"
          style={{
            background: sent ? "rgba(34,197,94,0.1)" : "rgba(29,161,242,0.08)",
            border: sent ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(29,161,242,0.25)",
            color: sent ? "var(--green)" : "#1DA1F2",
            fontFamily: "var(--font-display)", letterSpacing: "0.05em",
            cursor: sent ? "default" : "pointer", opacity: sent ? 0.85 : 1,
          }}
        >
          {sent ? <><CheckCircle2 className="w-3 h-3" />Sent</> : <><Twitter className="w-3 h-3" />Rewrite</>}
        </button>
      </div>

      {/* Tweet text — 2-line clamp; ref detects if actually clamped */}
      <p
        ref={expanded ? undefined : textRef}
        style={{
          color: "var(--text-taupe)", fontSize: "12.5px", lineHeight: "1.65",
          wordBreak: "break-word",
          ...(expanded ? {} : clampStyle(2)),
        }}
      >
        {displayText}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        {clamped ? (
          <button type="button" onClick={() => setExpanded((v) => !v)}
            style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
            {expanded ? "Show less ▲" : "Read more ▼"}
          </button>
        ) : <span />}
        <a href={tweet.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 hover:underline"
          style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)" }}>
          <ExternalLink className="w-2.5 h-2.5" />View on X
        </a>
      </div>
    </div>
  );
}

// ── Feed Column (desktop) ─────────────────────────────────────────────────────
function FeedColumn({
  label, tweets, accent, border, badgeBg, badgeText, sentIds, onRewrite,
}: {
  label: string; tweets: XTweet[]; accent: string; border: string;
  badgeBg: string; badgeText: string; sentIds: Set<string>; onRewrite: (tweet: XTweet) => void;
}) {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
        style={{ background: "var(--bg-card)", border: `1px solid ${border}` }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {label}
        </span>
        <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: badgeBg, color: badgeText, fontFamily: "var(--font-data)" }}>
          {tweets.length}
        </span>
      </div>
      {tweets.length === 0 ? (
        <div className="mc-card p-6 text-center" style={{ border: "1px solid var(--border-subtle)" }}>
          <p className="text-label text-xs">No posts yet — refreshing…</p>
        </div>
      ) : tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} accent={accent}
          sent={sentIds.has(tweet.id)} onRewrite={() => onRewrite(tweet)} />
      ))}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const toast = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 4000);
  }, []);
  return { msg, toast };
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function XFeedPage() {
  const isMobile = useIsMobile();

  const [data, setData]           = useState<XFeedData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [priceRefresh, setPriceRefresh] = useState(0);
  const [error, setError]         = useState<string | null>(null);
  const [sentIds, setSentIds]     = useState<Set<string>>(new Set());
  const { msg: toastMsg, toast }  = useToast();

  // Mobile accordion — only one section open at a time
  const [mobileOpen, setMobileOpen] = useState<MobileSection>(null);
  const toggleSection = useCallback((section: MobileSection) => {
    setMobileOpen((prev) => (prev === section ? null : section));
  }, []);

  const fetchFeed = useCallback(async (isRefresh = false) => {
    if (isRefresh) { setRefreshing(true); setPriceRefresh((n) => n + 1); }
    else { setLoading(true); }
    setError(null);
    try {
      const url  = isRefresh ? "/api/x-feed?bust=1" : "/api/x-feed";
      const res  = await fetch(url);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
        if (isRefresh) {
          const total = (json.btcEth?.length ?? 0) + (json.macro?.length ?? 0) +
                        (json.altcoins?.length ?? 0) + (json.headlines?.length ?? 0);
          toast(`✓ Feed updated — ${total} posts loaded`);
        }
      }
    } catch (e: any) {
      setError(e.message);
      if (isRefresh) toast(`✗ Update failed: ${e.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  const handleRewrite = useCallback(async (tweet: XTweet) => {
    setSentIds((prev) => new Set(prev).add(tweet.id));
    toast("⏳ Writing 3 versions — sending to Telegram now…");
    try {
      const res  = await fetch("/api/x-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweet }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setSentIds((prev) => { const s = new Set(prev); s.delete(tweet.id); return s; });
        toast(`✗ Rewrite failed: ${json.error ?? res.status}`);
      } else {
        toast("✓ 3 versions sent to your Telegram");
      }
    } catch (e: any) {
      setSentIds((prev) => { const s = new Set(prev); s.delete(tweet.id); return s; });
      toast(`✗ Network error: ${e.message}`);
    }
  }, [toast]);

  const totalShown = data
    ? data.btcEth.length + data.macro.length + data.altcoins.length
    : 0;

  // Which column's tweets are active in mobile view
  const mobileColumnKey = (mobileOpen === "btcEth" || mobileOpen === "macro" || mobileOpen === "altcoins")
    ? mobileOpen : null;

  return (
    <div className="p-6 space-y-5 animate-fade-in">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-lg mb-0.5">X Feed</h1>
          <p className="text-label">
            {data
              ? `${data.totalFetched} fetched · ${totalShown} shown · ${data.filtered} filtered`
              : "Live posts from monitored crypto & finance accounts"}
          </p>
        </div>
        <button
          onClick={() => fetchFeed(true)} disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all shrink-0"
          style={{
            background: refreshing ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.07)",
            borderColor: "rgba(249,115,22,0.35)", color: "var(--orange)",
            fontFamily: "var(--font-display)", letterSpacing: "0.06em",
            boxShadow: refreshing ? "0 0 14px rgba(249,115,22,0.2)" : "none",
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Updating..." : "Update Data"}
        </button>
      </div>

      {/* ── Error ─────────────────────────────────────────────────── */}
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }}>
          Failed to load X feed: {error}
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" style={{ color: "var(--orange)" }} />
          <p className="text-label">Loading X feed from Railway…</p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MOBILE LAYOUT — accordion, one section open at a time
          Renders only on screens < 768px (isMobile = true)
      ════════════════════════════════════════════════════════════ */}
      {!loading && isMobile && (
        <div className="space-y-2">

          {/* ── PRICES ── */}
          <MobileAccordionButton
            label="PRICES"
            active={mobileOpen === "prices"}
            onClick={() => toggleSection("prices")}
          />
          {mobileOpen === "prices" && (
            <MobilePriceList refreshTrigger={priceRefresh} />
          )}

          {/* ── BREAKING ── (only rendered if headlines exist) */}
          {data && data.headlines.length > 0 && (
            <>
              <MobileAccordionButton
                label="BREAKING"
                active={mobileOpen === "breaking"}
                count={data.headlines.length}
                onClick={() => toggleSection("breaking")}
                accentColor="#F97316"
                activeBg="rgba(249,115,22,0.1)"
                activeBorder="rgba(249,115,22,0.4)"
              />
              {mobileOpen === "breaking" && (
                <div className="space-y-2">
                  {data.headlines.map((tweet) => (
                    <HeadlineAlertCard
                      key={tweet.id}
                      tweet={tweet}
                      sent={sentIds.has(tweet.id)}
                      onRewrite={() => handleRewrite(tweet)}
                      clampLines={1}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── BTC/ETH · MACRO · ALTS buttons (always visible as a group) ── */}
          {data && (
            <>
              <div className="flex flex-col gap-2">
                {MOBILE_COLUMNS.map((col) => (
                  <MobileAccordionButton
                    key={col.key}
                    label={col.label}
                    active={mobileOpen === col.key}
                    count={(data[col.key] as XTweet[]).length}
                    onClick={() => toggleSection(col.key)}
                    accentColor={col.accentColor}
                    activeBg={col.activeBg}
                    activeBorder={col.activeBorder}
                  />
                ))}
              </div>

              {/* Column posts — expand below the 3 buttons in single column */}
              {mobileColumnKey && (
                <div className="space-y-2">
                  {(data[mobileColumnKey] as XTweet[]).map((tweet) => {
                    const col = MOBILE_COLUMNS.find((c) => c.key === mobileColumnKey)!;
                    return (
                      <TweetCard
                        key={tweet.id}
                        tweet={tweet}
                        accent={col.accentColor}
                        sent={sentIds.has(tweet.id)}
                        onRewrite={() => handleRewrite(tweet)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          DESKTOP LAYOUT — full price ticker + 2-col headlines + 3-col grid
          Renders only on screens ≥ 768px (isMobile = false)
      ════════════════════════════════════════════════════════════ */}
      {!loading && !isMobile && (
        <>
          {/* Live Price Ticker */}
          <PriceTicker refreshTrigger={priceRefresh} />

          {/* X HEADLINES */}
          {data && data.headlines.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.35)" }}>
                  <span style={{ color: "#F97316", fontSize: "9px", fontFamily: "var(--font-data)", fontWeight: 700, letterSpacing: "0.18em" }}>🚨</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: "var(--orange)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    X Headlines
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: "rgba(249,115,22,0.15)", color: "var(--orange)", fontFamily: "var(--font-data)" }}>
                    {data.headlines.length}
                  </span>
                </div>
                <div style={{ flex: 1, height: "1px", background: "rgba(249,115,22,0.15)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                {data.headlines.map((tweet) => (
                  <HeadlineAlertCard
                    key={tweet.id} tweet={tweet}
                    sent={sentIds.has(tweet.id)}
                    onRewrite={() => handleRewrite(tweet)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3-Column Grid */}
          {data && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", alignItems: "start" }}>
              {COLUMNS.map((col) => (
                <FeedColumn
                  key={col.key}
                  label={col.label}
                  tweets={data[col.key] as XTweet[]}
                  accent={col.accent} border={col.border}
                  badgeBg={col.badgeBg} badgeText={col.badgeText}
                  sentIds={sentIds} onRewrite={handleRewrite}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Toast (both layouts) ──────────────────────────────────── */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl animate-fade-up"
          style={{
            background: "var(--bg-elevated)", border: "1px solid rgba(249,115,22,0.35)",
            color: "var(--text-primary)", fontSize: "13px", maxWidth: "420px",
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
