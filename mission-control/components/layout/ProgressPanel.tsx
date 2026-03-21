"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, CopyPlus } from "lucide-react";
import SkillPill from "@/components/ui/SkillPill";

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  skillCode?: string;
  resultStatus?: string;
  updatedAt: number;
}

interface ProgressPanelProps {
  completedCount: number;
  totalCount: number;
  incompleteTasks: Task[];
  completedTasks: Task[];
  onTaskClick: (taskId: string) => void;
  onRepeatTask: (taskId: string) => void;
  onSimilarTask: (taskId: string) => void;
}

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getStatusBadge(resultStatus?: string) {
  if (!resultStatus) return null;
  const colors: Record<string, string> = {
    Completed: "bg-green-500/20 text-green-400 border-green-500/30",
    Failed: "bg-red-500/20 text-red-400 border-red-500/30",
    NeedsReview: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Running: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  };
  return (
    <span className={`text-[9px] font-data px-1 py-0.5 rounded border ${colors[resultStatus] || "text-slate-500"}`}>
      {resultStatus}
    </span>
  );
}

export default function ProgressPanel({
  completedCount,
  totalCount,
  incompleteTasks,
  completedTasks,
  onTaskClick,
  onRepeatTask,
  onSimilarTask,
}: ProgressPanelProps) {
  const [activeFilter, setActiveFilter] = useState<"incomplete" | "completed">("incomplete");
  const tasks = activeFilter === "incomplete" ? incompleteTasks : completedTasks;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <aside
      className="glass fixed right-0 top-12 bottom-8 z-30 flex flex-col"
      style={{
        width: "var(--progress-panel-width)",
        borderLeft: "1px solid var(--glass-border)",
      }}
    >
      <div className="p-4 space-y-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <span className="text-label">Mission Status</span>
        <div className="text-center">
          <div className="font-data text-3xl" style={{ color: "var(--blue-neon)" }}>
            {completedCount} / {totalCount}
          </div>
          <div className="text-xs font-body text-slate-500 mt-1">Tasks Done</div>
          <div className="mt-2 h-1 rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--blue-primary)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("incomplete")}
            className={`flex-1 py-2 rounded text-xs font-body font-semibold transition-all ${
              activeFilter === "incomplete"
                ? "bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                : "bg-white/5 text-slate-500 border border-white/10 hover:border-white/20"
            }`}
          >
            Incomplete ({incompleteTasks.length})
          </button>
          <button
            onClick={() => setActiveFilter("completed")}
            className={`flex-1 py-2 rounded text-xs font-body font-semibold transition-all ${
              activeFilter === "completed"
                ? "bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                : "bg-white/5 text-slate-500 border border-white/10 hover:border-white/20"
            }`}
          >
            Completed ({completedTasks.length})
          </button>
        </div>
      </div>

      <div className="px-4 py-2">
        <span className="text-label">Log</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-2.5 cursor-pointer group"
              style={{
                borderLeftWidth: "2px",
                borderLeftColor:
                  task.status === "done"
                    ? "var(--status-online)"
                    : "var(--status-offline)",
              }}
              onClick={() => onTaskClick(task._id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-body text-slate-200 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.skillCode && <SkillPill skillCode={task.skillCode} size="sm" />}
                    <span className="text-[10px] font-data text-slate-600">
                      {relativeTime(task.updatedAt)}
                    </span>
                    {getStatusBadge(task.resultStatus)}
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); onRepeatTask(task._id); }}
                    className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300"
                    title="Repeat task"
                  >
                    <RotateCw size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSimilarTask(task._id); }}
                    className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300"
                    title="Create similar task"
                  >
                    <CopyPlus size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-xs font-body">
            No {activeFilter} tasks
          </div>
        )}
      </div>
    </aside>
  );
}
