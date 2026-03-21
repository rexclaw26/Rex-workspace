import Link from "next/link";
import { ArrowLeft, Calendar, User, Edit2, Trash2, CheckCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock task data (will connect to Prisma later)
const task = {
  id: "3",
  title: "Define Database Schema",
  description: "Create Prisma schema for Agents, Tasks, Costs, Memories with proper relationships and constraints. Ensure all models have timestamps and proper indexing.",
  status: "in_progress",
  priority: "high",
  dueDate: new Date("2026-03-02"),
  assignedTo: "Rex",
  createdAt: new Date("2026-03-02"),
  updatedAt: new Date("2026-03-02"),
};

export default function TaskDetailPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "in_review":
        return "bg-yellow-100 text-yellow-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "in_review":
        return "In Review";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/tasks">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tasks
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(task.status)}>{getStatusBadge(task.status)}</Badge>
              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{task.description}</p>
              </CardContent>
            </Card>

            {/* Edit Section */}
            <Card>
              <CardHeader>
                <CardTitle>Update Task</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <select
                      id="edit-status"
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                      defaultValue={task.status}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="edit-priority">Priority</Label>
                    <select
                      id="edit-priority"
                      className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                      defaultValue={task.priority}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    <div>
                      <p className="text-sm text-gray-900">Task created</p>
                      <p className="text-xs text-gray-500">2 hours ago by Rex</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                    <div>
                      <p className="text-sm text-gray-900">Status changed to In Progress</p>
                      <p className="text-xs text-gray-500">1 hour ago by Rex</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Meta Info */}
          <div className="space-y-6">
            {/* Assignee */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assignee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{task.assignedTo || "Unassigned"}</p>
                    <p className="text-xs text-gray-500">Task owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Due Date */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Due Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
                  </span>
                </div>
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(task.dueDate).getTime() < Date.now() ? "Overdue" : "Due soon"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Done
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <X className="h-4 w-4 mr-2" />
                  Cancel Task
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
