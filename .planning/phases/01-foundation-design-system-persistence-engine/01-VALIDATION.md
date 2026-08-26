---
phase: 1
slug: foundation-design-system-persistence-engine
status: validated
nyquist_compliant: true
wave_0_complete: true
created: '2026-08-26'
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Framework**          | Vitest 4.x (`@testing-library/react`, `vitest-axe`), Playwright 1.62.x                            |
| **Config files**       | `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`                                     |
| **Quick run command**  | `pnpm test`                                                                                       |
| **Full suite command** | `pnpm typecheck && pnpm lint && pnpm test && pnpm e2e && pnpm check:contrast && pnpm check:fonts` |
| **Estimated runtime**  | ~15-20 seconds                                                                                    |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm typecheck && pnpm lint && pnpm test && pnpm e2e`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Threat Ref | Secure Behavior                                                           | Test Type   | Automated Command                                                | File Exists | Status   |
| -------- | ---- | ---- | ----------- | ---------- | ------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------- | ----------- | -------- |
| 01-01-01 | 01   | 1    | FOUND-01    | T-1-01     | Mobile-first shell, skip link targeting `#main-content`, banned innerHTML | unit + a11y | `pnpm vitest run src/App.test.tsx`                               | ✅          | ✅ green |
| 01-01-02 | 01   | 1    | FOUND-02    | T-1-02     | WCAG AA contrast ratio compliance (≥4.5:1 / 7:1) across palette           | static      | `pnpm check:contrast`                                            | ✅          | ✅ green |
| 01-01-03 | 01   | 1    | FOUND-01    | T-1-03     | Clean browser boot with 0 console errors on Chromium                      | e2e         | `pnpm playwright test tests/e2e/smoke.spec.ts`                   | ✅          | ✅ green |
| 01-02-01 | 02   | 2    | FOUND-03    | T-1-04..11 | 10 custom UI primitives with 48px hit areas and zero axe violations       | unit + a11y | `pnpm vitest run src/components/ui/`                             | ✅          | ✅ green |
| 01-03-01 | 03   | 2    | FOUND-05    | T-1-D      | 5 typed service ports with scenario engine behind single swap point       | unit        | `pnpm vitest run src/services/`                                  | ✅          | ✅ green |
| 01-04-01 | 04   | 3    | STATE-01    | T-1-12     | Pure machine with JSON-safe context and deep-equal snapshot roundtrip     | unit        | `pnpm vitest run src/features/wizard/machine.test.ts`            | ✅          | ✅ green |
| 01-04-02 | 04   | 3    | STATE-01    | T-1-13     | Pure derived selectors with automatic downstream invalidation             | unit        | `pnpm vitest run src/features/wizard/selectors.test.ts`          | ✅          | ✅ green |
| 01-04-03 | 04   | 3    | STATE-02    | T-1-14     | localStorage envelope persistence with corrupt schema defense             | unit        | `pnpm vitest run src/persistence/answers.test.ts`                | ✅          | ✅ green |
| 01-04-04 | 04   | 3    | STATE-02    | T-1-15     | Debounced autosave + synchronous pagehide/visibilitychange flush          | unit        | `pnpm vitest run src/persistence/autosave.test.ts`               | ✅          | ✅ green |
| 01-04-05 | 04   | 3    | STATE-02    | T-1-16     | Truthful indicator rendering 'Saved' strictly after sync write            | unit + a11y | `pnpm vitest run src/components/SaveIndicator.test.tsx`          | ✅          | ✅ green |
| 01-04-06 | 04   | 3    | STATE-02    | T-1-15     | Keystrokes survive tab murder mid-session without waiting                 | e2e         | `pnpm playwright test tests/e2e/save-restore.spec.ts`            | ✅          | ✅ green |
| 01-05-01 | 05   | 4    | STATE-03    | T-1-18     | Canvas client-side downscaling to ≤2MB budget                             | unit        | `pnpm vitest run src/persistence/compress.test.ts`               | ✅          | ✅ green |
| 01-05-02 | 05   | 4    | STATE-03    | T-1-19     | IndexedDB blob CRUD and storage quota estimation                          | unit        | `pnpm vitest run src/persistence/documents.test.ts`              | ✅          | ✅ green |
| 01-05-03 | 05   | 4    | STATE-03    | T-1-17     | Upload surface with text-node filenames and verified Ready badge          | unit + a11y | `pnpm vitest run src/features/wizard/demo/DocumentStep.test.tsx` | ✅          | ✅ green |
| 01-05-04 | 05   | 4    | STATE-03    | T-1-E      | Document attachment in IndexedDB survives full page reload                | e2e         | `pnpm playwright test tests/e2e/save-documents.spec.ts`          | ✅          | ✅ green |
| 01-06-01 | 06   | 5    | FOUND-04    | T-1-21     | 6-language switcher with lang attribute sync and honest notice            | unit + a11y | `pnpm vitest run src/components/LanguageSwitcher.test.tsx`       | ✅          | ✅ green |
| 01-06-02 | 06   | 5    | FOUND-04    | T-1-23     | Zero Indic fonts in initial HTML; woff2 subsets ≤80KB budget              | static      | `pnpm check:fonts`                                               | ✅          | ✅ green |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [x] `src/App.test.tsx` — scaffold & axe baseline
- [x] `tests/e2e/smoke.spec.ts` — Playwright smoke test baseline
- [x] `scripts/check-contrast.mjs` — WCAG AA color pair checker
- [x] `scripts/check-font-budget.mjs` — Font bundle budget checker

_Existing infrastructure covers all phase requirements._

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual                                    | Test Instructions |
| -------- | ----------- | --------------------------------------------- | ----------------- |
| _None_   | N/A         | All Phase 1 behaviors have automated coverage | N/A               |

_All phase behaviors have automated verification._

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 20s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-08-26
