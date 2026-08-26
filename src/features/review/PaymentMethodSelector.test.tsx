import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { PaymentMethodSelector } from './PaymentMethodSelector';

describe('PaymentMethodSelector', () => {
  it('renders UPI, Card, and Netbanking radio options', async () => {
    const { container } = render(<PaymentMethodSelector value="" onChange={vi.fn()} />);

    expect(screen.getByText(/select payment method/i)).toBeInTheDocument();
    expect(screen.getByText(/upi \(google pay, phonepe/i)).toBeInTheDocument();
    expect(screen.getByText(/credit \/ debit card/i)).toBeInTheDocument();
    expect(screen.getByText(/netbanking/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('calls onChange when a payment option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<PaymentMethodSelector value="upi" onChange={handleChange} />);

    const cardRadio = screen.getByRole('radio', { name: /credit \/ debit card/i });
    await user.click(cardRadio);

    expect(handleChange).toHaveBeenCalledWith('card');
  });
});
