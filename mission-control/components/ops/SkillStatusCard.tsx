"use client";

import { getCategoryColor, getSkillByCode, CATEGORY_LABELS } from "@/config/skill-registry";

interface SkillStatusCardProps {
  skillCode: string;
  tasksRun: number;
  failures: number;
  tokensUsed: number;
  cost: number;
  avgDuration: number;
}

export default function SkillStatusCard({
  skillCode,
  tasksRun,
  failures,
  tokensUsed,
  cost,
  avgDuration,
}: SkillStatusCardProps) {
  const skill = getSkillByCode(skillCode);
  const color = getCategoryColor(skillCode);
  const successRate = tasksRun > 0 ? ((tasksRun - failures) / tasksRun) * 100 : 0;

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (successRate / 100) * circumference;

  const formatTokens = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;

  return (
    <div className="glass-card p-4">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r={radius}
              fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4"
            />
            <circle
              cx="40" cy="40" r={radius}
              fill="none" stroke={color} strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-data text-sm" style={{ color }}>
              {successRate.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-display text-sm font-semibold text-slate-200 uppercase">
            {skill?.displayName || skillCode}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-data text-[10px] text-slate-500">Code: {skillCode}</span>
            <span className="font-data text-[10px] text-slate-600">
              {skill ? CATEGORY_LABELS[skill.category] : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs">
        <div className="flex justify-between">
          <span className="font-body text-slate-500">Tasks Run</span>
          <span className="font-data text-slate-300">{tasksRun}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-slate-500">Failures</span>
          <span className="font-data text-red-400">{failures}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-slate-500">Tokens</span>
          <span className="font-data text-slate-300">{formatTokens(tokensUsed)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-slate-500">Cost</span>
          <span className="font-data text-mc-orange-bright">${cost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between col-span-2">
          <span className="font-body text-slate-500">Avg Duration</span>
          <span className="font-data text-slate-300">{avgDuration.toFixed(1)}s</span>
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${successRate}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
