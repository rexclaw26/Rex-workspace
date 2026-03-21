import Link from "next/link";
import prisma from "@/lib/db";
import { Task } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function TasksPage() {
  const tasks: Task[] = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    in_review: tasks.filter((t) => t.status === "in_review"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks Board</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all active tasks</p>
        </div>
        <Link href="/tasks/new">
          <Button>New Task</Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{columns.todo.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{columns.in_progress.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{columns.in_review.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{columns.done.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {/* To Do Column */}
        <div className="bg-muted rounded-lg p-4 min-h-[500px]">
          <h3 className="font-semibold text-muted-foreground mb-4 flex items-center justify-between text-sm">
            To Do
            <Badge variant="outline">{columns.todo.length}</Badge>
          </h3>
          <div className="space-y-3">
            {columns.todo.map((task) => (
              <TaskCard key={task.id} task={task} priorityColor={getPriorityColor(task.priority)} />
            ))}
            {columns.todo.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">No tasks</div>
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 min-h-[500px]">
          <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-4 flex items-center justify-between text-sm">
            In Progress
            <Badge variant="outline">{columns.in_progress.length}</Badge>
          </h3>
          <div className="space-y-3">
            {columns.in_progress.map((task) => (
              <TaskCard key={task.id} task={task} priorityColor={getPriorityColor(task.priority)} />
            ))}
            {columns.in_progress.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">No tasks</div>
            )}
          </div>
        </div>

        {/* In Review Column */}
        <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-4 min-h-[500px]">
          <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-4 flex items-center justify-between text-sm">
            In Review
            <Badge variant="outline">{columns.in_review.length}</Badge>
          </h3>
          <div className="space-y-3">
            {columns.in_review.map((task) => (
              <TaskCard key={task.id} task={task} priorityColor={getPriorityColor(task.priority)} />
            ))}
            {columns.in_review.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">No tasks</div>
            )}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 min-h-[500px]">
          <h3 className="font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center justify-between text-sm">
            Done
            <Badge variant="outline">{columns.done.length}</Badge>
          </h3>
          <div className="space-y-3">
            {columns.done.map((task) => (
              <TaskCard key={task.id} task={task} priorityColor={getPriorityColor(task.priority)} />
            ))}
            {columns.done.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">No tasks</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, priorityColor }: { task: Task; priorityColor: string }) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <Badge className={priorityColor}>{task.priority}</Badge>
        </div>
        <h4 className="font-medium text-foreground text-sm mb-1">{task.title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        <div className="mt-3 flex items-center justify-between">
          {task.assignedTo && (
            <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
          )}
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
