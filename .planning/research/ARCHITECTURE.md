# Architecture Research

**Domain:** Guided multi-step visa application portal (mobile-first, frontend-heavy, all backend services mocked client-side)
**Researched:** 2026-08-25
**Confidence:** HIGH

## Standard Architecture

The consensus across current sources (2025–2026) is unambiguous: **a multi-step guided application is a state machine whose UI happens to render fields — not a form with pagination.** Every major failure mode of wizard apps (lost data on Back, resumes landing on wrong steps, contradictory submissions after editing earlier answers) traces to treating steps as pages instead of states derived from answers. The second consensus: **answers are the only persisted truth; everything else (step completion, progress %, reachable path) is recomputed on load.**

Because this project is frontend-centric with every backend mocked, the classic three-tier stack collapses into one client-side app — but the _service boundaries_ from the PRD §8 diagram should be preserved as interfaces so real integrations can drop in later without touching UI code.

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  ROUTING / SHELL LAYER  (Next.js App Router)                          │
│  ┌──────────────┐  ┌───────────────────┐  ┌────────────────────┐     │
│  │ Home / Start │  │ /apply/[step]     │  │ /track?ref=…       │     │
│  │ page         │  │ wizard routes     │  │ status lookup      │     │
│  └──────────────┘  │ guarded by        │  └────────────────────┘     │
│  ┌──────────────┐  │ StepGuard         │  ┌────────────────────┐     │
│  │ apply/layout │  └───────────────────┘  │ /~offline fallback │     │
│  │ (persistent) │                         └────────────────────┘     │
│  └──────────────┘                                                     │
├──────────────────────────────────────────────────────────────────────┤
│  FEATURE / UI LAYER                                                   │
│  ┌─────────────────┐ ┌──────────────┐ ┌──────────────────────────┐   │
│  │ WizardOrchestr. │ │ Step screens │ │ Design-system primitives │   │
│  │ progress, guard │ │ (stage 1..5) │ │ 48px targets, a11y baked │   │
│  └─────────────────┘ └──────────────┘ └──────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  STATE LAYER                                                          │
│  ┌────────────────────────┐  ┌──────────────────────────────────┐    │
│  │ applicationStore       │  │ uiStore (locale, toasts, online) │    │
│  │ (answers, submission)  │  │ trackingStore (status timeline)  │    │
│  └───────────┬────────────┘  └──────────────────────────────────┘    │
│              │ zustand persist → localStorage (debounced, versioned) │
├──────────────┴───────────────────────────────────────────────────────┤
│  SERVICE ABSTRACTION LAYER  (ports & adapters — all mocks today)      │
│  ┌─────────┐ ┌─────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌────────┐ │
│  │Payment  │ │Otp  │ │Passport │ │Document  │ │Notify   │ │Tracking│ │
│  │Service  │ │Svc  │ │Lookup   │ │Store(idb)│ │(console)│ │(timeline)│
│  └─────────┘ └─────┘ └─────────┘ └──────────┘ └─────────┘ └────────┘ │
├──────────────────────────────────────────────────────────────────────┤
│  PERSISTENCE LAYER                                                    │
│  ┌──────────────────────┐  ┌─────────────────────────────────────┐   │
│  │ localStorage         │  │ IndexedDB (idb wrapper)             │   │
│  │ answers JSON, backup │  │ File/Blob uploads + doc metadata    │   │
│  │ codes, prefs         │  │                                     │   │
│  └──────────────────────┘  └─────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│  PLATFORM: Serwist service worker · next-intl (cookie locale) · PWA   │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component                                        | Responsibility                                                                                                                                                                                                             | Typical Implementation                                                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wizard shell layout** (`app/apply/layout.tsx`) | Persistent chrome across step routes: progress header, time estimate, language switcher. Never unmounts while user moves between steps.                                                                                    | App Router layout (client component wrapper); stays mounted across child navigations                                                         |
| **StepGuard**                                    | Treats the URL step id as _untrusted input_: if that step is not reachable given recomputed answers, redirect to first incomplete step. Single place enforcing "a step is reachable only if every prior step is complete." | Client component or `redirect()` in each step page; pure function over store state                                                           |
| **Wizard machine** (`useWizardMachine`)          | Pure reducer over answers: derives path, per-step status (`locked / available / complete / stale`), handles PATCH/NEXT/BACK/GOTO/SUBMIT intents. No network, no React.                                                     | Plain TypeScript reducer + Zustand actions wrapping it; unit-testable as a pure function                                                     |
| **Step screens** (5 stages)                      | Render fields for one stage via a local react-hook-form instance seeded from the store; validate slice with zod on advance; emit one PATCH to the machine.                                                                 | Per-route client components; uncontrolled inputs (RHF) to minimize re-renders on budget phones                                               |
| **Design-system primitives**                     | Buttons, inputs, progress stepper, upload tile, timeline, tooltip/help — all ≥48px targets, WCAG 2.1 AA contrast, screen-reader labeled.                                                                                   | shadcn/ui customized with mobile-first tokens; single-column layouts enforced at primitive level                                             |
| **applicationStore**                             | Single source of truth for application answers + submission state. Persisted.                                                                                                                                              | Zustand + persist middleware; `partialize` persists answers only; `version` + `migrate` for schema evolution; `skipHydration` for SSR safety |
| **Validation schemas** (`lib/validation`)        | One zod schema per step + a composed full-schema used at final submit for cross-step rules (e.g., documents required only for chosen visa type).                                                                           | zod; schemas keyed by step id, consumed by RHF resolver and by resume-replay logic                                                           |
| **Mock service layer** (`lib/services`)          | Interfaces (ports) + mock implementations (adapters) for payment, OTP, passport lookup, notifications, tracking, document storage. Simulated latency + realistic payloads.                                                 | TypeScript interfaces; `getService()` factory returns mock today, real impl later; mocks live beside interfaces, never inside components     |
| **Draft persistence**                            | Debounced auto-save (~500ms debounce + flush on step change & `visibilitychange`; PRD's "~10s" satisfied), resume-code backup snapshots, draft expiry (~7 days), clear-on-submit.                                          | Thin module over zustand persist + raw localStorage; every storage access wrapped in try/catch (private mode/quota throw)                    |
| **Document store**                               | Holds uploaded File/Blob objects + metadata (name, size, mime, doc-type). Async, non-blocking.                                                                                                                             | IndexedDB via `idb` promise wrapper; File blobs stored directly (structured clone), metadata in parallel record                              |
| **i18n layer**                                   | Locale selection without URL prefixes (cookie-based), message loading, ICU plurals for 6 locales.                                                                                                                          | next-intl `getRequestConfig` reading cookie; `messages/{en,hi,ta,te,kn,mr}.json` namespaced per feature                                      |
| **Service worker**                               | Precache app shell, offline navigation fallback, runtime caching.                                                                                                                                                          | Serwist (`@serwist/next`): `swSrc: app/sw.ts`, `swDest: public/sw.js`, `/~offline` precached fallback                                        |

**Boundary rule of thumb:** UI components may talk to stores and services; services never import UI; stores never import step components; the wizard machine imports nothing but types and validators.

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # root layout: fonts, NextIntlClientProvider, SW register
│   ├── page.tsx                # home: start / continue application entry
│   ├── apply/
│   │   ├── layout.tsx          # wizard shell (persistent): progress header + StepGuard
│   │   ├── [step]/page.tsx     # one route per stage; step id validated against machine
│   │   └── resume/page.tsx     # enter backup code to restore draft
│   ├── track/
│   │   └── page.tsx            # status by reference number (?ref=…)
│   └── ~offline/page.tsx       # static offline fallback (precached by Serwist)
├── components/
│   └── ui/                     # design-system primitives (button, input, stepper,
│                               #   upload-tile, timeline, help-tooltip) — 48px targets
├── features/
│   ├── wizard/
│   │   ├── machine.ts          # pure reducer: path, statuses, transitions
│   │   ├── steps.ts            # step definitions: id, schema ref, visibility fn
│   │   └── ProgressHeader.tsx
│   ├── steps/
│   │   ├── visa-type/          # stage 1 composites
│   │   ├── personal-details/   # stage 2 (+ formatters usage)
│   │   ├── documents/          # stage 3 (upload tiles → document store)
│   │   ├── payment/            # stage 4 (mock gateway UI flow)
│   │   └── confirmation/       # stage 5 (reference no., timeline)
│   └── tracking/               # timeline display + mock status simulation
├── lib/
│   ├── stores/
│   │   ├── application-store.ts   # zustand + persist (answers only)
│   │   ├── tracking-store.ts
│   │   └── ui-store.ts            # locale cookie helper, online status, toasts
│   ├── validation/
│   │   ├── schemas/               # visaType.ts personalDetails.ts … one zod per step
│   │   └── full-schema.ts         # composed cross-step schema for final submit
│   ├── services/
│   │   ├── types.ts               # interfaces: IPaymentService, IOtpService, …
│   │   ├── mock/
│   │   │   ├── payment.ts         # fake Razorpay flow, latency simulation
│   │   │   ├── otp.ts             # accepts fixed mock code
│   │   │   ├── passport-lookup.ts # simulated success after delay
│   │   │   ├── notifications.ts   # console.log per PRD §4
│   │   │   └── tracking.ts        # deterministic timeline from submittedAt
│   │   └── index.ts               # getService<T>() factory (swap point)
│   ├── persistence/
│   │   ├── draft.ts               # debounced save, backup codes, expiry, clear-on-submit
│   │   └── documents-db.ts        # IndexedDB via idb: files + metadata
│   ├── format/
│   │   ├── passport.ts            # AA1234567 normalizer
│   │   ├── phone.ts               # +91 prefix formatter
│   │   └── currency.ts            # ₹ itemization (Intl.NumberFormat)
│   └── i18n/
│       ├── request.ts             # getRequestConfig: locale from cookie
│       └── routing.ts             # defineRouting({ localePrefix: 'never' })
├── messages/
│   ├── en.json  hi.json  ta.json  te.json  kn.json  mr.json
└── sw.ts                          # Serwist worker source
```

### Structure Rationale

- **`app/apply/[step]` step-per-route:** URL always answers "where am I?" (a PRD core goal); browser Back/Forward/refresh behave as users expect; each stage gets code-split automatically. Cost: the URL step must be guarded as untrusted input — that is StepGuard's job.
- **`features/` over `components/` for stage logic:** stage screens are product features with validation and store coupling; `components/ui/` stays generic and reusable. This keeps the design system portable and stage logic testable without rendering the whole app.
- **`lib/services/types.ts` + `mock/`:** the seam between "what the app needs" and "what exists today." Components import interfaces via `getService()`; swapping in a real Razorpay/Twilio client later is a factory change plus one new adapter file — zero component edits.
- **`messages/` flat JSON per locale:** next-intl convention; namespacing keys by feature (`visaType.title`, `payment.total`) lets translators work per-stage and lets bundles lazy-load later if needed.

## Architectural Patterns

### Pattern 1: Wizard as a Pure State Machine over Answers (derive, don't persist)

**What:** Step statuses (`locked/available/complete/stale`), the reachable path, and progress % are _computed_ from the answers by a pure function — never stored. Editing an earlier answer marks later dependent steps `stale`: values are kept, but "complete" is revoked so they get re-reviewed. Submission stays outside the reducer.
**When to use:** Always for this project — steps are conditional on visa type (progressive disclosure), users navigate backwards, and drafts survive reloads. All three conditions hold.
**Trade-offs:** Slightly more up-front design than a `currentStep` index; in exchange, resume bugs ("landed on step 4 with step 2 empty") become structurally impossible, and the machine is unit-testable without React.

**Example:**

```typescript
// features/wizard/machine.ts — pure, no React, no network
type StepPhase = 'locked' | 'available' | 'complete' | 'stale';

const path = (answers: Answers): string[] =>
  // pure fn of answers
  STEP_DEFS.filter((s) => s.isVisible?.(answers) ?? true).map((s) => s.id);

const computeStatuses = (answers: Answers): Record<string, StepPhase> =>
  Object.fromEntries(
    path(answers).map((id) => [
      id,
      !answers[id]
        ? 'locked'
        : schemas[id].safeParse(answers[id]).success
          ? 'complete'
          : 'available',
    ]),
  ); // replay validators on load too

// Reducer intents: PATCH (store values; revoke 'complete' → 'stale' downstream),
// NEXT (validate current slice first), BACK, GOTO (only if reachable), SUBMIT.
// Persist ONLY { version, savedAt, values, currentStepId-as-hint } — never statuses.
```

### Pattern 2: Step-per-Route with Persistent Shell + Untrusted URL Guard

**What:** Each stage is a real route under a layout that never unmounts during the flow. The step id in the URL is treated like any user input: StepGuard recomputes reachability from the store and redirects to the first incomplete step when the URL lies (deep link, stale bookmark, refresh mid-flow).
**When to use:** When the wizard is a top-level journey (this PRD's 5-stage application) rather than a sub-dialog. Sources are near-unanimous that URL-carried position is right for full-page wizards: Back/refresh/link-sharing behave as expected, and the PRD explicitly wants users to "always know where am I."
**Trade-offs:** Route changes tear down step component trees — any state living inside a step's `useState` dies on Next/Back. This is the #1 observed wizard failure (~70% of audited broken wizards have one of three root causes; route-teardown is one). The fix is structural: answers live in module-scope Zustand, never in step components.

**Example:**

```tsx
// app/apply/[step]/page.tsx
export default function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = use(params); // untrusted!
  const reachable = useWizardReachability(step); // derived from store
  if (!reachable) redirect(firstIncompleteStep()); // guard before render
  const Stage = STAGE_COMPONENTS[step];
  return <Stage />; // reads/writes applicationStore
}
```

### Pattern 3: Ports & Adapters Mock Service Layer

**What:** Every PRD §4 mocked concern gets a TypeScript interface (port) and a mock implementation (adapter). Components resolve services through a factory. Mocks simulate realistic latency (300–1200ms) and return typed, realistic payloads so UI states (loading, success, failure) are genuinely exercised.
**When to use:** From day one. Retrofitting an interface around hardcoded mock calls is exactly the rewrite this pattern prevents; the PRD's §8 target architecture maps 1:1 onto these ports.
**Trade-offs:** One extra indirection layer. Negligible cost vs. being unable to demo "swap in real payment" — which is the prototype's stated purpose.

**Example:**

```typescript
// lib/services/types.ts
export interface IPaymentService {
  createOrder(amount: FeeBreakdown): Promise<{ orderId: string }>;
  confirmPayment(
    orderId: string,
    method: 'upi' | 'card' | 'netbanking',
  ): Promise<{ receiptId: string; paidAt: Date }>;
}
// lib/services/index.ts — THE swap point
export const getService = {
  payment: (): IPaymentService => mockPaymentService, // ← real impl lands here
  otp: (): IOtpService => mockOtpService,
  lookup: (): IPassportLookupService => mockPassportLookup,
  notify: (): INotificationService => consoleNotificationService,
  tracking: (): ITrackingService => mockTrackingService,
};
```

### Pattern 4: Split Persistence — localStorage for Answers, IndexedDB for Files

**What:** Two storage engines with a strict split. Text answers (a few KB of JSON) go through zustand persist → localStorage with debounced writes. Uploaded documents (File/Blob objects) go straight to IndexedDB at selection time; the store keeps only metadata + an idb key. Resume codes write a snapshot copy keyed by code, simulating the "email backup" server round-trip.
**When to use:** Always here. File objects cannot be JSON-serialized into localStorage; localStorage caps at ~5MB and blocks the main thread synchronously; IndexedDB handles blobs natively with effectively unlimited quota (Chrome allows an origin up to 60% of disk).
**Trade-offs:** Two APIs to learn (mitigated by the `idb` promise wrapper). Safari evicts non-installed-PWA storage after 7 days idle — call `navigator.storage.persist()` and treat eviction as "draft expired," not a crash.

## Data Flow

### Primary Flow: Filling a Step

```
[User types] → RHF field (uncontrolled, no re-render)
      ↓ blur / change
[zod schema: format + validate slice]  →  green check / constructive error
      ↓ on advance (NEXT)
[trigger(fields) full-slice validation]
      ↓ pass
[PATCH → wizard machine reducer]  →  recompute path & statuses (derive)
      ↓
[applicationStore.setAnswers] ──→ [zustand persist] ──→ localStorage
      │                            (debounced ~500ms; flush on step change
      │                             and visibilitychange; try/catch quota)
      ↓
[router.push(next-step-id)] → StepGuard verifies reachability from store
```

### Key Data Flows

1. **Draft resume (same device):** app boot → `persist.rehydrate()` (after mount; `skipHydration` in SSR) → replay validators over restored answers → statuses recomputed → land on saved `currentStepId` _only if_ recomputed state says it's reachable, else first incomplete step. Persisted completion flags are never trusted.
2. **Resume via backup code (cross-device):** user requests code → draft snapshot serialized under `visa-rethink:backup:<CODE>` in localStorage (mocking the email round-trip; PRD's "email" notification goes through mock notify service) → on `/resume`, code entered → snapshot validated against current schemas → loaded into a fresh applicationStore. Later swap: same interface calls a real API instead of localStorage.
3. **Document upload:** file selected/captured → client-side checks (mime, size) → Blob written to IndexedDB immediately (survives offline/close) → metadata {docType, name, size, idbKey} into store → upload tile reads metadata for "✓ PDF uploaded. 2.3 MB" display. Mock OCR service reads the metadata and returns simulated "Success."
4. **Payment:** stage 4 composes itemized fees from visa catalog → `getService.payment().createOrder()` → fake gateway modal (UPI/Card/Netbanking) → `confirmPayment()` resolves after simulated latency → receipt persisted in submission record → confirmation screen + mock email/SMS via notify service.
5. **Submission → tracking:** SUBMIT validates composed full-schema (cross-step rules) → reference number generated (e.g., `VRT-2026-XXXXXX`) → draft cleared (clear-on-success is non-negotiable; surviving drafts show old answers to the next application) → trackingStore seeds a deterministic status timeline from `submittedAt` with PRD's stage durations → `/track?ref=` renders timeline; mock transitions advance over time.
6. **Locale switching:** switcher writes `locale` cookie + `router.refresh()` → server `getRequestConfig` loads `messages/<locale>.json` → `NextIntlClientProvider` re-renders tree. No URL change (keeps resume links and tracking links locale-free).
7. **Offline:** Serwist precaches shell + `/~offline`; flaky network → cached shell serves instantly, all writes already local (store/idb), online-status banner from uiStore; queued actions are unnecessary because nothing leaves the device.

### State Ownership Map

| State                          | Owner                    | Persisted?                             |
| ------------------------------ | ------------------------ | -------------------------------------- |
| Application answers            | applicationStore         | localStorage (versioned, answers-only) |
| Derived path/statuses/progress | wizard machine (pure fn) | ❌ recomputed                          |
| Current step                   | URL (hint copy in draft) | URL + hint                             |
| Uploaded files                 | IndexedDB                | ✅ blobs + metadata                    |
| Tracking timeline              | trackingStore            | localStorage post-submit               |
| Locale                         | cookie                   | ✅                                     |
| Online status, toasts          | uiStore (memory)         | ❌                                     |

## Scaling Considerations

This is a single-milestone prototype — user-count scaling is out of scope (per PROJECT.md). The axes that actually stress this architecture:

| Concern                | Prototype (now)                                                                      | If it grew toward PRD §8 production                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Form size / re-renders | Uncontrolled inputs via RHF; per-step PATCH keeps the machine off the keystroke path | Same pattern holds; no change                                                                          |
| Draft persistence      | localStorage + IndexedDB, one device + code backup                                   | Server-owned draft table becomes truth; localStorage demoted to offline cache with replay-on-reconnect |
| Documents              | IndexedDB blobs                                                                      | Presigned S3 uploads; idb keeps an upload queue for offline retry                                      |
| 6 locales              | One JSON per locale, loaded whole                                                    | Namespace-split messages, lazy-load non-active locales to protect 3G bundle budget                     |
| Mock latency realism   | Fixed simulated delays                                                               | n/a — replaced by real services at the same interfaces                                                 |

**First bottleneck (real):** main-thread jank on budget Android if steps re-render on every keystroke → prevented by RHF uncontrolled fields + memoized step components.
**Second bottleneck:** initial JS payload on 3G (6 locales × messages + wizard code) → route-level code splitting (free with step-per-route), lazy message namespaces, Serwist precache makes repeat loads instant.

## Anti-Patterns

### Anti-Pattern 1: Persisting derived state (statuses, completion flags, progress %)

**What people do:** Save `{ values, completedSteps: [...] }` so resume "just works."
**Why it's wrong:** Persisted completion was computed under old rules/paths. After any schema or visibility change, resumes land on invalid steps or skip newly-required ones — the most commonly reported resume bug class.
**Do this instead:** Persist answers + current-step-id hint only; replay validators on load; honor the hint only if still reachable.

### Anti-Pattern 2: Step-local `useState` in routed wizards

**What people do:** Each `/apply/[step]` page owns its field state locally.
**Why it's wrong:** App Router route changes unmount the subtree; Next/Back destroys answers. ~40% of audited broken wizards show exactly this.
**Do this instead:** Module-scope Zustand store as sole owner of answers; steps are stateless views that seed from and patch into the store.

### Anti-Pattern 3: Three sources of truth

**What people do:** Global Zustand store _plus_ independent per-step form states _plus_ a "submit everything" reconciler at the end.
**Why it's wrong:** Nobody knows which copy wins; data loss is intermittent and unreproducible.
**Do this instead:** Exactly one owner per datum. Local RHF instances are write-through caches into the store (seed on mount, PATCH on settle) — not competing copies.

### Anti-Pattern 4: Files through JSON/localStorage

**What people do:** `JSON.stringify(formData)` including `documents: File[]`, or storing base64 in localStorage.
**Why it's wrong:** File objects aren't serializable to JSON; base64 bloats past the ~5MB localStorage cap instantly and blocks the main thread on every debounced save.
**Do this instead:** Blobs → IndexedDB at selection time; metadata only in the JSON store.

### Anti-Pattern 5: Mock logic inline in components

**What people do:** `setTimeout(() => setPaid(true), 1500)` inside the payment screen.
**Why it's wrong:** The mock IS the architecture seam being tested; inline mocks make the future real integration a rewrite of every touched component, and untestable.
**Do this instead:** All simulated behavior behind service interfaces resolved via `getService()`.

### Anti-Pattern 6: Validating every step on every transition

**What people do:** Re-run all schemas when advancing.
**Why it's wrong:** O(steps) work per click and renders errors on steps the user never reached — the top complaint about wizard UX.
**Do this instead:** Validate the current slice on NEXT; full composed schema only once at SUBMIT.

## Integration Points

### External Services (all mocked per PRD §4 — interfaces now, adapters later)

| Service                    | Port (interface)         | Mock behavior                                                        | Future real adapter                     |
| -------------------------- | ------------------------ | -------------------------------------------------------------------- | --------------------------------------- |
| Payment gateway            | `IPaymentService`        | Fake Razorpay modal; order + confirm with latency; no money moves    | Razorpay/NEFT SDK behind same interface |
| OTP/SMS verification       | `IOtpService`            | Auto-accepts fixed demo code                                         | Twilio SMS                              |
| Government passport lookup | `IPassportLookupService` | Simulated success after delay                                        | MEA passport validation API             |
| Notifications (email/SMS)  | `INotificationService`   | `console.log` per PRD                                                | SendGrid/AWS SES                        |
| Application tracking       | `ITrackingService`       | Deterministic timeline seeded from submission time; demo transitions | Backend status DB / VFS sync            |
| Document OCR/scanning      | `IDocumentScanService`   | Simulated "Success" on metadata                                      | ML extraction service                   |
| Interview scheduling       | `ISchedulingService`     | Mock calendar component data                                         | VFS/embassy systems                     |

### Internal Boundaries

| Boundary                        | Communication                                                       | Notes                                                              |
| ------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Step screens ↔ applicationStore | Zustand actions (`patchStep`, read slices)                          | Steps never read each other's components; only store               |
| Wizard machine ↔ stores         | Machine is pure; thin action wrappers in store call it              | Machine stays React-free and testable                              |
| Steps ↔ validation schemas      | zod schemas referenced by step id                                   | Same schemas power resume replay — single definition               |
| UI ↔ services                   | `getService()` factory only                                         | Components must not import from `services/mock/` directly          |
| i18n ↔ all UI                   | `useTranslations()` hooks per feature namespace                     | No user-facing strings hardcoded anywhere, including error copy    |
| Service worker ↔ app            | Serwist build-time integration (`sw.ts` compiled to `public/sw.js`) | App code never talks to SW except registration + optional messages |

## Suggested Build Order (dependency-driven)

Each item depends only on items above it — maps directly onto phase structure:

1. **Foundation:** Next.js app skeleton · design-system primitives (48px targets, tokens, a11y) · i18n wiring (cookie locale, 6 message files) · formatters (+91, passport, ₹). _No dependencies; everything composes these._
2. **Data spine:** zod step schemas + composed full schema · applicationStore with persist (versioned, answers-only, skipHydration) · wizard machine reducer + unit tests. _Pure logic; buildable before any screen exists._
3. **Wizard shell:** `apply/layout.tsx` persistent chrome · ProgressHeader · StepGuard + `[step]` routing. _Needs spine for reachability._
4. **Stages 1–2 (Visa type → Personal details):** first vertical slice through the whole stack; proves the PATCH→derive→persist loop end-to-end.
5. **Stage 3 (Documents):** IndexedDB document store + upload tiles (camera capture, drag-drop, size/format validation). _Needs foundation primitives + store._
6. **Stage 4–5 (Payment → Confirmation):** mock payment service + gateway modal flow; reference-number generation; confirmation package. _Needs services layer + store._
7. **Tracking & resume flows:** `/track?ref=` timeline view · backup-code snapshot/restore (`/resume`) · draft expiry + clear-on-submit hardening.
8. **PWA/offline:** Serwist precache + `/~offline` fallback · `navigator.storage.persist()`.
9. **Hardening pass:** WCAG 2.1 AA audit, Lighthouse a11y 90+, Core Web Vitals on throttled 3G, storage-quota edge cases (private mode), locale completeness.

**Phase-ordering rationale:** the state machine + persistence spine (item 2) is where every PRD requirement lives ("never lose data", "always know where am I") — building it before screens means stages are then mostly declarative work. PWA last because it caches whatever shell exists; doing it early just churns.

## Sources

- Next.js App Router docs (dynamic segments, layouts, redirect) via Context7 `/vercel/next.js` — official, MEDIUM confidence
- Zustand persist middleware docs (partialize/version/migrate/skipHydration) via Context7 `/pmndrs/zustand` — official, HIGH
- React Hook Form docs (trigger, zodResolver, mode) via Context7 `/react-hook-form/documentation` — official, MEDIUM
- next-intl docs (localePrefix 'never', cookie-based getRequestConfig, NextIntlClientProvider) via Context7 `/amannn/next-intl` — official, MEDIUM
- Serwist docs (withSerwistInit, swSrc/swDest, navigateFallback) via serwist.pages.dev through Context7 — official, MEDIUM
- "Multi-Step Form State Machines" + "Persisting Wizard Progress Across Reloads," client-side-form.com (2026-08) — web, cross-corroborated
- "Form Architecture For Complex Products," nazarboyko.com (2025-03) — web
- "System Design #12: Multi-Step Form Wizard," devprep.co (2026-02) — web
- "Fix State Loss Multi-Step Form" (route-teardown failure stats), base44devs.com (2026-05) — web
- MDN Storage quotas and eviction criteria; web.dev "Storage for the web" + "Offline data" — official platform docs, HIGH (mutually consistent)
- "How to Persist Form State in the Browser," openreplay.com blog (2026-05) — web

---

_Architecture research for: VisaReThink — guided mobile-first visa application portal_
_Researched: 2026-08-25_
