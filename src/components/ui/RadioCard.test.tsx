import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { RadioCardGroup, RadioCard } from './RadioCard';

describe('RadioCard component', () => {
  it('renders radio options and updates selection on change', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <RadioCardGroup legend="Select Visa Category" value="tourist" onChange={onChange}>
        <RadioCard value="tourist" label="Tourist Visa" description="For leisure travel" />
        <RadioCard value="business" label="Business Visa" description="For business activities" />
      </RadioCardGroup>,
    );

    const touristRadio = screen.getByRole('radio', { name: /tourist visa/i });
    const businessRadio = screen.getByRole('radio', { name: /business visa/i });

    expect(touristRadio).toBeChecked();
    expect(businessRadio).not.toBeChecked();

    await user.click(businessRadio);
    expect(onChange).toHaveBeenCalledWith('business');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
