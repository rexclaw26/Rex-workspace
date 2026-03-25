# Context Optimization Skill
_Always active. No explicit load required._
_Version: 1.0 | Created: 2026-03-21_

## Purpose
Maximize output quality per token spent. Prevent timeouts. Keep subagent prompts lean. Manage context window proactively.

---

## Token Budget Thresholds
| Context Level | Action |
|--------------|--------|
| <50% | Continue normally |
| 50-70% | Note internally. No action needed. |
| 70-84% | Heads-up to Kelly: "Context at [X]%, getting close." |
| 85%+ | STOP. Run LAW 9 compaction pre-flight. Alert Kelly. Wait for signal. |

Run `session_status` within the first 3 tool calls of every turn (LAW 9 — mandatory, no exceptions).

---

## Subagent Prompt Sizing
| Task Type | Max Prompt Size | Notes |
|-----------|----------------|-------|
| Simple research (1-3 sources) | <3K tokens | Task + key context only |
| Complex research (4-6 sources) | <6K tokens | Include file paths, not file content |
| Build tasks (coding, writing) | <8K tokens | Reference spec file by path, not inline |
| Claude Code sessions | Max 5 files per session | PR-043 — never exceed |

**Rule:** Never paste full AGENTS.md, full MEMORY.md, or full conversation history into a subagent prompt. Reference file paths instead.

---

## Model Selection — Mandatory Override Rule (PR-046)

**Default subagent model:** `openrouter/anthropic/claude-haiku-3-5` (set in config)

**Override to `anthropic/claude-sonnet-4-6` — MANDATORY for these task types:**

| Task | Override required | Why |
|------|------------------|-----|
| Any coding agent (building features, fixing bugs, refactoring) | ✅ YES | Haiku produces shallow code, misses edge cases |
| Architecture or system design | ✅ YES | Haiku lacks depth on complex tradeoffs |
| Critic/review passes on plans or deliverables | ✅ YES | Haiku criticism is surface-level |
| Multi-file analysis (reading + reasoning across 3+ files) | ✅ YES | Haiku loses context across files |
| Quality gatekeeper sub-agent | ✅ YES | Gate must catch real issues |
| Security analysis | ✅ YES | High stakes, needs full reasoning |

**Haiku is sufficient for:**
- Research + web search + summarize
- Memory checkpoint writes
- Simple data parsing or extraction
- Nightly review agents (structured Q&A)
- Single-file reads with simple output

**How to override:** Pass `model: "anthropic/claude-sonnet-4-6"` in the `sessions_spawn` call.

```
sessions_spawn({
  task: "...",
  model: "anthropic/claude-sonnet-4-6",  // ← explicit override
  ...
})
```

**Enforcement:** Before spawning any subagent, Rex checks the task type against this table. No judgment calls — if the task type appears in the "Override required" column, Sonnet is used. No exceptions.

---

## Coding Agent Scope (extends PR-043)
- Max 5 files per Claude Code session
- Max one logical patch group per session
- Spec files (like PATCH_SPEC.md) are the right pattern — spec in a file, agent reads it
- Split large specs: API routes / components / pages — one group per session
- After every session: verify by checking actual files (PR-042), not agent's summary

---

## Research + Write Split (extends PR-038)
Any task combining research AND a large file write (>10KB) MUST be split:

| Agent | Scope | Max Timeout |
|-------|-------|-------------|
| Research A | Sources 1-N, extract findings | 120s |
| Research B | Analysis, gap assessment, critic | 120s |
| Writer | Receives synthesized context, writes ONLY | 180s |

Research agents run in parallel. Writer runs AFTER both complete.

---

## What to Keep in Context (active)
- Current task description and acceptance criteria
- Files being actively edited (relevant sections only — use read with offset/limit)
- Recent error messages and command output
- Current conversation thread

## What to Reference via Files (passive)
- Agent identity files — read once at session start
- Skill files — read once when task matches trigger
- Historical decisions — use memory_search or lcm_grep
- Full source files — use `read` with offset/limit, not full dumps

## Never Load Into Context
- Entire codebases
- Old daily memory files (search first, expand only what's needed)
- Files already summarized by LCM (check lcm_grep first)

---

## LCM Usage Rules
1. `lcm_grep` first — search before expanding
2. `lcm_expand_query` only when you need specific values not in summaries
3. Never dump full context — use `tokenCap` parameter
4. Trust summaries for navigation; expand only for exact values (paths, credentials, SHAs)

---

## Anti-Patterns (never do these)
1. ❌ Loading a 500-line file to check one value — use `grep` or `read` with offset/limit
2. ❌ Pasting full AGENTS.md or MEMORY.md into a subagent prompt — reference the path
3. ❌ Combining research + large file write in one agent — split per PR-038
4. ❌ Re-reading files already summarized in LCM — use lcm_grep first
5. ❌ Writing subagent prompts with full conversation history
6. ❌ Using `exec cat` on large files — use `read` tool with limits
7. ❌ Asking Kelly for info that's in a readable file

---

## Timeout Recovery Protocol (PR-042/043 extension)
When a coding agent or subagent times out:
1. **Verify immediately** — check actual files for what was created/modified
2. **Log the gap** — note exactly which steps completed vs. timed out
3. **Do NOT discard completed work**
4. **Re-spawn for missing sections only** — not the full spec again
5. **Verify the re-spawn** — check files again after second pass
6. **Only then report to Kelly** — with file evidence, not agent summary

---

## Measurement (log to error-journal when violated)
- Goal: 0-1 compaction events per full day session
- Goal: 0 agent timeouts per task (proper scoping prevents them)
- Any >85% context event: log to error-journal with root cause
- Any timeout: log to error-journal with scope that caused it
