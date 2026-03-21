"use client";

import Board from "@/components/kanban/Board";

export default function TasksPage() {
  return (
    <div className="h-full">
      <div className="p-4 pb-0">
        <h1 className="font-display text-xl font-bold text-slate-200">Tasks</h1>
        <p className="text-sm font-body text-slate-500 mt-1">
          Manage and execute tasks across all skills
        </p>
      </div>
      <Board
        onRunTask={(id) => console.log("Run task:", id)}
        onTaskClick={(id) => console.log("Click task:", id)}
      />
    </div>
  );
}
