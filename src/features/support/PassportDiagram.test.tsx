import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { PassportDiagram } from './PassportDiagram';

describe('PassportDiagram', () => {
  it('renders SVG illustration with accessible label and specimen details', async () => {
    const { container } = render(<PassportDiagram />);

    const svg = screen.getByRole('img', {
      name: /Indian Passport Biographical Page Data Zones Diagram/i,
    });
    expect(svg).toBeInTheDocument();
    expect(screen.getByText(/SPECIMEN/i)).toBeInTheDocument();
    expect(screen.getByTestId('zone-names')).toBeInTheDocument();
    expect(screen.getByTestId('zone-passport-number')).toBeInTheDocument();
    expect(screen.getByTestId('zone-dates')).toBeInTheDocument();
    expect(screen.getByTestId('zone-place-of-issue')).toBeInTheDocument();
    expect(screen.getByTestId('zone-mrz')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders specific highlight zone properly', () => {
    render(<PassportDiagram highlightZone="names" />);
    const zone = screen.getByTestId('zone-names');
    expect(zone).toBeInTheDocument();
  });
});
