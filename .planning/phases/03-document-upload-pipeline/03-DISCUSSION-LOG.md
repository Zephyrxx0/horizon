# Phase 3: Document Upload Pipeline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-26
**Phase:** 03-Document Upload Pipeline
**Areas discussed:** Document Slot Architecture & Checklist Layout, Mobile Camera Capture & Preview Flow, Quality Check Heuristics & Tolerance, Sample Documents & Template Guidance

---

## Document Slot Architecture & Checklist Layout

### Question 1: Document Slot Structure

| Option                                       | Description                                                                                                                                                             | Selected |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Dedicated slot card per document type        | Each required document (Passport, Photo, Address Proof, etc.) has its own card with explicit requirements, upload trigger, and "✓ Ready" status. Reuses Card component. | ✓        |
| Two-step Accordion layout                    | Documents are grouped in collapsible cards so only one document slot expands at a time, minimizing mobile vertical scroll.                                              |          |
| Single unified dropzone with category tagger | User uploads any file and selects which document type it corresponds to from a dropdown.                                                                                |          |
| You decide                                   | Agent discretion.                                                                                                                                                       |          |

**User's choice:** Dedicated slot card per document type
**Notes:** Reuses existing design system `Card` primitive; provides direct clarity on mobile screens.

### Question 2: Mandatory vs Optional Grouping

| Option                            | Description                                                                                                                                                                 | Selected |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Two distinct visual sections      | "Mandatory Documents (e.g. 2 of 2 ready)" and "Optional Supporting Documents (e.g. Sponsorship, Flight Details)", with stage progression gated strictly on mandatory slots. | ✓        |
| Single list with prominent badges | All documents in one list with bold "Required" / "Optional" badges; continue button disabled or triggers error summary if any required is missing.                          |          |
| Strict progressive unlock         | User must upload document 1 before document 2's slot activates.                                                                                                             |          |
| You decide                        | Agent discretion.                                                                                                                                                           |          |

**User's choice:** Two distinct visual sections
**Notes:** Clean visual partitioning ensures applicants know what is required to advance.

### Question 3: Multi-page / Front-and-back Handling

| Option                             | Description                                                                                                                                                                                  | Selected |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Dedicated sub-slots for front/back | Dedicated sub-slots for front/back (e.g. "Passport Bio Page (Page 1-2)" + "Passport Address Page (Page 35-36)" as distinct sub-uploaders within the Passport card) + multi-page PDF support. | ✓        |
| Multi-file append in a single slot | One "Passport" card that allows attaching multiple images/PDFs with mini-thumbnails and delete buttons.                                                                                      |          |
| Strict single-file requirement     | Slot only accepts 1 file (if multiple pages, applicant must upload a multi-page PDF).                                                                                                        |          |
| You decide                         | Agent discretion.                                                                                                                                                                            |          |

**User's choice:** Dedicated sub-slots for front/back
**Notes:** Eliminates user ambiguity about whether to upload front or back page by providing explicit sub-slots.

### Question 4: Uploaded Document Status UI

| Option             | Description                                                                                                                               | Selected |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Rich status row    | "✓ Ready" green pill, original file name, size (e.g. "1.4 MB"), thumbnail preview for images, plus "Replace" and "Remove" action buttons. | ✓        |
| Minimal badge      | Small checkmark with file name and a trash icon, keeping the card as compact as possible.                                                 |          |
| Expandable details | Compact row by default that expands to show storage format, compression metrics, and file details.                                        |          |
| You decide         | Agent discretion.                                                                                                                         |          |

**User's choice:** Rich status row
**Notes:** Provides immediate feedback and confidence to the applicant.

---

## Mobile Camera Capture & Preview Flow

### Question 1: Camera vs File Trigger UI

| Option                                    | Description                                                                                        | Selected |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- | -------- |
| Dual-action buttons on mobile             | "📷 Take Photo" with direct camera launch + "📁 Upload File/PDF" + desktop drag-and-drop dropzone. | ✓        |
| Single native file trigger                | Single "Select or Capture File" button using OS file picker.                                       |          |
| Camera-only for photo, file-only for docs | Restrict trigger by slot type.                                                                     |          |
| You decide                                | Agent discretion.                                                                                  |          |

**User's choice:** Dual-action buttons on mobile
**Notes:** `capture="environment"` attribute launches device camera directly on mobile for effortless photo taking.

### Question 2: Document Preview Flow

| Option                                    | Description                                                                                                                    | Selected |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Inline thumbnail + click-to-preview Sheet | Card shows a crisp thumbnail with "Inspect/Zoom" action opening a preview Sheet to verify legibility. (Reuses Sheet primitive) | ✓        |
| Large inline preview directly on card     | Full-width preview embedded inside the slot card without needing a modal.                                                      |          |
| Compact metadata row                      | File icon and name only, with preview icon button opening a popover.                                                           |          |
| You decide                                | Agent discretion.                                                                                                              |          |

**User's choice:** Inline thumbnail + click-to-preview Sheet
**Notes:** Reuses accessible `Sheet` primitive, allowing zoom and inspection without cluttering the main page layout.

### Question 3: Compression Feedback UX

| Option                                | Description                                                                                                                   | Selected |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------- |
| Automatic seamless optimization       | Transient "Optimizing image..." status, resolving to "✓ Ready • 1.2 MB (saved 75%)" feedback. (Uses Phase 1 compressToBudget) | ✓        |
| Silent instant background compression | Directly show final compressed size without mentioning optimization.                                                          |          |
| Pre-compression prompt modal          | Show original size and ask user to confirm compression quality level.                                                         |          |
| You decide                            | Agent discretion.                                                                                                             |          |

**User's choice:** Automatic seamless optimization
**Notes:** Seamless client-side compression reduces bandwidth and IndexedDB footprint transparently.

### Question 4: PDF Preview Handling

| Option                                      | Description                                                                                                                            | Selected |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| PDF badge with page counter & preview modal | PDF badge with page counter, formatted file size, and preview link/modal that opens PDF preview or downloads if browser doesn't embed. | ✓        |
| Simple generic PDF icon                     | Generic icon with file name and size, clicking replaces or downloads the file.                                                         |          |
| Client-side PDF first-page renderer         | Canvas renders first PDF page as image thumbnail.                                                                                      |          |
| You decide                                  | Agent discretion.                                                                                                                      |          |

**User's choice:** PDF badge with page counter & preview modal
**Notes:** Clean fallback handling for non-image documents.

---

## Quality Check Heuristics & Tolerance

### Question 1: Blur/Sharpness Detection Algorithm

| Option                                    | Description                                                                                    | Selected |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------- | -------- |
| Canvas edge-contrast / Laplacian variance | Canvas edge-contrast / Laplacian variance heuristic + minimum dimension check (min 600x600px). | ✓        |
| Dimension and size threshold only         | Flag if image is smaller than 500px or suspiciously small (<50KB for photo).                   |          |
| Simulated mock check                      | Deterministic test hooks only.                                                                 |          |
| You decide                                | Agent discretion.                                                                              |          |

**User's choice:** Canvas edge-contrast / Laplacian variance + dimension check
**Notes:** Fast client-side check on canvas without external server dependencies.

### Question 2: Quality Warning Enforcement

| Option                                 | Description                                                                                                                                            | Selected |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Soft warning with explicit override    | Amber warning card ("⚠️ Image looks blurry or low-res. Ensure text is clear. [Retake] or [✓ Use anyway]") to prevent blocking users on budget cameras. | ✓        |
| Strict hard block                      | User must retake photo until sharpness score passes minimum threshold.                                                                                 |          |
| Non-blocking subtle toast notification | Toast only.                                                                                                                                            |          |
| You decide                             | Agent discretion.                                                                                                                                      |          |

**User's choice:** Soft warning with explicit override
**Notes:** Follows Phase 2 expiry warning UX pattern to avoid trapping users on budget phone cameras.

### Question 3: Photo Specification Guidance

| Option                            | Description                                                                                                                                         | Selected |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Visual checklist on photo slot    | Visual checklist ("Plain white background", "Looking straight ahead", "No shadows or glare", "Recent photo within 6 months") + aspect ratio helper. | ✓        |
| Interactive client-side crop tool | Client-side crop with oval face guide before saving.                                                                                                |          |
| Simple text hint                  | Plain text hint under upload button.                                                                                                                |          |
| You decide                        | Agent discretion.                                                                                                                                   |          |

**User's choice:** Visual checklist on photo slot + aspect ratio helper
**Notes:** High accessibility and clear visual cues for first-time applicants.

### Question 4: Invalid File Rejection & Error UX

| Option                          | Description                                                                                                                                         | Selected |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Instant inline rejection banner | Instant inline rejection banner on slot card with clear reason & solution ("HEIC/Word files are not supported...") + accessible error summary link. | ✓        |
| Global toast notification       | Global toast notification on invalid drop/selection.                                                                                                |          |
| Silent drop                     | Ignore unsupported files.                                                                                                                           |          |
| You decide                      | Agent discretion.                                                                                                                                   |          |

**User's choice:** Instant inline rejection banner
**Notes:** Actionable error copy aligned with ERR-01 and ERR-02.

---

## Sample Documents & Template Guidance

### Question 1: Sample Document Previews

| Option                           | Description                                                                                                              | Selected |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| "View Sample & Guidelines" Sheet | Button opening a Sheet with annotated visual examples (e.g. passport bio page with MRZ highlighted, Good vs Bad photos). | ✓        |
| Inline expandable accordion      | Accordion on each slot showing guidelines.                                                                               |          |
| External guide link              | Opens in new browser tab.                                                                                                |          |
| You decide                       | Agent discretion.                                                                                                        |          |

**User's choice:** "View Sample & Guidelines" Sheet
**Notes:** Accessible overlay keeping user in context without losing wizard state.

### Question 2: Downloadable Templates Delivery

| Option                                  | Description                                                                                                                                                                  | Selected |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Direct downloadable formatted templates | Direct downloadable formatted templates (e.g. Sponsorship Letter, Employer NOC, Financial Declaration) generated as clean downloadable PDF/text templates on relevant slots. | ✓        |
| Copyable sample text drawer             | Drawer with "Copy to clipboard" action for letters.                                                                                                                          |          |
| Single bundled download package link    | Bundled ZIP download at top of stage.                                                                                                                                        |          |
| You decide                              | Agent discretion.                                                                                                                                                            |          |

**User's choice:** Direct downloadable formatted templates
**Notes:** Directly fulfills DOCS-05.

### Question 3: Upload Tips Tone & Phrasing

| Option                    | Description                                                                                                                                                              | Selected |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Plain-language tips       | Plain-language tips ("Keep phone flat", "All 4 corners showing", "No flash glare over your name", "Clear daylight") tailored for first-time applicants on phone cameras. | ✓        |
| Official consular wording | Formal wording.                                                                                                                                                          |          |
| Minimal 1-line label      | Concise label without photography tips.                                                                                                                                  |          |
| You decide                | Agent discretion.                                                                                                                                                        |          |

**User's choice:** Plain-language tips
**Notes:** Specifically designed for low digital literacy applicants.

### Question 4: Stage Readiness & Checklist Progress Header

| Option                        | Description                                                                                                                                                       | Selected |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Sticky top status header      | Sticky top status header ("Documents: 2 of 3 mandatory ready") with live badge updates, error summary integration on continue attempt, and auto-save persistence. | ✓        |
| Bottom checklist summary card | Summary card right above Continue button.                                                                                                                         |          |
| Standard progress bar only    | Progress bar without checklist counter.                                                                                                                           |          |
| You decide                    | Agent discretion.                                                                                                                                                 |          |

**User's choice:** Sticky top status header
**Notes:** Real-time visibility into overall document upload progress.

---

## Agent's Discretion

- Exact mathematical threshold for Laplacian blur variance calculation.
- CSS layout styling for dual camera/file buttons across mobile breakpoints.
- Thumbnail cropping and aspect ratio layout aesthetics within WCAG AA design system tokens.

## Deferred Ideas

None — discussion stayed strictly within Stage 3 Document Upload Pipeline.
