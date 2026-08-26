import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { PaymentScenarioBar } from './PaymentScenarioBar';
import { getScenarioConfig } from '../../services/mock/scenarios';

describe('PaymentScenarioBar', () => {
  it('renders demo scenario controller with scenario buttons', async () => {
    const { container } = render(<PaymentScenarioBar />);

    expect(screen.getByText(/demo payment scenario controller/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /success/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /card declined/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bank timeout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /network error/i })).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('updates scenario config when a test button is clicked', async () => {
    const user = userEvent.setup();
    const handleScenarioChange = vi.fn();

    render(<PaymentScenarioBar onScenarioChange={handleScenarioChange} />);

    const declinedBtn = screen.getByRole('button', { name: /card declined/i });
    await user.click(declinedBtn);

    expect(handleScenarioChange).toHaveBeenCalledWith('declined');
    expect(getScenarioConfig().overrides.payment).toBe('failure');
    expect(getScenarioConfig().failureCode).toBe('CARD_DECLINED');
  });
});
