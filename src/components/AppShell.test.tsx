import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppHeader, SkipLink, FloatingHelpButton } from './AppShell';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => (k === 'app.appName' ? 'VisaReThink' : k),
  }),
}));

vi.mock('./LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="lang-switcher" />,
}));

vi.mock('../features/pwa', () => ({
  InstallPromptBanner: () => <div data-testid="install-banner" />,
  OfflineBanner: () => <div data-testid="offline-banner" />,
}));

describe('AppShell Components', () => {
  it('renders skip link properly', () => {
    render(<SkipLink />);
    expect(screen.getByRole('link', { name: /app.skipToContent/i })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('renders AppHeader with all action buttons when callbacks are provided', () => {
    const handleHelp = vi.fn();
    const handleTracking = vi.fn();
    const handleBackup = vi.fn();
    const handleClearData = vi.fn();

    render(
      <AppHeader
        onOpenHelp={handleHelp}
        onOpenTracking={handleTracking}
        onOpenBackup={handleBackup}
        onOpenClearData={handleClearData}
      />,
    );

    expect(screen.getByText('VisaReThink')).toBeInTheDocument();

    const helpBtn = screen.getByTestId('header-help-btn');
    fireEvent.click(helpBtn);
    expect(handleHelp).toHaveBeenCalledTimes(1);

    const trackBtn = screen.getByTestId('header-track-btn');
    fireEvent.click(trackBtn);
    expect(handleTracking).toHaveBeenCalledTimes(1);

    const backupBtn = screen.getByTestId('header-backup-btn');
    fireEvent.click(backupBtn);
    expect(handleBackup).toHaveBeenCalledTimes(1);

    const clearBtn = screen.getByTestId('header-clear-btn');
    fireEvent.click(clearBtn);
    expect(handleClearData).toHaveBeenCalledTimes(1);
  });

  it('renders FloatingHelpButton and handles clicks', () => {
    const handleClick = vi.fn();
    render(<FloatingHelpButton onClick={handleClick} />);

    const btn = screen.getByTestId('floating-help-btn');
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
