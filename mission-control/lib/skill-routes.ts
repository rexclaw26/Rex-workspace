// lib/skill-routes.ts
// Skill definitions and routing logic — extensible interface for future API integration

import { SKILL_REGISTRY, type SkillEntry, type SkillCategory } from "@/config/skill-registry";
import { SKILL_AGENT_MAP, getAgentForSkill } from "@/config/skill-to-agent";

export interface SkillDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  defaultAgent: string;
  category: SkillCategory;
  requiresApproval: boolean;
  exposed: boolean;
  externalAPIs?: string[];
}

// Build full skill definitions from registry + agent map
export function getSkillDefinitions(): SkillDefinition[] {
  return Object.values(SKILL_REGISTRY).map((entry) => ({
    id: entry.fullName,
    code: entry.code,
    name: entry.displayName,
    description: entry.description,
    defaultAgent: getAgentForSkill(entry.fullName),
    category: entry.category,
    requiresApproval: isApprovalRequired(entry),
    exposed: entry.exposed,
  }));
}

// Skills that involve external actions require LAW 6 approval
function isApprovalRequired(skill: SkillEntry): boolean {
  const externalSkills = [
    "email-assistant",
    "x-post-automator",
    "sponsor-outreach",
    "discord-bot",
    "invoicing-billing",
  ];
  return externalSkills.includes(skill.fullName);
}

// Validate that a skill exists
export function validateSkill(skillFullName: string): boolean {
  return Object.values(SKILL_REGISTRY).some((s) => s.fullName === skillFullName);
}

// Get skill + agent routing info for execution
export function getExecutionRoute(skillFullName: string) {
  const skill = Object.values(SKILL_REGISTRY).find(
    (s) => s.fullName === skillFullName
  );
  if (!skill) return null;

  return {
    skill: skill.fullName,
    skillCode: skill.code,
    agent: getAgentForSkill(skill.fullName),
    category: skill.category,
    requiresApproval: isApprovalRequired(skill),
  };
}

// Search skills by query (matches code, fullName, displayName, description)
export function searchSkills(query: string, exposedOnly = true): SkillEntry[] {
  const q = query.toLowerCase();
  return Object.values(SKILL_REGISTRY).filter((skill) => {
    if (exposedOnly && !skill.exposed) return false;
    return (
      skill.code.toLowerCase().includes(q) ||
      skill.fullName.toLowerCase().includes(q) ||
      skill.displayName.toLowerCase().includes(q) ||
      skill.description.toLowerCase().includes(q)
    );
  });
}
