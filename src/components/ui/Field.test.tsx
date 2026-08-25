import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Field, FieldLabel, FieldHint, FieldError } from './Field';
import { Input } from './Input';

describe('Field component', () => {
  it('wires label, input, hint, and error with automatic IDs', async () => {
    const { container } = render(
      <Field id="test-field" invalid>
        <FieldLabel>Passport Number</FieldLabel>
        <Input />
        <FieldHint>Enter 8 or 9 digits as shown on passport</FieldHint>
        <FieldError>Invalid passport number format</FieldError>
      </Field>,
    );

    const input = screen.getByLabelText(/passport number/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'test-field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-field-hint test-field-error');

    const error = screen.getByRole('status');
    expect(error).toHaveTextContent(/invalid passport number format/i);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders (optional) tag when required is false', async () => {
    const { container } = render(
      <Field id="optional-field" required={false}>
        <FieldLabel>Middle Name</FieldLabel>
        <Input />
      </Field>,
    );

    expect(screen.getByText('(optional)')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
