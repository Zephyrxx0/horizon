import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { A11yAnnouncer, announcePolite, announceAssertive } from './A11yAnnouncer';
import i18n from '../i18n';

describe('A11yAnnouncer', () => {
  it('renders polite and assertive live regions with correct ARIA roles', () => {
    render(<A11yAnnouncer />);

    const polite = screen.getByTestId('a11y-polite');
    expect(polite).toHaveAttribute('role', 'status');
    expect(polite).toHaveAttribute('aria-live', 'polite');
    expect(polite).toHaveAttribute('aria-atomic', 'true');

    const assertive = screen.getByTestId('a11y-assertive');
    expect(assertive).toHaveAttribute('aria-live', 'assertive');
    expect(assertive).toHaveAttribute('aria-atomic', 'true');
  });

  it('updates polite message on announcePolite call', () => {
    vi.useFakeTimers();
    render(<A11yAnnouncer />);

    act(() => {
      announcePolite('Navigated to Stage 2: Personal Details');
      vi.advanceTimersByTime(20);
    });

    expect(screen.getByTestId('a11y-polite')).toHaveTextContent(
      'Navigated to Stage 2: Personal Details',
    );
    vi.useRealTimers();
  });

  it('updates assertive message on announceAssertive call', () => {
    vi.useFakeTimers();
    render(<A11yAnnouncer />);

    act(() => {
      announceAssertive('Please correct 3 validation errors in the form.');
      vi.advanceTimersByTime(20);
    });

    expect(screen.getByTestId('a11y-assertive')).toHaveTextContent(
      'Please correct 3 validation errors in the form.',
    );
    vi.useRealTimers();
  });

  it('announces language switches when i18n triggers languageChanged', () => {
    vi.useFakeTimers();
    render(<A11yAnnouncer />);

    act(() => {
      i18n.emit('languageChanged', 'hi');
      vi.advanceTimersByTime(20);
    });

    expect(screen.getByTestId('a11y-polite')).toHaveTextContent(
      'Language changed to हिन्दी (Hindi)',
    );
    vi.useRealTimers();
  });

  it('passes automated axe accessibility checks with no violations', async () => {
    const { container } = render(
      <A11yAnnouncer
        politeMessage="Current step: Visa Selection"
        assertiveMessage="Warning: Expiry date is within 6 months"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
