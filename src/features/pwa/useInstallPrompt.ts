import { useState, useEffect, useCallback } from 'react';
import type { BeforeInstallPromptEvent, InstallPromptState } from './types';

export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isStandaloneMedia = window.matchMedia?.('(display-mode: standalone)').matches;
    const isStandaloneNavigator = (window.navigator as unknown as { standalone?: boolean })
      ?.standalone;
    return Boolean(isStandaloneMedia || isStandaloneNavigator);
  });

  useEffect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptToInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      return choice.outcome === 'accepted';
    } catch {
      return false;
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    promptToInstall,
  };
}
