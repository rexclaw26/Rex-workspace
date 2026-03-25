// tailwind.config.ts — Mission Control v2 theme extensions
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "mc-bg": {
          primary: "#0A0E1A",
          secondary: "#111827",
          tertiary: "#1A2035",
          elevated: "#1E2642",
        },
        "mc-blue": {
          dim: "#1E3A5F",
          DEFAULT: "#3B82F6",
          bright: "#60A5FA",
          neon: "#00D4FF",
        },
        "mc-orange": {
          dim: "#5C2D0E",
          DEFAULT: "#F97316",
          bright: "#FB923C",
          neon: "#FF6B00",
        },
        "mc-cat": {
          content: "#F97316",
          analytics: "#3B82F6",
          technical: "#22C55E",
          admin: "#EF4444",
        },
      },
      fontFamily: {
        display: ["JetBrains Mono", "monospace"],
        body: ["Outfit", "sans-serif"],
        data: ["Share Tech Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow-blue": "glow-blue 2s ease-in-out infinite",
        "glow-orange": "glow-orange 2s ease-in-out infinite",
        "scan-line": "scan-line 2s linear",
      },
      keyframes: {
        "glow-blue": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" },
        },
        "glow-orange": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(249, 115, 22, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(249, 115, 22, 0.6)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
