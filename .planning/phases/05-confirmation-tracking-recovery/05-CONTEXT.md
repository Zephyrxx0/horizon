# Phase 5: Confirmation, Tracking & Recovery - Context

**Gathered:** 2026-08-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 delivers the complete post-submission confirmation, tracking, and recovery lifecycle (CNFRM-01, CNFRM-02, CNFRM-03, CNFRM-04, TRCK-01, TRCK-02, TRCK-03, STATE-05, STATE-06):

1. **Submission Confirmation & Shareable Reference (CNFRM-01, TRCK-03)** — Generate official application reference number (`VR-YYYY-XXXXXX`), render confirmation status card on Stage 5, provide 1-tap copy with toast feedback, and enable native sharing via Web Share API / WhatsApp deep-links (`wa.me/?text=...`).
2. **Status Timeline & Interactive Demo Tracker (CNFRM-02, TRCK-01, TRCK-02)** — Render dated human-readable status timeline with expected durations and next required actions. Provide dual access (in-place on Stage 5 and via AppHeader standalone tracking modal lookup). Include an interactive demo scenario bar ("[Advance Status]", "[Simulate Info Request]", "[Simulate Approval]") that triggers live status transition toast alerts.
3. **Tailored Interview Preparation & Checklist Download (CNFRM-03)** — Generate dynamic, visa-specific checklist and embassy arrival guidelines (e.g. Student vs Business vs Tourist requirements + consulate dos & don'ts). Provide interactive on-screen completion tracking ("X of Y items ready") and dual export: 1-tap `.txt` download plus print-ready view (`@media print`).
4. **Simulated Notification Feedback & Message Preview (CNFRM-04)** — Integrate with `INotificationService` to dispatch simulated SMS and email confirmations with toast alerts and an expandable "Sent Notifications" preview card showing rendered templates.
5. **Cross-Device Draft Backup & Restore Engine (STATE-05)** — Generate 8-character human-readable backup code (`VR-XXXXXX`) via clickable SaveIndicator, AppHeader, or ResumeBanner. Store full draft state (form answers + document metadata and preview blobs) in a mock cloud registry. Handle cross-device restore with conflict detection modal comparing local vs remote draft before replacing.
6. **Duplicate Passport Application Detection Guard (STATE-06)** — Check for active duplicate applications on passport field blur in Stage 2 (Identity) against hybrid registry (local submissions + seeded demo passports e.g. `Z1234567`). Render inline amber warning card with dual actions ("[Track Existing Application]" opening pre-filled tracking modal vs "[Continue Anyway]").

Multi-language translation strings for Stage 5, full PWA service worker caching, and whole-journey WCAG/3G perf auditing belong in Phase 6.
</domain>

<decisions>
## Implementation Decisions

### Tracking Experience & Demo Controls

- **D-01:** Tracking is accessible via dual entry points: embedded live on Stage 5 Confirmation screen upon submission, and via a "Track Application" action in the `AppHeader` opening a reference lookup modal anytime from any screen. — **Reversibility:** costly — integrates into `AppShell`, `AppHeader`, and Stage 5 screen topology.
- **D-02:** Demo timeline transitions (TRCK-02) are driven by an interactive scenario control bar on the timeline (similar to the Phase 4 payment scenario bar) with buttons ("[Advance Status]", "[Simulate Info Request]", "[Simulate Approval]") that dispatch live status-change toast notifications. — **Reversibility:** reversible — demo harness component wired to `MockTrackingService`.
- **D-03:** Application sharing (CNFRM-01, TRCK-03) uses `navigator.share` on supported mobile devices with a fallback to direct WhatsApp URL (`https://wa.me/?text=...`) and a 1-tap "Copy Reference & Link" button with toast confirmation. — **Reversibility:** reversible — utility function and button component.
- **D-04:** Simulated SMS/email notifications (CNFRM-04) trigger in-app toast alerts and render an expandable "Sent Notifications" preview disclosure card on Stage 5 displaying the exact rendered templates. — **Reversibility:** reversible — UI presentation component integrating with `INotificationService`.

### Interview Checklist & Next Steps Delivery

- **D-05:** The interview preparation checklist (CNFRM-03) is dynamically customized based on destination country and visa category (Student includes university I-20/admission + funding proof; Business includes employer sponsorship/NOC; Tourist includes itinerary and accommodation). — **Reversibility:** costly — checklist rules engine and dataset in `src/features/confirmation/`.
- **D-06:** Checklist export provides dual output: a 1-tap plain text `.txt` download (reusing the Phase 3 template generator pattern) and a clean printable view (`window.print` with `@media print` CSS consistent with Phase 4 receipts). — **Reversibility:** reversible — text formatter and print styling.
- **D-07:** The on-screen checklist on Stage 5 includes interactive checkbox controls with a live completion counter ("X of Y items ready") so applicants can track physical document preparation. — **Reversibility:** reversible — interactive stateful component.
- **D-08:** The checklist incorporates an "Interview Day Essentials" section detailing critical consulate arrival rules (arrival 15 min early, original documents + 2 copies, no electronic devices or smartwatches inside embassy). — **Reversibility:** reversible — checklist content configuration.

### Cross-Device Draft Backup & Restore Code

- **D-09:** Cross-device draft backup codes (STATE-05) use an 8-character human-readable alphanumeric format (e.g., `VR-784291`) mapped to serialized draft state in a mock cloud registry (`MockBackupService` / `localStorage` backed). — **Reversibility:** costly — defines draft backup schema, service contracts, and restore validators.
- **D-10:** Draft backup code generation is accessible by clicking the `SaveIndicator` in the top bar, from an option in `AppHeader`, or via an action in `ResumeBanner`. — **Reversibility:** costly — connects persistence indicators to backup generation modal.
- **D-11:** Restoring a draft on a device with existing local answers presents a conflict warning modal with side-by-side draft comparison (Passport/Visa/Date) and explicit "[Replace Local Draft]" or "[Keep Current]" choices. — **Reversibility:** costly — modal dialog guarding state machine reset and storage overwrite.
- **D-12:** The mock cloud registry stores full draft state including form answers, document metadata, and preview thumbnail blobs so cross-device restore preserves 100% of application progress. — **Reversibility:** costly — backup payload serialization across `localStorage` and `idb-keyval`.

### Duplicate Application Detection Flow

- **D-13:** Duplicate application detection (STATE-06) triggers on passport number field blur in Stage 2 (Identity) once a valid 8-character format is entered, and during initial lookup. — **Reversibility:** costly — hooks into `PersonalIdentityForm` validation and passport lookup.
- **D-14:** Duplicate detection checks a hybrid registry consisting of locally submitted applications stored in the browser plus pre-seeded mock active applications (e.g. seeded demo passport `Z1234567`). — **Reversibility:** costly — service layer registry in `src/services/mock/passport.ts`.
- **D-15:** Detected duplicates render an inline amber warning card with existing application reference, submission date, and current status, offering two clear actions: "[Track Existing Application]" and "[Continue With New Application Anyway]". — **Reversibility:** costly — warning card component and form validation gate.
- **D-16:** Clicking "[Track Existing Application]" on the duplicate warning card opens the tracking modal pre-filled with the existing reference number and loads the live timeline without destroying the active draft. — **Reversibility:** reversible — modal trigger maintaining form draft state.

### Agent's Discretion

- Visual styling and icons for timeline status nodes (completed green, active blue pulsing, upcoming gray), layout adjustments for small 320px mobile viewports, print stylesheet formatting for interview checklist `.txt` generator and print CSS, and animation transitions for tracking status advance toasts.
</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product & Requirements References

- `visarethink/indian_visa_prd.md` §2, §4, §5 (Stage 5 Confirmation & Tracking, Scale & Safety #8 Fraud Prevention) — Reference number format, status timeline stages, interview checklist download, SMS/email backup, post-submission tracking, duplicate detection.
- `visarethink/visa_prototype.jsx` (lines 950–1006) — Reference Stage 5 layout, timeline rendering, reference ID display, "What happens next?" section.
- `.planning/REQUIREMENTS.md` — CNFRM-01, CNFRM-02, CNFRM-03, CNFRM-04, TRCK-01, TRCK-02, TRCK-03, STATE-05, STATE-06 definitions.
- `.planning/ROADMAP.md` — Phase 5 goals and success criteria.

### Architecture & Foundation References

- `.planning/phases/01-foundation-design-system-persistence-engine/01-CONTEXT.md` — Phase 1 established decisions (persistence engine, autosave, `idb-keyval`, typed mock services, `ITrackingService`, `INotificationService`, `IPassportLookupService`).
- `.planning/phases/02-guided-journey-visa-selection-personal-details/02-CONTEXT.md` — Phase 2 established decisions (`PersonalDetailsScreen`, `PersonalIdentityForm`, `ExpiryWarningCard`, validation hooks).
- `.planning/phases/03-document-upload-pipeline/03-CONTEXT.md` — Phase 3 established decisions (`generateTemplateContent` plain text downloads, document metadata, preview sheets).
- `.planning/phases/04-review-payment-submission/04-CONTEXT.md` — Phase 4 established decisions (receipt data model, print styling, scenario switcher pattern, locked submission draft state).
- `src/services/types.ts` — `ITrackingService`, `TimelineEntry`, `INotificationService`, `IPassportLookupService`, `ServiceOutcome`.
- `src/services/mock/tracking.ts` — `MockTrackingService`.
- `src/services/mock/notifications.ts` — `MockNotificationService`.
- `src/services/mock/passport.ts` — `MockPassportLookupService`.
- `src/features/wizard/types.ts` — `StepId` (`confirmation`), `WizardMachineContext`, `WizardEvent`.
- `src/features/wizard/machine.ts` — Wizard state machine transitions and persistence.
- `src/components/ui/` — Design system primitives (`Card`, `Button`, `Sheet`, `Toast`, `ProgressStepper`, `Input`, `Checkbox`).
- `src/components/ResumeBanner.tsx` & `src/components/SaveIndicator.tsx` — Draft resumption and persistence feedback.
  </canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/services/mock/tracking.ts`: `MockTrackingService` with `getTimeline(reference)` returning `TimelineEntry[]`.
- `src/services/mock/notifications.ts`: `MockNotificationService` with `sendEmail` and `sendSms`.
- `src/services/mock/passport.ts`: `MockPassportLookupService` for passport lookup and duplicate checking.
- `src/services/mock/scenarios.ts`: Scenario override framework (`setMockScenario`) for reproducible testing.
- `src/components/ui/Card.tsx`: Base container for confirmation cards, timeline cards, checklist cards, and duplicate warnings.
- `src/components/ui/Button.tsx`: 48px touch-target buttons with primary, secondary, and outline variants.
- `src/components/ui/Sheet.tsx`: Accessible sheet/modal for standalone tracking lookup and draft backup/restore dialogs.
- `src/components/ui/Toast.tsx`: Toast provider (`useToast`) for dispatching status change and notification alerts.
- `src/components/ui/ProgressStepper.tsx`: Step progress primitive adaptable for vertical status timelines.
- `src/components/ui/Checkbox.tsx`: Checkbox primitive for interactive interview checklist items.
- `src/features/review/ReceiptCard.tsx`: Receipt component embedded alongside confirmation details.

### Established Patterns

- Auto-formatting utilities for passport numbers and reference numbers (`src/features/wizard/formatters.ts`).
- Scenario bars for developer testing placed at the bottom of feature cards (e.g. `PaymentScenarioBar`).
- 1-tap plain-text template file downloads using blob URLs (`generateTemplateContent` in Phase 3).
- Dedicated `@media print` CSS hiding navigation/buttons and formatting cards for printing.
- State machines and reactive selectors deriving completion state (`useWizardActor`, `useSelector`).

### Integration Points

- `src/features/confirmation/`: New feature module containing:
  - `ConfirmationScreen.tsx`: Stage 5 full view (Reference card, Receipt, Timeline, Checklist, Notifications preview).
  - `StatusTimelineCard.tsx`: Visual vertical status timeline with demo scenario controls and change alerts.
  - `InterviewChecklistCard.tsx`: Dynamic visa-specific checklist, interactive checkboxes, and `.txt`/print download.
  - `SentNotificationsCard.tsx`: Preview of dispatched SMS/Email templates.
  - `TrackingModal.tsx`: Accessible modal for on-demand reference tracking opened from AppHeader or duplicate card.
  - `DraftBackupModal.tsx`: Modal for generating 8-char backup codes and restoring cross-device drafts.
  - `DuplicateWarningCard.tsx`: Inline warning rendered in `PersonalIdentityForm` when duplicate passport is found.
- `src/components/AppShell.tsx` & `src/App.tsx`: Wire "Track Application" header button, backup code modal triggers, and Stage 5 screen.
- `src/features/personal/PersonalIdentityForm.tsx`: Wire duplicate passport detection check on blur.
  </code_context>

<specifics>
## Specific Ideas

- Visual reference number badge with bold green monospaced text, copy button, and WhatsApp icon button for instant sharing to family/friends.
- Vertical status timeline with distinct node states: green completed checkmark, pulsing blue "in-progress" indicator, and gray upcoming step.
- Interactive demo scenario controls allowing 1-click status advances to simulate the 3-day consulate workflow in 5 seconds for presentations and automated E2E tests.
- Downloadable interview checklist `.txt` formatted with clear ASCII borders, applicant reference, visa category, and checkable `[ ]` brackets for offline prep.
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed strictly within the Phase 5 Confirmation, Tracking & Recovery domain.
</deferred>

---

_Phase: 05-Confirmation, Tracking & Recovery_
_Context gathered: 2026-08-26_
