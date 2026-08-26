import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@xstate/react';
import { useWizardActor, useSaveState } from './features/wizard/context';
import { deriveStepStatus, deriveProgress } from './features/wizard/selectors';
import { SkipLink, AppHeader, OfflineBanner, FloatingHelpButton } from './components/AppShell';
import { A11yAnnouncer, announcePolite } from './components/A11yAnnouncer';
import { focusHeadingOrFirstElement } from './components/ui/focus';
import { ProgressStepper, type StepStatus } from './components/ui/ProgressStepper';
import { SaveIndicator } from './components/SaveIndicator';
import { ToastProvider, useToast } from './components/ui/Toast';
import { useNetworkStatus } from './features/pwa';
import { ResumeBanner } from './components/ResumeBanner';
import { VisaSelectionScreen } from './features/visa';
import { PersonalDetailsScreen } from './features/personal';
import { DocumentsScreen } from './features/documents';
import { ReviewScreen, EditingBanner } from './features/review';
import { ConfirmationScreen, TrackingModal, DraftBackupModal } from './features/confirmation';
import { FaqSheet } from './features/support';
import { ClearDataModal } from './features/trust';
import { Clock } from 'lucide-react';

const STEP_ANNOUNCEMENTS: Record<string, string> = {
  'visa-selection': 'Navigated to Step 1: Visa Selection',
  'personal-identity': 'Navigated to Step 2: Personal Details — Identity',
  'personal-contact': 'Navigated to Step 2: Personal Details — Contact',
  'personal-details': 'Navigated to Step 2: Personal Details — Trip Specifics',
  documents: 'Navigated to Step 3: Documents Upload',
  'review-payment': 'Navigated to Step 4: Review and Payment',
  confirmation: 'Navigated to Step 5: Application Confirmation',
};

function NetworkSyncHandler() {
  const { show } = useToast();
  useNetworkStatus({
    onReconnect: () => {
      show({
        kind: 'success',
        message: '🌐 Connection restored — cloud draft synced',
      });
    },
  });
  return null;
}

export default function App() {
  const { t } = useTranslation();
  const actor = useWizardActor();
  const saveState = useSaveState();

  const answers = useSelector(actor, (s) => s.context.answers);
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);

  // Modal Dialog States
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isClearDataOpen, setIsClearDataOpen] = useState(false);
  const [backupMode, setBackupMode] = useState<'generate' | 'restore'>('generate');

  // Announce step change to assistive technology and shift focus to top heading (D-15 / A11Y-02)
  useEffect(() => {
    const msg = STEP_ANNOUNCEMENTS[currentStepId] || `Navigated to ${currentStepId}`;
    announcePolite(msg);
    const timer = setTimeout(() => {
      focusHeadingOrFirstElement();
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStepId]);

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
      <NetworkSyncHandler />
      <div className="min-h-screen flex flex-col bg-[var(--color-surface-bg)] text-[var(--color-ink)]">
        <SkipLink />
        <A11yAnnouncer />
        <AppHeader
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenTracking={() => setIsTrackingOpen(true)}
          onOpenBackup={() => {
            setBackupMode('generate');
            setIsBackupOpen(true);
          }}
          onOpenClearData={() => setIsClearDataOpen(true)}
        />
        <OfflineBanner />
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

        <footer className="py-6 px-4 text-center text-sm text-[var(--color-ink-muted)] border-t border-[var(--color-border)] bg-white mt-auto space-y-2">
          <p>{t('app.footer')}</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setIsClearDataOpen(true)}
              className="text-rose-600 hover:text-rose-700 hover:underline font-medium cursor-pointer"
              data-testid="footer-clear-data-btn"
            >
              Shared / Cyber-Café Computer? Reset & Clear Local Data
            </button>
          </div>
        </footer>

        {/* Floating Help Escape Hatch Button (SUPRT-01) */}
        <FloatingHelpButton onClick={() => setIsHelpOpen(true)} />

        {/* Global Standalone Modals */}
        <FaqSheet open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

        <TrackingModal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />

        <DraftBackupModal
          isOpen={isBackupOpen}
          onClose={() => setIsBackupOpen(false)}
          initialMode={backupMode}
        />

        <ClearDataModal
          isOpen={isClearDataOpen}
          onClose={() => setIsClearDataOpen(false)}
          onOpenBackup={() => {
            setBackupMode('generate');
            setIsBackupOpen(true);
          }}
          onCleared={() => {
            actor.send({ type: 'RESET' });
          }}
        />
      </div>
    </ToastProvider>
  );
}
