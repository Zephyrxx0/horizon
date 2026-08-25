export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-indigo-primary)] focus:text-white focus:rounded-md focus:shadow-md focus:outline-none"
    >
      Skip to main content
    </a>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b border-[var(--color-border)] px-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-[var(--color-indigo-primary)] font-semibold text-lg tracking-tight">
          VisaReThink
        </span>
      </div>
      <div id="header-actions" className="flex items-center gap-2">
        {/* LanguageSwitcher placeholder for Plan 06 */}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-bg)] text-[var(--color-ink)]">
      <SkipLink />
      <AppHeader />
      <main id="main-content" className="flex-1 w-full max-w-[480px] mx-auto px-4 pt-8 pb-12">
        <h1 className="text-2xl font-semibold mb-4 text-[var(--color-ink)]">
          Your application starts here
        </h1>
        <p className="text-[var(--color-ink-muted)] text-base leading-relaxed">
          Answer at your own pace. Everything you enter is saved automatically on this device —
          leave any time and pick up where you stopped.
        </p>
      </main>
      <footer className="py-6 px-4 text-center text-sm text-[var(--color-ink-muted)] border-t border-[var(--color-border)] bg-white mt-auto">
        <p>VisaReThink prototype · Secure client-side processing</p>
      </footer>
    </div>
  );
}
