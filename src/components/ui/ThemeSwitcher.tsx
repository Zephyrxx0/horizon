import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
}

function syncDomTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.add('theme-transition');

  root.classList.remove('dark');
  root.removeAttribute('data-theme');

  if (mode === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
  }

  setTimeout(() => {
    root.classList.remove('theme-transition');
  }, 200);
}

export function ThemeSwitcher({ className = '', variant = 'compact' }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('horizon-theme') as ThemeMode | null;
    if (saved === 'contrast') return 'light'; // Clean migration
    return (saved as ThemeMode) || 'light';
  });

  useEffect(() => {
    syncDomTheme(theme);
  }, [theme]);

  const applyTheme = (mode: ThemeMode) => {
    localStorage.setItem('horizon-theme', mode);
    setTheme(mode);
  };

  const cycleTheme = () => {
    const nextMode: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    applyTheme(nextMode[theme] || 'light');
  };

  if (variant === 'full') {
    return (
      <div
        className={`inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 gap-0.5 ${className}`}
        role="radiogroup"
        aria-label="Color Theme Selection"
      >
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'light'}
          onClick={() => applyTheme('light')}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            theme === 'light'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'dark'}
          onClick={() => applyTheme('dark')}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            theme === 'dark'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'system'}
          onClick={() => applyTheme('system')}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            theme === 'system'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>System</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={`min-h-[36px] min-w-[36px] p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 ${className}`}
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
      data-testid="theme-switcher-btn"
    >
      {theme === 'light' && <Sun className="w-4 h-4" aria-hidden="true" />}
      {theme === 'dark' && <Moon className="w-4 h-4" aria-hidden="true" />}
      {theme === 'system' && <Monitor className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
}
