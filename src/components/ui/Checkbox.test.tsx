import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';

describe('Checkbox component', () => {
  it('renders and toggles state on click and spacebar', async () => {
    const user = userEvent.setup();
    const { container } = render(<Checkbox label="I agree to terms and conditions" />);

    const checkbox = screen.getByRole('checkbox', { name: /i agree to terms/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    checkbox.focus();
    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders invalid state with accessibility compliance', async () => {
    const { container } = render(<Checkbox label="Required declaration" invalid />);

    const checkbox = screen.getByRole('checkbox', { name: /required declaration/i });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
