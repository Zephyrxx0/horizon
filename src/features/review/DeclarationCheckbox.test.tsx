import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { DeclarationCheckbox } from './DeclarationCheckbox';

describe('DeclarationCheckbox', () => {
  it('renders unchecked checkbox with declaration label', async () => {
    const handleChange = vi.fn();
    const { container } = render(<DeclarationCheckbox checked={false} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(
      screen.getByText(/i declare that all information provided is true/i),
    ).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('triggers onChange callback on toggle', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DeclarationCheckbox checked={false} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('renders error alert when error prop is provided', async () => {
    const { container } = render(
      <DeclarationCheckbox
        checked={false}
        onChange={vi.fn()}
        error="Please confirm the declaration before proceeding."
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      /please confirm the declaration before proceeding/i,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
