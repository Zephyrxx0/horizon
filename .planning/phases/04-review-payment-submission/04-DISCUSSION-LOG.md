# Phase 4: Review, Payment & Submission - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-26
**Phase:** 04-review-payment-submission
**Areas discussed:** Review & Edit Experience, Payment Methods & Checkout UI, Payment State Machine & Error Recovery, Submission Gate & In-App Receipt

---

## Review & Edit Experience

| Option                         | Description                                                                                                     | Selected |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- | -------- |
| Card sections per stage        | Each stage (Visa Selection, Personal Info, Documents) in a clean Card with an "Edit" button in the card header. | ✓        |
| Collapsible Accordion sections | Expand/collapse each stage, defaulting to all expanded on desktop and collapsed on small mobile screens.        |          |
| Flat continuous summary table  | One unified table with section dividers and row-level edit links.                                               |          |

**User's choice:** Card sections per stage
**Notes:** Reuses existing Card design system primitive for visual consistency.

| Option                               | Description                                                                                       | Selected |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- | -------- |
| Deep-link to step with sticky banner | Deep-link to the exact step with a sticky "Editing [Stage] — Return to Review" banner at the top. | ✓        |
| Slide-over / Bottom Sheet            | Open an editing Sheet in place so the user never leaves the Review screen.                        |          |
| Standard wizard navigation           | Navigate back to that step; user uses the regular "Next" buttons or stepper to return to Review.  |          |

**User's choice:** Deep-link to the exact step with a sticky "Editing [Stage] — Return to Review" banner
**Notes:** Provides effortless round-trip navigation without breaking the linear wizard flow.

| Option                | Description                                                                                                             | Selected |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------- |
| Rich visual chips     | Display thumbnail previews, filenames, sizes, and a click action opening DocumentPreviewSheet for instant verification. | ✓        |
| Text-based checklist  | Clean text summary with document name, file name, and green checkmark icon without full image preview.                  |          |
| Compact summary count | Show "3 mandatory documents uploaded" with an expandable drawer to inspect specifics.                                   |          |

**User's choice:** Rich visual chips
**Notes:** Reuses DocumentPreviewSheet from Phase 3 for full inspection before final payment.

| Option                               | Description                                                                                                                        | Selected |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Single explicit declaration checkbox | "I declare that all information provided is true and documents uploaded are authentic" with required validation before proceeding. | ✓        |
| Two distinct checkboxes              | One for accuracy of personal data, and one acknowledging non-refundable government and processing fees.                            |          |
| Implicit consent note                | Plain-language disclaimer text at the bottom without requiring a checkbox click.                                                   |          |

**User's choice:** Single explicit declaration checkbox
**Notes:** Standard legal compliance requirement prior to checkout.

---

## Payment Methods & Checkout UI

| Option                             | Description                                                                                                              | Selected |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| RadioCard options with logos/icons | Distinct selectable cards for UPI (GPay/PhonePe/Paytm), Debit/Credit Card, and Netbanking using the RadioCard primitive. | ✓        |
| Segmented Tabs                     | Horizontal tab bar switching between UPI, Card, and Netbanking tab panels.                                               |          |
| Dropdown select menu               | A standard dropdown select menu to choose the payment provider.                                                          |          |

**User's choice:** RadioCard options with logos/icons
**Notes:** Reuses 48px touch-target RadioCard primitive.

| Option             | Description                                                                                       | Selected |
| ------------------ | ------------------------------------------------------------------------------------------------- | -------- |
| Dual UPI options   | Allow entering a UPI ID (e.g., username@okaxis) OR generating a mock QR code for camera scanning. | ✓        |
| App intent buttons | Tap quick-launch buttons for GPay, PhonePe, and Paytm to simulate app-switch payment.             |          |
| UPI ID input only  | A single verified VPA input field (e.g., mobile@upi) with auto-suffix suggestions.                |          |

**User's choice:** Dual UPI options (UPI ID entry + Mock QR code)
**Notes:** Covers both mobile native VPA entry and desktop QR code scanning.

| Option                                | Description                                                                                       | Selected |
| ------------------------------------- | ------------------------------------------------------------------------------------------------- | -------- |
| Realistic inputs with auto-formatting | Card format (4-4-4-4), expiry (MM/YY), CVV masking, and top Indian bank selection for Netbanking. | ✓        |
| Minimal placeholder inputs            | Basic unformatted text fields for card and plain dropdown for banks.                              |          |
| Mock bypass                           | Clicking "Pay" simulates immediate authorization without requiring dummy card details.            |          |

**User's choice:** Realistic inputs with auto-formatting
**Notes:** Ensures genuine user testing experience with client-side formatting.

| Option                        | Description                                                                                                                           | Selected |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Itemized transparent fee card | Explicit line items for Processing Fee, Government Fee, and Platform Fee with clear rupee totals and "No hidden charges" trust badge. | ✓        |
| Sticky bottom action bar      | Persistent bottom bar showing total sum and "Pay Now" button, with expandable line items.                                             |          |
| Compact table layout          | Standard tabular summary directly above payment method selection.                                                                     |          |

**User's choice:** Itemized transparent fee card
**Notes:** Aligns with PRD §5 itemized cost breakdown (REVW-01, PAY-01).

---

## Payment State Machine & Error Recovery

| Option                                   | Description                                                                                              | Selected |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------- |
| Demo scenario selector in payment footer | A clean test bar allowing selection of Success (default), Card Declined, Bank Timeout, or Network Error. | ✓        |
| Preset test card numbers / UPI IDs       | Entering specific test numbers (e.g., 4000...0002 for decline) triggers specific failure scenarios.      |          |
| Interactive modal prompt                 | When clicking "Pay Now", a small simulation modal pops up asking what scenario to test.                  |          |

**User's choice:** Demo scenario selector in payment footer
**Notes:** Directly drives `setMockScenario('payment', ...)` from Phase 1.

| Option                    | Description                                                                                                                                        | Selected |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Multi-stage loading modal | A focused dialog with animated steps ("Contacting payment gateway...", "Authorizing with bank...", "Confirming...") that prevents double-clicking. | ✓        |
| Inline button spinner     | "Pay Now" button enters loading state with disabled inputs on the main form.                                                                       |          |
| Full-screen takeover      | Full-screen backdrop with animated payment shield and secure transaction notice.                                                                   |          |

**User's choice:** Multi-stage loading modal
**Notes:** Prevents double-submission while providing authentic banking handshake feedback.

| Option                                    | Description                                                                                                                            | Selected |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| In-context failure card with dual actions | Amber/Red alert card explaining exact failure cause with "[Retry Payment]" and "[Change Payment Method]" buttons, preserving all data. | ✓        |
| Top ErrorSummary banner                   | Standard top error banner with links back to the payment method field.                                                                 |          |
| Full-page payment error screen            | Dedicated failure view with reason code, customer support info, and "Try Again" CTA.                                                   |          |

**User's choice:** In-context failure card with dual actions
**Notes:** Fulfills PAY-03 requirement with zero data loss on retry.

| Option                                                  | Description                                                                                          | Selected |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------- |
| Pending status card with manual "[Check Status]" action | Clear explanation that the bank response is pending, with a one-click button to check and resolve.   | ✓        |
| Auto-polling countdown                                  | An automatic 5-second countdown timer that polls the payment status and transitions upon resolution. |          |
| Instant timeout fallback                                | Immediately treat timeout as a transient error and prompt for immediate retry.                       |          |

**User's choice:** Pending status card with manual "[Check Status]" action
**Notes:** Gives first-time applicants agency and calm guidance during slow mock network responses.

---

## Submission Gate & In-App Receipt

| Option                        | Description                                                                                                                                                        | Selected |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Formal printable receipt card | Display an official receipt card with transaction reference ID (e.g. PAY-893421), timestamp, itemized fees, applicant name, and a "Download/Print Receipt" button. | ✓        |
| Minimal success banner        | A concise green banner with reference ID and link to view receipt details.                                                                                         |          |
| Modal receipt popup           | A slide-over Sheet that opens immediately showing the receipt before proceeding.                                                                                   |          |

**User's choice:** Formal printable receipt card
**Notes:** Fulfills PAY-04 with in-app printable receipt record.

| Option                                       | Description                                                                                                                                                                    | Selected |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Auto-advance to Stage 5                      | Instantly transition wizard machine to Stage 5 (Confirmation & Tracking) where the receipt card is featured prominently alongside application reference and tracking timeline. | ✓        |
| Stay on Stage 4 with "View Confirmation" CTA | Display success checkmark and receipt on Stage 4 with a prominent primary button to advance to Stage 5.                                                                        |          |
| Modal receipt gate                           | Show the receipt in an overlay modal with a "Continue to Confirmation" dismiss button.                                                                                         |          |

**User's choice:** Auto-advance to Stage 5
**Notes:** Seamless progression in guided wizard machine.

| Option                                | Description                                                                                                                 | Selected |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| Read-only lock                        | Once paid and submitted, mark application as submitted; earlier steps can be viewed in read-only mode but cannot be edited. | ✓        |
| Editable with warning                 | Allow editing with a confirmation alert noting that changes will update the submitted record.                               |          |
| Full lock with new application option | Lock previous steps completely and provide a "Start New Application" reset action.                                          |          |

**User's choice:** Read-only lock
**Notes:** Prevents corrupting paid application records while allowing users to inspect what they submitted.

| Option                               | Description                                                                                                                     | Selected |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Service dispatch with Toast feedback | Trigger INotificationService (email & SMS) and display a success toast ("Confirmation & receipt sent to your email and phone"). | ✓        |
| Silent service dispatch              | Call mock notification service silently in the background (console logged per PRD §4).                                          |          |
| Mock Notification Preview Sheet      | Provide a button on confirmation to "Preview Sent Email/SMS" for demonstration purposes.                                        |          |

**User's choice:** Service dispatch with Toast feedback
**Notes:** Pairs console logging with visual toast confirmation.

---

## Agent's Discretion

- Exact SVG icon paths for payment brand badges, spinner animations, print stylesheet rules, and 320px viewport responsive stacking.

## Deferred Ideas

None — discussion stayed within Phase 4 boundaries.
