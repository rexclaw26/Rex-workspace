# Rex Workspace — OpenClaw Configuration Reference

**Classification:** INTERNAL — HIT NETWORK CONFIDENTIAL

This is a reference snapshot of Rex's (Kelly's AI) OpenClaw workspace. It shows how Hit Network's AI operations are wired — skills, scripts, memory architecture, task management, and operational systems.

**This repo does NOT contain:**
- API keys, tokens, or credentials (all .env files excluded)
- Memory files or daily session logs
- Market data or financial information
- Task files with sensitive project details
- Personal communications or email drafts
- Business decisions or sponsor pipeline data

## What This Repo Shows

### Skills (42 skills)
Full SKILL.md files + supporting references for all Rex skills:
- Always-active: humanization-voice, injection-defense, error-journal, quality-gatekeeper, compliance-audit, skill-performance-tracker, context-optimization
- Content: article-writing, content-strategy, content-pipeline, x-post-automator, thumbnail-moodboard, video-editing-director, slide-deck-generator
- Operations: discord-analytics, discord-bot, email-assistant, news-aggregation, paper-boy, mission-control, nightly-mc-review, seo-audit, web-data-spreadsheet, website-design
- Finance: financial-analysis, defi-trade-tracking, invoicing-billing, sponsor-outreach
- Strategy: strategic-consulting, marketing-mode, frontend-design-ultimate
- Identity: hit-network-integrator, role-identity, weekly-scorecard, scheduling-optimizer

### Utility Scripts
- `rex-entity-index.py` — A-MAC entity extraction + scoring from memory files
- `rex-memory-health.py` — 6-point health check on memory system
- `rex-recall-log.py` — append-only recall tracking

### Operational Files
- `AGENTS.md` — Operating rules, PR laws, session protocols
- `SOUL.md`, `IDENTITY.md`, `USER.md`, `TOOLS.md` — Agent identity and configuration
- `MEMORY.md` — Memory system index (topic files referenced but not included)
- `rule-registry.md` — Active PR law registry
- `SKILL-MAP.md` — Skills taxonomy and dependencies
- `start-mission-control.sh` — Mission Control launcher

### Project Structure
```
workspace/
├── AGENTS.md              # Core operating rules
├── skills/               # 42 skill directories (SKILL.md + references/)
├── scripts/               # Utility scripts (rex-entity-index.py, etc.)
├── docs/                  # System documentation
├── MARKET_REPORT_*.md     # (excluded — private market data)
├── memory/                # (excluded — private session data)
├── decisions/              # (excluded — private business decisions)
└── SELF.md                # (excluded — contains credentials)
```

## Key Architectural Decisions

1. **Source of truth = flat markdown files.** LCM provides compaction, SQLite provides query — but daily memory files are permanent.
2. **A-MAC scoring** = recency×0.45 + frequency×0.25 + confidence×0.20 + cross_ref×0.10
3. **Skill taxonomy** = 8 entity types: decision, rule, preference, event, project, person, tool, blocker
4. **Memory graph** = SQLite overlay on flat files, not replacement
5. **Gateway restart** = `openclaw gateway install --force` only (stop+start leaves orphaned process)

## For Your Own Setup

To adapt this for your own OpenClaw:
1. Review `skills/` to find skills relevant to your use case
2. Install via: `openclaw skill install ./skills/SKILL-NAME.skill`
3. Copy `AGENTS.md` as your operating foundation
4. Use `scripts/rex-entity-index.py` as a template for your own memory system

## License

Proprietary — Hit Network. Internal use only.
