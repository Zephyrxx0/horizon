# Phase 6 Plan 03 Summary: Persistent Help & Support Escape Hatch, Searchable FAQ Sheet & Contextual Jargon Tooltips

**Execution Date:** 2026-08-26
**Requirements Delivered:** SUPRT-01, SUPRT-02
**Status:** Completed & Verified (100% Test Pass Rate)

---

## What Was Built

### 1. Support Data Model & Searchable FAQ Catalog (`src/features/support/`)

- **`types.ts`**: Types for `FaqCategory`, `FaqItem`, `SupportTicket`, `JargonKey`, `JargonDefinition`.
- **`faqCatalog.ts`**: 18 curated consular Q&A items categorized across `'passport' | 'documents' | 'payment' | 'tracking' | 'general'` with multi-token keyword search (`searchFaqs`), translation callback support, jargon definitions, and MEA helpline metadata (`1800-VISA-HELP`).
- **`faqCatalog.test.ts`**: Unit test suite verifying catalog counts, category filtering, keyword tag searches, and i18n support.

### 2. Slide-over FAQ Sheet & Support Ticket Modal

- **`FaqSheet.tsx`**:
  - Accessible slide-over sheet rendered with zero draft loss / background preservation (SUPRT-01).
  - Real-time search bar with clear button and live result counter.
  - Category pill filter chips (`All`, `Passport`, `Documents`, `Payment`, `Tracking`, `General`).
  - Expandable accordions with `aria-expanded` and tag badges.
  - Fallback MEA support card with toll-free helpline (`1800-VISA-HELP`, `8 AM - 8 PM IST`) and "Submit Support Query" action button (SUPRT-01).
- **`SupportTicketModal.tsx`**:
  - Accessible callback/query submission modal generating simulated ticket references (`TKT-1800-XXXXX`) with confirmation toasts.
- **`FaqSheet.test.tsx` & `SupportTicketModal.test.tsx`**: Comprehensive axe-core accessibility and interaction test suites.

### 3. Jargon Tooltips & Visual Passport Diagram

- **`PassportDiagram.tsx`**:
  - Accessible SVG illustration of the Indian passport bio-data page (`REPUBLIC OF INDIA / PASSPORT`) with highlighted specimen data zones:
    - Zone 1: Surname (`SHARMA`) & Given Names (`AARAV KUMAR`).
    - Zone 2: Passport Number (`AA1234567`) & Place of Issue (`MUMBAI`).
    - Zone 3: Date of Issue (`15/08/2020`) & Date of Expiry (`14/08/2030`).
    - Machine Readable Zone (MRZ).
- **`JargonTooltip.tsx`**:
  - 48px touch-target info trigger button with inline micro-popover card explaining complex consular terms (Given Name vs Surname, Date of Issue vs Expiry, Place of Issue, CVV, VPA ID) with plain-language definitions, realistic examples, and visual passport diagrams (SUPRT-02).
- **`Field.tsx`**:
  - Updated `FieldLabel` to cleanly accommodate `tooltip` nodes outside the `<label>` tag for valid HTML structure and screen-reader accessibility.
- **Form Field Integrations**:
  - `IdentityStep.tsx`: Jargon tooltips wired to First Name, Last Name, Passport Number, Date of Issue, Date of Expiry.
  - `ContactStep.tsx`: Tooltips wired to Mobile Phone (+91 format) and 6-Digit PIN Code.
  - `CardPaymentForm.tsx`: Tooltips wired to Expiry Date and CVV.
  - `UpiPaymentForm.tsx`: Tooltip wired to Virtual Payment Address (UPI ID).

### 4. Global AppShell Integration

- **`AppShell.tsx`**:
  - Header action `"Need Help?"` with help icon (`data-testid="header-help-btn"`).
  - Floating bottom helper button `(?)` with 48px touch target (`data-testid="floating-help-btn"`).
- **`App.tsx`**:
  - Global `isHelpOpen` state wired to `AppHeader`, `FloatingHelpButton`, and `FaqSheet`.

---

## Verification Results

- `pnpm vitest run src/features/support/ src/components/ui/Field.test.tsx`:
  - 6 test files passed, 24 tests passed (100%).
- Full codebase vitest suite (`pnpm vitest run`):
  - 88 test files passed, 307 tests passed (100%).
  - Zero axe accessibility violations.

---

## Artifacts Created / Modified

- `src/features/support/types.ts`
- `src/features/support/faqCatalog.ts`
- `src/features/support/faqCatalog.test.ts`
- `src/features/support/PassportDiagram.tsx`
- `src/features/support/PassportDiagram.test.tsx`
- `src/features/support/JargonTooltip.tsx`
- `src/features/support/JargonTooltip.test.tsx`
- `src/features/support/SupportTicketModal.tsx`
- `src/features/support/SupportTicketModal.test.tsx`
- `src/features/support/FaqSheet.tsx`
- `src/features/support/FaqSheet.test.tsx`
- `src/features/support/index.ts`
- `src/components/ui/Field.tsx`
- `src/components/ui/Field.test.tsx`
- `src/components/AppShell.tsx`
- `src/features/personal/IdentityStep.tsx`
- `src/features/personal/ContactStep.tsx`
- `src/features/review/CardPaymentForm.tsx`
- `src/features/review/UpiPaymentForm.tsx`
- `src/App.tsx`
