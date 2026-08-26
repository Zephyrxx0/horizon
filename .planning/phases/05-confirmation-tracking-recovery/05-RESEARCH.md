# Phase 5: Confirmation, Tracking & Recovery - Research

**Researched:** 2026-08-26
**Domain:** Post-submission confirmation package, shareable reference generation, vertical status timeline with demo transition controllers & live change alerts, multi-channel WhatsApp/Web Share, dynamic visa-specific interview checklist with interactive checkboxes and .txt/print exports, simulated SMS/Email notifications preview, cross-device draft backup & restore engine with 8-character codes and conflict resolution, and duplicate passport application detection guard.
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md & UI-SPEC.md)

### Locked Decisions

**Tracking Experience & Demo Controls**

- **D-01:** Tracking is accessible via dual entry points: embedded live on Stage 5 Confirmation screen upon submission, and via a "Track Application" action in the `AppHeader` opening a reference lookup modal anytime from any screen.
- **D-02:** Demo timeline transitions (TRCK-02) are driven by an interactive scenario control bar on the timeline (similar to the Phase 4 payment scenario bar) with buttons (`[Advance Status]`, `[Simulate Info Request]`, `[Simulate Approval]`) that dispatch live status-change toast notifications.
- **D-03:** Application sharing (CNFRM-01, TRCK-03) uses `navigator.share` on supported mobile devices with a fallback to direct WhatsApp URL (`https://wa.me/?text=...`) and a 1-tap "Copy Reference & Link" button with toast confirmation.
- **D-04:** Simulated SMS/email notifications (CNFRM-04) trigger in-app toast alerts and render an expandable "Sent Notifications" preview disclosure card on Stage 5 displaying the exact rendered templates.

**Interview Checklist & Next Steps Delivery**

- **D-05:** The interview preparation checklist (CNFRM-03) is dynamically customized based on destination country and visa category (Student includes university I-20/admission + funding proof; Business includes employer sponsorship/NOC; Tourist includes itinerary and accommodation).
- **D-06:** Checklist export provides dual output: a 1-tap plain text `.txt` download (reusing the Phase 3 template generator pattern) and a clean printable view (`window.print` with `@media print` CSS consistent with Phase 4 receipts).
- **D-07:** The on-screen checklist on Stage 5 includes interactive checkbox controls with a live completion counter ("X of Y items ready") so applicants can track physical document preparation.
- **D-08:** The checklist incorporates an "Interview Day Essentials" section detailing critical consulate arrival rules (arrival 15 min early, original documents + 2 copies, no electronic devices or smartwatches inside embassy).

**Cross-Device Draft Backup & Restore Code**

- **D-09:** Cross-device draft backup codes (STATE-05) use an 8-character human-readable alphanumeric format (e.g., `VR-784291`) mapped to serialized draft state in a mock cloud registry (`MockBackupService` / `localStorage` backed).
- **D-10:** Draft backup code generation is accessible by clicking the `SaveIndicator` in the top bar, from an option in `AppHeader`, or via an action in `ResumeBanner`.
- **D-11:** Restoring a draft on a device with existing local answers presents a conflict warning modal with side-by-side draft comparison (Passport/Visa/Date) and explicit `[Replace Local Draft]` or `[Keep Current]` choices.
- **D-12:** The mock cloud registry stores full draft state including form answers, document metadata, and preview thumbnail blobs so cross-device restore preserves 100% of application progress.

**Duplicate Application Detection Flow**

- **D-13:** Duplicate application detection (STATE-06) triggers on passport number field blur in Stage 2 (Identity) once a valid 8-character format is entered, and during initial lookup.
- **D-14:** Duplicate detection checks a hybrid registry consisting of locally submitted applications stored in the browser plus pre-seeded mock active applications (e.g. seeded demo passport `Z1234567`).
- **D-15:** Detected duplicates render an inline amber warning card with existing application reference, submission date, and current status, offering two clear actions: `[Track Existing Application]` and `[Continue With New Application Anyway]`.
- **D-16:** Clicking `[Track Existing Application]` on the duplicate warning card opens the tracking modal pre-filled with the existing reference number and loads the live timeline without destroying the active draft.

### Agent's Discretion

Visual styling and icons for timeline status nodes (completed green, active blue pulsing, upcoming gray), layout adjustments for small 320px mobile viewports, print stylesheet formatting for interview checklist `.txt` generator and print CSS, and animation transitions for tracking status advance toasts.

### Deferred Ideas (OUT OF SCOPE)

None — Phase 5 remains strictly focused on Confirmation, Tracking & Recovery. Full 6-language translations, offline service workers, and end-to-end accessibility/performance audits belong in Phase 6.
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID             | Description                                                                                                     | Research Support                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CNFRM-01**   | After submission user receives a shareable reference number                                                     | Generated format `VR-YYYY-XXXXXX` (e.g., `VR-2026-849201`), copy to clipboard button with toast alert, and prominent card display.                           |
| **CNFRM-02**   | User sees a status timeline with human-readable stages, dates, expected durations, and any next required action | `StatusTimelineCard` rendering vertical progress nodes with human-readable dates, expected durations ("1-2 days"), and required actions.                     |
| **CNFRM-03**   | User can download an interview-prep / next-steps checklist                                                      | `InterviewChecklistCard` with dynamic visa-specific checklists, interactive checkboxes ("X of Y ready"), 1-tap `.txt` generator, and printable view.         |
| **CNFRM-04**   | Confirmation is backed up via simulated SMS/email notification (console/logged)                                 | `INotificationService` integration with toast alerts and expandable `SentNotificationsCard` previewing rendered templates.                                   |
| **TRCK-01**    | User can track application status anytime by entering reference number                                          | `TrackingModal` accessible from `AppHeader` allowing reference number lookup and timeline visualization from any screen.                                     |
| **TRCK-02**    | Status updates transition through mocked demo timeline states with change alerts                                | Interactive demo scenario bar on timeline (`[Advance Status]`, `[Simulate Info Request]`, `[Simulate Approval]`) triggering live status change toast alerts. |
| **TRCK-03**    | User can share their confirmation via WhatsApp-native share                                                     | Web Share API (`navigator.share`) on mobile with fallback to `https://wa.me/?text=...` pre-filled message with reference ID and portal URL.                  |
| **STATE-05**   | User can generate an email backup code that restores their application draft on any device                      | 8-character short code generator (`VR-XXXXXX`), mock cloud storage registry, `DraftBackupModal`, and conflict comparison dialog.                             |
| **STATE-06**   | Duplicate application detection warns when the same passport has an active in-progress application              | `DuplicateWarningCard` in `PersonalIdentityForm` triggered on blur against hybrid registry (local submissions + seeded demo passport `Z1234567`).            |
| **A11Y-01/02** | Focus management and screen reader announcements                                                                | Accessible dialogs with `aria-modal`, `aria-live` region for timeline updates and toast notifications.                                                       |

</phase_requirements>

## Architectural Responsibility Map

| Capability                          | Module / Layer                                              | Description                                                                                                             |
| ----------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Confirmation Screen Orchestrator    | `src/features/confirmation/ConfirmationScreen.tsx`          | Stage 5 container rendering Reference Card, Receipt, Status Timeline, Interview Checklist, and Sent Notifications.      |
| Reference & Sharing Card            | `src/features/confirmation/ReferenceCard.tsx`               | Reference number badge with copy button, WhatsApp deep link, and Web Share API integration.                             |
| Status Timeline & Scenario Bar      | `src/features/confirmation/StatusTimelineCard.tsx`          | Vertical status timeline nodes, dynamic timeline progression, and demo scenario controls triggering change toasts.      |
| Interview Prep Checklist & Exporter | `src/features/confirmation/InterviewChecklistCard.tsx`      | Visa-specific checklist items, interactive checkboxes with progress counter, and `.txt` blob download / print triggers. |
| Sent Notifications Preview Card     | `src/features/confirmation/SentNotificationsCard.tsx`       | Expandable card previewing simulated SMS and Email confirmation message bodies.                                         |
| Standalone Tracking Modal           | `src/features/confirmation/TrackingModal.tsx`               | Dialog opened from AppHeader for on-demand reference lookup, displaying timeline and application summary.               |
| Draft Backup & Restore Engine       | `src/features/confirmation/DraftBackupModal.tsx`            | Modal for generating 8-character codes, sending simulated email, and restoring drafts with conflict comparison.         |
| Duplicate Application Guard         | `src/features/confirmation/DuplicateWarningCard.tsx`        | Inline amber alert card rendered on duplicate passport entry with 1-tap tracking action and continue override.          |
| Mock Backup & Registry Services     | `src/services/mock/backup.ts`, `passport.ts`, `tracking.ts` | Services managing remote draft snapshots, duplicate checking, and dynamic timeline progression.                         |
| App Shell & Header Integrations     | `src/components/AppShell.tsx`, `App.tsx`                    | Top-level "Track Application" header action and backup modal triggers.                                                  |

## Technical Implementation Details

### 1. Dynamic Status Timeline & Demo Controller State

```typescript
export interface TimelineStep {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'action-required';
  date: string;
  expectedDuration?: string;
  nextAction?: string;
  notes?: string;
}

export interface ApplicationTrackingRecord {
  referenceNumber: string;
  passportNumber: string;
  applicantName: string;
  destinationCountry: string;
  visaType: string;
  submittedAt: string;
  currentStageIndex: number;
  timeline: TimelineStep[];
}
```

### 2. WhatsApp & Native Web Share Implementation

```typescript
export async function shareApplicationReference(
  referenceNumber: string,
  visaType: string,
): Promise<boolean> {
  const shareText = `My Indian Visa Application (${visaType}) has been submitted! Reference ID: ${referenceNumber}. Track status: ${window.location.origin}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Visa Application Confirmation',
        text: shareText,
        url: window.location.href,
      });
      return true;
    } catch (e) {
      // Fall through to WhatsApp or copy fallback if user dismissed share sheet
    }
  }

  // WhatsApp Deep-Link Fallback
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  return true;
}
```

### 3. Visa-Tailored Interview Checklist & Plain Text Generator

```typescript
export function generateChecklistText(
  referenceNumber: string,
  applicantName: string,
  visaType: string,
  country: string,
  items: Array<{ title: string; required: boolean; category: string }>,
): string {
  const lines: string[] = [
    '=================================================================',
    '         VISA APPLICATION - INTERVIEW & EMBASSY CHECKLIST        ',
    '=================================================================',
    `Reference Number: ${referenceNumber}`,
    `Applicant Name:   ${applicantName}`,
    `Visa Category:    ${visaType} - ${country}`,
    `Generated On:     ${new Date().toLocaleDateString('en-GB')}`,
    '-----------------------------------------------------------------',
    '',
    'REQUIRED DOCUMENTS CHECKLIST:',
    ...items.map((item) => ` [ ] ${item.title}${item.required ? ' (MANDATORY)' : ' (SUPPORTING)'}`),
    '',
    '-----------------------------------------------------------------',
    'CONSULATE ARRIVAL ESSENTIALS & EMBASSY RULES:',
    ' [ ] Arrive 15 minutes before your scheduled appointment time',
    ' [ ] Carry your original current passport plus all prior passports',
    ' [ ] Carry 2 printed physical copies of this checklist & payment receipt',
    ' [ ] Prohibited: Mobile phones, smartwatches, sealed bags & liquids',
    ' [ ] Dress code: Business casual or formal attire recommended',
    '=================================================================',
  ];
  return lines.join('\n');
}
```

### 4. Cross-Device Draft Backup & Conflict Comparison

```typescript
export interface DraftBackupSnapshot {
  code: string; // e.g. "VR-784291"
  createdAt: string;
  email: string;
  answers: Record<string, unknown>;
  documentMeta: Array<{
    slotId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    previewUrl?: string;
  }>;
}
```

### 5. Duplicate Application Detection Logic

```typescript
export function checkForDuplicateApplication(passportNumber: string): {
  isDuplicate: boolean;
  record?: ApplicationTrackingRecord;
} {
  const normalized = passportNumber.trim().toUpperCase();
  if (normalized.length !== 8) return { isDuplicate: false };

  // Check seeded mock duplicate records (e.g. Z1234567)
  if (SEEDED_DUPLICATE_PASSPORTS[normalized]) {
    return { isDuplicate: true, record: SEEDED_DUPLICATE_PASSPORTS[normalized] };
  }

  // Check locally submitted applications in localStorage registry
  const localSubmissions = getStoredSubmissions();
  const found = localSubmissions.find((s) => s.passportNumber.toUpperCase() === normalized);
  if (found) {
    return { isDuplicate: true, record: found };
  }

  return { isDuplicate: false };
}
```

## Validation Architecture

### Verification Strategy

- **Unit Tests (Vitest):**
  - Reference number generator and formatter (`formatReferenceNumber`).
  - Checklist item filtering by visa type and `.txt` template generation.
  - Backup code generation, serialization, and deserialization.
  - Duplicate passport detection logic against local and seeded records.
  - Web share and WhatsApp URL generator.
- **Component Tests (Vitest + Testing Library + vitest-axe):**
  - `ReferenceCard` copy button and share triggers with zero axe violations.
  - `StatusTimelineCard` node rendering and demo scenario buttons advancing status with toast alerts.
  - `InterviewChecklistCard` interactive checkboxes updating counter and print/download triggers.
  - `SentNotificationsCard` expandable preview of SMS/Email.
  - `TrackingModal` opening from header, executing lookup, and displaying timeline.
  - `DraftBackupModal` code generation, email input, copy action, and conflict comparison dialog.
  - `DuplicateWarningCard` appearing on Stage 2 blur with 1-tap track action and continue override.
- **E2E Tests (Playwright):**
  - End-to-end journey completion advancing to Stage 5 Confirmation.
  - Verify shareable reference ID and 1-tap clipboard copy.
  - Verify interactive status timeline advancement via demo scenario controller with toast alert.
  - Verify interactive interview checklist item ticking and plain-text file download.
  - Verify AppHeader "Track Application" modal opening and searching by reference number.
  - Verify draft backup code generation from SaveIndicator and cross-device restore simulation.
  - Verify duplicate passport warning appears on entering `Z1234567` in Stage 2 with tracking modal launch.

## RESEARCH COMPLETE
