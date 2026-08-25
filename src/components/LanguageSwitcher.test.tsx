import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { LanguageSwitcher } from './LanguageSwitcher';
import i18n, { changeLocale } from '../i18n';

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    await changeLocale('en');
  });

  it('renders all six language options in native script', () => {
    render(<LanguageSwitcher />);
    const select = screen.getByRole('combobox', { name: /select language/i });
    expect(select).toBeInTheDocument();

    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'हिन्दी' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'தமிழ்' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'తెలుగు' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'ಕನ್ನಡ' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'मराठी' })).toBeInTheDocument();
  });

  it('switches locale, updates documentElement.lang, and displays pending notice', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const select = screen.getByRole('combobox', { name: /select language/i });
    await user.selectOptions(select, 'hi');

    expect(document.documentElement.lang).toBe('hi');
    expect(
      screen.getByText(/Hindi translation is coming soon. The app is showing English for now./i),
    ).toBeInTheDocument();

    // Switch back to English
    await user.selectOptions(select, 'en');
    expect(document.documentElement.lang).toBe('en');
    expect(screen.queryByText(/Hindi translation is coming soon/i)).not.toBeInTheDocument();
  });

  it('rejects unlisted locale strings safely without breaking', async () => {
    await changeLocale('invalid_code');
    expect(i18n.language).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('passes automated axe accessibility checks', async () => {
    const { container } = render(<LanguageSwitcher />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
