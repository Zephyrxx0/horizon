import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonEn from './locales/en/common.json';
import wizardEn from './locales/en/wizard.json';
import { loadScriptFont } from '../fonts';

export const NAMESPACES = ['common', 'wizard'] as const;

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
  ns: ['common', 'wizard'],
  defaultNS: 'common',
  resources: {
    en: {
      common: commonEn,
      wizard: wizardEn,
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
    if (lng !== 'en' && !i18n.hasResourceBundle(lng, 'common')) {
      // Lazy load additional locale bundle if present
      try {
        const commonModule = await import(`./locales/${lng}/common.json`);
        i18n.addResourceBundle(lng, 'common', commonModule.default || commonModule, true, true);
      } catch {
        // Untranslated: falls back to 'en'
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

export default i18n;
