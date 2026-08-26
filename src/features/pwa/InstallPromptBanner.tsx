import { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

import { useInstallPrompt } from './useInstallPrompt';
import { FOCUS_RING_CLASS } from '../../components/ui/focus';

export interface InstallPromptBannerProps {
  variant?: 'card' | 'button';
  onInstallSuccess?: () => void;
  onDismiss?: () => void;
  className?: string;
  forceShow?: boolean;
}

export function InstallPromptBanner({
  variant = 'card',
  onInstallSuccess,
  onDismiss,
  className = '',
  forceShow = false,
}: InstallPromptBannerProps) {
  const { isInstallable, isInstalled, promptToInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If installed or user dismissed (and not force-shown in tests), do not render
  if (isInstalled || (isDismissed && !forceShow)) {
    return null;
  }

  // If not installable and not force-shown in tests, do not render
  if (!isInstallable && !forceShow) {
    return null;
  }

  const handleInstall = async () => {
    setInstalling(true);
    const accepted = await promptToInstall();
    setInstalling(false);
    if (accepted) {
      onInstallSuccess?.();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleInstall}
        disabled={installing}
        aria-label="Install VisaReThink as an app"
        data-testid="pwa-install-header-btn"
        className={`min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-[var(--radius-input)] text-xs font-semibold text-[var(--color-indigo-primary)] bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1.5 transition-colors cursor-pointer ${FOCUS_RING_CLASS} ${className}`}
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="Install app recommendation"
      data-testid="pwa-install-card"
      className={`bg-indigo-50/80 border border-indigo-200 rounded-[var(--radius-card)] p-4 sm:p-5 relative ${className}`}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss install recommendation"
        className={`absolute top-3 right-3 p-1 rounded text-indigo-700 hover:text-indigo-900 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${FOCUS_RING_CLASS}`}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>

      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-[var(--color-indigo-primary)] mt-0.5">
          <Smartphone className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1 pr-6">
          <h3 className="text-sm sm:text-base font-semibold text-[var(--color-indigo-primary)]">
            Install VisaReThink for Seamless Offline Use
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] mt-1">
            Add VisaReThink to your home screen to complete your application anywhere, even in areas
            with spotty connectivity.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleInstall}
              disabled={installing}
              data-testid="pwa-install-action-btn"
              className={`min-h-[44px] px-4 py-2 bg-[var(--color-indigo-primary)] hover:bg-[var(--color-indigo-hover)] text-white text-xs sm:text-sm font-semibold rounded-[var(--radius-input)] shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors ${FOCUS_RING_CLASS}`}
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>{installing ? 'Opening installer…' : 'Install to Home Screen'}</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              data-testid="pwa-dismiss-btn"
              className={`min-h-[44px] px-3 py-2 text-xs sm:text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] cursor-pointer ${FOCUS_RING_CLASS}`}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
