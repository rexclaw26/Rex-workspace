"use client";

import { useState, useEffect } from "react";
import { Brain, ChevronDown, ChevronUp, RefreshCw, Calendar, FileText } from "lucide-react";
import type { MemoryFile, MemoryResponse } from "@/app/api/memory/route";

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

// ── Markdown renderer ─────────────────────────────────────────────────────────
// Renders raw .md content as structured HTML without a library dependency.
// Handles: ## / ### headings, **bold**, `code`, bullet points, blank line paragraphs.

function renderMarkdown(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;

  const renderInline = (text: string): React.ReactNode => {
    // Split on **bold** and `code` markers
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: "var(--text-primary)", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} style={{
            fontFamily: "var(--font-data)", fontSize: "11px",
            background: "rgba(249,115,22,0.1)", color: "var(--orange)",
            padding: "1px 5px", borderRadius: "4px",
          }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // H2 heading
    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h2 key={key++} style={{
          fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700,
          color: "var(--text-orange)", letterSpacing: "0.06em", textTransform: "uppercase",
          marginTop: "20px", marginBottom: "6px",
          paddingBottom: "4px", borderBottom: "1px solid rgba(249,115,22,0.15)",
        }}>
          {trimmed.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3 heading
    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h3 key={key++} style={{
          fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700,
          color: "var(--text-taupe)", letterSpacing: "0.05em", textTransform: "uppercase",
          marginTop: "12px", marginBottom: "4px",
        }}>
          {trimmed.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // H1 heading — treat as subtitle
    if (trimmed.startsWith("# ")) {
      nodes.push(
        <h1 key={key++} style={{
          fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 800,
          color: "var(--text-orange)", letterSpacing: "0.04em",
          marginTop: "8px", marginBottom: "10px",
        }}>
          {trimmed.slice(2)}
        </h1>
      );
      i++;
      continue;
    }

    // Bullet point (- or * or numbered)
    if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && (/^[-*]\s/.test(lines[i].trim()) || /^\d+\.\s/.test(lines[i].trim()))) {
        const itemText = lines[i].trim().replace(/^[-*]\s/, "").replace(/^\d+\.\s/, "");
        listItems.push(
          <li key={i} style={{
            fontSize: "12px", color: "var(--text-primary)", lineHeight: "1.6",
            paddingLeft: "4px", marginBottom: "3px",
          }}>
            {renderInline(itemText)}
          </li>
        );
        i++;
      }
      nodes.push(
        <ul key={key++} style={{ paddingLeft: "16px", margin: "4px 0 8px", listStyle: "disc" }}>
          {listItems}
        </ul>
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***") {
      nodes.push(
        <hr key={key++} style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "12px 0" }} />
      );
      i++;
      continue;
    }

    // Empty line — paragraph break (skip)
    if (!trimmed) {
      i++;
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={key++} style={{
        fontSize: "12px", color: "var(--text-primary)", lineHeight: "1.65",
        marginBottom: "6px",
      }}>
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return nodes;
}

// ── Memory Card ───────────────────────────────────────────────────────────────

function MemoryCard({ file, defaultOpen = false, isMobile = false }: { file: MemoryFile; defaultOpen?: boolean; isMobile?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  const sizeLabel = file.size > 10240
    ? `${(file.size / 1024).toFixed(1)} KB`
    : `${file.size} B`;

  return (
    <div
      className="mc-card overflow-hidden"
      style={{ transition: "all 0.2s ease" }}
    >
      {/* ── Card Header (always visible) ─────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: file.type === "longterm"
                ? "rgba(249,115,22,0.12)"
                : "rgba(148,163,184,0.08)",
              border: `1px solid ${file.type === "longterm" ? "rgba(249,115,22,0.2)" : "rgba(148,163,184,0.12)"}`,
            }}
          >
            {file.type === "longterm"
              ? <Brain className="w-4 h-4" style={{ color: "var(--orange)" }} />
              : <Calendar className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            }
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700,
                color: file.type === "longterm" ? "var(--text-orange)" : "var(--text-taupe)",
                letterSpacing: "0.03em",
              }}
            >
              {file.label}
            </p>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)", marginTop: "1px" }}>
              {sizeLabel} · {file.type === "longterm" ? "Long-term memory" : "Daily session log"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {file.type === "longterm" && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest"
              style={{ background: "rgba(249,115,22,0.12)", color: "var(--orange)", fontFamily: "var(--font-display)" }}
            >
              LIVE
            </span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            : <ChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          }
        </div>
      </button>

      {/* ── Card Content ─────────────────────────────────────────── */}
      {open && (
        <div
          className="px-5 pb-5"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="pt-4" style={{ maxHeight: isMobile ? "400px" : "640px", overflowY: "auto" }}>
            {renderMarkdown(file.content)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MemoryPage() {
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastLoaded, setLastLoaded] = useState<number | null>(null);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/memory");
      const data: MemoryResponse = await res.json();
      if (data.ok) {
        setFiles(data.files);
        setLastLoaded(Date.now());
      } else {
        setError(data.error || "Failed to load memory files");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFiles(); }, []);

  const longTermFile = files.find((f) => f.type === "longterm");
  const dailyFiles   = files.filter((f) => f.type === "daily");
  const totalSize    = files.reduce((sum, f) => sum + f.size, 0);
  const totalSizeKB  = (totalSize / 1024).toFixed(1);

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className={isMobile ? "space-y-3" : "flex items-start justify-between gap-4"}>
        <div>
          <h1 className="page-title text-lg mb-0.5">Memory</h1>
          <p className="text-label">Rex's knowledge base — long-term + daily session logs</p>
        </div>
        <div className={`flex items-center gap-3 ${isMobile ? "" : "shrink-0"}`}>
          {lastLoaded && (
            <div className="flex items-center gap-1.5">
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
              <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                loaded {Math.floor((Date.now() - lastLoaded) / 1000)}s ago
              </span>
            </div>
          )}
          <button
            onClick={loadFiles}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all"
            style={{
              background: loading ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.07)",
              borderColor: "rgba(249,115,22,0.35)",
              color: "var(--orange)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.06em",
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* ── Stat Row ───────────────────────────────────────────────── */}
      {!loading && !error && (
        <>
          {/* Desktop: 3 cards */}
          {!isMobile && (
            <div className="grid grid-cols-3 gap-4">
              <div className="mc-card p-4 flex items-center gap-3">
                <Brain className="w-5 h-5 shrink-0" style={{ color: "var(--orange)" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-data)", fontSize: "18px", fontWeight: 700, color: "var(--orange)" }}>{files.length}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Memory files</p>
                </div>
              </div>
              <div className="mc-card p-4 flex items-center gap-3">
                <Calendar className="w-5 h-5 shrink-0" style={{ color: "var(--text-muted)" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-data)", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>{dailyFiles.length}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Daily logs</p>
                </div>
              </div>
              <div className="mc-card p-4 flex items-center gap-3">
                <FileText className="w-5 h-5 shrink-0" style={{ color: "var(--text-muted)" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-data)", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>{totalSizeKB} KB</p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Total size</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile: compact single-row pill strip */}
          {isMobile && (
            <div className="mc-card px-4 py-3 flex items-center justify-between">
              {[
                { icon: <Brain className="w-3.5 h-3.5" style={{ color: "var(--orange)" }} />, value: files.length, label: "Files", color: "var(--orange)" },
                { icon: <Calendar className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />, value: dailyFiles.length, label: "Daily logs", color: "var(--text-primary)" },
                { icon: <FileText className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />, value: `${totalSizeKB} KB`, label: "Total", color: "var(--text-primary)" },
              ].map(({ icon, value, label, color }, i, arr) => (
                <div key={label} className="flex items-center gap-2"
                  style={i < arr.length - 1 ? { borderRight: "1px solid var(--border-subtle)", paddingRight: "16px", marginRight: "0" } : {}}>
                  {icon}
                  <div>
                    <p style={{ fontFamily: "var(--font-data)", fontSize: "15px", fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "2px" }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Error State ──────────────────────────────────────────────── */}
      {error && (
        <div
          className="mc-card p-5"
          style={{ border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.05)" }}
        >
          <p style={{ fontSize: "13px", color: "var(--red)", fontFamily: "var(--font-data)" }}>
            ✗ {error}
          </p>
        </div>
      )}

      {/* ── Loading Skeleton ──────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="mc-card p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)" }} />
                <div className="space-y-2 flex-1">
                  <div style={{ height: 12, width: "35%", borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ height: 10, width: "20%", borderRadius: 4, background: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Long-Term Memory ──────────────────────────────────────────── */}
      {!loading && longTermFile && (
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
          >
            Long-Term Memory
          </p>
          <MemoryCard file={longTermFile} defaultOpen={false} isMobile={isMobile} />
        </div>
      )}

      {/* ── Daily Session Logs ────────────────────────────────────────── */}
      {!loading && dailyFiles.length > 0 && (
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
          >
            Daily Session Logs — {dailyFiles.length} files
          </p>
          <div className="space-y-3">
            {dailyFiles.map((file, i) => (
              <MemoryCard key={file.id} file={file} defaultOpen={i === 0} isMobile={isMobile} />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty State ──────────────────────────────────────────────── */}
      {!loading && !error && files.length === 0 && (
        <div className="mc-card p-10 text-center">
          <Brain className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No memory files found</p>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
            Expected MEMORY.md and memory/*.md in the workspace
          </p>
        </div>
      )}
    </div>
  );
}
