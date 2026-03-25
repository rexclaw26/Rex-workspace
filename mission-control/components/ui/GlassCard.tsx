"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  borderColor?: string;
  onClick?: () => void;
  animate?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  borderColor,
  onClick,
  animate = true,
}: GlassCardProps) {
  const baseClasses = "glass-card p-4";
  const borderStyle = borderColor
    ? { borderLeftWidth: "3px", borderLeftColor: borderColor }
    : {};

  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        style={borderStyle}
        onClick={onClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={onClick ? { scale: 1.01 } : undefined}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={borderStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
