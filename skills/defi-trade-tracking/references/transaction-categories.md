# Transaction Categorization Rules

## Standard Categories

| Category | Tax Treatment | Detection Signal |
|----------|--------------|-----------------|
| Swap | Taxable disposal of outgoing asset | Token out + token in, same wallet |
| Bridge | Generally not taxable (same owner) | Cross-chain transfer, same wallet address or known bridge contract |
| Deposit (LP/Staking) | May be taxable — flag for CPA | Tokens sent to protocol contract, LP token received |
| Withdrawal (LP/Staking) | May be taxable — flag for CPA | LP token burned, underlying tokens returned |
| Yield Claim | Taxable as ordinary income | Reward tokens received from protocol |
| Airdrop | Taxable as ordinary income at FMV | Unsolicited token receipt from unknown contract |
| NFT Mint | Cost basis established | ETH/SOL sent, NFT received |
| NFT Sale | Taxable disposal | NFT sent, ETH/SOL/stablecoin received |
| Gas only | Non-taxable transfer overhead | ETH movement matching gas cost exactly |
| Wallet-to-wallet (same owner) | Not a taxable event | Transfer between known owned wallets |
| CEX deposit/withdrawal | Not a taxable event | Transfer to/from known exchange address |

## Edge Cases — Flag for CPA

| Scenario | Flag |
|----------|------|
| LP token deposits/withdrawals | Tax treatment disputed — flag |
| Leveraged position open/close | Complex — flag |
| Liquidation event | Taxable disposal — flag with details |
| Token migration (v1 → v2) | May be taxable — flag |
| Rebasing token (e.g., stETH) | Complex income tracking — flag |
| DAO governance token claims | Taxable income — flag |
| NFT royalties received | Taxable income |

## Ambiguous Transactions
When a transaction doesn't clearly fit a category:
1. Record as `UNCATEGORIZED`
2. Include tx hash, date, description, and amounts
3. Flag for Kelly/CPA review
4. Never guess at tax treatment
