# Phase 2: Guided Journey — Visa Selection & Personal Details - Context

**Gathered:** 2026-08-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 delivers the first two citizen-facing journey stages:

1. **Stage 1: Visa Selection** — Destination country & travel purpose selection (SELCT-01), matching visa cards with upfront typical processing time and itemized fee breakdown (SELCT-02), required document checklist displayed before committing (SELCT-03), and purpose-based visa recommendation badges (SELCT-04).
2. **Stage 2: Personal Details** — Question-group wizard sub-steps with progressive disclosure tailored to the chosen visa type (PERS-01), passport number auto-formatting `AA1234567` (PERS-02), phone auto-prefix `+91` and formatting (PERS-03), smart defaults such as India nationality (PERS-04), passport expiry <6 month warning and confirmation (PERS-05), on-blur field validation with green checkmarks (PERS-06), accessible top-of-page error summary linking to invalid fields (ERR-01), constructive error messaging (ERR-02), and resume on first incomplete step (STATE-04).

Document uploading (Phase 3), check-answers & mock payment (Phase 4), confirmation & tracking (Phase 5), and full 6-language translation content / offline PWA (Phase 6) are out of scope for this phase.
</domain>

<decisions>
## Implementation Decisions

### Step Topology & Sub-Step Partitioning

- **D-01:** Personal Details (Stage 2) is partitioned into dedicated sub-steps in the wizard (e.g., **2a: Identity & Passport**, **2b: Contact & Address**, **2c: Visa-Specific Details**) with individual Continue/Back controls, sub-step progress indication, and independent step validation slices. — **Reversibility:** costly — touches wizard machine step topology, sub-stepper state/reducer, routing/view rendering, and validation slice mapping.

### Visa Selection & Recommendation Experience

- **D-02:** Stage 1 uses a combined interactive selector: Destination dropdown + Purpose radio pills at the top that reactively filter and rank visa cards below. The top match displays a "Recommended" badge, clear processing timeframe, itemized cost breakdown (visa fee + ₹5,000 govt fee + ₹1,500 platform fee), and an upfront required-document checklist before the user commits. — **Reversibility:** costly — defines visa configuration catalog structure, pricing calculation rules, and document requirement mappings for subsequent upload phase.

### Passport Expiry (<6 Months) Warning UX

- **D-03:** When passport expiry is within 6 months of travel/today, render an inline contextual amber warning card directly beneath the expiry field with plain-language guidance ("Most countries require at least 6 months validity from travel date") and an explicit required "Continue anyway with current expiry" confirmation toggle/checkbox before allowing advancement past sub-step 2a. — **Reversibility:** reversible — localized to Identity & Passport step validation and component rendering.

### Validation & Accessible Error Summary Architecture

- **D-04:** Implement a hybrid validation pattern: on field blur, evaluate field validity and render inline constructive error messages or green checkmarks (`PERS-06`); when the user clicks "Continue" with unresolved errors, scroll to and set keyboard focus to an accessible top-of-page error summary card (`role="alert"`, `aria-live="polite"`, `ERR-01`) containing direct anchor links (`#field-id`) focusing the respective invalid fields. All error messages must be constructive and instructional (`ERR-02`). — **Reversibility:** costly — establishes the form validation architecture, error state management, and accessibility focus contracts across all form steps.

### Formatting & Smart Defaults

- **D-05:** Auto-formatting applies during input: passport numbers auto-uppercase and format to standard `AA1234567` (2 uppercase letters + 7 digits, `PERS-02`); phone numbers auto-prefix `+91` with spaced digit formatting (`PERS-03`); nationality pre-fills with smart default "India" (`PERS-04`). — **Reversibility:** reversible — helper formatting utilities and default value initializers.

### State Resumption & Validator Replay

- **D-06:** On loading saved application draft, re-evaluate validation against stored answers across all steps to identify the first genuinely incomplete step/sub-step and navigate the applicant directly to it with a "Continue Application" banner (`STATE-04`). — **Reversibility:** costly — affects wizard initialization, resumption selector, and lifecycle guards.

### Agent's Discretion

- Exact layout spacing, sub-step visual transition animations, field order within sub-steps, country-specific purpose options (USA, UK, Canada, Australia, Schengen), and helper tooltip text styling within WCAG AA tokens.
</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product & Journey References

- `visarethink/indian_visa_prd.md` §2, §5 (Stage 1 & Stage 2 details) — guided journey philosophy, step specifications, example error/warning copy, and field auto-format requirements.
- `visarethink/visa_prototype.jsx` (lines 31–118) — reference visa options by country (`visaOptions`), pricing table (`visaPricing`), base fee constants (`governmentFee = 5000`, `platformFee = 1500`), and passport regex `^[A-Z]{2}\\d{7}$`.

### Architecture & Foundation References

- `.planning/phases/01-foundation-design-system-persistence-engine/01-CONTEXT.md` — Phase 1 established decisions (XState wizard machine, 10-primitive custom design system, autosave debouncing + pagehide flush, i18n scaffolding).
- `src/features/wizard/machine.ts` — XState wizard machine topology and state definition to extend with real journey stages.
- `src/components/ui/` — Design system primitives (`Button`, `Input`, `Select`, `RadioCard`, `Checkbox`, `ProgressStepper`, `Field`, `Card`, `Sheet`, `Toast`).
- `.planning/REQUIREMENTS.md` — SELCT-01..04, PERS-01..06, STATE-04, ERR-01..02 definitions.
- `.planning/ROADMAP.md` — Phase 2 goals and success criteria.
  </canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/components/ui/`: `Button`, `Input`, `Select`, `RadioCard`, `Checkbox`, `Field` (with Label, Hint, Error), `Card`, `ProgressStepper`, `focus.ts` helper for accessible focus rings.
- `src/features/wizard/context.tsx`: Wizard React context providing access to XState actor and autosave states.
- `src/features/wizard/selectors.ts`: Reducer/selectors over answers that compute step availability and progress.
- `src/services/mock/passport.ts`: Mock passport verification service.
- `src/i18n/`: `react-i18next` setup with English keys in `src/i18n/locales/en/common.json`.

### Established Patterns

- Pure state machine over answers: step status and progress derived from answers in `selectors.ts`.
- Autosave to `localStorage` debounced ~10s with flush on `pagehide`/`visibilitychange`.
- Accessible primitives with `aria-describedby` wiring and 48px minimum touch targets.
- Vitest + `vitest-axe` component accessibility unit testing.

### Integration Points

- `src/features/wizard/machine.ts`: Expand `StepId` from demo steps (`trip`, `dependent`, `review`) to real guided stages (`visa-selection`, `personal-identity`, `personal-contact`, `personal-details`, etc.).
- `src/features/wizard/selectors.ts`: Implement real step validators for Stage 1 and Stage 2 sub-steps to derive progress, completion, and resume target.
- `src/components/AppShell.tsx`: Display wizard header, progress stepper, save indicator, and active stage content.
  </code_context>

<specifics>
## Specific Ideas
- Stage 1 Visa cards: Display badge "Recommended" on the best matching visa type, accompanied by fee breakdown and required document checklist so users don't face surprises later.
- Expiry warning: Plain language "Your passport expires on [Date]. Most countries need at least 6 months validity. You may want to renew first. Continue anyway? [Checkbox]".
- Green checkmarks: Appear on blur when a field passes validation, reinforcing progress without noisy typing interruptions.
</specifics>

<deferred>
## Deferred Ideas
None — discussion remained strictly focused on Stage 1 (Visa Selection) and Stage 2 (Personal Details).
</deferred>

---

_Phase: 02-Guided Journey — Visa Selection & Personal Details_
_Context gathered: 2026-08-26_
