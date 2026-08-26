import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { PaymentPendingCard } from './PaymentPendingCard';

describe('PaymentPendingCard', () => {
  it('renders pending status and check action', async () => {
    const handleCheck = vi.fn();
    const { container } = render(<PaymentPendingCard onCheckStatus={handleCheck} />);

    expect(screen.getByText(/payment confirmation pending/i)).toBeInTheDocument();
    const checkBtn = screen.getByRole('button', { name: /check status now/i });
    expect(checkBtn).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('calls onCheckStatus on button click', async () => {
    const user = userEvent.setup();
    const handleCheck = vi.fn();
    render(<PaymentPendingCard onCheckStatus={handleCheck} />);

    await user.click(screen.getByRole('button', { name: /check status now/i }));
    expect(handleCheck).toHaveBeenCalledTimes(1);
  });
});
