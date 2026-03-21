# Quality Gatekeeper — Enforcement Standards

Load the relevant sections into every gatekeeper brief. Match section to content type.

---

## LAW 1 — Humanization Standards (all written output)

### 7 Rules — all must pass

| Rule | Requirement |
|------|-------------|
| 1. Contractions | Min 5 per 500 words (emails/reports), 3 per 500 (presentations). Never "will not" when "won't" sounds natural. |
| 2. Zero em dashes | No em dashes anywhere — body, titles, headers, list items, subject lines. Rewrite as colon, comma, or new sentence. Exception: pull-quote attribution only. |
| 3. No robotic transitions | Banned: Furthermore, Additionally, Moreover, In conclusion. Use: "Here's the thing", "And that's exactly why", "That said", "But there's a difference" |
| 4. Mixed sentence lengths | Rhythm: short punch → longer explanation → medium bridge → short punch. Never all-long or all-short. |
| 5. And/But starters | At least 1 sentence per major section starting with And or But. |
| 6. Intentional fragments | At least 1 fragment for emphasis. "Done." "Not even close." "Big difference." |
| 7. Hybrid content | Technical lists/steps/code/tables → keep structured. Subject lines, intros, transitions, outros → maximum humanization. |

### Checklist integrity
Every cited example MUST exist verbatim in the content. Never paraphrase or fabricate examples.

---

## Anti-Hallucination Protocol (all output)

- NEVER accept fabricated data, statistics, prices, names, or factual claims
- EVERY data point must have a source tag: `[Source: API name, URL, document, or "user-provided"]`
- Financial data: must reference at least TWO sources
- Uncertainty must be stated explicitly — never guessed around
- When two sources conflict: both values must be reported with sources flagged
- Confidence level (High/Medium/Low) required on all analysis and recommendations
- Flag any claim that looks specific but has no source attached

### Red flags to catch
- Specific numbers without sources
- Named statistics without citation
- "According to industry standards" with no source
- Projections presented as facts
- Named companies/people without verification

---

## Plan Quality Standards (plan reviews)

A good plan must pass all of these:

| Check | Standard |
|-------|----------|
| Objective clarity | One sentence — what "done" looks like |
| Step completeness | Every step is actionable, no assumed knowledge |
| Right tools | Correct skills/tools selected for each step |
| Approval gates | External sends, financial figures, and architectural changes have human approval checkpoints |
| Risk identified | Risks flagged before execution, not discovered during |
| Reversibility | Destructive or external actions identified with rollback plan |
| Parallel vs sequential | Steps that can run in parallel are flagged as such |
| Simpler path | No unnecessarily complex approach when a simpler one achieves the same result |

### Plan failure criteria (auto-FAIL)
- External send (email, X post) with no approval gate
- Financial figure with no source
- Infrastructure file modification (violates PR-031)
- More than 5 steps with no checkpoint for Kelly
- Assumes data is correct without verification step

---

## Code Quality Standards (code output)

| Check | Standard |
|-------|----------|
| Security | No exposed secrets, API keys, or credentials in code |
| Error handling | All external calls have error handling |
| TypeScript | Types defined, no `any` without justification |
| Performance | No N+1 queries, no blocking operations on main thread |
| Consistency | Matches existing codebase patterns (Next.js App Router, Tailwind, Convex) |
| No breaking changes | Existing functionality not broken by changes |
| Infrastructure safe | No edits to docker-compose.yml, .env, models.json, auth-profiles.json (PR-031) |

### Code failure criteria (auto-FAIL)
- API keys or secrets in code
- Missing error handling on external API calls
- Modifications to infrastructure files (PR-031 violation)
- Breaking changes to existing features without explicit approval

---

## Financial Accuracy Standards (financial output)

| Check | Standard |
|-------|----------|
| Source tags | Every figure has `[Source: ...]` |
| Dual sourcing | Financial data cross-referenced with 2 sources |
| Estimates labeled | Projections clearly marked as estimates, not actuals |
| Confidence level | Every analysis includes High/Medium/Low confidence + rationale |
| Assumptions stated | All model assumptions listed explicitly |
| Ranges over points | Projections show range (low/base/high), not single number |

### Financial failure criteria (auto-FAIL)
- Any figure without a source tag
- Projections presented without "estimate" label
- Missing confidence level on recommendations
- Single-source financial data (needs two)

---

## Strategy Quality Standards (strategic plans and recommendations)

| Check | Standard |
|-------|----------|
| Question answered | Does the output actually answer what was asked? |
| Best approach | Is this the best path, or just a working path? |
| Trade-offs surfaced | Alternatives considered and rejected with reasoning |
| Risks flagged | Downside scenarios identified |
| Actionable | Clear next steps with owner and timeline |
| Confidence calibrated | Honest about uncertainty — no overconfidence |

---

## Output Gate Log Format

After every gatekeeper run, append to `memory/gates/YYYY-MM-DD-gates.md`:

```
## [HH:MM] — [content type]
Mode: PLAN REVIEW | OUTPUT REVIEW
Verdict: APPROVED | NEEDS REVISION
Fixes applied: [count or "none"]
Risk level: LOW | MEDIUM | HIGH
Notes: [one line summary]
```
