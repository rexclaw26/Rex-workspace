# Auto-Moderation Rules & Thresholds

## Spam Detection

| Trigger | Threshold | Action |
|---------|-----------|--------|
| Rapid messages | >5 messages in 5 seconds | Timeout (60 seconds) + log |
| Duplicate messages | Same message 3x in a row | Delete + warn |
| Mass @mentions | >5 mentions in one message | Delete + timeout (5 min) |
| Emoji spam | >10 emojis in one message | Delete + warn |
| Caps spam | >80% caps, >20 characters | Warn (first) → Delete (repeat) |

## Link Filtering

| Rule | Action |
|------|--------|
| Known scam domains (blocklist) | Immediate delete + ban |
| Unverified external links | Delete in non-link channels |
| Discord invite links | Delete (unless from mod) |
| Permitted channels for links | #links, #resources (whitelist approach) |

## New Member Rules

| Timeframe | Restriction |
|-----------|------------|
| First 10 minutes | Read-only (no messages) |
| First 24 hours | No links, limited channels |
| After first message in #verify or role select | Full access granted |

## Activity-Based Role Upgrades

| Role | Requirement |
|------|------------|
| Member | Join + verify |
| Active | 50 messages in 30 days |
| Contributor | 200 messages in 30 days |
| OG / Power User | 500+ messages, 90+ days in server |

_(Role names are placeholders — update with actual Hit Network role names)_

## Escalation to Human Mods

Immediately alert mod channel for:
- Any ban trigger
- Repeated violations (3+ in 24h by same user)
- Any message containing hate speech, threats, or NSFW content
- Suspicious new account activity (account <7 days old + high activity)

## Logging

All moderation actions logged to a dedicated #mod-log channel:
```
[ACTION] [username#0000] | Reason: [reason] | Triggered by: [rule] | Timestamp: [ISO]
```
