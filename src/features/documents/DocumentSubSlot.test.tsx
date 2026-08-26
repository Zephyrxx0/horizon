import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { DocumentSubSlot } from './DocumentSubSlot';
import type { DocumentSubSlotDefinition } from './types';

describe('DocumentSubSlot Component', () => {
  const mockSubSlot: DocumentSubSlotDefinition = {
    id: 'passport_bio',
    title: 'Passport Bio Page (Pages 1–2)',
    description: 'Page with photo and MRZ lines.',
    instructions: ['Keep phone flat', 'All 4 corners visible'],
  };

  it('renders sub-slot title and dual upload triggers', async () => {
    const { container } = render(
      <DocumentSubSlot
        parentSlotId="passport"
        subSlot={mockSubSlot}
        onAttachmentChange={vi.fn()}
        onAttachmentRemove={vi.fn()}
      />,
    );

    expect(screen.getByText('Passport Bio Page (Pages 1–2)')).toBeDefined();
    expect(screen.getByText('📷 Take Photo')).toBeDefined();
    expect(screen.getByText('📁 Upload File / PDF')).toBeDefined();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
