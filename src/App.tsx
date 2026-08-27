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
import { AssistantSheet, FloatingAssistantButton } from './features/assistant';
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
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-bg)] text-[var(--color-ink)] transition-colors duration-150 relative">
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
          <div className="animate-in fade-in duration-150">
            <h1 className="sr-only">Visa Application Journey</h1>

            {/* Full-width Top Progress Bar */}
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-card)] px-6 sm:px-10 xl:px-16 2xl:px-24 py-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ink)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-saffron-bright)] animate-pulse" />
                  <span>e-Visa Application Process</span>
                  <span className="text-[var(--color-ink-muted)] font-normal">|</span>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)] font-medium">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="tabular-nums">
                      ~{minutesRemaining} min · {percent}% completed
                    </span>
                  </div>
                </div>

                <SaveIndicator
                  state={saveState}
                  onClickSaved={() => {
                    setBackupMode('generate');
                    setIsBackupOpen(true);
                  }}
                />
              </div>

              {/* Horizontal Stepper */}
              <ProgressStepper
                steps={stages}
                orientation="horizontal"
                className="w-full max-w-3xl"
              />

              {/* Draft Resumption Banner (if exists) */}
              <ResumeBanner
                onOpenBackupRestore={() => {
                  setBackupMode('restore');
                  setIsBackupOpen(true);
                }}
              />
            </div>

            {/* Full-width Stage Content */}
            <div className="px-6 sm:px-10 xl:px-16 2xl:px-24 py-8 xl:py-10 pb-16 min-h-[600px]">
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

      {/* Footer */}
      <footer className="border-t border-[var(--color-footer-border)] bg-[var(--color-surface-footer)] text-[var(--color-footer-text)] mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            {/* Col 1 */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4 text-[var(--color-saffron-bright)] dark:text-amber-500"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    {[...Array(24)].map((_, i) => (
                      <line
                        key={i}
                        x1="12"
                        y1="12"
                        x2={12 + 10 * Math.cos((i * 15 * Math.PI) / 180)}
                        y2={12 + 10 * Math.sin((i * 15 * Math.PI) / 180)}
                        stroke="currentColor"
                        strokeWidth="0.8"
                      />
                    ))}
                  </svg>
                </div>
                <span className="font-semibold text-white text-sm">
                  e-Visa India • Government of India
                </span>
              </div>
              <p className="text-[var(--color-footer-text-muted)] leading-relaxed max-w-md text-xs">
                Official electronic visa portal managed by the Bureau of Immigration, Ministry of
                Home Affairs and Ministry of External Affairs.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[var(--color-footer-text-muted)]">
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
              <ul className="space-y-1 text-[var(--color-footer-text-muted)]">
                {[
                  { label: 'Portal Home', path: '/' as const },
                  { label: 'Apply for e-Visa', path: '/apply' as const },
                  { label: 'Track Status', path: '/track' as const },
                  { label: 'Guidelines & Photo Specs', path: '/support' as const },
                ].map((link) => (
                  <li key={link.path}>
                    <button
                      type="button"
                      onClick={() => navigate(link.path)}
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
                Official Support
              </span>
              <p className="text-[var(--color-footer-text-muted)]">
                24x7 Tourist Helpline: <br />
                <strong className="text-[var(--color-footer-text)] font-mono">
                  1800-11-1363
                </strong>{' '}
                (Toll Free)
              </p>
              <p className="text-[var(--color-footer-text-muted)]">
                Helpdesk: <br />
                <span className="text-[var(--color-footer-text)] font-mono">
                  indian-evisa@gov.in
                </span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-footer-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-footer-text-muted)]">
            <p>{t('app.footer')}</p>
            <button
              type="button"
              onClick={() => setIsClearDataOpen(true)}
              className="text-[var(--color-footer-text-muted)] hover:text-white hover:underline font-normal cursor-pointer text-[11px] transition-colors"
              data-testid="footer-clear-data-btn"
            >
              Reset & Clear Local Data
            </button>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Trigger (Hidden when window is open) */}
      {!isAssistantOpen && (
        <FloatingAssistantButton
          onClick={() => setIsAssistantOpen(true)}
          isOpen={isAssistantOpen}
        />
      )}

      {/* Floating Help Escape Hatch Button (SUPRT-01) */}
      <FloatingHelpButton onClick={() => setIsHelpOpen(true)} />

      {/* AI Assistant Floating Layer */}
      <AssistantSheet
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentStepId={currentStepId}
      />

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
