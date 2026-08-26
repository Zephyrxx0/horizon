# Phase 5: Confirmation, Tracking & Recovery - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-26
**Phase:** 05-confirmation-tracking-recovery
**Areas discussed:** Tracking Experience & Demo Controls, Interview Checklist & Next Steps Format, Cross-Device Draft Backup & Restore Code, Duplicate Application Detection Flow

---

## Tracking Experience & Demo Controls

| Option                   | Description                                                                                                                                                        | Selected |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Dual Access              | Embed live timeline directly on the Stage 5 Confirmation screen, and add a "Track Application" action in the AppHeader that opens a reference lookup modal anytime | ✓        |
| Standalone Tracker View  | Add a top-level toggle in the app shell between "Application Form" and "Track Application" screen                                                                  |          |
| Confirmation Screen Only | Tracking timeline only lives on Stage 5; returning users must use a deep link with their reference number                                                          |          |

**User's choice:** Dual Access — Embed live timeline directly on the Stage 5 Confirmation screen, and add a "Track Application" action in the AppHeader that opens a reference lookup modal anytime
**Notes:** Provides convenient entry for returning users without interrupting in-progress drafts.

---

## Demo Timeline State Transitions & Simulation Controls

| Option                                     | Description                                                                                                                                                                                          | Selected |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Interactive Demo Controller + Toast Alerts | Include a test/demo scenario bar (similar to Phase 4 payment bar) with "[Advance Status]", "[Simulate Info Request]", and "[Simulate Approval]" buttons that trigger live status change toast alerts | ✓        |
| Auto-Timer Simulation                      | Automatically advance the mock timeline every 15-30 seconds with status change notifications popping up                                                                                              |          |
| Static Mock Stages                         | Render deterministic timeline dates based on the reference number with no runtime state transitions                                                                                                  |          |

**User's choice:** Interactive Demo Controller + Toast Alerts
**Notes:** Consistent with the Phase 4 scenario switcher pattern; gives full control to testers and reviewers.

---

## WhatsApp & Native Share Mechanism

| Option                                           | Description                                                                                                                                                            | Selected |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Web Share API + WhatsApp Deep-Link + Copy Button | Use navigator.share on supported mobile devices, with fallback to direct WhatsApp URL (wa.me/?text=...) and a 1-tap "Copy Reference & Link" button with toast feedback | ✓        |
| Dedicated WhatsApp & SMS Buttons                 | Render separate green "Share via WhatsApp" and "Share via SMS" buttons alongside reference copy                                                                        |          |
| Simple Copy to Clipboard Only                    | Provide a copy button for the reference number with a template text popup                                                                                              |          |

**User's choice:** Web Share API + WhatsApp Deep-Link + Copy Button
**Notes:** Ensures mobile-first sharing parity across Android/iOS devices while supporting desktop browsers gracefully.

---

## Simulated Notification Feedback & Preview

| Option                                          | Description                                                                                                                                        | Selected |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| In-App Toasts + Expandable Message Preview Card | Trigger toasts for dispatched SMS/email and render a "Sent Notifications" preview card showing the simulated message templates directly on Stage 5 | ✓        |
| Toasts + Console Logging Only                   | Show brief toast alerts and log full notification payloads to browser console via INotificationService                                             |          |
| Pop-up Modal Notification Preview               | Display a modal dialog previewing the simulated SMS and Email immediately after submission                                                         |          |

**User's choice:** In-App Toasts + Expandable Message Preview Card
**Notes:** Makes the mock notifications visible and testable right on screen without digging into browser developer tools.

---

## Interview Prep Checklist Content Structure

| Option                           | Description                                                                                                                                                                                                              | Selected |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Visa-Specific Tailored Checklist | Dynamically customize checklist items based on applicant's destination and visa type (e.g., Student visas include university admission/funds, Business includes employer sponsorship, Tourist includes travel itinerary) | ✓        |
| Universal Embassy Checklist      | Standardized single checklist applicable to all visa applicants covering passport, appointment letters, biometrics, and fee receipts                                                                                     |          |
| Document Echo Checklist          | Simply re-list the specific documents uploaded during Stage 3 as the interview checklist                                                                                                                                 |          |

**User's choice:** Visa-Specific Tailored Checklist
**Notes:** Tailoring increases applicant confidence and eliminates irrelevant requirements.

---

## Checklist Export & Download Format

| Option                                          | Description                                                                                                                                      | Selected |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Plain Text Download (.txt) + Print-Ready Format | Provide a 1-tap ".txt" file download (consistent with Phase 3 document templates) plus a clean printable view (consistent with Phase 4 receipts) | ✓        |
| PDF Document Generator                          | Generate a downloadable client-side PDF file with embassy branding                                                                               |          |
| Plain Text (.txt) Download Only                 | Provide a simple text file download without print stylesheets                                                                                    |          |

**User's choice:** Plain Text Download (.txt) + Print-Ready Format
**Notes:** Avoids heavy client PDF rendering libraries while ensuring offline accessibility on budget mobile devices.

---

## On-Screen Checklist Completion Tracking

| Option                                      | Description                                                                                                                                                  | Selected |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Interactive Checkboxes + Completion Counter | Render an interactive checklist on Stage 5 where applicants can check off items as they prepare, showing "X of Y items ready" with immediate visual progress | ✓        |
| Static Read-Only Card                       | Display checklist items as structured read-only bullet points alongside the download action                                                                  |          |
| Modal Guide Sheet                           | Open the checklist inside an accessible Sheet component (similar to SampleGuidanceSheet) when clicked                                                        |          |

**User's choice:** Interactive Checkboxes + Completion Counter
**Notes:** Provides a satisfying, actionable packing checklist for interview preparation.

---

## Consulate Rules & Interview Day Tips

| Option                                        | Description                                                                                                                            | Selected |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Integrated "Interview Day Essentials" Section | Include key embassy dos & don'ts (arrival timing, original document rules, electronic device restrictions) alongside the document list | ✓        |
| Document Preparation Items Only               | Focus strictly on physical paperwork and certificate checklist without general consulate rules                                         |          |
| Collapsible Embassy FAQ                       | Put interview day tips in a collapsible FAQ disclosure at the bottom of the card                                                       |          |

**User's choice:** Integrated "Interview Day Essentials" Section
**Notes:** High practical value for first-time international travelers.

---

## Cross-Device Backup Code Format

| Option                                          | Description                                                                                                         | Selected |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| 8-Character Alphanumeric Code (e.g., VR-784291) | Human-readable short code saved in a mock cloud registry that restores draft state on any device with simple typing | ✓        |
| Direct Magic Link / QR Code                     | Generate a shareable URL containing the encoded draft parameters that opens and restores the draft automatically    |          |
| Base64 JSON Draft Token                         | Self-contained encrypted/encoded string containing full answers that can be exported and pasted anywhere            |          |

**User's choice:** 8-Character Alphanumeric Code (e.g., VR-784291)
**Notes:** Easy to write down, text, or read from email without long unwieldy URLs.

---

## Backup Code Generation Entry Point

| Option                                    | Description                                                                                                                                   | Selected |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Save Indicator + AppHeader / ResumeBanner | Make the "Saved" indicator and AppHeader clickable to open a "Backup Draft" modal to enter email, receive simulated code, and copy it anytime | ✓        |
| Floating "Save & Backup" Button           | Persistent floating action button on mobile bottom bar allowing instant code generation                                                       |          |
| Stage-Completion Prompts                  | Automatically prompt the user to generate an email backup code after completing each major stage                                              |          |

**User's choice:** Save Indicator + AppHeader / ResumeBanner
**Notes:** Seamlessly integrated into existing persistence affordances.

---

## Draft Restore Conflict Handling

| Option                                 | Description                                                                                                                                                                        | Selected |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Conflict Warning with Draft Comparison | If local draft data exists, show a modal comparing the current local draft vs the remote backup before overwriting, with clear "[Replace Local Draft]" or "[Keep Current]" buttons | ✓        |
| Silent Instant Overwrite + Undo Toast  | Overwrite immediately on valid code and show a toast with an "[Undo]" action                                                                                                       |          |
| Strict Block                           | Require the user to click "Start Over" first if an existing draft is detected before allowing a code to be entered                                                                 |          |

**User's choice:** Conflict Warning with Draft Comparison
**Notes:** Prevents accidental data loss when switching devices or resuming shared drafts.

---

## Document Attachments in Draft Backup/Restore

| Option                                           | Description                                                                                                                                          | Selected |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Full Mock Cloud Registry (Preserves Attachments) | Store the draft snapshot including mock document metadata and lightweight preview blobs in the mock registry so restore provides 100% complete state | ✓        |
| Metadata-Only Restore with Re-Attach Notice      | Restore answers and file names/sizes, but mark slots as needing re-verification on the new device                                                    |          |
| Answers Only                                     | Restore only form fields and clear document upload slots on device transfer                                                                          |          |

**User's choice:** Full Mock Cloud Registry (Preserves Attachments)
**Notes:** Delivers a seamless cross-device demo experience without forcing users to re-upload files.

---

## Duplicate Application Detection Timing

| Option                            | Description                                                                                                                                 | Selected |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| On Passport Field Blur in Stage 2 | Check for active duplicates immediately when an 8-character passport number is entered on the Identity step, showing an inline warning card | ✓        |
| At Stage 1 Destination Selection  | Prompt for passport number upfront on the landing page before starting the journey                                                          |          |
| At Stage 4 Submission Gate        | Validate duplicate applications only when user attempts final payment review                                                                |          |

**User's choice:** On Passport Field Blur in Stage 2
**Notes:** Natural placement when passport number is first collected.

---

## Duplicate Warning Card Presentation & Actions

| Option                                                                 | Description                                                                                                                                                       | Selected |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Informative Warning Card with "[Track Existing]" & "[Continue Anyway]" | Display an inline amber warning card with existing reference ID, date, and status, allowing 1-tap navigation to track it or an explicit option to continue anyway | ✓        |
| Hard Block Modal                                                       | Block form progression with a modal forcing the user to either open the existing application or explicitly cancel the prior one                                   |          |
| Toast Notification with Action Link                                    | Show an amber toast alert with a "Track Existing" button without inline card displacement                                                                         |          |

**User's choice:** Informative Warning Card with "[Track Existing]" & "[Continue Anyway]"
**Notes:** Clear warning matching the accessible `ExpiryWarningCard` pattern without stranding legitimate duplicate submissions.

---

## Duplicate Detection Mock Data Source

| Option                                                           | Description                                                                                                                                                       | Selected |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Hybrid Mock Registry (Local Submissions + Seeded Demo Passports) | Check both locally submitted applications AND pre-seeded mock passport records (e.g., demo passport Z1234567 has an active application) for deterministic testing | ✓        |
| Locally Submitted History Only                                   | Track submitted applications in browser storage and only warn if the same device submits with the same passport again                                             |          |
| Custom Test Toggle in Scenario Bar                               | Allow testers to manually force duplicate state on any passport via a mock scenario switcher                                                                      |          |

**User's choice:** Hybrid Mock Registry (Local Submissions + Seeded Demo Passports)
**Notes:** Enables reliable automated tests with seeded passports while also tracking organic in-browser submissions.

---

## Duplicate Navigation Behavior

| Option                            | Description                                                                                                                                | Selected |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Open Tracking Modal Pre-Filled    | Open the application tracking modal with the existing reference pre-filled and live timeline loaded, leaving the current form draft intact | ✓        |
| Switch Active Wizard Session      | Replace the current wizard state with the found submitted application and jump directly to Stage 5 Confirmation                            |          |
| Open Tracking in New Tab / Window | Launch tracking view with the reference ID in a new browser tab                                                                            |          |

**User's choice:** Open Tracking Modal Pre-Filled
**Notes:** Keeps active draft safe while letting applicant check the status of their earlier application.

---

## Agent's Discretion

- Visual styling of status timeline nodes, responsive spacing for 320px mobile viewports, `.txt` ASCII border styling, and toast alert animation timings.

## Deferred Ideas

None — discussion stayed strictly within the Phase 5 Confirmation, Tracking & Recovery domain.
