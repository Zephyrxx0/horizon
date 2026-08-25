import { useTranslation } from 'react-i18next';
import { SkipLink, AppHeader } from './components/AppShell';
import { DemoWizard } from './features/wizard/demo/DemoWizard';
import { ToastProvider } from './components/ui/Toast';

export default function App() {
  const { t } = useTranslation();

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[var(--color-surface-bg)] text-[var(--color-ink)]">
        <SkipLink />
        <AppHeader />
        <main id="main-content" className="flex-1 w-full max-w-[480px] mx-auto px-4 pt-6 pb-12">
          <h1 className="text-2xl font-semibold text-[var(--color-ink)] mb-4">Visa Application</h1>
          <DemoWizard />
        </main>
        <footer className="py-6 px-4 text-center text-sm text-[var(--color-ink-muted)] border-t border-[var(--color-border)] bg-white mt-auto">
          <p>{t('app.footer')}</p>
        </footer>
      </div>
    </ToastProvider>
  );
}
