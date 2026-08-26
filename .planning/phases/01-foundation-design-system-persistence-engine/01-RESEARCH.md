# Phase 1: Foundation, Design System & Persistence Engine - Research

**Researched:** 2026-08-25
**Domain:** Vite+React+TS SPA foundation — XState wizard machine, split browser persistence, Tailwind v4 design system, i18n scaffolding, typed mock services, quality-gate tooling
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Wizard State Architecture**

- **D-01:** Wizard is implemented with **XState** — immutable transitions, trivially serializable snapshots for persistence, direct fit for STATE-01's "pure state machine over answers" requirement.
- **D-02:** Storage split by data type: **answers/metadata → localStorage; document blobs → IndexedDB** (idb-keyval acceptable wrapper).
- **D-03:** Autosave is **debounced (~10s after last edit) plus mandatory flush on `visibilitychange`/`pagehide`** — survives kill-the-tab without writing mid-keystroke state. Honest "Saved / Not saved" indicator must reflect this pipeline truthfully.
- **D-04:** Mock services (passport lookup, payment, OTP, notifications, tracking) are built as **typed interfaces with one mock implementation behind a single factory/import swap point** (ports-and-adapters shape). No fault-injection dev panel this phase — configurable success/failure/timeout scenarios at the interface level only.

**Design System & Theming**

- **D-05:** **Tailwind v4** styling with theme tokens declared as CSS variables via `@theme` (48px target sizes, AA contrast palette live as tokens, not ad-hoc classes).
- **D-06:** **Custom component library** (~10 base components in `src/components/ui/`: Button, Input, Select, RadioCard, Checkbox, ProgressStepper, FieldLabel/Hint/Error, Card, Modal/sheet, Toast). No shadcn/ui or Radix dependency — labels, error announcements (`aria-live`), focus management, and 48px targets are implemented directly in these primitives.
- **D-07:** Visual direction: **calm government-trust** — deep indigo primary + saffron accent, generous whitespace, large type. Exact hex values are agent discretion within WCAG AA contrast.
- **D-08:** A11y enforcement during Phase 1 = **vitest-axe on every ui component** from day one. (Journey-wide Playwright axe gate remains Phase 6 / A11Y-01.)

**Fonts & i18n Scaffolding**

- **D-09:** i18n foundation is **react-i18next**: lazy-loaded namespaces per stage, TypeScript key typing via resources typegen. Phase 1 ships machinery + complete EN locale; five Indic translations complete in Phase 6.
- **D-10:** Noto fonts ship as **Fontsource npm packages** (`@fontsource/noto-sans` + script-specific packages), importing only needed unicode-range subsets; keep each script subset within the 3G-class budget (~30–80KB/script); enforce a bundle-budget check in CI.
- **D-11:** Language switcher is **live in Phase 1** — header control + full scaffolding. Untranslated locales fall back to English copy with a visible "translation coming" state rather than being hidden.

**Testing & Tooling**

- **D-12:** Test stack: **Vitest + Testing Library (+ vitest-axe) for components/unit; Playwright for E2E** (incl. future 3G throttling profiles for PERF-01).
- **D-13:** Quality gates: **ESLint (typescript-eslint + react-hooks + jsx-a11y) + Prettier**, wired through **husky + lint-staged** pre-commit hooks.
- **D-14:** CI runs from Phase 1 via **GitHub Actions** (typecheck, lint, vitest, Playwright smoke, axe gate) on PR + main.

### Agent's Discretion

Exact component API shapes, final palette hex values, XState machine topology (states/events naming), localStorage key names/schema versioning, i18n namespace layout, and Vitest/Playwright config details — unless they contradict decisions above or roadmap success criteria.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope. Also out of scope per CONTEXT.md phase boundary: journey stages (Phases 2–5), localization content completion, PWA/service workers, journey-wide verification (Phase 6).
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID                    | Description                                                                                      | Research Support                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FOUND-01              | Vite + React + TS scaffold, Tailwind theme tokens enforcing 48px targets + WCAG AA palette       | create-vite 9.2.0 react-ts template pins typescript ~6.0.2 (resolves TS7/typescript-eslint conflict); Tailwind v4 `@theme` token mechanics verified from official docs        |
| FOUND-02              | Reusable mobile-first components (full-width inputs/buttons, single-column, readable type)       | D-06 component inventory; Tailwind v4 spacing/text scale tokens; prototype layout patterns as behavioral reference                                                            |
| FOUND-03              | Accessible primitives (labels, error announcements, focus management) baked into base components | vitest-axe setup verified (jsdom requirement, matcher extension, region-rule config); aria-live/described-by patterns                                                         |
| FOUND-04              | Local Noto subsets per script within 3G-class payload budget                                     | Fontsource 5.3.0 per-script subset import paths verified from official docs; unicode-range lazy-fetch behavior documented; Marathi shares Devanagari package                  |
| FOUND-05              | Typed mock service interfaces w/ success/failure/timeout behind single swap point                | Ports-and-adapters pattern; PRD §4 mock inventory table caps scope; scenario-config interface shape                                                                           |
| STATE-01              | Pure state machine over answers; statuses derived, never persisted                               | XState v5 snapshot API (`getPersistedSnapshot`/`createActor{snapshot}`) verified from official docs; derive-don't-persist selector pattern                                    |
| STATE-02              | ~10s debounced autosave + flush on page hide/tab close                                           | Chrome Page Lifecycle guidance verified: visibilitychange→hidden is last reliable save moment; localStorage sync writes complete inside handler window (why D-02 split works) |
| STATE-03              | Documents persist in IndexedDB w/ quota handling + client-side compression ≤2MB                  | idb-keyval API verified (Blob structured-clone, tx-complete durability, custom stores); quota APIs (`storage.estimate/persist`); canvas downscale pattern                     |
| </phase_requirements> |

## Project Constraints (from AGENTS.md)

From user-level AGENTS.md directives (no project-root AGENTS.md exists):

1. **pnpm is the preferred package manager** — all install commands and CI steps should use pnpm.
2. **Before installing any application, ask the user** — planner should include a human checkpoint before dependency installation (aligns with the SUS-flagged batch below; one batched checkpoint covers it).
3. **Assume a node server may already be running before creating a new one** — relevant at execution time when starting the Vite dev server.
4. On persistent issues, consult `context7` MCP or `firecrawl` CLI before thrashing.
5. Shell is zsh; working branch `phase-1-foundation-design-system-persistence-engine` already exists and is checked out.

## Summary

Phase 1 establishes every primitive later phases compose: a Vite 8 + React 19 + TypeScript SPA scaffold, a Tailwind v4 token-driven design system with ten accessibility-first base components, an XState wizard machine whose step statuses are always derived from answers, split persistence (versioned JSON answers in localStorage, document blobs in IndexedDB via idb-keyval) with honest debounced autosave plus flush-on-hide, typed mock services capped to the PRD §4 inventory, Fontsource Noto font scaffolding within a 3G budget, react-i18next machinery with a live language switcher, and the full quality-gate chain (Vitest/vitest-axe, Playwright, ESLint/Prettier/husky/lint-staged, GitHub Actions).

Two research findings de-risk the plan materially. **First**, the locked storage split (D-02/D-03) is not just acceptable but _load-bearing for correctness_: Chrome's Page Lifecycle documentation establishes that `visibilitychange`→hidden is the last reliable moment to save data, `unload` must never be used (unreliable on mobile and its mere presence blocks bfcache eligibility), and _synchronous_ `localStorage.setItem` completes inside the flush-handler execution window while async IndexedDB writes can be cancelled mid-unload — so answers belong in localStorage precisely because kill-the-tab durability demands sync writes. Files avoid this trap by being written to IndexedDB at selection time, never at pagehide. **Second**, the TS7/ESLint caveat from project research dissolves at scaffold time: create-vite 9.2.0's react-ts template pins `typescript ~6.0.2`, which satisfies `typescript-eslint@8.x`'s peer range (`>=4.8.4 <6.1.0`) — do not bump to TS 7 this phase.

Watch-items: `vitest-axe` satisfies its peer range for Vitest 4 but is stale (Jan 2025, bundles axe-core ^4.4.2) and hard-requires the jsdom environment (happy-dom has a known axe-breaking bug); jest-axe 11 is the actively-maintained drop-in fallback. Twelve packages flag `SUS: too-new` in the legitimacy gate purely due to release recency (all have 15M–170M weekly downloads and official repos) — pin tilde-exact versions and run one batched human checkpoint before install, which also honors the AGENTS.md ask-before-install directive. No git remote is configured yet, so GitHub Actions wiring activates when the repo is pushed; author the workflow file anyway (D-14).

**Primary recommendation:** Scaffold with `create-vite@9.2.0` react-ts defaults (TS ~6.0.2), then build in this order: tokens/theme → ui components with vitest-axe per component → XState machine + persistence engine (answers module + idb-keyval documents module + autosave controller) → mock service layer → fonts/i18n scaffolding → tooling/CI. Every success criterion maps onto an existing, verified mechanism — nothing here needs novel invention.

## Architectural Responsibility Map

| Capability                              | Primary Tier                           | Secondary Tier                | Rationale                                                                                     |
| --------------------------------------- | -------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| Wizard state & derived step status      | Browser (XState actor in app JS)       | —                             | Pure client-side machine; unit-testable without React; no server exists                       |
| Answers persistence                     | Browser (localStorage, sync)           | —                             | Sync writes are what make flush-on-pagehide reliable (Page Lifecycle constraint)              |
| Document blob persistence               | Browser (IndexedDB via idb-keyval)     | —                             | Structured-clone Blobs, large quota, async writes at selection time                           |
| Autosave orchestration + save indicator | Browser (controller hook/module)       | Browser (React renders state) | Pipeline truth lives outside React render cycle; indicator is a pure projection of save-state |
| Image compression ≤2MB                  | Browser (Canvas API)                   | —                             | Client-side canvas downscale loop; no server involvement                                      |
| Mock services                           | Browser (typed modules behind factory) | —                             | PRD §4: everything backend is simulated client-side                                           |
| Design tokens & components              | Browser (Tailwind v4 @theme + React)   | Build (Vite/Tailwind compile) | CSS-first tokens compiled at build; consumed at runtime                                       |
| Fonts per Indic script                  | CDN/Static (hashed woff2 via Vite)     | Browser (unicode-range fetch) | Fontsource imports → Vite emits hashed assets; browser downloads only needed ranges           |
| i18n namespaces                         | Browser (react-i18next runtime)        | Build (dynamic import chunks) | Lazy namespace loading via dynamic import; EN ships complete                                  |
| Quality gates (lint/hooks/CI)           | Build/CI (ESLint, husky, GH Actions)   | —                             | Enforced pre-commit and on PR/main                                                            |

## Standard Stack

### Core

| Library                                                   | Version                                                | Purpose                     | Why Standard                                                                         |
| --------------------------------------------------------- | ------------------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------ |
| vite                                                      | 8.2.2 [VERIFIED: npm registry]                         | Dev server + build          | Fastest dev loop; least baseline JS for client-only apps; ratified framework         |
| react / react-dom                                         | 19.2.8 [VERIFIED: npm registry]                        | UI runtime                  | Template default; React 19 stable                                                    |
| typescript                                                | ~6.0.2 [VERIFIED: npm registry + create-vite template] | Type safety                 | Template pin; satisfies typescript-eslint peer `<6.1.0`. Do NOT use 7.0.2 this phase |
| @vitejs/plugin-react                                      | ^6.1.0 [VERIFIED: npm registry]                        | React fast-refresh          | Template default                                                                     |
| xstate                                                    | 5.32.5 [VERIFIED: npm registry + statelyai/docs]       | Wizard state machine        | D-01; v5 actor model with JSON-serializable snapshots                                |
| @xstate/react                                             | 6.1.0 [VERIFIED: npm registry + statelyai/docs]        | React bindings              | `createActorContext` / `useSelector` official integration                            |
| tailwindcss + @tailwindcss/vite                           | 4.3.3 [VERIFIED: npm registry + tailwindlabs docs]     | Styling + tokens            | D-05; CSS-first `@theme`; official Vite plugin replaces PostCSS setup                |
| idb-keyval                                                | 6.3.0 [VERIFIED: npm registry + jakearchibald docs]    | IndexedDB keyval wrapper    | D-02-sanctioned; 8.5M dl/wk; Blob-safe, promise-per-tx                               |
| i18next                                                   | 26.4.0 [VERIFIED: npm registry]                        | i18n core                   | D-09; ICU plurals, namespace lazy-load                                               |
| react-i18next                                             | 17.0.12 [VERIFIED: npm registry]                       | React bindings              | D-09; `initReactI18next`, useTranslation                                             |
| i18next-browser-languagedetector                          | 8.2.1 [VERIFIED: npm registry]                         | Locale detection            | Optional convenience; locale persisted to localStorage (no cookies — SPA)            |
| @fontsource/noto-sans (+ devanagari/tamil/telugu/kannada) | 5.3.0 each [VERIFIED: npm registry + fontsource docs]  | Self-hosted Noto per script | D-10; unicode-range subset CSS files                                                 |

### Supporting (dev/test/tooling)

| Library                                     | Version                                                                                                                                     | Purpose                      | When to Use                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------- |
| vitest                                      | 4.1.11 [VERIFIED: npm registry]                                                                                                             | Unit/component runner        | All machine + component tests                                              |
| jsdom                                       | 30.0.1 [VERIFIED: npm registry]                                                                                                             | Vitest DOM env               | REQUIRED — happy-dom breaks axe (see Pitfall 3)                            |
| @testing-library/react                      | 16.3.2 [VERIFIED: npm registry]                                                                                                             | Component testing            | Render/query by role/label                                                 |
| @testing-library/user-event                 | 14.6.6 [VERIFIED: npm registry]                                                                                                             | Interaction simulation       | Typing/clicking in tests                                                   |
| @testing-library/jest-dom                   | 7.0.1 [VERIFIED: npm registry]                                                                                                              | DOM matchers                 | Import `@testing-library/jest-dom/vitest`                                  |
| vitest-axe                                  | 0.1.0 [VERIFIED: npm registry] [WARNING: flagged stale — verify with Vitest 4 smoke test before adopting broadly; fallback jest-axe 11.0.0] | axe matchers                 | D-08; per-component a11y assertions                                        |
| @playwright/test                            | 1.62.1 [VERIFIED: npm registry]                                                                                                             | E2E + device emulation       | Smoke E2E now; Pixel-class projects + 3G throttle later phases             |
| eslint                                      | 10.9.1 [VERIFIED: npm registry]                                                                                                             | Linter core                  | Flat config (eslint.config.js)                                             |
| typescript-eslint                           | 8.68.0 [VERIFIED: npm registry]                                                                                                             | TS lint integration          | Unified package; peers allow eslint ^9/^10, TS <6.1                        |
| eslint-plugin-react-hooks                   | 7.1.1 [VERIFIED: npm registry]                                                                                                              | Hooks rules                  | v7 ships native flat configs (`configs.flat.recommended`)                  |
| eslint-plugin-jsx-a11y                      | 6.10.2 [VERIFIED: npm registry]                                                                                                             | JSX a11y rules               | `flatConfigs.recommended` — static a11y layer under vitest-axe             |
| eslint-config-prettier                      | 10.1.8 [VERIFIED: npm registry]                                                                                                             | Disable formatting conflicts | Last in flat-config array; do NOT use eslint-plugin-prettier (discouraged) |
| prettier                                    | 3.9.6 [VERIFIED: npm registry]                                                                                                              | Formatter                    | Separate tool from ESLint                                                  |
| husky                                       | 9.1.7 [VERIFIED: npm registry]                                                                                                              | Git hooks                    | v9: `husky init`; no shebang needed                                        |
| lint-staged                                 | 17.3.0 [VERIFIED: npm registry]                                                                                                             | Staged-file tasks            | Config in package.json                                                     |
| @types/react, @types/react-dom, @types/node | latest template pins [CITED: create-vite 9.2.0 template]                                                                                    | Types                        | From scaffold                                                              |

### Alternatives Considered

| Instead of                            | Could Use                            | Tradeoff                                                                                                                                                                                      |
| ------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vitest-axe (locked D-08)              | jest-axe 11.0.0                      | jest-axe is actively maintained (Jul 2026, axe-core 4.12) and works identically with Vitest via `expect.extend` — adopt only if vitest-axe misbehaves with Vitest 4; keep D-08 name otherwise |
| oxlint (create-vite template default) | ESLint stack (locked D-13)           | Template ships oxlint for speed; replace it — jsx-a11y coverage is required and oxlint lacks the locked plugin set                                                                            |
| Hand-rolled reducer                   | XState (locked D-01)                 | Project SUMMARY suggested plain reducer; CONTEXT locks XState — snapshots give serialization for free                                                                                         |
| i18next-http-backend                  | Bundled resources via dynamic import | Backend adds network fetch complexity; static `import()` of JSON per namespace gives Vite code-splitting with zero runtime backend — simpler for SPA                                          |

**Installation:**

```bash
# Scaffold (creates app at repo root — visarethink/ stays untouched)
pnpm create vite@9.2.0 . --template react-ts   # answer prompts to merge into existing dir

# Runtime deps
pnpm add xstate @xstate/react tailwindcss @tailwindcss/vite idb-keyval \
  i18next react-i18next i18next-browser-languagedetector \
  @fontsource/noto-sans @fontsource/noto-sans-devanagari \
  @fontsource/noto-sans-tamil @fontsource/noto-sans-telugu @fontsource/noto-sans-kannada

# Dev deps
pnpm add -D vitest jsdom @testing-library/react @testing-library/user-event \
  @testing-library/jest-dom vitest-axe @playwright/test \
  eslint typescript-eslint eslint-plugin-react-hooks eslint-plugin-jsx-a11y \
  eslint-config-prettier prettier husky lint-staged globals @eslint/js
```

**Version verification:** all versions in the tables above were read from the live npm registry this session (2026-08-25) via `npm view <pkg> version`; compatibility-critical peer ranges were read explicitly (`typescript-eslint`: eslint `^8.57||^9||^10`, typescript `<6.1.0`; `vitest-axe`: vitest `>=0.16.0`). The scaffold's own pin (`typescript ~6.0.2`) was extracted from the create-vite 9.2.0 tarball.

## Package Legitimacy Audit

> Gate run via `gsd-tools query package-legitimacy check --ecosystem npm` over all 33 candidate packages (2026-08-25).

| Package                                                                                                                                                                        | Registry | Age signal             | Downloads/wk  | Source Repo                                                                                                                    | Verdict         | Disposition                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------- | ---------------------------------------------------------------------------------- |
| xstate                                                                                                                                                                         | npm      | recent release         | 5.37M         | github.com/statelyai/xstate                                                                                                    | OK              | Approved                                                                           |
| @xstate/react                                                                                                                                                                  | npm      | 2026-02                | 3.04M         | github.com/statelyai/xstate                                                                                                    | OK              | Approved                                                                           |
| tailwindcss / @tailwindcss/vite                                                                                                                                                | npm      | 2026-07                | 126M / 46M    | github.com/tailwindlabs/tailwindcss                                                                                            | OK              | Approved                                                                           |
| idb-keyval                                                                                                                                                                     | npm      | 2026-07                | 8.54M         | github.com/jakearchibald/idb-keyval                                                                                            | OK              | Approved                                                                           |
| react, react-dom, @vitejs/plugin-react, @fontsource/* (×5), eslint-plugin-react-hooks, eslint-plugin-jsx-a11y, eslint-config-prettier, prettier, husky, @testing-library/react | npm      | various                | 1M–40M+       | official orgs                                                                                                                  | OK              | Approved                                                                           |
| i18next                                                                                                                                                                        | npm      | released 2026-08-20    | 21.3M         | github.com/i18next/i18next                                                                                                     | SUS (`too-new`) | Approved w/ pinned version + checkpoint                                            |
| react-i18next                                                                                                                                                                  | npm      | released 2026-08-20    | 15.4M         | github.com/i18next/react-i18next                                                                                               | SUS (`too-new`) | Approved w/ pinned version + checkpoint                                            |
| vitest, jsdom, @testing-library/user-event, @testing-library/jest-dom, @playwright/test, eslint, typescript-eslint, lint-staged, vite                                          | npm      | releases ≤ ~5 days old | 15M–170M each | official orgs (vitestdev, jsdom/jsdom, testing-library, microsoft, playwright, eslint, typescript-eslint, lint-staged, vitejs) | SUS (`too-new`) | Approved w/ pinned version + checkpoint                                            |
| vitest-axe                                                                                                                                                                     | npm      | last publish 2025-01   | 597K          | github.com/chaance/vitest-axe                                                                                                  | OK (stale)      | Approved; smoke-test vs Vitest 4 first task that uses it; fallback jest-axe 11.0.0 |

**Packages removed due to [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** i18next, react-i18next, vitest, jsdom, @testing-library/user-event, @testing-library/jest-dom, @playwright/test, eslint, typescript-eslint, lint-staged, vite, @vitejs/plugin-react.

> **Context for the SUS flags:** every flag is the `too-new` recency heuristic — these twelve packages shipped releases within days of today. All have massive download counts (15M–170M/wk), canonical source repos, no postinstall scripts, and no deprecation. This is release-freshness noise, not supply-chain risk. **Planner action:** insert ONE `checkpoint:human-verify` task before the dependency-install task (also satisfies the AGENTS.md ask-before-install rule), and pin tilde-exact versions in package.json rather than floating `latest`.

## Architecture Patterns

### System Architecture Diagram

```
                       ┌──────────────────────────────────────────────────┐
                       │                     BROWSER                      │
                       │                                                  │
 <user input>─────►    │  ┌────────────┐   ANSWER_CHANGED events          │
 typing / taps ──────► │  │ UI comps   │──────────────┐                   │
                       │  │ (src/ui/*) │              ▼                   │
                       │  └────┬───────┘   ┌──────────────────┐           │
                       │       │           │ XState wizard    │           │
                       │       │ selectors │ machine (pure)   │           │
                       │       │ (derive)  │ context.answers  │           │
                       │       ▼           └───────┬──────────┘           │
                       │  step status / progress   │ getPersistedSnapshot()
                       │  (computed, NEVER stored) │ (JSON)               │
                       │                           ▼                      │
                       │             ┌──────────────────────────┐        │
                       │             │ Autosave controller      │        │
                       │             │ debounce 10s (trailing)  │        │
                       │             │ flush(): visibilitychange│        │
                       │             │  (hidden) / pagehide     │        │
                       │             └───────┬──────────────────┘        │
                       │      save state     │ sync write                │
                       │  idle→dirty→saved   ▼                           │
                       │  (drives "Saved/Not saved")  ┌───────────────┐  │
                       │                              │ localStorage  │  │
                       │  ┌────────────────┐          │ {version,     │  │
                       │  │ File select    │ blob at  │  savedAt,     │  │
                       │  │ canvas ≤2MB ───┼─selection├─ snapshot}    │  │
                       │  └────────────────┘ time only│ └───────────────┘ │
                       │         quota err            │                   │
                       │         surfaced             ▼                   │
                       │                     ┌───────────────┐           │
                       │  getService() ─────►│ IndexedDB     │           │
                       │  (single swap pt)   │ (idb-keyval)  │           │
                       │        │            └───────────────┘           │
                       │        ▼                                          │
                       │  ┌─────────────────────────────────────┐          │
                       │  │ Mock adapters: passport · payment · │          │
                       │  │ OTP · notifications · tracking      │          │
                       │  │ scenario: success|failure|timeout   │          │
                       │  │ latency 800–3000ms                  │          │
                       │  └─────────────────────────────────────┘          │
                       └──────────────────────────────────────────────────┘
```

Primary trace: user types → component dispatches event → machine updates `context.answers` immutably → selectors recompute step status → autosave debounce schedules → (10s or hidden/pagehide) sync write to localStorage → indicator flips Saved. Reload: bootstrap reads envelope → validates schemaVersion → `createActor(machine,{snapshot})` → selectors recompute → UI restores exactly.

### Recommended Project Structure

```
/                                # repo root = Vite project root (visarethink/ untouched)
├── index.html
├── .gitignore                   # NEW — stray `.gitingore` typo file removed/replaced
├── .github/workflows/ci.yml
├── eslint.config.js
├── playwright.config.ts
├── vitest.config.ts
├── src/
│   ├── main.tsx                 # bootstrap: rehydrate → providers
│   ├── App.tsx
│   ├── styles/
│   │   └── theme.css            # @import "tailwindcss"; @theme tokens
│   ├── components/
│   │   └── ui/                  # Button, Input, Select, RadioCard, Checkbox,
│   │       │                    # ProgressStepper, FieldLabel/Hint/Error,
│   │       │                    # Card, Modal/sheet, Toast  (each with *.test.tsx incl. axe)
│   │       └── SaveIndicator.tsx
│   ├── features/
│   │   └── wizard/
│   │       ├── machine.ts       # setup().createMachine — pure
│   │       ├── selectors.ts     # deriveStepStatuses(), deriveProgress() — pure
│   │       └── demo/            # throwaway demo form proving SC#1/#2/#5 end-to-end
│   ├── services/
│   │   ├── types.ts             # IPassportLookupService, IPaymentService, IOtpService,
│   │   │                        # INotificationService, ITrackingService + result unions
│   │   ├── mock/                # one adapter per port + scenarios.ts
│   │   └── index.ts             # getService<T>() — THE swap point
│   ├── persistence/
│   │   ├── answers.ts           # localStorage envelope read/write (sync, try/catch)
│   │   ├── documents.ts         # idb-keyval store for blobs + metadata
│   │   ├── compress.ts          # canvas downscale-to-≤2MB util
│   │   └── autosave.ts          # debounce + visibilitychange/pagehide flush wiring
│   ├── i18n/
│   │   ├── index.ts             # init, fallbackLng en, lazy ns loader
│   │   ├── i18next.d.ts         # CustomTypeOptions resources augmentation
│   │   └── locales/en/*.json    # common + per-stage namespaces
│   └── fonts.ts                 # Fontsource subset imports + dynamic per-script loader
└── tests/
    └── e2e/smoke.spec.ts
```

### Pattern 1: XState machine with derived status + persisted snapshot

**What:** One `setup().createMachine` whose `context` holds `{answers, currentStepId}`; step statuses/progress come from pure selector functions over `context.answers` invoked at render/test time — never written into context. Persistence uses the official snapshot round-trip.
**When to use:** Always, for STATE-01. Editing an earlier answer automatically invalidates downstream status because status is recomputed, not stored (SC #5 falls out of the architecture).

```typescript
// Source: https://stately.ai/docs/persistence (official docs, fetched via Context7)
import { setup, createActor } from 'xstate';

export const wizardMachine = setup({
  types: {} as {
    context: { answers: Record<string, unknown>; currentStepId: StepId };
    events: { type: 'ANSWER_CHANGED'; fieldId: string; value: unknown }
           | { type: 'GOTO'; stepId: StepId };
  },
  actions: {
    setAnswer: assign(({ context, event }) =>
      event.type === 'ANSWER_CHANGED'
        ? { answers: { ...context.answers, [event.fieldId]: event.value } }
        : {}
    ),
  },
}).createMachine({
  id: 'wizard',
  initial: 'selecting',
  context: { answers: {}, currentStepId: 'visa-selection' },
  states: { selecting: { on: { ANSWER_CHANGED: { actions: 'setAnswer' },
                               GOTO: { target: 'selecting', actions: ... } } } },
});

// Persist (inside actor.subscribe or autosave flush):
const snapshot = actorRef.getPersistedSnapshot();          // plain JSON object
saveAnswersEnvelope({ schemaVersion: 1, savedAt: Date.now(), snapshot });

// Restore:
const env = loadAnswersEnvelope();                          // validate schemaVersion!
const actor = createActor(wizardMachine, env ? { snapshot: env.snapshot } : undefined);
actor.start();
```

**Key constraints:** keep machine context strictly JSON-serializable (no `File`/`Blob` — document metadata only); restoring does NOT re-execute entry actions but DOES restart invocations (avoid invocations in this machine for now).

### Pattern 2: Split persistence with lifecycle-honest flush

**What:** Answers envelope written synchronously to localStorage; document blobs written to IndexedDB immediately at selection/compression time; autosave = 10s trailing debounce + mandatory synchronous flush on `visibilitychange(hidden)` and `pagehide`.
**When to use:** STATE-02/03 exactly. Never register `unload`/`beforeunload` as save points.

```typescript
// Source: https://developer.chrome.com/docs/web-platform/page-lifecycle-api (verified)
// Rationale: hidden state = last reliable save moment; unload unreliable on mobile
// AND its presence blocks bfcache eligibility. localStorage.setItem is SYNC —
// it completes within the handler window; async IDB writes may be cancelled.
export function installAutosave(flush: () => void): () => void {
  const onHide = () => {
    if (document.visibilityState === 'hidden') flush();
  };
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', flush); // bfcache-compatible, unlike unload
  return () => {
    /* cleanup both */
  };
}
// answers.ts — every write wrapped:
export function saveAnswersEnvelope(env: AnswersEnvelope): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(env));
    return true;
  } catch (e) {
    reportSaveError(e);
    /* QuotaExceededError etc. → indicator 'error' */ return false;
  }
}
```

### Pattern 3: Tailwind v4 tokens via @theme

**What:** All design decisions live as CSS variables under `@theme`; utilities generate automatically; AA-checked color pairs defined as token pairs so components can't drift.
**When to use:** FOUND-01/02. Replace the prototype's stock blues entirely (D-07).

```css
/* Source: https://tailwindcss.com/docs/theme (official, fetched via Context7) */
@import 'tailwindcss';

@theme {
  /* calm government-trust palette — hexes are agent discretion (D-07),
     but EVERY text/background pair must pass AA (≥4.5:1 body, ≥3:1 large/UI) */
  --color-indigo-deep: oklch(0.35 0.12 275); /* primary surfaces/buttons */
  --color-indigo-ink: oklch(0.28 0.11 275); /* body text on white */
  --color-saffron: oklch(0.78 0.15 75); /* ACCENT ONLY — fails as small-text-on-white;
                                                   verify pairs programmatically at impl */
  --spacing-touch: 3rem; /* 48px minimum touch target */
  --text-base: 1rem; /* readable base for 5" screens */
}
```

Use `var(--color-x)` directly inside component CSS when needed (documented v4 capability).

### Pattern 4: Ports-and-adapters mock services

**What:** Five typed interfaces (PRD §4 inventory caps scope); mock adapters simulate latency and outcomes from a scenario config; `getService()` factory is the only import site consumers ever see.
**When to use:** FOUND-05. Phases 2–5 call `getService<IPaymentService>()` and never know it's fake.

```typescript
// services/types.ts
export type ServiceOutcome<T> =
  | { status: 'success'; data: T }
  | { status: 'failure'; code: string; message: string }
  | { status: 'timeout' };

export interface IPassportLookupService {
  lookup(passportNumber: string): Promise<ServiceOutcome<PassportRecord>>;
}
export interface IPaymentService {
  /* initiate/confirm/retry … */
}
export interface IOtpService {
  /* send/verify (mock code auto-verifies) */
}
export interface INotificationService {
  /* email/SMS → console.log per PRD §4 */
}
export interface ITrackingService {
  /* status timeline reads */
}

// services/index.ts — THE swap point
export function getService<T>(port: PortSymbol): T {
  /* returns mock adapter */
}
// mock/scenarios.ts — configurable per-interface success/failure/timeout (D-04)
```

### Pattern 5: Per-component axe gate

**What:** Every `src/components/ui/*` gets a test asserting zero axe violations; static jsx-a11y ESLint rules back it up.
**When to use:** D-08 / FOUND-03, every component task.

```typescript
// Source: https://github.com/chaance/vitest-axe README (verified)
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import { configureAxe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';
expect.extend(matchers);
configureAxe({ globalOptions: { rules: [{ id: 'region', enabled: false }] } }); // component-level false positive
// Button.test.tsx
import { axe } from 'vitest-axe';
it('has no axe violations', async () => {
  const { container } = render(<Button>Continue</Button>);
  expect(await axe(container)).toHaveNoViolations();
});
```

### Anti-Patterns to Avoid

- **Storing derived state:** persisting `stepStatuses`/`progress` in the envelope guarantees resume bugs. Derive on load (STATE-01 wording is explicit).
- **unload/beforeunload as save trigger:** unreliable on mobile; presence breaks bfcache. Use visibilitychange+pagehide only.
- **Async work inside flush handlers:** IndexedDB writes started during pagehide can be cancelled; flush path must be sync localStorage only.
- **Files/Blobs in machine context or localStorage:** breaks serializability/quota; blobs go to IndexedDB at selection time, metadata goes in context.
- **happy-dom for tests:** axe's `Node.prototype.isConnected` dependency is broken there (known issue capricorn86/happy-dom#978 → dequelabs/axe-core#4087). jsdom only.
- **TypeScript 7 this phase:** typescript-eslint peers cap at `<6.1.0`. Stay on `~6.0.2`.
- **Eager-importing all locale JSONs:** defeats lazy namespaces; use dynamic `import()` per namespace/locale.
- **eslint-plugin-prettier:** discouraged (slows lint, confusing errors); use eslint-config-prettier last in the array.
- **Mock systems instead of scripts:** a mock is a scripted scenario (latency + outcome matrix), not an infrastructure layer — half-day time-box per adapter, scope locked to PRD §4 table.
- **Saffron as small-text color on white:** accent hue will fail AA contrast; restrict to borders/icons/large elements or darken deliberately, verifying pairs.

## Don't Hand-Roll

| Problem                         | Don't Build                     | Use Instead                                                   | Why                                                                                                           |
| ------------------------------- | ------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| IndexedDB wrapper               | Raw IDB transaction boilerplate | idb-keyval 6.3.0                                              | Promise-per-completed-transaction (durability semantics handled); Blob support free; 8.5M dl/wk battle-tested |
| Accessibility rule engine       | Custom checks                   | axe-core (via vitest-axe/jest-axe) + eslint-plugin-jsx-a11y   | axe encodes WCAG A/AA rule corpus; hand-rolling misses rules and rots                                         |
| State serialization             | Custom clone/serialize logic    | XState `getPersistedSnapshot()`                               | Handles deep actor graphs; JSON-ready; restore skips action replay correctly                                  |
| Font subsetting/packaging       | Manual woff2 pipelines          | Fontsource packages                                           | Pre-subset per-script files with unicode-range CSS; versioned; Vite hashes automatically                      |
| i18n plural/date/number formats | Custom formatters               | i18next Intl integration (`Intl.DateTimeFormat/NumberFormat`) | ICU plurals + ₹/date localization solved; ₹ formatting matters in later fee displays                          |
| CI browser management           | Curl-ing browser zips           | `playwright install --with-deps` + actions/cache              | Handles OS deps (libnss/libgtk) that break fresh runners                                                      |
| Debounce utility                | — (fine to write ~10 lines)     | local util OR keep tiny hand-roll                             | Trivial; but flush-on-hide logic must NOT be folded into the debounce — keep them separate                    |

**Key insight:** this phase's hard parts (durability semantics, WCAG rules, serialization correctness) are all solved problems — the engineering discipline is wiring verified mechanisms together honestly (the indicator tells the truth about the pipeline), not inventing primitives.

## Common Pitfalls

### Pitfall 1: Autosave theater (the #1 risk from project research)

**What goes wrong:** Indicator shows "Saved" but a tab kill loses keystrokes; or saves fire mid-keystroke corrupting UX; or flush is wired to unload which never fires on mobile tab-switcher kills.
**Why it happens:** Treating save as a button-adjacent afterthought; using deprecated lifecycle events.
**How to avoid:** Debounce trailing ~10s on settled edits; mandatory sync flush on visibilitychange(hidden)+pagehide AND on stage transitions; indicator state machine (`idle|dirty|saving|saved|error`) driven only by real pipeline outcomes; Playwright kill-the-tab protocol: type → `page.close()` without waiting → relaunch → assert restored.
**Warning signs:** any code path that sets "Saved" without a completed `setItem`; `beforeunload` anywhere in the diff.

### Pitfall 2: Persisted snapshot schema drift

**What goes wrong:** After Phase 2+ changes answer shapes, old envelopes crash the machine on restore.
**How to avoid:** Envelope carries `schemaVersion` from day one; loader validates shape and discards-or-migrates unknown versions (fail safe to empty draft, never crash); keep validation in ONE module (`persistence/answers.ts`).
**Warning signs:** unguarded `JSON.parse` results fed straight into `createActor`.

### Pitfall 3: vitest-axe × environment mismatch

**What goes wrong:** axe tests fail bizarrely or silently pass nothing under happy-dom.
**How to avoid:** jsdom in vitest.config (`environment: 'jsdom'`); first task touching vitest-axe is a smoke test; if Vitest 4 incompatibilities surface, swap to jest-axe 11 (`toHaveNoViolations` from jest-axe, same expect.extend pattern).
**Warning signs:** `isConnected`-related errors; matcher type errors missing from tsconfig include.

### Pitfall 4: Quota errors swallowed

**What goes wrong:** Phone photos blow limits; `QuotaExceededError` thrown uncaught or caught-and-hidden; uploads silently vanish on resume (formal WCAG 2.2.5/F12 data-loss territory).
**How to avoid:** try/catch on every localStorage write surfacing to indicator 'error' state; compress images to ≤2MB BEFORE the idb write; surface `navigator.storage.estimate()` numbers honestly when near quota; call `navigator.storage.persist()` opportunistically.
**Warning signs:** catch blocks without user-visible state transitions.

### Pitfall 5: Mock scope explosion

**What goes wrong:** Building a configurable fake-backend platform eats the milestone.
**How to avoid:** Scope = exactly the PRD §4 table (passport lookup, payment gateway, OTP, notifications→console, tracking timeline; OCR/background-checks/interview-calendar exist only as far as §4 lists them — they don't get adapters this phase unless a Phase 2–5 consumer needs the port defined; defining the _interface_ costs minutes, building the _system_ is out of scope). Latency 800–3000ms randomized; outcome matrix from a plain config object.
**Warning signs:** mock code growing beyond ~100 lines per adapter; scenario DSLs appearing.

### Pitfall 6: Indic font payload blowout

**What goes wrong:** Naively importing full families across 5 scripts wrecks the 3G budget.
**How to avoid:** Import per-script subset CSS (e.g. `@fontsource/noto-sans-tamil/tamil-400.css`); rely on unicode-range so browsers fetch only rendered scripts; dynamically import script CSS on locale switch rather than eagerly; enforce CI bundle-budget assertion; Marathi reuses the Devanagari package.
**Warning signs:** all five scripts' woff2 in the initial build chunk list; no size assertion in CI.

### Pitfall 7: i18n Suspense/flicker + unwrapped strings

**What goes wrong:** `useSuspense: true` default throws promises and flashes; late-added strings show keys.
**How to avoid:** Set `react.useSuspense: false` and gate on `ready`, or wrap the tree once in `<Suspense>`; wire `i18n.on('languageChanged', lng => document.documentElement.lang = lng)` now (I18N-03 groundwork); language switcher shows untranslated locales with visible "translation coming" fallback (D-11).
**Warning signs:** raw key strings in screenshots; Suspense boundary complaints in console.

### Pitfall 8: Toolchain version traps

**What goes wrong:** TS 7 breaks typescript-eslint peers; ESLint flat-config mixing legacy plugins errors ("rule not found"); husky v8-era tutorials add shebangs/`husky.sh` sourcing that v9 doesn't need.
**How to avoid:** TS `~6.0.2` (template default); unified `typescript-eslint` package with `tseslint.config(...)` helper; `jsxA11y.flatConfigs.recommended` + `reactHooksPlugin.configs.flat.recommended` + `eslint-config-prettier` LAST; `pnpm exec husky init` once, hook file contains just `pnpm lint-staged` style commands.
**Warning signs:** `.eslintrc.*` files existing; `@typescript-eslint/parser` installed separately.

## Code Examples

### Honest save-state indicator driven by pipeline truth

```typescript
// persistence/autosave.ts — the indicator renders THIS union verbatim (SC #2 honesty)
export type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
// dirty → (debounce fires) → saving → setItem ok ? saved : error
// any edit → dirty ; flush on hide → saving → terminal state written synchronously
```

### Canvas compression to ≤2MB (STATE-03)

```typescript
// persistence/compress.ts — standard iterative downscale; verify visually at impl
export async function compressToBudget(file: Blob, maxBytes = 2 * 1024 * 1024): Promise<Blob> {
  let bitmap = await createImageBitmap(file);
  let scale = Math.min(1, 2048 / Math.max(bitmap.width, bitmap.height));
  for (let q = 0.85; q >= 0.4; q -= 0.15) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', q));
    if (blob && blob.size <= maxBytes) return blob;
    if (blob && blob.size > maxBytes) scale *= 0.8; // shrink further and retry
  }
  throw new Error('compress-to-budget-exhausted'); // caller surfaces honestly
}

// persistence/documents.ts — write AT SELECTION TIME (never in flush handlers)
import { createStore, set, get, del } from 'idb-keyval';
const docStore = createStore('visarethink', 'documents'); // dedicated DB/store names
export async function saveDocument(id: string, blob: Blob) {
  try {
    await set(id, blob, docStore);
  } catch (e) {
    // promise resolves on tx complete
    throw new StorageUnavailableError(e);
  } // → surfaced to UI, not swallowed
}
```

### i18next init with lazy namespaces + TS key typing

```typescript
// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const NAMESPACES = ['common', 'wizard'] as const; // stages add theirs in Phases 2+

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('locale') ?? 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'], // only eager namespace
  partialBundledLanguages: true,
  resources: { en: { common: (await import('./locales/en/common.json')).default } },
  react: { useSuspense: false }, // avoid Suspense flicker
  interpolation: { escapeValue: false }, // React already escapes
});

export async function changeLocale(lng: string) {
  if (!i18n.hasResourceBundle(lng, 'common')) {
    const mod = await import(`./locales/${lng}/common.json`); // lazy chunk per locale
    i18n.addResourceBundle(lng, 'common', mod.default);
  }
  await i18n.changeLanguage(lng);
  localStorage.setItem('locale', lng);
  document.documentElement.lang = lng; // I18N-03 groundwork now
}

// i18n/i18next.d.ts — key typing via resources augmentation (official pattern)
import type { common } from './locales/en/common.json';
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: { common: typeof common; wizard: typeof import('./locales/en/wizard.json') };
  }
}
```

### Font loading per active script

```typescript
// fonts.ts — eager: latin base; dynamic: script for active locale (Pitfall 6 defense)
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-700.css';
const SCRIPT_CSS: Record<string, () => Promise<unknown>> = {
  hi: () => import('@fontsource/noto-sans-devanagari/devanagari-400.css'),
  mr: () => import('@fontsource/noto-sans-devanagari/devanagari-400.css'), // shared script
  ta: () => import('@fontsource/noto-sans-tamil/tamil-400.css'),
  te: () => import('@fontsource/noto-sans-telugu/telugu-400.css'),
  kn: () => import('@fontsource/noto-sans-kannada/kannada-400.css'),
};
```

### GitHub Actions workflow skeleton (D-14)

```yaml
# .github/workflows/ci.yml — jobs: typecheck, lint, vitest(+axe), playwright-smoke
- uses: pnpm/action-setup@v4
- uses: actions/setup-node@v4
  with: { node-version: 22, cache: pnpm }
- run: pnpm install --frozen-lockfile
- run: pnpm exec playwright install --withdeps chromium || pnpm exec playwright install --with-deps chromium
  # --with-deps is MANDATORY on ubuntu runners (libnss/libgtk) — top CI failure cause
- run: pnpm vitest run
- uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }} # report arrives exactly when tests fail
  with: { name: playwright-report, path: playwright-report/ }
# NOTE: repo currently has NO git remote — workflow activates when pushed to GitHub
```

## State of the Art

| Old Approach                           | Current Approach                                      | When Changed                                  | Impact                                                             |
| -------------------------------------- | ----------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| `.eslintrc` legacy config              | Flat `eslint.config.js` (ESLint 9+, current major 10) | ESLint 9 (2024); 10 current 2026              | All configs here are flat-format; legacy shims unnecessary         |
| `tailwind.config.js` + PostCSS plugin  | CSS-first `@theme` + `@tailwindcss/vite`              | Tailwind v4                                   | No JS config file; tokens ARE CSS variables; Vite-native plugin    |
| XState v4 `interpret()`                | v5 `createActor`/`setup()` + `getPersistedSnapshot`   | XState 5 (Dec 2023)                           | Snapshot persistence is first-class; v4 tutorials mislead          |
| `unload`/`beforeunload` saves          | `visibilitychange`(hidden)+`pagehide`                 | Page Lifecycle API guidance (Chrome, ongoing) | unload unreliable on mobile + bfcache-hostile                      |
| create-vite template lints with oxlint | Locked stack uses ESLint+plugins                      | create-vite 9.x templates                     | Swap template's oxlint out; jsx-a11y requires the locked set       |
| react-router-dom package               | Unified `react-router` (library mode)                 | v7 (2024)+                                    | Relevant to Phase 2/3 shell, not needed for Phase 1's demo stepper |
| vitest-axe (stale fork)                | jest-axe 11 actively maintained                       | Jul 2026                                      | Drop-in fallback if vitest-axe strains against Vitest 4            |

**Deprecated/outdated:**

- `unload` for saves: never use (Chrome docs explicit).
- `eslint-plugin-prettier`: discouraged; separate tools.
- CRA, localStorage-for-files, Formik/moment: excluded per project research; irrelevant here but restated for scaffold hygiene.

## Assumptions Log

| #   | Claim                                                                                                   | Section               | Risk if Wrong                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| A1  | Iterative canvas downscale/quality loop reliably reaches ≤2MB for typical phone JPEGs                   | Pattern/code examples | Compression util needs tuning (resolution floor); low risk, verify visually at implementation  |
| A2  | Per-script Noto woff2 subsets land ~30–80KB satisfying the 3G budget                                    | Pitfall 6 / D-10      | Budget check fails in CI → tighten imports (weights/subsets); measure, don't assume            |
| A3  | vitest-axe 0.1.0 functions correctly under Vitest 4 despite age (peer range permits)                    | Pitfall 3 / Stack     | Swap to jest-axe 11 (drop-in, verified pattern) — decision rule provided                       |
| A4  | Palette hexes at agent discretion can satisfy AA for all needed pairs (incl. saffron-as-accent-only)    | Pattern 3             | Contrast fixes ripple into components; mitigate by programmatic pair-checking in first UI task |
| A5  | `i18next-browser-languagedetector` is optional; manual localStorage locale persistence suffices for SPA | Stack                 | None material — detector is convenience only                                                   |
| A6  | Phase 1 demo wizard needs no router (single-page stepper UI); routing deferred to shell phase           | Structure             | Planner may still add react-router now if preferred — isolated either way                      |
| A7  | Machine topology with a single top-level machine (no nested/invoked actors) suffices for Phase 1 scope  | Pattern 1             | If planner chooses nested actors, snapshot persistence still works (deep-persist documented)   |

## Open Questions (RESOLVED)

1. **vitest-axe vs jest-axe final call**
   - **RESOLVED:** vitest-axe first (per D-08), with a predefined jest-axe (~11) fallback swap if Vitest 4/jsdom 30 errors appear — decision rule embedded in plan 01-01 Task 3 `read_first`; any swap is recorded in that plan's SUMMARY.
   - What we know: vitest-axe locked by D-08, peer-compatible with Vitest 4, but stale (Jan 2025) bundling older axe-core (^4.4.2 range resolves to 4.x latest? — dep spec is `^4.4.2`, so likely installs newer 4.13); jest-axe 11 is fresh (Jul 2026, axe-core 4.12 pinned).
   - What's unclear: real-world behavior under Vitest 4 + jsdom 30.
   - Recommendation: first component task runs a vitest-axe smoke test; predefined switch criterion keeps momentum. Either way the axe gate (D-08 intent) holds.
2. **GitHub remote absence**
   - **RESOLVED:** CI workflow is authored dormant in plan 01-01 Task 3; remote setup captured as a `user_setup` entry in plan 01-01 frontmatter (user adds remote and pushes to activate D-14 gates).
   - What we know: no git remote configured; D-14 wants GH Actions on PR+main from day one.
   - Recommendation: author the workflow now (harmless locally); confirm/push remote before relying on CI gates. Needs user action eventually.
3. **Demo surface extent**
   - **RESOLVED:** Planner sized it as an explicitly throwaway 3-step demo wizard under `features/wizard/demo/` — steps 1–3 built in plan 01-04, step 3 replaced by DocumentStep in plan 01-05.
   - What we know: SC #1/#2/#5 need a demonstration form exercising components + autosave + dependent-step invalidation.
   - Recommendation: minimal 3-step demo wizard under `features/wizard/demo/`, explicitly labeled throwaway; planner sizes it.

## Environment Availability

| Dependency                    | Required By                           | Available              | Version | Fallback                                                                  |
| ----------------------------- | ------------------------------------- | ---------------------- | ------- | ------------------------------------------------------------------------- |
| Node.js                       | everything                            | ✓                      | 26.3.0  | — (meets Vite 8 engines `^20.19 \|\| >=22.12`)                            |
| pnpm                          | installs, CI parity (user preference) | ✓                      | 10.28.0 | npm (would diverge from lockfile strategy — avoid)                        |
| git                           | hooks, commits                        | ✓                      | 2.55.0  | —                                                                         |
| Playwright browser binaries   | E2E smoke                             | ✗ (not cached locally) | —       | Run `pnpm exec playwright install --with-deps chromium` at first E2E task |
| GitHub remote                 | D-14 CI activation                    | ✗                      | —       | Author workflow regardless; activate on push                              |
| Running dev server convention | execution-time DX                     | n/a                    | —       | AGENTS.md: assume one may be running; check before starting Vite          |

**Missing dependencies with no fallback:** none blocking (Playwright binaries are a one-command install; GitHub remote is organizational).
**Missing dependencies with fallback:** Playwright binaries (install command above); GitHub remote (workflow dormant until pushed).

## Security Domain

> security_enforcement: true, ASVS Level 1 (config). Phase 1 is client-only with mocked services — several categories are structurally N/A but are answered explicitly.

### Applicable ASVS Categories

| ASVS Category         | Applies                       | Standard Control                                                                                                                                                                        |
| --------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V2 Authentication     | no                            | Anonymous drafts are an explicit anti-feature decision (no registration wall)                                                                                                           |
| V3 Session Management | no (server) / partial (local) | Draft expiry concept in envelope (`savedAt`); no server sessions exist                                                                                                                  |
| V4 Access Control     | no                            | Single-user local data; origin-scoped storage is the boundary                                                                                                                           |
| V5 Input Validation   | yes                           | Machine events carry typed payloads; persisted-envelope validation before `createActor` (schemaVersion gate); React auto-escaping; forbid `dangerouslySetInnerHTML` via lint convention |
| V6 Cryptography       | yes (minor)                   | Reference-number generation belongs to Phase 5 and MUST use `crypto.getRandomValues()` (CSPRNG) — prototype's `Math.random()` is a documented flaw to correct; no crypto otherwise      |
| V14 Data Protection   | yes                           | Personal data stays client-side (PRD trust messaging); no third-party scripts; secrets: none exist this phase                                                                           |

### Known Threat Patterns for this stack

| Pattern                                                    | STRIDE                   | Standard Mitigation                                                                                          |
| ---------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| XSS exfiltrating localStorage drafts                       | Information Disclosure   | React escaping; no `dangerouslySetInnerHTML`; CSP headers deferred to PWA/hardening phase (note for Phase 6) |
| Malformed persisted snapshot → prototype pollution / crash | Tampering                | Validate envelope shape + schemaVersion before restore; discard invalid drafts safely (Pitfall 2)            |
| Guessable reference numbers (future)                       | Spoofing                 | CSPRNG via `crypto.getRandomValues()` — record decision now for Phase 5 implementer                          |
| Quota/eviction data loss framed as silent failure          | Denial of Service (data) | Honest error surfacing + `navigator.storage.persist()` + trust copy (SC #3 honesty clause)                   |

## Sources

### Primary (HIGH confidence)

- Context7 `/statelyai/docs` — persistence (`getPersistedSnapshot`, `createActor {snapshot}`), `@xstate/react` (`createActorContext`, `useSelector`, `useActorRef`)
- Context7 `/tailwindlabs/tailwindcss.com` — `@theme` tokens, `--color-*`/`--spacing-*` namespaces, var() usage in custom CSS
- Context7 `/jakearchibald/idb-keyval` — `set/get/del/keys/createStore`, structured-clonable values (Blob example), tx-completion durability, multi-store limitation
- Context7 `/i18next/react-i18next` + `/i18next/i18next` — init/LanguageDetector/initReactI18next, namespace lazy-loading internals, `useSuspense` behavior, `CustomTypeOptions` augmentation
- Context7 `/fontsource/fontsource` — subset/weight CSS import paths, unicode-range default behavior, variable-font limitation
- Live npm registry (2026-08-25) — every version in Standard Stack verified via `npm view`; peer ranges read for typescript-eslint and vitest-axe; create-vite 9.2.0 tarball inspected for template pins (typescript ~6.0.2, oxlint default)
- developer.chrome.com Page Lifecycle API + MDN `pagehide` event — unload deprecation, visibilitychange-as-last-reliable-save, bfcache interactions
- visarethink/indian_visa_prd.md §2/§4/§5 — guided-journey principles, authoritative mock inventory table (scope cap), journey/validation behaviors
- visarethink/visa_prototype.jsx — passport regex `^[A-Z]{2}\d{7}$`, phone digits-only ≤12, email regex, fee constants (₹5,000 gov + ₹1,500 platform + per-visa processing), stage-progress pattern (behavioral reference only)

### Secondary (MEDIUM confidence)

- WebSearch (cross-corroborated): vitest-axe README/npm (jsdom requirement, extend-expect setup, configureAxe region-rule pattern; 597K dl/wk); jest-axe 11 currency; ESLint flat-config composition idioms (tseslint.config, flatConfigs.recommended, eslint-config-prettier-last, plugin-prettier discouraged); husky v9 init flow + lint-staged config shapes (multiple mutually consistent 2025–2026 guides incl. official lint-staged repo); GH Actions Playwright patterns (--with-deps necessity, ms-playwright cache keying, artifact-if-cancelled) across three independent guides
- .planning/research/SUMMARY.md — risk register (autosave theater protocol, a11y-as-final-pass, font budgets, mock cap, TS7-eslint caveat, vite-plugin-pwa peer-range note), derive-don't-persist architecture, ports-and-adapters latency norms

### Tertiary (LOW confidence)

- Exact byte size of each Noto script subset (budget directionally sound from SUMMARY; measure at build)
- Canvas compression quality/scale heuristics (standard practice; tune empirically)

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — every version read from live registry this session; compat-critical peers read explicitly; scaffold template inspected directly
- Architecture: HIGH — XState persistence + Tailwind @theme + idb-keyval from official docs; lifecycle-flush rationale from Chrome/MDN primaries; locked decisions leave little architectural latitude
- Pitfalls: HIGH — top risks carried forward from project research (HIGH-rated) and re-grounded this session; toolchain traps discovered via live peer-range inspection
- Tooling recipes (husky/ESLint/CI YAML): MEDIUM — multi-source corroborated but not executed in this session; first-execution smoke expected

**Research date:** 2026-08-25
**Valid until:** 2026-09-24 (stable domain; i18next/eslint majors move fast — re-verify peers if planning slips past date)
