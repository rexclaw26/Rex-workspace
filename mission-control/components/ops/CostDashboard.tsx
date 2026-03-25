"use client";

interface CostDashboardProps {
  costToday: number;
  costMTD: number;
  tokensToday: number;
  tokensMTD: number;
}

export default function CostDashboard({
  costToday,
  costMTD,
  tokensToday,
  tokensMTD,
}: CostDashboardProps) {
  const formatTokens = (n: number) =>
    n >= 1000000
      ? `${(n / 1000000).toFixed(2)}M`
      : n >= 1000
      ? `${(n / 1000).toFixed(0)}K`
      : `${n}`;

  return (
    <div className="glass-card p-4">
      <h3 className="font-display text-sm font-semibold text-slate-200 mb-3">Cost & Usage</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-label block">Today</span>
          <span className="font-data text-xl text-mc-orange-bright">${costToday.toFixed(2)}</span>
          <span className="block text-[10px] font-data text-slate-500 mt-0.5">
            {formatTokens(tokensToday)} tokens
          </span>
        </div>
        <div>
          <span className="text-label block">Month to Date</span>
          <span className="font-data text-xl text-mc-blue-bright">${costMTD.toFixed(2)}</span>
          <span className="block text-[10px] font-data text-slate-500 mt-0.5">
            {formatTokens(tokensMTD)} tokens
          </span>
        </div>
      </div>
    </div>
  );
}
