"use client";

import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

interface Alert {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  timestamp: number;
}

interface AlertFeedProps {
  alerts: Alert[];
}

const typeConfig = {
  success: { icon: CheckCircle, color: "text-green-400", border: "border-green-500/20" },
  error: { icon: XCircle, color: "text-red-400", border: "border-red-500/20" },
  warning: { icon: AlertTriangle, color: "text-orange-400", border: "border-orange-500/20" },
  info: { icon: Info, color: "text-blue-400", border: "border-blue-500/20" },
};

export default function AlertFeed({ alerts }: AlertFeedProps) {
  return (
    <div className="glass-card p-4">
      <h3 className="font-display text-sm font-semibold text-slate-200 mb-3">Alert Feed</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {alerts.map((alert) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-2 p-2 rounded border ${config.border} bg-white/[0.02]`}
            >
              <Icon size={14} className={`${config.color} mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-body text-slate-300">{alert.message}</p>
                <span className="text-[10px] font-data text-slate-600">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <p className="text-xs text-slate-600 text-center py-4">No alerts</p>
        )}
      </div>
    </div>
  );
}
