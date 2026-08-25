# 01-06 Summary: Bilingual Localization Engine & Font Budget Quality Gates (I18N-01, I18N-02, QUAL-01, QUAL-02, FOUND-04)

## Outcome

Wave 5 (Plan 01-06) is complete. Implemented the complete bilingual and Indic script localization infrastructure (`src/i18n/index.ts`, `src/fonts.ts`), typed translation keys via `CustomTypeOptions` (`src/i18n/i18next.d.ts`), English translation decks for `common` and `wizard` namespaces, the native-script `LanguageSwitcher` header control with honest pending-translation alerts, and the font bundle budget quality gate script (`scripts/check-font-budget.mjs`) guarding 3G payload limits in CI.

## Delivered Artifacts

- **Localization Core (`src/i18n/`):**
  - `index.ts`: React-i18next initialization with eager Latin and fallback English decks, `LOCALES` registry with 6 languages (English, हिन्दी, தமிழ், తెలుగు, ಕನ್ನಡ, मराठी), and allowlist-guarded `changeLocale(lng)` setting `document.documentElement.lang` and lazy Fontsource loading.
  - `locales/en/common.json` & `locales/en/wizard.json`: Complete English copy deck covering save indicators, error banners, storage quotas, confirmation sheets, stepper labels, and form fields.
  - `i18next.d.ts`: TypeScript module augmentation for type-safe `t()` translation keys.
- **Dynamic Script Font Subsetting (`src/fonts.ts`):**
  - Eager Latin weights 400 & 600 (`@fontsource/noto-sans`).
  - Lazy `loadScriptFont(lng)` dynamically fetching per-script subsets (Devanagari for Hindi/Marathi, Tamil, Telugu, Kannada) only when the respective locale is activated.
- **UI Components & String Migration:**
  - `src/components/LanguageSwitcher.tsx`: Accessible header selector with 6 native-script labels and dismissible translation-pending notice.
  - Migrated `App.tsx`, `AppShell.tsx`, `SaveIndicator.tsx`, `DemoWizard.tsx`, and `DocumentStep.tsx` from raw strings to `useTranslation()`.
- **Quality Gates & Font Budget:**
  - `scripts/check-font-budget.mjs`: Node verification asserting no Indic fonts are referenced in initial `index.html` and capping all per-script woff2 subsets to $\le$ 80KB.
  - Updated `.github/workflows/ci.yml` and `package.json` with `check:fonts`.
- **Tests:**
  - `src/components/LanguageSwitcher.test.tsx` (locale switching, lang attribute sync, pending banner, axe zero-violations).
  - All 23 test suites and 4 Playwright E2E tests verified passing.

## Verification Results

- `pnpm typecheck`: 0 errors
- `pnpm lint`: 0 errors
- `pnpm test`: 23 test files, 58 unit/axe tests passed
- `pnpm e2e`: 4 Playwright tests passed
- `pnpm check:contrast`: 8/8 WCAG AA color pairs passed
- `pnpm check:fonts`: 0 eager Indic leaks, all woff2 subsets $\le$ 80KB
