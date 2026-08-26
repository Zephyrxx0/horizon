import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@xstate/react';
import { useWizardActor, useSaveState } from './features/wizard/context';
import { deriveStepStatus, deriveProgress } from './features/wizard/selectors';
import { SkipLink, AppHeader } from './components/AppShell';
import { ProgressStepper, type StepStatus } from './components/ui/ProgressStepper';
import { SaveIndicator } from './components/SaveIndicator';
import { ToastProvider } from './components/ui/Toast';
import { ResumeBanner } from './components/ResumeBanner';
import { VisaSelectionScreen } from './features/visa';
import { PersonalDetailsScreen } from './features/personal';
import { DocumentsScreen } from './features/documents';
import { ReviewScreen, EditingBanner } from './features/review';
import { ConfirmationScreen, TrackingModal, DraftBackupModal } from './features/confirmation';
import { Clock } from 'lucide-react';

export default function App() {
  const { t } = useTranslation();
  const actor = useWizardActor();
  const saveState = useSaveState();

  const answers = useSelector(actor, (s) => s.context.answers);
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);

  // Modal Dialog States
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [backupMode, setBackupMode] = useState<'generate' | 'restore'>('generate');

  // Derive progress & time remaining
  const { percent, minutesRemaining } = deriveProgress(answers);

  // Top-level 5-stage progress representation
  const isStage2Active =
    currentStepId === 'personal-identity' ||
    currentStepId === 'personal-contact' ||
    currentStepId === 'personal-details';

  const stage2Status: StepStatus = isStage2Active
    ? 'current'
    : deriveStepStatus('personal-details', answers);

  const stages = [
    {
      id: 'stage-1',
      label: 'Visa Selection',
      status: deriveStepStatus('visa-selection', answers, currentStepId),
    },
    {
      id: 'stage-2',
      label: 'Personal Details',
      status: stage2Status,
    },
    {
      id: 'stage-3',
      label: 'Documents',
      status: deriveStepStatus('documents', answers, currentStepId),
    },
    {
      id: 'stage-4',
      label: 'Review & Pay',
      status: deriveStepStatus('review-payment', answers, currentStepId),
    },
    {
      id: 'stage-5',
      label: 'Confirmation',
      status: deriveStepStatus('confirmation', answers, currentStepId),
    },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[var(--color-surface-bg)] text-[var(--color-ink)]">
        <SkipLink />
        <AppHeader
          onOpenTracking={() => setIsTrackingOpen(true)}
          onOpenBackup={() => {
            setBackupMode('generate');
            setIsBackupOpen(true);
          }}
        />
        <EditingBanner />

        <main
          id="main-content"
          className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 sm:pt-6 pb-16 space-y-6"
        >
          <h1 className="sr-only">Visa Application Journey</h1>

          {/* Top Progress Bar & Save Indicator */}
          <div className="flex flex-col gap-2 border-b border-[var(--color-border)] pb-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-muted)]">
                <Clock
                  className="w-3.5 h-3.5 text-[var(--color-indigo-primary)]"
                  aria-hidden="true"
                />
                <span>
                  ~{minutesRemaining} min remaining • {percent}% completed
                </span>
              </div>
              <SaveIndicator
                state={saveState}
                onClickSaved={() => {
                  setBackupMode('generate');
                  setIsBackupOpen(true);
                }}
              />
            </div>
            <ProgressStepper steps={stages} className="w-full" />
          </div>

          {/* Draft Resumption Banner (STATE-04) */}
          <ResumeBanner
            onOpenBackupRestore={() => {
              setBackupMode('restore');
              setIsBackupOpen(true);
            }}
          />

          {/* Active Stage Screen */}
          {currentStepId === 'visa-selection' && <VisaSelectionScreen />}

          {(currentStepId === 'personal-identity' ||
            currentStepId === 'personal-contact' ||
            currentStepId === 'personal-details') && <PersonalDetailsScreen />}

          {currentStepId === 'documents' && <DocumentsScreen />}

          {currentStepId === 'review-payment' && <ReviewScreen />}

          {currentStepId === 'confirmation' && <ConfirmationScreen />}
        </main>

        <footer className="py-6 px-4 text-center text-sm text-[var(--color-ink-muted)] border-t border-[var(--color-border)] bg-white mt-auto">
          <p>{t('app.footer')}</p>
        </footer>

        {/* Global Standalone Modals */}
        <TrackingModal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />

        <DraftBackupModal
          isOpen={isBackupOpen}
          onClose={() => setIsBackupOpen(false)}
          initialMode={backupMode}
        />
      </div>
    </ToastProvider>
  );
}
