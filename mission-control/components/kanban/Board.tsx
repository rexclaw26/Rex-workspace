"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Column from "./Column";

const COLUMNS = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_review", label: "In Review" },
  { id: "done", label: "Done" },
] as const;

interface BoardProps {
  onRunTask: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
}

export default function Board({ onRunTask, onTaskClick }: BoardProps) {
  const tasks = useQuery(api.tasks.getAll) || [];
  const updateStatus = useMutation(api.tasks.updateStatus);

  const handleDrop = async (taskId: string, newStatus: string) => {
    await updateStatus({
      id: taskId as Id<"tasks">,
      status: newStatus as any,
    });
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto p-4">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        return (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            tasks={columnTasks}
            onDrop={handleDrop}
            onRunTask={onRunTask}
            onTaskClick={onTaskClick}
          />
        );
      })}
    </div>
  );
}
