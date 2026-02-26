---
name: discord-bot
description: Discord bot development and automation for Rex. Builds, configures, and maintains Discord bots for Hit Network servers (Discover Crypto, Blockchain Basement) using Discord.js or discord.py. Trigger on "Discord bot", "automate Discord", "bot commands", "Discord integration", "build a bot", or any request to add automation to a Discord server. Covers slash commands, exchange data integration, community automation, and data aggregation.
---

# Discord Bot Automation

**Trigger:** "Discord bot," "automate Discord," "bot commands," "Discord integration"

---

## 1. Bot Development

**Preferred stack:**
- Discord.js (Node.js) — default for new bots, aligns with existing Next.js/Node stack
- discord.py (Python) — use when Python is already in the project environment

**Core components to build first:**
1. Command handler (slash commands)
2. Event handlers (joins, leaves, reactions, messages)
3. Scheduled tasks (cron-based announcements)
4. Data integration layer (exchange APIs, internal data)

See [bot-architecture.md](references/bot-architecture.md) for structure patterns and boilerplate.

---

## 2. Exchange Data Integration

**Slash commands:**
- `/price [asset]` — live price from exchange API
- `/portfolio` — portfolio summary for registered users
- `/alert [asset] [price] [above/below]` — set price alert for a channel

**Data sources:** Binance · Coinbase · Kraken APIs (cross-reference for accuracy)

**Price alert system:** Notify specified channels when assets hit user-defined thresholds.

Volume and liquidity monitoring — flag significant moves to admin channels.

---

## 3. Community Automation

| Feature | Implementation |
|---------|---------------|
| Welcome messages | DM + #welcome post on member join, role selection prompt |
| Auto-moderation | Spam detection, link filtering, rate limiting |
| Role upgrades | Activity-based — message count thresholds trigger role promotion |
| Scheduled announcements | Cron jobs for livestream reminders, content drops, weekly events |

See [moderation-rules.md](references/moderation-rules.md) for thresholds and filter config.

---

## 4. Data Aggregation

- Community stats dashboard updated hourly (ties into discord-analytics skill)
- Member activity reports: daily / weekly summaries
- Channel engagement metrics
- Custom reports via admin slash commands (e.g., `/report weekly`, `/report channel #name`)

---

## Security Rules (Non-Negotiable)

- Bot tokens in `.env` only — **never hardcoded, never in logs, never in output**
- Minimum required permissions — no admin unless absolutely necessary
- Privileged intents (message content, server members) only when justified
- Rate limiting on all commands — prevent abuse
- Input validation on all slash command parameters
- Human approval required before deploying any bot update to production

---

## Development Workflow

1. Build and test in a staging/dev server first
2. Document every command: purpose, syntax, permissions required
3. Flag any third-party API dependency that could affect reliability
4. Never claim a feature works without testing it in Discord

---

## Anti-Hallucination

Never claim bot features work without testing. Flag all third-party API dependencies (exchange APIs, CoinGecko, etc.) that need verification before deployment.
