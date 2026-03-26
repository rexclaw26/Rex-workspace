# Multi-Step Pipeline Protocol

**Any pipeline with 3+ sequential steps (especially overnight or unattended work) must have two mandatory checkpoints.**

---

## Checkpoint 1 — PIPELINE_STATE.md

Write `/Users/rex/.openclaw/workspace/PIPELINE_STATE.md` immediately when launching a pipeline. Include:
- Pipeline name + start time + delivery deadline
- Table: each step | status | output file path | what triggers it
- Fallback instructions if any step is missed

Update it after each step completes. This file is the source of truth.

**Template:**
```
| Step | Status | Output File | Triggered By |
|------|--------|-------------|--------------|
| Step 1 | ✅ complete | path/to/output.md | sub-agent announce |
| Step 2 | ⏳ running  | path/to/output.md | step 1 file present |
| Step 3 | ⬜ pending  | path/to/output.md | step 2 complete |
```

---

## Checkpoint 2 — Backup Verification Cron

Set a backup cron 30–60 min BEFORE the delivery deadline that:
- Reads PIPELINE_STATE.md
- Checks each step's output file exists
- If any step is incomplete: sends Kelly a status update and (if safe) spawns the missing step
- Logs what it found

---

## Heartbeat vs Cron: When to Use Each

**Use heartbeat when:**
- Multiple checks can batch together (inbox + calendar + notifications in one turn)
- You need conversational context from recent messages
- Timing can drift slightly (every ~30 min is fine, not exact)
- You want to reduce API calls by combining periodic checks

**Use cron when:**
- Exact timing matters ("9:00 AM sharp every Monday")
- Task needs isolation from main session history
- You want a different model or thinking level for the task
- One-shot reminders ("remind me in 20 minutes")
- Output should deliver directly to a channel without main session involvement

**Tip:** Batch similar periodic checks into `HEARTBEAT.md` instead of creating multiple cron jobs.

---

## Proactive Work You Can Do Without Asking

- **Emails** - Any urgent unread messages?
- **Calendar** - Upcoming events in next 24-48h?
- **Mentions** - Twitter/social notifications?
- **Weather** - Relevant if your human might go out?

**Track your checks** in `memory/heartbeat-state.json`:
```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800,
    "weather": null
  }
}
```

**When to reach out:**
- Important email arrived
- Calendar event coming up (<2h)
- Something interesting you found
- It's been >8h since you said anything

**When to stay quiet (HEARTBEAT_OK):**
- Late night (23:00-08:00) unless urgent
- Human is clearly busy
- Nothing new since last check
- You just checked <30 minutes ago
