import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  HelpCircle,
  UserCheck,
  MapPin,
  PlaneTakeoff,
  HardDrive,
  EyeOff,
  ChevronRight,
} from 'lucide-react';

import { PrivacyPromiseSheet } from '../trust/PrivacyPromiseSheet';
import type { StepId } from '../wizard/types';

interface FormSidebarProps {
  currentStepId: StepId;
  onOpenHelp?: () => void;
  className?: string;
}

const STEP_TIPS: Record<string, { icon: React.ReactNode; title: string; body: string }> = {
  'personal-identity': {
    icon: <UserCheck className="w-4 h-4 text-[var(--color-saffron-bright)]" aria-hidden="true" />,
    title: 'Passport accuracy matters',
    body: 'Enter your name exactly as it appears on your passport — including middle names or initials. Even a single letter difference can cause delays at immigration.',
  },
  'personal-contact': {
    icon: <MapPin className="w-4 h-4 text-[var(--color-saffron-bright)]" aria-hidden="true" />,
    title: 'Use your current address',
    body: 'Provide the residential address where you currently live, not your workplace. Visa correspondence and notifications are sent to this address.',
  },
  'personal-details': {
    icon: (
      <PlaneTakeoff className="w-4 h-4 text-[var(--color-saffron-bright)]" aria-hidden="true" />
    ),
    title: 'Travel date flexibility',
    body: 'The arrival date you provide should be your earliest planned travel date. e-Visa validity usually starts from the date of issue, not the travel date.',
  },
};

export const FormSidebar: React.FC<FormSidebarProps> = ({
  currentStepId,
  onOpenHelp,
  className = '',
}) => {
  const [isPrivacySheetOpen, setIsPrivacySheetOpen] = useState(false);
  const tip = STEP_TIPS[currentStepId] || STEP_TIPS['personal-identity'];

  return (
    <>
      <aside
        aria-label="Application guidance"
        className={`hidden lg:flex flex-col gap-4 ${className}`}
      >
        {/* Consolidated Security & Privacy Trust Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-4 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <span className="text-sm font-bold text-[var(--color-ink)] block leading-tight">
                Your data is secure
              </span>
              <span className="text-[11px] text-[var(--color-ink-muted)]">
                Local-first privacy principles
              </span>
            </div>
          </div>

          <p className="text-xs text-[var(--color-ink-muted)] text-pretty leading-relaxed">
            All information you enter is stored privately on this device. Nothing is transmitted
            until you complete the final submission step.
          </p>

          {/* Quick Pillar Highlights */}
          <div className="space-y-2 pt-1 border-t border-[var(--color-border)]/60">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[var(--color-surface-subtle)]/60 border border-[var(--color-border-subtle)] text-[11px]">
              <HardDrive className="w-3.5 h-3.5 text-[var(--color-indigo-primary)] dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="text-[var(--color-ink)] font-semibold block">
                  Local Storage Only
                </strong>
                <span className="text-[var(--color-ink-muted)] text-[10px]">
                  Saved privately in browser; never sent unsubmitted.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[var(--color-surface-subtle)]/60 border border-[var(--color-border-subtle)] text-[11px]">
              <EyeOff className="w-3.5 h-3.5 text-[var(--color-indigo-primary)] dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="text-[var(--color-ink)] font-semibold block">
                  Zero 3rd-Party Tracking
                </strong>
                <span className="text-[var(--color-ink-muted)] text-[10px]">
                  No advertising trackers or marketing profiling.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[var(--color-surface-subtle)]/60 border border-[var(--color-border-subtle)] text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-indigo-primary)] dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="text-[var(--color-ink)] font-semibold block">
                  Encrypted Staging
                </strong>
                <span className="text-[var(--color-ink-muted)] text-[10px]">
                  Scans and answers remain isolated on device.
                </span>
              </div>
            </div>
          </div>

          {/* Read Privacy Promise Link */}
          <button
            type="button"
            onClick={() => setIsPrivacySheetOpen(true)}
            className="w-full flex items-center justify-between pt-2 border-t border-[var(--color-border)]/60 text-xs font-semibold text-[var(--color-indigo-primary)] dark:text-blue-400 hover:text-[var(--color-ink)] transition-colors cursor-pointer"
          >
            <span>Read our Privacy Promise</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Contextual Tip */}
        <div className="rounded-2xl border border-[var(--color-saffron-bright)]/25 bg-[var(--color-saffron-50)] dark:bg-[var(--color-saffron-bright)]/10 p-4 space-y-2">
          <div className="flex items-center gap-2">
            {tip.icon}
            <span className="text-xs font-bold text-[var(--color-ink)]">{tip.title}</span>
          </div>
          <p className="text-xs text-[var(--color-ink-muted)] text-pretty leading-relaxed">
            {tip.body}
          </p>
        </div>

        {/* Help Nudge */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-indigo-primary)]/30 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <HelpCircle
            className="w-4 h-4 text-[var(--color-indigo-primary)] dark:text-blue-400 shrink-0"
            aria-hidden="true"
          />
          <span className="font-semibold text-[var(--color-ink)]">Have questions? Open FAQ</span>
          <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
        </button>
      </aside>

      <PrivacyPromiseSheet open={isPrivacySheetOpen} onClose={() => setIsPrivacySheetOpen(false)} />
    </>
  );
};
