import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { LOCALES, changeLocale } from '../i18n';
import { FOCUS_RING_CLASS } from './ui/focus';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLocaleCode = i18n.language || 'en';

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLng = e.target.value;
    await changeLocale(nextLng);
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 bg-[var(--color-surface-bg)] rounded-[var(--radius-input)] border border-[var(--color-border)] px-2.5 py-1">
        <Globe className="w-4 h-4 text-[var(--color-ink-muted)] shrink-0" aria-hidden="true" />
        <label htmlFor="language-select" className="sr-only">
          Select language
        </label>
        <select
          id="language-select"
          value={currentLocaleCode}
          onChange={handleSelectChange}
          aria-label="Select language"
          className={`bg-transparent text-sm font-medium text-[var(--color-ink)] min-h-[44px] cursor-pointer outline-none ${FOCUS_RING_CLASS}`}
        >
          {LOCALES.map((loc) => (
            <option key={loc.code} value={loc.code}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
