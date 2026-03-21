"use client";

import { AlertTriangle, Eye, Check, X } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

interface ApprovalGateProps {
  action: string;
  onPreview: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function ApprovalGate({
  action,
  onPreview,
  onApprove,
  onReject,
}: ApprovalGateProps) {
  return (
    <div
      className="glass rounded-lg p-4 space-y-3"
      style={{
        borderWidth: "1px",
        borderColor: "var(--orange-primary)",
        boxShadow: "0 0 15px var(--orange-glow)",
      }}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} style={{ color: "var(--orange-primary)" }} />
        <span className="font-display text-sm font-semibold text-slate-200">
          APPROVAL REQUIRED — LAW 6
        </span>
      </div>
      <p className="text-xs font-body text-slate-400">
        This task involves an external action:
      </p>
      <p className="text-sm font-body text-slate-200 italic">"{action}"</p>
      <div className="flex gap-2 pt-2">
        <GlowButton variant="ghost" size="sm" onClick={onPreview}>
          <Eye size={14} />
          Preview Output
        </GlowButton>
        <GlowButton variant="green" size="sm" onClick={onApprove}>
          <Check size={14} />
          Approve
        </GlowButton>
        <GlowButton variant="red" size="sm" onClick={onReject}>
          <X size={14} />
          Reject
        </GlowButton>
      </div>
    </div>
  );
}
