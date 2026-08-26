---
phase: 5
slug: confirmation-tracking-recovery
status: approved
shadcn_initialized: false
preset: none
created: 2026-08-26
reviewed_at: 2026-08-26
---

# Phase 5 — UI Design Contract: Confirmation, Tracking & Recovery

> Visual and interaction contract for Stage 5: Confirmation, Tracking & Recovery. Verified against design tokens, accessibility contracts, and upstream decisions.
>
> **Context:** All design decisions are locked per `05-CONTEXT.md` (D-01 to D-16), REQUIREMENTS.md (`CNFRM-01` to `CNFRM-04`, `TRCK-01` to `TRCK-03`, `STATE-05`, `STATE-06`), and Phase 1 design system tokens.

---

## Design System

| Property          | Value                                                                                                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool              | none — custom component library in `src/components/ui/`                                                                                                                                                                      |
| Preset            | not applicable                                                                                                                                                                                                               |
| Component library | Custom primitives: `Card`, `Button`, `RadioCard`, `Input`, `Field`, `Checkbox`, `ErrorSummary`, `Sheet`, `Toast`, `ProgressStepper`, `SaveIndicator`                                                                         |
| Icon library      | `lucide-react` (24px grid, 2px stroke): `CheckCircle2`, `Clock`, `Share2`, `Copy`, `Download`, `Printer`, `MessageSquare`, `AlertTriangle`, `Search`, `RotateCcw`, `Key`, `FileText`, `ExternalLink`, `ShieldCheck`, `Check` |
| Font              | Noto Sans via Fontsource (400 regular, 600 semibold)                                                                                                                                                                         |
| Styling engine    | Tailwind v4, CSS tokens in `src/styles/theme.css`                                                                                                                                                                            |

---

## Spacing Scale

| Token | Value | Usage                                                                                   |
| ----- | ----- | --------------------------------------------------------------------------------------- |
| xs    | 4px   | Icon-to-label inline gaps, status pill padding, badge padding                           |
| sm    | 8px   | Gap between timeline node icon and text, copy button gaps, checklist item spacing       |
| md    | 16px  | Card content rhythm, input field vertical separation, tracking details spacing          |
| lg    | 24px  | Card inner padding (`p-6`), section inner padding, modal content padding                |
| xl    | 32px  | Separation between major confirmation cards                                             |
| 2xl   | 48px  | **Minimum touch-target size** for all interactive buttons, checkboxes, and copy targets |
| 3xl   | 64px  | Page vertical rhythm, modal backdrop margins, print header padding                      |

Rules:

- All interactive buttons (Copy Reference, Share on WhatsApp, Download Checklist, Print) have ≥48px touch height.
- Status timeline nodes have 32px diameter with accessible connecting vertical line.
- Checkbox checklist items have ≥48px tap targets with padding around checkbox and label.

---

## Typography

| Role    | Size | Weight | Line Height | Usage                                                                                       |
| ------- | ---- | ------ | ----------- | ------------------------------------------------------------------------------------------- |
| Display | 28px | 600    | 1.2         | Screen title ("Application Submitted Successfully!")                                        |
| Heading | 20px | 600    | 1.2         | Card titles ("Application Reference", "Status Timeline", "Interview Preparation Checklist") |
| Label   | 16px | 600    | 1.4         | Reference number display, checklist category headers, button text                           |
| Body    | 16px | 400    | 1.5         | Timeline descriptions, next steps instructions, embassy rules, backup instructions          |
| Meta    | 14px | 400    | 1.4         | Helper hints, timeline dates, expected durations, reference timestamps                      |

Rules:

- Sentence case everywhere.
- Reference number (`VR-YYYY-XXXXXX`) renders boldly at 24px monospaced text with green-success tint.
- Backup code (`VR-XXXXXX`) renders prominently at 20px monospaced uppercase letters.

---

## Color

| Role                | Value                      | Usage                                                                                     |
| ------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| Dominant (60%)      | `#F7F7FA` (surface-bg)     | Screen background canvas                                                                  |
| Secondary (30%)     | `#FFFFFF` (surface-card)   | Confirmation cards, Timeline card, Checklist card, Modal surfaces                         |
| Accent (10%)        | `#3730A3` (indigo-primary) | Primary "Download Checklist" button, WhatsApp share button, active focus rings            |
| Destructive         | `#B91C1C` (red-error)      | Error alerts, failed lookup messages                                                      |
| Warning / Attention | `#B45309` (saffron-deep)   | Duplicate application warning card (`#FFFBEB` background), action-required timeline state |
| Success             | `#166534` (green-success)  | Reference card banner (`#F0FDF4` background), completed timeline nodes, copy confirmation |

Contrast obligations:

- White text on `#3730A3` (indigo primary): 9.9:1 (WCAG AAA)
- `#166534` on `#F0FDF4` (success reference card): 7.8:1 (WCAG AAA)
- `#B45309` on `#FFFBEB` (duplicate warning card): 6.2:1 (WCAG AA)

---

## Copywriting Contract

All strings localized via `src/i18n/locales/en/common.json`.

| Element                     | Copy                                                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Confirmation Title          | `Application Submitted Successfully!`                                                                                         |
| Confirmation Subtitle       | `Your visa application has been received and is now being processed.`                                                         |
| Reference Number Label      | `Application Reference Number`                                                                                                |
| Reference Number Hint       | `Save this reference number to track your application or resume inquiries.`                                                   |
| Copy Reference CTA          | `Copy Reference Number`                                                                                                       |
| Reference Copied Toast      | `✓ Reference number copied to clipboard!`                                                                                     |
| Share WhatsApp CTA          | `Share via WhatsApp`                                                                                                          |
| Web Share CTA               | `Share Application`                                                                                                           |
| Timeline Card Title         | `Live Status Timeline`                                                                                                        |
| Timeline Step 1             | `Application Received`                                                                                                        |
| Timeline Step 2             | `Documents Under Review`                                                                                                      |
| Timeline Step 3             | `Interview Scheduling`                                                                                                        |
| Timeline Step 4             | `Visa Decision & Dispatch`                                                                                                    |
| Demo Advance CTA            | `[Demo: Advance Status]`                                                                                                      |
| Demo Info Request CTA       | `[Demo: Simulate Info Request]`                                                                                               |
| Demo Approval CTA           | `[Demo: Simulate Approval]`                                                                                                   |
| Checklist Card Title        | `Interview Preparation & Next Steps Checklist`                                                                                |
| Checklist Counter Label     | `{{completedCount}} of {{totalCount}} items prepared`                                                                         |
| Download Checklist CTA      | `Download Checklist (.txt)`                                                                                                   |
| Print Checklist CTA         | `Print Preparation Guide`                                                                                                     |
| Sent Notifications Title    | `Simulated Email & SMS Notifications`                                                                                         |
| Sent Notifications Subtitle | `Inspect confirmation messages dispatched to your contact details.`                                                           |
| Track App Header CTA        | `Track Application`                                                                                                           |
| Track Modal Title           | `Track Your Application Status`                                                                                               |
| Track Modal Input Label     | `Enter 14-Character Reference Number (e.g. VR-2026-849201)`                                                                   |
| Track Modal Search CTA      | `Track Status`                                                                                                                |
| Backup Draft Header CTA     | `Backup Draft`                                                                                                                |
| Backup Modal Title          | `Generate Email Backup Code`                                                                                                  |
| Backup Modal Body           | `Restore your application on any device using this unique 8-character code.`                                                  |
| Restore Draft Title         | `Restore Application Draft`                                                                                                   |
| Restore Conflict Title      | `Existing Local Draft Detected`                                                                                               |
| Replace Draft CTA           | `Replace Local Draft with Backup`                                                                                             |
| Keep Draft CTA              | `Keep Current Local Draft`                                                                                                    |
| Duplicate Warning Title     | `Active Application Already Found for This Passport`                                                                          |
| Duplicate Warning Body      | `An in-progress application (Ref: {{referenceNumber}}) was found for passport {{passportNumber}}. Current status: {{status}}` |
| Track Duplicate CTA         | `Track Existing Application`                                                                                                  |
| Continue Duplicate CTA      | `Continue With New Application Anyway`                                                                                        |

---

## Registry Safety

| Registry               | Blocks Used                                      | Safety Gate    |
| ---------------------- | ------------------------------------------------ | -------------- |
| shadcn official        | none — custom primitives in `src/components/ui/` | not applicable |
| Third-party registries | none declared                                    | not applicable |

---

## Component Inventory & Interaction Contracts

| Component                                                                           | Contract                                                                                                                                   |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **ConfirmationScreen** (`src/features/confirmation/ConfirmationScreen.tsx`)         | Main Stage 5 container rendering Reference Card, Receipt, Status Timeline, Interview Checklist, and Sent Notifications.                    |
| **ReferenceCard** (`src/features/confirmation/ReferenceCard.tsx`)                   | Card displaying official reference ID (`VR-YYYY-XXXXXX`), 1-tap clipboard copy button, WhatsApp deep link, and Web Share API trigger.      |
| **StatusTimelineCard** (`src/features/confirmation/StatusTimelineCard.tsx`)         | Vertical status timeline showing dated stages, durations, next actions, with interactive demo scenario controller dispatching live toasts. |
| **InterviewChecklistCard** (`src/features/confirmation/InterviewChecklistCard.tsx`) | Visa-specific checklist with interactive checkboxes, progress counter, embassy arrival rules, and dual `.txt` / print export triggers.     |
| **SentNotificationsCard** (`src/features/confirmation/SentNotificationsCard.tsx`)   | Expandable disclosure card previewing simulated SMS and Email templates.                                                                   |
| **TrackingModal** (`src/features/confirmation/TrackingModal.tsx`)                   | Accessible modal opened from AppHeader for on-demand reference lookup, displaying timeline and application summary.                        |
| **DraftBackupModal** (`src/features/confirmation/DraftBackupModal.tsx`)             | Accessible modal for generating 8-character codes, sending simulated email, and restoring drafts with conflict comparison dialog.          |
| **DuplicateWarningCard** (`src/features/confirmation/DuplicateWarningCard.tsx`)     | Inline amber alert card rendered on duplicate passport entry with 1-tap tracking action and continue override.                             |

---

## UI Considerations (State Coverage)

### 1. Stage 5 Confirmation States

- **Submission Complete:** Reference Card prominently visible with green checkmark and monospaced reference ID. Live timeline shows "Application Received" as completed. Interview checklist renders visa-specific items with interactive checkboxes.
- **Copy & Share Interaction:** Tapping "Copy Reference" shows instant green checkmark and triggers toast alert. Tapping "Share via WhatsApp" opens WhatsApp web/mobile deep link with pre-formatted message.
- **Demo Timeline Advancement:** Clicking `[Demo: Advance Status]` advances the active stage to "Documents Under Review", plays smooth transition, and dispatches an in-app status toast ("Status updated: Documents Under Review").

### 2. Standalone Tracking States

- **Empty / Input State:** Modal opens with focus on reference input field with placeholder `VR-2026-XXXXXX`.
- **Valid Reference Found:** Displays applicant summary card and vertical status timeline matching the reference.
- **Invalid Reference Error:** Shows inline error "Application reference not found. Please verify your reference number."

### 3. Draft Backup & Restore States

- **Code Generation:** User enters email (or uses draft email), clicks "Generate Code", receives 8-character code (e.g. `VR-784291`) with 1-tap copy action and simulated email confirmation toast.
- **Restore Input:** User inputs 8-character code. System validates code in mock registry.
- **Conflict Detected:** If local draft exists, shows side-by-side comparison modal with "[Replace Local Draft]" or "[Keep Current]" buttons.
- **Restore Success:** Machine context is reset to restored answers, toast confirms "Draft restored successfully", and wizard navigates to first incomplete step.

### 4. Duplicate Passport Detection States

- **Passport Field Blur:** Typing an 8-character passport number triggers immediate check against local submissions and seeded passports (e.g. `Z1234567`).
- **Duplicate Found:** `DuplicateWarningCard` animates below passport field with amber border and details of existing active application.
- **Track Existing Action:** Tapping "Track Existing Application" opens `TrackingModal` pre-filled with the found reference ID while keeping the active draft intact.
- **Continue Anyway Action:** Tapping "Continue Anyway" dismisses warning and allows applicant to proceed.

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved
