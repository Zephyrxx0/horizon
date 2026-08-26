---
status: complete
phase: 04-review-payment-submission
source:
  - .planning/phases/04-review-payment-submission/04-01-SUMMARY.md
  - .planning/phases/04-review-payment-submission/04-02-SUMMARY.md
  - .planning/phases/04-review-payment-submission/04-03-SUMMARY.md
  - .planning/phases/04-review-payment-submission/04-04-SUMMARY.md
started: 2026-08-26T13:12:00Z
updated: 2026-08-26T13:12:30Z
---

## Current Test

number: 9
name: Official In-App Receipt, Locked Draft & Notification
expected: |
Successful payment generates official receipt (PAY-XXXXXX) with timestamp and itemized breakdown, locks draft as read-only, dispatches notification toast, and transitions to Stage 5.
result: pass

## Tests

### 1. Cold Start Smoke Test

expected: Application boots from scratch with clean storage, rendering Stage 1 with step stepper and language switcher.
result: pass
source: automated
evidence: Playwright tests/e2e/stage4-review-payment.spec.ts & smoke.spec.ts passed

### 2. Review Check-Answers Layout (REVW-01)

expected: Stage 4 displays structured summary cards for Visa Selection, Personal & Passport Details, and Uploaded Documents with full entered values.
result: pass
source: automated
evidence: ReviewScreen.test.tsx & Playwright stage4-review-payment.spec.ts passed

### 3. Deep-Link Round-Trip Editing & Sticky Banner (REVW-02)

expected: Clicking "Edit" on a stage jumps to that exact step with a sticky top banner ("Editing Stage X — Return to Review"). Modifying fields and clicking "Return to Review" brings user back to Stage 4 with changes reflected and zero data loss.
result: pass
source: automated
evidence: EditingBanner.test.tsx, ReviewScreen.test.tsx, Playwright stage4-review-payment.spec.ts passed

### 4. Document Quick Preview in Review (REVW-01)

expected: Clicking document chips in the Uploaded Documents card opens DocumentPreviewSheet for instant visual inspection.
result: pass
source: automated
evidence: StageReviewCard.test.tsx passed

### 5. Applicant Declaration Consent Gate (REVW-01)

expected: Submitting without checking the mandatory declaration displays an accessible error summary and inline error alert, blocking payment submission.
result: pass
source: automated
evidence: DeclarationCheckbox.test.tsx, ReviewScreen.test.tsx, Playwright stage4-review-payment.spec.ts passed

### 6. Transparent Itemized Fee Breakdown (PAY-01)

expected: Itemized fees show Processing Fee, Govt Fee (₹5,000), Platform Fee (₹1,500), Total (₹8,500), and a "Zero hidden charges" trust badge.
result: pass
source: automated
evidence: FeeBreakdownCard.test.tsx, fees.test.tsx, Playwright stage4-review-payment.spec.ts passed

### 7. Payment Method Selectors & Validation (PAY-02)

expected: Accessible RadioCards switch between UPI (VPA & QR mode), Card (4-4-4-4 auto-format, MM/YY, CVV, card brand badge), and Netbanking (bank chips + search select).
result: pass
source: automated
evidence: PaymentMethodSelector.test.tsx, UpiPaymentForm.test.tsx, CardPaymentForm.test.tsx, NetbankingForm.test.tsx passed

### 8. Payment Failure Simulation & In-Context Recovery (PAY-03)

expected: Simulating "Card Declined" or "Bank Timeout" opens multi-stage loading dialog, prevents double clicks, then displays contextual error card with [Retry Payment] and [Choose Another Method] preserving 100% of data.
result: pass
source: automated
evidence: PaymentProcessingModal.test.tsx, PaymentFailureCard.test.tsx, PaymentPendingCard.test.tsx, Playwright stage4-review-payment.spec.ts passed

### 9. Official In-App Receipt, Locked Draft & Notification (PAY-04)

expected: Successful payment generates official receipt (PAY-XXXXXX) with timestamp and itemized breakdown, locks draft as read-only, dispatches notification toast, and transitions to Stage 5.
result: pass
source: automated
evidence: ReceiptCard.test.tsx, machine.test.tsx, Playwright stage4-review-payment.spec.ts passed

## Summary

total: 9
passed: 9
issues: 0
pending: 0
skipped: 0
