import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { VisaCard } from './VisaCard';
import { VISA_CATALOG } from './catalog';

describe('VisaCard Component', () => {
  const sampleVisa = VISA_CATALOG[0]; // USA B1/B2

  it('renders visa name, fee breakdown, and document checklist', () => {
    const handleSelect = vi.fn();
    render(
      <VisaCard
        visa={{ ...sampleVisa, isRecommended: true }}
        isSelected={false}
        onSelect={handleSelect}
      />,
    );

    expect(screen.getByText(sampleVisa.name)).toBeInTheDocument();
    expect(screen.getByText(/Recommended for your trip/i)).toBeInTheDocument();
    expect(
      screen.getByText(`₹${sampleVisa.totalCost.toLocaleString('en-IN')}`),
    ).toBeInTheDocument();
    expect(screen.getByText('Required Document Checklist')).toBeInTheDocument();
    expect(screen.getByText('Passport (Pages 1–2)')).toBeInTheDocument();

    const selectButton = screen.getByRole('button', { name: /Select this Visa/i });
    expect(selectButton).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(selectButton);
    expect(handleSelect).toHaveBeenCalledWith(expect.objectContaining({ id: sampleVisa.id }));
  });

  it('shows selected state when isSelected is true', () => {
    render(<VisaCard visa={sampleVisa} isSelected={true} onSelect={() => {}} />);

    const selectButton = screen.getByRole('button', { name: /Selected Visa/i });
    expect(selectButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <VisaCard visa={sampleVisa} isSelected={true} onSelect={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
