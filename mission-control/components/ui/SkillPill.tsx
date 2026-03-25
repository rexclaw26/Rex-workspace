"use client";

import { getCategoryColor, getSkillByCode } from "@/config/skill-registry";

interface SkillPillProps {
  skillCode: string;
  showFullName?: boolean;
  size?: "sm" | "md";
}

export default function SkillPill({
  skillCode,
  showFullName = false,
  size = "sm",
}: SkillPillProps) {
  const color = getCategoryColor(skillCode);
  const skill = getSkillByCode(skillCode);
  const label = showFullName && skill ? skill.fullName : skillCode;

  const sizeClasses = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center font-display font-medium rounded ${sizeClasses}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </span>
  );
}
