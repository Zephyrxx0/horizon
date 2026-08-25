# Phase 1: Foundation, Design System & Persistence Engine - Context

**Gathered:** 2026-08-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 delivers the technical foundation every later stage composes on: a Vite + React + TypeScript SPA scaffold (FOUND-01), a token-driven mobile-first design system with accessibility primitives baked into base components (FOUND-02/03), a local Noto font strategy per Indic script within a 3G-class payload budget (FOUND-04), a typed mock service layer behind a single swap point (FOUND-05), and the wizard state/persistence engine — pure state machine over answers, ~10s debounced autosave with flush-on-hide, IndexedDB document storage with compression and quota handling (STATE-01/02/03).

No journey stages are built here. Visa selection, personal details, documents UI, payment, tracking all belong to Phases 2–5; localization content, PWA/offline service workers, and journey-wide verification belong to Phase 6.

</domain>

<decisions>
## Implementation Decisions

### Wizard State Architecture
- **D-01:** Wizard is implemented with **XState** — immutable transitions, trivially serializable snapshots for persistence, direct fit for STATE-01's "pure state machine over answers" requirement.
- **D-02:** Storage split by data type: **answers/metadata → localStorage; document blobs → IndexedDB** (idb-keyval acceptable wrapper). Matches STATE-02/03 split exactly.
- **D-03:** Autosave is **debounced (~10s after last edit) plus mandatory flush on `visibilitychange`/`pagehide`** — survives kill-the-tab without writing mid-keystroke state. Success criterion #2's honest "Saved / Not saved" indicator must reflect this pipeline truthfully.
- **D-04:** Mock services (passport lookup, payment, OTP, notifications, tracking) are built as **typed interfaces with one mock implementation behind a single factory/import swap point** (ports-and-adapters shape). No fault-injection dev panel this phase — configurable success/failure/timeout scenarios at the interface level only.

### Design System & Theming
- **D-05:** **Tailwind v4** styling with theme tokens declared as CSS variables via `@theme` (48px target sizes, AA contrast palette live as tokens, not ad-hoc classes).
- **D-06:** **Custom component library** (~10 base components in `src/components/ui/`: Button, Input, Select, RadioCard, Checkbox, ProgressStepper, FieldLabel/Hint/Error, Card, Modal/sheet, Toast). No shadcn/ui or Radix dependency — labels, error announcements (`aria-live`), focus management, and 48px targets are implemented directly in these primitives (FOUND-03).
- **D-07:** Visual direction: **calm government-trust** — deep indigo primary + saffron accent, generous whitespace, large type. Replaces the prototype's stock Tailwind blues. Exact hex values are agent discretion within WCAG AA contrast.
- **D-08:** A11y enforcement during Phase 1 = **vitest-axe on every ui component** from day one. (Journey-wide Playwright axe gate remains Phase 6 / A11Y-01.)

### Fonts & i18n Scaffolding
- **D-09:** i18n foundation is **react-i18next**: lazy-loaded namespaces per stage, TypeScript key typing via resources typegen. Phase 1 ships machinery + complete EN locale; the five Indic translations complete in Phase 6 (per roadmap cross-cutting split).
- **D-10:** Noto fonts ship as **Fontsource npm packages** (`@fontsource/noto-sans` + script-specific packages), importing only needed unicode-range subsets; Vite handles hashing. Keep each script subset within the 3G-class budget (research suggests ~30–80KB/script; enforce a bundle-budget check in CI).
- **D-11:** Language switcher is **live in Phase 1** — header control + full scaffolding. Untranslated locales fall back to English copy with a visible "translation coming" state rather than being hidden until Phase 6.

### Testing & Tooling
- **D-12:** Test stack: **Vitest + Testing Library (+ vitest-axe) for components/unit; Playwright for E2E** (incl. future 3G throttling profiles for PERF-01).
- **D-13:** Quality gates: **ESLint (typescript-eslint + react-hooks + jsx-a11y) + Prettier**, wired through **husky + lint-staged** pre-commit hooks.
- **D-14:** CI runs from Phase 1 via **GitHub Actions** (typecheck, lint, vitest, Playwright smoke, axe gate) on PR + main — establishes the "axe CI gate" wording of A11Y-01 early.

### Agent's Discretion
Exact component API shapes, final palette hex values, XState machine topology (states/events naming), localStorage key names/schema versioning, i18n namespace layout, and Vitest/Playwright config details — unless they contradict decisions above or roadmap success criteria.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product & Behavior Reference
- `visarethink/indian_visa_prd.md` §2, §4, §5 — guided-journey philosophy, the authoritative mock inventory table (§4), stage-by-stage journey detail (§5). Mock scope MUST be capped to the §4 inventory.
- `visarethink/visa_prototype.jsx` — behavioral reference for validation logic (passport format `AA1234567`, phone digits-only, email regex), cost breakdown structure (visa fee + ₹5,000 government fee + ₹1,500 platform fee), stage progress indicator pattern. Source of patterns, not code to port.

### Planning Artifacts
- `.planning/REQUIREMENTS.md` — FOUND-01…05, STATE-01…03 definitions (this phase's requirements); also the Out of Scope table (anti-features).
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria (5 must-be-TRUE statements), and cross-cutting quality split decisions.
- `.planning/research/SUMMARY.md` — risk register relevant here: autosave theater (kill-the-tab test protocol), a11y-as-final-pass failure mode, Indic font payload budgets, mock scope explosion cap, and the Vite translation notes (TS 7 ESLint sidecar caveat, vite-plugin-pwa peer-range check — verify on install).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Greenfield — no application source exists yet. Only assets are `visarethink/` docs + single-file prototype (behavioral reference only).
- Prototype validation logic and fee constants are copy-paste sources for typed utilities.

### Established Patterns
- None to follow — this phase *establishes* the patterns (state management, styling tokens, testing conventions) all later phases inherit.
- Note: repo has a stray `.gitingore` file (typo'd name/content); scaffold should add a proper `.gitignore`.

### Integration Points
- Scaffold lands at repo root (Vite project). `visarethink/` stays untouched as reference material.
- Mock service interfaces defined now become the seams Phases 2–5 call through; persistence keys/schema set here are what Phase 2 resume logic reads.

</code_context>

<specifics>
## Specific Ideas

- Visual identity: "official but friendly" trust-first look (deep indigo + saffron accent) — NOT the prototype's generic blue gradient.
- Honest save indicator: "Saved / Not saved" states driven by the real autosave pipeline (success criterion #2 calls out honesty explicitly).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Foundation, Design System & Persistence Engine*
*Context gathered: 2026-08-25*
