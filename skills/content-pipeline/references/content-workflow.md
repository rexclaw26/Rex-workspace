# Content Pipeline — Workflow & SLA Targets

## Per-Stage Workflow

### Stage 1: Idea
- **SLA target:** No limit — ideas can sit here indefinitely
- **Blocker flag:** After 30 days with no advancement (stale idea)
- **Rex actions:** None automatically
- **To advance:** Kelly or team moves to Script Writing

---

### Stage 2: Script Writing
- **SLA target:** 3 business days
- **Blocker flag:** After 5 days
- **Rex auto-actions (with approval):**
  - Generate full script draft using article-writing skill
  - Research: pull relevant on-chain data, news context, price history
  - Suggest 3 headline variations
- **To advance:** Script approved by Kelly → move to Thumbnail

---

### Stage 3: Thumbnail
- **SLA target:** 2 business days
- **Blocker flag:** After 4 days
- **Rex auto-actions (with approval):**
  - Generate 3 thumbnail concepts using thumbnail-moodboard skill
  - Provide A/B variation for each concept
  - Include color scheme and text overlay suggestions
- **To advance:** Thumbnail concept approved → move to Filming

---

### Stage 4: Filming
- **SLA target:** Depends on schedule — no hard SLA
- **Blocker flag:** After 7 days (prompt: is this still happening?)
- **Rex auto-actions:** None — this is a human execution stage
- **To advance:** Filming complete, raw footage uploaded → move to Editing

---

### Stage 5: Editing
- **SLA target:** 3 business days
- **Blocker flag:** After 5 days
- **Rex auto-actions (with approval):**
  - Generate EDL using video-editing-director skill
  - Identify top 3-5 clipable moments for social repurposing
  - Suggest B-roll for key moments
- **To advance:** Edit complete, final cut ready → move to Review

---

### Stage 6: Review
- **SLA target:** 1 business day
- **Blocker flag:** After 2 days
- **Rex auto-actions:**
  - Run post-production checklist (video-editing-director skill)
  - Flag any compliance, brand, or factual issues
  - Draft publish description, tags, and end-screen suggestions
- **To advance:** Kelly approval → move to Published
- **⚠️ Nothing publishes without Kelly sign-off**

---

### Stage 7: Published
- **Actions:**
  - Log publish URL and YouTube video ID
  - Schedule performance metric pulls: 24h, 7d, 30d
  - Feed CTR data back to thumbnail-moodboard skill for tracking
  - Suggest social media clips for X, TikTok, Shorts (x-post-automator skill)
  - Include in weekly scorecard (#28)

---

## Weekly Pipeline Report (for Scorecard)

| Metric | Value |
|--------|-------|
| Total pieces in pipeline | [X] |
| Published this week | [X] |
| Stuck >5 days (by stage) | [stage: X pieces] |
| Avg time Idea → Published | [X] days |
| Avg CTR (last 5 videos) | [X]% |
| Top performing piece (7d views) | [title + views] |

---

## Connected Skills

| Stage | Skill Used |
|-------|-----------|
| Script Writing | article-writing |
| Thumbnail | thumbnail-moodboard |
| Editing | video-editing-director |
| Published (social clips) | x-post-automator |
| Published (metrics) | web-data-spreadsheet |
| Weekly report | weekly-scorecard (#28) |
