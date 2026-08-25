import { SkipLink, AppHeader } from './components/AppShell';
import { DemoWizard } from './features/wizard/demo/DemoWizard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-bg)] text-[var(--color-ink)]">
      <SkipLink />
      <AppHeader />
      <main id="main-content" className="flex-1 w-full max-w-[480px] mx-auto px-4 pt-6 pb-12">
        <h1 className="text-2xl font-semibold text-[var(--color-ink)] mb-4">Visa Application</h1>
        <DemoWizard />
      </main>
      <footer className="py-6 px-4 text-center text-sm text-[var(--color-ink-muted)] border-t border-[var(--color-border)] bg-white mt-auto">
        <p>VisaReThink prototype · Secure client-side processing</p>
      </footer>
    </div>
  );
}
