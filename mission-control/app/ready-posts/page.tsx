"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Copy, CheckCircle2, Trash2, RefreshCw, Zap,
  ChevronDown, ChevronUp, ExternalLink,
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

// ── Format badge config ────────────────────────────────────────────────────────
const FORMAT_BADGE: Record<string, { bg: string; color: string }> = {
  "BREAKING":  { bg: "rgba(239,68,68,0.15)",   color: "#EF4444" },
  "JUST IN":   { bg: "rgba(249,115,22,0.15)",  color: "#F97316" },
  "DATA":      { bg: "rgba(59,130,246,0.15)",  color: "#60A5FA" },
  "WATCHING":  { bg: "rgba(234,179,8,0.15)",   color: "#EAB308" },
  "SIGNAL":    { bg: "rgba(167,139,250,0.15)", color: "#A78BFA" },
  "THREAD":    { bg: "rgba(52,211,153,0.15)",  color: "#34D399" },
};

// ── Status pill config ─────────────────────────────────────────────────────────
const STATUS_PILL: Record<string, { bg: string; color: string; label: string }> = {
  ready:  { bg: "rgba(59,130,246,0.12)",  color: "#60A5FA", label: "READY"  },
  copied: { bg: "rgba(234,179,8,0.12)",   color: "#EAB308", label: "COPIED" },
  posted: { bg: "rgba(34,197,94,0.12)",   color: "#22C55E", label: "POSTED" },
};

// ── Filter tab type ───────────────────────────────────────────────────────────
type FilterTab = "all" | "ready" | "copied" | "posted";

// ── Toast ─────────────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const toast = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 4000);
  }, []);
  return { msg, toast };
}

// ── Post card ─────────────────────────────────────────────────────────────────
type Post = {
  _id: Id<"xPostQueue">;
  content: string;
  format: string;
  category: string;
  score: number;
  status: "ready" | "copied" | "posted";
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
      {/* ── Top row: format badge · status · score · time ── */}
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
            via @{post.sourceAuthor}
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
        {/* COPY — main action, green */}
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

        {/* MARK COPIED */}
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

        {/* MARK POSTED */}
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

        {/* DELETE */}
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

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ReadyPostsPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [generating, setGenerating] = useState(false);
  const { msg: toastMsg, toast } = useToast();

  // Convex real-time query
  const allPosts = useQuery(api.xPostQueue.getAll) as Post[] | undefined;

  // Convex mutations
  const updateStatus = useMutation(api.xPostQueue.updateStatus);
  const removePost   = useMutation(api.xPostQueue.remove);

  // Filter client-side
  const posts = allPosts
    ? filter === "all"
      ? allPosts
      : allPosts.filter((p) => p.status === filter)
    : undefined;

  // Tab counts
  const counts = {
    all:    allPosts?.length ?? 0,
    ready:  allPosts?.filter((p) => p.status === "ready").length  ?? 0,
    copied: allPosts?.filter((p) => p.status === "copied").length ?? 0,
    posted: allPosts?.filter((p) => p.status === "posted").length ?? 0,
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCopy = useCallback(async (post: Post) => {
    // Write to clipboard first — this is the primary action
    let clipped = false;
    try {
      await navigator.clipboard.writeText(post.content);
      clipped = true;
    } catch {
      toast("✗ Clipboard access denied — check browser permissions");
      return;
    }
    toast("✓ Copied to clipboard");
    // Convex update is secondary — non-critical, don't fail the UX if it errors
    try {
      await updateStatus({ id: post._id, status: "copied" });
    } catch {
      // Status update failed silently — clipboard succeeded, that's what matters
    }
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

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    toast("⏳ Generating posts from x-feed…");
    try {
      const res  = await fetch("/api/generate-x-posts", { method: "POST" });
      const json = await res.json();
      if (!res.ok || json.error) {
        toast(`✗ Generation failed: ${json.error ?? res.status}`);
      } else {
        toast(`✓ Generated ${json.generated} posts · ${json.skipped} skipped`);
      }
    } catch (e: any) {
      toast(`✗ Network error: ${e.message}`);
    } finally {
      setGenerating(false);
    }
  }, [toast]);

  // ── Filter tabs ────────────────────────────────────────────────────────────
  const tabs: Array<{ key: FilterTab; label: string }> = [
    { key: "all",    label: "ALL"    },
    { key: "ready",  label: "READY"  },
    { key: "copied", label: "COPIED" },
    { key: "posted", label: "POSTED" },
  ];

  const tabAccent: Record<FilterTab, string> = {
    all:    "#60A5FA",
    ready:  "#60A5FA",
    copied: "#EAB308",
    posted: "#22C55E",
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-lg mb-0.5">[READY POSTS]</h1>
          <p className="text-label">
            {allPosts === undefined
              ? "Loading…"
              : `${counts.ready} ready · ${counts.copied} copied · ${counts.posted} posted`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all shrink-0"
          style={{
            background: generating ? "rgba(167,139,250,0.15)" : "rgba(167,139,250,0.08)",
            borderColor: "rgba(167,139,250,0.35)",
            color: "#A78BFA",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
            boxShadow: generating ? "0 0 14px rgba(167,139,250,0.2)" : "none",
            cursor: generating ? "default" : "pointer",
          }}
        >
          {generating
            ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Generating…</>
            : <><Zap className="w-3.5 h-3.5" />GENERATE NOW</>
          }
        </button>
      </div>

      {/* ── Filter tabs ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => {
          const active  = filter === tab.key;
          const accent  = tabAccent[tab.key];
          const count   = counts[tab.key];
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={{
                background: active ? `${accent}18` : "rgba(255,255,255,0.03)",
                border:     `1px solid ${active ? `${accent}55` : "var(--border-subtle)"}`,
                color:      active ? accent : "var(--text-muted)",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[9px]"
                  style={{
                    background: active ? `${accent}22` : "rgba(255,255,255,0.06)",
                    color: active ? accent : "var(--text-muted)",
                    fontFamily: "var(--font-data)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Loading ───────────────────────────────────────────────── */}
      {allPosts === undefined && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" style={{ color: "var(--orange)" }} />
          <p className="text-label">Loading post queue…</p>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────── */}
      {allPosts !== undefined && posts !== undefined && posts.length === 0 && (
        <div
          className="mc-card p-10 flex flex-col items-center justify-center gap-4"
          style={{ border: "1px solid var(--border-subtle)" }}
        >
          <Zap className="w-8 h-8" style={{ color: "var(--text-muted)", opacity: 0.4 }} />
          <div className="text-center">
            <p className="text-label text-sm mb-1">No posts in queue</p>
            <p className="text-label text-xs">
              {filter === "all"
                ? "Hit GENERATE NOW to create posts from the current x-feed."
                : `No ${filter} posts. Switch to ALL to see everything.`}
            </p>
          </div>
          {filter === "all" && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold"
              style={{
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.3)",
                color: "#A78BFA",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                cursor: generating ? "default" : "pointer",
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              GENERATE NOW
            </button>
          )}
        </div>
      )}

      {/* ── Post grid ─────────────────────────────────────────────── */}
      {posts !== undefined && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onCopy={handleCopy}
              onMarkCopied={handleMarkCopied}
              onMarkPosted={handleMarkPosted}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

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
