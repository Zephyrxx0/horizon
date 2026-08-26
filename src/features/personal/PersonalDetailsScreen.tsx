import React from 'react';
import { useSelector } from '@xstate/react';
import { useWizardActor } from '../wizard/context';
import { IdentityStep } from './IdentityStep';
import { ContactStep } from './ContactStep';
import { VisaSpecificStep } from './VisaSpecificStep';
import { PrivacyTrustCard } from '../trust';
import type { StepId } from '../wizard/types';

export interface PersonalDetailsScreenProps {
  className?: string;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ className = '' }) => {
  const actor = useWizardActor();
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);

  const subSteps: { id: StepId; label: string; number: string }[] = [
    { id: 'personal-identity', label: 'Identity', number: '2a' },
    { id: 'personal-contact', label: 'Contact', number: '2b' },
    { id: 'personal-details', label: 'Trip Specifics', number: '2c' },
  ];

  const currentSubStepIndex = subSteps.findIndex((s) => s.id === currentStepId);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Sub-step Pill Navigator */}
      <nav aria-label="Personal details sub-steps" className="max-w-xl mx-auto">
        <ol className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs">
          {subSteps.map((sub, idx) => {
            const isCurrent = sub.id === currentStepId;
            const isDone = currentSubStepIndex > idx;

            return (
              <li
                key={sub.id}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-medium transition-colors ${
                  isCurrent
                    ? 'bg-[var(--color-indigo-primary)] text-white shadow-sm'
                    : isDone
                      ? 'text-[var(--color-success)] font-semibold'
                      : 'text-[var(--color-ink-muted)]'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="font-bold">{sub.number}</span>
                <span className="hidden sm:inline">{sub.label}</span>
                {isDone && <span aria-hidden="true">✓</span>}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Pre-flight Privacy Trust Card on Initial Identity Sub-step (D-05 / TRUST-01) */}
      {currentStepId === 'personal-identity' && <PrivacyTrustCard className="max-w-xl mx-auto" />}

      {/* Active Sub-step Form */}
      {currentStepId === 'personal-identity' && <IdentityStep />}
      {currentStepId === 'personal-contact' && <ContactStep />}
      {currentStepId === 'personal-details' && <VisaSpecificStep />}
    </div>
  );
};
