---
phase: 05
slug: confirmation-tracking-recovery
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-08-26
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution and retroactive audit.

---

## Test Infrastructure

| Property               | Value                                                                           |
| ---------------------- | ------------------------------------------------------------------------------- |
| **Framework**          | Vitest (Unit / Component) + Playwright (E2E)                                    |
| **Config file**        | `vitest.config.ts`, `playwright.config.ts`                                      |
| **Quick run command**  | `pnpm vitest run src/features/confirmation/`                                    |
| **Full suite command** | `pnpm vitest run && pnpm playwright test tests/e2e/stage5-confirmation.spec.ts` |
| **Estimated runtime**  | ~6 seconds                                                                      |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run src/features/confirmation/`
- **After every plan wave:** Run `pnpm vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green (`pnpm vitest run && pnpm playwright test`)
- **Max feedback latency:** ~6 seconds

---

## Per-Task Verification Map

| Task ID      | Plan | Wave | Requirement                   | Threat Ref | Secure Behavior                                                                         | Test Type       | Automated Command                                                                                                                     | File Exists | Status     |
| ------------ | ---- | ---- | ----------------------------- | ---------- | --------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| **05-01-01** | 01   | 1    | `CNFRM-01`, `TRCK-03`         | —          | Reference number generation, validation, formatters & share utilities                   | unit            | `pnpm vitest run src/features/confirmation/reference.test.ts src/features/confirmation/share.test.ts`                                 | ⬜          | ⬜ pending |
| **05-01-02** | 01   | 1    | `STATE-05`, `STATE-06`        | —          | Draft backup code generation, snapshot registry & duplicate lookup logic                | unit            | `pnpm vitest run src/services/mock/backup.test.ts src/services/mock/duplicate.test.ts`                                                | ⬜          | ⬜ pending |
| **05-02-01** | 02   | 2    | `CNFRM-01`, `TRCK-03`         | —          | Reference number card with 1-tap copy and WhatsApp/Web Share                            | component       | `pnpm vitest run src/features/confirmation/ReferenceCard.test.tsx`                                                                    | ⬜          | ⬜ pending |
| **05-02-02** | 02   | 2    | `CNFRM-02`, `TRCK-02`         | —          | Vertical status timeline card with interactive demo scenario controller & change alerts | component       | `pnpm vitest run src/features/confirmation/StatusTimelineCard.test.tsx`                                                               | ⬜          | ⬜ pending |
| **05-02-03** | 02   | 2    | `CNFRM-03`                    | —          | Visa-specific interview checklist with interactive checkboxes & .txt/print export       | component       | `pnpm vitest run src/features/confirmation/InterviewChecklistCard.test.tsx`                                                           | ⬜          | ⬜ pending |
| **05-02-04** | 02   | 2    | `CNFRM-04`                    | —          | Sent notifications disclosure card previewing simulated SMS and Email templates         | component       | `pnpm vitest run src/features/confirmation/SentNotificationsCard.test.tsx`                                                            | ⬜          | ⬜ pending |
| **05-03-01** | 03   | 2    | `TRCK-01`                     | —          | Standalone reference tracking modal with header trigger and lookup flow                 | component       | `pnpm vitest run src/features/confirmation/TrackingModal.test.tsx`                                                                    | ⬜          | ⬜ pending |
| **05-03-02** | 03   | 2    | `STATE-05`                    | —          | Cross-device draft backup modal with code generation and conflict resolution            | component       | `pnpm vitest run src/features/confirmation/DraftBackupModal.test.tsx`                                                                 | ⬜          | ⬜ pending |
| **05-03-03** | 03   | 2    | `STATE-06`                    | —          | Inline duplicate passport warning card with 1-tap track action and continue override    | component       | `pnpm vitest run src/features/confirmation/DuplicateWarningCard.test.tsx`                                                             | ⬜          | ⬜ pending |
| **05-04-01** | 04   | 3    | `CNFRM-01..04`, `TRCK-01..03` | —          | Stage 5 Confirmation screen integration, AppShell header actions & full E2E walkthrough | component + E2E | `pnpm vitest run src/features/confirmation/ConfirmationScreen.test.tsx && pnpm playwright test tests/e2e/stage5-confirmation.spec.ts` | ⬜          | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

All phase behaviors have automated verification (100% automated coverage).

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify commands
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Existing infrastructure covers all requirements
- [x] No watch-mode flags
- [x] Feedback latency < 10s (~6s actual)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-08-26
