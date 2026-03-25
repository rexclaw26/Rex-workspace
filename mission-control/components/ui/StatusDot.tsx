"use client";

interface StatusDotProps {
  status: "online" | "offline" | "degraded" | "running" | "idle";
  color?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

const statusColors: Record<string, string> = {
  online: "bg-green-500",
  offline: "bg-red-500",
  degraded: "bg-yellow-500",
  running: "bg-cyan-400",
  idle: "bg-slate-500",
};

const sizes = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
};

export default function StatusDot({
  status,
  color,
  size = "md",
  pulse,
}: StatusDotProps) {
  const shouldPulse = pulse ?? (status === "online" || status === "running");
  const bgColor = color ? "" : statusColors[status] || "bg-slate-500";

  return (
    <span className="relative inline-flex">
      <span
        className={`${sizes[size]} rounded-full ${bgColor} ${shouldPulse ? "animate-pulse-dot" : ""}`}
        style={color ? { backgroundColor: color } : undefined}
      />
      {shouldPulse && (
        <span
          className={`absolute inset-0 ${sizes[size]} rounded-full ${bgColor} opacity-40 animate-ping`}
          style={color ? { backgroundColor: color } : undefined}
        />
      )}
    </span>
  );
}
