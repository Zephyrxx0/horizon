import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from './Input';
import { Field, FieldLabel, FieldHint, FieldError } from './Field';

describe('Input component', () => {
  it('renders standalone and accepts text typing', async () => {
    const user = userEvent.setup();
    const { container } = render(<Input aria-label="First Name" placeholder="John" />);

    const input = screen.getByRole('textbox', { name: /first name/i });
    expect(input).toBeInTheDocument();

    await user.type(input, 'Alice');
    expect(input).toHaveValue('Alice');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('integrates with Field and handles error/invalid state', async () => {
    const { container } = render(
      <Field id="email" invalid>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" />
        <FieldHint>We will send updates here</FieldHint>
        <FieldError>Invalid email address</FieldError>
      </Field>,
    );

    const input = screen.getByRole('textbox', { name: /email/i });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-hint email-error');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
