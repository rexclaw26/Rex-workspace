// lib/chain-engine.ts
// Chain execution state machine — manages multi-step skill chains
// Mission Control manages chain state in Convex, triggers each step via sessions_spawn

export interface ChainStep {
  skill: string;
  skillCode: string;
  requiresApproval: boolean;
  config?: string;
}

export interface ChainDefinition {
  name: string;
  steps: ChainStep[];
}

export interface ChainState {
  chainId: string;
  currentStepIndex: number;
  steps: ChainStepState[];
  status: "running" | "paused" | "completed" | "failed";
}

export interface ChainStepState {
  skill: string;
  skillCode: string;
  status: "pending" | "running" | "completed" | "failed" | "awaiting_approval";
  taskId?: string;
  result?: string;
  error?: string;
  startedAt?: number;
  completedAt?: number;
}

export function createChainState(
  chainId: string,
  definition: ChainDefinition
): ChainState {
  return {
    chainId,
    currentStepIndex: 0,
    steps: definition.steps.map((step) => ({
      skill: step.skill,
      skillCode: step.skillCode,
      status: "pending",
    })),
    status: "running",
  };
}

export function getNextStep(state: ChainState): ChainStep | null {
  if (state.currentStepIndex >= state.steps.length) return null;
  const stepState = state.steps[state.currentStepIndex];
  if (stepState.status === "completed") {
    const nextIndex = state.currentStepIndex + 1;
    if (nextIndex >= state.steps.length) return null;
    return {
      skill: state.steps[nextIndex].skill,
      skillCode: state.steps[nextIndex].skillCode,
      requiresApproval: false,
    };
  }
  return {
    skill: stepState.skill,
    skillCode: stepState.skillCode,
    requiresApproval: false,
  };
}

export function shouldAutoExecute(step: ChainStep): boolean {
  return !step.requiresApproval;
}

export function isChainComplete(state: ChainState): boolean {
  return state.steps.every((s) => s.status === "completed");
}

export function isChainFailed(state: ChainState): boolean {
  return state.steps.some((s) => s.status === "failed");
}

export function serializeChainConfig(definition: ChainDefinition): string {
  return JSON.stringify(definition);
}

export function deserializeChainConfig(json: string): ChainDefinition | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
