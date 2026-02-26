---
name: defi-trade-tracking
description: DeFi trade tracking and tax preparation for Rex. Monitors wallet transactions across Ethereum, Solana, Arbitrum, and Base. Calculates realized and unrealized P&L using FIFO methodology, flags taxable events, and generates quarterly tax summaries for the accountant. Trigger on "DeFi trades", "track positions", "tax prep", "trade history", "P&L", "wallet transactions", or any request to analyze on-chain activity. Always recommends CPA review for tax matters.
---

# DeFi Trade Tracking & Tax Prep

**Trigger:** "DeFi trades," "track positions," "tax prep," "trade history," "P&L"

---

## 1. Transaction Monitoring

Pull transaction history from specified wallet addresses.

**Supported chains:** Ethereum · Solana · Arbitrum · Base _(expandable)_

**Transaction categories:**

| Category | Description |
|----------|-------------|
| Swap | Token-to-token exchange |
| Bridge | Cross-chain asset transfer |
| Deposit | Adding liquidity or staking |
| Withdrawal | Removing liquidity or unstaking |
| Yield Claim | Harvesting farming rewards or staking income |
| Airdrop | Token distribution received |
| NFT Mint | New NFT creation/purchase |
| NFT Sale | NFT sold for proceeds |

See [transaction-categories.md](references/transaction-categories.md) for edge cases and categorization rules.

**Data sources by chain:** See [chain-explorers.md](references/chain-explorers.md).

---

## 2. P&L Calculation

- **Cost basis method:** FIFO (First In, First Out)
- **Realized P&L:** Calculated per closed trade
- **Unrealized P&L:** Tracked on all open positions
- **Price data:** CoinGecko primary, cross-referenced with exchange data

Every price used must be timestamped at the trade's block timestamp — not current price.

---

## 3. Tax Event Flagging

Auto-flag the following for review:

| Event | Flag | Note |
|-------|------|------|
| Trade >$10,000 | ⚠️ Large transaction | Report per IRS threshold |
| Airdrop received | ⚠️ Taxable income | FMV at receipt date = ordinary income |
| Yield farming / staking rewards | ⚠️ Taxable as earned | Ordinary income at claim date |
| Potential wash sale | ⚠️ Wash sale review | Crypto wash sale rules evolving — flag for CPA |
| Short-term gain (<1 year) | 📌 Short-term | Taxed as ordinary income |
| Long-term gain (>1 year) | 📌 Long-term | Preferred tax rate |

> ⚠️ Tax rules on crypto change frequently. **Always recommend CPA review** before filing. Rex provides data and preliminary categorization, not tax advice.

---

## 4. Reporting

**Quarterly tax prep summary** — formatted for accountant delivery.

See [tax-report-format.md](references/tax-report-format.md) for the full format.

**Summary includes:**
- All taxable events with: Date · Asset · Type · Amount · Cost Basis · Proceeds · Gain/Loss · Source
- Total short-term gains/losses
- Total long-term gains/losses
- Yield/airdrop income totals
- Raw transaction data export for CPA verification

---

## Data Integrity

- All price data: CoinGecko + at least one exchange cross-reference
- Transaction data: block explorers (Etherscan, Solscan, Arbiscan, Basescan)
- **Every trade must include:** block number + transaction hash
- Gas costs: pulled from chain — never estimated

---

## Anti-Hallucination

Never fabricate transaction data, prices, or P&L figures. If chain data is unavailable, report the gap explicitly. Never present estimated figures as actuals.
