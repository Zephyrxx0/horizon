import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Card } from './Card';

describe('Card component', () => {
  it('renders static default card with accessible content', async () => {
    const { container } = render(
      <Card>
        <h3 className="text-lg font-semibold">Important Information</h3>
        <p>Your details are protected under data privacy standards.</p>
      </Card>,
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Important Information');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles click and key events for interactive variant', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Card variant="interactive" onClick={onClick}>
        <span>Clickable Option</span>
      </Card>,
    );

    const card = screen.getByRole('button', { name: /clickable option/i });
    expect(card).toBeInTheDocument();

    await user.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);

    card.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
