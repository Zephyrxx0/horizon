import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from './Button';

describe('Button component', () => {
  it('renders primary, secondary, and destructive variants', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <Button variant="primary" onClick={onClick}>
          Continue
        </Button>
        <Button variant="secondary">Back</Button>
        <Button variant="destructive">Delete</Button>
      </div>,
    );

    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(continueBtn).toBeInTheDocument();

    await user.click(continueBtn);
    expect(onClick).toHaveBeenCalledTimes(1);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('displays loading state with spinner while keeping label in document', async () => {
    const { container } = render(<Button loading>Save changes</Button>);

    const btn = screen.getByRole('button', { name: /save changes/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('aria-disabled', 'true');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('disables interactions when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Button disabled onClick={onClick}>
        Submit
      </Button>,
    );

    const btn = screen.getByRole('button', { name: /submit/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');

    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
