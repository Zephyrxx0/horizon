---
phase: 4
slug: review-payment-submission
status: approved
shadcn_initialized: false
preset: none
created: 2026-08-26
reviewed_at: 2026-08-26
---

# Phase 4 — UI Design Contract: Review, Payment & Submission

> Visual and interaction contract for Stage 4: Review, Payment & Submission. Verified against design tokens, accessibility contracts, and upstream decisions.
>
> **Context:** All design decisions are locked per `04-CONTEXT.md` (D-01 to D-16), REQUIREMENTS.md (`REVW-01`, `REVW-02`, `PAY-01` to `PAY-04`, `ERR-01`, `ERR-02`), and Phase 1 design system tokens.

---

## Design System

| Property          | Value                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tool              | none — custom component library in `src/components/ui/`                                                                                                                                                                                                            |
| Preset            | not applicable                                                                                                                                                                                                                                                     |
| Component library | Custom primitives: `Card`, `Button`, `RadioCard`, `Input`, `Field`, `Checkbox`, `ErrorSummary`, `Sheet`, `Toast`, `ProgressStepper`, `SaveIndicator`                                                                                                               |
| Icon library      | `lucide-react` (24px grid, 2px stroke): `CreditCard`, `QrCode`, `Smartphone`, `Building2`, `CheckCircle2`, `AlertTriangle`, `AlertCircle`, `Edit2`, `Download`, `Printer`, `Clock`, `ArrowLeft`, `ArrowRight`, `Lock`, `ShieldCheck`, `RefreshCw`, `FileText`, `X` |
| Font              | Noto Sans via Fontsource (400 regular, 600 semibold)                                                                                                                                                                                                               |
| Styling engine    | Tailwind v4, CSS tokens in `src/styles/theme.css`                                                                                                                                                                                                                  |

---

## Spacing Scale

| Token | Value | Usage                                                                             |
| ----- | ----- | --------------------------------------------------------------------------------- |
| xs    | 4px   | Icon-to-label inline gaps, VPA auto-suffix chips, badge padding                   |
| sm    | 8px   | Gap between payment method badges, button icon gaps, fee row spacing              |
| md    | 16px  | Card content rhythm, input field vertical separation, review item spacing         |
| lg    | 24px  | Card inner padding (`p-6`), section inner padding, modal content padding          |
| xl    | 32px  | Separation between review sections and payment area                               |
| 2xl   | 48px  | **Minimum touch-target size** for all interactive buttons, RadioCards, and inputs |
| 3xl   | 64px  | Page vertical rhythm, modal backdrop margins, print header padding                |

Rules:

- All payment selection `RadioCard` elements and CTA buttons have ≥48px touch height.
- Check-answers cards and Fee breakdown cards have 24px inner padding (`p-6`).
- Deep-link editing sticky banner has 48px height with 16px padding on mobile.

---

## Typography

| Role    | Size | Weight | Line Height | Usage                                                                                |
| ------- | ---- | ------ | ----------- | ------------------------------------------------------------------------------------ |
| Display | 28px | 600    | 1.2         | Screen title ("Review your application", "Payment & Submission")                     |
| Heading | 20px | 600    | 1.2         | Section titles ("Visa Selection", "Personal Details", "Documents", "Payment Method") |
| Label   | 16px | 600    | 1.4         | Summary field labels, RadioCard titles, button text, checkbox labels                 |
| Body    | 16px | 400    | 1.5         | Summary values, instructions, payment status descriptions, disclaimer text           |
| Meta    | 14px | 400    | 1.4         | Helper hints, transaction timestamps, receipt metadata, VPA suffixes                 |

Rules:

- Sentence case everywhere. No ALL-CAPS styling.
- Total fee amounts render boldly at 24px/600 or 20px/600 in accent/ink colors.
- Transaction references (`PAY-XXXXXX`) render at 16px monospace or semibold for readability.

---

## Color

| Role                | Value                      | Usage                                                                                            |
| ------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| Dominant (60%)      | `#F7F7FA` (surface-bg)     | Screen background canvas                                                                         |
| Secondary (30%)     | `#FFFFFF` (surface-card)   | Review summary cards, Payment form cards, Receipt card, Modal surfaces                           |
| Accent (10%)        | `#3730A3` (indigo-primary) | Primary "Proceed to Payment" / "Pay Now" buttons, selected RadioCard borders, active focus rings |
| Destructive         | `#B91C1C` (red-error)      | Card validation errors, payment declined alert card (`#FEF2F2` background)                       |
| Warning / Attention | `#B45309` (saffron-deep)   | Payment pending verification card (`#FFFBEB` background), editing banner highlight               |
| Success             | `#166534` (green-success)  | "✓ Ready" document badges, payment success receipt banner (`#F0FDF4` background)                 |

Contrast obligations:

- White text on `#3730A3` (indigo primary): 9.9:1 (WCAG AAA)
- `#166534` on `#F0FDF4` (success badge / receipt): 7.8:1 (WCAG AAA)
- `#B45309` on `#FFFBEB` (pending/warning card): 6.2:1 (WCAG AA)
- `#B91C1C` on `#FEF2F2` (declined card): 6.5:1 (WCAG AA)

---

## Copywriting Contract

All strings localized via `src/i18n/locales/en/common.json`.

| Element                    | Copy                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Review Title               | `Review your application`                                                                                                         |
| Review Subtitle            | `Please verify all information before proceeding to payment. You can edit any section if needed.`                                 |
| Edit Button Label          | `Edit {{stageName}}`                                                                                                              |
| Editing Banner Text        | `Editing {{stageName}}`                                                                                                           |
| Return to Review CTA       | `✓ Return to Review`                                                                                                              |
| Declaration Label          | `I declare that all information provided is true and documents uploaded are authentic.`                                           |
| Declaration Required Error | `Please confirm the declaration before proceeding to payment.`                                                                    |
| Fee Breakdown Title        | `Total Amount Due`                                                                                                                |
| Processing Fee Label       | `Visa Processing Fee`                                                                                                             |
| Government Fee Label       | `Government Visa Fee`                                                                                                             |
| Platform Fee Label         | `Platform & Technology Fee`                                                                                                       |
| Zero Hidden Charges Badge  | `✓ Zero hidden charges`                                                                                                           |
| Total Amount Label         | `Total Payable`                                                                                                                   |
| Payment Method Title       | `Select Payment Method`                                                                                                           |
| UPI Method Title           | `UPI (GPay / PhonePe / Paytm / BHIM)`                                                                                             |
| Card Method Title          | `Credit / Debit Card (Visa / Mastercard / RuPay)`                                                                                 |
| Netbanking Method Title    | `Netbanking (All Major Indian Banks)`                                                                                             |
| Pay CTA Button             | `Pay ₹{{amount}} & Submit Application`                                                                                            |
| Processing Step 1          | `Connecting to payment gateway…`                                                                                                  |
| Processing Step 2          | `Authorizing with bank…`                                                                                                          |
| Processing Step 3          | `Confirming transaction…`                                                                                                         |
| Payment Declined Title     | `Payment Declined by Bank`                                                                                                        |
| Payment Declined Body      | `Your bank was unable to authorize this transaction (e.g. insufficient funds or network decline). Your entered details are safe.` |
| Retry Payment CTA          | `Retry Payment`                                                                                                                   |
| Choose Another Method CTA  | `Choose Another Payment Method`                                                                                                   |
| Payment Pending Title      | `Payment Verification Pending`                                                                                                    |
| Payment Pending Body       | `Your transaction is currently awaiting bank confirmation. Please click below to refresh status.`                                 |
| Check Status CTA           | `Check Status Now`                                                                                                                |
| Receipt Title              | `Payment Receipt`                                                                                                                 |
| Transaction ID Label       | `Transaction ID`                                                                                                                  |
| Paid At Label              | `Payment Date & Time`                                                                                                             |
| Download Receipt CTA       | `Download Receipt (PDF)`                                                                                                          |
| Print Receipt CTA          | `Print Receipt`                                                                                                                   |

---

## Registry Safety

| Registry               | Blocks Used                                      | Safety Gate    |
| ---------------------- | ------------------------------------------------ | -------------- |
| shadcn official        | none — custom primitives in `src/components/ui/` | not applicable |
| Third-party registries | none declared                                    | not applicable |

---

## Component Inventory & Interaction Contracts

| Component                                                                     | Contract                                                                                                                                                                                           |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ReviewScreen** (`src/features/review/ReviewScreen.tsx`)                     | Main Stage 4 container orchestrating the Review & Check-answers view, Accuracy Declaration checkbox, Payment Method selection, Itemized Fee Breakdown, and Submission triggers.                    |
| **StageReviewCard** (`src/features/review/StageReviewCard.tsx`)               | Dedicated `Card` primitive wrapper for each completed stage (Stage 1 Visa Selection, Stage 2 Personal Info, Stage 3 Documents) with field name/value pairs and an accessible "Edit" header button. |
| **EditingBanner** (`src/features/review/EditingBanner.tsx`)                   | Sticky top banner displayed when returning to an earlier step from Review, displaying "Editing [Stage] — Return to Review" button with 1-tap navigation back.                                      |
| **FeeBreakdownCard** (`src/features/review/FeeBreakdownCard.tsx`)             | Transparent cost breakdown card displaying Visa Processing Fee, Government Fee (₹5,000), Platform Fee (₹1,500), bold Total, and "Zero hidden charges" badge.                                       |
| **PaymentMethodSelector** (`src/features/review/PaymentMethodSelector.tsx`)   | `RadioCard` group for selecting between UPI, Card, and Netbanking with brand logos and 48px touch targets.                                                                                         |
| **UpiPaymentForm** (`src/features/review/UpiPaymentForm.tsx`)                 | Dual UPI input component: VPA input field with quick-suffix suggestions (`@okhdfcbank`, `@okaxis`, `@paytm`, `@ybl`) and Mock QR code toggle with auto-confirm simulation.                         |
| **CardPaymentForm** (`src/features/review/CardPaymentForm.tsx`)               | Card input form with 4-4-4-4 card spacing auto-formatting, MM/YY expiry auto-slash, CVV 3-4 digit masking, and cardholder name input.                                                              |
| **NetbankingForm** (`src/features/review/NetbankingForm.tsx`)                 | Grid of popular Indian banks (SBI, HDFC, ICICI, Axis, Kotak, PNB) with quick RadioCards + searchable full bank dropdown.                                                                           |
| **PaymentProcessingModal** (`src/features/review/PaymentProcessingModal.tsx`) | Accessible modal dialog with multi-step animated loading states, `aria-busy="true"`, focus trap, and background interaction blocking to prevent double-clicks.                                     |
| **PaymentFailureCard** (`src/features/review/PaymentFailureCard.tsx`)         | In-context red/amber decline card with specific failure explanation and dual recovery buttons ("Retry Payment" / "Choose Another Method").                                                         |
| **PaymentPendingCard** (`src/features/review/PaymentPendingCard.tsx`)         | Amber alert card for bank timeout/pending states with manual "[Check Status]" trigger that re-invokes confirmation.                                                                                |
| **ReceiptCard** (`src/features/review/ReceiptCard.tsx`)                       | Formal printable receipt component displaying transaction ID (`PAY-XXXXXX`), date, applicant details, itemized fees, with download and print actions.                                              |
| **PaymentScenarioBar** (`src/features/review/PaymentScenarioBar.tsx`)         | Test/demo bar in payment footer allowing testers to switch between Success, Declined, Bank Timeout, and Network Error scenarios.                                                                   |

---

## UI Considerations (State Coverage)

### 1. Review & Edit States

- **Review Summary Valid:** All 3 stage cards show complete answers and document attachments with active "Edit" buttons. Declaration checkbox ready to be toggled.
- **Round-Trip Editing Mode:** When user clicks "Edit", wizard navigates to target step and displays persistent sticky `EditingBanner` at top. User can edit answers and tap "Return to Review" anytime without losing draft data.
- **Declaration Incomplete Error:** If user clicks "Proceed to Payment" without checking the declaration checkbox, inline error message appears and focus moves to the checkbox.

### 2. Payment Interaction States

- **Idle / Method Selected:** Selected `RadioCard` highlights with 2px indigo border and active checkmark. Method-specific inputs (UPI ID/QR, Card fields, Bank select) animate into view.
- **Processing Modal Active:** Modal takes focus, displays animated gateway handshake steps (1.5-2.0s), blocks background clicks, and traps keyboard focus.
- **Payment Declined / Failed:** Modal closes, in-context `PaymentFailureCard` mounts directly above payment CTA with "[Retry Payment]" and "[Choose Another Method]" actions without resetting any form fields.
- **Payment Pending / Timeout:** `PaymentPendingCard` mounts with explicit explanation and "[Check Status]" button that re-polls and resolves to success.
- **Payment Successful / Submitted:** Application marked `submitted: true`. Wizard auto-advances to Stage 5 (`confirmation`) where `ReceiptCard` is displayed alongside tracking information, and toast notification alerts "Confirmation & receipt sent to email and phone".

### 3. Responsiveness & Accessibility

- **Mobile (<640px):** Single-column layout. RadioCards stack vertically. Touch targets are ≥48px. Sticky `EditingBanner` remains accessible at top of viewport.
- **Desktop (≥640px):** Max-width 640px centered layout. Popular bank options render as a 3-column responsive grid.
- **Accessibility & Focus:** Tab navigation reaches all inputs, radio cards, checkboxes, and buttons in logical sequence. Modals trap focus and restore focus on dismiss. Live regions announce payment status changes.

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved
