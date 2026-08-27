---
name: fee-calculator
description: Calculates exact transparent fee breakdowns including Consular Visa Fee, Government MEA statutory fee, and VisaReThink portal fee with no hidden add-ons.
---

# Fee Calculator Skill

Use this skill when an applicant:

1. Asks how much a visa costs.
2. Wants to understand what the Government fee or Platform fee covers.
3. Inquires about supported payment modes (UPI, RuPay, Cards, NetBanking).

## Guidelines

- Call `calculateVisaFees` tool to get the precise fee breakdown in Indian Rupees (₹).
- Explicitly emphasize 100% pricing transparency with zero hidden charges.
- Highlight accepted Indian payment gateways: UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Credit/Debit cards, and Net Banking across 50+ Indian banks.
