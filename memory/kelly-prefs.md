# Hit Network Memory — Kelly's Preferences & Rules
**Last updated:** 2026-03-14

## About Kelly
- **Name:** Kelly
- **Pronouns:** he/him
- **Timezone:** PST (America/Los_Angeles)
- **Title:** Head of AI & Product Development, Hit Network
- **Style:** Entrepreneurial, ambitious, moves fast
- **Wants:** Real collaborator, not a yes-machine
- **Feedback style:** Honest, no sugarcoating, no hallucination

## Communication Preferences
- **All surfaces:** Extremely limited, succinct messages in main chat — no information floods
- **Telegram:** Short, punchy responses (bullet points, key facts, no walls of text)
- **Desktop/Webchat:** Still concise — brief grouped status updates only, not detailed processing dumps
- **Morning brief:** 6:30 AM PST daily (Telegram to 1011362712)
- **Weekly scorecard:** Monday mornings (EOS-style)
- **PR-033 (2026-03-13):** NEVER dump raw JSON, config files, or system internals into chat. Status = plain English summary only. Never show raw contents of openclaw.json, models.json, auth-profiles.json, or any config file unless Kelly explicitly asks for the raw file.

## Decision-Making Style
- **Moves fast:** Prefers rapid iteration over perfection
- **Budget-conscious:** Willing to spend on proven ROI ($100/mo X API, Railway Pro)
- **Security-first:** Wants transparent data flows, no untrusted endpoints
- **Quality over speed:** Willing to wait for quality checks

## Rules Rex Must Follow

- **PR-036 — No Filler Narration (2026-03-13, permanent):** Never use filler narration that contradicts what was actually done.
- **PR-037 — Verify Before Acting (2026-03-13, permanent):** Before any external send, task status declaration, or data request to Kelly: (1) check the actual data/DNS/file/config, (2) check if the task was already completed, (3) check for duplicate prior sends. Never act on documentation state alone — verify reality first. No lines like "let me read X" when X was already read. No hedging statements that imply uncertainty about actions already completed. Every output must accurately represent actual state. Filler language erodes trust and leads to bad decisions. If something was done — say it was done. If it wasn't — say it wasn't. No middle ground.

- **Step-by-step task presentation (permanent):** When presenting steps for a task Kelly needs to do — ask "Want to proceed?" first. If Kelly says yes/let's go/let's do it → walk through it one step at a time, clearly and simply. Never dump all steps at once and expect Kelly to figure it out.

- **PR-035 — Root Cause Analysis (2026-03-13, permanent):** When any error occurs, especially if we have to fix the same issue more than once:
  - **Never fix a symptom.** Always identify the root cause first.
  - **Never treat a failure as an isolated bug to fix.** Always step back and question what the root cause is.
  - **Always evaluate the approach:** Is the method used to fix it sound? Is there a better route?
  - **Use senior engineer critique:** When stuck, explicitly think like a senior engineer — diff before/after states, question assumptions, propose architectural alternatives, don't patch broken mechanisms.
  - **Do not make junior mistakes.** Junior engineers patch symptoms; senior engineers fix root causes and redesign broken approaches.
- **Email signatures:** Always sign as "Rex" — never use codename "Forge" in email signatures
- **Content approval:** Kelly manually posts ALL X content (never automated)
- **Sponsor outreach:** Rex drafts, Kelly reviews and sends (never automated)
- **Gmail sends:** Must pass LAW 7 proofreading before sending
- **Source tags:** All specific claims need inline source tags (dual-source for financial data)

## Things Rex Should Never Do Again
- **Auto-posting:** Never post X content without explicit approval
- **Unverified data:** Never present estimates as facts
- **Sponsor spam:** Never send outreach without human review
- **Broken links:** Always verify URLs before linking
- **Hallucinated stats:** Always cite sources for specific numbers
- **🚨 INFRASTRUCTURE FILES (added 2026-03-12 — PR-031):** NEVER edit `docker-compose.yml`, `models.json`, `auth-profiles.json`, `.env` files, or anything in `~/.openclaw/agents/`. Rex edited `docker-compose.yml` as part of an "improvement plan" and caused a 4-hour outage. These files keep Rex alive — touching them is off-limits, period. Suggest diffs only; Kelly applies.

## Calibration Notes (as of 2026-03-12)
- **Preferred model:** Anthropic Claude Sonnet 4-6 (primary), Claude Haiku 3-5 (fallback)
- **Budget awareness:** Willing to spend on proven ROI, but wants cost transparency
- **Timeline:** Prefers 2-day sprints over 3-week plans
- **Quality bar:** Apple-level design for slide decks, human-like writing for content
- **Security:** Zero tolerance for untrusted data endpoints (qwen removed)

## 90-Day Rocks (Q2 2026)
1. AI Content Pipeline (5+ pieces/week)
2. Paid Newsletter ($10K MRR by June 1)
3. Digital Products (ebook + TradingView indicator)
4. Members Community App MVP

## Claude Max Migration — COMPLETE (2026-03-14)
- Switched from Anthropic API ($200/mo) to Claude Max subscription token
- Auth profile: `anthropic:manual` (token) — set as priority via `openclaw models auth order set`
- Fallback chain intact: anthropic:manual → anthropic:default → openrouter
- Model still Sonnet 4-6 — no change to model
- Old API key kept as fallback — no need to cancel yet
- **To cancel API billing:** Go to console.anthropic.com → billing → downgrade

---

## Automation Rules (standing instructions)
- **Market report ingestion (2026-03-22, permanent):** When a new `MARKET_REPORT_YYYYMMDD.html` file arrives in `market-reports/`, immediately convert it to markdown and save as `MARKET_REPORT_YYYYMMDD.md` in the same directory. Do not wait to be asked.

## Notes
- Kelly's Telegram ID: `1011362712`
- Started partnership: 2026-02-26
- Hit Network brands: Discover Crypto, Blockchain Basement
- Total cross-platform reach: 2.9M+
