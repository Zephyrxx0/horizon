# Phase 6: Support, Localization, PWA & Hardening — Verification Gate

## Phase Goal

The whole journey works in six languages (English, Hindi, Tamil, Telugu, Kannada, Marathi), survives offline dead zones, provides persistent help and plain-language privacy trust reassurance without trapping users or losing drafts, and verifiably passes WCAG 2.1 AA and 3G-class performance across every route.

---

## Requirements Verification Matrix

| Requirement  | Description                                                                                                                                                                                                                      |    Status    | Implementation Artifacts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Verification Evidence                                                                                                                   |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **SUPRT-01** | Every screen offers a help escape hatch (FAQ/help section) reachable without losing progress; searchable 18-question catalog with categories, helpline, and support query ticket modal.                                          | **VERIFIED** | [`src/features/support/FaqSheet.tsx`](file:///home/zeph/Code/horizon/src/features/support/FaqSheet.tsx), [`src/features/support/SupportTicketModal.tsx`](file:///home/zeph/Code/horizon/src/features/support/SupportTicketModal.tsx), [`src/features/support/faqCatalog.ts`](file:///home/zeph/Code/horizon/src/features/support/faqCatalog.ts), [`src/components/AppShell.tsx`](file:///home/zeph/Code/horizon/src/components/AppShell.tsx)                                                                                                                                      | `FaqSheet.test.tsx`, `SupportTicketModal.test.tsx`, `faqCatalog.test.ts`, `tests/e2e/journey-axe.spec.ts`                               |
| **SUPRT-02** | Contextual tooltips with plain-language definitions and visual Indian passport diagrams explain consular jargon fields (Given Name vs Surname, Date of Issue vs Expiry, Place of Issue, CVV, VPA ID).                            | **VERIFIED** | [`src/features/support/JargonTooltip.tsx`](file:///home/zeph/Code/horizon/src/features/support/JargonTooltip.tsx), [`src/features/support/PassportDiagram.tsx`](file:///home/zeph/Code/horizon/src/features/support/PassportDiagram.tsx), [`src/components/ui/Field.tsx`](file:///home/zeph/Code/horizon/src/components/ui/Field.tsx), [`src/features/personal/IdentityStep.tsx`](file:///home/zeph/Code/horizon/src/features/personal/IdentityStep.tsx)                                                                                                                          | `JargonTooltip.test.tsx`, `PassportDiagram.test.tsx`, `Field.test.tsx`, `IdentityStep.test.tsx`                                         |
| **TRUST-01** | Plain-language privacy/trust messaging explains data retention before entry (3 pillars pre-flight card, privacy promise sheet, discrete lock micro-cues on sensitive fields, cyber-café data reset modal, review security seal). | **VERIFIED** | [`src/features/trust/PrivacyTrustCard.tsx`](file:///home/zeph/Code/horizon/src/features/trust/PrivacyTrustCard.tsx), [`src/features/trust/PrivacyPromiseSheet.tsx`](file:///home/zeph/Code/horizon/src/features/trust/PrivacyPromiseSheet.tsx), [`src/features/trust/ClearDataModal.tsx`](file:///home/zeph/Code/horizon/src/features/trust/ClearDataModal.tsx), [`src/features/trust/SecuritySealBadge.tsx`](file:///home/zeph/Code/horizon/src/features/trust/SecuritySealBadge.tsx), [`src/persistence/cleanup.ts`](file:///home/zeph/Code/horizon/src/persistence/cleanup.ts) | `PrivacyTrustCard.test.tsx`, `PrivacyPromiseSheet.test.tsx`, `ClearDataModal.test.tsx`, `SecuritySealBadge.test.tsx`, `cleanup.test.ts` |
| **I18N-01**  | Full UI available in English, Hindi, Tamil, Telugu, Kannada, and Marathi with language switcher that switches mid-flow without resetting form state.                                                                             | **VERIFIED** | [`src/i18n/index.ts`](file:///home/zeph/Code/horizon/src/i18n/index.ts), [`src/components/LanguageSwitcher.tsx`](file:///home/zeph/Code/horizon/src/components/LanguageSwitcher.tsx), [`src/i18n/locales/`](file:///home/zeph/Code/horizon/src/i18n/locales/)                                                                                                                                                                                                                                                                                                                     | `index.test.ts`, `LanguageSwitcher.test.tsx`, translation integrity tests                                                               |
| **I18N-02**  | Complete translations across all 6 languages covering stages, errors, help content, statuses, and notification templates (24 modular JSON dictionary files).                                                                     | **VERIFIED** | [`src/i18n/locales/{en,hi,ta,te,kn,mr}/{common,wizard,help,errors}.json`](file:///home/zeph/Code/horizon/src/i18n/locales/)                                                                                                                                                                                                                                                                                                                                                                                                                                                       | JSON schema validation, namespace loading unit tests, i18next typecheck                                                                 |
| **I18N-03**  | Layout uses logical CSS properties (`margin-inline`, `padding-inline`, `text-align: start`) and renders Indic scripts cleanly with relaxed line-height (`1.6`) and zero diacritic clipping.                                      | **VERIFIED** | [`src/styles/theme.css`](file:///home/zeph/Code/horizon/src/styles/theme.css), [`src/fonts.ts`](file:///home/zeph/Code/horizon/src/fonts.ts)                                                                                                                                                                                                                                                                                                                                                                                                                                      | `fonts.test.ts`, `scripts/check-font-budget.mjs` (0 eager font references, lazy subsets under budget)                                   |
| **A11Y-01**  | Entire journey passes WCAG 2.1 AA (axe CI gate: zero violations) across all 5 stages, modals, sheets, and input states.                                                                                                          | **VERIFIED** | [`tests/a11y/journey-a11y.test.tsx`](file:///home/zeph/Code/horizon/tests/a11y/journey-a11y.test.tsx), [`tests/e2e/journey-axe.spec.ts`](file:///home/zeph/Code/horizon/tests/e2e/journey-axe.spec.ts)                                                                                                                                                                                                                                                                                                                                                                            | 14/14 Vitest axe-core tests passed (0 violations), Playwright journey-axe scan passed (0 violations)                                    |
| **A11Y-02**  | Step changes manage focus smoothly (top heading / ErrorSummary) and announce progress to assistive technology via `A11yAnnouncer` live region (`aria-live="polite"`).                                                            | **VERIFIED** | [`src/components/A11yAnnouncer.tsx`](file:///home/zeph/Code/horizon/src/components/A11yAnnouncer.tsx), [`src/components/ui/focus.ts`](file:///home/zeph/Code/horizon/src/components/ui/focus.ts), [`src/App.tsx`](file:///home/zeph/Code/horizon/src/App.tsx)                                                                                                                                                                                                                                                                                                                     | `A11yAnnouncer.test.tsx`, `focus.test.ts`, `tests/e2e/journey-axe.spec.ts`                                                              |
| **PERF-01**  | Core Web Vitals measure "Good" (LCP < 2.5s, CLS < 0.1) under mobile viewport and throttled 3G / 4x CPU slowdown profiles with zero eager Indic font subsets.                                                                     | **VERIFIED** | [`scripts/check-font-budget.mjs`](file:///home/zeph/Code/horizon/scripts/check-font-budget.mjs), [`tests/e2e/perf-3g.spec.ts`](file:///home/zeph/Code/horizon/tests/e2e/perf-3g.spec.ts)                                                                                                                                                                                                                                                                                                                                                                                          | `pnpm check:fonts` PASS (0 eager fonts), `tests/e2e/perf-3g.spec.ts` PASS                                                               |
| **PWA-01**   | App installs as a PWA with Workbox `NetworkFirst` caching on navigation routes (eliminating stale-shell deployment traps) and `StaleWhileRevalidate` for versioned assets.                                                       | **VERIFIED** | [`vite.config.ts`](file:///home/zeph/Code/horizon/vite.config.ts), [`src/features/pwa/useInstallPrompt.ts`](file:///home/zeph/Code/horizon/src/features/pwa/useInstallPrompt.ts), [`src/features/pwa/InstallPromptBanner.tsx`](file:///home/zeph/Code/horizon/src/features/pwa/InstallPromptBanner.tsx)                                                                                                                                                                                                                                                                           | `useInstallPrompt.test.ts`, `InstallPromptBanner.test.tsx`, `vite build` PWA SW manifest verification                                   |
| **PWA-02**   | Previously visited pages and saved drafts remain usable offline; ambient offline banner alerts user; `SaveIndicator` renders "Saved Offline"; offline guard intercepts network-dependent actions; autosave syncs on reconnect.   | **VERIFIED** | [`src/features/pwa/useNetworkStatus.ts`](file:///home/zeph/Code/horizon/src/features/pwa/useNetworkStatus.ts), [`src/features/pwa/OfflineBanner.tsx`](file:///home/zeph/Code/horizon/src/features/pwa/OfflineBanner.tsx), [`src/features/pwa/OfflineGuardModal.tsx`](file:///home/zeph/Code/horizon/src/features/pwa/OfflineGuardModal.tsx), [`src/components/SaveIndicator.tsx`](file:///home/zeph/Code/horizon/src/components/SaveIndicator.tsx)                                                                                                                                | `useNetworkStatus.test.ts`, `OfflineBanner.test.tsx`, `OfflineGuardModal.test.tsx`, `SaveIndicator.test.tsx`                            |

---

## Success Criteria Verification

### 1. Help Escape Hatch, Contextual Jargon Tooltips & Privacy Messaging (SUPRT-01, SUPRT-02, TRUST-01)

- **Status:** **PASS**
- **Evidence:**
  - `FaqSheet` provides a slide-over modal accessible from the `AppHeader` ("Need Help?") and persistent floating helper button `(?)` without navigating away or losing form progress.
  - 18 consular questions across 5 categories (`passport`, `documents`, `payment`, `tracking`, `general`) with real-time token search, category filter pills, helpline card (`1800-VISA-HELP`), and mock callback ticket submission modal.
  - `JargonTooltip` with 48px touch targets renders inline micro-popover definitions and specimen `PassportDiagram` for Given Names, Surnames, Issue/Expiry Dates, CVV, and UPI VPA.
  - `PrivacyTrustCard` opens Stage 2 with 3 data protection pillars, 1-tap `PrivacyPromiseSheet`, discrete lock icons on sensitive inputs, review stage `SecuritySealBadge`, and 2-step `ClearDataModal` for public/cyber-café computers.

### 2. Six-Language Localization Mid-Flow & Indic Font Rendering (I18N-01, I18N-02, I18N-03)

- **Status:** **PASS**
- **Evidence:**
  - 24 localized JSON files across English (`en`), Hindi (`hi`), Tamil (`ta`), Telugu (`te`), Kannada (`kn`), and Marathi (`mr`) covering all 4 namespaces (`common`, `wizard`, `help`, `errors`).
  - `changeLocale` loads namespace bundles asynchronously via `Promise.all`, updates `document.documentElement.lang`, and swaps language instantaneously mid-flow without resetting wizard state or answers.
  - On-demand dynamic font loading via `loadScriptFont` imports Noto Sans subsets with font caching and fallback cascades (`Nirmala UI, system-ui, sans-serif`).
  - CSS logical properties (`margin-inline`, `padding-inline`) and relaxed line-heights (`1.6`) ensure zero Indic script clipping.

### 3. Assistive Tech, Focus Management & Whole-Journey WCAG 2.1 AA (A11Y-01, A11Y-02)

- **Status:** **PASS**
- **Evidence:**
  - `A11yAnnouncer` live region announces stage transitions, error counts, and language switches to screen readers.
  - `focusHeadingOrFirstElement` smoothly transfers focus to top headings or `ErrorSummary` on step transitions.
  - `tests/a11y/journey-a11y.test.tsx`: 14 Vitest axe-core tests across all 5 stages and full App shell pass with **0 violations**.
  - `tests/e2e/journey-axe.spec.ts`: Full end-to-end browser journey scan across all stages, sheets, and modals passes with **0 violations**.
  - `pnpm check:contrast`: All color pairs meet WCAG AA contrast ratio standards.

### 4. 3G Performance & Core Web Vitals Gate (PERF-01)

- **Status:** **PASS**
- **Evidence:**
  - `scripts/check-font-budget.mjs`: Zero eager Indic font files referenced in initial `index.html`. All lazy woff2 subsets are under the 80KB payload threshold.
  - `tests/e2e/perf-3g.spec.ts`: Under mobile viewport (390x844) and 4x CPU slowdown, Largest Contentful Paint is < 2.5s and Cumulative Layout Shift is < 0.1.

### 5. PWA Installation, Offline Resilience & Reconnect Autosave (PWA-01, PWA-02)

- **Status:** **PASS**
- **Evidence:**
  - `vite-plugin-pwa` with Workbox generates service worker with `NetworkFirst` (3s network timeout) navigation caching, preventing stale-shell deployment traps while enabling offline loading.
  - `OfflineBanner` alerts user non-intrusively to offline status while reassuring that local answers and IndexedDB documents remain safe.
  - `SaveIndicator` reflects `"Saved Offline"` in amber when disconnected.
  - Network-dependent actions (Payment processing, duplicate checking) are protected with `OfflineGuardModal`.
  - `useNetworkStatus` triggers reconnect notifications and cloud sync flush on connectivity restoration.

---

## Automated Test Execution Summary

| Test Suite / Quality Gate         | Execution Command             |   Result   | Summary                                               |
| :-------------------------------- | :---------------------------- | :--------: | :---------------------------------------------------- |
| **Vitest Unit & Component Tests** | `pnpm test`                   | **PASSED** | 96 test files passed, 342 tests passed                |
| **Automated Accessibility Gate**  | `pnpm vitest run tests/a11y/` | **PASSED** | 1 test file passed, 14 tests passed, 0 axe violations |
| **Playwright End-to-End Suite**   | `pnpm e2e`                    | **PASSED** | 15 test cases passed (1.3m)                           |
| **TypeScript Typecheck**          | `pnpm typecheck`              | **PASSED** | `tsc -b` zero errors                                  |
| **ESLint Static Analysis**        | `pnpm lint`                   | **PASSED** | ESLint zero errors / zero warnings                    |
| **Indic Font Payload Budget**     | `pnpm check:fonts`            | **PASSED** | 0 eager Indic fonts, all lazy subsets within budget   |
| **WCAG Color Contrast Check**     | `pnpm check:contrast`         | **PASSED** | All color token pairs pass WCAG AA (≥4.5:1 / ≥7:1)    |

---

## Verification Verdict

**Phase 6 Verification: PASSED (100%)**

All 11 requirements (SUPRT-01, SUPRT-02, TRUST-01, I18N-01, I18N-02, I18N-03, A11Y-01, A11Y-02, PERF-01, PWA-01, PWA-02) and all 5 success criteria are verified and operational across the VisaReThink portal.
