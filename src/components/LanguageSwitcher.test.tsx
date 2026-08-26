import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { LanguageSwitcher } from './LanguageSwitcher';
import i18n, { changeLocale, LOCALES } from '../i18n';

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

  it('switches locale and updates documentElement.lang and localStorage', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const select = screen.getByRole('combobox', { name: /select language/i });

    for (const locale of LOCALES) {
      await user.selectOptions(select, locale.code);
      await waitFor(
        () => {
          expect(document.documentElement.lang).toBe(locale.code);
          expect(window.localStorage.getItem('visarethink.locale')).toBe(locale.code);
        },
        { timeout: 3000 },
      );
    }
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
