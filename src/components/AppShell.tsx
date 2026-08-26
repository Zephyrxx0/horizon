import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { InstallPromptBanner, OfflineBanner } from '../features/pwa';
import { HelpCircle } from 'lucide-react';

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
  onOpenHelp?: () => void;
}

export function AppHeader({ onOpenTracking, onOpenBackup, onOpenHelp }: AppHeaderProps) {
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

        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            aria-label="Help and Frequently Asked Questions"
            className="min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-[var(--radius-input)] text-xs font-semibold text-[var(--color-indigo-primary)] hover:bg-indigo-50 flex items-center gap-1.5 transition-colors"
            data-testid="header-help-btn"
          >
            <HelpCircle
              className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Need Help?</span>
            <span className="sm:hidden">Help</span>
          </button>
        )}

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

export interface FloatingHelpButtonProps {
  onClick: () => void;
}

export function FloatingHelpButton({ onClick }: FloatingHelpButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Need Help? Open FAQ and Support"
      data-testid="floating-help-btn"
      className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-[var(--color-indigo-primary)] hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform active:scale-95 touch-manipulation cursor-pointer"
    >
      <HelpCircle className="w-6 h-6" aria-hidden="true" />
    </button>
  );
}
