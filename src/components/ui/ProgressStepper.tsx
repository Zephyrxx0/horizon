import { CheckCircle2, AlertTriangle, Circle } from 'lucide-react';

export type StepStatus = 'complete' | 'current' | 'incomplete' | 'needs-attention';

export interface StepItem {
  id: string;
  label: string;
  status: StepStatus;
}

export interface ProgressStepperProps {
  steps: StepItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ProgressStepper({
  steps,
  orientation = 'horizontal',
  className = '',
}: ProgressStepperProps) {
  const currentIndex = steps.findIndex((s) => s.status === 'current');
  const currentStep = steps[currentIndex] || steps[0];

  return (
    <nav aria-label="Progress" className={`w-full ${className}`}>
      {/* Polite live region for screen-reader step change announcement */}
      <div role="status" aria-live="polite" className="sr-only">
        {currentStep
          ? `Step ${currentIndex >= 0 ? currentIndex + 1 : 1} of ${steps.length}: ${currentStep.label}`
          : ''}
      </div>

      <ol
        className={`flex ${
          orientation === 'vertical'
            ? 'flex-col gap-4'
            : 'flex-row items-center justify-between gap-2 overflow-x-auto py-2'
        }`}
      >
        {steps.map((step, idx) => {
          const isCurrent = step.status === 'current';
          const isComplete = step.status === 'complete';
          const isNeedsAttention = step.status === 'needs-attention';

          return (
            <li
              key={step.id}
              className={`flex items-center gap-2.5 ${orientation === 'horizontal' ? 'flex-1 min-w-0' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0">
                {isComplete && (
                  <CheckCircle2
                    className="w-6 h-6 text-[var(--color-indigo-primary)]"
                    aria-hidden="true"
                  />
                )}
                {isCurrent && (
                  <div className="w-7 h-7 rounded-full bg-[var(--color-indigo-primary)] text-[var(--color-saffron-bright)] flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </div>
                )}
                {isNeedsAttention && (
                  <AlertTriangle
                    className="w-6 h-6 text-[var(--color-saffron-deep)]"
                    aria-hidden="true"
                  />
                )}
                {step.status === 'incomplete' && (
                  <Circle
                    className="w-6 h-6 text-[var(--color-ink-muted)] opacity-40"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className={`text-sm truncate ${
                  isCurrent
                    ? 'font-semibold text-[var(--color-ink)]'
                    : isNeedsAttention
                      ? 'font-semibold text-[var(--color-saffron-deep)]'
                      : isComplete
                        ? 'font-medium text-[var(--color-ink)]'
                        : 'text-[var(--color-ink-muted)]'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
