import { Check, AlertTriangle } from 'lucide-react';

export type StepStatus = 'complete' | 'current' | 'incomplete' | 'needs-attention';

export interface StepItem {
  id: string;
  label: string;
  status: StepStatus;
}

export interface ProgressStepperProps {
  steps: StepItem[];
  orientation?: 'horizontal' | 'vertical';
  onStepClick?: (step: StepItem, index: number) => void;
  className?: string;
}

export function ProgressStepper({
  steps,
  orientation = 'horizontal',
  onStepClick,
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
            : 'flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-1 lg:gap-3 py-1'
        }`}
      >
        {steps.map((step, idx) => {
          const isCurrent = step.status === 'current';
          const isComplete = step.status === 'complete';
          const isNeedsAttention = step.status === 'needs-attention';
          const isClickable = Boolean(onStepClick);

          const stepBadge = (
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                isCurrent
                  ? 'bg-[var(--color-indigo-primary)] text-[var(--color-surface-bg)] ring-4 ring-[var(--color-indigo-primary)]/15 shadow-xs scale-105'
                  : isComplete
                    ? 'bg-[var(--color-indigo-primary)] text-[var(--color-surface-bg)] group-hover:brightness-110 shadow-2xs'
                    : isNeedsAttention
                      ? 'bg-[var(--color-error)] text-white'
                      : 'border-2 border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-ink-muted)] group-hover:border-[var(--color-ink-muted)]'
              }`}
            >
              {isComplete ? (
                <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
              ) : isNeedsAttention ? (
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
          );

          const stepLabel = (
            <span
              className={`text-xs sm:text-sm whitespace-nowrap transition-colors ${
                isCurrent
                  ? 'font-bold text-[var(--color-ink)]'
                  : isNeedsAttention
                    ? 'font-bold text-[var(--color-error)]'
                    : isComplete
                      ? 'font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-indigo-primary)]'
                      : 'font-medium text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)]'
              }`}
            >
              {step.label}
            </span>
          );

          const content = isClickable ? (
            <button
              type="button"
              onClick={() => onStepClick?.(step, idx)}
              className="flex items-center gap-2.5 w-full md:w-auto group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-indigo-primary)] rounded-lg p-1 transition-all active:scale-[0.98]"
              aria-label={`Go to Step ${idx + 1}: ${step.label} (${step.status})`}
            >
              {stepBadge}
              {stepLabel}
            </button>
          ) : (
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              {stepBadge}
              {stepLabel}
            </div>
          );

          return (
            <li
              key={step.id}
              className={`flex items-center gap-2 ${
                orientation === 'horizontal'
                  ? 'w-full md:w-auto md:flex-1 md:min-w-0 md:last:flex-initial'
                  : ''
              }`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {content}

              {/* Connecting progress track between horizontal steps */}
              {orientation === 'horizontal' && idx < steps.length - 1 && (
                <div
                  className="hidden md:block flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor:
                      idx < currentIndex ? 'var(--color-indigo-primary)' : 'var(--color-border)',
                  }}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
