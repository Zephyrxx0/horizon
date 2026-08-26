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
import { RouterProvider, useRouter } from './router/Router';
import { LandingPage } from './features/landing/LandingPage';
import { TrackingPage } from './features/tracking/TrackingPage';
import { DesignSystemPage } from './features/design-system/DesignSystemPage';
import { SupportPage } from './features/support/SupportPage';
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

function MainContent() {
  const { t } = useTranslation();
  const actor = useWizardActor();
  const saveState = useSaveState();
  const { currentRoute, navigate } = useRouter();

  const answers = useSelector(actor, (s) => s.context.answers);
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);

  // Modal Dialog States
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isClearDataOpen, setIsClearDataOpen] = useState(false);
  const [backupMode, setBackupMode] = useState<'generate' | 'restore'>('generate');

  // Route determination
  const showLanding = currentRoute === '/' && currentStepId === 'visa-selection';
  const showTracking = currentRoute === '/track';
  const showDesignSystem = currentRoute === '/design-system';
  const showSupport = currentRoute === '/support' || currentRoute === '/faq';
  const showWizard =
    currentRoute === '/apply' ||
    (!showLanding && !showTracking && !showDesignSystem && !showSupport);

  // Announce step change to assistive technology and shift focus to top heading
  useEffect(() => {
    if (showWizard) {
      const msg = STEP_ANNOUNCEMENTS[currentStepId] || `Navigated to ${currentStepId}`;
      announcePolite(msg);
      const timer = setTimeout(() => {
        focusHeadingOrFirstElement();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentStepId, showWizard]);

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
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-bg)] text-[var(--color-ink)] transition-colors duration-150">
      <SkipLink />
      <A11yAnnouncer />
      <AppHeader
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenTracking={() => {
          navigate('/track');
          setIsTrackingOpen(true);
        }}
        onOpenBackup={() => {
          setBackupMode('generate');
          setIsBackupOpen(true);
        }}
        onOpenClearData={() => setIsClearDataOpen(true)}
      />
      <OfflineBanner />
      <EditingBanner />

      <main id="main-content" className="flex-1 w-full">
        {/* ROUTE 1: Dedicated Tracking Page */}
        {showTracking && <TrackingPage />}

        {/* ROUTE 2: Design System Showcase */}
        {showDesignSystem && <DesignSystemPage />}

        {/* ROUTE 3: Guidelines & Support */}
        {showSupport && <SupportPage />}

        {/* ROUTE 4: Landing Page */}
        {showLanding && <LandingPage />}

        {/* ROUTE 5: Application Wizard Portal */}
        {showWizard && (
          <div className="max-w-3xl mx-auto px-4 pt-4 sm:pt-8 pb-16 space-y-6 animate-in fade-in duration-150">
            <h1 className="sr-only">Visa Application Journey</h1>

            {/* Top Progress Bar & Save Indicator */}
            <div className="flex flex-col gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                  <span className="tabular-nums">
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
            <div className="bg-white dark:bg-zinc-900 p-4 sm:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
              {currentStepId === 'visa-selection' && <VisaSelectionScreen />}

              {(currentStepId === 'personal-identity' ||
                currentStepId === 'personal-contact' ||
                currentStepId === 'personal-details') && <PersonalDetailsScreen />}

              {currentStepId === 'documents' && <DocumentsScreen />}

              {currentStepId === 'review-payment' && <ReviewScreen />}

              {currentStepId === 'confirmation' && <ConfirmationScreen />}
            </div>
          </div>
        )}
      </main>

      {/* Authoritative Minimalist Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-300 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            {/* Col 1 */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs">
                  🇮🇳
                </div>
                <span className="font-semibold text-white text-sm">
                  e-Visa India • Government of India
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed max-w-md text-xs">
                Official electronic visa portal managed by the Bureau of Immigration, Ministry of
                Home Affairs and Ministry of External Affairs.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span>TLS 1.3 256-Bit Encrypted</span>
                <span>•</span>
                <span>Digital India</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
                Quick Navigation
              </span>
              <ul className="space-y-1 text-zinc-400">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="hover:text-white cursor-pointer"
                  >
                    Portal Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/apply')}
                    className="hover:text-white cursor-pointer"
                  >
                    Apply for e-Visa
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/track')}
                    className="hover:text-white cursor-pointer"
                  >
                    Track Status & Verification
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/support')}
                    className="hover:text-white cursor-pointer"
                  >
                    Guidelines & Photo Specs
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/design-system')}
                    className="hover:text-white cursor-pointer"
                  >
                    Design System
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
                Official Support
              </span>
              <p className="text-zinc-400">
                24x7 Tourist Helpline: <br />
                <strong className="text-zinc-100 font-mono">1800-11-1363</strong> (Toll Free)
              </p>
              <p className="text-zinc-400">
                Helpdesk: <br />
                <span className="text-zinc-300 font-mono">indian-evisa@gov.in</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <p>{t('app.footer')}</p>
            <button
              type="button"
              onClick={() => setIsClearDataOpen(true)}
              className="text-zinc-400 hover:text-zinc-200 hover:underline font-normal cursor-pointer text-[11px]"
              data-testid="footer-clear-data-btn"
            >
              Reset & Clear Local Data
            </button>
          </div>
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
  );
}

export default function App() {
  return (
    <RouterProvider>
      <ToastProvider>
        <NetworkSyncHandler />
        <MainContent />
      </ToastProvider>
    </RouterProvider>
  );
}
