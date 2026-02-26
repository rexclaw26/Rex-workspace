---
name: content-pipeline
description: Content Pipeline Component for Mission Control. Tracks all Discover Crypto and Blockchain Basement content through 7 stages: Idea → Script Writing → Thumbnail → Filming → Editing → Review → Published. Auto-generates scripts, thumbnail concepts, and pulls post-publish performance metrics. Trigger on "content pipeline", "video pipeline", "content status", "what's in production", "track this video", or any request to manage, view, or advance content through the production workflow.
---

# Mission Control: Content Pipeline Component

**Pipeline stages:** Idea → Script Writing → Thumbnail → Filming → Editing → Review → Published

This component lives inside Mission Control (Next.js + Convex) and connects to the article-writing, video-editing-director, and thumbnail-moodboard skills.

---

## Pipeline Stage Definitions

| Stage | What it means | Auto-actions |
|-------|-------------|-------------|
| **Idea** | Topic identified, not yet started | None |
| **Script Writing** | Script in progress or assigned to Rex | Auto-generate script draft via article-writing skill |
| **Thumbnail** | Script approved, thumbnail needed | Auto-generate 3 concepts via thumbnail-moodboard skill |
| **Filming** | Content is being filmed | Notify relevant team member |
| **Editing** | Raw footage in post-production | Generate EDL via video-editing-director skill |
| **Review** | Final cut ready, awaiting approval | Flag to Kelly for sign-off |
| **Published** | Live — pull performance metrics | Auto-fetch analytics at 24h, 7d, 30d post-publish |

---

## Auto-Generation Rules

When a piece of content enters a stage, Rex can automatically generate the following (with approval before use):

| Stage entered | Auto-generated asset |
|--------------|---------------------|
| Script Writing | Full script draft (article-writing skill) |
| Thumbnail | 3 thumbnail concepts with A/B variation (thumbnail-moodboard skill) |
| Editing | EDL with B-roll suggestions and clip timestamps (video-editing-director skill) |
| Published | Performance report at 24h, 7d, 30d intervals |

---

## Performance Metrics (Post-Publish)

Pull from YouTube Analytics API at defined intervals:

| Metric | Pull timing |
|--------|------------|
| Views | 24h, 7d, 30d |
| Watch time (avg) | 7d, 30d |
| CTR (thumbnail) | 24h, 7d |
| Likes / comments | 7d, 30d |
| Subscriber delta | 30d |
| Top traffic source | 30d |

All metrics stored in Convex. Feed into thumbnail CTR tracking (thumbnail-moodboard skill) and weekly scorecard (#28).

---

## Content Record Fields

Each content piece tracks:
- Title
- Brand (Discover Crypto / Blockchain Basement)
- Stage (current pipeline position)
- Assigned host / creator
- Target publish date
- Script (linked or generated)
- Thumbnail (concepts + approved version)
- Published URL (when live)
- Performance snapshots (24h, 7d, 30d)
- Notes / blockers

---

## Pipeline Management

- View all content across all stages (Kanban-style board in Mission Control)
- Filter by brand, stage, assigned person, or target date
- Drag card to advance stage — triggers auto-actions for that stage
- Flag blockers: any piece stuck in a stage >5 days surfaces in weekly report
- **Nothing moves to Published without Kelly's approval in Review stage**

See [pipeline-schema.md](references/pipeline-schema.md) for Convex schema extension and UI component spec.
See [content-workflow.md](references/content-workflow.md) for detailed per-stage workflow and SLA targets.
