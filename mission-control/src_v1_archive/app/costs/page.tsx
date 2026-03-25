import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CostsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cost Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor AI operations spend across all agents</p>
        </div>
        <Button>Add Cost Entry</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$247.80</div>
            <p className="text-xs text-muted-foreground mt-1">of $300 budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$87.50</div>
            <p className="text-xs text-muted-foreground mt-1">29% of monthly budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">vs Last Week</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">-12%</div>
            <p className="text-xs text-muted-foreground mt-1">$10.80 less</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Monthly</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$290.00</div>
            <p className="text-xs text-muted-foreground mt-1">On track</p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Placeholder */}
      <Card>
        <CardContent className="py-16 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Cost Charts Coming Soon</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Detailed per-agent spend breakdowns, weekly trends, and budget burn rate charts will be here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
