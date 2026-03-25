// config/skill-registry.ts
// Single source of truth for all 28 skills in the Openclaw system.
// Skills 1-18 are exposed to Kelly in the UI dropdown.
// Skills 19-28 are foundational/internal and never shown in the dropdown.

export type SkillCategory = "content" | "analytics" | "technical" | "admin";

export interface SkillEntry {
  code: string;
  fullName: string;
  displayName: string;
  category: SkillCategory;
  exposed: boolean;
  description: string;
}

export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  content: "#F97316",
  analytics: "#3B82F6",
  technical: "#22C55E",
  admin: "#EF4444",
};

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  content: "Content",
  analytics: "Analytics",
  technical: "Technical",
  admin: "Admin / Ops",
};

export const SKILL_REGISTRY: Record<string, SkillEntry> = {
  // ── CONTENT (Orange) ──────────────────────────────
  email: {
    code: "email",
    fullName: "email-assistant",
    displayName: "Email Assistant",
    category: "content",
    exposed: true,
    description: "Draft and manage email communications",
  },
  xpost: {
    code: "xpost",
    fullName: "x-post-automator",
    displayName: "X Post Automator",
    category: "content",
    exposed: true,
    description: "Create and schedule X/Twitter posts",
  },
  article: {
    code: "article",
    fullName: "article-writing",
    displayName: "Article Writing",
    category: "content",
    exposed: true,
    description: "Write long-form articles and blog posts",
  },
  video: {
    code: "video",
    fullName: "video-editing-director",
    displayName: "Video Editing Director",
    category: "content",
    exposed: true,
    description: "Direct and manage video editing workflows",
  },
  slide: {
    code: "slide",
    fullName: "slide-deck-generator",
    displayName: "Slide Deck Generator",
    category: "content",
    exposed: true,
    description: "Generate presentation slide decks",
  },
  thumb: {
    code: "thumb",
    fullName: "thumbnail-moodboard",
    displayName: "Thumbnail Moodboard",
    category: "content",
    exposed: true,
    description: "Create thumbnail designs and moodboards",
  },

  // ── ANALYTICS / REPORTING (Blue) ──────────────────
  news: {
    code: "news",
    fullName: "news-aggregation",
    displayName: "News Aggregation",
    category: "analytics",
    exposed: true,
    description: "Aggregate and summarize news from multiple sources",
  },
  scorecard: {
    code: "scorecard",
    fullName: "weekly-scorecard",
    displayName: "Weekly Scorecard",
    category: "analytics",
    exposed: true,
    description: "Generate weekly performance scorecards",
  },
  fin: {
    code: "fin",
    fullName: "financial-analysis",
    displayName: "Financial Analysis",
    category: "analytics",
    exposed: true,
    description: "Perform financial analysis and reporting",
  },
  trade: {
    code: "trade",
    fullName: "defi-trade-tracking",
    displayName: "DeFi Trade Tracking",
    category: "analytics",
    exposed: true,
    description: "Track and analyze DeFi trading activity",
  },
  discord: {
    code: "discord",
    fullName: "discord-analytics",
    displayName: "Discord Analytics",
    category: "analytics",
    exposed: true,
    description: "Analyze Discord server activity and engagement",
  },

  // ── TECHNICAL / DEV (Green) ───────────────────────
  spreadsheet: {
    code: "spreadsheet",
    fullName: "web-data-spreadsheet",
    displayName: "Web Data Spreadsheet",
    category: "technical",
    exposed: true,
    description: "Scrape web data and organize in spreadsheets",
  },
  web: {
    code: "web",
    fullName: "website-design",
    displayName: "Website Design",
    category: "technical",
    exposed: true,
    description: "Design and build website components",
  },
  bot: {
    code: "bot",
    fullName: "discord-bot",
    displayName: "Discord Bot",
    category: "technical",
    exposed: true,
    description: "Build and manage Discord bots",
  },

  // ── ADMIN / OPS (Red) ─────────────────────────────
  sched: {
    code: "sched",
    fullName: "scheduling-optimizer",
    displayName: "Scheduling Optimizer",
    category: "admin",
    exposed: true,
    description: "Optimize scheduling and calendar management",
  },
  invoice: {
    code: "invoice",
    fullName: "invoicing-billing",
    displayName: "Invoicing & Billing",
    category: "admin",
    exposed: true,
    description: "Generate invoices and manage billing",
  },
  sponsor: {
    code: "sponsor",
    fullName: "sponsor-outreach",
    displayName: "Sponsor Outreach",
    category: "admin",
    exposed: true,
    description: "Draft and manage sponsor outreach campaigns",
  },
  strategy: {
    code: "strategy",
    fullName: "strategic-consulting",
    displayName: "Strategic Consulting",
    category: "admin",
    exposed: true,
    description: "Strategic consulting and advisory analysis",
  },

  // ── FOUNDATIONAL / INTERNAL (Not exposed in dropdown) ──
  "hit-net": {
    code: "hit-net",
    fullName: "hit-network-integrator",
    displayName: "HIT Network Integrator",
    category: "technical",
    exposed: false,
    description: "Internal network integration layer",
  },
  injection: {
    code: "injection",
    fullName: "injection-defense",
    displayName: "Injection Defense",
    category: "admin",
    exposed: false,
    description: "Prompt injection defense system",
  },
  humanize: {
    code: "humanize",
    fullName: "humanization-voice",
    displayName: "Humanization Voice",
    category: "content",
    exposed: false,
    description: "LAW 1 humanization processing",
  },
  errlog: {
    code: "errlog",
    fullName: "error-journal",
    displayName: "Error Journal",
    category: "admin",
    exposed: false,
    description: "Error logging and tracking system",
  },
  compliance: {
    code: "compliance",
    fullName: "compliance-audit",
    displayName: "Compliance Audit",
    category: "admin",
    exposed: false,
    description: "Compliance auditing engine",
  },
  adaptive: {
    code: "adaptive",
    fullName: "adaptive-rule-engine",
    displayName: "Adaptive Rule Engine",
    category: "technical",
    exposed: false,
    description: "Dynamic rule processing engine",
  },
  mc: {
    code: "mc",
    fullName: "mission-control",
    displayName: "Mission Control",
    category: "technical",
    exposed: false,
    description: "Mission Control self-management",
  },
  pipeline: {
    code: "pipeline",
    fullName: "content-pipeline",
    displayName: "Content Pipeline",
    category: "content",
    exposed: false,
    description: "Content pipeline orchestration",
  },
  "role-id": {
    code: "role-id",
    fullName: "role-identity",
    displayName: "Role Identity",
    category: "admin",
    exposed: false,
    description: "Agent role identity management",
  },
  "email-sig": {
    code: "email-sig",
    fullName: "email-signature",
    displayName: "Email Signature",
    category: "content",
    exposed: false,
    description: "Email signature management",
  },
};

// Helper: get only exposed skills
export function getExposedSkills(): SkillEntry[] {
  return Object.values(SKILL_REGISTRY).filter((s) => s.exposed);
}

// Helper: get exposed skills grouped by category
export function getExposedSkillsByCategory(): Record<SkillCategory, SkillEntry[]> {
  const exposed = getExposedSkills();
  const grouped: Record<SkillCategory, SkillEntry[]> = {
    content: [],
    analytics: [],
    technical: [],
    admin: [],
  };
  exposed.forEach((skill) => {
    grouped[skill.category].push(skill);
  });
  return grouped;
}

// Helper: find skill by full name
export function getSkillByFullName(fullName: string): SkillEntry | undefined {
  return Object.values(SKILL_REGISTRY).find((s) => s.fullName === fullName);
}

// Helper: find skill by code
export function getSkillByCode(code: string): SkillEntry | undefined {
  return SKILL_REGISTRY[code];
}

// Helper: get category color for a skill code
export function getCategoryColor(code: string): string {
  const skill = SKILL_REGISTRY[code];
  if (!skill) return "#6B7280";
  return CATEGORY_COLORS[skill.category];
}
