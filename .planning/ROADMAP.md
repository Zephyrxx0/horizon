# Roadmap: VisaReThink — Reimagined Indian Visa Service Portal

## Overview

This milestone delivers the complete PRD scope as one continuous build: a mobile-first guided visa application portal where a first-time applicant on a budget Android phone can go from "which visa?" to "track my application" without losing data or hitting dead ends. The journey starts with the foundation — an accessible design system, typed mock services, and a persistence engine that survives tab kills — then builds the guided stages in order (visa selection → personal details → documents → review → payment → confirmation), followed by post-submission tracking and recovery flows. It closes by finishing cross-cutting quality: six-language localization, WCAG 2.1 AA verification, 3G-class performance, and PWA/offline resilience. Accessibility and performance are enforced continuously from Phase 1; the final phase verifies them across the whole journey rather than bolting them on.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation, Design System & Persistence Engine** - Accessible mobile-first skeleton with mock services and never-lose-data draft persistence
- [ ] **Phase 2: Guided Journey — Visa Selection & Personal Details** - First vertical slice: choose visa with eyes open, enter details confidently, resume anywhere
- [ ] **Phase 3: Document Upload Pipeline** - Camera/drag-drop uploads with exact guidance, instant validation, honest quality checks
- [ ] **Phase 4: Review, Payment & Submission** - Check-your-answers gate, transparent mocked payment with failure recovery
- [ ] **Phase 5: Confirmation, Tracking & Recovery** - Reference number, status timeline, backup-code restore, duplicate detection
- [ ] **Phase 6: Support, Localization, PWA & Hardening** - Six languages, help surfaces, offline resilience, WCAG/perf gates across whole journey

## Phase Details

### Phase 1: Foundation, Design System & Persistence Engine
**Goal**: The app exists as an accessible mobile-first skeleton whose drafts survive anything the network or the user's thumb does — no screen is wasted because every later stage composes these primitives.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, STATE-01, STATE-02, STATE-03
**Success Criteria** (what must be TRUE):
  1. Opening the scaffolded app (Vite + React + TS per FOUND-01) on a phone-width viewport renders base components — full-width inputs/buttons, single-column layout — at 48px touch targets with AA contrast, passing axe with zero violations
  2. Typing into a form, killing the browser tab mid-session, and reopening restores the entered answers exactly — debounced autosave plus flush-on-pagehide proven via an honest "Saved / Not saved" indicator
  3. Attaching a photo-sized file persists it in IndexedDB compressed to ≤2MB and it survives a full reload; quota errors surface honestly instead of silently dropping data
  4. Mock passport/payment/OTP/notification/tracking services respond through typed interfaces with configurable success/failure/timeout scenarios behind a single swap point
  5. Changing an already-answered answer flips dependent downstream steps back to "needs attention" — step status is always recomputed from answers, never persisted separately (pure wizard-machine reducer)
**Plans:** 6 plans

Plans:
- [ ] 01-01-PLAN.md — Scaffold, theme tokens, quality gates (lint/hooks/Vitest+axe/Playwright/CI)
- [ ] 01-02-PLAN.md — Ten-primitive custom design system with axe-gated a11y contracts
- [ ] 01-03-PLAN.md — Typed mock service layer behind single getService() swap point
- [ ] 01-04-PLAN.md — XState wizard machine + honest autosave engine + kill-the-tab E2E
- [ ] 01-05-PLAN.md — IndexedDB document persistence with ≤2MB compression + quota honesty
- [ ] 01-06-PLAN.md — i18n machinery, live six-locale switcher, Noto font subsets + CI budget gate
**UI hint**: yes

### Phase 2: Guided Journey — Visa Selection & Personal Details
**Goal**: A first-time applicant can start an application, pick the right visa with eyes open, and enter personal details confidently — always knowing where they are and resuming exactly where they left off.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: SELCT-01, SELCT-02, SELCT-03, SELCT-04, PERS-01, PERS-02, PERS-03, PERS-04, PERS-05, PERS-06, STATE-04, ERR-01, ERR-02
**Success Criteria** (what must be TRUE):
  1. User selects destination country and trip purpose, receives recommended visa types with explanations, and sees typical processing time, itemized cost, and the required-document checklist before committing
  2. Personal details flow one question-group per screen showing only fields relevant to the selected visa type; passport numbers auto-format (AA1234567), phones auto-prefix +91, and known values pre-fill smartly
  3. Invalid entries flag on blur with constructive, specific messages (never generic); valid fields earn green checkmarks; errors collect in an accessible top-of-page summary linking to each problem field
  4. A passport expiring within 6 months triggers a plain-language warning letting the user continue informed or go back
  5. Closing and reopening mid-journey drops the user on the first genuinely incomplete step ("Continue Application"), with visual progress and time estimates visible throughout
**Plans**: TBD
**UI hint**: yes

### Phase 3: Document Upload Pipeline
**Goal**: Applicants get exactly the right documents attached — guided page-by-page, validated instantly, tolerant of bad cameras and slow networks.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05
**Success Criteria** (what must be TRUE):
  1. User sees exactly which documents/pages to upload (e.g., "Pages 1–2 of your passport") with format and size limits before touching the camera
  2. On mobile the user captures with the camera; on desktop they drag-and-drop; every upload immediately shows file name, size, and a "✓ Ready" confirmation
  3. Likely-blurry or undersized images are flagged with a clear retake option rather than silently accepted
  4. Sample/template downloads are available where applicable
  5. Attached documents persist across reloads and app restarts inside the real journey (IndexedDB-backed), surviving flaky sessions
**Plans**: TBD
**UI hint**: yes

### Phase 4: Review, Payment & Submission
**Goal**: Before money moves (mockedly), users see everything they told us, fix anything anywhere, pay transparently, and survive failed payments without losing a byte of entered data.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: REVW-01, REVW-02, PAY-01, PAY-02, PAY-03, PAY-04
**Success Criteria** (what must be TRUE):
  1. User reviews all entered answers grouped by stage on a single check-answers page before payment, and can jump to any stage to edit then return to review
  2. Before paying, user sees an itemized cost breakdown (processing/government/platform fees + total) and chooses among UPI, Card, and Netbanking
  3. The mock payment exercises success AND pending/failed states; a failed attempt offers retry preserving all entered data; double-submission is guarded
  4. Successful payment yields instant confirmation with an itemized receipt saved in-app
**Plans**: TBD
**UI hint**: yes

### Phase 5: Confirmation, Tracking & Recovery
**Goal**: After submission the applicant always knows what happens next — and lost devices, second attempts, or shared references can never strand an application.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: CNFRM-01, CNFRM-02, CNFRM-03, CNFRM-04, TRCK-01, TRCK-02, TRCK-03, STATE-05, STATE-06
**Success Criteria** (what must be TRUE):
  1. After submitting, user receives a shareable reference number, sees a dated human-readable status timeline with expected durations and next required actions, and can download an interview-prep checklist
  2. Confirmation backs up via simulated SMS/email demonstrable in-app, and user can share their confirmation via WhatsApp-native share
  3. Anyone can enter a reference number anytime and see current status; statuses transition through a mocked demo timeline with change alerts
  4. User can generate an email backup code that restores their full draft on any other device
  5. Starting a new application with the same passport warns about the active in-progress application instead of silently duplicating
**Plans**: TBD
**UI hint**: yes

### Phase 6: Support, Localization, PWA & Hardening
**Goal**: The whole journey works in six languages, survives offline dead zones, helps users without trapping them, and verifiably passes WCAG 2.1 AA and 3G-class performance across every route.
**Mode:** mvp
**Depends on**: Phase 5
**Requirements**: SUPRT-01, SUPRT-02, TRUST-01, I18N-01, I18N-02, I18N-03, A11Y-01, A11Y-02, PERF-01, PWA-01, PWA-02
**Success Criteria** (what must be TRUE):
  1. Every screen offers a help escape hatch (searchable translated FAQ) reachable without losing progress; jargon fields carry example tooltips; plain-language privacy/trust messaging appears before personal data entry
  2. The full UI — stages, errors, help content, statuses, notification templates — switches among English, Hindi, Tamil, Telugu, Kannada, and Marathi mid-flow without resetting the form, rendering Indic scripts correctly with logical-CSS (RTL-ready) layout
  3. Keyboard-only and screen-reader walkthroughs pass the entire journey with focus managed on step changes; axe CI gate reports zero WCAG 2.1 A/AA violations across all routes
  4. Core Web Vitals measure "Good" on throttled 3G / mid-tier Android profiles in Playwright tests
  5. The app installs as a PWA; previously visited pages and saved drafts remain usable offline; queued autosave flushes on reconnect; navigations never serve a stale shell after redeploy
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation, Design System & Persistence Engine | 0/? | Not started | - |
| 2. Guided Journey — Visa Selection & Personal Details | 0/? | Not started | - |
| 3. Document Upload Pipeline | 0/? | Not started | - |
| 4. Review, Payment & Submission | 0/? | Not started | - |
| 5. Confirmation, Tracking & Recovery | 0/? | Not started | - |
| 6. Support, Localization, PWA & Hardening | 0/? | Not started | - |
