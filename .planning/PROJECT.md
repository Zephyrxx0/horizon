# VisaReThink — Reimagined Indian Visa Service Portal

## What This Is

A mobile-first web application that reimagines the Indian visa application experience as a guided, step-by-step journey instead of a daunting form. It serves Indian passport holders — students, professionals, tourists, business travelers — including first-time international travelers with limited digital literacy, primarily on budget Android phones over 3G/4G connections.

## Core Value

A first-time applicant can complete an entire visa application end-to-end on a budget phone — always knowing where they are, never losing data, never hitting a confusing dead end — and finish with a trackable application and clear next steps.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Linear 5-stage guided workflow (Visa Type & Destination → Personal Details → Document Upload → Payment & Verification → Confirmation & Tracking) with visual progress indicator and time estimates
- [ ] Mobile-first design: 48px touch targets, readable typography, single-column layout, full-width inputs/buttons
- [ ] Contextual help: examples, tooltips, auto-formatting (passport number, phone with +91), plain-language copy for low digital literacy
- [ ] Real-time field validation with constructive errors, green checkmarks, inline help, prevention of incomplete submission
- [ ] Progress persistence: auto-save (~10s), local storage, resume across sessions/devices via email backup code
- [ ] Status transparency: human-readable status timeline with dates, expected durations, and next required actions; post-submission tracking by reference number
- [ ] Progressive disclosure: only fields relevant to selected visa type shown
- [ ] Upfront visibility: document checklist, processing time, and itemized cost breakdown before commitment
- [ ] Document upload UX: checklist format, exact page guidance, drag-and-drop + camera capture, format/size validation, quality warnings
- [ ] Payment flow: itemized breakdown (processing/government/platform fees), UPI/Card/Netbanking options, instant confirmation, receipt saved in app (mocked gateway)
- [ ] Confirmation package: shareable reference number, status timeline, interview prep checklist download, SMS/email backup (mocked)
- [ ] Multi-language support: Hindi, Tamil, Telugu, Kannada, Marathi + English
- [ ] Visa recommendation guidance: suggest suitable visa types based on trip purpose answers
- [ ] Duplicate application detection (same passport, multiple active applications)
- [ ] Accessibility: WCAG 2.1 AA compliance (contrast, alt text, screen reader support, keyboard navigation)
- [ ] Offline-capable PWA behavior (service workers, caching) for unreliable connections

### Out of Scope

- Real government database integration (MEA passport validation) — no API access; simulated success per PRD §4 mock table
- Real payment processing (Razorpay/live charges) — fake flow only, no money moves, per PRD §4
- True OTP/SMS verification (Twilio) — auto-verified with mock code, per PRD §4
- Document OCR/ML extraction — upload validation is format/size only, per PRD §4
- Interview scheduling with embassy/VFS systems — mock calendar, per PRD §4
- Background checks — instant mocked result, per PRD §4
- Fraud ML models, Aadhaar e-KYC, biometric verification — production-scale items beyond prototype scope
- Multi-region infrastructure, 50k-concurrent load targets — deployment-scale concerns, not app features

## Context

- Source PRD lives in `visarethink/` (indian_visa_prd.md) along with an interactive React prototype (`visa_prototype.jsx`) usable as a behavioral reference for flows, validation logic, and stage structure.
- Current portals (iVisa, visa.gov.in, VFS partners) suffer ~62% completion rates, 25–40 min submit times, 18% resubmission rate, poor mobile usability. Targets: 85%+ completion, 12–18 min submit, <8% resubmission, Lighthouse accessibility 90+.
- Users span varying English proficiency and low digital literacy — every field needs examples and plain language ("date of issue" needs explanation).
- Device reality: budget Android phones, small screens, slow/unreliable connections, intermittent sessions.
- Personal data must be realistic-but-fake in the prototype; session data lives in browser storage.

## Constraints

- **Single milestone**: Entire PRD scope ships in one milestone — there is no milestone 2.
- **Tech stack**: React/Next.js frontend per PRD architecture; backend concerns mocked client-side.
- **Mobile-first**: Desktop is a graceful enhancement, not the primary target.
- **Accessibility**: WCAG 2.1 AA is a hard requirement for all features.
- **No real money or government calls**: Payment, OTP, lookups, notifications are all simulated.
- **Performance**: Fast on 3G-class connections; Core Web Vitals "Good".

## Key Decisions

| Decision                                           | Rationale                                                                      | Outcome   |
| -------------------------------------------------- | ------------------------------------------------------------------------------ | --------- |
| Single milestone covering full PRD scope           | User directive: everything in 1 milestone, no milestone 2                      | — Pending |
| Backend integrations stay mocked per PRD §4        | No access to MEA/Razorpay/Twilio APIs; prototype demonstrates UX end-to-end    | — Pending |
| Build fresh app informed by existing prototype JSX | Prototype validates flows but is a single-file demo, not a codebase foundation | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):

1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

_Last updated: 2026-08-25 after initialization_
