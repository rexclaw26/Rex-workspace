"use client";

// components/prices/PriceTicker.tsx
// Live asset price grid for the Mission Control headlines page.
// 12 assets: BTC, ETH, BNB, XRP, SOL, LINK, ADA, TAO, GOLD, SILV, NVDA, COIN
// Green = positive 24h price action | Red = negative
// Fetches from /api/prices every 60 seconds — server-side cache prevents rate limits.

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import type { AssetPrice } from "@/app/api/prices/route";

// ── Format helpers ─────────────────────────────────────────────────────────────
function fmtPrice(price: number, symbol: string): string {
  if (price === 0) return "—";

  // Commodity and large crypto — no decimals above $1000
  if (price >= 10000) return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1000)  return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (price >= 1)     return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  // Sub-dollar (ADA, XRP sometimes)
  return "$" + price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function fmtChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

function relTime(ms: number): string {
  const diff = Date.now() - ms;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  return `${Math.floor(secs / 60)}m ago`;
}

// ── Category dot ───────────────────────────────────────────────────────────────
function TypeDot({ type }: { type: "crypto" | "stock" | "commodity" }) {
  const colors = {
    crypto:    "bg-orange-400",
    stock:     "bg-blue-400",
    commodity: "bg-yellow-400",
  };
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[type]} shrink-0`} />;
}

// ── Single price card ──────────────────────────────────────────────────────────
function PriceCard({ asset }: { asset: AssetPrice }) {
  const isPositive = asset.change24h >= 0;
  const changeColor = isPositive ? "var(--green, #22C55E)" : "var(--red, #EF4444)";
  const changeBg    = isPositive ? "rgba(34,197,94,0.08)"  : "rgba(239,68,68,0.08)";
  const changeBorder= isPositive ? "rgba(34,197,94,0.18)"  : "rgba(239,68,68,0.18)";

  return (
    <div
      className="flex flex-col gap-1 p-3 rounded-xl transition-all hover:scale-[1.01]"
      style={{
        background: "var(--bg-card, #1A2535)",
        border: "1px solid var(--border-card, #2A3A50)",
        minWidth: 0,
      }}
    >
      {/* Symbol + type dot */}
      <div className="flex items-center gap-1.5">
        <TypeDot type={asset.type} />
        <span
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-display, 'JetBrains Mono')",
            fontWeight: 700,
            color: "var(--orange, #F97316)",
            letterSpacing: "0.06em",
          }}
        >
          {asset.symbol}
        </span>
      </div>

      {/* Price */}
      <span
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "var(--text-primary, #E2E8F0)",
          fontFamily: "var(--font-data, 'Share Tech Mono')",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}
      >
        {fmtPrice(asset.price, asset.symbol)}
      </span>

      {/* 24h change */}
      <div
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md w-fit"
        style={{ background: changeBg, border: `1px solid ${changeBorder}` }}
      >
        {isPositive
          ? <TrendingUp  className="w-2.5 h-2.5" style={{ color: changeColor }} />
          : <TrendingDown className="w-2.5 h-2.5" style={{ color: changeColor }} />
        }
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: changeColor,
            fontFamily: "var(--font-data, 'Share Tech Mono')",
            letterSpacing: "0.02em",
          }}
        >
          {fmtChange(asset.change24h)}
        </span>
      </div>
    </div>
  );
}

// ── Loading skeleton card ──────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="flex flex-col gap-2 p-3 rounded-xl animate-pulse"
      style={{
        background: "var(--bg-card, #1A2535)",
        border: "1px solid var(--border-card, #2A3A50)",
      }}
    >
      <div className="h-3 w-10 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="h-2.5 w-14 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
      <div className="h-4 w-16 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="h-3 w-12 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PriceTicker({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
  const [prices, setPrices] = useState<AssetPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [, forceRender] = useState(0); // triggers relTime re-render

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      if (data.ok && data.prices?.length > 0) {
        setPrices(data.prices);
        setLastUpdated(data.ts);
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + re-fetch when refreshTrigger increments
  useEffect(() => { fetchPrices(); }, [fetchPrices, refreshTrigger]);

  // Refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Tick the "X ago" timer every 15 seconds
  useEffect(() => {
    const tick = setInterval(() => forceRender((n) => n + 1), 15_000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            Live Prices
          </span>
          {/* Legend */}
          <div className="flex items-center gap-3 ml-2">
            {[
              { color: "bg-orange-400", label: "Crypto" },
              { color: "bg-yellow-400", label: "Commodity" },
              { color: "bg-blue-400",   label: "Stock" },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
                  {label}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && !loading && (
            <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-data)" }}>
              {relTime(lastUpdated)}
            </span>
          )}
          {loading && <RefreshCw className="w-3 h-3 animate-spin" style={{ color: "var(--text-muted)" }} />}
          {error && !loading && (
            <span style={{ fontSize: "10px", color: "var(--red)", fontFamily: "var(--font-data)" }}>
              fetch failed
            </span>
          )}
        </div>
      </div>

      {/* Price grid */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        }}
      >
        {loading
          ? Array.from({ length: 14 }).map((_, i) => <SkeletonCard key={i} />)
          : prices.map((asset) => <PriceCard key={asset.symbol} asset={asset} />)
        }
      </div>
    </div>
  );
}
