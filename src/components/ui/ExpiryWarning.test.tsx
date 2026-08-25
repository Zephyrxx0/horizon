import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ExpiryWarning } from './ExpiryWarning';

describe('ExpiryWarning Component', () => {
  it('renders formatted expiration date and guidance', () => {
    const handleConfirm = vi.fn();
    render(
      <ExpiryWarning expiryDate="2026-11-15" confirmed={false} onConfirmChange={handleConfirm} />,
    );

    expect(screen.getByText(/Passport Validity Alert/i)).toBeInTheDocument();
    expect(screen.getByText(/November 15, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/6 months of remaining validity/i)).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', {
      name: /I understand the 6-month validity requirement/i,
    });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(handleConfirm).toHaveBeenCalledWith(true);
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <ExpiryWarning expiryDate="2026-11-15" confirmed={true} onConfirmChange={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
