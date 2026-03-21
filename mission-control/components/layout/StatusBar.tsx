"use client";

import { useState, useEffect } from "react";
import StatusDot from "@/components/ui/StatusDot";
import { getCategoryColor } from "@/config/skill-registry";

interface StatusBarProps {
  activeTaskCount: number;
  costMTD: number;
  activeSkills?: { code: string; status: "running" | "idle" }[];
}

export default function StatusBar({
  activeTaskCount,
  costMTD,
  activeSkills = [],
}: StatusBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <footer
      className="glass fixed bottom-0 left-0 right-0 z-30 h-8 flex items-center px-4 gap-4 text-xs"
      style={{ borderTop: "1px solid var(--glass-border)" }}
    >
      <div className="flex items-center gap-3">
        {activeSkills.slice(0, 5).map((skill) => (
          <div key={skill.code} className="flex items-center gap-1.5">
            <StatusDot status={skill.status} color={getCategoryColor(skill.code)} size="sm" />
            <span className="font-display text-[11px] text-slate-400">{skill.code}</span>
            <span className="font-data text-[9px] text-slate-600 uppercase">{skill.status}</span>
          </div>
        ))}
      </div>

      <div className="h-3 w-px bg-white/10" />

      <div className="flex items-center gap-1.5">
        <span className="font-data text-slate-500">Active:</span>
        <span className="font-data" style={{ color: "var(--blue-bright)" }}>
          {activeTaskCount} tasks
        </span>
      </div>

      <div className="h-3 w-px bg-white/10" />

      <div className="flex items-center gap-1.5">
        <span className="font-data text-slate-500">Cost MTD:</span>
        <span className="font-data" style={{ color: "var(--orange-bright)" }}>
          ${costMTD.toFixed(2)}
        </span>
      </div>

      <div className="ml-auto">
        <span className="font-data text-slate-400">{timeStr}</span>
      </div>
    </footer>
  );
}
