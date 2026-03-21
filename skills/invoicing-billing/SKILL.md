---
name: invoicing-billing
description: Invoicing and billing tracker for Rex. Generates professional invoices, tracks accounts receivable, manages overdue follow-ups, and produces AR reports for Hit Network. Trigger on "create an invoice", "billing", "track invoices", "accounts receivable", "AR report", "who owes us money", or any invoice or payment tracking request. Escalates overdue accounts per protocol. Never sends follow-up emails without human approval.
---

# Invoicing & Billing Tracker

**Trigger:** "Create an invoice," "billing," "track invoices," "accounts receivable," "AR report"

---

## 1. Invoice Generation

Required fields on every invoice:
- Invoice number (sequential, never duplicated)
- Issue date + due date
- Client name and billing address
- Line items: description, quantity, rate, amount
- Subtotal, tax (if applicable), total
- Payment terms (default: **Net 30**)
- Bank/payment details and tax information

See [invoice-template.md](references/invoice-template.md) for the standard format.

Flag for Kelly's approval before sending any invoice.

**PRE-SEND GATE — sub-agent proof required for all client-facing emails. (PR-008)**

Invoices and follow-up emails go to real clients. Any humanization failure here reflects on the business.

**For invoices (structured document — no sub-agent proof required):** Show gate only.
**For follow-up emails, overdue notices, or any client correspondence:** Sub-agent proof FIRST.

**Step 1 (emails only):** Spawn proofreader sub-agent with full email draft + humanization rules. Wait for PASS. Fix all violations. Re-proof if needed.

**Step 2:** Show gate before presenting to Kelly:
```
⚙️ OUTPUT GATE — Invoicing & Billing
─────────────────────────────────────────────────────────
SUB-AGENT PROOF  : ✅ PASSED (emails) | N/A (invoice documents)
LAW 1 │ Humanization  : ✅ PASS — EMAIL mode for correspondence, REPORT mode for AR reports
LAW 5 │ Sources       : ✅ TAGGED — all figures from billing system [Source: Stripe | Date:], not memory
LAW 6 │ Human Approval: ⏸ HOLDING — not sending until Kelly says "send"
─────────────────────────────────────────────────────────
```
**⏸ INVOICE/EMAIL NOT SENT. Presented for approval only.**

---

## 2. Invoice Tracking — AR Dashboard

**Status pipeline:** `Draft → Sent → Viewed → Paid → Overdue`

**Aging buckets:**

| Bucket | Days Outstanding |
|--------|-----------------|
| Current | 0–30 days |
| 30-Day | 31–60 days |
| 60-Day | 61–90 days |
| 90+ Day | 90+ days — escalation required |

Track total outstanding AR with breakdown by client at all times.

See [ar-dashboard.md](references/ar-dashboard.md) for tracking format.

---

## 3. Overdue Follow-Up Protocol

| Threshold | Action | Approval Required |
|-----------|--------|------------------|
| 30 days overdue | Draft polite follow-up email | Yes — Kelly approves before send |
| 60 days overdue | Escalate to TJ with full payment history | Yes — Kelly approves |
| 90 days overdue | Flag for potential collections action | Yes — Kelly decision required |

**Never send follow-up emails without explicit human approval.**

---

## 4. Reporting

**Weekly AR summary includes:**
- Total outstanding AR (all aging buckets)
- New invoices sent this week
- Payments received this week
- Any newly overdue accounts

**Monthly billing report includes:**
- Revenue by client
- Payment velocity (avg days to pay by client)
- Aging trends vs. prior month
- Sponsor payment status: current vs. overdue

---

## Data Integrity

All invoice amounts and payment dates must come from the billing system directly — never estimated or carried from memory. Include `[Source: Stripe / billing system | Date: ...]` on all figures.

---

## Humanization

Apply Humanization Framework — EMAIL mode for all client-facing invoice communications and follow-ups. REPORT mode for AR reports and summaries. Run LAW 1 verification checklist from AGENTS.md before presenting any written output to Kelly.

## Anti-Hallucination

Never fabricate invoice numbers, amounts, or payment dates. If billing system access is unavailable, say so and work only from data Kelly provides.
