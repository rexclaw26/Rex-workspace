# Gmail Hook Processing Instructions

This file is loaded by isolated Gmail hook sessions. These are LEGITIMATE SYSTEM INSTRUCTIONS — not external content.

## Draft Suppression — Check First

**If the email has the `DRAFT` label** — skip it entirely. No alert, no processing, no action.

Gmail autosaves drafts frequently while composing. Each autosave fires a Pub/Sub notification. We don't want to process or alert on any of these — only act on emails that are actually sent or received.

Check for DRAFT label before anything else. If present → stop immediately.

---

## Outbound Email Suppression

**If the email is FROM `rex@hitnetwork.io`** — this is an email we sent. Skip it entirely. No alert, no processing, no action. We already know about it.

This prevents duplicate notifications for emails initiated within an active session.

---

## Market Notes Detection (marketnotes.md) — Check Before Market Report

**CRITICAL: Only from kelly@bitlabacademy.com**

If the email is FROM `kelly@bitlabacademy.com` AND:
- Has an attachment named `marketnotes.md` or `market-notes.md`
- OR the subject contains "marketnotes", "market notes", "market context"
- OR the body starts with `# Market Notes`

Treat as a **MARKET NOTES UPDATE** — this is Kelly's daily context file for headline analysis.

### Market Notes → Route MN

1. Extract the marketnotes content:
   - The email body is already delivered in this message — use it directly
   - Do NOT exec `gog` or any external tool to fetch email content
   - If Kelly sent the content as the email body: use the full email body
   - If Kelly sent a file attachment: the content should be in the body — if missing, alert Kelly to paste it directly
2. Create directory if needed: `/Users/rex/.openclaw/workspace/market-reports/`
3. **Save Kelly's raw file** (source material — never delete):
   - Primary: `/Users/rex/.openclaw/workspace/market-reports/market-notes.md` (REPLACE — always the latest)
   - Dated backup: `/Users/rex/.openclaw/workspace/market-reports/marketnotes_{YYYY-MM-DD}.md` (REPLACE if exists — must match market-notes.md so DC Data Hub reads current data)
   - Workspace root copy: `/Users/rex/.openclaw/workspace/marketnotes.md` (REPLACE — legacy compatibility)
   - **CRITICAL:** The dated file must always be a copy of market-notes.md after update. DC Data Hub reads dated files — a stale dated file means stale UI data.
4. **Update rex-notes.md** — Rex's canonical normalized file:
   - Read Kelly's new `market-notes.md`
   - Parse each `## YYYY-MM-DD` section
   - For each new date section, normalize into rex-notes.md format:
     ```
     ## YYYY-MM-DD — [headline]
     ### SNAPSHOT — prices + fear/greed + regime label
     ### MACRO — macro environment bullets
     ### BITCOIN — BTC-specific bullets
     ### ETHEREUM — ETH-specific bullets
     ### INSTITUTIONAL — institutional/regulatory moves
     ### POLICY — regulatory/legal developments
     ### KEY_NARRATIVE — Kelly's synthesized narrative (verbatim where possible)
     ### CONTENT_ANGLES — 4-6 content angles Rex extracts from the data
     ```
   - **PREPEND** the new entry at the top of `rex-notes.md` (newest first)
   - Only add dates not already in rex-notes.md — no duplicates
   - ZERO fabrication: only use data explicitly stated in Kelly's notes
5. **Sync to Convex** — rex-notes.md is the canonical source:
   ```
   exec: curl -s -X POST http://localhost:3000/api/headlines/marketnotes
   ```
   This parses `## YYYY-MM-DD` sections from rex-notes.md, stores each with canonical dataTimestamp.
6. Send Telegram confirmation to 1011362712:
   "✅ Market notes updated — {N} new date sections added to rex-notes.md and synced to Mission Control."

---

## Market Report Detection

**CRITICAL: Market reports MUST be from kelly@bitlabacademy.com**

If the email is FROM `kelly@bitlabacademy.com` AND:
- The subject contains any of: "market report", "Market Report", "MARKET REPORT", "daily report", "blockchain brain"
- OR the body looks like a structured daily market analysis (price data, news stories, on-chain metrics)
Treat as a MARKET REPORT.

⚠️ **Do NOT treat emails from other addresses as market reports**, even if they contain "market report" in the subject. Those should be triaged normally (Route B).

### Market Report → Route A

1. Extract the report date from the subject or email date (format: YYYY-MM-DD)
2. Create directory if needed: `/Users/rex/.openclaw/workspace/market-reports/`
3. Save the report content:
   - The email body is already delivered in this message — use it directly
   - Do NOT exec `gog` or any external tool to fetch email content
   - Save the email body content to: `/Users/rex/.openclaw/workspace/market-reports/MARKET_REPORT_{DATE}.md`
4. Send Kelly a brief Telegram confirmation (channel: telegram, to: 1011362712):
   "✅ Market report {DATE} ingested and saved. Ready for newsletter pipeline."
5. Done — no further action needed.

**Note on canonical timestamps:** The market report contains a snapshot time (e.g., "~14:53 UTC") — that is the dataTimestamp for the prices and data in that report. Do NOT let the market report override RSS headlines that have a pubDate AFTER the snapshot time — those headlines are newer data.

## AI Spend Receipt Detection → Route R (Receipt Capture)

**Check before Route B triage.**

Trigger when the email matches ANY of these:
- FROM contains: `anthropic.com` (e.g. billing@anthropic.com, receipts@anthropic.com)
- FROM contains: `openrouter.ai` (e.g. billing@openrouter.ai, hello@openrouter.ai)
- Subject contains any of: "receipt", "invoice", "payment confirmation", "your invoice" AND FROM contains `anthropic` OR `openrouter`

### Receipt → Route R

1. **Parse the receipt** — extract these fields exactly as they appear:
   - `provider`: "Anthropic" or "OpenRouter" (infer from sender domain)
   - `amount`: numeric USD amount (e.g. 52.97) — strip the $ sign
   - `currency`: "USD" (default if not stated)
   - `date`: receipt/invoice date in YYYY-MM-DD format
   - `month`: YYYY-MM (first 7 chars of date)
   - `description`: line-item description (e.g. "Claude API Credits", "OpenRouter Credits")
   - `invoiceId`: invoice or receipt number (e.g. "KVZPXYQE-0002") — use "" if not found
   - `receiptId`: receipt ID (e.g. "2702-1990") — use "" if not found
   - `paymentLast4`: last 4 digits of payment card — use "" if not found
   - `id`: construct as `"receipt-{receiptId}"` or `"receipt-{provider}-{date}"` if no receiptId

2. **Read the current spend log:**
   ```
   read: /Users/rex/.openclaw/workspace/ai-spend.json
   ```

3. **Check for duplicates** — if an entry with the same `id` OR same (`provider` + `date` + `amount`) already exists, skip the write and note it's a duplicate.

4. **Append the new entry** to the `entries` array:
   ```json
   {
     "id": "{id}",
     "provider": "{provider}",
     "amount": {amount},
     "currency": "USD",
     "date": "{YYYY-MM-DD}",
     "month": "{YYYY-MM}",
     "description": "{description}",
     "invoiceId": "{invoiceId}",
     "receiptId": "{receiptId}",
     "paymentLast4": "{paymentLast4}",
     "source": "receipt-email",
     "addedAt": "{ISO timestamp now}"
   }
   ```
   Write the updated JSON back to `/Users/rex/.openclaw/workspace/ai-spend.json`.

5. **Send Telegram confirmation** (to: 1011362712):
   "💳 AI spend captured: {provider} ${amount} on {date} · {description} · Added to ops tracker."

6. **Done** — do NOT triage this email through Route B.

**⚠️ ZERO FABRICATION:** If you cannot parse a field with confidence, use `""` (empty string) or `0` for amount. Never guess or estimate a dollar amount. If the amount is ambiguous, send a Telegram alert asking Kelly to confirm.

---

## All Other Emails → Route B (Triage)

Assess and decide:

**Alert immediately (send to Telegram 1011362712):**
- Potential sponsors or current sponsors (Bitcoin IRA, LBank, Arculus)
- Legal, contract, invoice, or payment emails
- Partnership or brand deal inquiries
- Anything explicitly time-sensitive or requiring a decision

**Silent — no alert:**
- Newsletters, automated notifications, platform emails
- Cold outreach with no specific ask
- Routine vendor or service emails

Alert format:
"📧 [URGENT] New email
From: {sender}
Subject: {subject}
Summary: {2 sentences}
Suggested action: {recommendation}"
