# Phase 2: Guided Journey — Visa Selection & Personal Details - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-26
**Phase:** 02-guided-journey-visa-selection-personal-details
**Areas discussed:** Screen Breakdown & Grouping for Personal Details, Visa Recommendation & Selection UX, Passport Expiry Warning UX, Validation & Error Summary Behavior

---

## Screen Breakdown & Grouping for Personal Details

| Option                        | Description                                                                                                                                                                           | Selected |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Dedicated sub-steps in wizard | Dedicated sub-steps in the wizard (e.g., 2a: Identity & Passport, 2b: Contact & Address, 2c: Visa-Specific Details) with individual Continue/Back buttons and smooth progress updates | ✓        |
| Single scrollable page        | Single scrollable page with visually distinct card sections/accordion groups, with one single "Save & Continue to Documents" button at the bottom                                     |          |
| Single-question focus cards   | Single-question focus cards (card-by-card carousel or focus shift within one screen)                                                                                                  |          |

**User's choice:** Dedicated sub-steps in the wizard (2a: Identity & Passport, 2b: Contact & Address, 2c: Visa-Specific Details) with individual Continue/Back controls and smooth progress updates.
**Notes:** Keeps mobile screens focused on one digestible question group per view, directly fulfilling requirement PERS-01 while maintaining clear sense of progress.

---

## Visa Recommendation & Selection UX

| Option                        | Description                                                                                                                                                                                                                            | Selected |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Combined interactive selector | Combined interactive selector: Destination dropdown + Purpose radio pills at top, instantly updating recommended visa card(s) below with "Recommended" badge, cost breakdown, processing time, and upfront required document checklist | ✓        |
| Two-step sequential wizard    | Step 1 asks "Where and why are you traveling?", Step 2 shows recommendation cards and checklist                                                                                                                                        |          |
| Comparison matrix/table       | Side-by-side comparison of all matching visa types for the destination                                                                                                                                                                 |          |

**User's choice:** Combined interactive selector with instant card updates, recommendation badge, upfront cost breakdown, and required document checklist.
**Notes:** Provides transparency upfront per SELCT-01..04 so applicants commit to a visa type with eyes wide open regarding cost, time, and documents.

---

## Passport Expiry (<6 Months) Warning UX

| Option                               | Description                                                                                                                                                                                    | Selected |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Inline contextual amber warning card | Inline contextual amber warning card appearing right below the expiry field immediately with plain language and a required "Continue anyway with current expiry" confirmation before advancing | ✓        |
| Interception bottom sheet/modal      | Interception Bottom Sheet / Modal triggered upon clicking "Continue"                                                                                                                           |          |
| Persistent banner                    | Persistent banner at the top of the step alerting about expiry                                                                                                                                 |          |

**User's choice:** Inline contextual amber warning card appearing right below expiry field with required explicit confirmation toggle/checkbox.
**Notes:** Fulfills PERS-05 with plain language guidance without disorienting the user with blocking modal interruptions.

---

## Validation & Error Summary Behavior

| Option                    | Description                                                                                                                                                                                                                 | Selected |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Hybrid validation pattern | On blur, show inline constructive error or green checkmark per field; when user clicks "Continue" with errors present, scroll to & focus an accessible top-of-page error summary card with jump links to each invalid field | ✓        |
| Strict submit-only        | Keep fields visually clean until "Continue" is clicked, then display top-of-page error summary and highlight all invalid fields simultaneously                                                                              |          |
| Live instant              | Validate as user types after initial blur, updating error summary count and badges dynamically                                                                                                                              |          |

**User's choice:** Hybrid validation: inline on blur + green checkmarks when valid (`PERS-06`) + top-of-page accessible error summary card (`ERR-01`) on continue attempt, with constructive specific messages (`ERR-02`).
**Notes:** Minimizes disruptive errors while typing, but provides reassuring positive feedback on completion and accessible error navigation.

---

## Agent's Discretion

- Visual spacing, transition timing, field ordering within sub-steps, exact tooltip helper text strings within WCAG AA design token bounds.

## Deferred Ideas

- None — all topics discussed were directly within Phase 2 scope.
