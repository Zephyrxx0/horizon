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
        {/* LanguageSwitcher slot for Plan 06 */}
      </div>
    </header>
  );
}
