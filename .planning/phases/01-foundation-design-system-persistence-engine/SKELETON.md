# Walking Skeleton — VisaReThink

**Phase:** 1
**Generated:** 2026-08-25

## Capability Proven End-to-End

> An applicant can type an answer into the demo wizard on a phone-width screen, see the honest "Saved" indicator flip after the debounced write completes, force-close the browser tab mid-session, reopen, and find every answer restored — with an attached photo compressed to ≤2MB persisting across a full reload.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Vite 8 + React 19 + TypeScript ~6.0.2 SPA (create-vite 9.2.0 react-ts template) | Ratified FOUND-01; least baseline JS for client-only app; TS pin satisfies typescript-eslint peer `<6.1.0` — do NOT bump to TS 7 |
| Styling | Tailwind v4 CSS-first `@theme` tokens in `src/styles/theme.css`; custom component library in `src/components/ui/` (NO shadcn/Radix per D-06) | Tokens are CSS variables compiled at build; a11y primitives (labels, aria-live, focus management, 48px targets) implemented directly in ~10 primitives |
| State | XState v5 (`setup().createMachine`) — single top-level machine, no invocations/nested actors; step statuses derived by pure selectors over `context.answers`, never persisted (D-01, STATE-01) | Immutable transitions; JSON-serializable `getPersistedSnapshot()` makes resume trivially correct |
| Data layer | Split storage per D-02: answers/metadata → localStorage (sync writes survive kill-the-tab flush window); document blobs → IndexedDB via idb-keyval 6.3.0 dedicated store `visarethink/documents`, written at selection time only | Page Lifecycle API: `visibilitychange`(hidden)/`pagehide` are the last reliable save moments; async IDB writes can be cancelled during unload — never used as save points |
| Autosave | 10s trailing debounce + mandatory sync flush on hide/pagehide (D-03); `SaveState = idle\|dirty\|saving\|saved\|error` drives the indicator truthfully | "Saved" renders ONLY after completed `setItem`; quota errors surface honestly (SC #2/#3) |
| Auth | None — anonymous drafts; no registration wall (explicit anti-feature) | Prototype posture; backup codes arrive Phase 5 |
| Deployment target | Local full-stack run: `pnpm dev` (documented command exercising everything); GitHub Actions workflow authored but dormant until repo gets a remote | No remote configured today; D-14 wants CI from day one |
| i18n | react-i18next + i18next, lazy namespaces, EN complete, five Indic locales selectable with visible "translation coming" state (D-09/D-11); Noto Sans via Fontsource per-script subsets, dynamic import per locale (D-10) | Machinery now, content Phase 6; unicode-range keeps 3G payload bounded |
| Directory layout | Feature-folders: `src/components/ui/`, `src/features/wizard/` (+throwaway `demo/`), `src/persistence/`, `src/services/`, `src/i18n/` | Each later stage composes these seams; mock swap point is `src/services/index.ts#getService()` |

## Stack Touched in Phase 1

- [x] Project scaffold (Vite, TS ~6.0.2, ESLint flat + Prettier + husky/lint-staged, Vitest + jsdom + vitest-axe, Playwright chromium, GH Actions ci.yml)
- [x] Routing — single-page demo stepper (router deliberately deferred; research assumption A6)
- [x] Database — real localStorage envelope read/write AND real IndexedDB blob read/write (idb-keyval)
- [x] UI — interactive demo wizard (RadioCard trip question, dependent Input step, clear-draft sheet) wired to the machine + autosave; language switcher live
- [x] Deployment — documented `pnpm dev` full-stack run + kill-the-tab Playwright proof

## Out of Scope (Deferred to Later Slices)

- Journey stages: visa selection, personal-details flow, document-guidance screens, payment, tracking (Phases 2–5)
- Error-summary page component (Phase 2, ERR-01); help/FAQ surfaces + privacy/trust copy (Phase 6)
- Five Indic translation CONTENTS (machinery ships Phase 1, copy Phase 6 per D-09)
- PWA/service worker, offline queueing, stale-shell handling (Phase 6, PWA-01/02)
- Dark mode, fault-injection dev panel (excluded by UI-SPEC / D-04), client-side router
- Journey-wide WCAG/perf verification gates (Phase 6, A11Y-01/PERF-01 — per-component vitest-axe starts now)

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: Guided journey — visa selection + personal-details stages composed from these primitives, resuming on first incomplete step (STATE-04)
- Phase 3: Document upload pipeline replacing the demo upload step with guided per-document requirements
- Phase 4: Review/check-answers + mocked payment through `IPaymentService`
- Phase 5: Confirmation, tracking timeline via `ITrackingService`, backup-code restore (STATE-05), duplicate detection (STATE-06)
- Phase 6: Localization content, PWA/offline, journey-wide a11y/perf gates
