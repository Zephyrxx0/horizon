import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
  CheckCircle2,
  Clock,
  Circle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  FileSearch,
} from 'lucide-react';

export interface TimelineNode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'action-required' | 'upcoming';
  nextAction?: string;
}

export interface StatusTimelineCardProps {
  referenceNumber?: string;
  className?: string;
}

const DEFAULT_STAGES: TimelineNode[] = [
  {
    id: 'stage-received',
    title: 'Application Received & Logged',
    description: 'Application files and payment received in consular registry.',
    date: 'Today',
    duration: 'Immediate',
    status: 'completed',
    nextAction: 'Automated document verification initiated.',
  },
  {
    id: 'stage-review',
    title: 'Documents Under Consular Review',
    description: 'Consular officer reviewing passport scans and financial proofs.',
    date: 'Expected in 1–2 business days',
    duration: '1–2 days',
    status: 'in-progress',
    nextAction: 'Keep your phone accessible for verification calls.',
  },
  {
    id: 'stage-interview',
    title: 'Interview & Biometrics Appointment',
    description: 'Slot booking and consular interview preparation.',
    date: 'Expected in 3–5 business days',
    duration: '2–3 days',
    status: 'upcoming',
    nextAction: 'Download and pack interview documents checklist.',
  },
  {
    id: 'stage-decision',
    title: 'Visa Decision & Passport Dispatch',
    description: 'Final visa stamping and secure courier dispatch.',
    date: 'Expected in 5–7 business days',
    duration: '1–2 days',
    status: 'upcoming',
    nextAction: 'Track courier airway bill number upon dispatch.',
  },
];

export const StatusTimelineCard: React.FC<StatusTimelineCardProps> = ({
  referenceNumber,
  className = '',
}) => {
  const { show } = useToast();
  const [stages, setStages] = useState<TimelineNode[]>(DEFAULT_STAGES);
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // 1 = Documents Under Review

  const handleAdvanceStatus = () => {
    if (currentStepIndex < stages.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const updated = stages.map((stage, idx) => {
        if (idx < nextIndex) {
          return { ...stage, status: 'completed' as const };
        }
        if (idx === nextIndex) {
          return { ...stage, status: 'in-progress' as const };
        }
        return { ...stage, status: 'upcoming' as const };
      });

      setStages(updated);
      setCurrentStepIndex(nextIndex);
      show({
        kind: 'info',
        message: `Application moved to: ${updated[nextIndex].title}`,
      });
    } else {
      // Completed all
      handleSimulateApproval();
    }
  };

  const handleSimulateInfoRequest = () => {
    const updated = stages.map((stage, idx) => {
      if (idx === currentStepIndex) {
        return {
          ...stage,
          status: 'action-required' as const,
          nextAction: 'Action Needed: Please re-upload clearer utility bill scan.',
        };
      }
      return stage;
    });

    setStages(updated);
    show({
      kind: 'error',
      message: 'Consulate requested additional document clarification.',
    });
  };

  const handleSimulateApproval = () => {
    const updated = stages.map((stage) => ({
      ...stage,
      status: 'completed' as const,
      date: 'Completed',
    }));
    setStages(updated);
    setCurrentStepIndex(stages.length);
    show({
      kind: 'success',
      message: 'Visa Approved! Application approved and passport stamped for dispatch.',
    });
  };

  const handleResetTimeline = () => {
    setStages(DEFAULT_STAGES);
    setCurrentStepIndex(1);
    show({
      kind: 'info',
      message: 'Timeline reset to initial submission state.',
    });
  };

  return (
    <Card
      role="region"
      aria-label="Application Status Timeline"
      className={`p-5 sm:p-6 bg-white space-y-6 ${className}`}
    >
      {/* Title */}
      <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-indigo-primary)]" aria-hidden="true" />
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-ink)]">
              Live Status Timeline
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
            Estimated total processing time: <strong>5–7 business days</strong>
          </p>
        </div>

        {referenceNumber && (
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold hidden sm:inline">
            {referenceNumber}
          </span>
        )}
      </div>

      {/* Vertical Timeline Nodes */}
      <div className="space-y-6 relative pl-2 sm:pl-3" aria-live="polite">
        {stages.map((stage, index) => {
          const isCompleted = stage.status === 'completed';
          const isInProgress = stage.status === 'in-progress';
          const isActionRequired = stage.status === 'action-required';
          const isUpcoming = stage.status === 'upcoming';
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="relative flex items-start gap-4">
              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`absolute left-[15px] top-[30px] bottom-[-24px] w-0.5 ${
                    isCompleted ? 'bg-[var(--color-green-success,#166534)]' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Node Icon */}
              <div className="shrink-0 z-10" aria-hidden="true">
                {isCompleted && (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-green-success,#166534)] text-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                )}
                {isInProgress && (
                  <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-[var(--color-indigo-primary)] text-[var(--color-indigo-primary)] flex items-center justify-center animate-pulse">
                    <Circle className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  </div>
                )}
                {isActionRequired && (
                  <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-600 text-amber-800 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  </div>
                )}
                {isUpcoming && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Stage Content */}
              <div className="flex-1 space-y-1 pt-0.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h3
                    className={`text-sm sm:text-base font-bold ${
                      isUpcoming ? 'text-[var(--color-ink-muted)]' : 'text-[var(--color-ink)]'
                    }`}
                  >
                    {stage.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-green-100 text-green-800'
                        : isInProgress
                          ? 'bg-blue-100 text-blue-800'
                          : isActionRequired
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {stage.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  {stage.description}
                </p>

                {stage.nextAction && (
                  <div
                    className={`mt-2 p-2.5 rounded-[var(--radius-input)] text-xs flex items-start gap-2 ${
                      isActionRequired
                        ? 'bg-amber-50 border border-amber-300 text-amber-900 font-semibold'
                        : isInProgress
                          ? 'bg-blue-50 border border-blue-200 text-blue-900'
                          : 'bg-slate-50 text-[var(--color-ink-muted)]'
                    }`}
                  >
                    <FileSearch className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{stage.nextAction}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Demo Scenario Controller (TRCK-02) */}
      <div className="mt-6 pt-4 border-t border-dashed border-[var(--color-border)] bg-slate-50 p-4 rounded-[var(--radius-card)] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-indigo-primary)]">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Demo Timeline Controller (TRCK-02)</span>
          </div>
          <button
            type="button"
            onClick={handleResetTimeline}
            className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        <p className="text-xs text-[var(--color-ink-muted)]">
          Simulate the multi-day consulate verification process and test live alerts:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            variant="outline"
            onClick={handleAdvanceStatus}
            className="min-h-[40px] py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 bg-white"
            data-testid="demo-advance-btn"
          >
            <Play className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            <span>[Advance Status]</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleSimulateInfoRequest}
            className="min-h-[40px] py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 bg-white text-amber-800 border-amber-300 hover:bg-amber-50"
            data-testid="demo-info-request-btn"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>[Simulate Info Request]</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleSimulateApproval}
            className="min-h-[40px] py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 bg-white text-green-800 border-green-300 hover:bg-green-50"
            data-testid="demo-approval-btn"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
            <span>[Simulate Approval]</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
