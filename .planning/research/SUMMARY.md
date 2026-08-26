# Project Research Summary

**Project:** VisaReThink
**Domain:** Guided mobile-first visa application portal (government-service UX, Indian market, all backend integrations mocked client-side, single milestone)
**Researched:** 2026-08-25
**Confidence:** HIGH overall (one open decision requiring user sign-off — see Framework Decision below)

## ⚠️ Framework Decision — Reconciling STACK.md vs ARCHITECTURE.md (read first)

STACK.md and ARCHITECTURE.md disagree on the meta-framework, and this summary resolves it:

- **STACK.md recommends Vite 8 + React 19 SPA — NOT Next.js.** Rationale: every backend feature Next.js exists for (API routes, SSR, Server Components, server actions) is explicitly mocked/out of scope; a Next.js app here would run as `output: 'export'` static export anyway (framework complexity for a plain static bundle); client-only SPAs ship measurably less JS to budget-Android/3G devices; `vite-plugin-pwa` is the battle-tested PWA path; 2026 consensus maps prototypes/client-only apps to Vite. Confidence: HIGH that it fits requirements; MEDIUM-HIGH overall because it overrides the PRD's "(React/**Next.js**)" mention.
- **ARCHITECTURE.md was researched assuming Next.js App Router** (module-scope Zustand with `skipHydration`, next-intl cookie locale, Serwist service worker, free route-level code splitting).

**Resolution adopted in this document:** **Vite 8 + React 19 SPA** is the recommended framework. All ARCHITECTURE.md guidance survives intact because its substance is framework-neutral (state machine over answers, ports & adapters mocks, split persistence, derive-don't-persist). Only the platform-specific mechanisms translate:

| ARCHITECTURE.md (Next.js assumption)                  | Translated recommendation (Vite + React SPA)                                                                                                                                                                                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App Router persistent layout (`app/apply/layout.tsx`) | react-router v8 **nested routes**: the `apply` parent route renders the persistent wizard shell (progress header, language switcher) + `<Outlet/>`; stage children render inside it and never unmount the shell                                                       |
| `[step]/page.tsx` + `redirect()` guard                | One route per stage under `/apply/:step`; **StepGuard** as a route loader/guard that recomputes reachability from the store and redirects deep links/stale bookmarks to the first incomplete step                                                                     |
| Module-scope Zustand + `skipHydration` (SSR safety)   | Zustand stays, but **no SSR exists** — Pitfall 2 (hydration mismatch) largely evaporates. Remaining sliver: rehydrate persisted state **after mount** behind a skeleton to avoid first-paint flicker; centralize storage reads in one hook/module                     |
| next-intl, cookie-based locale, `getRequestConfig`    | **i18next + react-i18next + browser-languagedetector**: locale persisted to localStorage (no server to read cookies), `i18n.changeLanguage()` switches, `<html lang>` updated imperatively on change, per-locale JSON message catalogs (lazy-load non-active locales) |
| Serwist (`@serwist/next`)                             | **vite-plugin-pwa** (Workbox `generateSW`): precache app shell, offline navigation fallback. Pitfall 10 (stale SW after deploys) applies identically — decide the network-first-navigations caching matrix in the PWA phase plan                                      |
| Free route-level code splitting                       | Deliberate: react-router **lazy routes / dynamic `import()`** per stage — same effect, must be configured                                                                                                                                                             |
| Static export build                                   | Native static output — Vite builds static bundles by default                                                                                                                                                                                                          |

**Action for orchestrator/user:** this overrides the PRD's parenthetical Next.js mention. STACK.md already flags it for explicit sign-off (MEDIUM-HIGH, not HIGH). Ratify at requirements/roadmap time — it changes Phase 1's scaffold, not the product's shape. If the team strongly prefers Next.js anyway, STACK.md's fallback path (Next 16 static export + Serwist + next-intl) transfers everything else unchanged at the cost of larger baseline JS and more PWA friction.

A second, smaller reconciliation: STACK.md says "avoid Zustand for form data," ARCHITECTURE.md mandates a Zustand `applicationStore`. These agree once phrased precisely: **react-hook-form owns keystroke state** (uncontrolled inputs, zero re-render risk); the store is the **persisted source of truth for settled answers**, patched via a debounced RHF `watch` subscription (~1–2 s) **plus synchronous flush** on step change, `pagehide`, and `visibilitychange`. Local RHF instances are write-through caches seeded from the store — never competing copies. Similarly, STACK prefers idb for drafts while ARCHITECTURE uses localStorage-backed zustand persist for answer JSON — either is acceptable; the **non-negotiable contract is files→IndexedDB, answers→one versioned JSON store behind a single module with try/catch on every write**.

## Executive Summary

VisaReThink is a guided, mobile-first visa application portal targeting first-time Indian applicants on budget Android phones over 3G, in six languages (en, hi, ta, te, kn, mr), with every backend concern (payment, OTP, passport lookup, OCR, notifications, tracking) mocked client-side, delivered as a single milestone covering full PRD scope. Experts build this class of product as **a state machine whose UI happens to render fields — not a form with pagination**: competitors' worst failures (DS-160's silent 20-minute timeout destroying work, resumes landing on wrong steps, unfixable mistakes found after submission) all trace to treating steps as pages instead of states derived from answers. Best practice across iVisa, Atlys, DS-160, and the GOV.UK Design System converges on: linear staged flow with honest progress and time estimates, aggressive autosave with resume, a review-your-answers checkpoint before submit, itemized costs shown upfront, and radical status transparency.

The recommended approach: **Vite 8 + React 19 SPA** (see Framework Decision above) with TypeScript, Tailwind 4 + shadcn/ui for accessible primitives, react-router 8 nested routes for the persistent wizard shell, react-hook-form + Zod for per-step validation, a pure wizard-machine reducer deriving step statuses from answers, ports-and-adapters mock services behind typed interfaces, and split persistence (versioned JSON answers + IndexedDB blobs). Six research-identified gaps in the PRD must be folded into scope: accessible error summary (T5), review-before-submit page (T6), upload compression (T10), payment state machine with pending/failure/retry (T11), help/support escape hatch (T16), and trust/privacy messaging (T22). All six are table stakes — none can slip without breaking the completion-rate thesis.

Key risks, in order of severity: **(1)** autosave theater — a save indicator that doesn't survive tab kills invalidates the #1 stated pain point being solved; mitigate with debounced saves + flush on pagehide/visibilitychange and a kill-the-tab test protocol per stage. **(2)** Accessibility attempted as a final pass fails structurally (WebAIM: three of six top WCAG failures are form-specific, and this product is one long form) — bake labeled inputs, focus management, and error announcements into primitives from Phase 1 with axe/Lighthouse CI gates running throughout. **(3)** Five Indic scripts quietly destroy the 3G performance budget — use Android's locally-shipped Noto families first, budget fonts explicitly, enforce a bundle budget in CI. **(4)** Mock scope explosion — a mock is a scripted scenario, not a system; cap fidelity per the PRD §4 inventory. **(5)** Stale service-worker cache pinning users to broken old builds — network-first navigations decided deliberately in the PWA phase.

## Key Findings

### Recommended Stack

Full details in [STACK.md](./STACK.md). Versions verified against the live npm registry (2026-08-25). Headline: **Vite + React SPA, not Next.js** (Framework Decision above).

**Core technologies:**

- **Vite 8.2 + React 19.2 + TypeScript 7.0** — fastest dev loop, least baseline JS for a client-only app on 3G; TS 7's Go compiler is fast but ESLint needs the `@typescript/typescript6` sidecar until TS 7.1 ships the programmatic API
- **react-router 8.3 (library mode, unified `react-router` package — NOT `react-router-dom`)** — one route per wizard stage; shareable/resumable URLs; `<Outlet>` hosts the persistent shell; lazy routes for code splitting
- **Tailwind CSS 4.3 + shadcn/ui (Radix foundations)** — zero-runtime styling; CSS-first `@theme` tokens enforcing 48px touch targets and AA contrast globally; source-owned components customizable down to copy
- **react-hook-form 7.86 + @hookform/resolvers 5.9 + zod 4.4** — uncontrolled inputs (fewest re-renders on low-end Androids); one Zod schema per step; discriminated unions drive progressive disclosure; `safeParse` guards restored drafts
- **idb 8.0 (IndexedDB wrapper)** — uploaded File/Blob objects (structured clone, GB-scale quota); localStorage dies on phone photos (~5MB cap, sync API)
- **i18next 26.4 + react-i18next + browser-languagedetector** — 6 locales, ICU plurals, `Intl.DateTimeFormat`/`NumberFormat` for dates/₹; `@fontsource/noto-sans` + Indic subsets loaded dynamically per active locale
- **vite-plugin-pwa 1.3** — autoUpdate registration, `generateSW` precached app shell, offline fallback
- **Testing:** Vitest 4 + Testing Library + Playwright 1.62 (Pixel-7 device projects) + @axe-core/playwright gating CI on zero WCAG 2.1 A/AA violations

**Explicitly avoid:** CRA (dead), next-pwa (abandoned), localStorage for files, Redux/Zustand-for-keystrokes, TanStack Query/SWR (no server state exists), moment.js (use `Intl`), Formik, Framer Motion in core deps (CSS transitions suffice), eager bundling of all 6 translation catalogs, MSW unless network-layer mocking is specifically wanted.

### Expected Features

Full details in [FEATURES.md](./FEATURES.md). Confidence MEDIUM — verified across competitor listings, GOV.UK primary sources, WebAIM data. Single milestone = PRD scope **plus six net-new gap fixes** (all table stakes): **T5** accessible error summary w/ focus management, **T6** review-your-answers page (biggest PRD miss — insert before final submit, tap-to-edit jumps back), **T10** client-side image compression (≤2 MB canvas downscale), **T11** payment state machine exercising INITIATED→PENDING→SUCCESS/FAILED with retry and double-payment guard (instant-success mocks contradict UPI reality), **T16** help escape hatch (translated searchable FAQ + contact affordance on every stage), **T22** trust/privacy messaging ("prototype — nothing leaves your device").

**Must have (table stakes):** guided linear flow w/ progress + time estimates (T1); autosave + resume across sessions (T2/T3); blur-timed validation with constructive errors (T4); upfront checklist/cost/time (T7); prepare-before-you-start intro (T8); upload suite — camera capture, format/size validation, preview (T9); itemized receipt (T12); confirmation package + shareable reference (T13); guest tracking by reference (T14); dated status timeline with next actions (T15); full-surface translation incl. errors/statuses/help (T17); dynamic `lang` attr + script-aware fonts, no glyph clipping (T18); concrete WCAG 2.1 AA coverage (T19); 48px mobile ergonomics (T20); offline draft tolerance (T21); duplicate-application resume prompt (T23).

**Should have (differentiators):** six regional languages — the flagship, unique in category, protect its budget (D1); plain-language per-field help for low digital literacy (D2); rule-based visa recommendation wizard with explanations (D3); expiry advisory with informed-consent continue (D4); static camera framing overlays, no AI (D5); honest running time estimates (D7); interview-prep downloads (D8). **D6 WhatsApp share is the designated cut-first candidate** if slack runs out.

**Defer/exclude:** AI chatbot (a canned bot erodes trust — curated FAQ instead); group/family applications; rush-tier pricing; forced accounts; real OCR; session auto-logout; websockets; upsells in-journey; Aadhaar/biometrics.

### Architecture Approach

Full details in [ARCHITECTURE.md](./ARCHITECTURE.md) (written for Next.js; see the translation table above). The consensus: a multi-step guided application is a **state machine whose UI renders fields**. Answers are the only persisted truth; step completion, reachable path, and progress % are recomputed on load — never stored.

**Major components:**

1. **Wizard machine** (`features/wizard/machine.ts`) — pure TypeScript reducer over answers; derives path and per-step statuses (`locked/available/complete/stale`); editing an earlier answer revokes downstream completeness; unit-testable without React
2. **Persistent wizard shell + StepGuard** — react-router nested route whose `<Outlet>` chrome never unmounts; URL step ids treated as untrusted input, redirected when unreachable
3. **applicationStore (Zustand + persist)** — sole owner of answers; persists `{version, savedAt, values, currentStep-hint}` only; RHF instances seed from and patch into it (write-through, never competing copies); debounced writes + flush on step change/pagehide/visibilitychange
4. **Mock service layer (ports & adapters)** — typed interfaces (`IPaymentService`, `IOtpService`, …) + mock adapters with realistic latency (800ms–3s) and full outcome matrices (success/pending/fail/validation-reject) driven by scenario config, resolved via a `getService()` factory — THE swap point for real integrations
5. **Split persistence** — versioned JSON answers (localStorage-backed store, try/catch everywhere, draft expiry ~7 days, clear-on-submit) + IndexedDB blobs for documents written at selection time; `navigator.storage.persist()` against eviction
6. **Design-system primitives** — 48px targets, AA contrast, error-summary component, stepper semantics, upload tile, timeline — accessibility baked in, consumed everywhere, hand-rolling forbidden

### Critical Pitfalls

Full details in [PITFALLS.md](./PITFALLS.md) (12 pitfalls; top 5 below).

1. **localStorage as document persistence** — a single phone JPEG blows the ~5MB quota; writes throw uncaught `QuotaExceededError` and uploads silently vanish on resume. Two-tier persistence by contract (files→IndexedDB), try/catch every write, `navigator.storage.persist()`, compress before storing.
2. **Autosave theater** — saves coupled to the Next button die on tab kill/crash/back-swipe; silent save failure destroys exactly the trust being built (and is a formal WCAG failure, SC 2.2.5/F12). Debounce ~1–2 s + synchronous flush on `visibilitychange`/`pagehide`/step transitions; honest "Saved"/"Not saved — retry" states; kill-the-tab test protocol per stage.
3. **Accessibility as a final pass → structural AA failure** — labels/contrast/focus/error-announcement are baked into component design; retrofit means rewrites. Acceptance criteria in every UI story, focus moves to new step headings on navigation, errors via `aria-describedby`/`aria-invalid` + summary, axe + Lighthouse CI gates from sprint one.
4. **Indic fonts destroying the 3G budget** — five scripts with heavy OpenType shaping requirements; naive self-hosting = LCP blowout and CLS. Android ships Noto locally: system-font stack first (zero bytes for most users), bundled subsets as desktop fallback only, conjunct smoke-tests (क्ष, ஸ்ரீ, స్త్రీ) after any subsetting.
5. **Mocks without contracts / scope explosion** — inline mock logic means there is no seam to swap and failure UIs are dead code; high-fidelity fake infrastructure eats the milestone. Interfaces from day one, scenario-driven outcomes, visible demo-mode affordances, half-day time-box per mock, mock inventory tracked against PRD §4.

Also load-bearing: **stale SW after deploys** (network-first navigations, versioned caches — decide in the PWA phase plan, not via bug report); **validation extremes** (validate on blur, never per keystroke; submit always enabled, click routes focus to error summary; blocking errors vs advisory warnings); **ad-hoc untranslated error messaging** (single error-presentation system + taxonomy catalog translated in all 6 languages); **hydration-era patterns are mostly moot on Vite** but keep post-mount rehydration behind a skeleton.

## Implications for Roadmap

Based on combined research, suggested phase structure (dependency-driven; ARCHITECTURE's build order + PITFALLS' ordering implication converge on this shape):

### Phase 1: Foundation & Design System

**Rationale:** Everything composes these primitives; retrofitting any of them touches every component (PITFALLS recovery table rates those retrofits HIGH).
**Delivers:** Vite+React+TS scaffold (per ratified Framework Decision) · design tokens (48px targets, AA palette) · Noto-first typography strategy · i18n machinery (6 locales, logical-CSS rule, pseudolocale check) · storage abstraction (one answers module + idb documents DB) · typed service interfaces + mock adapters · perf budget wired into CI · Vitest/Playwright/axe pipeline.
**Addresses:** T18/T19 groundwork, T17 scaffolding, D1 machinery.
**Avoids:** Pitfalls 1, 4, 5, 6, 7, 9 at the root.

### Phase 2: Application State Spine

**Rationale:** "Never lose data" and "always know where am I" live entirely here; building it before screens makes later stages mostly declarative. Pure logic — no screens needed.
**Delivers:** Zod schemas per step + composed full schema · applicationStore (versioned, answers-only, debounced+flush persistence, expiry) · pure wizard-machine reducer with unit tests · draft envelope incl. `maxStepReached`.
**Avoids:** Anti-patterns 1–3 (persisted derived state, step-local state, three sources of truth).

### Phase 3: Wizard Shell + Stages 1–2 (Visa Type → Personal Details)

**Rationale:** First vertical slice proves the PATCH→derive→persist loop end-to-end; validation policy gets defined where it's cheapest to enforce.
**Delivers:** Nested-route shell + `<Outlet>` chrome + StepGuard + progress header/time estimates · Stage 1 (catalog, recommendation rules D3, upfront checklist/cost/time T7, expiry advisory D4) · Stage 2 (formatters, inputmode keyboards) · the validation policy (blur-timing, enabled submit, error-summary component T5, advisory-vs-blocking distinction).
**Addresses:** T1, T4, T5, T7, T8, D2 start, D3, D4.
**Avoids:** Pitfalls 3 (flush wiring born here), 11, 12.

### Phase 4: Documents Stage (Upload Pipeline)

**Rationale:** Highest-complexity table stake (HIGH cost) with hardware/network realities needing their own attention.
**Delivers:** Camera capture + file picker · magic-byte/format/size checks · canvas compression ≤2 MB (T10) · thumbnail preview + confirm-before-attach · IndexedDB blob writes at selection + metadata store · honest quality-check scope (resolution heuristic, labeled as such) · quota/estimate surfacing.
**Addresses:** T9, T10, D5 overlays.
**Avoids:** Pitfall 1 concretely; HEIC/large-JPEG gotchas.

### Phase 5: Review → Payment → Confirmation

**Rationale:** Review (T6) requires the unified store (reads what T2 persisted) and gates payment enablement; the payment state machine gates confirmation/tracking downstream.
**Delivers:** Review-your-answers page grouped by stage with tap-to-edit (T6 — biggest PRD gap fix) · mock gateway modal (UPI/Card/Netbanking) with INITIATED→PENDING→SUCCESS/FAILED, retry linked to parent txn, double-submit guard (T11) · itemized breakdown + receipt (T12) · CSPRNG reference numbers + confirmation package (T13) · clear-on-submit.
**Addresses:** T6, T11, T12, T13, T22 near sensitive fields.
**Avoids:** Pitfall 8 (mock stays scripted, time-boxed), guessable-reference security mistake.

### Phase 6: Tracking, Resume & Support Flows

**Rationale:** Post-submission and recovery flows consume artifacts from Phases 2–5 (reference numbers, snapshots, timeline seeds).
**Delivers:** `/track?ref=` guest lookup + dated timeline with next actions (T14/T15) · backup-code snapshot/restore incl. in-app mock "inbox" so the flow is demonstrable (T3) · duplicate-detection resume prompt (T23) · searchable translated FAQ + contact affordance (T16) · trust/privacy explainer completed (T22).
**Addresses:** T3, T14–T16, T22, T23, D8.
**Avoids:** Autosave-theater blind spots; scope creep into a status-transition engine.

### Phase 7: Localization Completion

**Rationale:** Machinery exists from Phase 1 and was enforced continuously; this phase is content + verification, not plumbing — and it protects flagship differentiator D1.
**Delivers:** Full-catalog translations across ALL surfaces (errors, statuses, tooltips, examples, FAQ) · per-script rendering audit (line-height/clipping, conjunct smoke tests) · dynamic `<html lang>` verified · mid-flow language switch without form reset · pseudolocale build showing zero unwrapped strings.
**Addresses:** T17, T18, D1, D2 depth.
**Avoids:** Pitfalls 5, 6, 12 verification halves.

### Phase 8: PWA/Offline + Hardening

**Rationale:** SW caches whatever shell exists — doing it early churns; hardening verifies the whole journey rather than per-part.
**Delivers:** vite-plugin-pwa with deliberate caching-strategy matrix (network-first navigations, hashed-asset cache-first, versioned caches + activate cleanup) · offline fallback + honest offline banner · `navigator.storage.persist()` · deploy-twice stale-SW test · end-to-end keyboard-only + screen-reader walkthrough · Lighthouse ≥90 + CWV on throttled CPU/3G per stage screen · private-mode/quota edge cases · PITFALLS "Looks Done But Isn't" checklist as exit criteria.
**Addresses:** T21, T19 final gate.
**Avoids:** Pitfalls 9, 10; catches anything earlier phases leaked.

### Phase Ordering Rationale

- Foundation → spine → shell mirrors the dependency graph: i18n blocks nearly all copy work; the state spine is what every requirement hangs on; the shell needs reachability from the machine.
- Stages ship in journey order (1–2, docs, review/payment, tracking/resume) because each consumes the previous phase's outputs — review gates payment; payment emits the terminal state that tracking renders.
- PWA last (caches whatever exists), localization as content-phase after surfaces stabilize (translation of moving targets is waste), a11y/perf as continuous CI gates rather than final phases.
- Gap fixes are distributed into their natural phases (T5→Phase 3, T10→Phase 4, T6/T11→Phase 5, T16/T22→Phase 6) so the milestone delivers PRD-plus-gaps without a bolt-on "gap phase."

### Research Flags

Phases likely needing deeper research during planning (`--research-phase`):

- **Phase 4 (Documents):** HEIC acceptance/conversion on Android capture, canvas-compression quality tuning, camera-capture quirks in Chrome Android — niche, sparsely documented interactions.
- **Phase 5 (Review/Payment):** realistic mock payload shapes for a UPI-style collect flow (pending semantics, retry linkage) — worth a short targeted pass even though mocked.
- **Phase 8 (PWA):** vite-plugin-pwa 1.x ↔ Vite 8 peer compatibility and Workbox navigateFallback configuration — verify at scaffold time; strategy matrix deserves explicit planning.

Phases with standard patterns (skip research-phase):

- **Phase 1:** Vite/Tailwind/shadcn/i18next setup is exhaustively documented (verify TS7-eslint sidecar caveat on install).
- **Phase 2:** Pure TypeScript reducers + Zod — standard.
- **Phase 3:** react-router nested layouts/guards — well-documented library mode.
- **Phase 6:** CRUD-ish views over existing stores/services.
- **Phase 7:** i18next content workflow — standard tooling.

## Confidence Assessment

| Area         | Confidence  | Notes                                                                                                                                                                                                                           |
| ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | MEDIUM-HIGH | Versions verified against live npm registry (HIGH); framework choice cross-checked against 2026 consensus but **overrides the PRD's Next.js mention — needs explicit user sign-off**; TS 7 + ESLint sidecar workaround is young |
| Features     | MEDIUM      | Competitor features cross-checked across multiple independent sources; GOV.UK patterns from primary sources (HIGH); UPI payment-behavior claims MEDIUM                                                                          |
| Architecture | HIGH        | Core patterns (derive-don't-persist, ports & adapters, split persistence) corroborated by multiple 2026 sources + official platform docs; Vite translation is mechanical but untested as a whole until Phase 1                  |
| Pitfalls     | HIGH        | Storage/quota, WCAG, and perf claims verified against official docs (web.dev, MDN, WebAIM Million 2026, W3C WAI)                                                                                                                |

**Overall confidence:** HIGH — proceed to roadmap, contingent on ratifying the framework decision.

### Gaps to Address

- **Framework ratification (blocking-ish):** Vite+React SPA vs PRD's Next.js parenthetical — resolve at requirements/roadmap time before Phase 1 scaffolds. Fallback path documented in STACK.md.
- **Real-device testing access:** research assumes Pixel-class emulation; compression, camera capture, Indic font fallback, and INP genuinely need a pass on a budget physical Android. Plan device time in Phase 8.
- **Translation quality process:** six languages including ta/te/kn/mr need human-quality review — who reviews, and when in Phase 7? Machine-translated-at-runtime is explicitly ruled out by research.
- **vite-plugin-pwa ↔ Vite 8 peer range and TS 7 ESLint sidecar:** both flagged "verify on install" — cheap checks inside Phase 1.
- **Safari/storage-eviction behavior:** `navigator.storage.persist()` effectiveness varies; treat eviction as "draft expired," not crash — verify messaging copy handles it honestly.
- **Time-estimate honesty:** stage time estimates must be measured post-build and adjusted (static wrong estimates erode the transparency promise) — schedule a copy-tuning pass late in the milestone.

## Sources

Aggregated from the four research files; per-file citations with confidence ratings live in STACK.md, FEATURES.md, ARCHITECTURE.md, and PITFALLS.md.

### Primary (HIGH confidence)

- Live npm registry (2026-08-25) — all recommended versions verified current
- web.dev _Storage for the web_; MDN _Storage quotas and eviction criteria_ (2026) — persistence limits, QuotaExceededError, Safari ITP eviction
- WebAIM Million 2026 — six WCAG failure types = 96% of detected errors; contrast 83.9%, missing labels 51%
- W3C WAI _Understanding SC 2.2.5_ + Failure F12 — session-timeout data loss as formal WCAG failure
- Nielsen Norman Group wizard/error-design guidelines; Smashing live-validation guide; Baymard inline-validation research
- Chrome/Workbox service-worker deployment expectations — stale-cache mechanics
- Microsoft TypeScript blog — TS 7.0 announcement, programmatic-API timeline
- Context7 official library docs: zustand persist, react-hook-form, next-intl, Serwist, Next.js App Router/static export (used for the reconciliation)

### Secondary (MEDIUM confidence)

- Context7 docs for vite-plugin-pwa, i18next, idb, shadcn/ui, vitest, playwright, axe-core, zod, resolvers
- 2026 Next.js-vs-Vite decision literature (multiple independent, mutually consistent sources)
- iVisa / Atlys feature sets (app-store listings, vendor sites, independent reviews)
- DS-160/CEAC timeout documentation and user reports; UPI payment-UX practitioner sources
- W3C Indic Layout Requirements; Google Fonts/Tiro complex-script design notes
- Multi-step-form architecture articles (client-side-form.com, devprep.co, base44devs.com — cross-corroborated)

### Tertiary (LOW confidence — validate during execution)

- Exact byte budgets per device class (webvitals.tools calculator tables) — directionally sound, tune to measured CWV
- Post-mortem single-source stale-SW incident reports — consistent with Workbox docs but anecdotal

---

_Research completed: 2026-08-25_
_Ready for roadmap: yes (pending framework ratification)_
