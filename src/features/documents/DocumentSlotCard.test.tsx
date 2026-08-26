import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { DocumentSlotCard } from './DocumentSlotCard';
import { ALL_DOCUMENT_SLOTS } from './requirements';

describe('DocumentSlotCard Component', () => {
  it('renders single slot card (photo) with instructions and upload triggers', async () => {
    const { container } = render(
      <DocumentSlotCard
        slot={ALL_DOCUMENT_SLOTS.photo}
        onAttachmentChange={vi.fn()}
        onAttachmentRemove={vi.fn()}
        onOpenSampleGuide={vi.fn()}
      />,
    );

    expect(screen.getByText('Recent Passport Photograph (4×6cm)')).toBeDefined();
    expect(screen.getByText('Required')).toBeDefined();
    expect(screen.getByText('View sample & tips')).toBeDefined();
    expect(screen.getByText('📷 Take Photo')).toBeDefined();
    expect(screen.getByText('📁 Upload File / PDF')).toBeDefined();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders multi-part sub-slots for passport', async () => {
    const { container } = render(
      <DocumentSlotCard
        slot={ALL_DOCUMENT_SLOTS.passport}
        onAttachmentChange={vi.fn()}
        onAttachmentRemove={vi.fn()}
      />,
    );

    expect(screen.getByText('Indian Passport (Front & Back)')).toBeDefined();
    expect(screen.getByText('Passport Bio Page (Pages 1–2)')).toBeDefined();
    expect(screen.getByText('Passport Address Page (Pages 35–36)')).toBeDefined();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
