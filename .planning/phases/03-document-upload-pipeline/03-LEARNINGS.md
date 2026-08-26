---
phase: '03'
phase_name: 'Document Upload Pipeline'
project: 'VisaReThink — Reimagined Indian Visa Service Portal'
generated: '2026-08-26T12:37:00Z'
counts:
  decisions: 5
  lessons: 2
  patterns: 3
  surprises: 1
missing_artifacts: []
---

# Phase 03 Learnings: Document Upload Pipeline

## Decisions

### Discrete Laplacian Variance Edge Contrast Analysis

Run a discrete 3×3 Laplacian convolution filter over 256×256 grayscale offscreen canvas pixels to measure sharpness variance rather than relying on unstandardized browser/device camera APIs.

**Rationale:** Provides instant, zero-network, client-side blur and low-resolution detection uniformly across budget mobile devices without heavy WASM dependencies.
**Source:** 03-01-PLAN.md

---

### Soft Blur Warning Override with Explicit Acknowledgment

Provide an amber warning card with "Retake Photo" and a soft override "✓ Use This Image Anyway" action that unlocks step progression upon explicit applicant acknowledgment.

**Rationale:** Prevents false-positive edge cases (e.g. vintage passports, faint embassy watermarks, soft lighting) from hard-blocking applicant progression while maintaining clear warning visibility.
**Source:** 03-02-PLAN.md

---

### Dual Mobile Camera & File Triggers with Desktop Dropzone

Equip each document slot with distinct mobile buttons (`📷 Take Photo` with `capture="environment"` and `📁 Upload File / PDF`) plus desktop drag-and-drop handlers.

**Rationale:** Many mobile applicants already have scans/PDFs saved in their device files, while others take fresh camera captures; supporting both workflows with 48px touch targets prevents drop-offs.
**Source:** 03-02-PLAN.md

---

### Passport Multi-Part Sub-Slot Partitioning

Split the Indian Passport slot into two explicit sub-slots: Bio Page (Pages 1–2) and Address Page (Pages 35–36) with dedicated guidance tips.

**Rationale:** Indian passports place identity details on the front pages and residential/parentage data on the final page; treating them as separate sub-slots prevents applicants from accidentally omitting the back page.
**Source:** 03-01-PLAN.md

---

### Client-Side Blob Compression & IndexedDB Storage

Dynamically scale and compress images to a ≤2MB budget before persisting raw binary blobs in IndexedDB (`idb-keyval`), while storing lightweight metadata in the wizard machine answers context.

**Rationale:** Keeps large binary files out of the 5MB `localStorage` budget while ensuring attached documents survive browser reloads and tab kills.
**Source:** 03-01-PLAN.md

---

## Lessons

### Accessibility Contracts for Dynamic Dialogs & Hidden File Inputs

File inputs marked `opacity-0` or `sr-only` require explicit `aria-label` matching their contextual sub-slot to satisfy WCAG AA / axe `label` rules, and Dialog/Sheet portals must maintain strict heading hierarchy (`<h3>` beneath `<h2>` Sheet title).

**Context:** Discovered while running `vitest-axe` across Sheet and SubSlot component tests.
**Source:** 03-02-SUMMARY.md

---

### Autosave Pagehide Flush on Headless Browser Reloads

In Playwright tests, triggering `window.dispatchEvent(new Event('pagehide'))` or waiting for the debounced save indicator before `page.reload()` guarantees reliable synchronous localStorage writes across headless Chromium restarts.

**Context:** Discovered during E2E verification where reload occurred mid-debounce timer.
**Source:** 03-04-SUMMARY.md

---

## Patterns

### Multi-Part Document Sub-Slot Composition

`DocumentSlotCard` acts as a parent container hosting either a direct single upload slot or multiple `DocumentSubSlot` children, sharing a unified status badge and requirements checklist.

**When to use:** Any document requirement with distinct multi-page or front/back scanning requirements (passports, national ID cards, driver's licenses).
**Source:** 03-02-PLAN.md

---

### Full-Height Inspection Modal with Legibility Checklist

A responsive `Sheet` modal offering zoom/pan controls, embedded PDF viewing, and a plain-language 3-point checklist (name clear, photo un-obscured, dates legible) before submission.

**When to use:** Before committing user documents to consular submission or payment.
**Source:** 03-03-PLAN.md

---

### Instant Client-Side Plain-Text Template Downloads

Client-side generation of pre-formatted plain-text template files using `URL.createObjectURL(new Blob([content], { type: 'text/plain' }))`.

**When to use:** Providing standard wording for formal documents (Sponsorship letters, Employer NOCs, Financial Declarations) without requiring backend document generation.
**Source:** 03-03-PLAN.md

---

## Surprises

### DOM Pointer Events Interception on Wrapped Radio/Card Inputs

Standard Playwright `getByRole('radio').check()` calls were intercepted by parent `<label>` elements when `<input type="radio">` used `sr-only` instead of full card overlay (`opacity-0 absolute inset-0`).

**Impact:** Fixed by overlaying the `<input>` across the entire clickable surface (`opacity-0 absolute inset-0 cursor-pointer`), which improved both Playwright test reliability and mobile touch usability.
**Source:** 03-04-SUMMARY.md
