import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { UpiPaymentForm } from './UpiPaymentForm';

describe('UpiPaymentForm', () => {
  it('renders VPA input mode by default and supports suffix clicks', async () => {
    const user = userEvent.setup();
    const handleVpaChange = vi.fn();
    const handleModeChange = vi.fn();

    const { container } = render(
      <UpiPaymentForm
        vpa="testuser"
        mode="vpa"
        totalAmount={8500}
        onVpaChange={handleVpaChange}
        onModeChange={handleModeChange}
      />,
    );

    expect(screen.getByLabelText(/virtual payment address/i)).toBeInTheDocument();
    const suffixBtn = screen.getByRole('button', { name: '@okhdfcbank' });
    await user.click(suffixBtn);

    expect(handleVpaChange).toHaveBeenCalledWith('testuser@okhdfcbank');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders mock QR code mode when mode is qr', async () => {
    const { container } = render(
      <UpiPaymentForm
        vpa=""
        mode="qr"
        totalAmount={8500}
        onVpaChange={vi.fn()}
        onModeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('img', { name: /upi payment qr code/i })).toBeInTheDocument();
    expect(screen.getByText(/scan with any upi app to pay ₹8,500/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
