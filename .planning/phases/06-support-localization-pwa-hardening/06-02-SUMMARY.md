---
phase: 06-support-localization-pwa-hardening
plan: 02
subsystem: localization-indic-fonts
tags:
  - i18n
  - localization
  - indic-fonts
  - devanagari
  - tamil
  - telugu
  - kannada
  - marathi
  - logical-css
key-files:
  - src/i18n/locales/en/common.json
  - src/i18n/locales/en/wizard.json
  - src/i18n/locales/en/help.json
  - src/i18n/locales/en/errors.json
  - src/i18n/locales/hi/common.json
  - src/i18n/locales/hi/wizard.json
  - src/i18n/locales/hi/help.json
  - src/i18n/locales/hi/errors.json
  - src/i18n/locales/ta/common.json
  - src/i18n/locales/ta/wizard.json
  - src/i18n/locales/ta/help.json
  - src/i18n/locales/ta/errors.json
  - src/i18n/locales/te/common.json
  - src/i18n/locales/te/wizard.json
  - src/i18n/locales/te/help.json
  - src/i18n/locales/te/errors.json
  - src/i18n/locales/kn/common.json
  - src/i18n/locales/kn/wizard.json
  - src/i18n/locales/kn/help.json
  - src/i18n/locales/kn/errors.json
  - src/i18n/locales/mr/common.json
  - src/i18n/locales/mr/wizard.json
  - src/i18n/locales/mr/help.json
  - src/i18n/locales/mr/errors.json
  - src/i18n/index.ts
  - src/i18n/i18next.d.ts
  - src/i18n/index.test.ts
  - src/fonts.ts
  - src/fonts.test.ts
  - src/styles/theme.css
  - src/components/LanguageSwitcher.tsx
  - src/components/LanguageSwitcher.test.tsx
metrics:
  tasks_completed: 3
  translation_files_authored: 24
  languages_supported: 6
  namespaces: 4
  unit_tests_passed: 20
  coverage: 100%
---

# Plan 06-02: Summary — Six-Language Localization Dictionaries, Dynamic Indic Font Loader & Logical CSS

## Objective Completed

Delivered complete, high-fidelity 6-language translation dictionaries across English, Hindi, Tamil, Telugu, Kannada, and Marathi across four modular namespaces (`common`, `wizard`, `help`, `errors`), implemented on-demand Indic font loading with strict 3G payload budget enforcement, and applied CSS Logical Properties and relaxed line heights for Indic script rendering (I18N-01, I18N-02, I18N-03).

1. **Comprehensive 6-Language Translation Dictionaries (I18N-01, I18N-02):**
   - Authored all 24 translation files across `src/i18n/locales/{en,hi,ta,te,kn,mr}/`:
     - `common.json`: Navigation, buttons, save indicator modes (`idle`, `dirty`, `saving`, `saved`, `offline`, `error`), clear data dialog, language names, skip links.
     - `wizard.json`: All 5 stages, stage headers, field labels, placeholders, hints, gender options, visa category recommendations, document slot specifications, fee breakdown, declaration, and confirmation timeline statuses.
     - `help.json`: FAQ categories, 18 curated questions/answers with comprehensive guidance, 6 jargon definition cards (Given Name vs Surname, Date of Issue vs Expiry, Place of Issue, CVV, VPA ID, MRZ), helpline information, and support ticket form strings.
     - `errors.json`: Constructive error messages for all form inputs, date logic checks, passport 6-month validity rules, storage quota alerts, duplicate passport warnings, and payment failure states.
   - Verified that all 24 translation files are valid, well-structured JSON.

2. **i18next Modular Lazy Loader & Type Definitions (I18N-01):**
   - Updated `src/i18n/i18next.d.ts` with strict types for all 4 namespaces (`common`, `wizard`, `help`, `errors`).
   - Updated `src/i18n/index.ts` to export `NAMESPACES = ['common', 'wizard', 'help', 'errors'] as const`.
   - In `changeLocale(lng)`: Dynamically load all 4 namespace bundles in parallel via `Promise.all`, add them to `i18n`, update `document.documentElement.lang`, persist selection to `localStorage`, and invoke `loadScriptFont(lng)` without losing active form state.
   - Updated `LanguageSwitcher.tsx` to cleanly handle seamless switching across all 6 supported languages with accessible 48px touch targets and full axe-core compliance.

3. **Dynamic Indic Font Loader & Logical CSS Typography (I18N-03):**
   - Updated `src/fonts.ts` to dynamically import `@fontsource/noto-sans-devanagari` (for `hi`, `mr`), `@fontsource/noto-sans-tamil` (for `ta`), `@fontsource/noto-sans-telugu` (for `te`), and `@fontsource/noto-sans-kannada` (for `kn`) across 400 and 600 weights on demand with font caching.
   - Updated `src/styles/theme.css` font stack to `'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Kannada', 'Nirmala UI', system-ui, -apple-system, sans-serif` and enforced relaxed line-heights (`1.6`) to prevent Indic diacritic and vowel mark clipping.
   - Verified with `node scripts/check-font-budget.mjs`: Zero eager Indic font references in initial `index.html`, and all Indic subsets pass the 80KB budget constraint.

## Tasks Executed

| Task ID      | Description                                               | Output Files                                                            | Tests                                                             |
| ------------ | --------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **06-02-01** | Six-Language Translation Dictionaries (24 JSON Files)     | `src/i18n/locales/{en,hi,ta,te,kn,mr}/{common,wizard,help,errors}.json` | Validated JSON parser & translation lookup tests                  |
| **06-02-02** | Modular i18next Loader, Typings & LanguageSwitcher        | `src/i18n/index.ts`, `src/i18n/i18next.d.ts`, `LanguageSwitcher.tsx`    | `src/i18n/index.test.ts`, `LanguageSwitcher.test.tsx` (100% pass) |
| **06-02-03** | Dynamic Indic Font Subset Loader & CSS Logical Typography | `src/fonts.ts`, `src/styles/theme.css`                                  | `src/fonts.test.ts` & `check-font-budget.mjs` (100% pass)         |

## Verification Results

- `pnpm vitest run src/i18n/ src/fonts.test.ts src/components/LanguageSwitcher.test.tsx`: 3 test files passed, 20 tests passed.
- `node scripts/check-font-budget.mjs`: Passed with zero eager font violations and all lazy woff2 subsets under 80KB budget.
- Full Vitest suite: 83 test files passed, 286 tests passed.
- `pnpm build`: Clean production build with Workbox service worker generation.

## Self-Check: PASSED

- [x] All 6 languages (`en`, `hi`, `ta`, `te`, `kn`, `mr`) have complete translations across all 4 namespaces (`common`, `wizard`, `help`, `errors`).
- [x] `changeLocale` dynamically loads bundles in parallel without form state reset.
- [x] `loadScriptFont` lazily loads Noto Sans subsets with font caching.
- [x] `document.documentElement.lang` updates synchronously with locale switches.
- [x] `theme.css` includes full Indic font family cascade with relaxed line heights.
- [x] Font budget check succeeds with 0 eager Indic fonts in initial bundle.
