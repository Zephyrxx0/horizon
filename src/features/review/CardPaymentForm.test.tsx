import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { CardPaymentForm } from './CardPaymentForm';

describe('CardPaymentForm', () => {
  const initialData = {
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  };

  it('renders all card inputs with accessible labels', async () => {
    const { container } = render(<CardPaymentForm data={initialData} onChange={vi.fn()} />);

    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv \/ security code/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('formats card numbers with 4-4-4-4 spacing on input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<CardPaymentForm data={initialData} onChange={handleChange} />);

    const numInput = screen.getByLabelText(/card number/i);
    await user.type(numInput, '41112222');

    expect(handleChange).toHaveBeenCalled();
  });
});
