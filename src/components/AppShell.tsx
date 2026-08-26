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
    { label: 'Portal Home', path: '/' },
    { label: 'Apply Online', path: '/apply' },
    { label: 'Status & Verification', path: '/track' },
    { label: 'Guidelines', path: '/support' },
    { label: 'Design System', path: '/design-system' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-slate-900 rounded-md py-1"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold text-xs shrink-0 shadow-2xs">
                🇮🇳
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {t('app.appName', 'e-Visa India')}
                  </span>
                  <span className="hidden md:inline-block text-[11px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                    Official
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-none hidden sm:block">
                  Government of India • Ministry of External Affairs
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 text-xs font-medium"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = currentRoute === link.path;
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Utility Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Track Application Button */}
            <button
              type="button"
              onClick={() => {
                if (onOpenTracking) onOpenTracking();
                else navigate('/track');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-800"
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
              className="p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
                className="p-2 rounded-md text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
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
              className="p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Help and FAQ"
              data-testid="header-help-btn"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1 animate-in fade-in duration-150">
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
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'
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
      className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 border-b border-amber-600 text-center"
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
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-white focus:rounded-md focus:shadow-md focus:text-xs font-medium"
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
      className="fixed bottom-5 right-5 z-30 p-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md hover:bg-zinc-800 transition-transform active:scale-95 cursor-pointer"
      aria-label="Open 24x7 Help Center"
      title="24x7 Help & FAQs"
      data-testid="floating-help-btn"
    >
      <HelpCircle className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
