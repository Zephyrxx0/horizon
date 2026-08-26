# Phase 6: Support, Localization, PWA & Hardening - Context

**Gathered:** 2026-08-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 completes the entire cross-cutting quality, accessibility, localization, support, and offline resilience scope for VisaReThink (SUPRT-01, SUPRT-02, TRUST-01, I18N-01, I18N-02, I18N-03, A11Y-01, A11Y-02, PERF-01, PWA-01, PWA-02):

1. **Persistent Help & Support Escape Hatch (SUPRT-01)** — Accessible slide-over FAQ sheet triggered from AppHeader and floating bottom helper button without navigating away or losing form progress. Searchable 15–20 question catalog with instant keyword filter, category chips, and simulated escalation/callback request modal.
2. **Contextual Jargon Tooltips (SUPRT-02)** — Tap-to-expand inline micro-cards / popovers on 48px touch targets beside complex fields ("Given Name vs Surname", "Date of Issue vs Expiry", "Place of Issue", "CVV", "VPA ID") with plain-language definitions and visual passport diagrams.
3. **Plain-Language Privacy & Trust Reassurance (TRUST-01)** — Stage 2 pre-flight "Your Data & Privacy" card featuring 3 key pillars (stored locally on device, never shared/sold, bank-grade encryption) with 1-tap expandable "Privacy Promise", discrete lock micro-cues on sensitive inputs, "Reset / Clear All Local Data" control for cyber-café users, and Review-stage security seal.
4. **Comprehensive 6-Language Localization (I18N-01, I18N-02, I18N-03)** — High-fidelity modular dictionaries (`common`, `wizard`, `help`, `errors`) across English, Hindi, Tamil, Telugu, Kannada, and Marathi. Logical CSS layout properties (`margin-inline`, `padding-inline`, `text-align: start`) for RTL-ready structure and pristine Indic script rendering.
5. **Indic Typography & 3G Payload Budget (FOUND-04, I18N-03, PERF-01)** — On-demand script font loading via `loadScriptFont` for Noto Sans subsets with `font-display: swap` and system Indic fallback cascades (`system-ui, Nirmala UI, sans-serif`), keeping initial English bundle zero-weight.
6. **Full-Journey WCAG 2.1 AA Accessibility & Focus Management (A11Y-01, A11Y-02)** — Dedicated `A11yAnnouncer` live region (`aria-live="polite"` / `"assertive"`) announcing step transitions, validation errors, and language switches, paired with programmatic focus shifts to top headings or `ErrorSummary`. Zero axe-core violations across all 5 stages.
7. **PWA Offline Resilience & Queue-Safe Autosave (PWA-01, PWA-02)** — `vite-plugin-pwa` with Workbox `NetworkFirst` navigation caching (eliminating stale-shell deployment issues) and `StaleWhileRevalidate` for versioned assets. Ambient top offline banner, `SaveIndicator` mode shift to "Saved Offline", graceful submission guard modal, and automatic reconnect background sync toast.
8. **Automated Quality & Performance Hardening Gates (PERF-01, A11Y-01)** — Automated Vitest axe-core test suite and Playwright journey audits running under throttled 3G network and mid-tier Android emulation profiles (LCP < 2.5s, CLS < 0.1, INP < 200ms).
</domain>

<decisions>
## Implementation Decisions

### Help & Support UX (SUPRT-01, SUPRT-02)

- **D-01:** The help escape hatch (SUPRT-01) is accessible via dual entry points: a "Need Help?" action in the `AppHeader` and a persistent floating bottom-right helper button (`?`), opening an accessible slide-over `Sheet` without altering URL or resetting wizard state. — **Reversibility:** costly — integrates into `AppShell`, `AppHeader`, and wizard layout.
- **D-02:** Contextual jargon explanations (SUPRT-02) use an accessible `(i)` button on 48px touch targets beside field labels that expands an inline micro-popover card with plain-language definitions and visual passport page diagrams. — **Reversibility:** costly — touches form field components in `src/components/ui/Field.tsx` and stage forms.
- **D-03:** The FAQ catalog consists of 15–20 curated questions structured across 5 categories (Passport, Documents, Payment, Tracking, General) with instant client-side keyword filtering and category filter chips. — **Reversibility:** reversible — FAQ dataset and search component in `src/features/support/`.
- **D-04:** Escalation support includes an in-sheet fallback card featuring a toll-free simulated helpline (+91-1800-VISA-HELP), operating hours, and a 1-tap "Request Callback / Submit Query" modal generating a mock ticket ID with instant toast confirmation. — **Reversibility:** reversible — support ticket modal and mock service integration.

### Privacy & Trust Placement (TRUST-01)

- **D-05:** Stage 2 Personal Details opens with a prominent "Your Data & Privacy" pre-flight card establishing 3 core pillars (Local device storage only, Zero third-party sharing, Bank-grade simulated encryption) with a 1-tap expandable "Privacy Promise" disclosure sheet. — **Reversibility:** costly — affects Stage 2 entry flow in `src/features/personal/`.
- **D-06:** Sensitive inputs (Passport number, national ID, phone, payment inputs) render discrete micro-trust cues with a lock icon and reassurance caption ("🔒 Kept secure on this device until final submission"). — **Reversibility:** costly — field-level styling across personal and review stages.
- **D-07:** Applicants on shared/public devices have access to an explicit "Reset / Clear All Local Data" action in the `AppHeader` and footer with a 2-step confirmation dialog wiping IndexedDB and localStorage with a draft backup reminder. — **Reversibility:** costly — storage purge utility and state machine reset hook.
- **D-08:** The Review & Submission stage displays a "Secure Submission & Integrity" trust box featuring an application integrity seal, simulated TLS 1.3 encryption badge, and MEA compliance notice before fee checkout. — **Reversibility:** reversible — review stage summary card in `src/features/review/`.

### PWA & Offline Resilience (PWA-01, PWA-02)

- **D-09:** Offline status is communicated via an ambient top warning banner ("⚠️ You are offline — all answers and documents remain safely saved locally"), a mode shift in `SaveIndicator` ("Saved Offline"), and an auto-dismiss green toast on reconnect ("🌐 Connection restored — cloud draft synced"). — **Reversibility:** costly — connects `AppShell`, `SaveIndicator`, and navigator online/offline event listeners.
- **D-10:** PWA caching uses `vite-plugin-pwa` with Workbox configured for `NetworkFirst` on HTML navigation routes (guaranteeing fresh app deployments without stale-shell traps) and `StaleWhileRevalidate` with cache versioning for hashed JS, CSS, images, and Indic font subsets. — **Reversibility:** costly — Vite build config, service worker manifest, and caching rules.
- **D-11:** PWA install promotion is surfaced non-intrusively via an "Install App" button in `AppHeader` upon capturing `beforeinstallprompt`, plus a contextual install card upon Stage 1 completion explaining offline benefits. — **Reversibility:** reversible — install prompt hook and header component.
- **D-12:** Network-dependent actions (Payment submission, live duplicate check) are gracefully guarded offline: Stages 1–3 remain 100% functional, and clicking submit when offline displays a reassuring modal explaining that local drafts are safe and requesting a brief reconnect to submit. — **Reversibility:** costly — guards payment processing and duplicate checking routines.

### Localization, Accessibility & Hardening (I18N-01, I18N-02, I18N-03, A11Y-01, A11Y-02, PERF-01)

- **D-13:** Complete translation coverage is authored across English, Hindi, Tamil, Telugu, Kannada, and Marathi in modular JSON namespaces (`common`, `wizard`, `help`, `errors`), utilizing natural Indic phrasing and localized date/currency formatting. — **Reversibility:** costly — translation dictionaries in `src/i18n/locales/`.
- **D-14:** Indic typography utilizes dynamic on-demand loading of local Noto Sans woff2 subsets via `loadScriptFont` with `font-display: swap` and system Indic fallback cascades (`system-ui, Nirmala UI, sans-serif`), maintaining zero added weight on initial load. — **Reversibility:** costly — font loading engine in `src/fonts.ts` and CSS font-family definitions.
- **D-15:** Accessibility focus management uses an `A11yAnnouncer` live region (`aria-live="polite"` / `"assertive"`) for screen reader stage announcements, error counts, and language switches, paired with programmatic focus shifts to the top `<h1>` or `ErrorSummary` on step transitions. — **Reversibility:** costly — layout-level focus manager and announcer hook.
- **D-16:** Quality and performance hardening are enforced via Vitest axe-core suites across all screen components and Playwright E2E journey tests under throttled 3G network and mid-tier Android device emulation (verifying zero AA violations and LCP < 2.5s). — **Reversibility:** costly — test harness and CI quality gates.

### Agent's Discretion

- Iconography for category chips in the FAQ sheet, animation transition timings for offline banner entry/exit, exact micro-copy wording for Indic language strings, visual layout of the passport jargon diagram, and specific Playwright 3G throttle latency profiles (400ms RTT, 400kbps throughput).
</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product & Requirements References

- `visarethink/indian_visa_prd.md` §2, §4, §5 (Support, Localization, Scale & Safety #7, #8, #9) — Multi-language requirements, contextual help, offline PWA expectations, performance budgets.
- `visarethink/visa_prototype.jsx` — Prototype language selector, help modal patterns, and jargon tooltips.
- `.planning/REQUIREMENTS.md` — SUPRT-01, SUPRT-02, TRUST-01, I18N-01, I18N-02, I18N-03, A11Y-01, A11Y-02, PERF-01, PWA-01, PWA-02 definitions.
- `.planning/ROADMAP.md` — Phase 6 goals and success criteria.

### Prior Phase Context & Decisions

- `.planning/phases/01-foundation-design-system-persistence-engine/01-CONTEXT.md` — Phase 1 established decisions (`i18n` setup, `fonts.ts` font loader, 48px touch targets, AA contrast tokens, `SaveIndicator`).
- `.planning/phases/02-guided-journey-visa-selection-personal-details/02-CONTEXT.md` — Phase 2 established decisions (`ErrorSummary`, `Field` labels/errors, passport auto-formatting, `PersonalDetailsScreen`).
- `.planning/phases/03-document-upload-pipeline/03-CONTEXT.md` — Phase 3 established decisions (`DocumentSlotCard`, `SampleGuidanceSheet`, IndexedDB persistence).
- `.planning/phases/04-review-payment-submission/04-CONTEXT.md` — Phase 4 established decisions (`ReviewScreen`, fee calculations, payment forms, print receipts).
- `.planning/phases/05-confirmation-tracking-recovery/05-CONTEXT.md` — Phase 5 established decisions (`ConfirmationScreen`, tracking modal, backup codes, duplicate detection).

### Architecture & Implementation References

- `src/i18n/index.ts` & `src/i18n/locales/` — i18next configuration, locale definitions, and translation files.
- `src/fonts.ts` — `loadScriptFont` on-demand font subset loader.
- `src/components/AppShell.tsx` — App header, skip links, language switcher, and global actions.
- `src/components/LanguageSwitcher.tsx` — Indic language selection dropdown.
- `src/components/SaveIndicator.tsx` — Live save status indicator.
- `src/components/ui/` — Base design system primitives (`Button`, `Card`, `Field`, `Input`, `Select`, `Sheet`, `Toast`, `ErrorSummary`).
- `src/persistence/answers.ts` & `src/persistence/documents.ts` — Local storage and IndexedDB persistence engines.
- `src/styles/theme.css` — Color tokens, typography, radii, and logical CSS styling.
  </canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/components/ui/Sheet.tsx`: Accessible modal/slide-over container ideal for FAQ & Support sheet and Privacy Promise details.
- `src/components/ui/Toast.tsx`: Toast dispatch provider (`useToast`) for reconnect synchronization and ticket submission feedback.
- `src/components/ui/Field.tsx`: Base field container ready for `(i)` jargon tooltip trigger integration.
- `src/components/ui/ErrorSummary.tsx`: Top-of-page accessible error summary with focus management.
- `src/components/SaveIndicator.tsx`: Status indicator ready for offline mode badge and sync state.
- `src/components/LanguageSwitcher.tsx`: Accessible locale switcher component for header and footer.
- `src/fonts.ts`: Tested script font loader (`loadScriptFont`) with dynamic font face injection.
- `src/services/mock/scenarios.ts`: Mock scenario manager for testing offline and network recovery behaviors.

### Established Patterns

- Logical CSS properties (`margin-inline`, `padding-inline`, `border-inline-start`) used across Tailwind classes for RTL/Indic friendliness.
- Focus trap and Escape key listener inside `Sheet` and modal dialogs.
- Debounced local persistence and autosave flush on `pagehide` / `beforeunload`.
- Unit tests using Vitest and `@testing-library/react` with axe-core a11y assertions (`axe(container)`).

### Integration Points

- `src/features/support/`: New feature module for:
  - `FaqSheet.tsx`: Slide-over FAQ sheet with instant keyword search and category chips.
  - `JargonTooltip.tsx`: Contextual info trigger and micro-popover card with passport diagrams.
  - `SupportTicketModal.tsx`: Simulated callback and help query submission modal.
  - `faqCatalog.ts`: Comprehensive bilingual Q&A dataset across all visa stages.
- `src/features/trust/`: New feature module for:
  - `PrivacyTrustCard.tsx`: Stage 2 pre-flight 3-pillar data protection card.
  - `PrivacyPromiseSheet.tsx`: Full plain-language privacy promise details.
  - `ClearDataModal.tsx`: Shared/public device data wipe confirmation modal.
  - `SecuritySealBadge.tsx`: Review stage integrity badge and encryption seal.
- `src/features/pwa/`: New feature module for:
  - `OfflineBanner.tsx`: Ambient top banner alerting to offline status.
  - `InstallPromptBanner.tsx`: Header button and post-Stage 1 install card.
  - `OfflineGuardModal.tsx`: Reassurance modal intercepting offline submission attempts.
  - `useNetworkStatus.ts`: Hook listening to `online` / `offline` events with sync callbacks.
- `src/components/A11yAnnouncer.tsx`: Live region component announcing step transitions and status changes.
- `vite.config.ts`: Integration of `VitePWA` with Workbox `NetworkFirst` rules and asset caching.
- `src/i18n/locales/`: Full translation dictionaries for `en`, `hi`, `ta`, `te`, `kn`, `mr`.
  </code_context>

<specifics>
## Specific Ideas

- Jargon tooltip for "Given Name vs Surname" includes a mini ASCII/SVG diagram of an Indian passport bio-page highlighting Zone 1 (Surname) vs Zone 2 (Given Names).
- FAQ Sheet floating trigger button displays a subtle pulse badge on first visit to assure first-time applicants that help is always 1 tap away.
- Offline banner uses a calm amber tone with a shield/cloud icon emphasizing safety: "Offline Mode — Your answers and documents are 100% safe on your phone."
- Language switch preserves all typed answers, re-renders the current stage instantly, loads the respective Indic font subset in the background, and announces the language change politely to assistive technology.
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed strictly within the Phase 6 Support, Localization, PWA & Hardening domain.
</deferred>

---

_Phase: 06-Support, Localization, PWA & Hardening_
_Context gathered: 2026-08-26_
