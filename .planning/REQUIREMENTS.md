# Requirements: VisaReThink — Reimagined Indian Visa Service Portal

**Defined:** 2026-08-25
**Core Value:** A first-time applicant can complete an entire visa application end-to-end on a budget phone — always knowing where they are, never losing data — and finish with a trackable application and clear next steps.

## v1 Requirements

Single milestone — full PRD scope plus research-identified table-stakes gaps. No milestone 2.

### Foundation & Design System

- [ ] **FOUND-01**: App scaffolds with Vite + React + TypeScript, Tailwind theme tokens enforcing 48px minimum touch targets and WCAG AA contrast palette
- [ ] **FOUND-02**: Design system provides reusable mobile-first components (full-width inputs/buttons, single-column layout, readable typography) used across all screens
- [ ] **FOUND-03**: Accessible primitives (form labels, error announcements, focus management) are built into base components from the start
- [ ] **FOUND-04**: Indic font strategy ships local Noto subsets per script (Devanagari, Tamil, Telugu, Kannada) within a 3G-class payload budget
- [ ] **FOUND-05**: Mock service layer exposes typed interfaces (passport lookup, payment, OTP, notifications, tracking) with success/failure/timeout paths behind a single swap point

### Application State & Persistence

- [ ] **STATE-01**: Wizard state is a pure state machine over answers; step statuses and progress derive from answers, never persisted separately
- [ ] **STATE-02**: Form answers auto-save (~every 10s) to browser storage with flush on page hide/tab close so no data is lost on kill-the-tab
- [ ] **STATE-03**: Uploaded document files persist in IndexedDB (not localStorage) with quota-error handling and client-side image compression to ≤2MB
- [ ] **STATE-04**: Returning users see "Continue Application" and resume on the first genuinely incomplete step (validators replayed on load)
- [ ] **STATE-05**: User can generate an email backup code that restores their application draft on any device
- [ ] **STATE-06**: Duplicate application detection warns when the same passport has an active in-progress application

### Guided Journey — Stage 1: Visa Selection

- [ ] **SELCT-01**: User selects destination country and visa purpose from curated options
- [ ] **SELCT-02**: System shows matching visa types with typical processing time and itemized cost upfront
- [ ] **SELCT-03**: System shows the required document checklist for the selected visa before the user commits
- [ ] **SELCT-04**: System suggests suitable visa types based on trip purpose answers (recommendation guidance)

### Guided Journey — Stage 2: Personal Details

- [ ] **PERS-01**: User enters passport info, personal details, and contact info one question-group per screen with progressive disclosure by visa type
- [ ] **PERS-02**: Passport number auto-formats to standard format (e.g., AA1234567) as user types
- [ ] **PERS-03**: Phone number auto-prefixes +91 and formats for readability
- [ ] **PERS-04**: Smart defaults pre-fill known values (e.g., nationality = India)
- [ ] **PERS-05**: Passport expiry validation warns with plain-language guidance when validity <6 months and lets user continue or go back
- [ ] **PERS-06**: Fields validate on blur and stage-continue with green checkmarks when valid — not on every keystroke

### Guided Journey — Stage 3: Document Upload

- [ ] **DOCS-01**: User sees a checklist of exactly which documents/pages to upload (e.g., "Pages 1–2 of your passport") with format and size limits shown
- [ ] **DOCS-02**: User can upload via drag-and-drop or camera capture on mobile
- [ ] **DOCS-03**: Uploads validate in real time showing file name, size, and "✓ Ready" confirmation
- [ ] **DOCS-04**: Simple quality heuristic flags likely-blurry/undersized images with a retake option
- [ ] **DOCS-05**: Sample/template downloads are available where applicable

### Review & Error Recovery

- [ ] **REVW-01**: User can review all entered answers on a single check-answers page grouped by stage before payment
- [ ] **REVW-02**: User can jump from the review page to any stage to edit, then return to review
- [ ] **ERR-01**: Validation errors show accessible error summaries at top of page with links to each invalid field
- [ ] **ERR-02**: All error messages are constructive and specific (say what's wrong and how to fix), never generic "Invalid input"

### Payment (Mocked)

- [ ] **PAY-01**: User sees itemized cost breakdown (processing fee, government fee, platform fee, total) before paying
- [ ] **PAY-02**: User can choose payment method among UPI, Card, Netbanking
- [ ] **PAY-03**: Mock payment flow simulates success AND pending/failed states with retry that preserves entered data
- [ ] **PAY-04**: On success user gets instant confirmation with a receipt saved in-app

### Confirmation & Tracking

- [ ] **CNFRM-01**: After submission user receives a shareable reference number
- [ ] **CNFRM-02**: User sees a status timeline with human-readable stages, dates, expected durations, and any next required action
- [ ] **CNFRM-03**: User can download an interview-prep / next-steps checklist
- [ ] **CNFRM-04**: Confirmation is backed up via simulated SMS/email notification (console/logged)
- [ ] **TRCK-01**: User can track application status anytime by entering reference number
- [ ] **TRCK-02**: Status updates transition through mocked demo timeline states with change alerts
- [ ] **TRCK-03**: User can share their confirmation via WhatsApp-native share

### Support & Trust

- [ ] **SUPRT-01**: Every screen offers a help escape hatch (FAQ/help section) reachable without losing progress
- [ ] **SUPRT-02**: Contextual tooltips with examples explain jargon fields (e.g., "date of issue")
- [ ] **TRUST-01**: Plain-language privacy/trust messaging explains what happens to user data before they enter it

### Localization

- [ ] **I18N-01**: Full UI available in English, Hindi, Tamil, Telugu, Kannada, and Marathi with language switcher
- [ ] **I18N-02**: Translations cover all stages, errors, help content, statuses, and emails/SMS templates
- [ ] **I18N-03**: Layout uses logical CSS properties (RTL-ready structure) and renders Indic scripts correctly

### Accessibility & Performance

- [ ] **A11Y-01**: Entire journey passes WCAG 2.1 AA (axe CI gate: zero violations) including keyboard navigation and screen reader support
- [ ] **A11Y-02**: Step changes manage focus and announce progress to assistive technology
- [ ] **PERF-01**: Core Web Vitals "Good" on throttled 3G/mid-tier Android profiles in Playwright tests

### PWA & Offline

- [ ] **PWA-01**: App installs as a PWA with service-worker caching configured network-first for navigations (no stale-shell bug)
- [ ] **PWA-02**: Previously visited pages and saved drafts remain usable offline; queue-safe autosave resumes on reconnect

## v2 Requirements

(None — per project directive everything is contained in this single milestone.)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real government database integration (MEA passport validation) | No API access; simulated success per PRD §4 |
| Real payment processing (Razorpay/live charges) | Fake flow only, no money moves, per PRD §4 |
| True OTP/SMS verification (Twilio) | Auto-verified with mock code per PRD §4 |
| Document OCR/ML data extraction | Upload validation is format/size/heuristic only per PRD §4 |
| Interview scheduling with embassy/VFS systems | Mock calendar per PRD §4 |
| Background checks (async 3–7 day) | Instant mocked result per PRD §4 |
| Fraud ML models / Aadhaar e-KYC / biometrics | Production-scale items beyond app scope; duplicate detection covers the prototype-level need |
| Multi-region infrastructure / 50k-concurrent scaling | Deployment concern, not an app feature |
| AI chatbot support | Anti-feature per research — static help suffices |
| Group/family applications, rush-tier pricing | Anti-feature per research — single applicant flow only |
| Forced registration wall | Anti-feature per research — anonymous drafts with resume codes |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (populated by roadmapper) | | |

**Coverage:**
- v1 requirements: (count after roadmap)
- Mapped to phases: (after roadmap)
- Unmapped: ⚠️ pending roadmap

---
*Requirements defined: 2026-08-25*
*Last updated: 2026-08-25 after initial definition*
