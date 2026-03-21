"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, AlertCircle } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import SkillPill from "@/components/ui/SkillPill";
import PriorityDots from "@/components/ui/PriorityDots";
import OutputGateBanner from "@/components/gates/OutputGateBanner";
import { EXECUTION_STAGES, formatDuration, formatTokens, formatCost } from "@/lib/execution-engine";

interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    title: string;
    skill?: string;
    skillCode?: string;
    priority: "low" | "medium" | "high" | "critical";
    resultStatus?: string;
    result?: string;
    executionProgress?: number;
    executionStage?: string;
    executionHistory?: Array<{
      timestamp: number;
      skillCode: string;
      resultStatus: string;
      duration: number;
      tokensUsed?: number;
      cost?: number;
      summary?: string;
    }>;
  };
  isExecuting: boolean;
  onApprove: () => void;
  onRequestChanges: () => void;
  onReject: () => void;
  onCancel: () => void;
}

export default function ExecutionModal({
  isOpen,
  onClose,
  task,
  isExecuting,
  onApprove,
  onRequestChanges,
  onReject,
  onCancel,
}: ExecutionModalProps) {
  if (!isOpen) return null;

  const progress = task.executionProgress || 0;
  const currentStage = task.executionStage || "";
  const isCompleted = task.resultStatus === "Completed";
  const isFailed = task.resultStatus === "Failed";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto relative z-10"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <h2 className="font-display text-sm font-semibold flex items-center gap-2">
            {isExecuting && <Loader2 size={16} className="animate-spin text-mc-blue-bright" />}
            {isCompleted && <Check size={16} className="text-green-400" />}
            {isFailed && <AlertCircle size={16} className="text-red-400" />}
            <span className="text-slate-200">
              {isExecuting
                ? "Executing Task"
                : isCompleted
                ? "Task Completed"
                : isFailed
                ? "Task Failed"
                : "Task Result"}
            </span>
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-body text-slate-200">{task.title}</p>
            <div className="flex items-center gap-3">
              {task.skillCode && <SkillPill skillCode={task.skillCode} showFullName />}
              <PriorityDots priority={task.priority} />
            </div>
          </div>

          {isExecuting && (
            <div className="glass p-3 rounded-lg space-y-2">
              <span className="text-label">Progress</span>
              {EXECUTION_STAGES.map((stage, i) => {
                const stageIndex = EXECUTION_STAGES.findIndex((s) => s.key === currentStage);
                const isDone = i < stageIndex;
                const isCurrent = i === stageIndex;
                const isPending = i > stageIndex;
                return (
                  <div key={stage.key} className="flex items-center gap-2 text-xs">
                    <span className="w-4">
                      {isDone && <Check size={12} className="text-green-400" />}
                      {isCurrent && <Loader2 size={12} className="animate-spin text-mc-blue-bright" />}
                      {isPending && <span className="text-slate-600">○</span>}
                    </span>
                    <span className={`font-body ${isCurrent ? "text-slate-200" : isDone ? "text-slate-400" : "text-slate-600"}`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
              <div className="mt-2 h-1 rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-mc-blue"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-right font-data text-[10px] text-slate-500">{progress}%</div>
            </div>
          )}

          {isCompleted && task.result && <OutputGateBanner resultText={task.result} />}

          {(isCompleted || isFailed) && task.result && (
            <div className="glass p-3 rounded-lg">
              <span className="text-label block mb-2">Result Preview</span>
              <p className="text-xs font-body text-slate-300 whitespace-pre-wrap line-clamp-6">
                {task.result}
              </p>
            </div>
          )}

          {isCompleted && (
            <div className="flex gap-2">
              <GlowButton variant="green" onClick={onApprove}>Approve & Done</GlowButton>
              <GlowButton variant="orange" onClick={onRequestChanges}>Request Changes</GlowButton>
              <GlowButton variant="red" onClick={onReject} size="sm">Reject</GlowButton>
            </div>
          )}

          {isExecuting && (
            <GlowButton variant="red" onClick={onCancel} size="sm">Cancel Execution</GlowButton>
          )}

          {task.executionHistory && task.executionHistory.length > 0 && (
            <div className="border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-label">Execution History</span>
              <div className="mt-2 space-y-1">
                {task.executionHistory.map((entry, i) => (
                  <div key={i} className="text-[11px] font-data text-slate-500 flex items-center gap-2">
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    <span>—</span>
                    <span style={{ color: entry.resultStatus === "Completed" ? "var(--status-online)" : "var(--status-offline)" }}>
                      {entry.resultStatus}
                    </span>
                    <span>({formatDuration(entry.duration)})</span>
                    {entry.tokensUsed && <span>{formatTokens(entry.tokensUsed)} tokens</span>}
                    {entry.cost && <span>{formatCost(entry.cost)}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
