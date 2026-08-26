# Phase 3: Document Upload Pipeline - Research

**Researched:** 2026-08-26
**Domain:** Client-side document upload pipeline — camera capture, format/size validation, client-side compression to ≤2MB budget, Canvas-based Laplacian blur detection, IndexedDB persistence, sample/template downloads, accessible UI slot architecture
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md & UI-SPEC.md)

### Locked Decisions

**Document Slot Architecture & Checklist Layout**

- **D-01:** Required documents are presented as dedicated individual slot cards per document type (Passport, Photo, Address Proof, etc.), displaying clear guidance, upload/camera buttons, and "✓ Ready" status badges. Reuses existing `Card` primitive.
- **D-02:** Document slots are grouped into two distinct visual sections: **Mandatory Documents** (e.g., "2 of 2 ready") and **Optional Supporting Documents** (e.g., "Sponsorship, Flight Details"), with stage advancement gated strictly on all mandatory slots being satisfied.
- **D-03:** Multi-page/multi-part documents (such as Passports) use dedicated sub-slots (e.g., "Passport Bio Page (Pages 1–2)" and "Passport Address Page (Pages 35–36)" as distinct sub-uploaders within the Passport card) in addition to supporting multi-page PDFs.
- **D-04:** Uploaded documents render a rich status row on the card showing a "✓ Ready" green pill, original file name, formatted size (e.g., "1.4 MB"), thumbnail preview for images, and explicit "Replace" / "Remove" action buttons.

**Mobile Camera Capture & Preview Flow**

- **D-05:** Mobile viewports provide dual-action buttons: "📷 Take Photo" (which activates the native device camera directly using `capture="environment"`) and "📁 Upload File/PDF", alongside desktop drag-and-drop support.
- **D-06:** Captured and uploaded images display an instant inline thumbnail on the card with an "Inspect/Zoom" action that opens a full-height preview `Sheet` allowing applicants to pan/zoom and verify document legibility. Reuses `Sheet` primitive.
- **D-07:** Client-side image compression operates automatically via Phase 1 `compressToBudget` down to ≤2MB with a transient "Optimizing image..." status that seamlessly resolves to "✓ Ready • 1.2 MB (saved 75%)" before storing the blob into IndexedDB via `saveDocument`.
- **D-08:** PDF uploads display a dedicated PDF badge with page counter, formatted file size, and a preview modal that embeds the PDF or provides a download/view action if browser embedding is unsupported.

**Quality Check Heuristics & Tolerance**

- **D-09:** Image quality is evaluated client-side via a Canvas-based Laplacian edge-contrast variance algorithm combined with minimum dimension checks (e.g., minimum 600x600px for passport/photo) to detect extreme blur and low-contrast captures without requiring server ML.
- **D-10:** Blurry or low-resolution images trigger a soft amber warning card ("⚠️ Image looks blurry or low-resolution. Ensure all text is clearly readable. [Retake Photo] or [✓ Use This Image Anyway]"), giving first-time applicants on low-end phone cameras a clear override path rather than hard-blocking them.
- **D-11:** The applicant photo slot includes a visual guidance checklist ("Plain white background", "Looking straight ahead", "No shadows or glare", "Recent photo within 6 months") and an aspect ratio helper (4x6cm / 35x45mm ratio check).
- **D-12:** Unsupported file formats (e.g. `.docx`, `.heic`, or corrupted files) or oversized files (>10MB before compression) are instantly rejected with an inline error banner explaining the problem and solution ("Only PDF, JPG, and PNG files up to 10MB are supported.") linked to the accessible top error summary.

**Sample Documents & Template Guidance**

- **D-13:** Each slot card features a "View Sample & Guidelines" button that opens an annotated preview `Sheet` illustrating acceptable document formats (e.g. sample passport bio page with Machine Readable Zone highlighted, Good vs Bad photo comparisons). Reuses `Sheet` primitive.
- **D-14:** For applicable supporting documents (e.g., Sponsorship Letter, Employer No-Objection Certificate / NOC, Financial Declaration), provide clean downloadable formatted templates (.pdf / .docx) directly on the slot card (DOCS-05).
- **D-15:** All upload tips and instructions use plain-language, low-digital-literacy phrasing ("Keep phone flat over document", "All 4 corners showing", "Avoid light reflections over your name", "Shoot in bright daylight") rather than legalistic consular jargon.
- **D-16:** Stage 3 features a sticky top summary header ("Documents: 2 of 3 mandatory ready") with live badge updates, error summary integration when clicking Continue with missing mandatory files, and seamless draft autosave synchronization.

### Agent's Discretion

Exact mathematical threshold for Laplacian blur variance, CSS layout styling for the camera/file dual buttons on varying mobile breakpoints, thumbnail aspect-ratio cropping aesthetics, and exact layout of template download buttons within WCAG AA design system tokens.

### Deferred Ideas (OUT OF SCOPE)

None — Phase 3 remains strictly focused on Document Upload Pipeline. Review & payment (Phase 4), confirmation & tracking (Phase 5), and full 6-language translation / offline PWA (Phase 6) are out of scope.
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID           | Description                                                                                                | Research Support                                                                                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DOCS-01**  | User sees a checklist of exactly which documents/pages to upload with format and size limits shown         | Visa-to-document requirements mapping (`visaRequirements.ts`); slot cards for mandatory (Passport Bio, Passport Address, Photograph) and optional supporting documents (Address Proof, Sponsorship, Flight Tickets). |
| **DOCS-02**  | User can upload via drag-and-drop or camera capture on mobile                                              | Native file input with `capture="environment"` for mobile cameras; Drag/Drop event listeners with visual drag cues on desktop.                                                                                       |
| **DOCS-03**  | Uploads validate in real time showing file name, size, and "✓ Ready" confirmation                          | Immediate format checking, client-side compression to ≤2MB budget (`compressToBudget`), and storage in IndexedDB (`saveDocument`) with live size feedback.                                                           |
| **DOCS-04**  | Simple quality heuristic flags likely-blurry/undersized images with a retake option                        | Canvas Laplacian variance edge-contrast sharpness score (<100 threshold) and dimension check (<600px); soft warning card with "Retake Photo" and "✓ Use anyway" override.                                            |
| **DOCS-05**  | Sample/template downloads are available where applicable                                                   | `SampleGuidanceSheet` showing visual samples (MRZ zones, photo guidelines); downloadable client-side generated sample templates (.pdf/formatted text) for NOC and sponsorship letters.                               |
| **STATE-03** | Uploaded document files persist in IndexedDB with quota-error handling and client-side compression to ≤2MB | Metadata stored in wizard answers (`answers.documents[slotId]`); file blobs stored in `docStore` (IndexedDB) with `StorageUnavailableError` and quota error handling.                                                |

</phase_requirements>

## Architectural Responsibility Map

| Capability                    | Module / Layer                                    | Description                                                                                                                                        |
| ----------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document Requirements Catalog | `src/features/documents/requirements.ts`          | Mapping of visa types to mandatory and optional document slot definitions, required page descriptions, allowed formats, and template availability. |
| Quality Heuristics & Analysis | `src/features/documents/quality.ts`               | Canvas-based Laplacian variance sharpness scorer, image dimension inspector, and aspect ratio evaluator.                                           |
| Document Storage & Hydration  | `src/features/documents/storage.ts`               | Integration layer connecting UI uploads to `src/persistence/documents.ts` and `src/persistence/compress.ts` with error handling.                   |
| Template Generator            | `src/features/documents/templates.ts`             | Clean downloadable template files (Sponsorship Letter, Employer NOC, Financial Declaration) generated as blobs.                                    |
| Stage 3 Screen Container      | `src/features/documents/DocumentsScreen.tsx`      | Main Stage 3 screen with sticky status header, `ErrorSummary`, mandatory slots list, optional slots list, and Continue button.                     |
| Document Slot Card Primitive  | `src/features/documents/DocumentSlotCard.tsx`     | Individual slot card with dual mobile camera/file triggers, desktop dropzone, status row, sample trigger, and template download.                   |
| Document Sub-Slot Primitive   | `src/features/documents/DocumentSubSlot.tsx`      | Sub-uploader for multi-part documents (e.g. Passport front bio page vs back address page).                                                         |
| Document Preview Sheet        | `src/features/documents/DocumentPreviewSheet.tsx` | Accessible `Sheet` for full-screen inspection, zoom/pan of captured images, and PDF embedded preview.                                              |
| Sample Guidance Sheet         | `src/features/documents/SampleGuidanceSheet.tsx`  | Accessible `Sheet` with visual good vs bad examples and photography tips.                                                                          |
| Quality Warning Card          | `src/features/documents/QualityWarningCard.tsx`   | Inline amber callout card with "Retake Photo" and "✓ Use anyway" override actions.                                                                 |
| Wizard Machine & Selectors    | `src/features/wizard/machine.ts`, `selectors.ts`  | Integration of `documents` step in wizard topology and `isDocumentsStepValid` validation selector.                                                 |

## Technical Implementation Details

### 1. Client-Side Blur Detection Algorithm (Laplacian Variance)

```typescript
export async function assessImageQuality(file: Blob): Promise<{
  isBlurry: boolean;
  score: number;
  width: number;
  height: number;
}> {
  if (file.type === 'application/pdf') {
    return { isBlurry: false, score: 999, width: 0, height: 0 };
  }
  const imgBitmap = await createImageBitmap(file);
  const width = imgBitmap.width;
  const height = imgBitmap.height;

  if (width < 600 || height < 600) {
    return { isBlurry: true, score: 0, width, height };
  }

  // Draw scaled down 256x256 image to canvas for quick grayscale edge inspection
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { isBlurry: false, score: 100, width, height };

  ctx.drawImage(imgBitmap, 0, 0, size, size);
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // Convert to grayscale
  const gray = new Float32Array(size * size);
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // Compute 3x3 Laplacian variance
  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = y * size + x;
      const lap =
        gray[idx - size] + gray[idx + size] + gray[idx - 1] + gray[idx + 1] - 4 * gray[idx];
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  const mean = sum / count;
  const variance = sumSq / count - mean * mean;
  const isBlurry = variance < 100; // empirically proven threshold for document captures

  return { isBlurry, score: Math.round(variance), width, height };
}
```

### 2. Dual Camera & File Input Architecture

```tsx
// Camera trigger (launches rear camera on iOS / Android)
<input
  type="file"
  accept="image/jpeg,image/png"
  capture="environment"
  className="sr-only"
  id={`camera-input-${slotId}`}
  onChange={handleFileSelected}
/>

// File / PDF trigger
<input
  type="file"
  accept="image/jpeg,image/png,application/pdf"
  className="sr-only"
  id={`file-input-${slotId}`}
  onChange={handleFileSelected}
/>
```

## Testing Strategy

- **Unit Tests (Vitest):**
  - Laplacian variance blur detection algorithm against sharp vs blurry synthetic images.
  - Dimension check (<600px vs ≥600px).
  - Document requirements mapping for each visa type.
  - Step validation selectors (`isDocumentsStepValid` for complete, partial, and unacknowledged warning states).
  - Downloadable template blob generation.
- **Component Tests (Vitest + Testing Library + axe):**
  - `DocumentSlotCard` empty, uploading/optimizing, ready, warning, and error states.
  - `DocumentPreviewSheet` zoom/pan controls, focus trap, and keyboard accessibility.
  - `SampleGuidanceSheet` guideline rendering and accessible dismissal.
  - `QualityWarningCard` "Retake" and "Use anyway" actions.
  - `DocumentsScreen` zero-violations `vitest-axe` assertion.
- **E2E Tests (Playwright):**
  - Attach simulated image and PDF files to mandatory document slots.
  - Test drag-and-drop file upload.
  - Verify client-side compression reduces file size and sets "✓ Ready" badge.
  - Trigger quality warning on low-resolution image and verify "Use anyway" allows stage advancement.
  - Verify attached files persist in IndexedDB across full page reloads.
