// lib/execution-engine.ts
// Task execution orchestration — manages spawning and tracking

import { getExecutionRoute } from "./skill-routes";

export interface ExecutionRequest {
  taskId: string;
  skill: string;
  skillCode: string;
  description: string;
  agent: string;
  model?: string;
}

export interface ExecutionStatus {
  stage: "routing" | "loading" | "executing" | "reviewing" | "complete" | "failed";
  progress: number;
  startTime: number;
  duration?: number;
  error?: string;
}

export const EXECUTION_STAGES = [
  { key: "routing", label: "Routing to agent", progressAt: 10 },
  { key: "loading", label: "Skill loaded", progressAt: 25 },
  { key: "executing", label: "Executing", progressAt: 50 },
  { key: "reviewing", label: "Review gate", progressAt: 80 },
  { key: "complete", label: "Output ready", progressAt: 100 },
] as const;

export function getStageIndex(stage: string): number {
  return EXECUTION_STAGES.findIndex((s) => s.key === stage);
}

export function getStageProgress(stage: string): number {
  const found = EXECUTION_STAGES.find((s) => s.key === stage);
  return found?.progressAt ?? 0;
}

export function buildExecutionRequest(
  taskId: string,
  skillFullName: string,
  description: string,
  model?: string
): ExecutionRequest | null {
  const route = getExecutionRoute(skillFullName);
  if (!route) return null;

  return {
    taskId,
    skill: route.skill,
    skillCode: route.skillCode,
    description,
    agent: route.agent,
    model,
  };
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatTokens(count: number): string {
  if (count < 1000) return `${count}`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(2)}M`;
}

export function formatCost(usd: number): string {
  return `$${usd.toFixed(2)}`;
}
