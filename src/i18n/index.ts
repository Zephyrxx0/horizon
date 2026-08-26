import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonEn from './locales/en/common.json';
import wizardEn from './locales/en/wizard.json';
import helpEn from './locales/en/help.json';
import errorsEn from './locales/en/errors.json';
import { loadScriptFont } from '../fonts';

export const NAMESPACES = ['common', 'wizard', 'help', 'errors'] as const;
export type Namespace = (typeof NAMESPACES)[number];

export interface LocaleDefinition {
  code: string;
  label: string;
  englishName: string;
}

export const LOCALES: readonly LocaleDefinition[] = [
  { code: 'en', label: 'English', englishName: 'English' },
  { code: 'hi', label: 'हिन्दी', englishName: 'Hindi' },
  { code: 'ta', label: 'தமிழ்', englishName: 'Tamil' },
  { code: 'te', label: 'తెలుగు', englishName: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'mr', label: 'मराठी', englishName: 'Marathi' },
] as const;

const initialLocale =
  (typeof window !== 'undefined' && window.localStorage?.getItem('visarethink.locale')) || 'en';

i18n.use(initReactI18next).init({
  lng: initialLocale,
  fallbackLng: 'en',
  ns: ['common', 'wizard', 'help', 'errors'],
  defaultNS: 'common',
  resources: {
    en: {
      common: commonEn,
      wizard: wizardEn,
      help: helpEn,
      errors: errorsEn,
    },
  },
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language || 'en';
}

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export async function changeLocale(lng: string): Promise<void> {
  const match = LOCALES.find((l) => l.code === lng);
  if (!match) {
    console.warn(`[i18n] Rejected unlisted locale: ${lng}`);
    return;
  }

  try {
    if (lng !== 'en') {
      const missingBundles = NAMESPACES.some((ns) => !i18n.hasResourceBundle(lng, ns));
      if (missingBundles) {
        try {
          const [commonMod, wizardMod, helpMod, errorsMod] = await Promise.all([
            import(`./locales/${lng}/common.json`),
            import(`./locales/${lng}/wizard.json`),
            import(`./locales/${lng}/help.json`),
            import(`./locales/${lng}/errors.json`),
          ]);
          i18n.addResourceBundle(lng, 'common', commonMod.default || commonMod, true, true);
          i18n.addResourceBundle(lng, 'wizard', wizardMod.default || wizardMod, true, true);
          i18n.addResourceBundle(lng, 'help', helpMod.default || helpMod, true, true);
          i18n.addResourceBundle(lng, 'errors', errorsMod.default || errorsMod, true, true);
        } catch (err) {
          console.warn(`[i18n] Failed to load some locale bundles for ${lng}:`, err);
        }
      }
    }

    await i18n.changeLanguage(lng);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('visarethink.locale', lng);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lng;
    }
    await loadScriptFont(lng);
  } catch (err) {
    console.error(`[i18n] Failed to switch locale to ${lng}:`, err);
  }
}

if (initialLocale && initialLocale !== 'en') {
  changeLocale(initialLocale).catch((e) =>
    console.warn(`[i18n] Failed to load initial locale ${initialLocale}:`, e),
  );
}

export default i18n;
