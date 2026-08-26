# VisaReThink — Reimagined Indian Visa Service Portal

> A mobile-first, offline-resilient guided visa application portal designed for Indian passport holders on budget smartphones and intermittent networks.

[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8.svg)](https://tailwindcss.com/)
[![XState 5](https://img.shields.io/badge/XState-5.32-orange.svg)](https://stately.ai/docs/xstate)
[![WCAG 2.1 AA](<https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA%20(0%20violations)-success.svg>)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Tests](<https://img.shields.io/badge/Tests-342%20passed%20(100%25)-brightgreen.svg>)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

## 📖 Overview

Applying for a visa as an Indian citizen on current government and partner portals (_visa.gov.in_, _iVisa_, _VFS_) is notoriously difficult — users suffer from ~62% completion rates, unhelpful errors, confusing fee add-ons, session timeouts, and broken mobile layouts.

**VisaReThink** transforms this intimidating form into a **step-by-step guided journey**. Built specifically for applicants on budget Android phones over 3G/4G connections, it ensures users always know where they are, never lose entered data, receive contextual jargon assistance, and finish with a trackable application and clear interview-prep next steps.

---

## ✨ Key Features & Innovations

### 1. 🚶 Guided 5-Stage Journey

- **Stage 1: Visa Selection & Recommendation** — Interactive trip purpose selector, upfront processing time and itemized fee breakdown, required document checklist, and intelligent recommendation cards.
- **Stage 2: Personal Details & Identity** — Sub-step question flow with progressive disclosure, passport auto-formatting (`AA1234567`), phone auto-prefix (`+91`), passport expiry warnings (<6 months), and pre-flight data privacy reassurance.
- **Stage 3: Document Upload Pipeline** — Page-by-page guidance (e.g. _"Pages 1–2 of passport"_), dual camera capture & drag-and-drop, instant client-side image compression (≤2MB), quality heuristic warnings (blur/size check), downloadable templates, and IndexedDB persistence.
- **Stage 4: Review, Payment & Submission** — Single check-answers review page with 1-tap `[Edit]` deep-link round-trips, itemized cost breakdown, simulated UPI/Card/Netbanking gateway with test scenarios, double-submit protection, and printable receipts.
- **Stage 5: Confirmation, Tracking & Recovery** — Official reference number (`VR-YYYY-XXXXXX`), WhatsApp/Web Share, dynamic consular interview prep checklist download (`.txt` + print view), live simulated SMS/Email notifications, and interactive demo status timeline.

### 2. 💾 Never-Lose-Data Persistence

- **State Machine wizard (XState 5)**: Step status, progress, and validation derive strictly from answers.
- **Debounced autosave (~10s)**: Automatically saves progress to browser storage with flush on `pagehide` / `beforeunload` — survives tab kills and browser crashes.
- **IndexedDB document store**: Uploaded documents and thumbnails persist in `idb-keyval` without localStorage quota limits.
- **Cross-device draft backup**: Generate an 8-character code (`VR-XXXXXX`) to resume your application on any other device with conflict resolution.

### 3. 🌐 6-Language Localization & Indic Fonts

- Full UI translated across **English**, **हिन्दी (Hindi)**, **தமிழ் (Tamil)**, **తెలుగు (Telugu)**, **ಕನ್ನಡ (Kannada)**, and **मराठी (Marathi)** across 4 modular namespaces (`common`, `wizard`, `help`, `errors`).
- Dynamic on-demand loading of local **Google Noto Sans** woff2 font subsets via `loadScriptFont` — zero eager font weight on initial load.
- Logical CSS layout properties (`margin-inline`, `padding-inline`, `border-inline-start`) and relaxed line heights (`1.6`) to prevent Indic vowel matras and conjunct glyphs from clipping.

### 4. 📴 PWA & Offline Resilience

- **Vite PWA & Workbox Service Worker**: Configured with `NetworkFirst` (3s timeout) caching for HTML navigations to eliminate stale-shell bugs on redeploy while guaranteeing full offline availability.
- **Ambient offline UX**: Ambient top banner (`"⚠️ You are offline"`), SaveIndicator mode shift to `"Saved Offline"`, and auto-dismiss green toast on reconnect.
- **Offline Guard**: Allows full offline draft editing and document review; guards payment submission with a reassuring reconnect modal.

### 5. ♿ Accessibility (WCAG 2.1 AA)

- **Zero axe-core violations** verified across all 5 stages and modal dialogs.
- 48px minimum touch targets and AA contrast ratios on all interactive elements.
- **`A11yAnnouncer`** polite & assertive ARIA live regions for screen-reader stage transitions and status updates.
- Programmatic focus management shifting focus smoothly to top headings or `ErrorSummary` on step transitions.

### 6. 💡 Contextual Help & Privacy Architecture

- **Persistent Help Escape Hatch**: Slide-over FAQ sheet accessible anytime with instant keyword search and category filters.
- **Jargon Tooltips**: Tap-to-expand `(i)` triggers on complex fields with plain-language definitions and an SVG Indian passport bio-page diagram.
- **Privacy & Trust**: Stage 2 pre-flight 3-pillar data protection card, discrete lock micro-cues on sensitive inputs, Review stage security seal, and a public computer storage purge utility (`ClearDataModal`).

---

## 🔍 What's Real vs. What's Mocked?

VisaReThink is a self-contained prototype demonstrating a complete applicant journey without charging real money or touching live government databases:

| Feature / Subsystem                |    Status     | Implementation Details                                                                                                                                |
| ---------------------------------- | :-----------: | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Form Wizard & State Engine**     |  🟢 **REAL**  | Built with **XState 5**; pure state machine deriving step statuses and progress from answers.                                                         |
| **Draft Persistence Engine**       |  🟢 **REAL**  | Debounced local storage autosave with `pagehide` flush; survives tab kills and reloads.                                                               |
| **Document Storage & Compression** |  🟢 **REAL**  | Client-side Canvas image compression (≤2MB) backed by browser **IndexedDB** (`idb-keyval`).                                                           |
| **PWA & Offline Service Worker**   |  🟢 **REAL**  | **Workbox Service Worker** with `NetworkFirst` navigation caching and `StaleWhileRevalidate` assets.                                                  |
| **Six-Language Localization**      |  🟢 **REAL**  | Full **i18next** runtime across EN, HI, TA, TE, KN, MR with dynamic bundle loading.                                                                   |
| **Indic Font Loader**              |  🟢 **REAL**  | Dynamic on-demand loader for local **Google Noto Sans** woff2 font subsets.                                                                           |
| **Accessibility (a11y)**           |  🟢 **REAL**  | **WCAG 2.1 AA** compliant across all routes: 48px touch targets, live regions, focus manager.                                                         |
| **Government Passport MEA Lookup** | 🟡 **MOCKED** | Simulated via `MockPassportLookupService` (auto-fills mock names; checks duplicates against seeded passports like `Z1234567`).                        |
| **Payment Gateway (Razorpay/UPI)** | 🟡 **MOCKED** | Simulated via `MockPaymentService` (no real money moves). Includes interactive test scenario bar (`Success`, `Declined`, `Timeout`, `Network Error`). |
| **SMS & Email Delivery**           | 🟡 **MOCKED** | Dispatched through `MockNotificationService`; renders live in-app toasts and expandable preview card on Stage 5.                                      |
| **Consulate Status Tracker**       | 🟡 **MOCKED** | Driven by `MockTrackingService` with interactive demo controls (`[Advance Status]`, `[Simulate Approval]`).                                           |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Zephyrxx0/horizon.git
   cd horizon
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the development server:**

   ```bash
   pnpm dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:5173
   ```
   _(Tip: Open Chrome DevTools in Mobile Emulation mode to experience the mobile-first UX)._

---

## 🛠️ Available Scripts

| Script             | Command                       | Description                                                                 |
| ------------------ | ----------------------------- | --------------------------------------------------------------------------- |
| **Development**    | `pnpm dev`                    | Starts Vite dev server with Hot Module Replacement (HMR).                   |
| **Build**          | `pnpm build`                  | Typechecks with `tsc` and compiles optimized production build into `dist/`. |
| **Preview**        | `pnpm preview`                | Serves the production build locally with PWA service worker registered.     |
| **Unit Tests**     | `pnpm test`                   | Runs the full Vitest test suite (96 files, 342 tests).                      |
| **Accessibility**  | `pnpm vitest run tests/a11y/` | Runs Vitest axe-core integration accessibility suite.                       |
| **E2E Tests**      | `pnpm e2e`                    | Runs Playwright end-to-end user journey tests.                              |
| **Typecheck**      | `pnpm typecheck`              | Validates TypeScript types across the entire project (`tsc -b`).            |
| **Lint**           | `pnpm lint`                   | Runs ESLint with React Hooks, JSX a11y, and TypeScript rules.               |
| **Format**         | `pnpm format`                 | Formats all code files using Prettier.                                      |
| **Font Budget**    | `pnpm check:fonts`            | Asserts 0 eager Indic fonts on initial load and subsets ≤80KB.              |
| **Contrast Check** | `pnpm check:contrast`         | Asserts WCAG AA contrast compliance across all design tokens.               |

---

## 📁 Project Structure

```
horizon/
├── src/
│   ├── components/            # Reusable UI components & AppShell
│   │   ├── ui/                # Accessible design system primitives (Button, Card, Field, Sheet, Toast, etc.)
│   │   ├── AppShell.tsx       # Header, skip links, offline banner, floating help button
│   │   ├── LanguageSwitcher.tsx # Indic language selection dropdown
│   │   ├── SaveIndicator.tsx  # Reactive autosave and offline status badge
│   │   └── A11yAnnouncer.tsx  # ARIA live region manager for assistive technology
│   ├── features/              # Feature modules by stage
│   │   ├── visa/              # Stage 1: Visa selection & recommendations
│   │   ├── personal/          # Stage 2: Personal details, identity & contact sub-steps
│   │   ├── documents/         # Stage 3: Document uploads, quality checks & templates
│   │   ├── review/            # Stage 4: Check answers, fee calculator & payment gateway
│   │   ├── confirmation/      # Stage 5: Reference number, status timeline & checklist
│   │   ├── support/           # Help escape hatch, FAQ sheet & jargon tooltips
│   │   ├── trust/             # Privacy trust cards, security badges & data wipe modal
│   │   ├── pwa/               # Network status monitor, install banners & offline guard
│   │   └── wizard/            # XState machine, context, selectors & validators
│   ├── i18n/                  # i18next configuration and 6-language locale dictionaries
│   │   └── locales/{en,hi,ta,te,kn,mr}/ # common, wizard, help, errors namespaces
│   ├── persistence/           # LocalStorage autosave & IndexedDB document storage
│   ├── services/              # Typed mock service layer (passport, payment, tracking, backup)
│   ├── styles/                # Tailwind CSS & theme tokens
│   ├── fonts.ts               # Dynamic Indic font subset loader
│   ├── main.tsx               # App entry point & Service Worker registration
│   └── App.tsx                # Top-level wizard orchestration & modal routing
├── tests/
│   ├── a11y/                  # Vitest axe-core whole-journey accessibility suite
│   └── e2e/                   # Playwright E2E journey, axe audit, and 3G performance tests
├── scripts/                   # CI verification scripts (font budget, contrast check)
└── .planning/                 # Project roadmap, requirements, and phase planning specs
```

---

## 🧪 Quality & Hardening Gates

- **Unit & Integration Suite**: 96 test files, **342/342 passed** (100% pass rate)
- **Accessibility Gate**: 14 automated Vitest axe-core test cases + Playwright full journey axe scan (**0 WCAG 2.1 AA violations**)
- **3G Performance Gate**: Playwright throttled 3G profile (400ms latency, 400kbps throughput, 4x CPU slowdown) verifying LCP < 2.5s and CLS < 0.1
- **Font Payload Gate**: Zero eager Indic fonts requested on initial English load

---

## 📄 License

MIT License. Designed and built with ❤️ for Indian international travelers.
