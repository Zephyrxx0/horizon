# Phase 6: Support, Localization, PWA & Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-26
**Phase:** 06-support-localization-pwa-hardening
**Areas discussed:** Help & Support Access UX, Privacy & Trust Messaging Placement, PWA & Offline Resilience UX, Localization & Indic Script Polish

---

## Help & Support Access UX (SUPRT-01, SUPRT-02)

| Option                                                  | Description                                                                                                                      | Selected |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Slide-over Sheet via AppHeader & floating helper button | Searchable FAQ categories + stage-specific contextual tips without navigating away or losing form state (reuses Sheet primitive) | ✓        |
| Sticky bottom help bar                                  | Expandable tray at screen bottom with quick FAQ answers                                                                          |          |
| Centered modal dialog                                   | Modal popup with tabbed FAQ categories                                                                                           |          |

**User's choice:** Slide-over Sheet via AppHeader & floating helper button
**Notes:** Reuses existing `Sheet` primitive, maintains form state without URL resets.

| Option                                                                   | Description                                                                                                                          | Selected |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Accessible inline info trigger (i) with tap-to-expand popover/micro-card | Shows plain-language definition + concrete passport/document visual example (touch-friendly on 48px target, screen-reader announced) | ✓        |
| Long-press tooltip on field labels                                       | Floating popup appearing on hold                                                                                                     |          |
| Help glossary link beside each stage header                              | Opening full terms dictionary                                                                                                        |          |

**User's choice:** Accessible inline info trigger (i) with tap-to-expand popover/micro-card
**Notes:** 48px touch targets for mobile accessibility with visual passport diagram.

| Option                                                                                              | Description                                                                                                                                    | Selected |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Structured FAQ catalog (15-20 core questions) with instant keyword search and category filter chips | Instant keyword search and category filter chips (Documents, Payment, Passport, Tracking, General) plus "Ask embassy / Contact" fallback links | ✓        |
| Stage-bound static FAQ list                                                                         | 3-4 fixed FAQs per screen without search                                                                                                       |          |
| External link                                                                                       | External link to government FAQ documentation portal                                                                                           |          |

**User's choice:** Structured FAQ catalog with instant keyword search and category filter chips
**Notes:** Fast in-memory search over categorized questions.

| Option                                              | Description                                                                                                                       | Selected |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| In-app simulated support fallback card in FAQ Sheet | Toll-free mock helpline, hours of operation, and 1-tap "Submit Support Query" modal with ticket ID and instant confirmation toast | ✓        |
| Static email/phone contact block                    | Static block at bottom of FAQ sheet                                                                                               |          |
| FAQ only                                            | No contact fallback                                                                                                               |          |

**User's choice:** In-app simulated support fallback card in FAQ Sheet
**Notes:** Dispatches mock support ticket with immediate feedback.

---

## Privacy & Trust Messaging Placement (TRUST-01)

| Option                                                     | Description                                                                                                                                                     | Selected |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Stage 2 Pre-flight Trust Card + Expandable Privacy Promise | Clear 3-pillar summary (stored locally on your device, never sold or shared, bank-grade encryption) before entering passport details, with 1-tap detailed sheet | ✓        |
| Sticky top banner on Personal Details stage only           | Compact top notification bar                                                                                                                                    |          |
| Modal consent popup                                        | Mandatory modal before starting personal identity fields                                                                                                        |          |

**User's choice:** Stage 2 Pre-flight Trust Card + Expandable Privacy Promise
**Notes:** Establishes trust upfront before any PII entry.

| Option                                           | Description                                                                                                                                           | Selected |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Contextual micro-trust cues on sensitive inputs  | Discrete lock icon + reassurance caption on passport, national ID, phone, and payment inputs ("🔒 Kept secure on this device until final submission") | ✓        |
| Global footer security certification badges only | Static footer badges                                                                                                                                  |          |
| No inline cues                                   | Rely exclusively on top-level Stage 2 Trust Card                                                                                                      |          |

**User's choice:** Contextual micro-trust cues on sensitive inputs
**Notes:** Reinforces reassurance right at point of entry.

| Option                                                                                              | Description                                                                                  | Selected |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------- |
| Explicit "Reset / Clear All Local Data" action with modal confirmation and Public Computer guidance | Provides clean wipe of IndexedDB/localStorage drafts with warning prompt and backup reminder | ✓        |
| Automatic session timeout wipe after 30 minutes of inactivity                                       | Inactivity timer                                                                             |          |
| No clear-data action                                                                                | Rely on browser cache clear                                                                  |          |

**User's choice:** Explicit "Reset / Clear All Local Data" action with modal confirmation
**Notes:** Empowers cyber-café and shared device users to wipe drafts safely.

| Option                                                     | Description                                                                                                           | Selected |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- |
| "Secure Submission & Integrity" trust box on Review screen | Displays application integrity seal, simulated TLS 1.3 encryption badge, and MEA compliance notice before fee payment | ✓        |
| Simple lock icon next to Pay & Submit button               | Minimal icon                                                                                                          |          |
| Omit on Review screen                                      | No badge                                                                                                              |          |

**User's choice:** "Secure Submission & Integrity" trust box on Review screen
**Notes:** Final assurance before fee checkout and submission.

---

## PWA & Offline Resilience UX (PWA-01, PWA-02)

| Option                                                                                         | Description                                                                                            | Selected |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| Ambient offline top banner + SaveIndicator mode shift ("Saved Offline") + Reconnect sync toast | Never blocks editing or document browsing, clearly shows zero data loss, flushes queue on online event | ✓        |
| Blocking offline modal requiring reconnect to proceed                                          | Fullscreen block                                                                                       |          |
| Subtle status dot in header only with tooltip                                                  | Header indicator                                                                                       |          |

**User's choice:** Ambient offline top banner + SaveIndicator mode shift + Reconnect sync toast
**Notes:** Zero interruption for filling drafts offline on budget networks.

| Option                                                                                                          | Description                                                                             | Selected |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------- |
| vite-plugin-pwa with NetworkFirst for HTML navigation + StaleWhileRevalidate for versioned assets & Indic fonts | Ensures no stale-shell bug on new releases while guaranteeing full offline availability | ✓        |
| CacheFirst for everything with reload toast                                                                     | Heavy caching with update toast                                                         |          |
| Custom service worker script without Workbox                                                                    | Manual cache management                                                                 |          |

**User's choice:** vite-plugin-pwa with NetworkFirst for HTML navigation + StaleWhileRevalidate for versioned assets & Indic fonts
**Notes:** Industry standard to avoid stale shells while caching assets and Indic font subsets.

| Option                                                                   | Description                                                                                                       | Selected |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | -------- |
| Non-intrusive AppHeader install button + Stage 1 completion smart prompt | Captures beforeinstallprompt, presents subtle install card explaining offline benefits, auto-hides once installed | ✓        |
| Browser default prompt only                                              | No custom UI buttons                                                                                              |          |
| Permanent footer install link on every screen                            | Static link                                                                                                       |          |

**User's choice:** Non-intrusive AppHeader install button + Stage 1 completion smart prompt
**Notes:** Smart prompt surfaces when user shows high intent (after Stage 1).

| Option                                              | Description                                                                                                                                                                | Selected |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Informative action guard for payment/submission     | Steps 1-3 remain 100% functional offline; clicking Pay & Submit while offline displays a reassuring modal ("Draft is safe locally. Connect to internet to submit payment") | ✓        |
| Queue payment offline and auto-submit in background | Risky auto-submission                                                                                                                                                      |          |
| Disable Continue buttons on all stages when offline | Overly restrictive                                                                                                                                                         |          |

**User's choice:** Informative action guard for payment/submission
**Notes:** Keeps all draft/review features functional; guards actual payment execution.

---

## Localization & Indic Script Polish (I18N-01, I18N-02, I18N-03, A11Y-01, A11Y-02, PERF-01)

| Option                                                                                           | Description                                                                                               | Selected |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | -------- |
| Complete 6-language high-fidelity dictionaries across common, wizard, help, and error namespaces | Natural Indic terminology for all stages, validation errors, FAQs, trust copy, and notification templates | ✓        |
| Core labels only in Indic languages                                                              | Partial translations                                                                                      |          |
| Monolithic single dictionary per language                                                        | Single file                                                                                               |          |

**User's choice:** Complete 6-language high-fidelity dictionaries across common, wizard, help, and error namespaces
**Notes:** Ensures complete localized journey in EN, HI, TA, TE, KN, MR.

| Option                                                                                                                                | Description                                                         | Selected |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------- |
| On-demand script font loader (Noto woff2 subsets via loadScriptFont) with font-display: swap and robust system Indic fallback cascade | Zero weight on initial English load, crisp conjunct glyph rendering | ✓        |
| Preload all 5 Indic font files upfront                                                                                                | Heavy initial bundle                                                |          |
| Standard system sans-serif only                                                                                                       | Risk of missing glyphs on older devices                             |          |

**User's choice:** On-demand script font loader with font-display: swap and system Indic fallback cascade
**Notes:** Meets 3G payload budgets while guaranteeing accurate rendering of Indic conjuncts.

| Option                                                                      | Description                                                                                                                                | Selected |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| A11yAnnouncer (aria-live="polite" / "assertive") + programmatic focus shift | Announces step changes, validation errors, and language switches; shifts focus cleanly to top heading or ErrorSummary on stage transitions | ✓        |
| Standard focus to first input without live announcements                    | Silent transitions                                                                                                                         |          |
| Announce every field blur and autosave tick                                 | Overly noisy                                                                                                                               |          |

**User's choice:** A11yAnnouncer + programmatic focus shift
**Notes:** WCAG 2.1 AA compliant navigation experience for screen readers and keyboard users.

| Option                                                                                                                                                                             | Description                   | Selected |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | -------- |
| Automated Vitest axe-core tests + Playwright E2E journey audit with axe scans across all 5 stages + 3G throttled performance profile verification (LCP < 2.5s, zero AA violations) | Full journey automated gating | ✓        |
| Vitest axe tests only                                                                                                                                                              | Unit tests only               |          |
| Manual checklist verification                                                                                                                                                      | Manual testing                |          |

**User's choice:** Automated Vitest axe-core tests + Playwright E2E journey audit + 3G throttled performance verification
**Notes:** Comprehensive verification across both unit and end-to-end journey levels.

---

## the agent's Discretion

- Iconography for category chips in FAQ Sheet.
- Offline banner animation timings and transitions.
- Visual styling and layout of Indian passport bio-page diagram for jargon tooltips.
- Playwright 3G network throttle configuration (400ms RTT, 400kbps throughput).

## Deferred Ideas

None — discussion stayed within Phase 6 scope.
