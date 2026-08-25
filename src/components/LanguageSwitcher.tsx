import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, X } from 'lucide-react';
import { LOCALES, changeLocale } from '../i18n';
import { FOCUS_RING_CLASS } from './ui/focus';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  const currentLocaleCode = i18n.language || 'en';
  const currentLocale = LOCALES.find((l) => l.code === currentLocaleCode) || LOCALES[0]!;

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLng = e.target.value;
    await changeLocale(nextLng);
    setNoticeDismissed(false);
  };

  const showPendingNotice = currentLocaleCode !== 'en' && !noticeDismissed;

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 bg-[var(--color-surface-bg)] rounded-[var(--radius-input)] border border-[var(--color-border)] px-2 py-1">
        <Globe className="w-4 h-4 text-[var(--color-ink-muted)] shrink-0" aria-hidden="true" />
        <label htmlFor="language-select" className="sr-only">
          Select language
        </label>
        <select
          id="language-select"
          value={currentLocaleCode}
          onChange={handleSelectChange}
          className={`bg-transparent text-sm font-medium text-[var(--color-ink)] min-h-[44px] cursor-pointer outline-none ${FOCUS_RING_CLASS}`}
        >
          {LOCALES.map((loc) => (
            <option key={loc.code} value={loc.code}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      {showPendingNotice && (
        <div
          role="status"
          className="fixed top-16 left-0 right-0 z-50 bg-[var(--color-selected-bg)] border-b border-[var(--color-indigo-primary)]/20 px-4 py-2 text-xs sm:text-sm text-[var(--color-ink)] flex items-center justify-between shadow-xs"
        >
          <p className="pr-2">
            {t('notice.translationPending', { language: currentLocale.englishName })}
          </p>
          <button
            type="button"
            aria-label={t('actions.close')}
            onClick={() => setNoticeDismissed(true)}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] ${FOCUS_RING_CLASS}`}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
