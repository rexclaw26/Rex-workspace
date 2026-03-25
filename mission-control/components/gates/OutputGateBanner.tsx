"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, ShieldAlert, ShieldX } from "lucide-react";
import { parseGateOutput, extractGateSection } from "@/lib/gate-parser";

interface OutputGateBannerProps {
  resultText: string;
}

export default function OutputGateBanner({ resultText }: OutputGateBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const gateSection = extractGateSection(resultText);
  const { gates, allPassed, anyFailed, hasMissing } = parseGateOutput(gateSection);

  const borderColor = allPassed
    ? "var(--status-online)"
    : anyFailed
    ? "var(--status-offline)"
    : "var(--orange-primary)";

  const Icon = allPassed ? Shield : anyFailed ? ShieldX : ShieldAlert;
  const label = allPassed ? "VERIFIED" : anyFailed ? "FAILED" : "NEEDS REVIEW";

  return (
    <div
      className="glass rounded-lg overflow-hidden"
      style={{ borderWidth: "1px", borderColor }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: borderColor }} />
          <span className="font-display text-xs font-semibold text-slate-200">
            OUTPUT GATE — {label}
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} className="text-slate-500" />
        ) : (
          <ChevronDown size={14} className="text-slate-500" />
        )}
      </button>

      {!expanded && (
        <div className="px-3 pb-2 flex gap-4">
          {gates.map((gate) => (
            <span key={gate.law} className="text-[10px] font-data text-slate-400">
              LAW {gate.law}: {gate.passed ? "✓" : "✕"}
            </span>
          ))}
        </div>
      )}

      {expanded && (
        <div
          className="px-3 pb-3 space-y-1.5 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {gates.map((gate) => (
            <div key={gate.law} className="flex items-center gap-3 text-xs">
              <span className={`font-data ${gate.passed ? "text-green-400" : "text-red-400"}`}>
                {gate.passed ? "✅" : "❌"}
              </span>
              <span className="font-data text-slate-500">LAW {gate.law}</span>
              <span className="font-body text-slate-300">{gate.name}</span>
              <span className={`ml-auto font-data text-[10px] ${gate.passed ? "text-green-400" : "text-red-400"}`}>
                {gate.passed ? "PASS" : "FAIL"}
              </span>
            </div>
          ))}
          {hasMissing && (
            <p className="text-[10px] font-body text-yellow-500 mt-2">
              Some gate checks were not found in the output.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
