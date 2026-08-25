# Phase 1: Foundation, Design System & Persistence Engine - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-25
**Phase:** 1-Foundation, Design System & Persistence Engine
**Areas discussed:** Wizard state architecture, Design system & theming, Fonts & i18n scaffolding, Testing & tooling

---

## Wizard state architecture

| Option | Description | Selected |
|--------|-------------|----------|
| XState | ~3KB gzip. Immutable transitions, time-travel debugging, trivially serializable to localStorage. Strongest fit for STATE-01. | ✓ |
| Robot3 / tiny FSM | ~600B gzip. Minimal FSM with same guarantees; less tooling, more hand-rolled code. | |
| useReducer pattern | No library — a reducer + derived step statuses. Lightest payload, but you own all transition logic. | |

**User's choice:** XState

| Option | Description | Selected |
|--------|-------------|----------|
| Split by data type | Answers/metadata → localStorage; document blobs → IndexedDB. Matches PRD's localStorage simulation note. | ✓ |
| All IndexedDB | Everything via idb-keyval in one store; slightly more code. | |

**User's choice:** Split by data type (localStorage answers / IndexedDB files)

| Option | Description | Selected |
|--------|-------------|----------|
| Debounced + flush | Debounce writes 10s after last edit + flush on visibilitychange/pagehide. Survives kill-the-tab. | ✓ |
| Fixed interval | setInterval every 10s regardless of activity; can write mid-keystroke state. | |

**User's choice:** Debounced + flush

| Option | Description | Selected |
|--------|-------------|----------|
| Interface + mock impl | One `services/` module, typed interface, mock impl behind single factory/import swap point. Direct FOUND-05 fit. | ✓ |
| Mock + fault injection | Same plus latency simulation and dev toggle panel — richer demo, more Phase 1 scope. | |
| Ad-hoc functions | Plain Promise-returning functions, no abstraction; no clean swap point later. | |

**User's choice:** Interface + mock implementation behind single swap point

---

## Design system & theming

| Option | Description | Selected |
|--------|-------------|----------|
| Tailwind v4 | Utility classes with theme tokens via CSS variables in @theme. Prototype already uses Tailwind classnames. | ✓ |
| Panda CSS | Zero-runtime component API; type-safe theming but new pattern/smaller ecosystem. | |
| Vanilla CSS + custom props | No dependency; build and maintain every primitive yourself. | |

**User's choice:** Tailwind v4

| Option | Description | Selected |
|--------|-------------|----------|
| Custom library | ~10 base components in src/components/ui/ with a11y primitives and 48px targets baked in. | ✓ |
| shadcn/ui adapted | Faster start but desktop-density assumptions need heavy restyling for FOUND-02/03. | |
| Radix + custom skin | Solid a11y behavior with our visual layer on top. | |

**User's choice:** Custom component library

| Option | Description | Selected |
|--------|-------------|----------|
| Calm government-trust | Deep indigo primary + saffron accent, generous whitespace, large type. "Official but friendly." | ✓ |
| Prototype palette | Keep stock blue-50/indigo-100 gradient look — generic. | |
| Vibrant modern | Bold tricolor-inspired fintech energy — riskier for low-literacy audience. | |

**User's choice:** Calm government-trust direction

| Option | Description | Selected |
|--------|-------------|----------|
| axe in unit tests | vitest-axe on every ui component from day one; catches violations at build time. | ✓ |
| E2E axe scans now | Playwright + axe per page/stage as built; slower feedback. | |
| Defer to Phase 6 | Manual review only until journey-wide gate; violations accumulate silently. | |

**User's choice:** vitest-axe on every ui component from day one

---

## Fonts & i18n scaffolding

| Option | Description | Selected |
|--------|-------------|----------|
| react-i18next | Battle-tested, ICU messages, lazy-load namespaces per stage, TS key typing via typegen. | ✓ |
| react-intl | FormatJS — strongest ICU plural/date formatting; heavier, more boilerplate. | |
| Custom dictionary | Tiny typed dictionary context (~1KB); hand-roll plurals/interpolation later. | |

**User's choice:** react-i18next (machinery + EN locale now; Indic content completes Phase 6)

| Option | Description | Selected |
|--------|-------------|----------|
| Fontsource npm | @fontsource/noto-sans + script packages; import only needed unicode-range subsets; Vite hashing. | ✓ |
| Self-hosted files | Manual woff2 downloads + hand-written @font-face; full control, manual upkeep. | |
| Google Fonts CDN | Zero upkeep but third-party request on 3G conflicts with payload budget. | |

**User's choice:** Fontsource npm packages

| Option | Description | Selected |
|--------|-------------|----------|
| Switcher live now | Header control + scaffolding; untranslated locales show English copy with "translation coming" state. | ✓ |
| Hidden until Phase 6 | Machinery tested but no UI entry point; zero user-visible value this phase. | |
| EN + one pilot locale | Hindi proof-of-pipeline in Phase 1; rest in Phase 6. | |

**User's choice:** Switcher live now

---

## Testing & tooling

| Option | Description | Selected |
|--------|-------------|----------|
| Vitest + Playwright | Vitest + Testing Library + vitest-axe for components; Playwright for E2E + 3G throttling profiles. | ✓ |
| Playwright only | Single runner incl. component testing; weaker unit ergonomics, slower inner loop. | |
| Vitest browser mode | Cutting edge single-runner; browser-mode stability risk for a11y/perf gates. | |

**User's choice:** Vitest + Playwright

| Option | Description | Selected |
|--------|-------------|----------|
| ESLint+Prettier+husky | typescript-eslint + react-hooks + jsx-a11y + Prettier via lint-staged pre-commit. | ✓ |
| Biome | Single fast lint+format tool; jsx-a11y rules less mature. | |
| No gates | Editor-only formatting; style drift and missed a11y lints. | |

**User's choice:** ESLint + Prettier + husky/lint-staged

| Option | Description | Selected |
|--------|-------------|----------|
| GH Actions full gate | typecheck, lint, vitest, Playwright smoke, axe gate on PR + main. Matches A11Y-01 wording. | ✓ |
| Minimal CI now | Typecheck+unit only; E2E/axe deferred to Phase 6. | |
| No CI yet | Local hooks only. | |

**User's choice:** GitHub Actions full gate from Phase 1

---

## Agent's Discretion

Exact component API shapes, final palette hex values, XState machine topology/naming, localStorage schema/key names, i18n namespace layout, Vitest/Playwright config details.

## Deferred Ideas

None — discussion stayed within phase scope.
