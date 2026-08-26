import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { JargonTooltip } from './JargonTooltip';

describe('JargonTooltip', () => {
  it('renders trigger button and toggles popover with plain-language explanation and diagram', async () => {
    const { container } = render(<JargonTooltip jargonKey="givenNameVsSurname" />);

    const trigger = screen.getByRole('button', { name: /Help: given name and surname/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // Open popover
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    expect(screen.getByText(/Given Name refers to your first name/i)).toBeInTheDocument();
    expect(screen.getByText(/Example:/i)).toBeInTheDocument();
    expect(screen.getByTestId('passport-diagram-container')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Close via close button
    const closeBtn = screen.getByRole('button', { name: /Close explanation/i });
    fireEvent.click(closeBtn);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('passport-diagram-container')).not.toBeInTheDocument();
  });

  it('closes on Escape key press', () => {
    render(<JargonTooltip jargonKey="cvv" />);

    const trigger = screen.getByRole('button', { name: /Help: card security code/i });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports custom title, explanation, example, and ariaLabel', () => {
    render(
      <JargonTooltip
        ariaLabel="Explain Custom Term"
        title="Custom Term"
        explanation="Custom explanation text"
        example="Custom example text"
      />,
    );

    const trigger = screen.getByRole('button', { name: /Explain Custom Term/i });
    fireEvent.click(trigger);

    expect(screen.getByText('Custom Term')).toBeInTheDocument();
    expect(screen.getByText('Custom explanation text')).toBeInTheDocument();
    expect(screen.getByText('Custom example text')).toBeInTheDocument();
  });
});
