# Phase 3: Document Upload Pipeline - Context

**Gathered:** 2026-08-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 delivers the complete Stage 3 citizen journey: Document Upload Pipeline (DOCS-01 to DOCS-05):

1. **Document Checklist & Slot Architecture** — Checklist of required documents tailored to the chosen visa type (e.g., Passport Bio/Address pages, recent 4x6cm photo, proof of address, sponsorship letter) with explicit page requirements, format/size constraints, and slot cards. (DOCS-01)
2. **Mobile & Desktop Upload Capture** — Dual-action triggers on mobile ("📷 Take Photo" with direct camera launch via `capture="environment"` + "📁 Upload File/PDF") and desktop drag-and-drop dropzone. (DOCS-02)
3. **Real-time Validation & Compression** — Instant validation displaying file name, formatted size, compression status ("Optimizing..."), and "✓ Ready" confirmation badge backed by client-side compression (≤2MB budget) and IndexedDB persistence. (DOCS-03, STATE-03)
4. **Quality Check Heuristics & Tolerance** — Canvas-based Laplacian edge-contrast sharpness heuristic and dimension checks flagging blurry/undersized images with soft amber warning and "✓ Use anyway" override. (DOCS-04)
5. **Sample & Template Downloads** — Contextual "View Sample & Guidelines" Sheet with visual examples (e.g. passport MRZ highlight, photo guidelines) plus downloadable clean templates for sponsorship/NOC letters. (DOCS-05)

Review & mock payment (Phase 4), confirmation & tracking (Phase 5), and full multi-language translations / offline PWA (Phase 6) are out of scope for this phase.
</domain>

<decisions>
## Implementation Decisions

### Document Slot Architecture & Checklist Layout

- **D-01:** Required documents are presented as dedicated individual slot cards per document type (Passport, Photo, Address Proof, etc.), displaying clear guidance, upload/camera buttons, and "✓ Ready" status badges. Reuses existing `Card` primitive. — **Reversibility:** costly — defines document slot model, state shape, and per-document validation interfaces.
- **D-02:** Document slots are grouped into two distinct visual sections: **Mandatory Documents** (e.g., "2 of 2 ready") and **Optional Supporting Documents** (e.g., "Sponsorship, Flight Details"), with stage advancement gated strictly on all mandatory slots being satisfied. — **Reversibility:** costly — affects wizard completion selector, step validator, and UI grouping.
- **D-03:** Multi-page/multi-part documents (such as Passports) use dedicated sub-slots (e.g., "Passport Bio Page (Pages 1–2)" and "Passport Address Page (Pages 35–36)" as distinct sub-uploaders within the Passport card) in addition to supporting multi-page PDFs. — **Reversibility:** costly — defines document sub-asset storage keys and IndexedDB record schema.
- **D-04:** Uploaded documents render a rich status row on the card showing a "✓ Ready" green pill, original file name, formatted size (e.g., "1.4 MB"), thumbnail preview for images, and explicit "Replace" / "Remove" action buttons. — **Reversibility:** reversible — component-level rendering.

### Mobile Camera Capture & Preview Flow

- **D-05:** Mobile viewports provide dual-action buttons: "📷 Take Photo" (which activates the native device camera directly using `capture="environment"`) and "📁 Upload File/PDF", alongside desktop drag-and-drop support. — **Reversibility:** reversible — input trigger markup and event handling.
- **D-06:** Captured and uploaded images display an instant inline thumbnail on the card with an "Inspect/Zoom" action that opens a full-height preview `Sheet` allowing applicants to pan/zoom and verify document legibility. Reuses `Sheet` primitive. — **Reversibility:** reversible — UI sheet presentation.
- **D-07:** Client-side image compression operates automatically via Phase 1 `compressToBudget` down to ≤2MB with a transient "Optimizing image..." status that seamlessly resolves to "✓ Ready • 1.2 MB (saved 75%)" before storing the blob into IndexedDB via `saveDocument`. — **Reversibility:** costly — client-side compression pipeline and feedback state machine.
- **D-08:** PDF uploads display a dedicated PDF badge with page counter, formatted file size, and a preview modal that embeds the PDF or provides a download/view action if browser embedding is unsupported. — **Reversibility:** reversible — PDF rendering fallback.

### Quality Check Heuristics & Tolerance

- **D-09:** Image quality is evaluated client-side via a Canvas-based Laplacian edge-contrast variance algorithm combined with minimum dimension checks (e.g., minimum 600x600px for passport/photo) to detect extreme blur and low-contrast captures without requiring server ML. — **Reversibility:** costly — image analysis algorithm and validation pipeline.
- **D-10:** Blurry or low-resolution images trigger a soft amber warning card ("⚠️ Image looks blurry or low-resolution. Ensure all text is clearly readable. [Retake Photo] or [✓ Use This Image Anyway]"), giving first-time applicants on low-end phone cameras a clear override path rather than hard-blocking them. — **Reversibility:** costly — validation gate logic in wizard state machine.
- **D-11:** The applicant photo slot includes a visual guidance checklist ("Plain white background", "Looking straight ahead", "No shadows or glare", "Recent photo within 6 months") and an aspect ratio helper (4x6cm / 35x45mm ratio check). — **Reversibility:** reversible — slot helper guidelines.
- **D-12:** Unsupported file formats (e.g. `.docx`, `.heic`, or corrupted files) or oversized files (>10MB before compression) are instantly rejected with an inline error banner explaining the problem and solution ("Only PDF, JPG, and PNG files up to 10MB are supported.") linked to the accessible top error summary. — **Reversibility:** reversible — error display and field linking.

### Sample Documents & Template Guidance

- **D-13:** Each slot card features a "View Sample & Guidelines" button that opens an annotated preview `Sheet` illustrating acceptable document formats (e.g. sample passport bio page with Machine Readable Zone highlighted, Good vs Bad photo comparisons). Reuses `Sheet` primitive. — **Reversibility:** reversible — guideline modal content.
- **D-14:** For applicable supporting documents (e.g., Sponsorship Letter, Employer No-Objection Certificate / NOC, Financial Declaration), provide clean downloadable formatted templates (.pdf / .docx) directly on the slot card. (DOCS-05) — **Reversibility:** costly — template asset generation and download utilities.
- **D-15:** All upload tips and instructions use plain-language, low-digital-literacy phrasing ("Keep phone flat over document", "All 4 corners showing", "Avoid light reflections over your name", "Shoot in bright daylight") rather than legalistic consular jargon. — **Reversibility:** reversible — copy and helper hints.
- **D-16:** Stage 3 features a sticky top summary header ("Documents: 2 of 3 mandatory ready") with live badge updates, error summary integration when clicking Continue with missing mandatory files, and seamless draft autosave synchronization. — **Reversibility:** costly — connects document stage header to wizard progress engine.

### Agent's Discretion

- Exact mathematical threshold for Laplacian blur variance, CSS layout styling for the camera/file dual buttons on varying mobile breakpoints, thumbnail aspect-ratio cropping aesthetics, and exact layout of template download buttons within WCAG AA design system tokens.
</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product & Requirements References

- `visarethink/indian_visa_prd.md` §2, §4, §5 (Stage 3 Document Upload) — document checklist specifications, size/format requirements, camera capture, real-time validation, quality warnings, mock OCR notes.
- `visarethink/visa_prototype.jsx` (lines 135–155, 730–800) — reference document upload handlers, state structure (`documents: []`), file size limits, and typical document list.
- `.planning/REQUIREMENTS.md` — DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05, STATE-03 definitions.
- `.planning/ROADMAP.md` — Phase 3 goals and success criteria.

### Architecture & Foundation References

- `.planning/phases/01-foundation-design-system-persistence-engine/01-CONTEXT.md` — Phase 1 established decisions (IndexedDB document persistence, `compressToBudget`, XState wizard machine).
- `.planning/phases/02-guided-journey-visa-selection-personal-details/02-CONTEXT.md` — Phase 2 established decisions (step topology, Stage 1 visa document list, Stage 2 error summary, expiry warning pattern).
- `src/persistence/documents.ts` — IndexedDB storage adapter (`docStore`, `saveDocument`, `getDocument`, `deleteDocument`, `hasDocument`, `getStorageEstimate`).
- `src/persistence/compress.ts` — Client-side canvas image compression utility (`compressToBudget` to ≤2MB).
- `src/components/ui/` — Design system primitives (`Card`, `Button`, `Sheet`, `Field`, `ErrorSummary`, `Toast`, `ProgressStepper`, `focus.ts`).
- `src/features/wizard/machine.ts` — Wizard machine step topology.
- `src/features/wizard/selectors.ts` — Step validation and progress selector derivation.
  </canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/persistence/documents.ts`: `saveDocument`, `getDocument`, `deleteDocument`, `hasDocument` for IndexedDB document storage.
- `src/persistence/compress.ts`: `compressToBudget(blob, maxBytes)` for browser-side image resizing and JPEG quality optimization down to ≤2MB.
- `src/components/ui/Sheet.tsx`: Accessible sliding sheet / modal for "Inspect/Zoom Preview" and "View Sample & Guidelines".
- `src/components/ui/Card.tsx`: Accessible container card for document slots.
- `src/components/ui/Button.tsx`: 48px touch-target action buttons for "Take Photo", "Upload File", "Replace", "Remove".
- `src/components/ui/ErrorSummary.tsx`: Accessible error summary banner linking directly to missing/invalid document slots.
- `src/components/ui/Field.tsx`: Form field wrapper with labels, hints, and error announcements.

### Established Patterns

- Wizard answers store metadata (`{ docId, name, size, type, isBlurWarningAcknowledged, ... }`) in autosaved state while the binary blobs are stored by `docId` in IndexedDB (`docStore`).
- Soft warning pattern: inline amber callout with clear warning copy and explicit confirmation checkbox/action before stage progression.
- On-blur and real-time status indication: green checkmarks and "✓ Ready" pills indicating valid fields/slots.
- Pure derived progress: wizard selectors compute whether Stage 3 is valid based on whether all mandatory document slots have valid attachments.

### Integration Points

- `src/features/wizard/machine.ts`: Integrate Stage 3 (`documents`) step into the machine step flow after Stage 2 (`personal-details`).
- `src/features/wizard/selectors.ts`: Implement `isDocumentsStepValid` and progress computation based on visa-specific document requirements.
- `src/features/documents/`: New feature module containing `DocumentsScreen`, `DocumentSlotCard`, `CameraCapture`, `QualityWarning`, `SampleGuidanceSheet`, and `DocumentPreviewSheet`.
  </code_context>

<specifics>
## Specific Ideas

- Dual mobile buttons: "📷 Take Photo" prominently styled alongside "📁 Choose File" to make mobile camera capture effortless for users unfamiliar with standard file pickers.
- Blur detection: Canvas Laplacian variance calculation flagging photos with score below threshold as potentially blurry, but allowing a forgiving "Use anyway" button so low-end phones are not locked out.
- Sample previews: Rich visual modal showing exactly what a valid passport photo or passport bio page looks like, with callouts pointing to critical areas (MRZ, clear face, signature).
- Template downloads: Direct one-click download of sponsorship letter template and employer NOC formatted for Indian visa applications.
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed strictly within the Stage 3 Document Upload Pipeline domain.
</deferred>

---

_Phase: 03-Document Upload Pipeline_
_Context gathered: 2026-08-26_
