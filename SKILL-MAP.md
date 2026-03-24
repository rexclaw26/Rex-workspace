# SKILL-MAP.md — Rex Skills Index
_Last updated: 2026-03-22 | 43 skills total_
_Add to extraPaths. Update whenever a skill is added, removed, or its triggers change._

---

## Always-Active Skills (permanently loaded — never need explicit load)

| Skill | What It Does | Load Condition |
|-------|-------------|----------------|
| humanization-voice | Applies humanization rules to ALL written output | Always active |
| injection-defense | Defends against prompt injection from external content | Always active |
| error-journal | Logs every mistake, near-miss, and correction | Always active |
| quality-gatekeeper | Reviews plans (3+ steps) and deliverables before delivery | Always active — fires on trigger |
| compliance-audit | Daily self-check at end of session | Always active — fires at session close |
| context-optimization | Token budget, subagent sizing, anti-patterns | Always active |
| skill-performance-tracker | Logs skill execution to JSONL after each skill fires | Always active — fires at skill completion |
| nightly-mc-review | Trigger: "NIGHTLY_MC_REVIEW" message | Fires nightly at 11 PM via cron | — | skills/nightly-mc-review/SKILL.md |

---

## On-Demand Skills — Hit Network Core

| Skill | Trigger Phrases | Never Load When | Dependencies | Path |
|-------|----------------|-----------------|--------------|------|
| hit-network-integrator | Any Hit Network ops, strategy, metrics, content, business decisions | Standalone technical tasks with no HN context | humanization-voice | skills/hit-network-integrator/SKILL.md |
| role-identity | Daily reports, system health, agent monitoring, cost tracking, skill deployment, Kelly's operational planning | Non-Kelly sessions | hit-network-integrator | skills/role-identity/SKILL.md |
| humanization-voice | Any writing, drafting, editing, or communication task | Never skip — always active | — | skills/humanization-voice/SKILL.md |
| email-assistant | Check email, inbox review, draft a reply, compose an email, schedule a send | Non-email tasks | humanization-voice, email-signature | skills/email-assistant/SKILL.md |
| email-signature | Any email drafting or composition | Never skip when drafting emails | humanization-voice | skills/email-signature/SKILL.md |
| scheduling-optimizer | Calendar review, optimize my schedule, meeting prep, scheduling requests, agenda | Non-scheduling tasks | gog | skills/scheduling-optimizer/SKILL.md |

---

## On-Demand Skills — Content & Publishing

| Skill | Trigger Phrases | Never Load When | Dependencies | Path |
|-------|----------------|-----------------|--------------|------|
| article-writing | Write an article, blog post, news article, write about [topic] | Non-article content | humanization-voice, seo-audit | skills/article-writing/SKILL.md |
| content-strategy | Content calendar, what should we create, content plan, content strategy, what topics | Not a replacement for content-pipeline | seo-audit, news-aggregation, discord-analytics | skills/content-strategy/SKILL.md |
| x-post-automator | Draft a tweet, schedule X posts, X thread, social media post, post this to X | Long-form content | humanization-voice | skills/x-post-automator/SKILL.md |
| video-editing-director | Edit this video, video editing, clip this, B-roll, highlights, repurpose video | Audio-only tasks | — | skills/video-editing-director/SKILL.md |
| thumbnail-moodboard | Thumbnail, mood board, video thumbnail, visual concepts, design direction | Non-visual tasks | — | skills/thumbnail-moodboard/SKILL.md |
| slide-deck-generator | Make a presentation, pitch deck, slide deck, slides for | Non-presentation tasks | humanization-voice | skills/slide-deck-generator/SKILL.md |

---

## On-Demand Skills — Research & Data

| Skill | Trigger Phrases | Never Load When | Dependencies | Path |
|-------|----------------|-----------------|--------------|------|
| news-aggregation | What's happening in crypto, daily briefing, breaking news, market update | Historical data requests | — | skills/news-aggregation/SKILL.md |
| seo-audit | SEO audit, keyword research, ranking improvement, content optimization, YouTube SEO, organic traffic | X posts (explicitly excluded) | — | skills/seo-audit/SKILL.md |
| web-data-spreadsheet | Pull data from, scrape, get data into spreadsheet, compile data, build a dataset | Tasks not involving external data collection | — | skills/web-data-spreadsheet/SKILL.md |
| discord-analytics | Discord analytics, community data, member engagement, Discord report, how is the community doing | Non-Discord tasks | — | skills/discord-analytics/SKILL.md |
| defi-trade-tracking | DeFi trades, track positions, tax prep, trade history, P&L, wallet transactions | Non-crypto tasks | — | skills/defi-trade-tracking/SKILL.md |
| financial-analysis | Financial analysis, build a model, forecast, ROI calculation, P&L, break-even, is this deal profitable | Crypto price lookups (use news-aggregation instead) | — | skills/financial-analysis/SKILL.md |

---

## On-Demand Skills — Strategy & Business Development

| Skill | Trigger Phrases | Never Load When | Dependencies | Path |
|-------|----------------|-----------------|--------------|------|
| strategic-consulting | Strategy session, brainstorm, McKinsey analysis, strategic analysis, growth strategy, should we do X | Tactical execution tasks | — | skills/strategic-consulting/SKILL.md |
| marketing-mode | Marketing strategy, copywriting, SEO help, conversion optimization, paid advertising, any marketing tactic | Non-marketing tasks | humanization-voice | skills/marketing-mode/SKILL.md |
| sponsor-outreach | Find sponsors, sponsor outreach, pitch to, sponsorship pipeline, brand deals, media kit | Never send without human approval | humanization-voice, email-assistant | skills/sponsor-outreach/SKILL.md |
| invoicing-billing | Create an invoice, billing, track invoices, accounts receivable, AR report, who owes us money | Never send follow-ups without human approval | humanization-voice | skills/invoicing-billing/SKILL.md |
| weekly-scorecard | Weekly scorecard, Monday report, scorecard, weekly update, how did we do this week | Mid-week unless specifically requested | news-aggregation, discord-analytics | skills/weekly-scorecard/SKILL.md |

---

## On-Demand Skills — Tech & Development

| Skill | Trigger Phrases | Never Load When | Dependencies | Path |
|-------|----------------|-----------------|--------------|------|
| website-design | Build a page, website design, frontend, backend, landing page, build me a site | Non-web tasks | — | skills/website-design/SKILL.md |
| frontend-design-ultimate | Landing pages, marketing sites, portfolios, dashboards, static web UI (Vite/Next.js) | Server-side apps needing a database | — | skills/frontend-design-ultimate/SKILL.md |
| frontend-design (superdesign) | Beautiful modern UIs, design guidelines | Prefer frontend-design-ultimate for new builds | — | skills/superdesign/SKILL.md |
| mission-control | Mission Control, build the dashboard, agent dashboard, ops dashboard, Convex app | Non-Mission Control dev | — | skills/mission-control/SKILL.md |
| discord-bot | Discord bot, automate Discord, bot commands, Discord integration, build a bot | Manual Discord ops (use discord skill instead) | — | skills/discord-bot/SKILL.md |
| prompt-engineering-expert | Prompt engineering, custom instructions design, prompt optimization | Non-prompt tasks | — | skills/prompt-engineering-expert/SKILL.md |

---

## On-Demand Skills — OpenClaw System

| Skill | Trigger Phrases | Never Load When | Dependencies | Path |
|-------|----------------|-----------------|--------------|------|
| coding-agent | Building new features/apps, reviewing PRs, refactoring, iterative coding needing file exploration | Simple one-liner fixes, reading code, thread-bound ACP harness requests, ~/clawd workspace | — | /opt/homebrew/lib/node_modules/openclaw/skills/coding-agent/SKILL.md |
| discord | Discord ops via message tool | Non-Discord channels | — | /opt/homebrew/lib/node_modules/openclaw/skills/discord/SKILL.md |
| github | PR status, CI checks, creating/commenting on issues, listing PRs, viewing run logs | Bulk operations across many repos, web UI flows needing browser | — | /opt/homebrew/lib/node_modules/openclaw/skills/github/SKILL.md |
| gh-issues | Fetch GitHub issues, spawn agents to fix, open PRs, monitor review comments | When gh auth not configured | github | /opt/homebrew/lib/node_modules/openclaw/skills/gh-issues/SKILL.md |
| gog | Gmail, Calendar, Drive, Contacts, Sheets, Docs via CLI | Non-Google Workspace tasks | — | /opt/homebrew/lib/node_modules/openclaw/skills/gog/SKILL.md |
| healthcheck | Security audits, firewall/SSH/update hardening, risk posture, OpenClaw cron scheduling, version status | Non-security tasks | — | /opt/homebrew/lib/node_modules/openclaw/skills/healthcheck/SKILL.md |
| node-connect | QR/setup code failures, local Wi-Fi vs VPS issues, pairing errors, Tailscale errors | Non-connection tasks | — | /opt/homebrew/lib/node_modules/openclaw/skills/node-connect/SKILL.md |
| openai-image-gen | Batch-generate images, image gallery | Single image requests (use image tool directly) | — | /opt/homebrew/lib/node_modules/openclaw/skills/openai-image-gen/SKILL.md |
| openai-whisper-api | Transcribe audio | Non-audio tasks | — | /opt/homebrew/lib/node_modules/openclaw/skills/openai-whisper-api/SKILL.md |
| skill-creator | Create a skill, author a skill, tidy up a skill, improve this skill, review the skill, audit the skill | Non-skill-creation tasks | — | /opt/homebrew/lib/node_modules/openclaw/skills/skill-creator/SKILL.md |
| weather | Weather, temperature, forecasts for any location | Historical weather, severe weather alerts, meteorological analysis | — | /opt/homebrew/lib/node_modules/openclaw/skills/weather/SKILL.md |

---

## Skill Dependencies (quick ref)

```
article-writing → humanization-voice, seo-audit
content-strategy → seo-audit, news-aggregation, discord-analytics
sponsor-outreach → humanization-voice, email-assistant
email-assistant → humanization-voice, email-signature
scheduling-optimizer → gog
marketing-mode → humanization-voice
weekly-scorecard → news-aggregation, discord-analytics
gh-issues → github
role-identity → hit-network-integrator
hit-network-integrator → humanization-voice
```

---

## Notes
- Always-active skills fire automatically — never need to be explicitly loaded
- Never load coding-agent for work in ~/clawd workspace
- sponsor-outreach and email-assistant: drafts only — never send without Kelly's explicit approval
- seo-audit explicitly excludes X posts
- frontend-design-ultimate preferred over frontend-design (superdesign) for new builds
- When in doubt between website-design and frontend-design-ultimate: use frontend-design-ultimate for static/marketing, website-design for full-stack with backend
