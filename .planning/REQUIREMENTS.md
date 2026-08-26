# Requirements: VisaReThink — Reimagined Indian Visa Service Portal

**Defined:** 2026-08-25
**Core Value:** A first-time applicant can complete an entire visa application end-to-end on a budget phone — always knowing where they are, never losing data — and finish with a trackable application and clear next steps.

## v1 Requirements

Single milestone — full PRD scope plus research-identified table-stakes gaps. No milestone 2.

### Foundation & Design System

- [x] **FOUND-01**: App scaffolds with Vite + React + TypeScript, Tailwind theme tokens enforcing 48px minimum touch targets and WCAG AA contrast palette
- [x] **FOUND-02**: Design system provides reusable mobile-first components (full-width inputs/buttons, single-column layout, readable typography) used across all screens
- [x] **FOUND-03**: Accessible primitives (form labels, error announcements, focus management) are built into base components from the start
- [x] **FOUND-04**: Indic font strategy ships local Noto subsets per script (Devanagari, Tamil, Telugu, Kannada) within a 3G-class payload budget
- [x] **FOUND-05**: Mock service layer exposes typed interfaces (passport lookup, payment, OTP, notifications, tracking) with success/failure/timeout paths behind a single swap point

### Application State & Persistence

- [x] **STATE-01**: Wizard state is a pure state machine over answers; step statuses and progress derive from answers, never persisted separately
- [x] **STATE-02**: Form answers auto-save (~every 10s) to browser storage with flush on page hide/tab close so no data is lost on kill-the-tab
- [x] **STATE-03**: Uploaded document files persist in IndexedDB (not localStorage) with quota-error handling and client-side image compression to ≤2MB
- [x] **STATE-04**: Returning users see "Continue Application" and resume on the first genuinely incomplete step (validators replayed on load)
- [x] **STATE-05**: User can generate an email backup code that restores their application draft on any device
- [x] **STATE-06**: Duplicate application detection warns when the same passport has an active in-progress application

### Guided Journey — Stage 1: Visa Selection

- [x] **SELCT-01**: User selects destination country and visa purpose from curated options
- [x] **SELCT-02**: System shows matching visa types with typical processing time and itemized cost upfront
- [x] **SELCT-03**: System shows the required document checklist for the selected visa before the user commits
- [x] **SELCT-04**: System suggests suitable visa types based on trip purpose answers (recommendation guidance)

### Guided Journey — Stage 2: Personal Details

- [x] **PERS-01**: User enters passport info, personal details, and contact info one question-group per screen with progressive disclosure by visa type
- [x] **PERS-02**: Passport number auto-formats to standard format (e.g., AA1234567) as user types
- [x] **PERS-03**: Phone number auto-prefixes +91 and formats for readability
- [x] **PERS-04**: Smart defaults pre-fill known values (e.g., nationality = India)
- [x] **PERS-05**: Passport expiry validation warns with plain-language guidance when validity <6 months and lets user continue or go back
- [x] **PERS-06**: Fields validate on blur and stage-continue with green checkmarks when valid — not on every keystroke

### Guided Journey — Stage 3: Document Upload

- [x] **DOCS-01**: User sees a checklist of exactly which documents/pages to upload (e.g., "Pages 1–2 of your passport") with format and size limits shown
- [x] **DOCS-02**: User can upload via drag-and-drop or camera capture on mobile
- [x] **DOCS-03**: Uploads validate in real time showing file name, size, and "✓ Ready" confirmation
- [x] **DOCS-04**: Simple quality heuristic flags likely-blurry/undersized images with a retake option
- [x] **DOCS-05**: Sample/template downloads are available where applicable

### Review & Error Recovery

- [x] **REVW-01**: User can review all entered answers on a single check-answers page grouped by stage before payment
- [x] **REVW-02**: User can jump from the review page to any stage to edit, then return to review
- [x] **ERR-01**: Validation errors show accessible error summaries at top of page with links to each invalid field
- [x] **ERR-02**: All error messages are constructive and specific (say what's wrong and how to fix), never generic "Invalid input"

### Payment (Mocked)

- [x] **PAY-01**: User sees itemized cost breakdown (processing fee, government fee, platform fee, total) before paying
- [x] **PAY-02**: User can choose payment method among UPI, Card, Netbanking
- [x] **PAY-03**: Mock payment flow simulates success AND pending/failed states with retry that preserves entered data
- [x] **PAY-04**: On success user gets instant confirmation with a receipt saved in-app

### Confirmation & Tracking

- [x] **CNFRM-01**: After submission user receives a shareable reference number
- [x] **CNFRM-02**: User sees a status timeline with human-readable stages, dates, expected durations, and any next required action
- [x] **CNFRM-03**: User can download an interview-prep / next-steps checklist
- [x] **CNFRM-04**: Confirmation is backed up via simulated SMS/email notification (console/logged)
- [x] **TRCK-01**: User can track application status anytime by entering reference number
- [x] **TRCK-02**: Status updates transition through mocked demo timeline states with change alerts
- [x] **TRCK-03**: User can share their confirmation via WhatsApp-native share

### Support & Trust

- [x] **SUPRT-01**: Every screen offers a help escape hatch (FAQ/help section) reachable without losing progress
- [x] **SUPRT-02**: Contextual tooltips with examples explain jargon fields (e.g., "date of issue")
- [x] **TRUST-01**: Plain-language privacy/trust messaging explains what happens to user data before they enter it

### Localization

- [x] **I18N-01**: Full UI available in English, Hindi, Tamil, Telugu, Kannada, and Marathi with language switcher
- [x] **I18N-02**: Translations cover all stages, errors, help content, statuses, and emails/SMS templates
- [x] **I18N-03**: Layout uses logical CSS properties (RTL-ready structure) and renders Indic scripts correctly

### Accessibility & Performance

- [x] **A11Y-01**: Entire journey passes WCAG 2.1 AA (axe CI gate: zero violations) including keyboard navigation and screen reader support
- [x] **A11Y-02**: Step changes manage focus and announce progress to assistive technology
- [x] **PERF-01**: Core Web Vitals "Good" on throttled 3G/mid-tier Android profiles in Playwright tests

### PWA & Offline

- [x] **PWA-01**: App installs as a PWA with service-worker caching configured network-first for navigations (no stale-shell bug)
- [x] **PWA-02**: Previously visited pages and saved drafts remain usable offline; queue-safe autosave resumes on reconnect

## v2 Requirements

(None — per project directive everything is contained in this single milestone.)

## Out of Scope

| Feature                                                        | Reason                                                                                       |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Real government database integration (MEA passport validation) | No API access; simulated success per PRD §4                                                  |
| Real payment processing (Razorpay/live charges)                | Fake flow only, no money moves, per PRD §4                                                   |
| True OTP/SMS verification (Twilio)                             | Auto-verified with mock code per PRD §4                                                      |
| Document OCR/ML data extraction                                | Upload validation is format/size/heuristic only per PRD §4                                   |
| Interview scheduling with embassy/VFS systems                  | Mock calendar per PRD §4                                                                     |
| Background checks (async 3–7 day)                              | Instant mocked result per PRD §4                                                             |
| Fraud ML models / Aadhaar e-KYC / biometrics                   | Production-scale items beyond app scope; duplicate detection covers the prototype-level need |
| Multi-region infrastructure / 50k-concurrent scaling           | Deployment concern, not an app feature                                                       |
| AI chatbot support                                             | Anti-feature per research — static help suffices                                             |
| Group/family applications, rush-tier pricing                   | Anti-feature per research — single applicant flow only                                       |
| Forced registration wall                                       | Anti-feature per research — anonymous drafts with resume codes                               |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| FOUND-01    | Phase 1 | Complete |
| FOUND-02    | Phase 1 | Complete |
| FOUND-03    | Phase 1 | Complete |
| FOUND-04    | Phase 1 | Complete |
| FOUND-05    | Phase 1 | Complete |
| STATE-01    | Phase 1 | Complete |
| STATE-02    | Phase 1 | Complete |
| STATE-03    | Phase 1 | Complete |
| SELCT-01    | Phase 2 | Complete |
| SELCT-02    | Phase 2 | Complete |
| SELCT-03    | Phase 2 | Complete |
| SELCT-04    | Phase 2 | Complete |
| PERS-01     | Phase 2 | Complete |
| PERS-02     | Phase 2 | Complete |
| PERS-03     | Phase 2 | Complete |
| PERS-04     | Phase 2 | Complete |
| PERS-05     | Phase 2 | Complete |
| PERS-06     | Phase 2 | Complete |
| STATE-04    | Phase 2 | Complete |
| ERR-01      | Phase 2 | Complete |
| ERR-02      | Phase 2 | Complete |
| DOCS-01     | Phase 3 | Complete |
| DOCS-02     | Phase 3 | Complete |
| DOCS-03     | Phase 3 | Complete |
| DOCS-04     | Phase 3 | Complete |
| DOCS-05     | Phase 3 | Complete |
| REVW-01     | Phase 4 | Complete |
| REVW-02     | Phase 4 | Complete |
| PAY-01      | Phase 4 | Complete |
| PAY-02      | Phase 4 | Complete |
| PAY-03      | Phase 4 | Complete |
| PAY-04      | Phase 4 | Complete |
| CNFRM-01    | Phase 5 | Complete |
| CNFRM-02    | Phase 5 | Complete |
| CNFRM-03    | Phase 5 | Complete |
| CNFRM-04    | Phase 5 | Complete |
| TRCK-01     | Phase 5 | Complete |
| TRCK-02     | Phase 5 | Complete |
| TRCK-03     | Phase 5 | Complete |
| STATE-05    | Phase 5 | Complete |
| STATE-06    | Phase 5 | Complete |
| SUPRT-01    | Phase 6 | Complete |
| SUPRT-02    | Phase 6 | Complete |
| TRUST-01    | Phase 6 | Complete |
| I18N-01     | Phase 6 | Complete |
| I18N-02     | Phase 6 | Complete |
| I18N-03     | Phase 6 | Complete |
| A11Y-01     | Phase 6 | Complete |
| A11Y-02     | Phase 6 | Complete |
| PERF-01     | Phase 6 | Complete |
| PWA-01      | Phase 6 | Complete |
| PWA-02      | Phase 6 | Complete |

**Coverage:**

- v1 requirements: 52
- Mapped to phases: 52
- Unmapped: none ✓
- **Completed (phases 1–6):** 52/52 ✓
- **Pending:** 0/52 (all complete)

---

_Requirements defined: 2026-08-25_
_Last updated: 2026-08-26 — all 52 requirements verified and complete after Phase 6 verification_
