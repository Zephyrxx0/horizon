# Phase 4: Review, Payment & Submission - Context

**Gathered:** 2026-08-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 delivers the complete Stage 4 citizen journey: Review, Payment & Submission (REVW-01, REVW-02, PAY-01, PAY-02, PAY-03, PAY-04):

1. **Check-Answers Multi-Stage Review** — Unified review screen displaying all entered information structured by stage (Visa Selection, Personal Details, Documents) in dedicated Card sections, with an explicit accuracy declaration checkbox before proceeding to payment. (REVW-01)
2. **Deep-Link Step Editing & Quick Return** — "Edit" action on each stage summary card that deep-links directly to that specific wizard step and renders a sticky top navigation banner ("Editing [Stage] — Return to Review") for frictionless round-tripping. (REVW-02)
3. **Itemized Fee Transparency & Payment Options** — Transparent cost breakdown (Visa Processing Fee + Government Fee ₹5,000 + Platform Fee ₹1,500 = Total) with "Zero hidden charges" trust messaging and `RadioCard` selection for UPI (UPI ID / QR Code), Cards (auto-formatted), and Netbanking (popular Indian banks). (PAY-01, PAY-02)
4. **Resilient Mock Payment State Machine** — Async payment execution with multi-stage loading modal (preventing double-submit), demo scenario switcher (Success, Declined, Timeout), in-context failure recovery card preserving all user data, and pending verification status card with manual "[Check Status]" resolution. (PAY-03, FOUND-05)
5. **In-App Receipt Generation & Submission Gate** — Instant payment confirmation generating an itemized printable/downloadable receipt, locking submitted drafts to read-only mode, dispatching mock email/SMS notifications with toast alerts, and auto-advancing the wizard machine to Stage 5 (Confirmation & Tracking). (PAY-04)

Stage 5 post-submission tracking timelines, reference number lookup, email backup restore codes, and WhatsApp sharing are out of scope for this phase (covered in Phase 5).
</domain>

<decisions>
## Implementation Decisions

### Review & Edit Experience

- **D-01:** The check-answers screen is organized into dedicated `Card` components per stage (Visa Selection, Personal Details, and Document Uploads) with individual "Edit" action buttons in each card header. Reuses existing `Card` primitive. — **Reversibility:** costly — defines review view architecture and stage grouping components.
- **D-02:** Clicking "Edit" deep-links directly to the exact target step in the wizard machine and mounts a persistent sticky top banner ("Editing [Stage Name] — [Return to Review]") allowing applicants to return immediately without stepping through remaining screens. — **Reversibility:** costly — integrates with wizard step machine routing and navigation state.
- **D-03:** Document attachments in the Review summary render as rich visual chips featuring thumbnail previews, file names, formatted sizes, and a click action that opens the accessible `DocumentPreviewSheet` for instant verification. — **Reversibility:** reversible — UI rendering reusing Phase 3 preview sheet.
- **D-04:** Moving from Review to Payment is gated by a single mandatory declaration checkbox ("I declare that all information provided is true and documents uploaded are authentic") with inline error feedback if skipped. — **Reversibility:** costly — gates wizard validation selector and step progression.

### Payment Methods & Checkout UI

- **D-05:** Payment methods (UPI, Card, Netbanking) are presented as prominent `RadioCard` options with brand logos/icons (GPay, PhonePe, Paytm, RuPay, Visa, Mastercard) adhering to 48px touch target requirements. — **Reversibility:** reversible — component-level layout reusing `RadioCard`.
- **D-06:** The UPI payment flow supports dual input modes: entering a custom UPI ID / VPA with auto-suffix suggestions (e.g. `@okhdfcbank`, `@okaxis`) OR generating a scannable mock QR code. — **Reversibility:** costly — defines UPI form model and QR presentation state.
- **D-07:** Debit/Credit Card inputs include client-side formatting (4-4-4-4 card spacing, MM/YY expiry, CVV masking), while Netbanking provides a searchable selector of leading Indian banks (SBI, HDFC, ICICI, Axis, PNB). — **Reversibility:** reversible — input formatters and bank dataset.
- **D-08:** Fees are presented in an itemized transparent card displaying Visa Processing Fee (country/visa-specific via `processingFeeFor`), Government Fee (₹5,000), and Platform Fee (₹1,500) with a bold Total and a "Zero hidden charges" trust badge. — **Reversibility:** costly — connects fee constants from `src/services/types.ts` to checkout UI.

### Payment State Machine & Error Recovery

- **D-09:** Developers and testers can toggle mock payment outcomes (Success, Card Declined, Bank Timeout, Network Error) via a discreet test scenario bar in the payment screen footer connected to `setMockScenario('payment', ...)`. — **Reversibility:** reversible — developer harness for testing.
- **D-10:** Submitting payment displays a multi-stage loading modal overlay ("Contacting payment gateway...", "Authorizing with bank...", "Confirming transaction...") that blocks interaction to prevent double-charging or duplicate submissions. — **Reversibility:** costly — modal state machine guarding payment execution.
- **D-11:** Payment failures surface an in-context amber/red alert card explaining the exact bank response reason with two clear recovery actions: "[Retry Payment]" and "[Choose Another Method]", retaining 100% of entered wizard and form data. — **Reversibility:** costly — failure handling flow in payment component.
- **D-12:** Bank timeout or pending responses render a dedicated pending status card explaining that bank verification is in progress, equipped with a manual "[Check Status]" button that re-invokes `IPaymentService.confirm` and resolves instantly. — **Reversibility:** costly — pending state handler in payment service loop.

### Submission Gate & In-App Receipt

- **D-13:** Successful payment generates an official in-app receipt record with a unique transaction reference ID (`PAY-XXXXXX`), timestamp, applicant name, payment method, and itemized fee breakdown, accompanied by a "Download / Print Receipt" action. — **Reversibility:** costly — receipt data model and print/download utility.
- **D-14:** Upon payment confirmation, the wizard machine automatically advances to Stage 5 (`confirmation`), embedding the payment receipt directly in the confirmation view alongside the tracking number. — **Reversibility:** costly — step transition in XState wizard machine.
- **D-15:** Once payment succeeds, the application draft is flagged as `submitted: true`, locking earlier form steps into a read-only review mode to prevent accidental modification of paid applications. — **Reversibility:** costly — wizard state machine lock guard.
- **D-16:** Payment success triggers `INotificationService.sendEmail` and `INotificationService.sendSms` with the confirmation details and displays an accessible toast ("Receipt and confirmation sent to your email and phone"). — **Reversibility:** costly — integration with mock notification service and toast provider.

### Agent's Discretion

- Exact SVG styling of payment brand badges, animated spinner transitions inside the payment processing modal, print stylesheet formatting for the downloadable receipt card, and layout adjustments for small 320px mobile screens within WCAG AA design system tokens.
</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product & Requirements References

- `visarethink/indian_visa_prd.md` §2, §4, §5 (Stage 4 Payment & Review) — Review requirements, itemized cost breakdown (Processing ₹7,500 / Govt ₹5,000 / Platform ₹1,500), payment methods (UPI, Card, Netbanking), instant confirmation, receipt generation, mock payment gateway table.
- `visarethink/visa_prototype.jsx` (lines 806–950) — Reference Stage 3/4 Payment & Review layout, fee calculations, payment method radio inputs, total cost presentation, and submission confirmation.
- `.planning/REQUIREMENTS.md` — REVW-01, REVW-02, PAY-01, PAY-02, PAY-03, PAY-04, ERR-01, ERR-02 definitions.
- `.planning/ROADMAP.md` — Phase 4 goals and success criteria.

### Architecture & Foundation References

- `.planning/phases/01-foundation-design-system-persistence-engine/01-CONTEXT.md` — Phase 1 established decisions (Typed mock services, `IPaymentService`, `INotificationService`, `GOVERNMENT_FEE`, `PLATFORM_FEE`, `processingFeeFor`, XState wizard machine).
- `.planning/phases/02-guided-journey-visa-selection-personal-details/02-CONTEXT.md` — Phase 2 established decisions (Stage 1 visa selection, Stage 2 personal details, error summary, progressive disclosure).
- `.planning/phases/03-document-upload-pipeline/03-CONTEXT.md` — Phase 3 established decisions (Document slot model, thumbnail preview, `DocumentPreviewSheet`, IndexedDB persistence).
- `src/services/types.ts` — `IPaymentService`, `PaymentInput`, `PaymentIntent`, `PaymentResult`, `ServiceOutcome`, `GOVERNMENT_FEE`, `PLATFORM_FEE`, `processingFeeFor`, `INotificationService`.
- `src/services/mock/payment.ts` — `MockPaymentService` (`initiate`, `confirm`, `retry`).
- `src/services/mock/scenarios.ts` — `getMockScenario`, `setMockScenario`, `resolveWithScenario`.
- `src/components/ui/` — Design system primitives (`Card`, `Button`, `RadioCard`, `Input`, `Field`, `Checkbox`, `ErrorSummary`, `Sheet`, `Toast`, `ProgressStepper`).
- `src/features/wizard/types.ts` — `StepId` (`review-payment`, `confirmation`), `JOURNEY_STEPS`.
- `src/features/wizard/machine.ts` — Wizard state machine events (`ANSWER_CHANGED`, `GOTO`, `NEXT`, `BACK`).
- `src/features/wizard/selectors.ts` — Wizard validation and step status derivation.
  </canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/services/types.ts` & `src/services/mock/payment.ts`: `MockPaymentService` with `initiate`, `confirm`, `retry` methods and scenario configuration.
- `src/services/mock/scenarios.ts`: `setMockScenario('payment', ...)` to drive testable success, decline, and timeout states.
- `src/components/ui/RadioCard.tsx`: Accessible 48px touch-target radio card for selecting UPI, Card, or Netbanking.
- `src/components/ui/Card.tsx`: Standard card container for stage review summaries and fee breakdown.
- `src/components/ui/Button.tsx`: Accessible action buttons for "Pay Now", "Edit", "Retry", "Download Receipt".
- `src/components/ui/Checkbox.tsx`: Accessible declaration checkbox with required state error handling.
- `src/components/ui/ErrorSummary.tsx`: Accessible top-level summary linking to invalid fields if declaration or payment fails.
- `src/components/ui/Toast.tsx`: Toast dispatch for payment success and notification alerts (`useToast`).
- `src/features/documents/DocumentPreviewSheet.tsx`: Accessible Sheet for previewing document attachments directly from the review card.

### Established Patterns

- Wizard answers store review and payment metadata (`{ paymentMethod, paymentReference, paymentCompleted, paidAt, declarationConfirmed, returnToReviewStep, ... }`).
- Wizard step validation is purely derived in `src/features/wizard/selectors.ts` and `src/features/wizard/validators.ts`.
- Deep-link editing utilizes the wizard machine's `GOTO` event with an optional `returnToReview` context flag.
- Fee calculations use `GOVERNMENT_FEE`, `PLATFORM_FEE`, and `processingFeeFor(country, visaType)` from `src/services/types.ts`.

### Integration Points

- `src/features/wizard/machine.ts`: Wire Stage 4 (`review-payment`) transition logic and locked draft behavior upon payment completion.
- `src/features/wizard/selectors.ts`: Implement `isReviewPaymentStepValid` and update `deriveStepStatus` for `review-payment`.
- `src/features/wizard/validators.ts`: Add `validateReviewPaymentStep` ensuring declaration checkbox and payment completion.
- `src/features/review/`: New feature module containing `ReviewScreen`, `StageReviewCard`, `EditingBanner`, `FeeBreakdownCard`, `PaymentMethodSelector`, `PaymentProcessingModal`, `PaymentFailureCard`, `ReceiptCard`, and `PaymentScenarioBar`.
- `src/App.tsx`: Replace the Stage 4 placeholder with `ReviewPaymentScreen`.
  </code_context>

<specifics>
## Specific Ideas

- Sticky "Editing [Stage Name] — [Return to Review]" banner mounted at the top of the form when the user jumps back from Review, allowing 1-tap return once edits are made.
- Scannable mock QR code with simulated 3-second auto-authorization for mobile UPI testers alongside standard VPA entry (`user@bank`).
- Clear multi-stage loading animation during payment ("Connecting to gateway → Contacting bank → Confirming") to provide realistic feedback and prevent double-clicks.
- Itemized receipt card with clean print CSS support (`@media print`) and copyable reference ID (`PAY-XXXXXX`).
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed strictly within the Stage 4 Review, Payment & Submission domain.
</deferred>

---

_Phase: 04-Review, Payment & Submission_
_Context gathered: 2026-08-26_
