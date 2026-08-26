# Phase 4: Review, Payment & Submission - Research

**Researched:** 2026-08-26
**Domain:** Review & check-answers screen with deep-link editing round-tripping, transparent itemized checkout, mock payment gateway state machine (success/declined/timeout/network error), dual UPI & formatted card/netbanking inputs, printable receipt generation, draft submission locking, and simulated notification dispatch.
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md & UI-SPEC.md)

### Locked Decisions

**Review & Edit Experience**

- **D-01:** The check-answers screen is organized into dedicated `Card` components per stage (Visa Selection, Personal Details, Document Uploads) with individual "Edit" action buttons in each card header. Reuses existing `Card` primitive.
- **D-02:** Clicking "Edit" deep-links directly to the exact target step in the wizard machine and mounts a persistent sticky top banner ("Editing [Stage Name] — [Return to Review]") allowing applicants to return immediately without stepping through remaining screens.
- **D-03:** Document attachments in the Review summary render as rich visual chips featuring thumbnail previews, file names, formatted sizes, and a click action that opens the accessible `DocumentPreviewSheet` for instant verification.
- **D-04:** Moving from Review to Payment is gated by a single mandatory declaration checkbox ("I declare that all information provided is true and documents uploaded are authentic") with inline error feedback if skipped.

**Payment Methods & Checkout UI**

- **D-05:** Payment methods (UPI, Card, Netbanking) are presented as prominent `RadioCard` options with brand logos/icons (GPay, PhonePe, Paytm, RuPay, Visa, Mastercard) adhering to 48px touch target requirements.
- **D-06:** The UPI payment flow supports dual input modes: entering a custom UPI ID / VPA with auto-suffix suggestions (e.g. `@okhdfcbank`, `@okaxis`, `@paytm`, `@ybl`) OR generating a scannable mock QR code.
- **D-07:** Debit/Credit Card inputs include client-side formatting (4-4-4-4 card spacing, MM/YY expiry, CVV masking), while Netbanking provides a searchable selector of leading Indian banks (SBI, HDFC, ICICI, Axis, PNB).
- **D-08:** Fees are presented in an itemized transparent card displaying Visa Processing Fee (country/visa-specific via `processingFeeFor`), Government Fee (₹5,000), and Platform Fee (₹1,500) with a bold Total and a "Zero hidden charges" trust badge.

**Payment State Machine & Error Recovery**

- **D-09:** Developers and testers can toggle mock payment outcomes (Success, Card Declined, Bank Timeout, Network Error) via a discreet test scenario bar in the payment screen footer connected to `setMockScenario('payment', ...)`.
- **D-10:** Submitting payment displays a multi-stage loading modal overlay ("Contacting payment gateway...", "Authorizing with bank...", "Confirming transaction...") that blocks interaction to prevent double-charging or duplicate submissions.
- **D-11:** Payment failures surface an in-context amber/red alert card explaining the exact bank response reason with two clear recovery actions: "[Retry Payment]" and "[Choose Another Method]", retaining 100% of entered wizard and form data.
- **D-12:** Bank timeout or pending responses render a dedicated pending status card explaining that bank verification is in progress, equipped with a manual "[Check Status]" button that re-invokes `IPaymentService.confirm` and resolves instantly.

**Submission Gate & In-App Receipt**

- **D-13:** Successful payment generates an official in-app receipt record with a unique transaction reference ID (`PAY-XXXXXX`), timestamp, applicant name, payment method, and itemized fee breakdown, accompanied by a "Download / Print Receipt" action.
- **D-14:** Upon payment confirmation, the wizard machine automatically advances to Stage 5 (`confirmation`), embedding the payment receipt directly in the confirmation view alongside the tracking number.
- **D-15:** Once payment succeeds, the application draft is flagged as `submitted: true`, locking earlier form steps into a read-only review mode to prevent accidental modification of paid applications.
- **D-16:** Payment success triggers `INotificationService.sendEmail` and `INotificationService.sendSms` with the confirmation details and displays an accessible toast ("Receipt and confirmation sent to your email and phone").

### Agent's Discretion

Exact SVG icon paths for payment brand badges, spinner animations, print stylesheet rules, and 320px viewport responsive stacking.

### Deferred Ideas (OUT OF SCOPE)

None — Phase 4 remains strictly focused on Review, Payment & Submission. Post-submission tracking timeline transitions, reference number lookup, email backup restore codes, and WhatsApp sharing are out of scope (covered in Phase 5).
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID                    | Description                                                                                           | Research Support                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **REVW-01**           | User can review all entered answers on a single check-answers page grouped by stage before payment    | `StageReviewCard` components for Visa Selection, Personal Details, and Documents with key-value answer summaries and document thumbnail chips.                  |
| **REVW-02**           | User can jump from the review page to any stage to edit, then return to review                        | Wizard machine `GOTO` action with `returnToReview` flag; sticky `EditingBanner` allowing 1-tap round-trip return to Review.                                     |
| **PAY-01**            | User sees itemized cost breakdown (processing fee, government fee, platform fee, total) before paying | `FeeBreakdownCard` rendering `GOVERNMENT_FEE` (₹5000), `PLATFORM_FEE` (₹1500), and `processingFeeFor(country, visaType)` from `src/services/types.ts`.          |
| **PAY-02**            | User can choose payment method among UPI, Card, Netbanking                                            | `RadioCard` selection for UPI (ID/QR), Card (formatted 4-4-4-4/expiry/CVV), and Netbanking (Indian bank grid + dropdown).                                       |
| **PAY-03**            | Mock payment flow simulates success AND pending/failed states with retry that preserves entered data  | `MockPaymentService` integrated with `setMockScenario`, multi-stage processing modal, in-context failure card with retry, and pending status card.              |
| **PAY-04**            | On success user gets instant confirmation with a receipt saved in-app                                 | `ReceiptCard` with printable CSS (`@media print`), transaction reference `PAY-XXXXXX`, auto-advancement to confirmation, and draft locking (`submitted: true`). |
| **FOUND-05**          | Typed mock service layer exposes payment and notification interfaces behind a swap point              | `IPaymentService` (`initiate`, `confirm`, `retry`), `INotificationService` (`sendEmail`, `sendSms`).                                                            |
| **ERR-01**            | Validation errors show accessible error summaries at top of page with links to invalid fields         | `ErrorSummary` primitive integration for declaration checkbox and payment method fields.                                                                        |
| **ERR-02**            | All error messages are constructive and specific                                                      | Specific constructive error copy in `src/features/wizard/validators.ts`.                                                                                        |
| </phase_requirements> |

## Architectural Responsibility Map

| Capability                           | Module / Layer                                                                        | Description                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Review & Check-Answers Orchestration | `src/features/review/ReviewScreen.tsx`                                                | Container for Stage 4: renders review cards, declaration gate, payment options, fee breakdown, and submission triggers. |
| Stage Review Card Primitives         | `src/features/review/StageReviewCard.tsx`                                             | Formatted summary of answers per stage with edit actions and document attachment preview chips.                         |
| Round-Trip Editing Banner            | `src/features/review/EditingBanner.tsx`                                               | Sticky top banner displayed when editing an earlier step from Review with quick return CTA.                             |
| Fee Breakdown Card                   | `src/features/review/FeeBreakdownCard.tsx`                                            | Itemized rupee fee summary with trust badge and visa-specific calculation.                                              |
| Payment Method Selector              | `src/features/review/PaymentMethodSelector.tsx`                                       | Accessible `RadioCard` group for UPI, Card, and Netbanking.                                                             |
| Payment Method Forms                 | `src/features/review/UpiPaymentForm.tsx`, `CardPaymentForm.tsx`, `NetbankingForm.tsx` | Inputs for UPI ID / QR code, Credit/Debit card with auto-formatting, and Indian bank selection.                         |
| Payment Processing Modal             | `src/features/review/PaymentProcessingModal.tsx`                                      | Modal with animated steps, focus trap, and double-click protection during gateway handshake.                            |
| Error & Pending State Cards          | `src/features/review/PaymentFailureCard.tsx`, `PaymentPendingCard.tsx`                | In-context decline alert and pending bank confirmation cards.                                                           |
| Receipt Card & Print Format          | `src/features/review/ReceiptCard.tsx`                                                 | Formal receipt card with transaction reference ID, printable styles, and download triggers.                             |
| Payment Scenario Controller          | `src/features/review/PaymentScenarioBar.tsx`                                          | Demo scenario toggle bar for testing Success, Declined, Timeout, and Network Error.                                     |
| Wizard Topology & Selectors          | `src/features/wizard/machine.ts`, `selectors.ts`, `validators.ts`                     | Step machine integration for `review-payment` step, validation rules, and locked draft protection.                      |

## Technical Implementation Details

### 1. Deep-Link Round-Trip Editing Architecture

```typescript
// Machine context extensions in src/features/wizard/types.ts
export interface WizardMachineContext {
  answers: Record<string, unknown>;
  currentStepId: StepId;
  returnToReview?: boolean;
}

// In machine transition for GOTO:
on: {
  GOTO: {
    target: '#wizard.navigating',
    actions: assign({
      currentStepId: ({ event }) => event.stepId,
      returnToReview: ({ event, context }) =>
        event.returnToReview !== undefined ? event.returnToReview : context.returnToReview,
    }),
  },
  RETURN_TO_REVIEW: {
    target: '#wizard.navigating',
    actions: assign({
      currentStepId: () => 'review-payment',
      returnToReview: () => false,
    }),
  },
}
```

### 2. Multi-Stage Mock Payment Execution Loop

```typescript
export async function executeMockPayment(
  paymentService: IPaymentService,
  input: PaymentInput,
  onProgress: (step: 'connecting' | 'authorizing' | 'confirming') => void,
): Promise<ServiceOutcome<PaymentResult>> {
  onProgress('connecting');
  const initRes = await paymentService.initiate(input);
  if (initRes.status !== 'success') return initRes as any;

  await new Promise((r) => setTimeout(r, 600));
  onProgress('authorizing');

  await new Promise((r) => setTimeout(r, 700));
  onProgress('confirming');

  const confirmRes = await paymentService.confirm(initRes.data.intentId);
  return confirmRes;
}
```

### 3. Card Number & Expiry Auto-Formatting

```typescript
export function formatCardNumber(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatCardExpiry(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}
```

### 4. Receipt Data Contract & Submission Locking

```typescript
export interface PaymentReceiptData {
  transactionId: string;
  paidAt: string;
  applicantName: string;
  passportNumber: string;
  destinationCountry: string;
  visaType: string;
  paymentMethod: 'upi' | 'card' | 'netbanking';
  paymentMethodDetails: string;
  processingFee: number;
  governmentFee: number;
  platformFee: number;
  totalAmount: number;
}
```

## Testing Strategy

- **Unit Tests (Vitest):**
  - Fee calculation logic (`processingFeeFor`, `GOVERNMENT_FEE`, `PLATFORM_FEE`, total sum).
  - Validation rules in `validateReviewPaymentStep` (declaration check, payment method validity).
  - Formatters: Card number spacing (4-4-4-4), expiry (MM/YY), CVV masking, UPI VPA format validation.
  - Receipt generator and printable data builder.
- **Component Tests (Vitest + Testing Library + axe):**
  - `ReviewScreen` check-answers rendering with full answers and axe accessibility assertions (zero violations).
  - `StageReviewCard` "Edit" button click firing navigation.
  - `EditingBanner` rendering and "Return to Review" action.
  - `FeeBreakdownCard` displaying correct itemized line items.
  - `PaymentMethodSelector` RadioCard selection switching between UPI, Card, and Netbanking forms.
  - `PaymentProcessingModal` multi-stage animation and keyboard focus trapping.
  - `PaymentFailureCard` and `PaymentPendingCard` recovery button actions.
  - `ReceiptCard` print and download triggers.
- **E2E Tests (Playwright):**
  - Walk through full application flow from Stage 1 to Stage 4.
  - Review all answers in Stage 4, click "Edit" on Personal Details, verify sticky `EditingBanner` appears, change a field, click "Return to Review", and verify updated field reflects in Review.
  - Test payment declaration checkbox gating.
  - Test mock payment success: verify processing modal, instant confirmation, receipt rendering, and auto-advance to Stage 5.
  - Test mock payment failure scenario: set scenario to "declined", attempt payment, verify failure card appears without data loss, click "Retry Payment", switch scenario to "success", and complete payment.
  - Verify draft is locked to read-only after submission.
