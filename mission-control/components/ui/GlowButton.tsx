"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "blue" | "orange" | "red" | "green" | "ghost";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  blue: "bg-mc-blue/20 border-mc-blue/50 text-mc-blue-bright hover:bg-mc-blue/30 hover:border-mc-blue-bright",
  orange: "bg-mc-orange/20 border-mc-orange/50 text-mc-orange-bright hover:bg-mc-orange/30 hover:border-mc-orange-bright",
  red: "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-400",
  green: "bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30 hover:border-green-400",
  ghost: "bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200",
};

const glowStyles: Record<Variant, string> = {
  blue: "animate-glow-blue",
  orange: "animate-glow-orange",
  red: "",
  green: "",
  ghost: "",
};

const sizeStyles = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export default function GlowButton({
  children,
  variant = "blue",
  size = "md",
  glow = false,
  loading = false,
  className = "",
  disabled,
  ...props
}: GlowButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 border rounded-md font-body font-semibold transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${glow ? glowStyles[variant] : ""}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
