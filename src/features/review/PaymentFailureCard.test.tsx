import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { PaymentFailureCard } from './PaymentFailureCard';

describe('PaymentFailureCard', () => {
  it('renders failure message and action buttons', async () => {
    const handleRetry = vi.fn();
    const handleChangeMethod = vi.fn();

    const { container } = render(
      <PaymentFailureCard
        reason="Insufficient funds in card account."
        onRetry={handleRetry}
        onChangeMethod={handleChangeMethod}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/insufficient funds in card account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry payment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose another method/i })).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('triggers onRetry and onChangeMethod callbacks', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    const handleChangeMethod = vi.fn();

    render(
      <PaymentFailureCard
        reason="Bank declined"
        onRetry={handleRetry}
        onChangeMethod={handleChangeMethod}
      />,
    );

    await user.click(screen.getByRole('button', { name: /retry payment/i }));
    expect(handleRetry).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /choose another method/i }));
    expect(handleChangeMethod).toHaveBeenCalledTimes(1);
  });
});
