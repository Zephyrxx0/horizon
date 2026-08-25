# Phase 1: Foundation, Design System & Persistence Engine - Pattern Map

**Mapped:** 2026-08-25
**Files analyzed:** ~57 files (grouped into 15 units below)
**Analogs found:** 0 true codebase analogs / 57 files — **GREENFIELD REPO**

> **Greenfield reality:** This repo contains zero application source code. A repo-wide glob for
> `*.{ts,tsx,js,jsx,css,json,yml,yaml}` returns exactly one hit: `visarethink/visa_prototype.jsx`
> (888 lines), which is explicitly _reference material, not code to port_ (CONTEXT.md `<canonical_refs>`).
> There are no controllers, services, components, or configs to copy structure from. This phase
> _establishes_ the patterns all later phases inherit (CONTEXT.md `<code_context>`).
>
> Therefore every file below maps to one of two reference sources, and match quality uses
> two greenfield-specific grades instead of exact/role-match:
>
> - **`reference-behavioral`** — concrete excerpt from `visa_prototype.jsx`; copy _behavior/logic_, never JSX/classes verbatim
> - **`pattern-research`** — verified mechanism from official docs, embedded in `01-RESEARCH.md` Patterns 1–5 / Code Examples; planner lifts these as-is
>
> Downstream agents MUST also read CONTEXT.md's Canonical References before planning.

## File Classification

| New/Modified File(s)                                                       | Role                              | Data Flow                                    | Closest Available Reference                                                                     | Match Quality                           |
| -------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------- |
| Scaffold: `index.html`, `vite.config.ts`, `tsconfig*.json`, `package.json` | config                            | build                                        | create-vite 9.2.0 react-ts template (external; pins TS ~6.0.2)                                  | pattern-research                        |
| `.gitignore` (new; replaces stray `.gitingore`)                            | config                            | file-I/O                                     | none — trivial                                                                                  | none needed                             |
| `eslint.config.js`                                                         | config (lint)                     | build                                        | RESEARCH.md Pitfall 8 flat-config recipe                                                        | pattern-research                        |
| `vitest.config.ts` + `vitest.setup.ts`                                     | config (test)                     | build                                        | RESEARCH.md Pattern 5 setup (jsdom REQUIRED)                                                    | pattern-research                        |
| `playwright.config.ts`                                                     | config (E2E)                      | request-response                             | RESEARCH.md D-12 (device projects + future 3G throttle)                                         | pattern-research                        |
| `.github/workflows/ci.yml`                                                 | config (CI)                       | batch                                        | RESEARCH.md Code Example: GH Actions skeleton                                                   | pattern-research                        |
| `src/main.tsx`                                                             | entry/bootstrap                   | event-driven (rehydrate→providers)           | RESEARCH.md primary trace: load envelope → validate → `createActor(machine,{snapshot})` → start | pattern-research                        |
| `src/App.tsx`                                                              | component (root shell)            | request-response                             | prototype layout skeleton (lines 314–435), composition order only                               | reference-behavioral (weak)             |
| `src/styles/theme.css`                                                     | design tokens                     | transform (build-time CSS)                   | RESEARCH.md Pattern 3 (`@theme` token block)                                                    | pattern-research                        |
| `src/components/ui/*` (10 components + `*.test.tsx` each)                  | component                         | request-response (input → dispatched events) | prototype field/radio-card excerpts below + RESEARCH Pattern 5 axe gate                         | reference-behavioral + pattern-research |
| `src/components/SaveIndicator.tsx`                                         | component                         | pub-sub (projection of save-state)           | RESEARCH.md Code Example: `SaveState` union rendered verbatim                                   | pattern-research                        |
| `src/features/wizard/machine.ts`                                           | store/state-machine               | event-driven                                 | RESEARCH.md Pattern 1 (XState v5 `setup().createMachine`)                                       | pattern-research                        |
| `src/features/wizard/selectors.ts`                                         | utility (pure fns)                | transform                                    | prototype `validateStage()` rules (lines 77–116) recast as derivations                          | reference-behavioral                    |
| `src/features/wizard/demo/*` (throwaway demo + test)                       | component (harness)               | event-driven                                 | prototype stage composition + nav gating (lines 295–435)                                        | reference-behavioral                    |
| `src/services/types.ts`                                                    | model (typed ports)               | request-response                             | RESEARCH.md Pattern 4 interfaces + PRD §4 table (lines 130–141)                                 | pattern-research + PRD scope cap        |
| `src/services/index.ts`                                                    | provider/factory (THE swap point) | request-response                             | RESEARCH.md Pattern 4 `getService<T>()`                                                         | pattern-research                        |
| `src/services/mock/*` (5 adapters + `scenarios.ts`)                        | service (adapters)                | request-response (simulated async)           | prototype mock-submit pattern (lines 158–178); PRD §4 behaviors                                 | reference-behavioral                    |
| `src/persistence/answers.ts`                                               | service (persistence)             | CRUD (sync localStorage)                     | RESEARCH.md Pattern 2 `saveAnswersEnvelope` excerpt                                             | pattern-research                        |
| `src/persistence/documents.ts`                                             | service (persistence)             | CRUD async + file-I/O                        | RESEARCH.md Code Example: idb-keyval `createStore/set/get/del`                                  | pattern-research                        |
| `src/persistence/compress.ts`                                              | utility                           | transform (Blob→Blob via canvas)             | RESEARCH.md Code Example: `compressToBudget`                                                    | pattern-research                        |
| `src/persistence/autosave.ts`                                              | middleware/controller             | event-driven (lifecycle)                     | RESEARCH.md Pattern 2 `installAutosave` (visibilitychange/pagehide ONLY)                        | pattern-research                        |
| `src/i18n/index.ts` + `i18next.d.ts`                                       | provider + types                  | event-driven (languageChanged)               | RESEARCH.md Code Examples: init + `CustomTypeOptions` augmentation                              | pattern-research                        |
| `src/i18n/locales/en/{common,wizard}.json`                                 | model/content                     | n/a                                          | prototype user-facing strings as EN seed copy                                                   | reference-behavioral                    |
| `src/fonts.ts`                                                             | utility/loader                    | streaming (dynamic import per script)        | RESEARCH.md Code Example: `SCRIPT_CSS` dynamic loader                                           | pattern-research                        |
| `tests/e2e/smoke.spec.ts`                                                  | test (E2E)                        | request-response                             | RESEARCH.md Pitfall 1 kill-the-tab protocol                                                     | pattern-research                        |

## Pattern Assignments

### Group A: Wizard state machine — `src/features/wizard/machine.ts` (store, event-driven)

**Reference source:** RESEARCH.md Pattern 1 (XState v5 official docs, verified). No codebase analog exists.

**Core pattern to copy** (RESEARCH.md Pattern 1, verbatim starting point):

```typescript
import { setup, createActor } from 'xstate';

export const wizardMachine = setup({
  types: {} as {
    context: { answers: Record<string, unknown>; currentStepId: StepId };
    events:
      | { type: 'ANSWER_CHANGED'; fieldId: string; value: unknown }
      | { type: 'GOTO'; stepId: StepId };
  },
  actions: {
    setAnswer: assign(({ context, event }) =>
      event.type === 'ANSWER_CHANGED'
        ? { answers: { ...context.answers, [event.fieldId]: event.value } }
        : {},
    ),
  },
}).createMachine({/* ... */});
```

**Persistence round-trip** (same source):

```typescript
const snapshot = actorRef.getPersistedSnapshot(); // plain JSON
saveAnswersEnvelope({ schemaVersion: 1, savedAt: Date.now(), snapshot });

const env = loadAnswersEnvelope(); // validate schemaVersion!
const actor = createActor(wizardMachine, env ? { snapshot: env.snapshot } : undefined);
actor.start();
```

**Behavioral constraints from prototype** (what the machine replaces):

- Flat form state (lines 11–24: `destinationCountry, visaType, firstName, lastName, email,
phone, passportNumber, passportExpiry, dateOfBirth, documents[], paymentMethod`) is the seed
  for `context.answers` keys.
- Navigation gating (`handleNext`, lines 119–125: advance only when `validateStage()` passes)
  becomes `GOTO` transitions guarded by selector-derived completeness — statuses stay derived,
  never stored (STATE-01).
- Stage metadata with time estimates (lines 190–196: `{ name, duration }`, e.g.
  `'Personal Info', '3 min'`; "~N min remaining" projection at line 357) ports as a wizard
  config constant consumed by selectors — not machine context.
- **Do NOT carry over:** `useState`/`setCurrentStage(n)` mutation style; `documents[]` inside
  form state (blobs belong to IndexedDB — context holds metadata only); `Math.random()`
  reference generation (line 162 → Phase 5 uses `crypto.getRandomValues()` per RESEARCH.md
  Security Domain).

---

### Group B: Derived step-status selectors — `src/features/wizard/selectors.ts` (utility, transform)

**Reference source:** `visarethink/visa_prototype.jsx` `validateStage()` lines 77–116 — the authoritative business-rule list. Recast from imperative error-collection into pure predicates over `context.answers`.

**Validation rules to port as typed predicates** (exact logic):

```jsx
// email regex (line 89)
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';

// phone (lines 90-91) — min enforced at validate; max clamped at input (Group C)
if (formData.phone.length < 10) newErrors.phone = 'Phone must be 10+ digits';

// passport format AA1234567 (lines 93-95) — whitespace stripped before test
if (!/^[A-Z]{2}\d{7}$/.test(formData.passportNumber.replace(/\s/g, ''))) {
  newErrors.passportNumber = 'Invalid format. Use: AA1234567';
}

// passport expiry ≥ 6 months ahead (lines 97-102)
const sixMonthsAhead = new Date();
sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6);
if (new Date(formData.passportExpiry) < sixMonthsAhead) {
  /* invalid */
}

// required-field checks per stage: stage 0 lines 80-83, stage 1 lines 86-96/103,
// documents line 107, payment method line 111
```

**Derivation contract (STATE-01):** `deriveStepStatuses(answers)` returns per-step status
computed fresh on every read. Editing an earlier answer automatically invalidates downstream
steps because nothing is cached (SC #5 falls out of this). Never persist selector output.

---

### Group C: Input normalization utils — feed ui/Input + wizard events

**Reference source:** prototype handlers. Port logic into typed utils called in component
`onChange` before dispatching `ANSWER_CHANGED`.

Phone digits-only clamp (lines 580–584):

```jsx
let value = e.target.value.replace(/\D/g, '');
if (value.length > 12) value = value.slice(0, 12);
```

Passport auto-format (fn at lines 181–183, wired at input lines 599–601):

```jsx
value.replace(/\s/g, '').toUpperCase().slice(0, 9);
```

Clear-this-field's-error-on-edit behavior (lines 70–73): an edit event clears that field's
error slice — maps naturally to machine event handling.

---

### Group D: UI component library — `src/components/ui/*` (component, request-response)

**Reference sources:** prototype excerpts below for structure/behavior; RESEARCH.md Pattern 3
(tokens) + Pattern 5 (axe gate) for implementation. Every component gets a `*.test.tsx` with an
axe assertion (D-08).

**RadioCard** — radio-inside-label pattern (lines 477–489; identical payment-method list at
750–762) is the behavioral spec:

```jsx
<label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition">
  <input
    type="radio"
    name="visaType"
    value={visa}
    checked={formData.visaType === visa}
    onChange={handleInputChange}
  />
  <span className="font-medium">{visa}</span>
</label>
```

Upgrade requirements: visually-hidden native input, `:focus-visible` ring token, 48px min
height (`--spacing-touch`), selected state from tokens — never ad-hoc blue classes.

**FieldLabel/Hint/Error** — prototype per-field anatomy (label + input + conditional error
span, lines 527–539; hint-text variants at lines 570, 607, 622) defines the visual contract.
The prototype is NOT accessible (plain `<div>`/`<span>` errors, no `aria-*` on inputs) — the
new components must add: `htmlFor`/`id` pairing, `aria-describedby` → hint+error ids,
`aria-live="polite"` (or `role="alert"`) on error region, and `aria-invalid` toggling
(FOUND-03; RESEARCH.md Pattern 5 backs this with the axe gate).

**ProgressStepper** — behavioral spec is prototype's progress block (lines 350–373):
`Stage {n} of {total}` label (line 354), "~{sum of remaining stage durations} min remaining"
(lines 356–358), segmented bar with completed/current/upcoming states (`bg-green-500` /
`bg-blue-500` / `bg-gray-200`, lines 363–367), per-segment name labels (line 368).
Rebuild with `aria-current="step"` on active segment, token colors, and status text announced
via visually-hidden live region. Stage names/durations seed data comes from lines 190–196.

**Button** — prototype's three button intents map to variants: primary action
(`w-full bg-blue-600 ... py-3 px-6`, lines 238–243, 392–398), secondary/neutral
(`bg-gray-200 hover:bg-gray-300`, lines 244–249, 384–391), destructive/remove
(`text-red-600`, line 688–693). Loading state pattern: disabled + spinner + "Submitting…"
(lines 401–416). All rebuilt at 48px targets with indigo/saffron tokens (D-07).

**Input/Select** — full-width bordered field with error-state border/background swap
(lines 450–462 select, 529–538 input): error ⇒ red border + red-tinted background; focus
state via tokens. Keep placeholder-with-example convention ("E.g., Rajesh", "AA1234567").

**Card / Modal-sheet / Toast / Checkbox** — no direct prototype analog for modal/toast;
use RESEARCH.md D-06 inventory definitions + standard accessible implementations
(focus trap + Escape + return-focus for Modal; `aria-live` region for Toast). Prototype's
info-callout boxes (e.g., green trust notice lines 639–641, yellow doc checklist 699–707,
blue required-docs panel 500–511) are the behavioral spec for Card's informational variant.

---

### Group E: SaveIndicator — `src/components/SaveIndicator.tsx` (component, pub-sub)

**Reference source:** RESEARCH.md Code Example — the indicator renders THIS union verbatim
(SC #2 honesty requirement):

```typescript
export type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
// dirty → (debounce fires) → saving → setItem ok ? saved : error
// any edit → dirty ; flush on hide → saving → terminal state written synchronously
```

Warning signs from RESEARCH.md Pitfall 1: any code path that sets "Saved" without a completed
`setItem`; `beforeunload` anywhere in the diff.

---

### Group F: Persistence engine — `src/persistence/{answers,documents,compress,autosave}.ts`

**Reference source:** RESEARCH.md Pattern 2 + Code Examples (Chrome Page Lifecycle docs,
verified). No codebase analog exists.

**answers.ts** — sync localStorage envelope, every write wrapped:

```typescript
export function saveAnswersEnvelope(env: AnswersEnvelope): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(env));
    return true;
  } catch (e) {
    reportSaveError(e);
    /* QuotaExceededError → indicator 'error' */ return false;
  }
}
```

Envelope carries `schemaVersion` from day one; loader validates shape and discards-or-migrates
unknown versions (Pitfall 2). Validation lives in THIS module only.

**autosave.ts** — lifecycle wiring (never `unload`/`beforeunload`; async work forbidden in flush):

```typescript
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
```

10s trailing debounce separate from flush logic (RESEARCH.md Don't-Hand-Roll table).

**documents.ts** — idb-keyval dedicated store, written AT SELECTION TIME only:

```typescript
import { createStore, set, get, del } from 'idb-keyval';
const docStore = createStore('visarethink', 'documents');
export async function saveDocument(id: string, blob: Blob) {
  try {
    await set(id, blob, docStore);
  } catch (e) {
    // promise resolves on tx complete
    throw new StorageUnavailableError(e);
  } // surfaced to UI, never swallowed
}
```

**compress.ts** — iterative canvas downscale-to-budget (RESEARCH.md Code Example
`compressToBudget`, quality loop q=0.85→0.4, scale×0.8 retry) — lift verbatim as starting
point; verify visually at implementation (Assumption A1).

Prototype's related behavior: upload size check `file.size > 5 * 1024 * 1024` (line 138)
and accepted formats `.pdf,.jpg,.jpeg,.png` (line 664) — keep as pre-compression validation.

---

### Group G: Mock services — `src/services/*` (service/model, request-response)

**Reference sources:** RESEARCH.md Pattern 4 (ports-and-adapters shape) + PRD §4 mock
inventory (lines 130–141) which CAPS scope + prototype's mock-execution pattern.

**Scope lock (PRD §4 table, exactly these five ports):**

| Port                     | PRD §4 mocked behavior (lines 133–140)         |
| ------------------------ | ---------------------------------------------- |
| `IPassportLookupService` | Government database lookup — simulated success |
| `IPaymentService`        | Fake Razorpay flow                             |
| `IOtpService`            | Auto-verified with mock code                   |
| `INotificationService`   | Email notifications → console logs             |
| `ITrackingService`       | Mock status timeline                           |

(OCR/background-checks/interview-calendar appear in §4 but get NO adapters this phase unless a
Phase 2–5 consumer needs the port defined — interface definition costs minutes, systems are out
of scope. RESEARCH.md Pitfall 5: ≤~100 lines per adapter; latency randomized 800–3000ms;
outcome matrix from a plain config object.)

**Result union** (RESEARCH.md Pattern 4):

```typescript
export type ServiceOutcome<T> =
  | { status: 'success'; data: T }
  | { status: 'failure'; code: string; message: string }
  | { status: 'timeout' };
```

**Execution-shape reference from prototype** — mock submit with latency + result object
(lines 158–178): `setTimeout(..., 2000)` simulating API call returning an id and a timeline.
Generalize to scenario-driven latency instead of fixed 2000ms.

**Timeline data shape** — prototype's tracking payload (lines 165–174 and 274–281:
`{ status, date, completed }[]` with entries like `'Application Received'`,
`'Documents Under Review'`, `'Interview Scheduling'`, `'Visa Decision'`) seeds
`ITrackingService`'s return type. Timeline UI rendering spec: numbered/completed circles +
connector line (lines 853–871).

**Anti-pattern to correct:** prototype generates reference numbers via
`'VISA' + Math.random().toString(36).substr(2,9).toUpperCase()` (line 162) — documented flaw;
Phase 5 implementer must use `crypto.getRandomValues()` (RESEARCH.md Security Domain V6).

### Group H: Design tokens — `src/styles/theme.css` (utility/config, build-time transform)

**Reference source:** RESEARCH.md Pattern 3 (Tailwind v4 official docs). Replace the
prototype's stock Tailwind blues entirely (D-07).

```css
@import 'tailwindcss';

@theme {
  /* calm government-trust palette — hexes agent-discretion (D-07),
     but EVERY text/background pair must pass AA (≥4.5:1 body, ≥3:1 large/UI) */
  --color-indigo-deep: oklch(0.35 0.12 275); /* primary surfaces/buttons */
  --color-indigo-ink: oklch(0.28 0.11 275); /* body text on white */
  --color-saffron: oklch(0.78 0.15 75); /* ACCENT ONLY — fails as small-text-on-white */
  --spacing-touch: 3rem; /* 48px minimum touch target */
  --text-base: 1rem;
}
```

Prototype's layout conventions worth tokenizing: single column, `max-w-2xl mx-auto` content
(lines 200–202, 315–316), `min-h-screen` page padding `p-4 md:p-8`, card surface
`bg-white rounded-lg shadow-lg p-6 md:p-10` (lines 202, 377).

---

### Group I: i18n scaffolding — `src/i18n/*` (provider + types + content)

**Reference source:** RESEARCH.md Code Examples (i18next/react-i18next official docs):
init with lazy namespaces (`ns: ['common']` eager-only), `react.useSuspense: false`,
`changeLocale()` doing dynamic `import()` per locale chunk + persisting to localStorage +
`document.documentElement.lang = lng` (I18N-03 groundwork), and `CustomTypeOptions`
module augmentation for TS key typing. Lift both blocks from RESEARCH.md.

**EN seed copy from prototype** (reference-behavioral): user-facing strings become EN locale
keys — landing hero ("Indian Visa Service Portal", "Simple. Clear. Mobile-First.", lines
205–210), value props (lines 217–233), stage headings/subheads (442–443, 523–524, 651–652,
719–720, 780–781), field labels+hints (528–636), validation messages (Group B excerpts),
cost-breakdown labels (726–744), trust copy (639–641, 769), confirmation copy (838–847).
Rewrite through i18n keys; do not hardcode in components.

Language switcher (D-11): header control live now; untranslated locales render English copy
with visible "translation coming" state.

---

### Group J: Fonts — `src/fonts.ts` (utility/loader, streaming)

**Reference source:** RESEARCH.md Code Example — eager latin base + dynamic per-script import:

```typescript
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

Locales per PRD §6.9 (lines 303): Hindi, Tamil, Telugu, Kannada, Marathi + English.
Budget guard: CI bundle-budget assertion (~30–80KB/script); warning sign of failure = all five
scripts' woff2 in initial chunk list.

---

### Group K: Tooling & CI configs

**Reference sources:** RESEARCH.md recipes — all pattern-research:

- **eslint.config.js** (Pitfall 8): flat config via `tseslint.config(...)` helper;
  `jsxA11y.flatConfigs.recommended` + `reactHooksPlugin.configs.flat.recommended` +
  `eslint-config-prettier` LAST. Warning signs: `.eslintrc.*` files existing;
  `@typescript-eslint/parser` installed separately. Replace template oxlint entirely.
- **vitest.config.ts/setup** (Pattern 5 + Pitfall 3): `environment: 'jsdom'` mandatory
  (happy-dom breaks axe); setup imports `@testing-library/jest-dom/vitest`,
  `expect.extend(matchers)`, `configureAxe({ globalOptions: { rules: [{ id: 'region', enabled: false }] } })`.
- **playwright.config.ts**: smoke project now; Pixel-class device projects + 3G throttle
  profiles are Phase-6-facing groundwork for PERF-01.
- **ci.yml** (Code Example skeleton): pnpm/action-setup@v4 → setup-node@v4 (node 22,
  cache pnpm) → `pnpm install --frozen-lockfile` → typecheck/lint/vitest → Playwright job with
  MANDATORY `pnpm exec playwright install --with-deps chromium` (top runner failure cause)
  - artifact upload `if: ${{ !cancelled() }}`. Repo has NO remote yet — workflow is dormant
    until push (author it anyway, D-14).
- **husky/lint-staged** (Pitfall 8): `pnpm exec husky init` once; hook file contains just the
  lint-staged invocation — no v8-era shebang/`husky.sh` sourcing.

---

## Shared Patterns

### S1. Field-validation rule set (single source of truth)

**Source:** prototype lines 77–116 (exact regexes/logic in Group B)
**Apply to:** selectors.ts predicates, ui/Input error display, demo wizard gating, EN locale
validation messages. Keep regexes in ONE typed module; never re-inline them per component.

### S2. Fee constants & cost breakdown structure

**Source:** prototype lines 42–61

```jsx
const platformFee = 1500; // ₹1,500 platform fee
const governmentFee = 5000; // ₹5,000 government fee
// per-visa processing fee lookup by visaType (visaPricing map, lines 43-58)
const totalCost = visaFee + governmentFee + platformFee; // line 187
```

Display order (PRD §5 Stage 4, lines 198–208; UI at prototype 726–744): Visa Processing Fee →
Government Fee → Platform Fee → divider → Total. Format rupees with `toLocaleString()`.
**Known defect in prototype pricing map — do not port:** duplicate object keys
`'Tourist Visa': 6500` (line 47) vs `'Tourist Visa': 5000` (line 53) silently collide because
keys ignore country. Type pricing as `(country, visaType) → fee` pairs.
**Apply to:** services/types.ts result payloads, future Phase-4 payment UI, i18n interpolation
(₹ formatting via i18next Intl integration).

### S3. Mock adapter execution shape

**Source:** prototype lines 158–178 (setTimeout latency + structured result) generalized per
RESEARCH.md Pattern 4 scenario config
**Apply to:** all five mock adapters uniformly — one shared latency/outcome engine in
`mock/scenarios.ts`, adapters stay thin.

### S4. Error-display anatomy upgraded to a11y contract

**Source:** prototype visual pattern (error span under field, lines 463–468, 539, 606) +
FOUND-03 requirements
**Apply to:** every ui form component. Visual: error text + icon below field. Required
additions: `aria-describedby` wiring, live-region announcement, `aria-invalid`,
error-clears-on-edit (prototype lines 70–73 behavior).

### S5. Honest save pipeline

**Source:** RESEARCH.md Pattern 2 + SaveState union + Pitfall 1 protocol
**Apply to:** autosave.ts + SaveIndicator.tsx + main.tsx bootstrap as one unit; E2E asserts
the kill-the-tab path (type → close without waiting → relaunch → restored).

### S6. Derived-don't-persist discipline

**Source:** STATE-01 wording + RESEARCH.md anti-pattern #1
**Apply to:** machine context (JSON-serializable answers+stepId only), persistence envelope
(schemaVersion/savedAt/snapshot only), selectors recomputed on load.

---

## Anti-Patterns Found in Reference Material (do NOT port)

| Prototype defect                   | Location                  | Correction                                                          |
| ---------------------------------- | ------------------------- | ------------------------------------------------------------------- |
| `Math.random()` reference numbers  | line 162                  | `crypto.getRandomValues()` (Phase 5; record decision now)           |
| Duplicate pricing keys             | lines 47/53               | keyed `(country, visaType)` tuples                                  |
| No aria attributes on any input    | throughout Stages 0–3     | FOUND-03 a11y contract (S4)                                         |
| Stock Tailwind blue palette        | e.g., lines 200, 240, 455 | indigo/saffron tokens (D-07, Pattern H)                             |
| Documents array inside React state | lines 21, 142–146         | blobs→IndexedDB at selection time; metadata only in machine context |
| Fixed 2000ms mock delay            | line 177                  | randomized 800–3000ms scenario latency                              |
| No persistence whatsoever          | entire file               | full autosave engine (Groups E/F) is this phase's core deliverable  |

## No Analog Found

| File group       | Role | Data Flow | Reason                                                                                                                                                                                                                                                  |
| ---------------- | ---- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ALL groups above | —    | —         | Greenfield repo: zero application source exists. Every mapping resolves to (a) the behavioral prototype or (b) verified research patterns — there are no same-role codebase files to imitate. This phase ESTABLISHES the conventions later phases copy. |

Planner instruction: where this document defers to RESEARCH.md, lift the cited Pattern/Code
Example verbatim as the task starting point; where it cites prototype lines, port logic and
behavior into typed modules — never JSX or class strings.

## Metadata

**Analog search scope:** repo root recursive glob `*.{ts,tsx,js,jsx,css,json,yml,yaml}`;
`visarethink/` (4 files); `.planning/` artifacts; confirmed no AGENTS.md / project skills dirs at root
**Files scanned:** 888-line prototype (full read), 425-line PRD (full read), CONTEXT.md, RESEARCH.md (both full reads)
**True code analogs found:** 0 (greenfield)
**Behavioral references extracted:** 12 excerpt clusters from `visa_prototype.jsx`; 8 verified research patterns cross-referenced from `01-RESEARCH.md`
**Pattern extraction date:** 2026-08-25
