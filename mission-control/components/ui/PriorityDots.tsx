"use client";

interface PriorityDotsProps {
  priority: "low" | "medium" | "high" | "critical";
}

const config = {
  low: { count: 1, colorClass: "bg-gray-500", glowClass: "" },
  medium: { count: 2, colorClass: "bg-mc-blue", glowClass: "" },
  high: { count: 3, colorClass: "bg-mc-orange", glowClass: "" },
  critical: { count: 4, colorClass: "bg-red-500", glowClass: "animate-glow-red" },
};

export default function PriorityDots({ priority }: PriorityDotsProps) {
  const { count, colorClass, glowClass } = config[priority];

  return (
    <div className={`flex items-center gap-0.5 ${glowClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
      ))}
      <span className="ml-1.5 text-xs font-body text-slate-400 uppercase">
        {priority}
      </span>
    </div>
  );
}
