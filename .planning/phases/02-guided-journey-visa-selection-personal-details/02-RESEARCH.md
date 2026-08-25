# Phase 2: Guided Journey — Visa Selection & Personal Details - Research

**Researched:** 2026-08-26
**Domain:** Guided multi-step visa application flow — Visa recommendation engine, question-group sub-steps, progressive disclosure, on-blur validation, accessible error summary, formatters, state resumption
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Step Topology & Sub-Step Partitioning**

- **D-01:** Personal Details (Stage 2) is partitioned into dedicated sub-steps in the wizard (**2a: Identity & Passport**, **2b: Contact & Address**, **2c: Visa-Specific Details**) with individual Continue/Back controls, sub-step progress indication, and independent step validation slices.

**Visa Selection & Recommendation Experience**

- **D-02:** Stage 1 uses a combined interactive selector: Destination dropdown + Purpose radio pills at the top that reactively filter and rank visa cards below. The top match displays a "Recommended" badge, clear processing timeframe, itemized cost breakdown (visa fee + ₹5,000 govt fee + ₹1,500 platform fee), and an upfront required-document checklist before the user commits.

**Passport Expiry (<6 Months) Warning UX**

- **D-03:** When passport expiry is within 6 months of travel/today, render an inline contextual amber warning card directly beneath the expiry field with plain-language guidance ("Most countries require at least 6 months validity from travel date") and an explicit required "Continue anyway with current expiry" confirmation toggle/checkbox before allowing advancement past sub-step 2a.

**Validation & Accessible Error Summary Architecture**

- **D-04:** Implement a hybrid validation pattern: on field blur, evaluate field validity and render inline constructive error messages or green checkmarks (`PERS-06`); when the user clicks "Continue" with unresolved errors, scroll to and set keyboard focus to an accessible top-of-page error summary card (`role="alert"`, `aria-live="polite"`, `ERR-01`) containing direct anchor links (`#field-id`) focusing the respective invalid fields. All error messages must be constructive and instructional (`ERR-02`).

**Formatting & Smart Defaults**

- **D-05:** Auto-formatting applies during input: passport numbers auto-uppercase and format to standard `AA1234567` (2 uppercase letters + 7 digits, `PERS-02`); phone numbers auto-prefix `+91` with spaced digit formatting (`PERS-03`); nationality pre-fills with smart default "India" (`PERS-04`).

**State Resumption & Validator Replay**

- **D-06:** On loading saved application draft, re-evaluate validation against stored answers across all steps to identify the first genuinely incomplete step/sub-step and navigate the applicant directly to it with a "Continue Application" banner (`STATE-04`).

### Agent's Discretion

Exact layout spacing, sub-step visual transition animations, field order within sub-steps, country-specific purpose options (USA, UK, Canada, Australia, Schengen), and helper tooltip text styling within WCAG AA tokens.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed strictly within Phase 2 scope. Also out of scope per CONTEXT.md phase boundary: document uploads (Phase 3), check-answers & mock payment (Phase 4), confirmation & tracking (Phase 5), and full 6-language translation content / offline PWA (Phase 6).
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID           | Description                                                                                                                          | Research Support                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SELCT-01** | User selects destination country and visa purpose from curated options                                                               | Curated dataset for 5 primary destinations (USA, UK, Canada, Australia, Schengen) with purposes (Tourism, Business, Study, Work); accessible Select & RadioCard primitives. |
| **SELCT-02** | System shows matching visa types with typical processing time and itemized cost upfront                                              | Pricing catalog with visa fee + ₹5,000 government fee + ₹1,500 platform fee; processing time estimates (e.g. 5–7 days).                                                     |
| **SELCT-03** | System shows required document checklist for selected visa before user commits                                                       | Static document requirement checklist attached to each visa catalog item, rendered on the card before "Select & Continue".                                                  |
| **SELCT-04** | System suggests suitable visa types based on trip purpose answers                                                                    | Deterministic rule-based recommendation tagging that applies a "Recommended" badge and visual prominence to the best fit.                                                   |
| **PERS-01**  | User enters passport info, personal details, and contact info one question-group per screen with progressive disclosure by visa type | Partitioned into 2a (Identity & Passport), 2b (Contact & Address), and 2c (Visa-Specific Details); 2c dynamically renders fields based on `visaType`.                       |
| **PERS-02**  | Passport number auto-formats to standard format (e.g. AA1234567) as user types                                                       | Input formatter stripping whitespace, uppercasing, and enforcing `^[A-Z]{2}\d{7}$` mask.                                                                                    |
| **PERS-03**  | Phone number auto-prefixes +91 and formats for readability                                                                           | Input formatter ensuring `+91 ` prefix and `5 5` digit grouping (`+91 98765 43210`).                                                                                        |
| **PERS-04**  | Smart defaults pre-fill known values (e.g. nationality = India)                                                                      | Default form state initializes `nationality: 'India'` and pre-selects sensible defaults.                                                                                    |
| **PERS-05**  | Passport expiry validation warns when validity <6 months and lets user continue or go back                                           | ISO date calculation checking `expiry < now + 180 days`; renders amber warning card with confirmation toggle required to proceed.                                           |
| **PERS-06**  | Fields validate on blur and stage-continue with green checkmarks when valid — not on every keystroke                                 | Field state tracks `touched` on blur; valid fields display green checkmark icon; invalid fields display inline error.                                                       |
| **STATE-04** | Returning users see "Continue Application" and resume on first genuinely incomplete step                                             | Pure `getFirstIncompleteStep(answers)` selector replaying validators over answers from localStorage; displays banner and navigates to target step.                          |
| **ERR-01**   | Validation errors show accessible error summaries at top of page with links to each invalid field                                    | `ErrorSummary` component with `role="alert"`, `aria-live="polite"`, `#field-id` anchor links that manage focus.                                                             |
| **ERR-02**   | All error messages are constructive and specific (say what's wrong and how to fix), never generic "Invalid input"                    | Typed error message catalog mapped to validation rules with actionable fix instructions.                                                                                    |

</phase_requirements>

## Architectural Responsibility Map

| Capability                         | Module / Layer                                                                      | Description                                                                                                          |
| ---------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Visa Catalog & Recommendation      | `src/features/visa/catalog.ts`                                                      | Static typed catalog of destinations, visa types, fees, durations, document checklists, and recommendation heuristic |
| Wizard Machine Topology            | `src/features/wizard/machine.ts`                                                    | 5-stage topology with Stage 2 sub-steps (`2a`, `2b`, `2c`); events `ANSWER_CHANGED`, `GOTO`, `NEXT`, `BACK`          |
| Step Status & Resumption Selectors | `src/features/wizard/selectors.ts`                                                  | Pure functions deriving `StepStatus` per step/sub-step and `getFirstIncompleteStep(answers)` for `STATE-04`          |
| Formatters & Validators            | `src/features/wizard/validators.ts`, `formatters.ts`                                | Passport & phone formatters; date math; constructive error messages (`ERR-02`)                                       |
| Accessible Error Summary           | `src/components/ui/ErrorSummary.tsx`                                                | Top-of-page error summary card with focus management and jump links (`ERR-01`)                                       |
| Passport Expiry Warning            | `src/components/ui/ExpiryWarning.tsx`                                               | Inline warning card with acknowledgement checkbox (`PERS-05`)                                                        |
| Stage 1 Screen Component           | `src/features/visa/VisaSelectionScreen.tsx`                                         | Interactive selector + reactive recommended visa cards (`SELCT-01..04`)                                              |
| Stage 2 Sub-step Screens           | `src/features/personal/IdentityStep.tsx`, `ContactStep.tsx`, `VisaSpecificStep.tsx` | Sub-step forms with progressive disclosure, auto-formatters, on-blur validation (`PERS-01..06`)                      |
| Journey Shell Integration          | `src/App.tsx`, `src/components/AppShell.tsx`                                        | Step routing, stepper rendering, resume banner, save indicator integration                                           |

## Testing Strategy

- **Unit / Component Tests (Vitest + Testing Library + vitest-axe):**
  - Validator functions (passport format, expiry date math, phone format, email format).
  - Visa catalog lookup and recommendation matching logic.
  - `ErrorSummary` accessibility contract (`role="alert"`, keyboard focus, jump link behavior).
  - `ExpiryWarning` confirmation requirement.
  - Stage 1 and Stage 2 sub-step components tested with `vitest-axe` for 0 violations.
  - Resumption selector replaying against various partial answer sets.
- **E2E Tests (Playwright):**
  - Complete user flow from Stage 1 through Stage 2 (2a → 2b → 2c).
  - On-blur green checkmarks and error summary interaction.
  - Auto-formatting behavior during typing (passport & phone).
  - Refresh / reload test verifying "Continue Application" drops user on first incomplete step (`STATE-04`).
