# 01-04 Summary: XState Wizard Machine & Split Persistence Engine

## Outcome

Wave 3 (Plan 01-04) is complete. Implemented the pure XState wizard machine (`src/features/wizard/machine.ts`), derived step statuses and validation predicates (`src/features/wizard/selectors.ts`), split answers persistence engine (`src/persistence/answers.ts`), debounced autosave controller and Page Lifecycle flush installer (`src/persistence/autosave.ts`), truthful `SaveIndicator`, and the 3-step throwaway demo wizard (`src/features/wizard/demo/DemoWizard.tsx`). The kill-the-tab durability protocol and derived dynamic invalidation were verified end-to-end with Playwright.

## Delivered Artifacts

- **Wizard State Machine & Selectors (`src/features/wizard/`):**
  - `machine.ts`: XState v5 setup with immutable answer updates (`ANSWER_CHANGED`), step navigation (`GOTO`), reset action, and JSON-safe context.
  - `selectors.ts`: Pure derivation functions (`deriveStepStatuses`, `deriveStepStatus`, `deriveProgress`) and validation predicates (`isValidPassport`, `isValidEmail`, `isValidPhone`, `isExpiryValid`). Upstream edits immediately transition dependent steps to `needs-attention` without extra code.
  - `context.tsx`: `WizardContext`, `useWizardActor`, `useSaveState`, and `useWizardReset`.
- **Persistence Engine (`src/persistence/`):**
  - `answers.ts`: Versioned envelope persistence (`schemaVersion: 1`, `savedAt`, `snapshot`) in `localStorage` under `visarethink.draft.v1` with corrupt-storage defensive purging and QuotaExceeded error reporting.
  - `autosave.ts`: Autosave controller with 10s trailing debounce and synchronous lifecycle flushes (`visibilitychange` on `hidden` and `pagehide`), with zero usage of deprecated `unload` or `beforeunload` events.
- **UI Components & Demo Surface:**
  - `src/components/SaveIndicator.tsx`: Truthful indicator rendering exact copy (`Not saved`, `Unsaved changes`, `Saving…`, `Saved`, `Couldn't save — Retry`) based strictly on write outcomes.
  - `src/features/wizard/demo/DemoWizard.tsx`: 3-step demo surface proving trip selection, dependent passport validation, application summary, and accessible clear-draft sheet modal.
  - `src/main.tsx` & `src/App.tsx`: Bootstrapped actor restore and shell layout.
- **Tests:**
  - `src/features/wizard/machine.test.ts` (persisted snapshot roundtrip and immutability).
  - `src/features/wizard/selectors.test.ts` (predicate validation and needs-attention matrix).
  - `src/persistence/answers.test.ts` (envelope serialization, corrupt schema discard).
  - `src/persistence/autosave.test.ts` (debounce timer, state transitions, lifecycle hooks).
  - `src/components/SaveIndicator.test.tsx` (all 5 states with axe zero-violations).
  - `src/features/wizard/demo/DemoWizard.test.tsx` (full unmount/remount restore loop and clear draft).
  - `tests/e2e/save-restore.spec.ts` (Playwright kill-the-tab durability and live dynamic invalidation).

## Verification Results

- `pnpm typecheck`: 0 errors
- `pnpm lint`: 0 errors
- `pnpm test`: 19 test files, 47 unit/axe tests passed
- `pnpm e2e`: 3 Playwright tests passed (including tab murder survival)
