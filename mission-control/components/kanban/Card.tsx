"use client";

import { useState } from "react";
import { Play, Eye, RotateCw, MoreHorizontal, Loader2 } from "lucide-react";
import PriorityDots from "@/components/ui/PriorityDots";
import SkillPill from "@/components/ui/SkillPill";
import { getCategoryColor } from "@/config/skill-registry";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: "low" | "medium" | "high" | "critical";
  agentCodename: string;
  skill?: string;
  skillCode?: string;
  resultStatus?: string;
  dueDate?: number;
  parentId?: string;
}

interface CardProps {
  task: Task;
  onRun: () => void;
  onClick: () => void;
}

export default function Card({ task, onRun, onClick }: CardProps) {
  const [isRunning, setIsRunning] = useState(false);

  const borderColor = task.skillCode
    ? getCategoryColor(task.skillCode)
    : "var(--border-default)";

  const canRun =
    task.skill &&
    (task.status === "todo" || task.status === "in_progress") &&
    task.resultStatus !== "Running";

  const isInReview = task.status === "in_review";
  const isDone = task.status === "done";

  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.resultStatus === "Running") return;
    setIsRunning(true);
    onRun();
    setTimeout(() => setIsRunning(false), 2000);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const dueDateStr = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      className="glass-card p-3 cursor-pointer"
      style={{ borderLeftWidth: "3px", borderLeftColor: borderColor }}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-center justify-between mb-2">
        <PriorityDots priority={task.priority} />
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-slate-600 hover:text-slate-400 transition-colors"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      <h3 className="text-sm font-body font-semibold text-slate-200 mb-1 line-clamp-2">
        {task.title}
      </h3>

      {task.skillCode && (
        <div className="mb-2">
          <SkillPill skillCode={task.skillCode} />
          {task.skill && (
            <span className="ml-2 text-[10px] font-body text-slate-600">{task.skill}</span>
          )}
        </div>
      )}

      {task.parentId && (
        <div className="text-[10px] font-body text-slate-600 mb-2">↳ subtask</div>
      )}

      <div
        className="flex items-center justify-between mt-2 pt-2 border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        {dueDateStr ? (
          <span className="text-[11px] font-data text-slate-500">Due: {dueDateStr}</span>
        ) : (
          <span />
        )}

        {canRun && (
          <button
            onClick={handleRun}
            className={`
              flex items-center gap-1 px-2 py-1 rounded text-[11px] font-body font-semibold transition-all duration-200
              ${
                isRunning || task.resultStatus === "Running"
                  ? "bg-mc-blue/20 text-mc-blue-bright"
                  : "bg-mc-orange/20 text-mc-orange-bright hover:bg-mc-orange/30 border border-mc-orange/30"
              }
            `}
          >
            {isRunning || task.resultStatus === "Running" ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                RUNNING...
              </>
            ) : (
              <>
                <Play size={12} />
                RUN
              </>
            )}
          </button>
        )}

        {isInReview && (
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-body font-semibold bg-mc-blue/20 text-mc-blue-bright border border-mc-blue/30"
          >
            <Eye size={12} />
            View Result
          </button>
        )}

        {isDone && task.skill && (
          <button
            onClick={handleRun}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-body font-semibold bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10"
          >
            <RotateCw size={12} />
            Re-run
          </button>
        )}
      </div>
    </div>
  );
}
