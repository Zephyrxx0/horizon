# Phase 6: Support, Localization, PWA & Hardening — Technical Research Report

**Gathered:** 2026-08-26
**Requirements Covered:** SUPRT-01, SUPRT-02, TRUST-01, I18N-01, I18N-02, I18N-03, A11Y-01, A11Y-02, PERF-01, PWA-01, PWA-02

---

## 1. PWA & Service Worker Architecture (PWA-01, PWA-02)

### 1.1 Dependency & Setup

- **`vite-plugin-pwa`** must be added to devDependencies: `pnpm add -D vite-plugin-pwa workbox-window`.
- In `vite.config.ts`, integrate `VitePWA` with `registerType: 'autoUpdate'`.

### 1.2 Workbox Caching Strategy (Eliminating Stale-Shell Bug)

- **HTML / Navigation Routes (`request.mode === 'navigate'`)**:
  - Strategy: `NetworkFirst` with a 3-second network timeout.
  - Rationale: Guarantees that users with an active internet connection always receive the latest deployment immediately without stale-shell bugs, while seamlessly falling back to cached HTML when offline.
  - Cache name: `pages-navigations-cache`.
- **Hashed JavaScript & CSS (`assets/*.{js,css}`)**:
  - Strategy: `StaleWhileRevalidate` with `maxEntries: 60`, `maxAgeSeconds: 30 * 24 * 60 * 60` (30 days).
  - Cache name: `static-resources-cache`.
- **Indic Script Font Subsets (`@fontsource/noto-sans-*`) & Webfonts (`*.woff2`)**:
  - Strategy: `CacheFirst` with `maxEntries: 30`, `maxAgeSeconds: 365 * 24 * 60 * 60` (1 year).
  - Cache name: `fonts-cache`.
- **Static Assets & Icons (`*.{svg,png,jpg,webp,ico}`)**:
  - Strategy: `StaleWhileRevalidate` with `maxEntries: 50`.
  - Cache name: `media-cache`.

### 1.3 Web App Manifest Configuration

```ts
manifest: {
  name: 'VisaReThink — Reimagined Indian Visa Portal',
  short_name: 'VisaReThink',
  description: 'Fast, offline-resilient, guided visa application portal for India.',
  theme_color: '#3730a3',
  background_color: '#f7f7fa',
  display: 'standalone',
  orientation: 'portrait-primary',
  start_url: '/',
  scope: '/',
  icons: [
    {
      src: '/icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: '/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ]
}
```

### 1.4 Reactive Network & Install Hooks

- **`useNetworkStatus.ts`**:
  - Tracks `navigator.onLine` with `window.addEventListener('online', ...)` and `window.addEventListener('offline', ...)`.
  - Exposes `{ isOnline, wasOffline, isReconnected }`.
  - On `online` transition: triggers an auto-dismiss toast (`"🌐 Connection restored — cloud draft synced"`) and flushes any pending debounced saves.
- **`useInstallPrompt.ts`**:
  - Captures `beforeinstallprompt` event, calls `e.preventDefault()`, and stores the deferred prompt in state.
  - Exposes `{ isInstallable, promptToInstall, isInstalled }`.
- **UI Integrations**:
  - `OfflineBanner.tsx`: Ambient top banner rendered below header when `!isOnline` (`"⚠️ You are offline — all answers and documents remain safely saved locally"`).
  - `SaveIndicator.tsx`: Displays `"Saved Offline"` in amber when offline instead of green `"Saved"`.
  - `InstallPromptBanner.tsx`: Header "Install App" button + contextual card after Stage 1 completion explaining offline benefits.
  - `OfflineGuardModal.tsx`: Intercepts payment submission / live duplicate checking when offline with a reassuring modal explaining drafts are safe and requesting a brief reconnect.

---

## 2. Localization & Indic Script Rendering (I18N-01, I18N-02, I18N-03)

### 2.1 Locale Namespaces & Structure

Structure under `src/i18n/locales/{en,hi,ta,te,kn,mr}/`:

1. **`common.json`**: App title, header/footer, skip links, actions (back, continue, cancel, close), save indicator states (`idle`, `dirty`, `saving`, `saved`, `offline`, `error`), draft clear dialog, offline notice.
2. **`wizard.json`**: All stage titles, step names, field labels, placeholders, hints, validation messages, visa recommendation cards, document slot titles & guidelines, fee breakdown labels, timeline step titles, checklist items.
3. **`help.json`**: FAQ categories (Passport, Documents, Payment, Tracking, General), 15–20 Q&A items, jargon definitions with examples, helpline info, support ticket form labels.
4. **`errors.json`**: Granular error summaries, field validation errors (e.g., passport format, date range, file size, quota exceeded, duplicate passport warning), network recovery errors.

### 2.2 `src/i18n/index.ts` Enhancements

- Expand default namespaces: `export const NAMESPACES = ['common', 'wizard', 'help', 'errors'] as const;`.
- In `changeLocale(lng)`: Dynamically load and register all 4 namespace bundles for the selected Indic language (`Promise.all([import(...common.json), import(...wizard.json), ...])`).
- Update `document.documentElement.lang = lng` and announce the switch via `A11yAnnouncer`.

### 2.3 Dynamic Indic Font Loading in `src/fonts.ts`

- English/Latin base font (`@fontsource/noto-sans/latin-400.css`, `latin-600.css`) is bundled initially.
- On `changeLocale(lng)`:
  - `hi` & `mr`: imports `@fontsource/noto-sans-devanagari/400.css` & `600.css`.
  - `ta`: imports `@fontsource/noto-sans-tamil/400.css` & `600.css`.
  - `te`: imports `@fontsource/noto-sans-telugu/400.css` & `600.css`.
  - `kn`: imports `@fontsource/noto-sans-kannada/400.css` & `600.css`.
- Fallback stack in `theme.css`:
  `--font-sans: 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Kannada', 'Nirmala UI', system-ui, sans-serif;`
- Verified by `scripts/check-font-budget.mjs`: No Indic font in initial `index.html` (zero eager weight), all subsets <= 80KB.

### 2.4 Logical CSS & Layout Integrity Audit

- Audit all layout containers for CSS Logical Properties (`margin-inline`, `padding-inline`, `border-inline-start`, `start`/`end` alignments).
- Set proper line-height (e.g. `leading-relaxed` / `1.6`) and vertical padding on inputs to ensure Indic vowel marks (_matras_ and conjunct ligatures) are never visually clipped.

---

## 3. Help & Support UX & Jargon Tooltips (SUPRT-01, SUPRT-02)

### 3.1 Component Architecture in `src/features/support/`

- **`FaqSheet.tsx`**:
  - Accessible slide-over `Sheet` triggered via `AppHeader` ("Need Help?") and floating bottom-right `?` button.
  - Search bar with instant real-time keyword filtering across questions, answers, and tags.
  - Category filter chips: `All`, `Passport`, `Documents`, `Payment`, `Tracking`, `General`.
  - Expandable accordion items with `aria-expanded` and keyboard navigation.
  - Bottom fallback card: Toll-free mock helpline (+91-1800-VISA-HELP), operating hours, and "Submit Query / Request Callback" button.
- **`faqCatalog.ts`**:
  - Typed dataset of 18 curated questions with category, question, answer, and search tags.
- **`SupportTicketModal.tsx`**:
  - Accessible dialog for applicant callback/query requests (Name, Phone/Email, Issue Category, Description).
  - Generates mock ticket reference (e.g. `TKT-1800-84920`) and triggers success toast.
- **`JargonTooltip.tsx`**:
  - 48px touch target button `(i)` placed beside field labels in `FieldLabel`.
  - Tap-to-expand inline micro-card or popover explaining complex terms:
    - "Given Name vs Surname"
    - "Date of Issue vs Expiry"
    - "Place of Issue"
    - "CVV / Security Code"
    - "VPA ID / UPI Handle"
- **`PassportDiagram.tsx`**:
  - Mini SVG visual representing the Indian passport bio-data page highlighting Zone 1 (Surname), Zone 2 (Given Name), Date of Issue, Date of Expiry, Place of Issue, and MRZ Zone.

---

## 4. Privacy, Trust & Shared Computer Cleanup (TRUST-01)

### 4.1 Component Architecture in `src/features/trust/`

- **`PrivacyTrustCard.tsx`**:
  - Pre-flight card rendered at the top of Stage 2 (Personal Details) before any PII entry.
  - 3 Core Pillars:
    1. 🔒 **Stored on Your Device**: Answers are stored locally in your browser, never sent to unverified servers.
    2. 🚫 **Never Shared or Sold**: Zero third-party tracking or advertising scripts.
    3. 🛡️ **Bank-Grade Simulated Security**: All document uploads are encrypted and isolated.
  - "Read our Privacy Promise" link opening `PrivacyPromiseSheet.tsx`.
- **`PrivacyPromiseSheet.tsx`**:
  - Accessible `Sheet` detailing data retention, local encryption, client-side document processing, and right-to-erase guarantees.
- **Contextual Lock Micro-Cues**:
  - Discrete `🔒 Kept secure on this device` caption and lock icon on sensitive inputs (Passport number, phone, email, payment fields).
- **`SecuritySealBadge.tsx`**:
  - Trust badge on Stage 4 (Review & Payment) displaying application integrity seal, TLS 1.3 encryption indicator, and MEA compliance notice.

### 4.2 Shared Computer Cleanup (`ClearDataModal.tsx` & `clearAllDraftData`)

- **`src/persistence/cleanup.ts`**:
  - Clears `visarethink.*` from localStorage and wipes the IndexedDB document store via `clear(docStore)` from `idb-keyval`.
- **`ClearDataModal.tsx`**:
  - Accessible 2-step confirmation modal triggered from header/footer ("Clear Draft / Public Computer Reset").
  - Warning banner reminding user to back up their draft code if they wish to resume elsewhere.

---

## 5. Accessibility & Hardening Gates (A11Y-01, A11Y-02, PERF-01)

### 5.1 `A11yAnnouncer.tsx` & Focus Management

- **`A11yAnnouncer.tsx`**:
  - Visually hidden live regions:
    - `<div role="status" aria-live="polite" aria-atomic="true">` for stage progress announcements, save confirmations, and language switches.
    - `<div role="alert" aria-live="assertive" aria-atomic="true">` for critical errors and quota warnings.
- **Focus Management**:
  - On step transitions (`currentStepId` change): automatically shift focus to the active screen's top `<h1>` heading or `ErrorSummary` (if validation errors are present), ensuring screen reader users never lose their place.

### 5.2 Automated Accessibility (axe-core) Test Suite

- Vitest axe tests for all new Phase 6 components.
- Full journey axe-core verification across all 5 stages in `tests/a11y/journey-a11y.test.tsx` with zero violations.

### 5.3 Throttled 3G Profile & Core Web Vitals (PERF-01)

- **`tests/e2e/perf-3g.spec.ts`**:
  - Playwright test with CDP session emulation:
    - Network conditions: 400ms latency, 400 kb/s download, 400 kb/s upload (Regular 3G profile).
    - CPU throttling: 4x slowdown on mobile viewport (390x844).
  - Assertions:
    - LCP (Largest Contentful Paint) < 2.5s
    - CLS (Cumulative Layout Shift) < 0.1
    - Initial HTML payload clean of eager Indic fonts.
