---
phase: 2
slug: guided-journey-visa-selection-personal-details
status: validated
nyquist_compliant: true
wave_0_complete: true
created: '2026-08-26'
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Framework**          | Vitest 4.x (`@testing-library/react`, `vitest-axe`), Playwright 1.62.x                            |
| **Config files**       | `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`                                     |
| **Quick run command**  | `pnpm test`                                                                                       |
| **Full suite command** | `pnpm typecheck && pnpm lint && pnpm test && pnpm e2e && pnpm check:contrast && pnpm check:fonts` |
| **Estimated runtime**  | ~18-22 seconds                                                                                    |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm typecheck && pnpm lint && pnpm test && pnpm e2e`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 22 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement          | Secure / Functional Behavior                                             | Test Type   | Automated Command                                                                           | File Exists | Status   |
| -------- | ---- | ---- | -------------------- | ------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------- | ----------- | -------- |
| 02-01-01 | 01   | 1    | SELCT-01..4          | Catalog fee breakdown arithmetic + recommendation ranker + doc checklist | unit        | `pnpm vitest run src/features/visa/catalog.test.ts`                                         | ✅          | ✅ green |
| 02-01-02 | 01   | 1    | PERS-02..03          | Passport uppercase auto-format (`AA1234567`) and phone formatting        | unit        | `pnpm vitest run src/features/wizard/formatters.test.ts`                                    | ✅          | ✅ green |
| 02-01-03 | 01   | 1    | PERS-05,ERR          | Pure validators, passport date math (<6mo validity), constructive errors | unit        | `pnpm vitest run src/features/wizard/validators.test.ts`                                    | ✅          | ✅ green |
| 02-01-04 | 01   | 1    | STATE-04             | 5-stage XState machine & selectors (`getFirstIncompleteStep`, progress)  | unit        | `pnpm vitest run src/features/wizard/machine.test.ts src/features/wizard/selectors.test.ts` | ✅          | ✅ green |
| 02-02-01 | 02   | 2    | ERR-01               | Accessible `ErrorSummary` alert with smooth scroll and focus shifting    | unit + a11y | `pnpm vitest run src/components/ui/ErrorSummary.test.tsx`                                   | ✅          | ✅ green |
| 02-02-02 | 02   | 2    | PERS-05              | Inline amber `ExpiryWarning` card with explicit confirmation checkbox    | unit + a11y | `pnpm vitest run src/components/ui/ExpiryWarning.test.tsx`                                  | ✅          | ✅ green |
| 02-02-03 | 02   | 2    | PERS-06              | `Field` component with `isValid` prop rendering green checkmarks         | unit + a11y | `pnpm vitest run src/components/ui/Field.test.tsx`                                          | ✅          | ✅ green |
| 02-03-01 | 03   | 2    | SELCT-02..4          | `VisaCard` recommended badge, fee breakdown table, document checklist    | unit + a11y | `pnpm vitest run src/features/visa/VisaCard.test.tsx`                                       | ✅          | ✅ green |
| 02-03-02 | 03   | 2    | SELCT-01..4          | `VisaSelectionScreen` reactive destination & trip purpose selection      | unit + a11y | `pnpm vitest run src/features/visa/VisaSelectionScreen.test.tsx`                            | ✅          | ✅ green |
| 02-04-01 | 04   | 3    | PERS-01,02,4,5,6     | `IdentityStep` (2a) auto-formatting, smart default, expiry gate          | unit + a11y | `pnpm vitest run src/features/personal/IdentityStep.test.tsx`                               | ✅          | ✅ green |
| 02-04-02 | 04   | 3    | PERS-01,03,06        | `ContactStep` (2b) auto +91 prefix, email, address, 6-digit PIN          | unit + a11y | `pnpm vitest run src/features/personal/ContactStep.test.tsx`                                | ✅          | ✅ green |
| 02-04-03 | 04   | 3    | PERS-01,06           | `VisaSpecificStep` (2c) progressive disclosure per category              | unit + a11y | `pnpm vitest run src/features/personal/VisaSpecificStep.test.tsx`                           | ✅          | ✅ green |
| 02-04-04 | 04   | 3    | PERS-01              | `PersonalDetailsScreen` 2a/2b/2c sub-step progress breadcrumb & routing  | unit + a11y | `pnpm vitest run src/features/personal/PersonalDetailsScreen.test.tsx`                      | ✅          | ✅ green |
| 02-05-01 | 05   | 4    | STATE-04             | `ResumeBanner` draft detection & direct jump to first incomplete step    | unit + a11y | `pnpm vitest run src/components/ResumeBanner.test.tsx`                                      | ✅          | ✅ green |
| 02-05-02 | 05   | 4    | STATE-04             | `App.tsx` 5-stage progress indicator, remaining minutes, autosave state  | unit + a11y | `pnpm vitest run src/App.test.tsx`                                                          | ✅          | ✅ green |
| 02-05-03 | 05   | 4    | SELCT/PERS/STATE/ERR | Full Playwright E2E guided journey, error links, persistence             | e2e         | `pnpm playwright test tests/e2e/phase2-guided-journey.spec.ts`                              | ✅          | ✅ green |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [x] `src/App.test.tsx` — scaffold & axe baseline
- [x] `tests/e2e/smoke.spec.ts` — Playwright smoke test baseline
- [x] `tests/e2e/save-restore.spec.ts` — Tab kill durability and derived persistence
- [x] `scripts/check-contrast.mjs` — WCAG AA color pair checker
- [x] `scripts/check-font-budget.mjs` — Font bundle budget checker

_Existing infrastructure covers all phase requirements._

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual                                    | Test Instructions |
| -------- | ----------- | --------------------------------------------- | ----------------- |
| _None_   | N/A         | All Phase 2 behaviors have automated coverage | N/A               |

_All phase behaviors have automated verification._

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 22s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-08-26
