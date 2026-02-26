# Chain Explorer Reference

## Supported Chains

| Chain | Explorer | API Base URL | Native Token | Notes |
|-------|----------|-------------|-------------|-------|
| Ethereum | Etherscan | https://api.etherscan.io/api | ETH | API key required |
| Solana | Solscan | https://public-api.solscan.io | SOL | API key recommended |
| Arbitrum | Arbiscan | https://api.arbiscan.io/api | ETH (L2) | API key required |
| Base | Basescan | https://api.basescan.org/api | ETH (L2) | API key required |

## Key API Endpoints

### Transaction History
- Etherscan: `?module=account&action=txlist&address=[wallet]`
- Token transfers: `?module=account&action=tokentx&address=[wallet]`
- Internal txns: `?module=account&action=txlistinternal&address=[wallet]`

### Price at Block Time
- CoinGecko: `/coins/{id}/history?date={DD-MM-YYYY}` (daily granularity)
- For intraday accuracy: use exchange OHLCV data at trade timestamp

## Gas Cost Retrieval
Always pull actual gas from the transaction receipt:
- `gasUsed × gasPrice = gas cost in wei`
- Convert wei → ETH: divide by 10^18
- Convert ETH → USD: apply ETH price at block timestamp

## Multi-Wallet Support
Track all wallets associated with Hit Network / the fund:
_(Wallet addresses to be configured — never store in skill files)_

## Rate Limits
- Etherscan free tier: 5 calls/sec
- Solscan: varies by tier
- Always implement retry with exponential backoff
