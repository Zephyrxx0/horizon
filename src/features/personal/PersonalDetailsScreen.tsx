import React from 'react';
import { useSelector } from '@xstate/react';
import { useWizardActor } from '../wizard/context';
import { IdentityStep } from './IdentityStep';
import { ContactStep } from './ContactStep';
import { VisaSpecificStep } from './VisaSpecificStep';
import { FormSidebar } from './FormSidebar';
import type { StepId } from '../wizard/types';

export interface PersonalDetailsScreenProps {
  className?: string;
  onOpenHelp?: () => void;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({
  className = '',
  onOpenHelp,
}) => {
  const actor = useWizardActor();
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);

  const subSteps: { id: StepId; label: string; number: string }[] = [
    { id: 'personal-identity', label: 'Identity', number: '2a' },
    { id: 'personal-contact', label: 'Contact', number: '2b' },
    { id: 'personal-details', label: 'Trip Specifics', number: '2c' },
  ];

  const currentSubStepIndex = subSteps.findIndex((s) => s.id === currentStepId);

  return (
    <div className={`lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 xl:gap-10 items-start ${className}`}>
      {/* Left: Form Column */}
      <div className="space-y-6 min-w-0">
        {/* Sub-step Pill Navigator (Interactive Tabs) */}
        <nav aria-label="Personal details sub-steps">
          <ol className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs">
            {subSteps.map((sub, idx) => {
              const isCurrent = sub.id === currentStepId;
              const isDone = currentSubStepIndex > idx;

              return (
                <li key={sub.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => actor.send({ type: 'GOTO', stepId: sub.id })}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-medium transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                      isCurrent
                        ? 'bg-[var(--color-indigo-primary)] text-[var(--color-surface-bg)] shadow-sm'
                        : isDone
                          ? 'text-[var(--color-success)] font-semibold hover:bg-[var(--color-surface-subtle)]'
                          : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)]'
                    }`}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Step ${sub.number}: ${sub.label}`}
                  >
                    <span className="font-bold">{sub.number}</span>
                    <span className="hidden sm:inline">{sub.label}</span>
                    {isDone && (
                      <span aria-hidden="true" className="text-[var(--color-success)]">
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Active Sub-step Form */}
        {currentStepId === 'personal-identity' && <IdentityStep />}
        {currentStepId === 'personal-contact' && <ContactStep />}
        {currentStepId === 'personal-details' && <VisaSpecificStep />}
      </div>

      {/* Right: Sticky Sidebar (desktop only) */}
      <FormSidebar
        currentStepId={currentStepId as StepId}
        onOpenHelp={onOpenHelp}
        className="lg:sticky lg:top-24"
      />
    </div>
  );
};
