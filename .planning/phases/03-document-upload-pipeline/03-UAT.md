---
status: passed
phase: 03-document-upload-pipeline
source:
  - 03-01-SUMMARY.md
  - 03-02-SUMMARY.md
  - 03-03-SUMMARY.md
  - 03-04-SUMMARY.md
started: 2026-08-26T12:25:00Z
updated: 2026-08-26T12:28:40Z
---

## Current Test

<!-- OVERWRITE each test - shows where we are -->

All tests complete. 8/8 passed.

## Tests

### 1. Cold Start Smoke Test

expected: Starting the application from scratch (`pnpm dev`) boots without errors, and navigating from Visa Selection through Personal Details into Stage 3 (Documents) displays the document checklist and live progress counter.
result: pass
source: automated
verification: tests/e2e/smoke.spec.ts, tests/e2e/documents-upload.spec.ts

### 2. Passport Page-by-Page Multi-Slot Upload & Guideline Tips

expected: In Stage 3, Indian Passport renders distinct upload sub-slots for "Passport Bio Page (Pages 1–2)" and "Passport Address Page (Pages 35–36)" with upload tips and dual camera (Take Photo) / file selection triggers. Uploading an image immediately shows file name, formatted size, and "✓ Ready" confirmation badge.
result: pass
source: automated
verification: tests/e2e/documents-upload.spec.ts, src/features/documents/DocumentSubSlot.test.tsx, src/features/documents/DocumentSlotCard.test.tsx

### 3. Blur & Low-Resolution Detection with Soft Override

expected: Uploading an undersized or blurry image displays an amber warning card ("Image looks blurry or low-resolution") with specific feedback and dual buttons: "Retake Photo" and "✓ Use This Image Anyway". Clicking the override button clears the warning so the applicant can proceed.
result: pass
source: automated
verification: tests/e2e/documents-upload.spec.ts, src/features/documents/QualityWarningCard.test.tsx, src/features/documents/quality.test.ts

### 4. Sample Document Guidance & Photography Tips

expected: Clicking "View sample & tips" on any document slot opens a side sheet showing visual samples, photography rules (keeping phone flat, showing 4 corners, avoiding glare), and an "I understand" button that closes the modal.
result: pass
source: automated
verification: tests/e2e/documents-upload.spec.ts, src/features/documents/SampleGuidanceSheet.test.tsx

### 5. High-Resolution Inspection & Legibility Checklist

expected: Clicking "Preview" on any ready document opens a full-height inspection sheet with Zoom In, Zoom Out, Reset controls, an embedded viewer, and a 3-point legibility checklist.
result: pass
source: automated
verification: tests/e2e/documents-upload.spec.ts, src/features/documents/DocumentPreviewSheet.test.tsx

### 6. Downloadable Standard Templates

expected: For documents requiring formal letters (e.g. Sponsorship, Employer NOC), clicking "Download template" instantly initiates a download of the pre-filled template text file.
result: pass
source: automated
verification: tests/e2e/documents-upload.spec.ts, src/features/documents/TemplateDownloadButton.test.tsx, src/features/documents/templates.test.ts

### 7. Progress Counter & Step Validation

expected: The top header displays "Documents: X of Y mandatory ready" updating live as documents are attached. Attempting to click "Continue to Review & Payment" before all mandatory documents are attached triggers an accessible ErrorSummary at the top with jump links to missing slots.
result: pass
source: automated
verification: tests/e2e/documents-upload.spec.ts, src/features/documents/DocumentsScreen.test.tsx, src/features/wizard/validators.test.ts

### 8. Draft Persistence Across Reload

expected: Uploaded documents and thumbnails survive a full browser reload, restoring the applicant directly to the documents pipeline with their attached files intact in IndexedDB.
result: pass
source: automated
verification: tests/e2e/documents-upload.spec.ts, tests/e2e/save-documents.spec.ts

## Summary

total: 8
passed: 8
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
