import React, { useState } from 'react';
import { ShieldCheck, HardDrive, EyeOff, Lock, ChevronRight } from 'lucide-react';
import { PrivacyPromiseSheet } from './PrivacyPromiseSheet';
import type { PrivacyPillar } from './types';

export interface PrivacyTrustCardProps {
  className?: string;
  onOpenPromise?: () => void;
}

export const PRIVACY_PILLARS: PrivacyPillar[] = [
  {
    id: 'local-only',
    title: 'Local Storage Only',
    description: 'Saved privately in your browser. Never sent to remote servers unsubmitted.',
    icon: 'device',
    badge: 'On-Device',
  },
  {
    id: 'zero-sharing',
    title: 'Zero 3rd-Party Sharing',
    description: 'No advertising trackers, data brokers, or marketing profiling.',
    icon: 'shield-ban',
    badge: 'No Trackers',
  },
  {
    id: 'encrypted-docs',
    title: 'Encrypted Document Staging',
    description: 'Scans & photos remain in isolated local storage until payment.',
    icon: 'lock',
    badge: 'Isolated',
  },
];

export const PrivacyTrustCard: React.FC<PrivacyTrustCardProps> = ({
  className = '',
  onOpenPromise,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenPromise = () => {
    setIsSheetOpen(true);
    onOpenPromise?.();
  };

  return (
    <>
      <div
        className={`p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-sm space-y-4 ${className}`}
        data-testid="privacy-trust-card"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-indigo-primary)] text-[var(--color-surface-bg)] flex items-center justify-center shadow-sm shrink-0">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--color-ink)]">
                Your Data & Privacy are Protected
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Built with local-first security principles for peace of mind
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRIVACY_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-1.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-md bg-[var(--color-surface-card)] text-[var(--color-indigo-primary)] flex items-center justify-center shrink-0">
                  {pillar.icon === 'device' && <HardDrive className="w-3.5 h-3.5" />}
                  {pillar.icon === 'shield-ban' && <EyeOff className="w-3.5 h-3.5" />}
                  {pillar.icon === 'lock' && <Lock className="w-3.5 h-3.5" />}
                </div>
                {pillar.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-surface-card)] text-[var(--color-indigo-primary)] border border-[var(--color-border-subtle)]">
                    {pillar.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--color-ink)] leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-[11px] text-[var(--color-ink-muted)] mt-0.5 leading-snug">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Privacy Promise Trigger */}
        <div className="pt-1 flex items-center justify-between border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-ink-muted)]">
            🔒 Bank-grade encryption standards
          </span>
          <button
            type="button"
            onClick={handleOpenPromise}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-indigo-primary)] hover:text-[var(--color-ink)] hover:underline min-h-[32px] px-1 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-primary)]"
            data-testid="read-privacy-promise-btn"
          >
            <span>Read our Privacy Promise</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <PrivacyPromiseSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>
  );
};
