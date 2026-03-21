// hooks/useTaskExecution.ts
"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { EXECUTION_STAGES, getStageProgress } from "@/lib/execution-engine";

export interface ExecutionState {
  isExecuting: boolean;
  stage: string;
  progress: number;
  error: string | null;
  result: string | null;
  resultStatus: string | null;
}

export function useTaskExecution(taskId: Id<"tasks"> | null) {
  const [executionState, setExecutionState] = useState<ExecutionState>({
    isExecuting: false,
    stage: "",
    progress: 0,
    error: null,
    result: null,
    resultStatus: null,
  });

  const spawnAgent = useMutation(api.agents.spawn as any);
  const updateTaskExecution = useMutation(api.tasks.updateExecution);
  const addExecutionHistory = useMutation(api.tasks.addExecutionHistory);

  const executionLogs = useQuery(
    api.executionLog.getByTask,
    taskId ? { taskId } : "skip"
  );

  const executeTask = useCallback(
    async (params: {
      skill: string;
      skillCode: string;
      description: string;
      agent: string;
      model?: string;
    }) => {
      if (!taskId) return;

      setExecutionState({
        isExecuting: true,
        stage: "routing",
        progress: 10,
        error: null,
        result: null,
        resultStatus: null,
      });

      const startTime = Date.now();

      try {
        const result = await (spawnAgent as any)({
          taskId,
          skill: params.skill,
          skillCode: params.skillCode,
          taskDescription: params.description,
          agentId: params.agent,
          model: params.model,
        });

        if (result.status === "failed") {
          throw new Error(result.error || "Execution failed");
        }

        setExecutionState((prev) => ({
          ...prev,
          stage: "loading",
          progress: 25,
        }));
      } catch (error: any) {
        const duration = Date.now() - startTime;

        setExecutionState({
          isExecuting: false,
          stage: "failed",
          progress: 0,
          error: error.message,
          result: null,
          resultStatus: "Failed",
        });

        await addExecutionHistory({
          id: taskId,
          entry: {
            timestamp: Date.now(),
            skill: params.skill,
            skillCode: params.skillCode,
            resultStatus: "Failed",
            duration,
            summary: error.message,
          },
        });
      }
    },
    [taskId, spawnAgent, updateTaskExecution, addExecutionHistory]
  );

  const cancelExecution = useCallback(async () => {
    if (!taskId) return;
    await updateTaskExecution({
      id: taskId,
      resultStatus: "Cancelled",
      executionProgress: 0,
      executionStage: "cancelled",
    });
    setExecutionState({
      isExecuting: false,
      stage: "cancelled",
      progress: 0,
      error: "Cancelled by user",
      result: null,
      resultStatus: "Cancelled",
    });
  }, [taskId, updateTaskExecution]);

  return {
    executionState,
    executeTask,
    cancelExecution,
    executionLogs,
    stages: EXECUTION_STAGES,
  };
}
