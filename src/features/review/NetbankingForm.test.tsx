import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { NetbankingForm } from './NetbankingForm';

describe('NetbankingForm', () => {
  it('renders popular bank buttons and select dropdown', async () => {
    const { container } = render(<NetbankingForm selectedBank="" onBankChange={vi.fn()} />);

    expect(screen.getByText('State Bank of India')).toBeInTheDocument();
    expect(screen.getByText('HDFC Bank')).toBeInTheDocument();
    expect(screen.getByLabelText(/or choose other bank/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('selects bank on quick card click', async () => {
    const user = userEvent.setup();
    const handleBankChange = vi.fn();

    render(<NetbankingForm selectedBank="" onBankChange={handleBankChange} />);

    const sbiBtn = screen.getByRole('button', { name: /state bank of india/i });
    await user.click(sbiBtn);

    expect(handleBankChange).toHaveBeenCalledWith('sbi');
  });
});
