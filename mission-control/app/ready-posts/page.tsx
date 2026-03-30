"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Copy, CheckCircle2, Trash2, RefreshCw, Zap,
  Twitter, TrendingUp, ExternalLink, ChevronDown, ChevronUp, Newspaper,
} from "lucide-react";

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

// ── Format badge config ────────────────────────────────────────────────────
const FORMAT_BADGE: Record<string, { bg: string; color: string }> = {
  "BREAKING":  { bg: "rgba(239,68,68,0.15)",   color: "#EF4444" },
  "JUST IN":   { bg: "rgba(249,115,22,0.15)",  color: "#F97316" },
  "DATA":      { bg: "rgba(59,130,246,0.15)",  color: "#60A5FA" },
  "WATCHING":  { bg: "rgba(234,179,8,0.15)",   color: "#EAB308" },
  "SIGNAL":    { bg: "rgba(167,139,250,0.15)", color: "#A78BFA" },
  "THREAD":    { bg: "rgba(52,211,153,0.15)",  color: "#34D399" },
};

// ── Status pill config ─────────────────────────────────────────────────────
const STATUS_PILL: Record<string, { bg: string; color: string; label: string }> = {
  ready:  { bg: "rgba(59,130,246,0.12)",  color: "#60A5FA", label: "READY"  },
  copied: { bg: "rgba(234,179,8,0.12)",   color: "#EAB308", label: "COPIED" },
  posted: { bg: "rgba(34,197,94,0.12)",   color: "#22C55E", label: "POSTED" },
};

// ── Source type badge ───────────────────────────────────────────────────────
const SOURCE_BADGE: Record<string, { label: string; color: string; bg: string; Icon: React.FC<{className?: string; style?: React.CSSProperties; w?: number; h?: number}> }> = {
  x:      { label: "X FEED",     color: "#1DA1F2", bg: "rgba(29,161,242,0.1)",  Icon: Twitter },
  market: { label: "HEADLINES",  color: "#A78BFA", bg: "rgba(167,139,250,0.1)", Icon: Newspaper },
};

// ── Filter tab type ─────────────────────────────────────────────────────────
type FilterTab = "all" | "ready" | "copied" | "posted";

// ── Toast ──────────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const toast = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 4000);
  }, []);
  return { msg, toast };
}

// ── Post card ──────────────────────────────────────────────────────────────
type Post = {
  _id: Id<"xPostQueue">;
  content: string;
  format: string;
  category: string;
  score: number;
  status: "ready" | "copied" | "posted";
  sourceType: "x" | "market";
  sourceAuthor?: string;
  sourceUrl?: string;
  createdAt: number;
  expiresAt: number;
  postedAt?: number;
};

function PostCard({
  post,
  onCopy,
  onMarkCopied,
  onMarkPosted,
  onDelete,
}: {
  post: Post;
  onCopy: (post: Post) => void;
  onMarkCopied: (post: Post) => void;
  onMarkPosted: (post: Post) => void;
  onDelete: (post: Post) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const badge = FORMAT_BADGE[post.format] ?? { bg: "rgba(255,255,255,0.08)", color: "var(--text-muted)" };
  const pill  = STATUS_PILL[post.status] ?? STATUS_PILL.ready;
  const source = SOURCE_BADGE[post.sourceType] ?? SOURCE_BADGE.x;
  const SourceIcon = source.Icon;
  const charCount = post.content.length;

  return (
    <div
      className="mc-card p-4 space-y-3"
      style={{
        borderColor: post.status === "posted"
          ? "rgba(34,197,94,0.2)"
          : post.status === "copied"
          ? "rgba(234,179,8,0.2)"
          : "rgba(255,255,255,0.06)",
      }}
    >
      {/* ── Top row: format · status · score · time ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold shrink-0"
          style={{
            background: badge.bg, color: badge.color,
            fontFamily: "var(--font-display)", letterSpacing: "0.08em",
          }}
        >
          {post.format}
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
          style={{
            background: pill.bg, color: pill.color,
            fontFamily: "var(--font-display)", letterSpacing: "0.06em",
          }}
        >
          {pill.label}
        </span>
        <span
          className="px-2 py-0.5 rounded text-[10px] shrink-0"
          style={{
            background: source.bg,
            color: source.color,
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          <SourceIcon className="w-2.5 h-2.5" />
          {source.label}
        </span>
        <span
          className="px-2 py-0.5 rounded text-[10px] shrink-0"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "var(--text-muted)",
            fontFamily: "var(--font-data)",
          }}
        >
          {post.score}/100
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)" }}>
          {relTime(post.createdAt)}
        </span>
      </div>

      {/* ── Content ── */}
      <div
        className="rounded-lg p-3"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p
          style={{
            color: "var(--text-primary)",
            fontSize: "13px",
            lineHeight: "1.65",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            ...(expanded ? {} : {
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }),
          }}
        >
          {post.content}
        </p>
        <div className="flex items-center justify-between mt-2 pt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            style={{
              color: "var(--text-muted)", fontSize: "10px",
              fontFamily: "var(--font-data)", background: "none",
              border: "none", padding: 0, cursor: "pointer",
            }}
          >
            {expanded ? "Show less ▲" : "Show full ▼"}
          </button>
          <span style={{
            color: charCount > 280 ? "#EF4444" : charCount > 260 ? "#EAB308" : "var(--text-muted)",
            fontSize: "10px", fontFamily: "var(--font-data)",
          }}>
            {charCount}/280
          </span>
        </div>
      </div>

      {/* ── Source row ── */}
      {post.sourceAuthor && (
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--text-muted)", fontSize: "11px", fontFamily: "var(--font-data)" }}>
            via {post.sourceAuthor}
          </span>
          {post.sourceUrl && (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
              style={{ color: "var(--text-muted)", fontSize: "10px", fontFamily: "var(--font-data)" }}
            >
              <ExternalLink className="w-2.5 h-2.5" />
              Source
            </a>
          )}
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {post.status !== "posted" && (
          <button
            type="button"
            onClick={() => onCopy(post)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#22C55E",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            <Copy className="w-3 h-3" />
            COPY
          </button>
        )}
        {post.status === "ready" && (
          <button
            type="button"
            onClick={() => onMarkCopied(post)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
            style={{
              background: "rgba(234,179,8,0.08)",
              border: "1px solid rgba(234,179,8,0.2)",
              color: "#EAB308",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            <CheckCircle2 className="w-3 h-3" />
            MARK COPIED
          </button>
        )}
        {(post.status === "ready" || post.status === "copied") && (
          <button
            type="button"
            onClick={() => onMarkPosted(post)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#22C55E",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            <CheckCircle2 className="w-3 h-3" />
            MARK POSTED
          </button>
        )}
        <span style={{ flex: 1 }} />
        <button
          type="button"
          onClick={() => onDelete(post)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] transition-all"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.15)",
            color: "#F87171",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
            cursor: "pointer",
          }}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ── Column header ──────────────────────────────────────────────────────────
function ColumnHeader({
  label,
  Icon,
  accentColor,
  count,
  onGenerate,
  onClear,
  generating,
  generatingThis,
  open,
  onToggle,
}: {
  label: string;
  Icon: React.FC<{className?: string; style?: React.CSSProperties}>;
  accentColor: string;
  count: number;
  onGenerate: () => void;
  onClear: () => void;
  generating: boolean;
  generatingThis: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const readyCount = count; // passed as total; caller can pass ready-only if needed
  return (
    <div
      className="flex items-center justify-between gap-3 cursor-pointer select-none"
      style={{ paddingBottom: open ? "12px" : 0 }}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}33` }}
        >
          <Icon className="w-4 h-4" style={{ color: accentColor }} />
        </div>
        <div>
          <h2
            className="text-xs font-bold tracking-widest"
            style={{ color: accentColor, fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}
          >
            {label}
          </h2>
          <p className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
            {readyCount} post{readyCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Clear button */}
        {count > 0 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#EF4444",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            <Trash2 className="w-3 h-3" />Clear
          </button>
        )}
        {/* Generate button — stop propagation so it doesn't toggle accordion */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onGenerate(); }}
          disabled={generating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
          style={{
            background: generating ? `${accentColor}15` : `${accentColor}10`,
            border: `1px solid ${accentColor}40`,
            color: accentColor,
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
            cursor: generating ? "default" : "pointer",
            opacity: generatingThis ? 0.6 : 1,
          }}
        >
          {generatingThis
            ? <><RefreshCw className="w-3 h-3 animate-spin" />Generating…</>
            : <><Zap className="w-3 h-3" />Generate</>
          }
        </button>
        {/* Chevron — only shown when onToggle is meaningful (mobile) */}
        {onToggle.toString() !== "() => {}" && (
          open
            ? <ChevronUp className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            : <ChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        )}
      </div>
    </div>
  );
}

// ── Post column ────────────────────────────────────────────────────────────
function PostColumn({
  posts,
  sourceType,
  filter,
  onCopy,
  onMarkCopied,
  onMarkPosted,
  onDelete,
}: {
  posts: Post[];
  sourceType: "x" | "market";
  filter: FilterTab;
  onCopy: (post: Post) => void;
  onMarkCopied: (post: Post) => void;
  onMarkPosted: (post: Post) => void;
  onDelete: (post: Post) => void;
}) {
  const filtered = filter === "all"
    ? posts
    : posts.filter((p) => p.status === filter);

  const counts = {
    all:    posts.length,
    ready:  posts.filter((p) => p.status === "ready").length,
    copied: posts.filter((p) => p.status === "copied").length,
    posted: posts.filter((p) => p.status === "posted").length,
  };

  const tabs: Array<{ key: FilterTab; label: string }> = [
    { key: "all",    label: "ALL" },
    { key: "ready",  label: "READY" },
    { key: "copied", label: "COPIED" },
    { key: "posted", label: "POSTED" },
  ];

  const [colFilter, setColFilter] = useState<FilterTab>("all");
  const displayPosts = colFilter === "all"
    ? filtered
    : filtered.filter((p) => p.status === colFilter);

  return (
    <div>
      {/* Column-level filter tabs */}
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {tabs.map((tab) => {
          const active = colFilter === tab.key;
          const count  = counts[tab.key];
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setColFilter(tab.key)}
              className="px-2 py-1 rounded text-[10px] font-bold transition-all"
              style={{
                background: active ? "rgba(255,255,255,0.08)" : "transparent",
                border: `1px solid ${active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
            >
              {tab.label}{count > 0 ? ` ${count}` : ""}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {displayPosts.length === 0 ? (
        <div
          className="mc-card p-8 text-center"
          style={{ border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-label text-xs">No {colFilter !== "all" ? colFilter : ""} posts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onCopy={onCopy}
              onMarkCopied={onMarkCopied}
              onMarkPosted={onMarkPosted}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ReadyPostsPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [generatingX, setGeneratingX] = useState(false);
  const [generatingMarket, setGeneratingMarket] = useState(false);
  // Mobile accordion state (desktop always shows both columns)
  const [xOpen, setXOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const { msg: toastMsg, toast } = useToast();

  const allPosts = useQuery(api.xPostQueue.getAll) as Post[] | undefined;

  const updateStatus  = useMutation(api.xPostQueue.updateStatus);
  const removePost    = useMutation(api.xPostQueue.remove);
  const clearBySource = useMutation(api.xPostQueue.clearBySource);

  // Split by source type
  const xPosts     = allPosts?.filter((p) => p.sourceType === "x")     ?? [];
  const marketPosts = allPosts?.filter((p) => p.sourceType === "market") ?? [];

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleCopy = useCallback(async (post: Post) => {
    try {
      await navigator.clipboard.writeText(post.content);
      toast("✓ Copied");
    } catch {
      toast("✗ Clipboard denied — check browser permissions");
      return;
    }
    try {
      await updateStatus({ id: post._id, status: "copied" });
    } catch { /* non-critical */ }
  }, [updateStatus, toast]);

  const handleMarkCopied = useCallback(async (post: Post) => {
    await updateStatus({ id: post._id, status: "copied" });
    toast("Marked as copied");
  }, [updateStatus, toast]);

  const handleMarkPosted = useCallback(async (post: Post) => {
    await updateStatus({ id: post._id, status: "posted", postedAt: Date.now() });
    toast("✓ Marked as posted");
  }, [updateStatus, toast]);

  const handleDelete = useCallback(async (post: Post) => {
    await removePost({ id: post._id });
    toast("Deleted");
  }, [removePost, toast]);

  const handleGenerateX = useCallback(async () => {
    setGeneratingX(true);
    toast("⏳ Generating from x-feed…");
    try {
      const res  = await fetch("/api/generate-x-posts", { method: "POST" });
      const json = await res.json();
      if (!res.ok || json.error) {
        toast(`✗ Failed: ${json.error ?? res.status}`);
      } else {
        toast(`✓ ${json.generated} x-posts generated · ${json.skipped} skipped`);
      }
    } catch (e: any) {
      toast(`✗ Network error: ${e.message}`);
    } finally {
      setGeneratingX(false);
    }
  }, [toast]);

  const handleGenerateMarket = useCallback(async () => {
    setGeneratingMarket(true);
    toast("⏳ Generating from market data…");
    try {
      const res  = await fetch("/api/generate-market-posts", { method: "POST" });
      const json = await res.json();
      if (!res.ok || json.error) {
        toast(`✗ Failed: ${json.error ?? res.status}`);
      } else {
        toast(`✓ ${json.generated} market posts generated · ${json.skipped} skipped`);
      }
    } catch (e: any) {
      toast(`✗ Network error: ${e.message}`);
    } finally {
      setGeneratingMarket(false);
    }
  }, [toast]);

  const handleClearX = useCallback(async () => {
    if (!confirm("Clear all X Feed posts?")) return;
    try {
      await clearBySource({ sourceType: "x" });
      toast("✓ X Feed cleared");
    } catch (e: any) {
      toast(`✗ Clear failed: ${e.message}`);
    }
  }, [clearBySource, toast]);

  const handleClearMarket = useCallback(async () => {
    if (!confirm("Clear all Headlines posts?")) return;
    try {
      await clearBySource({ sourceType: "market" });
      toast("✓ Headlines cleared");
    } catch (e: any) {
      toast(`✗ Clear failed: ${e.message}`);
    }
  }, [clearBySource, toast]);

  const generating = generatingX || generatingMarket;
  const totalCount = {
    x: xPosts.length,
    market: marketPosts.length,
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div>
        <h1 className="page-title text-lg mb-0.5">[READY POSTS]</h1>
        <p className="text-label">
          {allPosts === undefined
            ? "Loading…"
            : `${xPosts.filter((p) => p.status === "ready").length} X-FEED READY · ${marketPosts.filter((p) => p.status === "ready").length} HEADLINES READY`}
        </p>
      </div>

      {/* ── DESKTOP: two-column, always expanded ── */}
      <div className="hidden md:grid grid-cols-2 gap-4">

        {/* X FEED */}
        <div className="rounded-xl p-4" style={{ background: "rgba(29,161,242,0.03)", border: "1px solid rgba(29,161,242,0.1)" }}>
          <ColumnHeader
            label="X FEED" Icon={Twitter} accentColor="#1DA1F2"
            count={totalCount.x} onGenerate={handleGenerateX} onClear={handleClearX}
            generating={generating} generatingThis={generatingX}
            open={true} onToggle={() => {}}
          />
          {allPosts === undefined
            ? <div className="flex justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin" style={{ color: "#1DA1F2" }} /></div>
            : <PostColumn posts={xPosts} sourceType="x" filter={filter} onCopy={handleCopy} onMarkCopied={handleMarkCopied} onMarkPosted={handleMarkPosted} onDelete={handleDelete} />
          }
        </div>

        {/* HEADLINES */}
        <div className="rounded-xl p-4" style={{ background: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
          <ColumnHeader
            label="HEADLINES" Icon={Newspaper} accentColor="#A78BFA"
            count={totalCount.market} onGenerate={handleGenerateMarket} onClear={handleClearMarket}
            generating={generating} generatingThis={generatingMarket}
            open={true} onToggle={() => {}}
          />
          {allPosts === undefined
            ? <div className="flex justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin" style={{ color: "#A78BFA" }} /></div>
            : <PostColumn posts={marketPosts} sourceType="market" filter={filter} onCopy={handleCopy} onMarkCopied={handleMarkCopied} onMarkPosted={handleMarkPosted} onDelete={handleDelete} />
          }
        </div>

      </div>

      {/* ── MOBILE: accordion, stacked ── */}
      <div className="md:hidden space-y-3">

        {/* X FEED accordion */}
        <div
          className="rounded-xl"
          style={{ background: "rgba(29,161,242,0.03)", border: `1px solid ${xOpen ? "rgba(29,161,242,0.18)" : "rgba(29,161,242,0.08)"}`, transition: "border-color 0.2s" }}
        >
          <div className="p-4">
            <ColumnHeader
              label="X FEED" Icon={Twitter} accentColor="#1DA1F2"
              count={totalCount.x} onGenerate={handleGenerateX} onClear={handleClearX}
              generating={generating} generatingThis={generatingX}
              open={xOpen} onToggle={() => setXOpen((v) => !v)}
            />
          </div>
          {xOpen && (
            <div className="px-4 pb-4 border-t" style={{ borderColor: "rgba(29,161,242,0.1)" }}>
              <div className="pt-3">
                {allPosts === undefined
                  ? <div className="flex justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin" style={{ color: "#1DA1F2" }} /></div>
                  : <PostColumn posts={xPosts} sourceType="x" filter={filter} onCopy={handleCopy} onMarkCopied={handleMarkCopied} onMarkPosted={handleMarkPosted} onDelete={handleDelete} />
                }
              </div>
            </div>
          )}
        </div>

        {/* HEADLINES accordion */}
        <div
          className="rounded-xl"
          style={{ background: "rgba(167,139,250,0.03)", border: `1px solid ${marketOpen ? "rgba(167,139,250,0.18)" : "rgba(167,139,250,0.08)"}`, transition: "border-color 0.2s" }}
        >
          <div className="p-4">
            <ColumnHeader
              label="HEADLINES" Icon={Newspaper} accentColor="#A78BFA"
              count={totalCount.market} onGenerate={handleGenerateMarket} onClear={handleClearMarket}
              generating={generating} generatingThis={generatingMarket}
              open={marketOpen} onToggle={() => setMarketOpen((v) => !v)}
            />
          </div>
          {marketOpen && (
            <div className="px-4 pb-4 border-t" style={{ borderColor: "rgba(167,139,250,0.1)" }}>
              <div className="pt-3">
                {allPosts === undefined
                  ? <div className="flex justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin" style={{ color: "#A78BFA" }} /></div>
                  : <PostColumn posts={marketPosts} sourceType="market" filter={filter} onCopy={handleCopy} onMarkCopied={handleMarkCopied} onMarkPosted={handleMarkPosted} onDelete={handleDelete} />
                }
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Toast ─────────────────────────────────────────────────── */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl animate-fade-up"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid rgba(167,139,250,0.35)",
            color: "var(--text-primary)",
            fontSize: "13px",
            maxWidth: "420px",
            boxShadow: "0 0 30px rgba(167,139,250,0.12), 0 8px 32px rgba(0,0,0,0.55)",
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
