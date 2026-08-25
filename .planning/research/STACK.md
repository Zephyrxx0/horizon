# Stack Research

**Domain:** Mobile-first guided visa application PWA (React SPA, fully mocked client-side backend)
**Researched:** 2026-08-25
**Confidence:** HIGH (versions verified against live npm registry; APIs verified via official docs/Context7; framework choice cross-checked against 2026 community consensus)

## Headline Decision: Vite + React SPA — NOT Next.js

The PRD architecture says "Frontend (**React**/Next.js)" — plain React satisfies it. Given this project's reality, Vite + React is the right call:

1. **Every backend feature Next.js exists for is mocked away.** No API routes, no SSR, no Server Components, no server actions — the PRD's Kong gateway / PostgreSQL / S3 layers are explicitly out of scope. A Next.js app here runs as `output: 'export'` static export anyway, i.e., you carry the framework's complexity to get a plain static bundle.
2. **Target device is a budget Android phone on 3G.** Client-only SPAs ship measurably less framework JavaScript (2026 Core Web Vitals analyses show small SPAs winning INP; hydration cost of an App Router tree buys nothing when there is no server).
3. **PWA/offline is a first-class requirement.** `vite-plugin-pwa` is the most battle-tested Workbox integration in the ecosystem and is zero-config for exactly this shape of app (precache app shell, offline fallback). The Next.js path requires Serwist plus manual wiring against static export.
4. **Single-milestone prototype.** 2026 consensus explicitly maps "client-only apps" and "prototypes" to Vite; faster dev server, one mental model (everything is a client component), simpler testing.
5. **Migration escape hatch exists.** Keep every mock behind a typed service-layer interface (`services/visa.ts` etc.). If this ever graduates to a real backend, swap implementations to `fetch()` — or adopt Next.js then, without rewriting components.

**Confidence: MEDIUM-HIGH** (HIGH that it fits requirements; MEDIUM only because it overrides the PRD's Next.js mention — flagging for explicit sign-off).

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vite | 8.2.x | Build tool + dev server | Fastest dev loop in React ecosystem; native ESM HMR; static output deploys anywhere; the standard SPA foundation in 2026 |
| React | 19.2.x | UI runtime | Current stable; concurrent rendering, improved form/hydration behavior; all libraries below support it |
| TypeScript | 7.0.x | Type safety | Native Go compiler (~10x faster), shipped stable 2026-07-08, type-checking identical to TS 6. One caveat below re: eslint tooling |
| react-router | 8.3.x | Routing (library mode) | One route per wizard stage → shareable/resumable stage URLs, browser back works naturally, `<Outlet>` layout shell hosts progress indicator. Use the unified `react-router` package (v8); `react-router-dom` stalled on v7 |
| Tailwind CSS | 4.3.x | Styling | Zero-runtime utility CSS; CSS-first config via `@theme` tokens — the mechanism we'll use to enforce 48px touch targets and AA contrast palette globally |
| shadcn/ui | latest CLI (shadcn 3.x) | Accessible component library | Components built on Radix UI primitives (keyboard nav, focus management, ARIA wired correctly out of the box — critical for WCAG 2.1 AA). Source is copied into your repo, so touch-target sizing and copy are trivially customizable |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | 7.86.x | Form state + validation orchestration | All multi-step forms. Uncontrolled inputs = fewest re-renders on low-end Androids; built-in `mode: 'onChange'` gives real-time validation; `trigger(fields)` validates one step at a time |
| @hookform/resolvers | 5.9.x | Zod ↔ RHF bridge | Always with RHF here; auto-detects Zod 4 |
| zod | 4.4.x | Schema validation + type inference | One schema per wizard step; discriminated union on visa type drives progressive disclosure (only relevant fields exist in schema AND render); `safeParse` guards restored draft data from IndexedDB |
| idb | 8.0.x | IndexedDB promise wrapper (~1.19kB) | Autosave drafts (~10s debounce via RHF `watch` subscription) AND uploaded file `File`/`Blob` objects (structured-cloneable, quota ~GB vs localStorage's ~5MB). Typed stores via `DBSchema`. Resume-across-sessions reads from here |
| i18next | 26.4.x | i18n core | Industry-standard; ICU-style plurals/interpolation; 6 locales (en, hi, ta, te, kn, mr) |
| react-i18next | 17.0.x | React bindings | `useTranslation()` hook + `Trans` component for embedded markup; language switch via `i18n.changeLanguage` |
| i18next-browser-languagedetector | 8.2.x | Locale detection | Detects `navigator.language`; persists choice to localStorage; English fallback |
| @fontsource/noto-sans (+ -devanagari, -tamil, -telugu, -kannada subsets) | 5.3.x | Typography | Latin base bundled; Indic subsets imported per-locale (dynamic import when locale activates keeps initial bundle light). Android ships Noto Sans Indic natively — system-font fallback covers budget phones even before fonts load |
| clsx + tailwind-merge | 2.1.x / 3.6.x | Class composition | Standard shadcn/ui companions (`cn()` helper) |
| class-variance-authority | 0.7.x | Component variants | Button/input size variants where we encode the ≥48px minimum height |
| lucide-react | 1.34.x | Icons | Tree-shakeable SVG icons used by shadcn/ui; no emoji icon dependency |
| msw (optional) | 2.15.x | Network-level mocking | Only if you want mocks to intercept real `fetch('/api/*')` calls instead of direct service-module calls. Default recommendation is plain typed service modules — less machinery for prototype scope |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vitest | 4.1.x | Unit/integration tests; shares the Vite config — zero extra build pipeline |
| jsdom | 30.x | DOM environment for component tests |
| @testing-library/react | 16.3.x | Component tests via accessible queries (getByRole) — doubles as an a11y smoke test at unit level |
| @testing-library/jest-dom | 7.0.x | DOM matchers |
| @playwright/test | 1.62.x | E2E. Configure device projects (`devices['Pixel 7']`, `isMobile`, `hasTouch`) to test the actual target device profile |
| @axe-core/playwright | 4.13.x | Automated WCAG scanning in E2E: `new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()`. Gate CI on zero violations; pair with Playwright aria snapshots for structure regression |
| vite-plugin-pwa | 1.3.x | Service worker + manifest: `registerType: 'autoUpdate'`, default `generateSW` strategy precaches the app shell; add runtime caching rules if any external assets appear later |
| typescript-eslint + ESLint | 10.x | Linting. **Caveat:** ESLint plugins consume the TS programmatic API, which TS 7 defers to 7.1 — run lint against the `@typescript/typescript6` sidecar package while keeping TS 7 for `tsc --noEmit` checks |
| Prettier | 3.9.x | Formatting |
| pnpm | latest | Package manager (workspace preference) |

## Installation

```bash
# Scaffold
pnpm create vite@latest . --template react-ts   # Vite 8 + React 19 + TS

# Core
pnpm add react-router zod react-hook-form @hookform/resolvers \
  i18next react-i18next i18next-browser-languagedetector idb \
  clsx tailwind-merge class-variance-authority lucide-react

# Styling
pnpm add tailwindcss @tailwindcss/vite
pnpm add @fontsource/noto-sans @fontsource/noto-sans-devanagari \
  @fontsource/noto-sans-tamil @fontsource/noto-sans-telugu @fontsource/noto-sans-kannada

# PWA
pnpm add -D vite-plugin-pwa

# Testing & quality
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom \
  @playwright/test @axe-core/playwright \
  eslint prettier typescript-eslint

# Then: npx shadcn@latest init  → add button input label card radio-group select progress ...
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite + React SPA | Next.js 16 (App Router, `output:'export'`) + Serwist | If the roadmap already committed to Next.js conventions, or a real backend/SSR is planned imminently. Costs: larger baseline JS on 3G devices, more PWA setup friction, two mental models (server/client components) unused |
| react-router 8 (library mode) | TanStack Router | If full type-safe route params/search-param validation becomes central. Steeper learning curve; unnecessary for a 6-route linear wizard |
| RHF + zodResolver | TanStack Form | Newer contender, fine API, but smaller ecosystem and fewer wizard-form references than RHF; no advantage that matters here |
| idb | localforage / raw IndexedDB / localStorage | localStorage alone: fails immediately on file uploads (quota) and has sync-API jank. Raw IndexedDB: verbose callback API. localforage: fine but older, less actively maintained than idb |
| i18next | next-intl / FormatJS (react-intl) | next-intl is Next-coupled. react-intl solid but heavier; i18next has the largest plugin ecosystem and simplest non-routed setup |
| shadcn/ui | Material UI / Ant Design / Chakra | MUI/Ant bring heavy bundles and generic looks; overriding them to hit WCAG contrast + 48px targets + plain-language UX fights the library. shadcn gives Radix accessibility with full source ownership |
| Tailwind 4 | styled-components / Emu CSS-in-JS | Runtime CSS-in-JS costs parse/execute time on low-end devices and complicates SSR-less streaming; ecosystem has moved to zero-runtime |
| Plain service modules (mocks) | MSW 2.x | MSW if you want the mock boundary at the network layer (app code uses real `fetch`, future backend swap is config-only). Adds a service worker of its own — keep it dev/test-only if used |
| Vitest | Jest | Jest needs extra transform config for the same Vite project; no reason in a Vite repo |
| Playwright | Cypress | Playwright's device emulation (Pixel profiles, touch) matches our target-device testing need directly; Cypress mobile emulation is weaker |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Create React App | Deprecated, unmaintained, officially replaced by framework docs pointing to Vite/Next | Vite |
| next-pwa | Abandoned (last meaningful work years ago); superseded by Serwist — and moot since we're not on Next | vite-plugin-pwa |
| localStorage as primary draft store | ~5MB shared quota dies on passport-photo uploads; synchronous API blocks main thread; no structured clone (can't store File objects) | idb (IndexedDB); localStorage only for tiny prefs like chosen locale/theme |
| Redux Toolkit / Zustand for form data | Duplicates form state RHF already owns optimally; global store adds boilerplate and re-render risk for zero benefit when there's no real server cache | RHF per-step forms + idb draft persistence; language state lives in i18next |
| TanStack Query / SWR | No server state exists — everything is mocked client-side; caching layers solve a problem this app doesn't have | Direct async service calls |
| moment.js / date-fns-for-everything | moment is legacy/dead; full date libs are dead weight — the app needs date display + simple parsing | Native `Intl.DateTimeFormat` (locale-aware formatting comes free per-language) + minimal helpers |
| Formik | Effectively in maintenance decline; re-renders whole form on each keystroke — wrong trade on low-end Android | react-hook-form |
| Framer Motion (in core deps) | ~30–50kB+ for animations a guided wizard doesn't need; motion should never block 3G first paint | CSS transitions/keyframes (Tailwind built-ins) |
| Bundling ALL translations upfront eagerly | 6 languages × full wizard copy inflates initial JS against the 3G budget | Static `import` of JSON per namespace is fine (Vite tree-shakes into chunks), but lazy-load non-active locales via dynamic import if bundle analysis shows bloat |
| jest-axe in Vitest units | Compatibility friction with Vitest versions historically; duplicate coverage | @axe-core/playwright scans in E2E across real pages — same axe engine, better fidelity |

## Stack Patterns by Variant

**If the product later gets a real backend (post-prototype):**
- Every mock lives behind `src/services/<domain>.ts` interfaces returning Promises (`submitApplication()`, `verifyOtp()`, `processPayment()`, `lookupVisaRules()`)
- Swap implementations to `fetch` calls (or introduce MSW in tests) without touching components — this is the migration insurance that justifies choosing Vite today

**If offline resume must survive cleared browser data:**
- The PRD's "email backup code" resume flow is the answer: serialize draft JSON to a recovery code shown/sent at checkpoints. This is pure application logic on top of the same service layer — no extra stack needed

**If visual QA shows inconsistent Indic rendering on desktop demo machines:**
- Switch the affected script subset from system-font fallback to bundled @fontsource import (they're all 5.3.x, same version line). On-device Android already ships Noto Sans Indic

**If team strongly prefers Next.js despite the above:**
- Use Next 16 static export + Serwist (`@serwist/next`) + next-intl instead of i18next. Accept: bigger baseline bundle, manual SW integration, dual component model. Everything else in this doc transfers unchanged

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| react-hook-form 7.86 | @hookform/resolvers 5.9 + zod 4.4 | Resolvers auto-detect Zod major version; keep all three current together |
| Tailwind 4.3 | shadcn/ui (current CLI) | shadcn supports TW v4 + `@tailwindcss/vite` natively; init after Tailwind is configured |
| vite-plugin-pwa 1.3 | Vite 8 | Verify peer range on install (plugin tracks Vite majors promptly); `generateSW` needs no custom SW code |
| react-router 8 | React 19 | Import from `'react-router'` (unified package); do NOT add `react-router-dom` (frozen at v7) |
| TypeScript 7.0 | typescript-eslint (current) | ESLint tooling uses the TS API → pin lint to `@typescript/typescript6` sidecar until TS 7.1 ships the programmatic API; use TS 7 `tsc` for type-checking |
| Vitest 4.1 | Vite 8 + @vitejs/plugin-react 6.1 | Single vitest.config.ts reusing the app's Vite plugins; `environment: 'jsdom'` |
| @axe-core/playwright 4.13 | @playwright/test 1.62 | Same-page lifecycle: construct `AxeBuilder({ page })` after navigation, assert `violations` empty for wcag21aa tags |
| Node | ≥20 LTS (check Vite 8 engines field on scaffold) | Vite majors periodically raise the floor |

## Sources

- npm live registry (2026-08-25) — all versions verified: vite 8.2.2, react 19.2.8, react-router 8.3.0, react-hook-form 7.86.0, @hookform/resolvers 5.9.1, zod 4.4.3, idb 8.0.3, tailwindcss 4.3.3, vite-plugin-pwa 1.3.0, i18next 26.4.0, react-i18next 17.0.12, vitest 4.1.11, @playwright/test 1.62.1, @axe-core/playwright 4.13.0, fontsource Noto packages 5.3.0 — **HIGH**
- Context7 `/vercel/next.js` — static export semantics (`output:'export'` disables server features) confirming Next-as-static-export equivalence — **MEDIUM**
- Context7 `/react-hook-form/resolvers` — zodResolver API, mode/trigger patterns, Zod-version auto-detection — **MEDIUM**
- Context7 `/colinhacks/zod` — Zod 4 API (safeParse, compile, v4 structural changes) — **MEDIUM**
- Context7 `/vite-pwa/vite-plugin-pwa` — generateSW/injectManifest strategies, autoUpdate registration, precache/runtimeCaching config — **MEDIUM**
- Context7 `/i18next/react-i18next` — init pattern with LanguageDetector, useTranslation/changeLanguage, Trans — **MEDIUM**
- Context7 `/jakearchibald/idb` — openDB upgrade pattern, put/get shortcuts, DBSchema typing — **MEDIUM**
- Context7 `/shadcn-ui/ui` — Vite + Tailwind v4 install path, CSS-variable theming, Radix foundations — **MEDIUM**
- Context7 `/vitest-dev/vitest` — React 19 + jsdom config example — **MEDIUM**
- Context7 `/microsoft/playwright` — devices/isMobile/hasTouch emulation, ariaSnapshot API — **MEDIUM**
- Context7 `/dequelabs/axe-core` — AxeBuilder withTags wcag2a/aa/wcag21a/wcag21aa analyze contract — **MEDIUM**
- Microsoft TypeScript blog "Announcing TypeScript 7.0" (2026-07-08) — TS 7 stability, no programmatic API until 7.1, sidecar guidance — **HIGH** (official announcement)
- 2026 Next.js-vs-Vite decision literature (multiple independent sources, cross-checked): consensus maps client-only/authenticated SPAs and prototypes → Vite; SEO/content sites → Next.js — **MEDIUM** (web consensus, cross-checked against official Next.js docs)

---
*Stack research for: mobile-first guided visa application PWA (mocked backend)*
*Researched: 2026-08-25*
