import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NewTaskPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/tasks">
              <Button variant="outline">← Back to Tasks</Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Task</h1>
              <p className="text-sm text-gray-500 mt-1">Create a new task for your team</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter task title..."
                  required
                  className="mt-2"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the task in detail..."
                  rows={6}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide clear context and requirements for the task
                </p>
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    name="priority"
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Initial Status</Label>
                  <select
                    id="status"
                    name="status"
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="todo"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Assignee */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    <option value="Rex">Rex</option>
                    <option value="Content Agent">Content Agent</option>
                    <option value="Social Agent">Social Agent</option>
                    <option value="Analytics Agent">Analytics Agent</option>
                    <option value="Finance Agent">Finance Agent</option>
                    <option value="Ops Agent">Ops Agent</option>
                  </select>
                </div>
              </div>

              {/* Tags (optional) */}
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="ui, backend, urgent, milestone-1"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add tags to help categorize and filter tasks
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Link href="/tasks">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Priority Levels</h4>
                <div className="space-y-1">
                  <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                  <Badge className="bg-orange-100 text-orange-800">High</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Medium</Badge>
                  <Badge className="bg-gray-100 text-gray-800">Low</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Status Workflow</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">To Do</Badge>
                    <span className="text-gray-500">→</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                    <span className="text-gray-500">→</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">In Review</Badge>
                    <span className="text-gray-500">→</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Done</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
