# Plan 04-01 Summary: Payment Domain Models, Fee Calculator, Input Formatters & Wizard State Machine Topology

**Executed:** 2026-08-26
**Status:** Complete (100% test pass)

## Accomplishments

1. **Review & Payment Domain Types (`src/features/review/types.ts`)**:
   - Defined `PaymentMethodType`, `UpiMode`, `PaymentScenario`, `FeeBreakdown`, `PaymentReceiptData`, and `StageSummaryItem` data structures.
2. **Fee Calculation Engine & Formatters (`src/features/review/fees.ts`, `formatters.ts`)**:
   - Implemented `calculateFeeBreakdown` computing visa processing fee, government fee (₹5,000), and platform fee (₹1,500).
   - Implemented formatters and validators for card numbers (4-4-4-4 spacing + Luhn check), card expiry (MM/YY future date check), CVV masking, and UPI VPA validation.
   - Built card brand detection (`getCardBrand`) for Visa, Mastercard, and RuPay.
3. **Wizard Machine & Step Selectors (`src/features/wizard/`)**:
   - Extended `wizardMachine` with `returnToReview` context flag, `RETURN_TO_REVIEW` event, and `SUBMIT_PAYMENT_SUCCESS` event.
   - Implemented read-only submission locking (`submitted: true`) guarding drafts from post-submission mutation.
   - Implemented `validateReviewPaymentStep` and `isReviewPaymentStepValid` selectors.

## Verification

- `pnpm vitest run src/features/review/ src/features/wizard/` passed 8 test files, 50 tests, 0 failures.
