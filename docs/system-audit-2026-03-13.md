# Hit Network AI System — Full Architecture Audit
**Date:** 2026-03-13
**Prepared by:** Rex (Phase 1 assessment — pre-critique)
**Scope:** All workspace files, skills, memory, task flows, cron jobs, laws, enforcement mechanisms

---

## Executive Summary

The system is fundamentally well-designed and has improved significantly through a hard-won learning curve. The core architecture — SOUL + USER + AGENTS.md + memory topic files + skills + task locks — is solid. Laws are thorough. Error journal and preventive rules show real learning. The Gmail polling integration and Mission Control are working.

But there are real gaps. Self-enforcement is the single biggest structural weakness: every law, every gate, every check can be bypassed simply by Rex choosing not to run it. Secondary issues: rule sprawl across too many files creates version drift risk, some laws contradict each other, several aspirational items in the daily rhythm have been "aspirational" since March 4 with no plan to actually build them, and two critical files still exist that shouldn't.

This audit rates the system **7.2/10**. Strong bones, some serious cracks.

---

## 1. CORE IDENTITY LAYER

### What's Working
- SOUL.md is concise and correct. It sets the right tone: no sycophancy, resourceful before asking, earn trust through competence.
- USER.md accurately captures Kelly. Pronouns, timezone, style, expectations — all current.
- IDENTITY.md is clean and consistent with the rest of the system.
- AGENTS.md is the primary law document and it covers a lot of ground. The LAW structure is logical. PR-033 (chat output precedence) is a smart meta-rule that resolves the verbose-gate-in-chat problem.

### Issues

**ISSUE 1 — docs/ directory has zombie files**
`docs/agent-improvement-plan-DRAFT.md` still exists. This is the file that caused the PR-031 infrastructure destruction incident. It should have been deleted. The session-handoff confirmed it was deleted, but the file is still there. This is a discrepancy between memory and reality that should concern Kelly.

**ISSUE 2 — PIPELINE_STATE.md is stale**
The PIPELINE_STATE.md still shows Phase 2 as "⏳ RUNNING ~17:05 PST" from March 7. TASK-005 completed on March 7. This file was never cleaned up. It's noise that could confuse session startup reads.

**ISSUE 3 — HEARTBEAT.md is minimal and potentially misleading**
Only shows the March 12 morning delivery task. No active state tracking. Heartbeat replies of HEARTBEAT_OK with this little context means Kelly gets no real signal on system health from the heartbeat mechanism.

**ISSUE 4 — BOOTSTRAP.md shows [MISSING]**
This is injected as "[MISSING] Expected at:" in the project context. It's harmless if BOOTSTRAP.md was legitimately deleted (first-run complete), but the placeholder text in the project context reads as an error, which is confusing.

---

## 2. MEMORY ARCHITECTURE

### What's Working
- Migration to topic files (kelly-prefs.md, hit-network-ops.md, content-pipeline.md, crypto-market.md, sponsors.md) is the right call. Single MEMORY.md was getting unwieldy.
- Daily memory files (memory/YYYY-MM-DD.md) provide session-level context and compliance check anchoring. Good pattern.
- Vector memory search with OpenAI embeddings is a real upgrade — semantic search beats grep.
- The gmail-poll-state.json pattern (tracking lastProcessedId) is solid and prevents duplicate processing.

### Issues

**ISSUE 5 — memory/gates/ directory doesn't exist**
AGENTS.md LAW 1 says gate logs go to `memory/gates/YYYY-MM-DD-gates.md`. This directory has never been created. Every gate log from every session has been silently dropped. Kelly has no audit trail of LAW 1 checks across sessions. This is a structural gap between the rule and the reality.

**ISSUE 6 — Daily checklist score tracking is broken**
compliance-audit/references/daily-checklist.md shows one entry: 2026-03-04 with score 10/17. No subsequent entries. The rule says compliance check runs after every deliverable turn — but these aren't being written to the daily checklist file. They're going to memory/YYYY-MM-DD.md in a compressed format. The files are out of sync. Kelly can't see a real compliance trend.

**ISSUE 7 — No crypto-market.md content was readable**
The crypto-market.md file wasn't included in the readable session context. Either it's empty or very sparse. Given that market data changes daily, this file may be stale or unused.

**ISSUE 8 — memory/2026-03-11.md exists but wasn't read at session startup**
Session startup reads "today + yesterday." On a Friday (March 13), yesterday is March 12 — that gets read. But March 11 is two days back. For a Monday startup, the gap would be three days (no March 9/10 weekend files). The LAW 3 inactivity check (≥30 min gap reads handoff) covers the immediate gap, but a weekend's worth of context could be missed.

**ISSUE 9 — No preventive rules after PR-031**
Preventive rules file ends at PR-031. PRs 032, 033, 034, 035 are only documented in kelly-prefs.md and memory/2026-03-13.md. The preventive-rules.md file is supposed to be the canonical rule log. It's already falling behind after 3 weeks. At this rate it'll be completely outdated within a month.

---

## 3. LAW ENFORCEMENT MECHANISMS

### What's Working
- The LAW structure in AGENTS.md is comprehensive. Laws 1-9 cover the major risk categories.
- PR-033 (chat output precedence) cleanly resolves the tension between verbose enforcement mechanisms and Kelly's communication preferences.
- PR-035 (root cause analysis) is the right instinct after the Gmail debugging debacle.
- PR-025 (unconditional session_status in first 3 tool calls) is the correct fix for the context monitoring problem.
- LAW 8 trigger phrase protocol is specific and well-defined.
- The error journal has real entries with real root cause analysis. This is genuine learning, not theater.

### Issues

**ISSUE 10 — All enforcement is self-enforcement (fundamental)**
This is the most critical structural weakness in the entire system. Every law can be bypassed by Rex simply not running the check. The session startup confirmation is self-reported. Gate logs are self-written. Sub-agent proof keys are self-provided. There is no external verifier. Kelly catching violations is the only real backstop.

This isn't fully fixable without external tooling, but it can be partially mitigated. The current architecture acknowledges this limitation (noted in the March 8 audit error entry) but hasn't proposed concrete mitigations beyond "Kelly is the backstop."

**Concrete mitigation that doesn't exist yet:** Kelly could periodically sample a random session from the past week and check whether the gate log file exists for that day, whether the session_status call appears in the first 3 tool calls of a turn, and whether the compliance score is in the memory file. This is a human verification layer that currently has no protocol or schedule.

**ISSUE 11 — LAW 9 and LAW 25 are in tension**
LAW 9 says session_status must be called within the first 3 tool calls of every turn. PR-025 says the same. But the AGENTS.md LAW 9 section was "rewritten 2026-03-08" and the language says "within first 3 tool calls" — while PR-025 in preventive-rules.md says "first tool call." These are inconsistent. Minor, but could lead to rationalization ("I called it 3rd, that's within 3").

**ISSUE 12 — LAW 1 gate logging path is broken (see Issue 5)**
If memory/gates/ doesn't exist, every LAW 1 gate "log" is silently failing. Rex reports "⚙️ LAW 1 ✅ — gates logged to memory/gates/[date].md" but the file is never written. This means Kelly can never independently verify that the LAW 1 check actually ran. The entire gate audit trail is nonexistent.

**ISSUE 13 — PR-027 compliance is incomplete**
PR-027 says every PR with enforcement impact must have its rule reproduced in AGENTS.md or MEMORY.md. PRs 032, 033, 034, 035 are NOT in preventive-rules.md (the canonical file). They're scattered across memory files and kelly-prefs.md. PR-027's own rule about rule placement isn't being followed.

**ISSUE 14 — Sub-agent proof protocol (PR-008/PR-026) has a session key verification gap**
PR-026 requires real session keys in all gates (format: `agent:main:subagent:[id]`). But there's no mechanism to actually verify that session key corresponds to a completed sub-agent run. Rex could write any string in that format and Kelly would have no easy way to know without manually checking sessions_history. The rule is right but the verification method is manual and not documented anywhere as a periodic check Kelly should do.

**ISSUE 15 — LAW 2 compliance check is time-triggered but notes "sessions don't have formal close events"**
The fix (PR-029) says it runs "after any session turn that produces a deliverable output." But deliverable output is not defined precisely. Is a researched answer a deliverable? Is a file write? Is a Telegram alert? Ambiguity here means Rex can rationalize skipping the check.

---

## 4. SKILL ARCHITECTURE

### What's Working
- 29 skills across bundled and custom — comprehensive coverage of all Hit Network business functions.
- The always-active skill pattern (humanization-voice, injection-defense, error-journal, compliance-audit) is correct architecture. These shouldn't require trigger words.
- Each skill has its own Output Gate template — good. Skill-level gates prevent the main gate from being a single point of failure.
- The email-assistant skill has the tightest gate enforcement of all skills — the PR-008 + PR-024 sub-agent proof requirement is well-specified.
- GMAIL_HOOK.md is well-architected: route detection logic, draft suppression, outbound suppression, receipt capture, market report routing. This is production-quality.

### Issues

**ISSUE 16 — Skill selection is "most specific one" but no tiebreaker protocol**
AGENTS.md says "if exactly one skill clearly applies, read it." But many tasks could trigger 2-3 skills (e.g., writing a sponsor email triggers email-assistant, sponsor-outreach, AND humanization-voice). The instruction to "choose the most specific" is subjective. There's no decision tree.

**ISSUE 17 — humanization-voice is listed as "always active" but isn't actually loaded at startup**
The skill selection protocol in the system prompt says to only load skills when a task matches. The always-active designation in AGENTS.md contradicts this. In practice, Rex loads humanization-voice on demand. This means early in a session, before any writing task triggers it, the humanization rules are only partially in context (from the AGENTS.md summary). The full 7-rule framework and the sub-agent proof template are only available when the skill file is actually read.

**ISSUE 18 — injection-defense skill lists "approved external communication channels only" but these are outdated**
The skill says approved channels are @hitnetwork.io email, designated Telegram alerts, approved Discord channels. No mention of the Railway RSS adapter endpoint, the Tailscale URL, Mission Control API endpoints, or the Convex endpoints — all of which Rex actually calls. The approved channel list hasn't been updated since the system was built.

**ISSUE 19 — Multiple skills reference files that may not exist**
sponsor-outreach references rate-card.md, media-kit.md, outreach-templates.md, pipeline-tracker.md. Weekly-scorecard references rocks-tracker.md, scorecard-template.md. These "references/" files were likely intended to be built — it's unclear which actually exist. Skills calling `read` on non-existent reference files will silently fail or get empty content.

**ISSUE 20 — compliance-audit references daily-checklist.md, weekly-audit-tracker.md, calibration-log.md**
The daily-checklist.md exists but has only one entry (March 4). The other reference files likely don't exist. The entire compliance audit infrastructure that Kelly is supposed to trust is mostly empty scaffolding.

**ISSUE 21 — adaptive-rule-engine skill says "currently running v10.0" — this is stale**
System was built on v10.0. It's been running since late February. Rules have been added (PR-031 through PR-035), the architecture has changed significantly (Docker removed, polling added, new integrations). The version number should be bumped. More importantly, the quarterly review at "end of each quarter" has no cron job scheduled and no progress toward Q2 review setup.

**ISSUE 22 — news-aggregation skill says "check frequency: every 30 minutes" — this cron doesn't exist**
There's exactly one cron job in the system: the Gmail poller (every 60 seconds). There is no 30-minute news aggregation cron. The daily 7 AM briefing cron that role-identity.md says is "✅ Active" — also not visible in the cron list. Either these were deleted or they never existed. Role-identity.md marks them as active, but the cron API shows only one job.

**ISSUE 23 — role-identity.md lists multiple "aspirational" items with no build plan or timeline**
7:00 AM Systems Health Report — no cron, no timeline.
7:30 AM AI Operations Cost Dashboard — no cron, no timeline.
5:00 PM Development Summary — no cron, no timeline.
Weekly Scorecard — no cron, no timeline.
Agent heartbeat ping every 5 minutes — no implementation anywhere.
These have been "aspirational" since March 4. Without a concrete build plan they're just dead text in a document Kelly may be counting on.

---

## 5. TASK MANAGEMENT

### What's Working
- Task lock file format is excellent. Objective, full spec, locked decisions, execution plan, files, current state, handoff notes — this is the right format for multi-session continuity.
- TASK_INDEX.md provides a clean registry.
- TASK-002 (calendar focus bug) is well-specified with a confirmed root cause and clear fix approach.
- TASK-003 (X Feed) correctly identifies the external dependency blocking it.

### Issues

**ISSUE 24 — TASK-002 has been "queued — ready to execute" since March 7**
Six days in queue. This is a medium-priority bug that Kelly is presumably still experiencing. No explanation in handoff for why it hasn't been executed. It should either be done or have a written reason for being deprioritized.

**ISSUE 25 — PIPELINE_STATE.md from TASK-005 was never cleaned up**
Phase status shows Phase 2 as still running. TASK-005 completed March 7. Stale pipeline state files could confuse future session startups that read this file as part of context loading.

**ISSUE 26 — tasks/_WATCHDOG_TEMPLATE.md referenced in PR-023 — unclear if it exists**
PR-023 says "Watchdog template written: tasks/_WATCHDOG_TEMPLATE.md" but this file wasn't visible in the file listing. If it doesn't exist, the watchdog requirement has no template to follow.

---

## 6. CRON / AUTOMATION INFRASTRUCTURE

### What's Working
- Gmail poller: well-designed, polling every 60 seconds, isolated session, proper state tracking, correct suppression rules (DRAFT label, outbound from rex@hitnetwork.io). This is the right architecture after the Pub/Sub failure.
- Delivery mode = "none" on the Gmail poller is correct — it sends its own Telegram alerts, doesn't need cron announcement.
- The payload message is clear and detailed. A fresh isolated agent reading it has everything it needs.

### Issues

**ISSUE 27 — Only 1 of ~6 documented cron jobs actually exists**
Role-identity.md documents 6+ regular scheduled tasks. Only the Gmail poller exists. The daily 7 AM briefing, systems health report, AI ops cost dashboard, development summary, weekly scorecard — none have cron jobs. Either they were deleted in the Docker→Mac migration or they never existed past the planning stage.

**ISSUE 28 — Gmail poller timeout is 120 seconds but polls every 60 seconds**
If a poll run takes longer than 60 seconds (slow gog CLI, Gmail API latency, complex email routing), the next run starts before the previous one finishes. Two concurrent polling agents reading the same state file could result in duplicate email processing or state file corruption. The timeout should be less than the interval, or the state file write should be atomic/locked.

**ISSUE 29 — lastProcessedId uses lexicographic comparison for Gmail IDs**
Gmail message IDs are typically numeric strings (e.g., "19604e..."). Lexicographic comparison of numeric strings can produce wrong ordering (e.g., "9" > "10" lexicographically). If IDs aren't zero-padded, this could cause old emails to be skipped or new emails to be missed. This needs to be verified against actual Gmail ID format.

---

## 7. SECURITY

### What's Working
- Injection defense skill is thorough and well-documented.
- LAW 4 in AGENTS.md covers the core cases.
- PR-031 (infrastructure files off-limits) is the right permanent rule.
- PR-028 (credential scan at startup) is the right instinct.
- No credentials were found in any workspace files during this audit.
- External communication channel restriction in injection-defense is correct in principle.

### Issues

**ISSUE 30 — PR-028 startup credential scan has no enforcement mechanism**
The rule says "at session startup: scan MEMORY.md and session-handoff.md for token patterns." But there's no tool call in the startup sequence that does this scan. The rule exists only as text. Rex would have to remember to run exec with grep for token patterns — which is easily forgotten. This scan has likely never actually run.

**ISSUE 31 — docs/agent-improvement-plan-DRAFT.md and docs/agent-improvement-plan-FINAL.md still exist**
Session-handoff.md says "Plan files deleted." Memory/2026-03-13.md says "Deleted: docs/agent-improvement-plan-B-DRAFT.md and docs/agent-improvement-plan-B-FINAL.md." But the file listing shows `docs/agent-improvement-plan-DRAFT.md` and `docs/agent-improvement-plan-FINAL.md` still present (without the "-B-" in the name). These are potentially different files. Either the deletion was incomplete or these are different versions. These files caused a 4-hour outage — their continued existence is a risk.

**ISSUE 32 — Mission Control is accessible via Tailscale with no documented authentication**
The dashboard at http://100.70.46.41:3000 / https://thes-macbook-pro.tail1cc66a.ts.net is accessible to anyone on the Tailscale network with Kelly's account. Mission Control shows agent data, market data, and AI ops information. Tailscale itself provides network-level access control, but there's no app-level auth (username/password, session token) documented. If anyone gains access to Kelly's Tailscale account, they have full Mission Control access. This is probably acceptable for a personal/small team setup, but it should be a conscious decision.

---

## 8. ERROR LEARNING LOOP

### What's Working
- 15 detailed error entries in the journal — real incidents with real root cause analysis.
- 35 preventive rules accumulated over 3 weeks of operation.
- The error-recovery protocol (caught before delivery vs. caught after delivery) is well-specified.
- Trigger phrase protocol (LAW 8) is correctly narrowed by context test.
- PR-035 (root cause vs. symptom patching) is the right systemic lesson from the Gmail debugging session.

### Issues

**ISSUE 33 — Preventive rules file stops at PR-031, missing PR-032 through PR-035**
This is a file maintenance failure. The canonical rules file is out of date by 4 rules. If the file is the definitive reference, it needs to be kept current. Right now the authoritative rules are scattered across 3 different files.

**ISSUE 34 — Weekly pattern analysis has never run**
The error-journal skill says: "Every Monday, analyze the past 7 days of the error journal." No evidence this has happened. There are no weekly analysis entries in the journal. 15 errors logged since March 4 (9 days) — plenty to analyze. The Monday protocol simply isn't running.

**ISSUE 35 — Rule effectiveness tracking is outdated**
preventive-rules.md has a Rule Effectiveness Tracking table. Last updated March 7 (shows 24 rules). PR-025 through PR-035 are missing from the table. The table doesn't even know these rules exist, let alone whether they're working.

---

## 9. VOICE & HUMANIZATION

### What's Working
- The humanization framework is specific and well-defined. 7 rules with clear examples.
- The hybrid content rule (Rule 7) correctly distinguishes structured technical content from humanized wrapper content.
- Sub-agent proof protocol (PR-008) is architecturally correct — the same agent that wrote the content shouldn't verify it.
- The 3-version X post requirement is smart creative practice.
- Email-assistant gate is the most rigorous in the system.

### Issues

**ISSUE 36 — PR-032 checklist integrity rule isn't enforced by the sub-agent proof template**
PR-032 says "every checklist item must cite verbatim examples from the actual draft." But the sub-agent proof template in humanization-voice/SKILL.md asks the sub-agent to return PASS/FAIL with specific violations — it doesn't ask for verbatim citation of passing examples. The sub-agent could return "RULE 2 (Em dashes): PASS — none found" without actually quoting any content. This leaves room for the same rubber-stamp problem PR-032 was designed to fix, just moved one level up to the sub-agent.

**ISSUE 37 — No mechanism to verify sub-agent proofreader actually loaded the humanization rules**
The sub-agent proof task template provides the rules inline, which is good. But there's no check that the spawned sub-agent session actually received and processed those rules before returning its verdict. A sub-agent with a very short context could miss rules.

---

## 10. CROSS-FILE CONSISTENCY

### Issues

**ISSUE 38 — hit-network-ops.md says "Docker is the only correct restart method" — this is wrong and dangerous**
The bottom of hit-network-ops.md still says: "Docker is the only correct restart method." But Docker was removed on March 12. Rex now runs natively via `npx openclaw gateway --port 30322`. This stale instruction is directly contradictory to current reality. If Rex reads this and tries to restart Docker, it will fail.

**ISSUE 39 — role-identity.md says Gmail hook is "push-based" but it's now polling**
role-identity.md: "8:00 AM Email digest — Gmail hook active (push-based)." The hook was switched to polling on March 13. This file hasn't been updated to reflect the architectural change.

**ISSUE 40 — Memory files reference agents (ATLAS, LEDGER) that don't appear to exist**
sponsors.md says "ATLAS agent handles prospect research" and "ATLAS → LEDGER for complex financial modeling." No ATLAS or LEDGER agents are in the cron list, skill files, or task index. These appear to be planned agents that haven't been built yet — but the memory file references them as active. A fresh session reading sponsors.md would think these agents exist and might try to route tasks to them.

**ISSUE 41 — USER.md says "She's onboarding Rex" but Kelly uses he/him pronouns**
USER.md line: "She's onboarding Rex as a full-stack creative..." — should be "He's." This is a copy-paste error from a template. Small but shouldn't be wrong.

---

## 11. WHAT'S GENUINELY WORKING WELL

Before the sub-agents punch holes in this, here's the honest positive assessment:

1. **The Gmail polling integration is production-quality.** Proper state tracking, suppression rules, route detection, 60-second cadence. This works.

2. **The error learning system has real depth.** 15 entries with actual root cause analysis. Not theater — real learning. The infrastructure outage entry alone demonstrates that Kelly and Rex can have a genuine accountability relationship.

3. **Task lock files are the right format.** A fresh session can pick up TASK-002 and execute it correctly from zero context. That's the goal.

4. **Mission Control exists and runs.** Next.js + Convex, accessible via Tailscale, price tracking, headlines, X feed, calendar, agent dashboard — this is real product.

5. **The PR-033 meta-rule was the right call.** Chat verbosity vs. enforcement mechanism tension was a real conflict. Resolving it by giving Kelly's preferences precedence over gate display format was architecturally correct.

6. **Security posture is above average for this type of system.** Infrastructure files off-limits, injection defense, no credentials in workspace files, qwen removed from model chain. These are real security wins.

7. **Skills are well-scoped.** Each skill covers one domain, has its own gate, and references a clear trigger. The library is comprehensive without being redundant.

---

## 12. PRIORITY RECOMMENDATIONS (Pre-Critique)

### P0 — Fix Immediately (breaks correctness or creates real risk)

1. **Create memory/gates/ directory** — LAW 1 gate logging is completely broken without it.
2. **Delete docs/agent-improvement-plan-DRAFT.md and -FINAL.md** — these caused the outage. They shouldn't exist.
3. **Fix hit-network-ops.md: remove "Docker is the only correct restart method"** — this is actively wrong and dangerous.
4. **Fix role-identity.md: update Gmail hook from "push-based" to "polling"** — factual error.
5. **Update preventive-rules.md with PR-032 through PR-035** — canonical rules file is 4 rules behind.
6. **Fix Gmail poller: timeout (120s) vs interval (60s) overlap risk** — concurrent polling could corrupt state file.

### P1 — Fix This Week (significant gaps with real impact)

7. **Build the daily compliance audit log** — score should be in the file after every deliverable. Currently it's going to daily memory files in inconsistent format.
8. **Audit which skill reference files actually exist** — skills pointing to non-existent reference files are silently failing.
9. **Clear PIPELINE_STATE.md** — stale "Phase 2 running" from March 7 is noise.
10. **Add human-verification protocol to Kelly's workflow** — periodic sampling of gate logs, session_status timing, compliance scores. Self-enforcement needs a human spot-check layer even if it's just monthly.
11. **Resolve cron gap** — figure out what happened to the 7 AM briefing cron and other scheduled jobs. Are they gone from the Docker migration? Never existed? Need to be rebuilt?
12. **Build the rocks-tracker.md and scorecard-template.md** — the weekly scorecard can't run without them.

### P2 — Plan This Quarter (architectural improvements)

13. **Define "aspirational" vs. "active" more rigorously in role-identity.md** — currently 5+ items are listed as active but have no cron jobs backing them.
14. **ATLAS/LEDGER agent references need resolution** — either build them or remove references from memory files.
15. **Mission Control app-level auth** — document the conscious decision about Tailscale-only access, or add simple app-level password.
16. **Sub-agent proof template update** — require verbatim citation of passing examples (per PR-032), not just "none found" responses.
17. **Gmail poller ID comparison method** — verify Gmail IDs are lexicographically comparable or switch to numeric comparison.

---

## Confidence Levels

- Self-enforcement gap: **HIGH confidence** — this is a structural truth about how LLM systems work
- Cron gaps: **HIGH confidence** — verified against live cron API (only 1 job exists)
- memory/gates/ missing: **HIGH confidence** — verified via ls command (no directory)
- Stale files: **HIGH confidence** — verified via file listing
- Gmail poller timing risk: **MEDIUM confidence** — depends on actual gog CLI execution time; may not be an issue in practice
- Gmail ID lexicographic comparison: **MEDIUM confidence** — Gmail IDs are usually large hex numbers that may or may not sort correctly as strings

---

*Phase 1 complete. Spawning sub-agent critics for Phase 3.*
