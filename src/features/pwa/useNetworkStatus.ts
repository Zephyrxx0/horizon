import { useState, useEffect, useRef } from 'react';
import type { NetworkStatus } from './types';

export interface UseNetworkStatusOptions {
  onReconnect?: () => void;
  onOffline?: () => void;
}

export function useNetworkStatus(options?: UseNetworkStatusOptions): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [isReconnected, setIsReconnected] = useState<boolean>(false);

  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setIsReconnected(true);
      optionsRef.current?.onReconnect?.();
    }

    function handleOffline() {
      setIsOnline(false);
      setWasOffline(true);
      setIsReconnected(false);
      optionsRef.current?.onOffline?.();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    wasOffline,
    isReconnected,
  };
}
