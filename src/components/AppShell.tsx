import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { InstallPromptBanner, OfflineBanner } from '../features/pwa';

export { OfflineBanner };

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-indigo-primary)] focus:text-white focus:rounded-md focus:shadow-md focus:outline-none"
    >
      {t('app.skipToContent')}
    </a>
  );
}

export interface AppHeaderProps {
  onOpenTracking?: () => void;
  onOpenBackup?: () => void;
}

export function AppHeader({ onOpenTracking, onOpenBackup }: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-[var(--color-border)] px-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-[var(--color-indigo-primary)] font-semibold text-lg tracking-tight">
          {t('app.appName')}
        </span>
      </div>
      <div id="header-actions" className="flex items-center gap-1.5 sm:gap-2">
        <InstallPromptBanner variant="button" />

        {onOpenTracking && (
          <button
            type="button"
            onClick={onOpenTracking}
            aria-label="Track Application Status"
            className="min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-[var(--radius-input)] text-xs font-semibold text-[var(--color-ink)] hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            data-testid="header-track-btn"
          >
            <span className="hidden sm:inline">Track Application</span>
            <span className="sm:hidden">Track</span>
          </button>
        )}

        {onOpenBackup && (
          <button
            type="button"
            onClick={onOpenBackup}
            aria-label="Backup Application Draft"
            className="min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-[var(--radius-input)] text-xs font-semibold text-[var(--color-indigo-primary)] hover:bg-indigo-50 flex items-center gap-1.5 transition-colors"
            data-testid="header-backup-btn"
          >
            <span className="hidden sm:inline">Backup Draft</span>
            <span className="sm:hidden">Backup</span>
          </button>
        )}

        <LanguageSwitcher />
      </div>
    </header>
  );
}
