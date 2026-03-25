import Link from "next/link";
import { Activity, CheckCircle2, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Hit Network AI Operations Overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tasks/new">
            <Button>Create Task</Button>
          </Link>
          <Link href="/memory/new">
            <Button variant="outline">Log Memory</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents Online</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">6/6</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">8 in progress, 4 to review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$87.50</div>
            <p className="text-xs text-muted-foreground mt-1">29% of budget used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors This Week</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="text-xs text-muted-foreground mt-1">All resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (70%) - Tasks + Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks Kanban Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tasks Board</CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-muted rounded-lg p-3">
                  <h3 className="font-semibold text-muted-foreground mb-3 text-xs uppercase tracking-wide">To Do</h3>
                  <div className="space-y-2">
                    <div className="bg-card border border-border rounded p-2 text-sm text-foreground">
                      Build Mission Control
                    </div>
                    <div className="bg-card border border-border rounded p-2 text-sm text-foreground">
                      Setup Cost Tracking
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 text-xs uppercase tracking-wide">In Progress</h3>
                  <div className="space-y-2">
                    <div className="bg-card border border-blue-200 dark:border-blue-800 rounded p-2 text-sm text-foreground">
                      Database Schema
                    </div>
                    <div className="bg-card border border-blue-200 dark:border-blue-800 rounded p-2 text-sm text-foreground">
                      API Routes
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-3">
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-3 text-xs uppercase tracking-wide">In Review</h3>
                  <div className="space-y-2">
                    <div className="bg-card border border-yellow-200 dark:border-yellow-800 rounded p-2 text-sm text-foreground">
                      Agent Health
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3">
                  <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3 text-xs uppercase tracking-wide">Done</h3>
                  <div className="space-y-2">
                    <div className="bg-card border border-green-200 dark:border-green-800 rounded p-2 text-sm text-foreground">
                      Prisma Setup
                    </div>
                    <div className="bg-card border border-green-200 dark:border-green-800 rounded p-2 text-sm text-foreground">
                      shadcn Init
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Rex</span> created task{" "}
                      <span className="font-medium">Build Mission Control</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">
                      Cost entry added: <span className="font-medium">$200 - Claude Max</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Analytics Agent</span> health check passed
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (30%) - Agent Health */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Agent Health</CardTitle>
              <Link href="/agents">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Rex", uptime: "99.9%", lastSeen: "Now" },
                  { name: "Content Agent", uptime: "99.8%", lastSeen: "Now" },
                  { name: "Social Agent", uptime: "99.7%", lastSeen: "Now" },
                  { name: "Analytics Agent", uptime: "99.9%", lastSeen: "Now" },
                  { name: "Finance Agent", uptime: "99.6%", lastSeen: "Now" },
                  { name: "Ops Agent", uptime: "99.8%", lastSeen: "Now" },
                ].map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">Last seen: {agent.lastSeen}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                        active
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{agent.uptime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
