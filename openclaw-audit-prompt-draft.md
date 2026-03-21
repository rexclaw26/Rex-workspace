# OpenClaw System Integrity Audit Prompt
## Lock In Your Agent. Prove It Before You Change It.

---

This prompt runs a full self-audit of your OpenClaw setup. It reads every skill, every rule, every enforcement mechanism, and every law you've defined. Then it finds the gaps, fixes them, and proves every fix through a critic sub-agent before applying anything. Nothing changes without a PASS.

Run this once to lock your system in. Run it again any time you add skills, update rules, or feel like things have drifted.

But read the whole thing before starting. The phase structure matters. Seriously.

---

## HOW TO USE THIS

Paste this entire document into your OpenClaw session (web chat or Telegram). Your agent will work through each phase in sequence, confirming with you before moving forward. Don't let it skip ahead. Each phase is a hard stop.

**What you'll end up with:**
- A fully audited skill library, each skill understood and correctly categorized
- All Always-On skills explicitly flagged and enforced
- Every law with a visible, post-compaction-safe enforcement mechanism
- Sub-agents properly scoped
- A locked `AGENTS.md` that reflects how your system actually works
- Proof that every change passed a critic before being applied

---

## BEFORE PHASE 1: CHECK CONTEXT

Run `session_status` now. Note the context usage percentage.

- Under 40%: proceed
- 40-60%: proceed, but flag to the user that context will be tight
- Over 60%: warn the user before starting. This audit reads many files and will consume significant context. Consider compacting first or doing the audit in two sessions (Phase 1-4 in one session, Phase 5-8 in the next)

Do not proceed past this check without reporting context level to the user.

---

## PHASE 1: FULL DISCOVERY

**Read every file in the workspace before doing anything else.**

Start with identity and context files. Look for files with names like:
- Agent identity: `SOUL.md`, `IDENTITY.md`, or any file describing who the agent is
- User context: `USER.md`, or any file describing who the agent is helping
- Long-term memory: `MEMORY.md`, or the primary memory file
- Session continuity: `session-handoff.md`, or the last-session state file
- Operating rules: `AGENTS.md`, or the file containing laws and enforcement rules
- Task state: `tasks/TASK_INDEX.md`, or the task registry

Then read:
- Every skill file in `skills/` — find all `SKILL.md` files recursively
- Error journal and preventive rules, if they exist
- Compliance checklist, if it exists
- Any daily memory files from the last 7 days (look for `memory/YYYY-MM-DD.md` pattern)

**If a file doesn't exist:** note it as missing. Don't fabricate its contents or assume defaults. Missing files are findings, not errors to silently skip.

**After reading everything, output a Discovery Summary:**

```
DISCOVERY SUMMARY
=================
Agent name: [name or "not found"]
User: [name and context, or "not found"]
Workspace path: [path]

SKILLS FOUND: [X total]

  Always-On (flagged as permanently loaded every session):
    - [skill name]: [trigger or "no trigger defined"]
    [list all skills explicitly flagged as always-active]

  On-Demand (triggered by request or condition):
    - [skill name]: [trigger phrase or condition]
    [list remaining skills]

  Unclassified (found but not clearly categorized):
    - [skill name]: [reason unclear]

LAWS/RULES FOUND: [X total]
  [For each law or standing rule: name + "enforcement mechanism found: YES/NO"]

SUB-AGENTS DEFINED: [list or "none found"]

PREVENTIVE RULES: [X rules, list them]

ERRORS LOGGED: [X entries, or "error journal not found"]

MISSING EXPECTED FILES: [list any standard files that weren't found]

PRELIMINARY GAPS (first impressions only — full audit comes next):
  - [anything obviously broken or absent]

Context level now: [report current % from session_status]
```

Wait for user confirmation before Phase 2.

---

## PHASE 2: SKILLS AUDIT

For each skill found in Phase 1, produce a skill audit card. Don't skim. Quote the actual trigger phrases and gate definitions from the file.

```
SKILL AUDIT: [Skill Name]
========================
File: [exact path]
Category: [content / analytics / technical / admin / other]

Trigger (quoted from file):
  "[exact trigger phrase or condition from SKILL.md]"

Always-On: YES / NO
  If YES — where is this enforced? (quote the enforcement location)
  If NO  — is it correctly excluded from session startup?

Gates defined (list each one by name):
  - [gate name]: [what it blocks, what triggers it, what a PASS looks like]
  - [or "no gates defined"]

Sub-agent proof required: YES / NO
Human approval required: YES / NO

What it does:
  [2-3 sentences from reading the actual skill content — not a summary of the name]

How it works with other skills:
  [Does it feed into another skill? Does it depend on another skill running first?
  Does it share data formats, file paths, or triggers with another skill?
  Or: "No cross-skill dependencies identified"]

Enforcement gaps found:
  [Quote any section of the SKILL.md that describes enforcement, then assess:
  Is the gate actually blocking, or just described as a suggestion?
  Is the trigger specific enough to fire reliably?
  Is any part of the enforcement relying on session memory instead of workspace files?]

STATUS: LOCKED | NEEDS FIX | NEEDS CLARIFICATION
Reason: [one sentence]
```

After all skill cards are complete, output a Skills Audit Summary:
```
SKILLS AUDIT SUMMARY
====================
Total audited: [X]
LOCKED: [X]
NEEDS FIX: [X]
NEEDS CLARIFICATION: [X]

Always-On skills confirmed: [list]
Always-On skills missing from session startup: [list]
Skills with no gates: [list]
```

Wait for user confirmation before Phase 3.

---

## PHASE 3: LAW ENFORCEMENT AUDIT

For each law or standing rule found in Phase 1, run this check:

```
LAW AUDIT: [Law Name or Number]
================================
What it requires: [one sentence — be specific, not vague]

Enforcement mechanism (describe exactly):
  [What file is it in? What section? What makes it fire?
  Is it conditional on session memory, or does it fire from workspace files alone?]

Visible to user: YES / NO
  If YES — what marker appears in output? Quote it.
  If NO  — why not, and is that acceptable?

Post-compaction safe: YES / NO
  Definition: an enforcement mechanism is post-compaction safe if a fresh agent
  instance with no session history, reading only the workspace files, would still
  enforce it correctly. If it requires the agent to "remember" a previous session
  to fire, it is NOT post-compaction safe.
  Explanation: [why this is or isn't safe]

Scenario test — would this law fire in these situations?
  A) Agent has no session history (fresh start): [YES / NO / DEPENDS]
  B) After context compaction: [YES / NO / DEPENDS]
  C) When processing external content from email or web: [YES / NO / N/A]

Gaps:
  [Any scenario where this law could silently fail?]

FIX NEEDED: YES / NO
```

**Always-On skill check — run for every skill marked Always-On:**

For each one, answer:
1. Is there a visible output marker when this skill fires? What does it look like?
2. Is it in the session startup confirmation block?
3. If it involves a checklist (like humanization), does the checklist appear in output BEFORE the content — not internally, not after?
4. Could a careless agent run a session without this skill firing and you'd never know?

Output a Law Enforcement Summary. Wait for user confirmation before Phase 4.

---

## PHASE 4: CROSS-SKILL COHERENCE AUDIT

Check how the skills work as a system.

**Coverage gaps:** Are there tasks the user likely wants to do that no skill covers? Based on the user context from Phase 1, what's missing?

**Skill conflicts:** Do any two skills give contradictory instructions for the same situation? List every conflict found with the exact conflicting lines quoted.

**Missing handoffs:** Are there skills that produce output that another skill should consume — but the handoff isn't defined? Example: a research skill produces data that an email skill will send, but no rule says the email skill must apply humanization to that data before sending.

**Sub-agent scope:** For each sub-agent defined, evaluate against this rubric:
- What skills are assigned to it? List them.
- Does it have access to a skill that could cause external actions (send email, post to social, execute financial operations) without a human gate? If yes, flag it.
- Is it missing a skill it clearly needs to do its described job? If yes, flag it.
- Is its scope documented in a file the agent reads at startup — not just in session memory? If not, flag it.
- Could this sub-agent be accidentally triggered by an unrelated request? If yes, flag it.

**Always-On completeness:** Every skill flagged as Always-On must appear in the session startup checklist in `AGENTS.md` (or equivalent). List any that don't.

Output a Coherence Report. Wait for user confirmation before Phase 5.

---

## PHASE 5: GENERATE FIXES

Based on Phases 2, 3, and 4, generate a complete list of proposed fixes.

**Format each fix:**

```
FIX [###]: [Short title]
========================
Problem: [what's broken or missing — be specific]
Root cause: [why it's broken]
Proposed change:
  File: [exact path]
  Section: [section heading or line reference]
  Change: [exact new text to add or replace — not a description of the change, the actual text]
Compaction-safe: YES / NO (explain if NO)
Risk: LOW | MEDIUM | HIGH
  HIGH = changes enforcement behavior or removes a gate
  MEDIUM = adds new requirements or modifies trigger conditions
  LOW = adds clarity, documentation, or missing markers
Impact: [what this fix unlocks or prevents]
```

**If this is a fresh setup with no existing laws or enforcement:**
Before listing individual fixes, include a baseline fix that establishes the minimum compliant structure. The baseline should define: at least one Always-On skill per category (content gate, injection defense, output gate), a session startup checklist, and a compaction pre-flight procedure.

Number every fix starting from FIX-001. Don't apply anything yet.

Output a Fix Summary:
```
FIX SUMMARY
===========
Total fixes: [X]
HIGH risk: [X]
MEDIUM risk: [X]
LOW risk: [X]
Estimated files affected: [list]
```

Wait for user confirmation before Phase 6.

---

## PHASE 6: CRITIC SUB-AGENT REVIEW — MANDATORY HARD STOP

**This phase cannot be skipped. No fix gets applied without a PASS. Not for small fixes. Not for "obvious" ones. Every fix goes through the critic.**

Spawn a critic sub-agent with this exact task:

```
You are a hard critic reviewing proposed changes to an AI agent system.
Your job is to prevent bad fixes from shipping, not to rubber-stamp them.

Evaluate each fix against ALL of these criteria:

CRITERION 1 — SOLVES THE PROBLEM
Does the proposed change actually fix the stated problem?
Or does it address the symptom while leaving the root cause intact?

CRITERION 2 — NO NEW RISKS
Does this fix introduce any new gaps, conflicts, or enforcement failures?
Does it remove any existing protection, even unintentionally?

CRITERION 3 — PRECISE ENOUGH TO IMPLEMENT
Is the proposed change written specifically enough that any agent could implement it
without interpreting or guessing? Vague changes = REVISE.

CRITERION 4 — COMPACTION-SAFE
If this fix creates or modifies an enforcement mechanism, does that mechanism
survive a full context compaction? Would a fresh agent with no session history still
enforce it correctly after this fix is applied?

CRITERION 5 — HUMAN OVERSIGHT MAINTAINED
Does this fix maintain or improve the human's ability to audit, override, or correct
the agent's behavior? Does it preserve human-in-the-loop requirements?

CRITERION 6 — BETTER ALTERNATIVE EXISTS
Is there a simpler, safer, or more robust solution that wasn't proposed?
If yes, describe it. The goal is the best solution, not just an acceptable one.

For each fix return: PASS, FAIL, or REVISE
PASS = implement exactly as written
FAIL = do not implement — explain why and what to do instead
REVISE = implement only after making specific noted changes

Maximum revision loops: 3. If a fix fails 3 critic reviews, escalate to the user
with a summary of why it can't be resolved — do not implement it.

FIXES TO REVIEW:
[paste the complete list of fixes from Phase 5]
```

Iterate on every FAIL and REVISE:
- Address the critic's notes
- Revise the fix
- Re-submit the revised fix to the critic
- If a fix reaches 3 failed reviews, stop and flag it to the user

**After all fixes reach PASS status, show this gate before proceeding:**

```
CRITIC GATE
===========
Sub-agent session key: [real agent:main:subagent:XXXX session key]
Total fixes reviewed: [X]
PASS on first review: [X]
Required revision: [X]
Escalated to user (unresolvable): [X]
Final status: ALL REVIEWED FIXES PASS ✅
```

**Then stop. Wait for explicit user approval of the final fix list before Phase 7.**

The user is approving the *final* versions of the fixes — including any revisions made during critic iteration. They must see the complete revised list before giving the go-ahead.

---

## PHASE 7: IMPLEMENTATION

**Backup first.** Before modifying any file, read its current content and write it to a backup path:
```
[filename].pre-audit-backup
```
Do this for every file that will be modified. If something goes wrong, the originals are recoverable.

Then apply every approved fix in this order:
1. Skill `SKILL.md` files (enforcement gaps, gate updates, trigger clarifications)
2. Primary rules/laws file — whatever file contains your agent's laws and session startup checklist
3. Primary memory file (new standing rules)
4. Rules tracking file, if one exists — add any new rules sequentially, numbered from the last existing entry
5. Compliance checklist (new checks if added by any fix)

For each file, before writing:
- Show a diff: the exact lines being removed and the exact lines being added
- Wait for user confirmation on that specific change before writing
- After writing, confirm the change is in place

If a write fails: stop immediately, do not continue to the next file, restore from the `.pre-audit-backup` file, and report the failure to the user before taking any further action.

---

## PHASE 8: LOCK-IN VERIFICATION

After all fixes are applied, run a verification pass.

**Always-On skills:** For each one, confirm it appears in the session startup checklist. Quote the checklist entry.

**Laws:** For each law, confirm its enforcement mechanism is now post-compaction safe. State what file the enforcement lives in and why a fresh agent would still trigger it.

**New rules tracking:** If your setup uses numbered rules (e.g., preventive rules, standing rules), confirm each new rule is numbered sequentially and doesn't conflict with existing entries.

**Backups:** Confirm all `.pre-audit-backup` files exist for every modified file.

**Context check:** Run `session_status` now. If context is above 80%: stop, alert the user, write everything completed so far to the session handoff file, and wait for the user to say "continue" before writing the final summary. Don't guess — wait.

**Scenario testing — prove it actually fires:**
For each Always-On skill, run a quick scenario test:
- Humanization/output checking: draft one sentence of content and verify the checklist marker appears before it
- Injection defense: reference external content and verify the 🔒 marker or equivalent appears
- Output gate: describe a deliverable output and verify the sub-agent proof requirement triggers
- Any other Always-On skill: describe its trigger condition and verify the marker appears

Report each test as: TRIGGER → MARKER APPEARED (YES/NO). If any are NO, that law is not LOCKED. Do not close the session.

**If any scenario test returns NO:** Return to Phase 5. Generate a targeted fix for the failed item only. Run Phase 6 critic loop on that fix. Implement per Phase 7 rules (backup first, diff before write, confirm after). Then re-run Phase 8 verification for that item only. Repeat until it returns YES. If after 3 cycles it still returns NO, escalate to the user: describe the failure, what was tried, and why it couldn't be resolved. Never mark the system LOCKED while a verification failure is open.

**Final output:**

```
SYSTEM INTEGRITY AUDIT — COMPLETE
===================================
Date: [date]
Skills audited: [X]
Laws verified: [X]
Fixes applied: [X]
Rules entries added: [X]
Critic passes on record: [X]
Backup files created: [X]

Always-On skills confirmed in startup checklist:
  [list every always-on skill with its checklist entry quoted]

Scenario tests:
  [list each test: TRIGGER → MARKER APPEARED YES/NO]

Laws with verified post-compaction enforcement:
  [list each law, enforcement file location, and why it's compaction-safe]

Files modified:
  [list every file, with backup path]

Verification failures (needs follow-up):
  [list any scenario tests that returned NO, or "none"]

SYSTEM STATUS: LOCKED ✅ / PARTIAL ⚠️ / NEEDS FOLLOW-UP ❌
```

Write this summary to your daily memory file and update your session handoff file. Both must be written before the session ends.

---

## CRITICAL RULES

1. **Nothing changes without a critic PASS.** Phase 6 is a hard stop. Not optional. Not skippable for "small" or "obvious" fixes. Every fix goes through the critic.

2. **Backup before touching any file.** Phase 7 creates `.pre-audit-backup` files for every modified file. No exceptions. Recovery must always be possible.

3. **Enforcement mechanisms must be post-compaction safe.** If a rule only works because the agent remembers a previous session, it will fail silently after compaction. Every enforcement mechanism must fire from workspace files alone.

4. **Visible markers aren't optional.** A law that enforces silently can't be audited. Every enforcement mechanism must produce output the user can check.

5. **Don't fabricate compliance.** If a check didn't run, report it as not run. Missing files are findings, not things to silently skip.

6. **Wait at every phase.** Phases 1, 2, 3, 4, 5, and 6 all end with an explicit wait. The user must confirm before each phase proceeds. And no phase chains into the next automatically.

7. **Monitor context at every phase boundary.** Run `session_status` at the start of generating each phase's output. If context is above 80%: stop, alert the user, write current state to the session handoff file, and wait for their signal before continuing. "Monitor throughout" without checkpoints is not monitoring.
