import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Select } from './Select';
import { Field, FieldLabel, FieldError } from './Field';

describe('Select component', () => {
  it('renders options and allows selecting a value', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Field id="country">
        <FieldLabel>Country of Citizenship</FieldLabel>
        <Select defaultValue="">
          <option value="" disabled>
            Select a country
          </option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
        </Select>
      </Field>,
    );

    const select = screen.getByRole('combobox', { name: /country of citizenship/i });
    expect(select).toBeInTheDocument();

    await user.selectOptions(select, 'US');
    expect(select).toHaveValue('US');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('shows error state when invalid', async () => {
    const { container } = render(
      <Field id="country-err" invalid>
        <FieldLabel>Country</FieldLabel>
        <Select>
          <option value="">Choose</option>
        </Select>
        <FieldError>Country selection required</FieldError>
      </Field>,
    );

    const select = screen.getByRole('combobox', { name: /country/i });
    expect(select).toHaveAttribute('aria-invalid', 'true');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
