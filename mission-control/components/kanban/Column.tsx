"use client";

import { motion } from "framer-motion";
import Card from "./Card";

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

interface ColumnProps {
  id: string;
  label: string;
  tasks: Task[];
  onDrop: (taskId: string, newStatus: string) => void;
  onRunTask: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
}

export default function Column({
  id,
  label,
  tasks,
  onDrop,
  onRunTask,
  onTaskClick,
}: ColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onDrop(taskId, id);
    }
  };

  return (
    <div
      className="flex flex-col min-w-[280px] w-[280px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="glass rounded-t-lg px-3 py-2 flex items-center justify-between mb-2">
        <span className="font-display text-sm font-semibold text-slate-300">{label}</span>
        <span
          className="font-data text-xs px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: "var(--blue-dim)",
            color: "var(--blue-bright)",
          }}
        >
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {tasks.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <Card
              task={task}
              onRun={() => onRunTask(task._id)}
              onClick={() => onTaskClick(task._id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
