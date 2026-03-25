# Discord Bot Architecture

## Recommended Project Structure (Discord.js)

```
discord-bot/
├── .env                    # Tokens and API keys — never commit
├── .env.example            # Template with placeholder values — safe to commit
├── index.js                # Entry point — login, load handlers
├── config.js               # Guild IDs, channel IDs, role IDs, thresholds
├── commands/               # Slash command files
│   ├── price.js
│   ├── portfolio.js
│   ├── alert.js
│   └── report.js
├── events/                 # Discord event handlers
│   ├── ready.js
│   ├── guildMemberAdd.js
│   ├── guildMemberRemove.js
│   └── messageCreate.js
├── tasks/                  # Scheduled/cron jobs
│   ├── priceAlerts.js
│   ├── communityStats.js
│   └── scheduledAnnouncements.js
├── utils/                  # Shared utilities
│   ├── fetchPrice.js
│   ├── rateLimiter.js
│   └── logger.js
└── deploy-commands.js      # Register slash commands with Discord API
```

## Environment Variables (.env)

```
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
BINANCE_API_KEY=
COINBASE_API_KEY=
COINGECKO_API_KEY=
```

## Slash Command Template

```javascript
// commands/price.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('Get live price for a crypto asset')
    .addStringOption(opt =>
      opt.setName('asset')
        .setDescription('Asset ticker (e.g., BTC, ETH)')
        .setRequired(true)),

  async execute(interaction) {
    const asset = interaction.options.getString('asset').toUpperCase();
    // Fetch from API — never hardcode price data
    await interaction.deferReply();
    // ... fetch and respond
  }
};
```

## Required Bot Permissions (Minimum)

| Permission | Required For |
|-----------|-------------|
| Send Messages | Price alerts, welcome messages |
| Embed Links | Rich price display |
| Manage Roles | Activity-based role upgrades |
| Read Message History | Moderation, engagement tracking |
| Moderate Members | Auto-mod (timeout) |
| View Channels | All functionality |

**Do NOT request:** Administrator, Ban Members (unless moderation bot specifically)

## Rate Limiting Pattern

```javascript
const cooldowns = new Map();
const COOLDOWN_MS = 5000; // 5 seconds per user per command

function checkCooldown(userId, commandName) {
  const key = `${userId}:${commandName}`;
  const lastUsed = cooldowns.get(key);
  if (lastUsed && Date.now() - lastUsed < COOLDOWN_MS) return false;
  cooldowns.set(key, Date.now());
  return true;
}
```
