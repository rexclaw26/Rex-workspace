# Build-Critic Loop — Quality Protocol

**For every complex task: one sub-agent builds, a separate sub-agent critiques. Iterate until the critic passes. Only then deliver to Kelly.**

This prevents rebuilds, catches issues before Kelly sees them, and produces genuinely better output on every task.

---

## When This Applies

**The trigger is not size or complexity — it's intent. If the output is a finished deliverable that Kelly will act on, read, present, send, or publish — the Build-Critic loop runs. No exceptions.**

This includes:
- All written content (articles, scripts, X threads, emails, newsletters, slide decks, reports)
- Research outputs Kelly will use to make decisions
- Strategy documents, plans, or memos
- Financial models or analysis
- Any code or build being deployed or delivered
- **Technical fixes and solutions** — sub-agent critiques every proposed fix to confirm it addresses the root cause, not just the symptom

**Does NOT apply:**
- Quick factual answers and lookups in chat
- Internal plans Rex is working through mid-task (not yet a deliverable)
- Conversational back-and-forth

**The trigger is binary:** Is Kelly receiving this as a finished output? If yes — Build-Critic runs.

---

## The Loop

```
Rex (main) → spawns Builder sub-agent → Builder produces output
                                              ↓
                               Rex spawns Critic sub-agent
                               (with full output + requirements)
                                              ↓
                               Critic returns: PASS or FAIL + specifics
                                              ↓
                    FAIL → Rex spawns revised Builder → loop again
                    PASS → Rex delivers to Kelly with visible gate
```

---

## Critic Sub-Agent Brief (standard template)

When spawning the Critic, always include:
1. The full output to review
2. The original requirements / Kelly's brief
3. These standing instructions:

> "You are a demanding senior editor and consultant. Your job is to push back — hard. Review the output below against the requirements. Find every flaw, weakness, missed opportunity, and quality gap. Ask: would Kelly be impressed by this, or just satisfied? Return PASS only if the output is genuinely excellent. For every issue: be specific — quote the exact problem, state why it fails, and suggest the fix. Do not be polite about mediocre work."

---

## Visible Build-Critic Gate (required before delivery)

After the Critic passes, show this before presenting output to Kelly:

```
⚙️ BUILD-CRITIC GATE — [Task Name]
─────────────────────────────────────────────────
Builder  : ✅ agent:main:subagent:[real-id]
Critic   : ✅ PASSED — agent:main:subagent:[real-id]
Iterations: [N] (number of build→critique cycles)
─────────────────────────────────────────────────
Key critic notes addressed:
  • [issue that was caught and fixed]
  • [issue that was caught and fixed]
─────────────────────────────────────────────────
```

**Real session keys required for both Builder and Critic lines.** "complete", "run complete", or any placeholder = invalid gate = violation.

---

## Relationship to Other Gates

These gates are **different**. Do not conflate them. For slide decks, all 4 stack.

| Gate | What It Checks | When It Fires |
|------|----------------|---------------|
| Build-Critic Loop | Overall quality — does it meet requirements? Is it genuinely excellent? Strategic soundness. | All deliverables Kelly will act on |
| Slide Design Gate | Visual only — 10-point format/design standard | Slide decks only |
| LAW 7 Output Gate | Humanization, sources, security, approval | All written deliverables |
| LAW 1 Checklist | 7-point humanization check | All written content |

**Slide deck = all 4 gates.** Written deliverable (non-deck) = Build-Critic + LAW 7 + LAW 1. Code/build = none unless being deployed as a deliverable product.

**A Design Gate is NOT a Build-Critic.** Design Gate asks "is it formatted correctly?" Build-Critic asks "is it actually good — does it serve Kelly's goal?"
