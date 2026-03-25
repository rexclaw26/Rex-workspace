import Link from "next/link";
import { Activity, CheckCircle2, Clock, AlertCircle, Zap, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { Agent } from "@prisma/client";

export default async function AgentsPage() {
  const agents: Agent[] = await prisma.agent.findMany({
    orderBy: { name: "asc" },
  });

  const demoAgents = [
    { id: "1", name: "Rex", codename: "Rex", model: "anthropic/claude-sonnet-4-6", status: "active", uptime: 99.9, lastSeen: new Date(), createdAt: new Date("2026-03-02"), updatedAt: new Date("2026-03-02"), skillsDeployed: 28, skillsTotal: 28 },
    { id: "2", name: "Content Agent", codename: "Content", model: "anthropic/claude-sonnet-4-6", status: "active", uptime: 99.8, lastSeen: new Date(), createdAt: new Date("2026-03-02"), updatedAt: new Date("2026-03-02"), skillsDeployed: 8, skillsTotal: 8 },
    { id: "3", name: "Social Agent", codename: "Social", model: "anthropic/claude-sonnet-4-6", status: "active", uptime: 99.7, lastSeen: new Date(), createdAt: new Date("2026-03-02"), updatedAt: new Date("2026-03-02"), skillsDeployed: 10, skillsTotal: 10 },
    { id: "4", name: "Analytics Agent", codename: "Analytics", model: "anthropic/claude-sonnet-4-6", status: "active", uptime: 99.9, lastSeen: new Date(), createdAt: new Date("2026-03-02"), updatedAt: new Date("2026-03-02"), skillsDeployed: 4, skillsTotal: 4 },
    { id: "5", name: "Finance Agent", codename: "Finance", model: "anthropic/claude-sonnet-4-6", status: "active", uptime: 99.6, lastSeen: new Date(), createdAt: new Date("2026-03-02"), updatedAt: new Date("2026-03-02"), skillsDeployed: 3, skillsTotal: 3 },
    { id: "6", name: "Ops Agent", codename: "Ops", model: "anthropic/claude-sonnet-4-6", status: "active", uptime: 99.8, lastSeen: new Date(), createdAt: new Date("2026-03-02"), updatedAt: new Date("2026-03-02"), skillsDeployed: 2, skillsTotal: 2 },
  ];

  const agentList = agents.length > 0 ? agents : demoAgents;

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800",
    inactive: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800",
    error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800",
  };

  const uptimeColor = (uptime: number) => {
    if (uptime >= 99.5) return "text-green-600 dark:text-green-400";
    if (uptime >= 95) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agents</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor health and performance of all AI agents</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{agentList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {agentList.filter((a) => a.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {((agentList as any[]).reduce((acc, a) => acc + a.uptime, 0) / agentList.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground font-medium">Just now</div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentList.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent as any}
            statusColors={statusColors}
            uptimeColor={uptimeColor}
          />
        ))}
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Agent Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">What Each Agent Does</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong className="text-foreground">Rex:</strong> Head of AI &amp; Product Development</li>
                <li><strong className="text-foreground">Content:</strong> Articles, videos, scripts</li>
                <li><strong className="text-foreground">Social:</strong> X/Twitter automation</li>
                <li><strong className="text-foreground">Analytics:</strong> Discord &amp; web data</li>
                <li><strong className="text-foreground">Finance:</strong> Invoicing &amp; costs</li>
                <li><strong className="text-foreground">Ops:</strong> System monitoring</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">Status Indicators</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className={statusColors.active}>Active</Badge>
                  <span className="text-muted-foreground">Normal operation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors.inactive}>Inactive</Badge>
                  <span className="text-muted-foreground">Offline or paused</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors.error}>Error</Badge>
                  <span className="text-muted-foreground">Needs attention</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">Key Metrics</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong className="text-foreground">Uptime:</strong> Last 24h availability</li>
                <li><strong className="text-foreground">API Calls:</strong> Requests processed</li>
                <li><strong className="text-foreground">Last Seen:</strong> Last activity timestamp</li>
                <li><strong className="text-foreground">Errors:</strong> Failed requests</li>
                <li><strong className="text-foreground">Skills:</strong> Deployed capabilities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AgentCard({ agent, statusColors, uptimeColor }: { agent: any; statusColors: any; uptimeColor: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{agent.name}</CardTitle>
            {agent.codename && (
              <p className="text-xs text-muted-foreground mt-1">Codename: {agent.codename}</p>
            )}
          </div>
          <Badge className={statusColors[agent.status]}>{agent.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{agent.model?.split("/").pop() || "Unknown"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className={uptimeColor(agent.uptime)}>{agent.uptime}% uptime</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">
            {agent.lastSeen ? new Date(agent.lastSeen).toLocaleTimeString() : "Unknown"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">
            {agent.skillsDeployed || agent.skills?.length || 0} / {agent.skillsTotal || 28} skills
          </span>
        </div>

        <div className="flex gap-2 pt-3 border-t border-border">
          <Link href={`/agents/${agent.id}`}>
            <Button size="sm" variant="outline">View Details</Button>
          </Link>
          <Button size="sm">
            <AlertCircle className="h-3 w-3 mr-1" />
            Diagnostics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
