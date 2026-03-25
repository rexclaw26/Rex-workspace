# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Model Configuration (Updated 2026-03-12)

**Primary model:** `anthropic/claude-sonnet-4-6`

**Fallback model:** `anthropic/claude-haiku-3-5` (replaced qwen on 2026-03-12 for security)

**Notes:**
- Qwen removed from fallback chain — it was an untrusted endpoint risk
- Haiku is cheaper than qwen AND has Anthropic safety guarantees
- Model switching via `/model [model-name]` command
- Sub-agents can have per-agent model overrides if needed

Add whatever helps you do your job. This is your cheat sheet.
