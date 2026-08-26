export interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  isReconnected: boolean;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface InstallPromptState {
  isInstallable: boolean;
  isInstalled: boolean;
  promptToInstall: () => Promise<boolean>;
}
