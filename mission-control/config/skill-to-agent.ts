// config/skill-to-agent.ts
// Maps each skill's full name to the agent that handles it.
// Currently all 18 exposed skills route to Rex.
// When new agents come online, update this map — single source of truth.

export const SKILL_AGENT_MAP: Record<string, string> = {
  "email-assistant": "Rex",
  "x-post-automator": "Rex",
  "article-writing": "Rex",
  "video-editing-director": "Rex",
  "slide-deck-generator": "Rex",
  "thumbnail-moodboard": "Rex",
  "news-aggregation": "Rex",
  "weekly-scorecard": "Rex",
  "financial-analysis": "Rex",
  "defi-trade-tracking": "Rex",
  "discord-analytics": "Rex",
  "web-data-spreadsheet": "Rex",
  "website-design": "Rex",
  "discord-bot": "Rex",
  "scheduling-optimizer": "Rex",
  "invoicing-billing": "Rex",
  "sponsor-outreach": "Rex",
  "strategic-consulting": "Rex",
  // Future multi-agent support:
  // 'some-new-skill': 'Claude',
  // 'another-skill': 'OtherAgent',
};

export function getAgentForSkill(skillFullName: string): string {
  return SKILL_AGENT_MAP[skillFullName] || "Rex";
}

export function getAllAgents(): string[] {
  return [...new Set(Object.values(SKILL_AGENT_MAP))];
}
