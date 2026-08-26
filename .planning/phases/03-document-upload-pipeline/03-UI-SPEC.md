---
phase: 3
slug: document-upload-pipeline
status: approved
shadcn_initialized: false
preset: none
created: 2026-08-26
reviewed_at: 2026-08-26
---

# Phase 3 — UI Design Contract: Document Upload Pipeline

> Visual and interaction contract for Stage 3: Document Upload Pipeline. Verified against design tokens, accessibility contracts, and upstream decisions.
>
> **Context:** All design decisions are locked per `03-CONTEXT.md` (D-01 to D-16), REQUIREMENTS.md (`DOCS-01` to `DOCS-05`, `STATE-03`), and Phase 1 design system tokens.

---

## Design System

| Property          | Value                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool              | none — custom component library in `src/components/ui/`                                                                                                          |
| Preset            | not applicable                                                                                                                                                   |
| Component library | Custom primitives: `Card`, `Button`, `Sheet`, `Field`, `Checkbox`, `ErrorSummary`, `ProgressStepper`, `Toast`, `SaveIndicator`                                   |
| Icon library      | `lucide-react` (24px grid, 2px stroke): `Camera`, `Upload`, `FileText`, `CheckCircle2`, `AlertTriangle`, `Eye`, `RefreshCw`, `Trash2`, `Download`, `ZoomIn`, `X` |
| Font              | Noto Sans via Fontsource (400 regular, 600 semibold)                                                                                                             |
| Styling engine    | Tailwind v4, CSS tokens in `src/styles/theme.css`                                                                                                                |

---

## Spacing Scale

| Token | Value | Usage                                                                     |
| ----- | ----- | ------------------------------------------------------------------------- |
| xs    | 4px   | Icon-to-label inline gaps, tight badge margins                            |
| sm    | 8px   | Gap between dual-action mobile buttons, action button spacing             |
| md    | 16px  | Internal slot padding, card element rhythm, field spacing                 |
| lg    | 24px  | DocumentSlotCard padding, section inner padding                           |
| xl    | 32px  | Separation between Mandatory and Optional sections                        |
| 2xl   | 48px  | **Minimum touch-target size** for all buttons, triggers, and icon buttons |
| 3xl   | 64px  | Page vertical rhythm, sticky stage progress header height                 |

Rules:

- Dual-action mobile buttons ("Take Photo" and "Upload File") render at full width or side-by-side with ≥48px touch height.
- Document slot cards have 24px inner padding (`p-6`) on mobile and desktop.
- Touch targets on thumbnail preview actions, "Replace", and "Remove" are at least 48×48px.

---

## Typography

| Role    | Size | Weight | Line Height | Usage                                                                                |
| ------- | ---- | ------ | ----------- | ------------------------------------------------------------------------------------ |
| Display | 28px | 600    | 1.2         | Screen title ("Upload Required Documents")                                           |
| Heading | 20px | 600    | 1.2         | Section titles ("Mandatory Documents", "Optional Supporting Documents"), Slot titles |
| Label   | 16px | 600    | 1.4         | Document slot names, button text, requirement check labels                           |
| Body    | 16px | 400    | 1.5         | Slot guidelines, upload instructions, warning descriptions                           |
| Meta    | 14px | 400    | 1.4         | File name, file size badges, upload timestamps, helper hints                         |

Rules:

- Sentence case everywhere. No ALL-CAPS text styling.
- All file sizes and compression metrics render at 14px/400 in meta color (`#4A5072`).
- Quality warning alerts and error descriptions render at 14px/600 or 16px/400.

---

## Color

| Role                | Value                      | Usage                                                                             |
| ------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| Dominant (60%)      | `#F7F7FA` (surface-bg)     | Screen background canvas                                                          |
| Secondary (30%)     | `#FFFFFF` (surface-card)   | Document slot cards, Sheet surfaces, preview overlays                             |
| Accent (10%)        | `#3730A3` (indigo-primary) | Primary "Continue" button, "Take Photo" button, active focus rings, sheet headers |
| Destructive         | `#B91C1C` (red-error)      | Invalid file format errors, "Remove file" action                                  |
| Warning / Attention | `#B45309` (saffron-deep)   | Quality check blur/low-res warning callouts (`#FFFBEB` background)                |
| Success             | `#166534` (green-success)  | "✓ Ready" badge, valid upload pills (`#F0FDF4` background)                        |

Contrast obligations:

- White text on `#3730A3` (indigo primary): 9.9:1 (WCAG AAA)
- `#166534` on `#F0FDF4` (success badge): 7.8:1 (WCAG AAA)
- `#B45309` on `#FFFBEB` (warning card): 6.2:1 (WCAG AA)
- `#B91C1C` on `#FEF2F2` (error banner): 6.5:1 (WCAG AA)

---

## Copywriting Contract

All strings localized via `src/i18n/locales/en/common.json`.

| Element                 | Copy                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Screen Title            | `Upload your documents`                                                                                            |
| Screen Subtitle         | `Attach clear photos or PDFs for your visa application. Everything is compressed and saved safely on your device.` |
| Progress Header         | `Documents: {{readyCount}} of {{totalRequired}} mandatory ready`                                                   |
| Mandatory Section Title | `Mandatory Documents`                                                                                              |
| Optional Section Title  | `Optional Supporting Documents`                                                                                    |
| Primary CTA             | `Continue to Review & Payment`                                                                                     |
| Camera Button           | `📷 Take Photo`                                                                                                    |
| File Upload Button      | `📁 Upload File / PDF`                                                                                             |
| Desktop Dropzone        | `Drag and drop files here, or tap to browse (PDF, JPG, PNG up to 10MB)`                                            |
| Status: Optimizing      | `Optimizing image…`                                                                                                |
| Status: Ready           | `✓ Ready • {{size}}`                                                                                               |
| Status: Replacing       | `Replace file`                                                                                                     |
| Status: Removing        | `Remove`                                                                                                           |
| View Sample Link        | `View sample & guidelines`                                                                                         |
| Download Template Link  | `Download template (PDF)`                                                                                          |
| Quality Warning Title   | `Image looks blurry or low-resolution`                                                                             |
| Quality Warning Body    | `All text and numbers must be clearly legible to avoid embassy rejection. Please check your photo.`                |
| Quality Warning Actions | `Retake Photo` (primary) · `✓ Use This Image Anyway` (secondary/outline)                                           |
| File Rejection Error    | `{{fileName}} is not supported. Please upload a PDF, JPG, or PNG under 10MB.`                                      |
| Missing Mandatory Error | `Please upload all mandatory documents before continuing.`                                                         |

---

## Registry Safety

| Registry               | Blocks Used                                      | Safety Gate    |
| ---------------------- | ------------------------------------------------ | -------------- |
| shadcn official        | none — custom primitives in `src/components/ui/` | not applicable |
| Third-party registries | none declared                                    | not applicable |

---

## Component Inventory & Interaction Contracts

| Component                                                                        | Contract                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DocumentsScreen** (`src/features/documents/DocumentsScreen.tsx`)               | Main Stage 3 container. Renders sticky top progress header, `ErrorSummary` on continue attempt with invalid slots, mandatory slot group, optional slot group, and navigation buttons.                                                         |
| **DocumentSlotCard** (`src/features/documents/DocumentSlotCard.tsx`)             | Card primitive wrapper for a single document slot (e.g. Passport, Photo, Address Proof). Renders slot title, mandatory badge, guideline hints, sample sheet trigger, dual camera/file inputs, desktop dropzone, and attached file status row. |
| **DocumentSubSlot** (`src/features/documents/DocumentSubSlot.tsx`)               | Sub-uploader for multi-part documents (e.g., Passport Bio Page 1-2 and Passport Address Page 35-36).                                                                                                                                          |
| **DocumentPreviewSheet** (`src/features/documents/DocumentPreviewSheet.tsx`)     | Accessible `Sheet` component displaying full-resolution image with zoom controls, pan/pinch support, and legibility checklist. Embedded PDF viewer for PDF files.                                                                             |
| **SampleGuidanceSheet** (`src/features/documents/SampleGuidanceSheet.tsx`)       | Accessible `Sheet` showing visual examples of acceptable vs unacceptable documents (e.g. valid passport MRZ crop, glare-free photo, 4-corner view).                                                                                           |
| **QualityWarningCard** (`src/features/documents/QualityWarningCard.tsx`)         | Contextual amber card appearing directly beneath blurry/low-res attachments with "Retake Photo" and "✓ Use anyway" confirmation buttons.                                                                                                      |
| **TemplateDownloadButton** (`src/features/documents/TemplateDownloadButton.tsx`) | 48px accessible button triggering client-side generated downloadable templates (Sponsorship Letter, Employer NOC, Financial Declaration).                                                                                                     |

---

## UI Considerations (State Coverage)

### 1. Document Slot States

- **Empty / Unattached:** Renders guideline text, sample trigger, and dual "📷 Take Photo" + "📁 Upload File" buttons. Drag-and-drop active state highlights card with 2px indigo border and `#EEF0FB` background.
- **Optimizing / Compressing:** Renders animated spinner with `aria-busy="true"` and "Optimizing image…". Buttons disabled during compression.
- **Ready / Valid:** Renders green "✓ Ready" badge, original filename, formatted size (e.g., "1.2 MB"), thumbnail preview, and "Replace" / "Remove" actions.
- **Quality Warning:** Renders attached thumbnail accompanied by amber warning card with "Retake" and "Use anyway" actions.
- **Invalid / Error:** Renders red inline banner with specific failure explanation linked to top `ErrorSummary`.

### 2. Mobile vs Desktop Responsiveness

- **Mobile (<640px):** Single-column layout. Dual buttons stack or align side-by-side with 48px minimum height. Camera button opens native camera (`capture="environment"`). Click on thumbnail opens full-screen bottom `Sheet`.
- **Desktop (≥640px):** Max-width 640px centered column. Slot cards include dropzone area. "Take Photo" button hidden if device has no rear camera or renders standard file chooser.

### 3. Accessibility & Keyboard Navigation

- Full keyboard operability: Tab navigation reaches camera trigger, file picker, sample sheet trigger, replace/remove buttons, and warning actions in logical DOM order.
- Sheets (`DocumentPreviewSheet`, `SampleGuidanceSheet`) trap focus, announce title via `aria-labelledby`, and restore focus to triggering button on dismissal.
- Live region announcements for upload completion ("Passport bio page uploaded and ready") and compression errors.

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved
