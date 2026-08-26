import { WifiOff, ShieldCheck } from 'lucide-react';
import { useNetworkStatus } from './useNetworkStatus';

export interface OfflineBannerProps {
  isOnline?: boolean;
  className?: string;
}

export function OfflineBanner({
  isOnline: controlledIsOnline,
  className = '',
}: OfflineBannerProps) {
  const network = useNetworkStatus();
  const isOnline = controlledIsOnline !== undefined ? controlledIsOnline : network.isOnline;

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="offline-banner"
      className={`w-full bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 shadow-xs flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium ${className}`}
    >
      <div className="flex items-center gap-1.5 shrink-0 text-amber-700">
        <WifiOff className="w-4 h-4" aria-hidden="true" />
      </div>
      <p className="leading-snug text-center sm:text-left flex-1 max-w-2xl flex items-center flex-wrap gap-x-1.5 gap-y-0.5 justify-center sm:justify-start">
        <span>You are currently offline.</span>
        <span className="inline-flex items-center gap-1 text-amber-800 font-normal">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" aria-hidden="true" />
          All answers and uploaded documents remain safely saved on this device.
        </span>
      </p>
    </div>
  );
}
