---
phase: 04
slug: review-payment-submission
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-08-26
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution and retroactive audit.

---

## Test Infrastructure

| Property               | Value                                                                             |
| ---------------------- | --------------------------------------------------------------------------------- |
| **Framework**          | Vitest (Unit / Component) + Playwright (E2E)                                      |
| **Config file**        | `vitest.config.ts`, `playwright.config.ts`                                        |
| **Quick run command**  | `pnpm vitest run src/features/review/`                                            |
| **Full suite command** | `pnpm vitest run && pnpm playwright test tests/e2e/stage4-review-payment.spec.ts` |
| **Estimated runtime**  | ~6 seconds                                                                        |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run src/features/review/`
- **After every plan wave:** Run `pnpm vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green (`pnpm vitest run && pnpm playwright test`)
- **Max feedback latency:** ~6 seconds

---

## Per-Task Verification Map

| Task ID      | Plan | Wave | Requirement                 | Threat Ref | Secure Behavior                                                | Test Type | Automated Command                                                                                                                                                                                         | File Exists | Status   |
| ------------ | ---- | ---- | --------------------------- | ---------- | -------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------- |
| **04-01-01** | 01   | 1    | `PAY-01`                    | —          | Transparent fee calculation & input sanitization               | unit      | `pnpm vitest run src/features/review/fees.test.ts src/features/review/formatters.test.ts`                                                                                                                 | ✅          | ✅ green |
| **04-01-02** | 01   | 1    | `REVW-02`, `PAY-04`         | —          | Atomic state transitions & draft lock after submission         | unit      | `pnpm vitest run src/features/wizard/machine.test.ts src/features/wizard/validators.test.ts src/features/wizard/selectors.test.ts`                                                                        | ✅          | ✅ green |
| **04-02-01** | 02   | 2    | `REVW-01`                   | —          | Section summary cards with document preview triggers           | component | `pnpm vitest run src/features/review/StageReviewCard.test.tsx`                                                                                                                                            | ✅          | ✅ green |
| **04-02-02** | 02   | 2    | `REVW-02`                   | —          | Sticky return-to-review header banner                          | component | `pnpm vitest run src/features/review/EditingBanner.test.tsx`                                                                                                                                              | ✅          | ✅ green |
| **04-02-03** | 02   | 2    | `REVW-01`                   | —          | Accessible declaration checkbox validation gate                | component | `pnpm vitest run src/features/review/DeclarationCheckbox.test.tsx`                                                                                                                                        | ✅          | ✅ green |
| **04-03-01** | 03   | 2    | `PAY-01`                    | —          | Itemized fee breakdown with trust badge                        | component | `pnpm vitest run src/features/review/FeeBreakdownCard.test.tsx`                                                                                                                                           | ✅          | ✅ green |
| **04-03-02** | 03   | 2    | `PAY-02`                    | —          | RadioCard payment methods (UPI, formatted Card, Netbanking)    | component | `pnpm vitest run src/features/review/PaymentMethodSelector.test.tsx src/features/review/UpiPaymentForm.test.tsx src/features/review/CardPaymentForm.test.tsx src/features/review/NetbankingForm.test.tsx` | ✅          | ✅ green |
| **04-03-03** | 03   | 2    | `PAY-03`                    | —          | Mock scenario controller for test harness                      | component | `pnpm vitest run src/features/review/PaymentScenarioBar.test.tsx`                                                                                                                                         | ✅          | ✅ green |
| **04-04-01** | 04   | 3    | `PAY-03`                    | —          | Multi-stage modal, decline failure & pending recovery cards    | component | `pnpm vitest run src/features/review/PaymentProcessingModal.test.tsx src/features/review/PaymentFailureCard.test.tsx src/features/review/PaymentPendingCard.test.tsx`                                     | ✅          | ✅ green |
| **04-04-02** | 04   | 3    | `PAY-04`                    | —          | Printable official in-app receipt & notification service toast | component | `pnpm vitest run src/features/review/ReceiptCard.test.tsx src/features/review/ReviewScreen.test.tsx`                                                                                                      | ✅          | ✅ green |
| **04-04-03** | 04   | 3    | `REVW-01..02`, `PAY-01..04` | —          | Full Stage 4 browser journey end-to-end                        | E2E       | `pnpm playwright test tests/e2e/stage4-review-payment.spec.ts`                                                                                                                                            | ✅          | ✅ green |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

All phase behaviors have automated verification (100% automated coverage).

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify commands
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Existing infrastructure covers all requirements
- [x] No watch-mode flags
- [x] Feedback latency < 10s (~6s actual)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-08-26
