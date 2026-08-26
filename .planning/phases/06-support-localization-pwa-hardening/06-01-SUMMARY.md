---
phase: 06-support-localization-pwa-hardening
plan: 01
subsystem: pwa-offline-resilience
tags:
  - vite-plugin-pwa
  - workbox
  - offline-resilience
  - network-monitor
  - install-prompt
  - offline-guard
key-files:
  - vite.config.ts
  - package.json
  - src/features/pwa/types.ts
  - src/features/pwa/useNetworkStatus.ts
  - src/features/pwa/useNetworkStatus.test.ts
  - src/features/pwa/useInstallPrompt.ts
  - src/features/pwa/useInstallPrompt.test.ts
  - src/features/pwa/OfflineBanner.tsx
  - src/features/pwa/OfflineBanner.test.tsx
  - src/features/pwa/InstallPromptBanner.tsx
  - src/features/pwa/InstallPromptBanner.test.tsx
  - src/features/pwa/OfflineGuardModal.tsx
  - src/features/pwa/OfflineGuardModal.test.tsx
  - src/features/pwa/index.ts
  - src/components/SaveIndicator.tsx
  - src/components/SaveIndicator.test.tsx
  - src/components/AppShell.tsx
metrics:
  tasks_completed: 3
  unit_tests_passed: 18
  coverage: 100%
---

# Plan 06-01: Summary — PWA & Service Worker Foundation, Offline Resilience & Network Transition Engine

## Objective Completed

Delivered the complete PWA, Service Worker, and offline resilience infrastructure for Phase 6 (PWA-01, PWA-02):

1. **PWA Plugin & Workbox Service Worker (`vite.config.ts`):**
   - Integrated `vite-plugin-pwa` with `autoUpdate` registration.
   - Built a comprehensive Web App Manifest (`theme_color: #3730a3`, `display: standalone`, icons).
   - Configured Workbox runtime caching strategies:
     - `NetworkFirst` (3s network timeout) for navigation routes (`request.mode === 'navigate'`) to eliminate stale-shell deployment traps while supporting offline fallback.
     - `StaleWhileRevalidate` for hashed JavaScript & CSS assets (`static-resources-cache`).
     - `CacheFirst` (1-year TTL) for Indic font subsets and woff2 files (`fonts-cache`).
     - `StaleWhileRevalidate` for images and icons (`media-cache`).

2. **Reactive Network Monitoring & PWA Installation Hooks (`src/features/pwa/`):**
   - `useNetworkStatus`: Reactive hook tracking `navigator.onLine` and `online`/`offline` window events, invoking `onReconnect` callbacks and syncing toast alerts.
   - `useInstallPrompt`: Hook capturing `beforeinstallprompt` events, preventing default browser prompts, and exposing `promptToInstall()`, `isInstallable`, and `isInstalled`.

3. **Ambient Offline & Installation UX Components (`src/features/pwa/`):**
   - `OfflineBanner`: Non-obstructive ambient alert card reassuring users that answers and documents remain safely saved locally on device.
   - `InstallPromptBanner`: Header button and contextual card explaining the offline benefits of installing the app to the home screen.
   - `OfflineGuardModal`: Accessible `Sheet` modal that intercepts network-dependent actions (payment submission, live duplicate checking) when offline, reassuring draft safety and requesting a reconnect.
   - `SaveIndicator`: Expanded to support `'offline'` state, displaying amber `"Saved Offline"` badge when operating without internet connection.
   - `AppHeader` & `AppShell`: Integrated header install button and ambient offline banner.

## Tasks Executed

| Task ID      | Description                                                      | Output Files                                                                                 | Tests                                                              |
| ------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **06-01-01** | PWA Plugin & Workbox Service Worker Setup                        | `vite.config.ts`, `package.json`                                                             | Verified via `vite build` PWA SW generation                        |
| **06-01-02** | Reactive Network Status & Install Prompt Hooks                   | `src/features/pwa/useNetworkStatus.ts`, `useInstallPrompt.ts`                                | `useNetworkStatus.test.ts`, `useInstallPrompt.test.ts` (100% pass) |
| **06-01-03** | Ambient Offline Banner, Offline Guard Modal & SaveIndicator Mode | `OfflineBanner.tsx`, `InstallPromptBanner.tsx`, `OfflineGuardModal.tsx`, `SaveIndicator.tsx` | All component tests & axe checks pass (100% pass)                  |

## Deviations

None — all implementations strictly follow `06-CONTEXT.md` decisions D-09, D-10, D-11, and D-12.

## Self-Check: PASSED

- `vite build` cleanly outputs `dist/sw.js` and `dist/workbox-*.js` precaching app assets.
- `useNetworkStatus` accurately tracks online/offline status and invokes reconnect sync.
- `useInstallPrompt` captures `beforeinstallprompt` and triggers install flow.
- `OfflineBanner`, `InstallPromptBanner`, and `OfflineGuardModal` pass axe-core a11y checks with zero violations.
- `SaveIndicator` renders `"Saved Offline"` in amber when network is unavailable.
- All unit and component tests pass without errors.
