import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Search, DownloadCloud, WifiOff, Menu, X, Trash2 } from 'lucide-react';
import { useNetworkStatus } from '../features/pwa';
import { useRouter } from '../router/Router';
import type { AppRoute } from '../router/Router';
import { ThemeSwitcher } from './ui/ThemeSwitcher';

export interface AppHeaderProps {
  onOpenHelp?: () => void;
  onOpenTracking?: () => void;
  onOpenBackup?: () => void;
  onOpenClearData?: () => void;
}

export function AppHeader({
  onOpenHelp,
  onOpenTracking,
  onOpenBackup,
  onOpenClearData,
}: AppHeaderProps) {
  const { t } = useTranslation();
  const { currentRoute, navigate } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: { label: string; path: AppRoute }[] = [
    { label: 'Home', path: '/' },
    { label: 'Apply Online', path: '/apply' },
    { label: 'Track Status', path: '/track' },
    { label: 'Guidelines', path: '/support' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface-card)]/95 backdrop-blur-md border-b border-[var(--color-border)] transition-colors">
      <div className="w-full px-6 sm:px-10 xl:px-16 2xl:px-24">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-[var(--color-indigo-primary)] rounded-md py-1"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--color-saffron-bright)]/10 flex items-center justify-center shrink-0 border border-[var(--color-saffron-bright)]/25">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-[var(--color-saffron-bright)] dark:text-amber-500"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  {[...Array(24)].map((_, i) => (
                    <line
                      key={i}
                      x1="12"
                      y1="12"
                      x2={12 + 10 * Math.cos((i * 15 * Math.PI) / 180)}
                      y2={12 + 10 * Math.sin((i * 15 * Math.PI) / 180)}
                      stroke="currentColor"
                      strokeWidth="0.8"
                    />
                  ))}
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-[var(--color-ink)] tracking-tight">
                    {t('app.appName', 'VisaReThink')}
                  </span>
                </div>
                <span className="text-[11px] text-[var(--color-ink-muted)] leading-none hidden sm:block">
                  Ministry of External Affairs
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 text-sm font-medium"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = currentRoute === link.path;
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-surface-subtle)] text-[var(--color-ink)] font-semibold'
                      : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Utility Tools */}
          <div className="flex items-center gap-1">
            {/* Track Application Button */}
            <button
              type="button"
              onClick={() => {
                if (onOpenTracking) onOpenTracking();
                else navigate('/track');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer border border-[var(--color-border)]"
              aria-label="Track visa status"
              data-testid="header-track-btn"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Track</span>
            </button>

            {/* Offline Backup Tool */}
            <button
              type="button"
              onClick={onOpenBackup}
              className="p-2 rounded-md text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer"
              aria-label="Export or restore draft backup"
              title="Draft Backup (JSON File)"
              data-testid="header-backup-btn"
            >
              <DownloadCloud className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Theme Toggle */}
            <ThemeSwitcher />

            {/* Clear Data Reset */}
            {onOpenClearData && (
              <button
                type="button"
                onClick={onOpenClearData}
                className="p-2 rounded-md text-[var(--color-ink-muted)] hover:text-red-500 hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer"
                aria-label="Clear cached data on shared device"
                title="Clear local application data"
                data-testid="header-clear-btn"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            {/* Help / FAQ */}
            <button
              type="button"
              onClick={onOpenHelp}
              className="p-2 rounded-md text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer"
              aria-label="Help and FAQ"
              data-testid="header-help-btn"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[var(--color-border)] space-y-0.5 animate-in fade-in duration-150">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => {
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium ${
                  currentRoute === link.path
                    ? 'bg-[var(--color-surface-subtle)] text-[var(--color-ink)] font-semibold'
                    : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-subtle)]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export function OfflineBanner() {
  const { t } = useTranslation();
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 border-b border-amber-600 text-center"
      data-testid="offline-banner"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{t('offline.banner', 'Offline mode active: all edits saved securely on device.')}</span>
    </div>
  );
}

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-ink)] focus:text-[var(--color-surface-bg)] focus:rounded-md focus:shadow-md focus:text-xs font-medium"
    >
      {t('app.skipToContent', 'Skip to main content')}
    </a>
  );
}

export function FloatingHelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-20 right-5 z-30 p-2.5 rounded-full bg-[var(--color-ink)] text-[var(--color-surface-bg)] shadow-md hover:opacity-90 transition-all active:scale-95 cursor-pointer"
      aria-label="Open 24x7 Help Center"
      title="24x7 Help & FAQs"
      data-testid="floating-help-btn"
    >
      <HelpCircle className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
