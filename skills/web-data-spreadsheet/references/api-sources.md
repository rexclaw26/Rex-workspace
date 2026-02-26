# API Sources Reference

## Crypto & Market Data

| Source | Base URL | Key Endpoints | Rate Limit (free) | Auth |
|--------|----------|--------------|-------------------|------|
| CoinGecko | https://api.coingecko.com/api/v3 | /simple/price, /coins/markets | 30 calls/min | None (free tier) |
| CoinMarketCap | https://pro-api.coinmarketcap.com/v1 | /cryptocurrency/listings/latest | 333 calls/day | API key required |
| DefiLlama | https://api.llama.fi | /protocols, /tvl/{protocol} | No stated limit | None |

## On-Chain Explorers

| Source | Base URL | Key Use | Auth |
|--------|----------|---------|------|
| Etherscan | https://api.etherscan.io/api | ETH transactions, wallet balances | API key required |
| Solscan | https://public-api.solscan.io | SOL transactions | API key required |
| Arkham Intelligence | https://platform.arkhamintelligence.com | Wallet tracking, entity labels | API key required |

## Social Media

| Source | Base URL | Key Endpoints | Auth |
|--------|----------|--------------|------|
| X/Twitter API v2 | https://api.twitter.com/2 | /tweets/search, /users/:id/tweets | Bearer token required |
| YouTube Data API v3 | https://www.googleapis.com/youtube/v3 | /videos, /channels, /search | API key required |
| Discord API | https://discord.com/api/v10 | /guilds/:id/messages, /channels/:id | Bot token required |

## Financial

| Source | Base URL | Key Endpoints | Auth |
|--------|----------|--------------|------|
| Stripe | https://api.stripe.com/v1 | /charges, /invoices, /payouts | Secret key required |
| Coinbase Advanced | https://api.coinbase.com/api/v3 | /brokerage/accounts, /brokerage/orders | API key + secret |

---

## API Key Storage
- Never embed API keys in output or logs
- Keys stored in secure environment config — never in skill files
- Reference as: `[API_KEY: COINGECKO]`, `[API_KEY: STRIPE]`, etc.
