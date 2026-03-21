# Cost Tracking — Hit Network AI Operations

**Purpose:** Track all API/tool spending across all agents and services.  
**Owner:** Rex (with Kelly approval for major spend)  
**Review:** Weekly summary every Friday

---

## Current Setup

### Agents & Models
| Agent | Model | Primary Use | Status |
|-------|-------|-------------|--------|
| Rex (Main) | Qwen 3.5 35B-A3B (fallback: Claude) | All tasks | Active |

### API Keys in Use
- **Anthropic** (Claude) — ✅ Active
- **OpenRouter** (Qwen) — ✅ Active
- **Brave Search** — ✅ Active

### Services to Track
- [ ] API calls (Anthropic, OpenRouter)
- [ ] Subscriptions (tools, services)
- [ ] Cloud hosting (if any)
- [ ] Domain costs
- [ ] Other — specify below

---

## Tracking Rules

### When to Log
- Any new service subscription
- Any API key added (with estimated monthly cost)
- Any actual spend notification from provider
- End-of-month billing statement

### Cost Estimation
- Use provider pricing docs for estimates
- Mark as `ESTIMATED` until actual bill arrives
- Recalculate when usage patterns change

### Alert Thresholds
- 🟢 **Green:** < 50% of budget
- 🟡 **Yellow:** 50-80% of budget
- 🔴 **Red:** > 80% of budget
- ⚠️ **Critical:** > 100% of budget

---

## Weekly Summary Format

```
### Week of [Date] — AI Operations Spend Summary

**Total Spend:** $X.XX (Estimated: $X.XX | Actual: $X.XX)

**By Agent:**
- Rex: $X.XX
- Other: $X.XX

**By Provider:**
- Anthropic: $X.XX
- OpenRouter: $X.XX
- Other: $X.XX

**Top Expenses:**
1. [Service] — $X.XX
2. [Service] — $X.XX
3. [Service] — $X.XX

**Variance vs. Budget:** ±$X.XX ([X]%)

**Notable Changes:**
- [ ] New subscription added
- [ ] Usage spike (reason)
- [ ] Usage dip (reason)
- [ ] Budget adjusted

**Recommendations:**
- [Observation + Action item]
```

---

## Budget Target

**Current Monthly Spend:** $245 (2026-03-02 baseline)
- **Anthropic:** $25/month (current usage)
- **OpenRouter:** $20 (credit balance, will track usage)
- **Claude Max:** $200/month subscription
- **Other:** $0

**Monthly Budget:** $300 (initial target)
**Alert Threshold:** $75/week
**Max Monthly:** $250 (before Kelly approval)

**Status:** 🟢 Green — 82% of budget target

---

## Notes

**2026-03-02 Setup:**
- Anthropics API key added: $25 credit
- OpenRouter API key added: $20 credit
- Claude Max subscription: $200/month (existing)
- Total initial balance: $245

**2026-03-04 Update:**
- OpenRouter charge: $52.97 (Receipt #2702-1990, Invoice KVZPXYQE-0002)
- This appears to be additional OpenRouter credits purchased (was $20, now $52.97 charged)

**Context:**
- OpenRouter credit will be consumed as Qwen model is used (fallback to Claude when overloaded)
- Anthropic credit used for heavy lifting tasks
- Claude Max subscription covers base model access
- No other subscriptions currently

**Optimization Opportunities:**
- Monitor OpenRouter vs. direct Anthropic pricing for Qwen use cases
- Review Claude Max usage patterns to ensure ROI
- Consider batching tasks to reduce API calls

- [ ] Update budget target after first month of actuals (2026-04-02)
- [ ] Review quarterly for optimization opportunities
- [ ] Track weekly spend summaries starting week of 2026-03-03

---

*Last updated: 2026-03-02*
