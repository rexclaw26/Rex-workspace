"use client";

import { motion } from "framer-motion";
import SkillPill from "@/components/ui/SkillPill";

interface ChainNode {
  skillCode: string;
  status: "pending" | "running" | "completed" | "failed" | "awaiting_approval";
  requiresApproval: boolean;
}

interface ChainVisualizationProps {
  nodes: ChainNode[];
}

export default function ChainVisualization({ nodes }: ChainVisualizationProps) {
  if (nodes.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      {nodes.map((node, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div
              className={`glass px-3 py-2 rounded-lg flex items-center gap-2 ${
                node.status === "running"
                  ? "border-mc-blue-bright border"
                  : node.status === "completed"
                  ? "border-green-500/50 border"
                  : node.status === "failed"
                  ? "border-red-500/50 border"
                  : ""
              }`}
            >
              <SkillPill skillCode={node.skillCode} />
              <span
                className={`w-2 h-2 rounded-full ${
                  node.status === "completed"
                    ? "bg-green-500"
                    : node.status === "running"
                    ? "bg-cyan-400 animate-pulse-dot"
                    : node.status === "failed"
                    ? "bg-red-500"
                    : node.status === "awaiting_approval"
                    ? "bg-orange-500 animate-pulse-dot"
                    : "bg-slate-600"
                }`}
              />
            </div>
          </motion.div>

          {i < nodes.length - 1 && (
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ delay: i * 0.1 + 0.05 }}
            >
              <div className="w-6 h-px bg-slate-600" />
              <span className="text-[10px]">
                {nodes[i + 1]?.requiresApproval ? "🛑" : "🔓"}
              </span>
              <div className="w-6 h-px bg-slate-600" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
