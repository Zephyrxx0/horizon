# Phase 6 Plan 05 Summary: Assistive Technology Focus Management, A11yAnnouncer Live Regions, Whole-Journey axe-core & 3G CWV Hardening Gates

## Overview

Plan 06-05 established the final quality, performance, and accessibility hardening gates for VisaReThink:

- Dynamic screen reader announcements via a dedicated `A11yAnnouncer` live region component.
- Smooth programmatic focus management across stage transitions targeting stage headings and error summaries.
- Comprehensive whole-journey automated WCAG 2.1 AA accessibility verification with axe-core across all 5 stages, modals, and sheets in both Vitest and Playwright E2E suites.
- Throttled 3G performance and Core Web Vitals gate asserting clean font budgets (0 eager Indic font subsets downloaded on initial load), LCP < 2.5s, and CLS < 0.1.

---

## Changes Made

### 1. Assistive Tech Live Announcer & Focus Engine (`A11yAnnouncer.tsx`, `focus.ts`, `App.tsx`)

- **`src/components/A11yAnnouncer.tsx`**:
  - Implemented visually hidden polite (`aria-live="polite"`, `role="status"`, `aria-atomic="true"`) and assertive (`aria-live="assertive"`, `aria-atomic="true"`) live regions.
  - Exported decoupled announcement helpers (`announce`, `announcePolite`, `announceAssertive`) using custom DOM events (`a11y-announce`).
  - Added automatic subscription to `i18n.on('languageChanged')` to announce locale switches to assistive technologies.
  - Written and verified unit tests in `src/components/A11yAnnouncer.test.tsx` (5 tests passing).
- **`src/components/ui/focus.ts`**:
  - Added `focusHeadingOrFirstElement(container)` and `focusStepHeading(stepId)` to shift keyboard and screen reader focus smoothly to top step headings (`h1:not(.sr-only)`, `h2`) or `[data-testid="error-summary"]` on stage transitions.
- **`src/App.tsx`**:
  - Rendered `<A11yAnnouncer />` at root of the shell.
  - Added stage transition effect to dispatch polite step announcements and shift focus automatically to the new stage's heading.

### 2. WCAG 2.1 AA Semantic Fixes & Contrast Hardening

- **`src/features/trust/PrivacyTrustCard.tsx`**:
  - Corrected nested heading levels (`h3` -> `h2`, `h4` -> `h3`) to maintain semantic hierarchy from `App.tsx`'s top `h1`.
- **`src/features/confirmation/ConfirmationScreen.tsx`**:
  - Replaced duplicate nested `role="main"` landmark with `<section aria-label="Application Confirmation Stage">`.
- **`src/features/review/PaymentScenarioBar.tsx`**:
  - Updated scenario button active styles (`bg-emerald-700`, `bg-rose-700`, `bg-amber-800`, `bg-red-800`) to guarantee WCAG 2.1 AA 4.5:1 text-to-background contrast ratio for 12px text.
- **`src/features/review/ReceiptCard.tsx`**:
  - Updated status pill text from `text-emerald-600` to `text-emerald-700` for 4.5:1 contrast against surface background `#f7f7fa`.
- **`src/features/confirmation/StatusTimelineCard.tsx`**:
  - Updated upcoming status badge text from `text-slate-500` to `text-slate-700` on `bg-slate-100`.

### 3. Whole-Journey Automated Accessibility Suite (`tests/a11y/`, `tests/e2e/journey-axe.spec.ts`)

- **`tests/a11y/journey-a11y.test.tsx`**:
  - Created 14 Vitest axe-core tests testing every individual stage (Stage 1, 2a, 2b, 2c, 3, 4, 5) and the full App shell across all 7 steps with `axe(container)` using WCAG 2.1 AA tags (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`).
  - All 14 tests pass with 0 violations.
- **`tests/e2e/journey-axe.spec.ts`**:
  - Integrated `@axe-core/playwright`.
  - Added full live browser journey scan across all 5 stages and global modals (`FaqSheet`, `TrackingModal`, `DraftBackupModal`, `ClearDataModal`) with 0 violations.

### 4. Throttled 3G Performance & Font Budget Gates (`tests/e2e/perf-3g.spec.ts`)

- **`tests/e2e/perf-3g.spec.ts`**:
  - Verified 0 eager Indic font subsets are fetched on initial English page load (PERF-01 / FONT-01).
  - Verified Core Web Vitals (LCP < 2.5s, CLS < 0.1) under mobile viewport (390x844) and 4x CPU slowdown.

---

## Verification Results

| Check / Suite                     | Result     | Details                                                  |
| --------------------------------- | ---------- | -------------------------------------------------------- |
| `pnpm vitest run tests/a11y/`     | **PASSED** | 1 test file, 14 tests passing, 0 axe violations          |
| `pnpm test` (full Vitest suite)   | **PASSED** | 96 test files, 342 tests passing                         |
| `pnpm e2e` (all Playwright tests) | **PASSED** | 15 test cases passing across all 5 phases & E2E flows    |
| `pnpm typecheck`                  | **PASSED** | TypeScript 0 errors                                      |
| `pnpm lint`                       | **PASSED** | ESLint 0 errors / 0 warnings                             |
| `pnpm check:fonts`                | **PASSED** | Initial index.html clean, all Indic fonts lazy           |
| `pnpm check:contrast`             | **PASSED** | All color pairs pass WCAG AA contrast ratio requirements |

---

## Must-Haves Satisfied

- **D-15**: `A11yAnnouncer` live region announces wizard stage transitions, error counts, and language switches (A11Y-02).
- **D-15**: Programmatic focus management shifts focus to the top heading or `ErrorSummary` on step transitions without losing screen reader context (A11Y-02).
- **D-16**: Complete end-to-end journey across all 5 stages passes WCAG 2.1 AA with zero axe violations in automated Vitest and Playwright suites (A11Y-01).
- **D-16**: Core Web Vitals measure Good under mobile viewport and 4x CPU slowdown profiles with zero eager Indic font downloads on initial load (PERF-01).
- Full test suite (unit + a11y + e2e) executes cleanly with zero failures.
