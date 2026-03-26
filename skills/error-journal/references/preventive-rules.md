# Preventive Rules — Accumulated Rule Set

Agent: Rex
Last reviewed: 2026-03-25

---

## Active Rules

### Rule Format
```
Rule ID: PR-[###]
Date added: [YYYY-MM-DD]
Triggered by: [Error entry reference]
Error type prevented: [type]
Rule: [Specific, actionable rule — what to check or do differently]
Status: Active
```

---

## PR-001 through PR-037 (Deduplicated)

Rule ID: PR-001
Date added: 2026-03-04
Triggered by: Error Entry 2026-03-04 (Humanization failure on email draft)
Error type prevented: Rule Violation — Humanization Framework not applied
Rule: Before drafting ANY written content (email, post, article, script, report, slide deck, internal doc), load skills/humanization-voice/SKILL.md and run the 7-point verification checklist before presenting output to Kelly. No exceptions. If any check fails, rewrite before presenting.
Status: Active

---

Rule ID: PR-002
Date added: 2026-03-04
Triggered by: Error Entry 2026-03-04 (Wrong email signature — Forge instead of Rex)
Error type prevented: Rule Violation — Incorrect email signature
Rule: ALL emails (internal and external, any recipient) must sign off as "Rex | Hit Network / On behalf of Kelly, Head of AI & Product Development / Hit Network." Never use the codename Forge in any email signature. Ever.
Status: Active

---

Rule ID: PR-003 [SHARED LEARNING]
Date added: 2026-03-04
Triggered by: Error Entry 2026-03-04 (Humanization failure)
Error type prevented: Always-active skills being skipped
Rule: humanization-voice, injection-defense, error-journal, and compliance-audit are always-active skills. They do not require a trigger keyword. They apply to every session and every output without exception.
Status: Active

---

Rule ID: PR-004
Date added: 2026-03-04
Triggered by: Error Entry 2026-03-04 (Scheduled delivery failure — sub-agent timeout)
Error type prevented: Reliability failure — Automated tasks not completing due to timeout limits
Rule: NEVER use `sessions_spawn` with `runTimeoutSeconds` > 30 minutes for scheduled delivery tasks. OpenClaw kills long-running sub-agents to prevent resource drain. Instead:
  - Option A: Use `exec` with `yieldMs` for background sleep processes
  - Option B: Use OpenClaw's native cron/scheduling system if available
  - Option C: Write task to file now, send immediately, and note "scheduled for X time"
  - Option D: Spawn a short-lived task (5-10 min) that checks a flag or file, then sleeps — chain multiple tasks
Always test timeout behavior with short durations first before committing to long waits.
Status: Active

---

Rule ID: PR-005
Date added: 2026-03-05
Triggered by: Error Entry 2026-03-05 (Em dash violation + missing hybrid content rule)
Error type prevented: Rule Violation — Em dashes in email subject/body
Rule: ZERO em dashes anywhere in email content — subject lines, body copy, headers, list items. No exceptions except pull-quote attribution. Use colons, commas, or line breaks instead. When writing a structured email, apply the Hybrid Content Rule: technical lists/steps stay structured; subject, intro, transitions, outro must all pass MAXIMUM humanization.
Status: Active

---

Rule ID: PR-006
Date added: 2026-03-05
Triggered by: Error Entry 2026-03-05 (Gate marked PASS without real verification)
Error type prevented: Process Failure — False-pass gate check
Rule: The OUTPUT GATE before every email must list all 7 humanization checklist items explicitly with a real ✅ or ❌ per item — not a placeholder. If any item is ❌, rewrite before presenting the draft. Never mark OVERALL LAW 1 as PASS if any individual item is ❌.
Status: Active

---

Rule ID: PR-007
Date added: 2026-03-05
Triggered by: Error Entry 2026-03-05 (Errors not proactively logged)
Error type prevented: Process Failure — Errors acknowledged verbally but not logged
Rule: The moment Rex recognizes a mistake — especially when saying "That's on me", "I should have", "I missed that", or "my mistake" — immediately open the error journal and log it. Do not wait for Kelly to ask. Verbal acknowledgment without a journal entry is not enough. Recognition = log.
Status: Active

---

Rule ID: PR-008
Date added: 2026-03-05
Triggered by: Error Entry 2026-03-05 (Em dashes present after gate claimed PASS — second occurrence)
Error type prevented: Self-review bias — author cannot reliably proofread own output
Rule: ALL outbound emails must pass a sub-agent proofread before sending. Rex writes the draft, spawns a sub-agent with the draft + full humanization rules, waits for structured PASS/FAIL response. If FAIL, Rex fixes the specific violations and loops back to sub-agent. NEVER send without a sub-agent PASS. Rex's own gate check is supplementary only.
Status: Active

---

Rule ID: PR-009
Date added: 2026-03-06
Triggered by: Error Entry 2026-03-06 (System messages surfacing to Kelly — recurring)
Error type prevented: Unnecessary system/cron messages interrupting Kelly's workflow
Rule: When a cron job or system message completes, apply strict triage BEFORE responding:
  - SURFACE: Market reports, breaking news, urgent alerts, errors requiring action, receipts Kelly asked about
  - NO_REPLY: Empty/malformed Gmail notifications, routine confirmations, status pings with nothing actionable
  - If mid-active-conversation: default to NO_REPLY unless genuinely urgent
  - Receipts: auto-log to ai-spend.json silently, NO_REPLY unless Kelly asks about spend
Status: Active

---

Rule ID: PR-010
Date added: 2026-03-07
Triggered by: Error Entry 2026-03-07 (Duplicate Telegram messages)
Error type prevented: Duplicate message delivery to user
Rule: NEVER call message(action=send) for content that a cron job will already deliver via --announce. Before using the message tool to send a user-facing update, check: is this cron configured with --announce or --deliver? If YES → the cron already sends. Reply NO_REPLY. A brief status correction is acceptable if the auto-delivered content contained an error.
Status: Active

---

Rule ID: PR-011
Date added: 2026-03-07
Triggered by: Error Entry 2026-03-07 (Pipeline checkpoint failure — synthesis step not fired)
Error type prevented: Silent pipeline failure in multi-step async workflows
Rule: EVERY multi-step pipeline (3+ steps) MUST have two hard checkpoints:
  CHECKPOINT 1 — PIPELINE_STATE.md: Immediately after launching a pipeline, write pipeline state (steps, status, output paths, triggers, fallbacks). Update after each step.
  CHECKPOINT 2 — Backup Verification Cron: Set a backup cron 30-60 minutes BEFORE delivery deadline that reads PIPELINE_STATE.md, checks output files exist, and spawns missing steps if needed. A watchdog that only logs is useless — it must spawn recovery.
Status: Active

---

Rule ID: PR-012
Date added: 2026-03-07
Triggered by: Error Entry 2026-03-07 (Dashboard agent card fabricated metrics)
Error type prevented: Data fabrication — static config data displayed as dynamic metrics
Rule: NEVER use X/Y ratio format, progress bars, or "Active/Running/Live" labels for static configuration data.
  - Static data → use plain descriptive text: "5 skills assigned", "configured"
  - Dynamic data → ratio / progress bar / status badge only when backed by real runtime state
  - "Online" / "Active" status → only if a real heartbeat or health check backs it
  - Progress bars → only when value changes over time toward a real goal
Status: Active

---

Rule ID: PR-013
Date added: 2026-03-07
Triggered by: Error Entry 2026-03-07 (Telegram delivery gap caused by main session LLM timeout)
Error type prevented: Main session crash causing Telegram delivery blackout on long tasks
Rule: Heavy multi-file builds (5+ files OR >30K total bytes of code) MUST run in sub-agents, never inline in the main session. Main session has a hard 10-minute LLM timeout. If a task involves writing multiple large files, spawn a sub-agent. The main session orchestrates and monitors only.
Status: Active

---

Rule ID: PR-014
Date added: 2026-03-07
Triggered by: Error Entry 2026-03-07 (NO_REPLY leak + dual delivery to Telegram)
Error type prevented: Duplicate or confusing Telegram deliveries from mixed routing paths
Rule: When channel=telegram is active, ALL session replies auto-route to Telegram. NO_REPLY is NOT suppressed on Telegram. The message tool and session reply must never both fire in the same turn.
  - System/user message arrives, I want to respond → reply in session only
  - Waiting for parallel sub-agents → brief session reply only
  - Proactive message (no incoming turn) → message(action=send) only
Status: Active

---

Rule ID: PR-018
Date added: 2026-03-07
Triggered by: Law Enforcement Audit 2026-03-07 — LAW 5 gap
Error type prevented: Unsourced numeric claims in chat responses treated as exempt
Rule: Source tags apply to ALL specific numeric claims, prices, dates, statistics, percentages, and named metrics in ANY output format — chat responses included. "External-facing only" is not a valid exemption. Unknown source = say "I don't have a verified source" — never state the number as fact.
Status: Active

---

Rule ID: PR-019
Date added: 2026-03-07
Triggered by: Law Enforcement Audit 2026-03-07 — Session startup confirmation gap
Error type prevented: Startup green light firing when files were actually skipped
Rule: The 🟢 Session ready confirmation must explicitly list every file read with individual ✅/❌ per file. Format: `🟢 Session ready: SOUL ✅ | USER ✅ | memory/YYYY-MM-DD ✅ | MEMORY ✅ | TASK_INDEX ✅ | active tasks: [list] | laws active`. Generic "memory loaded" = violation. Missing or unreadable file = mark ❌ and note why.
Status: Active

---

Rule ID: PR-020
Date added: 2026-03-07
Triggered by: Law Enforcement Audit 2026-03-07 — Build-Critic threshold gap
Error type prevented: Skipping Build-Critic by rationalizing output as "not complex enough"
Rule: Build-Critic trigger = intent, not size. If the output is a finished deliverable Kelly will act on, read, present, send, or publish — the loop runs. No exceptions. "Is Kelly receiving this as finished output?" Yes = Build-Critic runs.
Status: Active

---

Rule ID: PR-021
Date added: 2026-03-07
Triggered by: Law Enforcement Audit 2026-03-07 — LAW 2 circular compliance gap
Error type prevented: Compliance self-check running silently with zero visibility to Kelly
Rule: Compliance check score and any failures MUST be written to memory/YYYY-MM-DD.md at session close. Format: `## Session Close — [time] | Compliance: [X/17] | Failures: [list or none]`. Score absent from memory file = check didn't run.
Status: Active — superseded by PR-029

---

Rule ID: PR-022
Date added: 2026-03-07
Triggered by: Law Enforcement Audit 2026-03-07 — LAW 3 inactivity gap
Error type prevented: Resuming mid-task after long gap without checking handoff state
Rule: If gap between last message timestamp and current is ≥30 minutes — read session-handoff.md FIRST, then open response with current state summary. If gap ≥2 hours — explicitly ask Kelly: pick up where we left off, or shift focus?
Status: Active

---

Rule ID: PR-023
Date added: 2026-03-07
Triggered by: Error Entry 2026-03-07 (TASK-005 cascade failure — 4-hour stall)
Error type prevented: Multi-phase pipeline stalling because cascade depends on main session availability
Rule: ALL multi-phase pipelines must use SELF-CHAINING sub-agents. Each sub-agent, after writing its output and marker, must spawn the next phase itself before exiting. Main session is NOT a reliable cascade coordinator. Each phase: do work → write output → write marker → spawn next phase → exit.
Status: Active

---

Rule ID: PR-024
Date added: 2026-03-07
Triggered by: Error Entry 2026-03-06 (Email sent without sub-agent proof gate)
Error type prevented: Email sent without humanization proof — LAW 1 + LAW 7 violation
Rule: `gog gmail send` MUST be preceded in the same session turn by a visible sub-agent PASS on record. Sequence: (1) Rex drafts → (2) spawns proofreader sub-agent → (3) sub-agent returns PASS/FAIL → (4) OUTPUT GATE block shown to Kelly → (5) Kelly says "send" → (6) ONLY THEN: gog gmail send. Short emails = fewer items to check, not a reason to skip.
Status: Active

---

Rule ID: PR-025
Date added: 2026-03-08
Triggered by: Architecture audit 2026-03-08 — PR-015/PR-016 broken post-compaction
Error type prevented: Context overflow without alert — LAW 9 monitoring broken after compaction
Rule: session_status MUST be called within the first 3 tool calls of EVERY session turn. No threshold. The old rule ("check if context was above 60% last time") was broken post-compaction. Fix: unconditional check every turn. Thresholds for ACTION: <60% continue | 60-79% note internally | 80-84% tell Kelly | 85%+ STOP + pre-flight + wait for signal.
Status: Active — supersedes PR-015 and PR-016

---

Rule ID: PR-026
Date added: 2026-03-08
Triggered by: Architecture audit 2026-03-08 — sub-agent proof gates can be faked
Error type prevented: Gates bypassed via placeholder text without real sub-agent verification
Rule: Every sub-agent proof gate MUST include the actual sessionKey returned by sessions_spawn in the format `agent:main:subagent:[id]`. "run complete", "complete", "N/A", or any placeholder = invalid gate. If Rex cannot provide a real session key, the sub-agent was not actually spawned and the gate must be re-run.
Status: Active

---

Rule ID: PR-027
Date added: 2026-03-08
Triggered by: Architecture audit 2026-03-08 — PRs not loaded at session startup
Error type prevented: Rules existing in preventive-rules.md but never loaded during sessions
Rule: Every PR with enforcement impact must have its actionable rule reproduced in AGENTS.md or MEMORY.md — not just in preventive-rules.md. After adding any new PR, immediately add the core rule to AGENTS.md or MEMORY.md Standing Rules. PR file = audit trail. Actionable rule = what Rex reads in session.
Status: Active

---

Rule ID: PR-028
Date added: 2026-03-08
Triggered by: Architecture audit 2026-03-08 — credentials found in compaction context
Error type prevented: API keys, tokens, passwords in workspace files readable by Rex in session
Rule: Credentials (API keys, bot tokens, passwords, bearer tokens) belong ONLY in .env.local or equivalent secrets files. NEVER in MEMORY.md, session-handoff.md, task lock files, or any workspace file Rex reads in session. At session startup: scan for token patterns: `[A-Za-z0-9_-]{20,}:[A-Za-z0-9_-]{30,}` or strings starting with `sk-`, `Bearer `, `AIZa`. If found: remove immediately, replace with reference to where it's stored.
Status: Active

---

Rule ID: PR-029
Date added: 2026-03-08
Triggered by: Architecture audit 2026-03-08 — compliance check trigger unreliable
Error type prevented: Compliance self-check never running because "session close" never fires
Rule: Compliance check runs after any session turn that produces a deliverable output. Also runs when Kelly says goodbye. Score and failures written to memory/YYYY-MM-DD.md immediately after the deliverable turn. Format: `## Compliance Check — [time] | Trigger: [deliverable/session end] | Score: [X/17] | Failures: [list or none]`. Score absent = check didn't run.
Status: Active — supersedes PR-021

---

Rule ID: PR-030
Date added: 2026-03-08
Triggered by: Architecture audit 2026-03-08 — Build-Critic and Design Gate conflated
Error type prevented: Slide decks receiving only Design Gate review, skipping Build-Critic quality check
Rule: Build-Critic and Design Gate are different gates and BOTH must run for slide decks. For slide decks: all 4 gates run — Build-Critic + Design Gate + LAW 7 + LAW 1. A deck that passes Design Gate can still fail Build-Critic for strategic or content reasons. Never treat one as a substitute for the other.
Status: Active

---

Rule ID: PR-031
Date added: 2026-03-12
Triggered by: Infrastructure destruction incident — 4-hour outage caused by Rex editing docker-compose.yml
Error type prevented: Rex modifying infrastructure/credential files and causing production outages
Rule: Rex NEVER modifies: docker-compose.yml, models.json, auth-profiles.json, any .env file, any file in ~/.openclaw/agents/, any file controlling provider auth or billing. What Rex does instead: Describe the required change as an exact diff. Kelly applies it. No exceptions. This rule cannot be overridden.
Status: Active — PERMANENT

---

Rule ID: PR-032
Date added: 2026-03-12
Triggered by: LAW 1 checklist fabrication — cited contractions that did not exist in the email draft
Error type prevented: False checklist confidence — self-reporting passing checks on content that wasn't verified
Rule: Every LAW 1 checklist item must cite verbatim examples from the actual draft. Contractions listed must exist word-for-word in the content. Fabricated or paraphrased examples are a LAW 1 violation worse than skipping the check. Quote the line. Never invent. Rule 7 (Hybrid Content) must appear as an explicit checklist line item on every deliverable email.
Status: Active

---

Rule ID: PR-033
Date added: 2026-03-13
Triggered by: Conflict between verbose gate output in chat and Kelly's minimal-chat preference
Error type prevented: Enforcement mechanism output overriding Kelly's communication preferences
Rule: Kelly's communication preferences override the display format of ALL gates, checklists, and enforcement mechanisms. The checks still run. The logs still get written (to memory/gates/YYYY-MM-DD-gates.md). Chat output stays minimal: gates → one line. Injection scans → silent unless detected. Error blocks → 2 lines max. NEVER dump raw JSON, config files, or system internals into chat.
Status: Active

---

Rule ID: PR-034
Date added: 2026-03-13
Triggered by: Kelly stated rules that weren't written to kelly-prefs.md; had to re-state same rules next session
Error type prevented: Rules acknowledged in chat but not persisted to memory
Rule: Any rule Kelly states → written to kelly-prefs.md same turn, no exceptions. Acknowledgment in chat is not sufficient. The rule must be in the file before the session ends.
Status: Active

---

Rule ID: PR-035
Date added: 2026-03-13
Triggered by: Gmail debugging session — 4+ hours patching wrong root causes instead of questioning the approach
Error type prevented: Symptom patching instead of root cause analysis
Rule: When any error occurs, especially if the same issue must be fixed more than once: (1) Never fix the symptom — identify root cause first. (2) Never treat a failure as an isolated bug — step back and question fundamentals. (3) Evaluate whether the approach is sound. Propose architectural alternatives. Senior engineers fix root causes; junior engineers patch symptoms.
Status: Active

---

Rule ID: PR-036
Date added: 2026-03-13
Triggered by: Rex said "let me read the remaining skills I haven't fully reviewed yet" after having already read all skills
Error type prevented: Filler narration contradicting actual completed actions — erodes trust, leads to bad decisions
Rule: Never use filler narration that contradicts what was actually done. No "let me check X" when X was already checked. No hedging that implies uncertainty about completed actions. State actual state accurately: if something was done, say so. If it wasn't, say so. No in-between. Applies to ALL outputs without exception.
Status: Active

---

Rule ID: PR-037
Date added: 2026-03-13
Triggered by: Sent duplicate Resend DNS email to Tim — records were already live. TASK-003 surfaced as blocked when account list was already in server.js.
Error type prevented: Duplicate actions / acting on stale documentation state instead of verifying actual current state
Rule: Before executing ANY external action (sending email, sending message, making a change, flagging a task blocked) — verify current state first:
  1. CHECK THE DATA: Run verification (dig, curl, grep, exec) BEFORE acting.
  2. CHECK IF DONE: Search for prior emails, memory entries, task notes, or file evidence this was already completed.
  3. CHECK FOR DUPLICATES: Before sending any external communication, search sent history for prior messages on the same topic.
Status: Active

---

## Retired Rules

Rule ID: PR-015 — RETIRED (superseded by PR-025)
Rule ID: PR-016 — RETIRED (superseded by PR-025)
Rule ID: PR-017 — RETIRED (superseded by PR-033)

---

## PR-038 through PR-046 (Added 2026-03-25)

Rule ID: PR-038
Date added: 2026-03-14
Triggered by: Sub-agent timeout causing incomplete research and missed context
Error type prevented: Sub-agents timing out mid-task with no recovery
Rule: Pre-spawn sizing — run this mental check before every spawn:
  - 1-3 searches + synthesis (<2 min) → single sub-agent, 120s timeout
  - 4-6 searches + fetch + synthesis (2-4 min) → single sub-agent, 280s timeout
  - 7+ searches OR 4+ full page fetches (>4 min) → split into 2-3 parallel sub-agents
  - Unknown scope → default to split — safer than timeout
MANDATORY: Research + Large File Write (>10KB) = Always Split into separate agents. Never combine in one agent.
If timeout occurs: (1) Note which sections completed vs. timed out (2) Do NOT discard completed work (3) Re-spawn ONLY missing sections (4) Combine all results before final output (5) Log timeout in error-journal.
Never apply config patch while a sub-agent is running — gateway restart kills in-flight agents.
Status: Active

---

Rule ID: PR-039
Date added: 2026-03-20
Triggered by: "No record" stated when event may have occurred in session context that was compacted
Error type prevented: Conflating absence-of-file-evidence with absence-of-event
Rule: When I can't find something, I must state exactly what I checked and what I couldn't access. "No record" is never acceptable when the event may have occurred in active session context I can't retrieve. Correct format: "I checked [specific files/tools]. I couldn't access [specific source]. The event may exist in [unreachable location]." Never conflate absence-of-file-evidence with absence-of-event.
Status: Active

---

Rule ID: PR-040
Date added: 2026-03-20
Triggered by: Constructing plausible-sounding explanations for unverified claims under challenge
Error type prevented: Fabricating answers to fill gaps when challenged on unverifiable claims
Rule: When challenged on a figure or claim I cannot source, the only acceptable response is: "I can't verify that." Do not construct an explanation. Do not guess. Do not fill the gap with a plausible-sounding story. Uncertainty gets named, not papered over. This applies with absolute force to financial figures, dates, prices, and any factual claim in public content.
Status: Active

---

Rule ID: PR-041
Date added: 2026-03-20
Triggered by: Unverified financial figures reproduced in X posts and public content
Error type prevented: Unverified financial figures published as current fact
Rule: Any financial figure (price, percentage, market cap, volume, rank) in an X post or public content must be verified against a live source BEFORE the rewrite is presented. Not after. Not when challenged. Before. If a figure can't be verified: flag it explicitly in the draft. Never reproduce unverified financial figures as current fact.
Status: Active

---

Rule ID: PR-042
Date added: 2026-03-21
Triggered by: Reporting Claude Code completion based on agent's own summary without verifying files
Error type prevented: Reporting completion on work that was never actually built
Rule: After ANY coding agent session — timed out OR completed — Rex must verify implementation by checking actual files before reporting done to Kelly. Minimum: grep for key function/component names that should have been created. Never report completion based on agent's own output summary alone. If verification fails: re-spawn for missing sections only, do not report done until verified.
Status: Active

---

Rule ID: PR-043
Date added: 2026-03-21
Triggered by: One mega Claude Code session for DC Data Hub that bundled too many file changes
Error type prevented: Large coding sessions timing out or producing unmanageable diffs
Rule: Max ~5 files per Claude Code session for DC Data Hub builds. Never bundle more than one logical patch group into a single session. Split by: (1) API routes, (2) components, (3) pages. Sequential sessions, not one mega-session.
Status: Active

---

Rule ID: PR-044
Date added: 2026-03-22
Triggered by: Email draft presented to Kelly without gatekeeper review — LAW 1 violation
Error type prevented: Written deliverables bypassing quality gatekeeper sub-agent review
Rule: The quality-gatekeeper sub-agent fires on ALL written deliverables before Kelly sees them. No exceptions. No "quick email" bypass. No "short draft" rationalization. No opt-out under any circumstances.
Deliverables that ALWAYS trigger the gate: every email draft, every X post or social content, every article/script/report, every sponsor pitch or outreach, every slide deck or presentation, any written content leaving this workspace.
The gate confirmation line (⚙️ Gatekeeper ✅) is MANDATORY and must appear BEFORE the draft in Kelly's view. If Kelly sees a draft without that line first, the gate was skipped — that is a LAW violation regardless of whether the content is clean.
"It's a short email" is not a reason. "It's a quick task" is not a reason. "I already checked it mentally" is not a reason. Mental self-checks are not gates.
Status: Active

---

Rule ID: PR-045
Date added: 2026-03-23
Triggered by: Memory gaps after session compaction — context lost with no checkpoint written
Error type prevented: Session compaction destroying context with no persistent memory of what happened
Rule: At the start of EVERY response turn in an active session, Rex calls session_status to check elapsed time. If elapsed time has crossed a 55-minute checkpoint boundary since the last checkpoint, Rex writes the memory checkpoint BEFORE processing the user's message. Checkpoint comes first, always.
Checkpoint intervals: 55 min, 110 min, 165 min, etc. from session start. Early trigger: if context window reaches 80%+ before the 55-min mark, fire checkpoint immediately. Short sessions: if session ends before first 55-min checkpoint, write a short-form close entry (5 bullets max) to today's daily log before closing.
What gets written at each checkpoint — append to memory/YYYY-MM-DD.md: Topics Discussed | Decisions Made | Rule Changes | Errors & Fixes | Context Kelly Provided | Task Progress. Maximum checkpoint size: 400 words. Summarize — do not transcribe.
Canonical write order: (1) memory/YYYY-MM-DD.md — MANDATORY, always first (2) QUICKREF.md — best-effort (3) rule-registry.md — only if new PRs (4) decisions/YYYY-MM.md — only if decisions made.
Status: Active

---

Rule ID: PR-046
Date added: 2026-03-23
Triggered by: Complex tasks being run on wrong model (haiku) causing quality failures
Error type prevented: Complex tasks delegated to insufficient model capability
Rule: Default subagent model is openrouter/anthropic/claude-haiku-3-5. The following task types MUST override to anthropic/claude-sonnet-4-6 — no exceptions, no discretion:
  - Any coding agent (building, fixing, refactoring)
  - Architecture or system design
  - Critic/review passes
  - Multi-file analysis (3+ files)
  - Quality gatekeeper sub-agent
  - Security analysis
Override syntax: pass model: "anthropic/claude-sonnet-4-6" in the sessions_spawn call. Haiku for research, parsing, memory writes. Sonnet for anything requiring deep reasoning, code generation, or security judgment.
Status: Active

---

## Rule Effectiveness Tracking

| Rule ID | Date Added | Recurrence Since Adding | Status |
|---------|-----------|------------------------|--------|
| PR-001 | 2026-03-04 | 1 (2026-03-05) | Active — recurred, rule tightened |
| PR-002 | 2026-03-04 | 0 | Active — monitoring |
| PR-003 | 2026-03-04 | 0 | Active — monitoring |
| PR-004 | 2026-03-04 | 0 | Active — monitoring |
| PR-005 | 2026-03-05 | 0 | Active — monitoring |
| PR-006 | 2026-03-05 | 0 | Active — monitoring |
| PR-007 | 2026-03-05 | 0 | Active — monitoring |
| PR-008 | 2026-03-05 | 0 | Active — monitoring |
| PR-009 | 2026-03-06 | 0 | Active — monitoring |
| PR-010 | 2026-03-07 | 0 | Active — monitoring |
| PR-011 | 2026-03-07 | 0 | Active — monitoring |
| PR-012 | 2026-03-07 | 0 | Active — monitoring |
| PR-013 | 2026-03-07 | 0 | Active — monitoring |
| PR-014 | 2026-03-07 | 0 | Active — monitoring |
| PR-015 | 2026-03-07 | — | Retired — superseded by PR-025 |
| PR-016 | 2026-03-07 | — | Retired — superseded by PR-025 |
| PR-017 | 2026-03-07 | — | Retired — superseded by PR-033 |
| PR-018 | 2026-03-07 | 0 | Active — monitoring |
| PR-019 | 2026-03-07 | 0 | Active — monitoring |
| PR-020 | 2026-03-07 | 0 | Active — monitoring |
| PR-021 | 2026-03-07 | — | Retired — superseded by PR-029 |
| PR-022 | 2026-03-07 | 0 | Active — monitoring |
| PR-023 | 2026-03-07 | 0 | Active — monitoring |
| PR-024 | 2026-03-07 | 0 | Active — monitoring |
| PR-025 | 2026-03-08 | 0 | Active — supersedes PR-015+016 |
| PR-026 | 2026-03-08 | 0 | Active — monitoring |
| PR-027 | 2026-03-08 | 0 | Active — monitoring |
| PR-028 | 2026-03-08 | 0 | Active — monitoring |
| PR-029 | 2026-03-08 | 0 | Active — supersedes PR-021 |
| PR-030 | 2026-03-08 | 0 | Active — monitoring |
| PR-031 | 2026-03-12 | 0 | Active — PERMANENT |
| PR-032 | 2026-03-12 | 0 | Active — monitoring |
| PR-033 | 2026-03-13 | 0 | Active — monitoring |
| PR-034 | 2026-03-13 | 0 | Active — monitoring |
| PR-035 | 2026-03-13 | 0 | Active — monitoring |
| PR-036 | 2026-03-13 | 0 | Active — monitoring |
| PR-037 | 2026-03-13 | 0 | Active — monitoring |
| PR-038 | 2026-03-14 | 0 | Active — monitoring |
| PR-039 | 2026-03-20 | 0 | Active — monitoring |
| PR-040 | 2026-03-20 | 0 | Active — monitoring |
| PR-041 | 2026-03-20 | 0 | Active — monitoring |
| PR-042 | 2026-03-21 | 0 | Active — monitoring |
| PR-043 | 2026-03-21 | 0 | Active — monitoring |
| PR-044 | 2026-03-22 | 0 | Active — monitoring |
| PR-045 | 2026-03-23 | 0 | Active — monitoring |
| PR-046 | 2026-03-23 | 0 | Active — monitoring |

Rule ID: PR-047
Date added: 2026-03-25
Triggered by: Multiple sub-agent and critic timeouts during system audit — agents timed out mid-task with no partial results saved, and critics were asked to do research AND critique simultaneously
Error type prevented: Plans failing silently when agents timeout; critics running without pre-written summaries; all progress lost on timeout
Rule: When planning any research, build, or fix plan:
  1. Chunk to fit the timeout — assume 120s max per agent pass. If 5 things to do, split into 5 agents or sequential passes.
  2. Write partial results immediately upon completion — never at end only. If timeout fires mid-run, file still has what completed.
  3. Continuation protocol — next agent reads partial file, notes what completed vs. missing, does ONLY the missing parts.
  4. Critic gets pre-written summary to critique — never ask a critic to do research AND critique in same pass.
Status: Active

---

Rule ID: PR-048
Date added: 2026-03-25
Triggered by: Gateway restart via `stop && start` leaves orphaned node process (PPID=1) holding port 30322. `start` silently fails. `install --force` is the only reliable restart.
Error type prevented: Gateway restart failing, requiring manual `openclaw gateway install --force` in terminal
Rule: When restarting the gateway from a terminal session, use `openclaw gateway install --force` ONLY. The sequence `stop && start` does not kill the orphaned process. The `install --force` command handles stop + start in one call and works reliably. Alias `openclaw-restart` in .zshrc wraps this.
Status: Active

---

| PR-047 | 2026-03-25 | 0 | Active — monitoring |
| PR-048 | 2026-03-25 | 0 | Active — monitoring |
