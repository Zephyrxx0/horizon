import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GovtBadge } from './GovtBadge';

describe('GovtBadge Component', () => {
  it('renders emblem badge with official title', () => {
    render(<GovtBadge variant="emblem" />);
    expect(screen.getByText(/Government of India • e-Visa Official Portal/)).toBeDefined();
  });

  it('renders security badge with encryption text', () => {
    render(<GovtBadge variant="security" />);
    expect(screen.getByText(/256-Bit TLS Encrypted/)).toBeDefined();
  });

  it('renders fast-track badge', () => {
    render(<GovtBadge variant="fast-track" />);
    expect(screen.getByText(/Avg. 72h Fast-Track Processing/)).toBeDefined();
  });
});
