---
phase: 03
slug: document-upload-pipeline
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-08-26
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                               |
| ---------------------- | ------------------------------------------------------------------- |
| **Framework**          | Vitest 4.x + React Testing Library + vitest-axe + Playwright 1.62.x |
| **Config file**        | `vitest.config.ts`, `playwright.config.ts`                          |
| **Quick run command**  | `pnpm test src/features/documents`                                  |
| **Full suite command** | `pnpm test && pnpm typecheck && pnpm lint && pnpm playwright test`  |
| **Estimated runtime**  | ~25 seconds                                                         |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test src/features/documents`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement         | Threat Ref | Secure Behavior                                                                       | Test Type | Automated Command                                                  | File Exists | Status   |
| -------- | ---- | ---- | ------------------- | ---------- | ------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------ | ----------- | -------- |
| 03-01-01 | 01   | 1    | DOCS-01             | —          | Structured slot definitions and dynamic visa slot resolver                            | unit      | `pnpm test src/features/documents/requirements.test.ts`            | ✅          | ✅ green |
| 03-01-02 | 01   | 1    | DOCS-04             | —          | Discrete Laplacian variance blur analysis and resolution gates                        | unit      | `pnpm test src/features/documents/quality.test.ts`                 | ✅          | ✅ green |
| 03-01-03 | 01   | 1    | STATE-03            | —          | ≤2MB client-side compression & IndexedDB blob persistence                             | unit      | `pnpm test src/features/documents/storage.test.ts`                 | ✅          | ✅ green |
| 03-02-01 | 02   | 2    | DOCS-03             | —          | Formatted size, thumbnails, replace/remove/preview actions with 48px targets          | unit/a11y | `pnpm test src/features/documents/StatusBadge.test.tsx`            | ✅          | ✅ green |
| 03-02-02 | 02   | 2    | DOCS-04, ERR-02     | —          | Amber warning callout with retake and soft override ("✓ Use This Image Anyway")       | unit/a11y | `pnpm test src/features/documents/QualityWarningCard.test.tsx`     | ✅          | ✅ green |
| 03-02-03 | 02   | 2    | DOCS-01, DOCS-02    | —          | Passport bio/address sub-slots, dual mobile camera/file triggers, desktop dropzone    | unit/a11y | `pnpm test src/features/documents/DocumentSubSlot.test.tsx`        | ✅          | ✅ green |
| 03-02-04 | 02   | 2    | DOCS-01, DOCS-02    | —          | Master document slot card component                                                   | unit/a11y | `pnpm test src/features/documents/DocumentSlotCard.test.tsx`       | ✅          | ✅ green |
| 03-03-01 | 03   | 2    | DOCS-05             | —          | Plain-text templates for Sponsorship, Employer NOC, Financial Declaration             | unit      | `pnpm test src/features/documents/templates.test.ts`               | ✅          | ✅ green |
| 03-03-02 | 03   | 2    | DOCS-05             | —          | Accessible template download trigger button                                           | unit/a11y | `pnpm test src/features/documents/TemplateDownloadButton.test.tsx` | ✅          | ✅ green |
| 03-03-03 | 03   | 2    | DOCS-05             | —          | Full-height inspection modal with zoom/pan, embedded viewer, legibility checklist     | unit/a11y | `pnpm test src/features/documents/DocumentPreviewSheet.test.tsx`   | ✅          | ✅ green |
| 03-03-04 | 03   | 2    | DOCS-05             | —          | Visual samples guidance sheet with photography tips and dos/don'ts                    | unit/a11y | `pnpm test src/features/documents/SampleGuidanceSheet.test.tsx`    | ✅          | ✅ green |
| 03-04-01 | 04   | 3    | DOCS-01, ERR-01     | —          | Documents step validation & deriveStepStatus integration                              | unit      | `pnpm test src/features/wizard/validators.test.ts`                 | ✅          | ✅ green |
| 03-04-02 | 04   | 3    | DOCS-01..05, ERR-01 | —          | Stage 3 container screen with sticky progress header and ErrorSummary                 | unit/a11y | `pnpm test src/features/documents/DocumentsScreen.test.tsx`        | ✅          | ✅ green |
| 03-04-03 | 04   | 3    | STATE-03, STATE-04  | —          | End-to-end user journey across Stage 1-3, persistence across reload, Stage 4 continue | e2e       | `pnpm playwright test tests/e2e/documents-upload.spec.ts`          | ✅          | ✅ green |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [x] `src/features/documents/requirements.test.ts` — test catalog & resolver
- [x] `src/features/documents/quality.test.ts` — test blur & dimension heuristics
- [x] `src/features/documents/storage.test.ts` — test compression & IDB pipeline
- [x] `tests/e2e/documents-upload.spec.ts` — full user journey E2E test suite

_Existing infrastructure covers all phase requirements._

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual                                                                      | Test Instructions |
| -------- | ----------- | ------------------------------------------------------------------------------- | ----------------- |
| _None_   | —           | All phase behaviors have automated unit, component, a11y, and E2E verification. | —                 |

_All phase behaviors have automated verification._

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** Approved 2026-08-26
