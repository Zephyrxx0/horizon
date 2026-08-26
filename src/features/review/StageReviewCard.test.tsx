import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { StageReviewCard } from './StageReviewCard';
import type { DocumentAttachment } from '../documents/types';

describe('StageReviewCard', () => {
  const mockFields = [
    { label: 'Destination', value: 'United States' },
    { label: 'Visa Type', value: 'Tourist Visa (B1/B2)' },
    { label: 'Applicant Name', value: 'Rahul Sharma' },
  ];

  it('renders stage title, badge, fields, and edit button', async () => {
    const handleEdit = vi.fn();
    const { container } = render(
      <StageReviewCard
        stageNumber={1}
        stageTitle="Visa Selection"
        stageSubtitle="Trip destination and visa classification"
        fields={mockFields}
        onEdit={handleEdit}
      />,
    );

    expect(screen.getByText('Stage 1')).toBeInTheDocument();
    expect(screen.getByText('Visa Selection')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();

    const editBtn = screen.getByRole('button', { name: /edit stage 1/i });
    expect(editBtn).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    render(
      <StageReviewCard
        stageNumber={2}
        stageTitle="Personal Details"
        fields={mockFields}
        onEdit={handleEdit}
      />,
    );

    const editBtn = screen.getByRole('button', { name: /edit stage 2/i });
    await user.click(editBtn);
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it('renders document attachments with preview triggers for Stage 3', async () => {
    const mockDocs: Record<string, DocumentAttachment> = {
      passport_bio: {
        docId: 'doc_passport_1',
        slotId: 'passport',
        subSlotId: 'passport_bio',
        fileName: 'passport_bio.jpg',
        originalSize: 2048000,
        compressedSize: 512000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
        isBlurWarning: false,
        isBlurWarningAcknowledged: true,
      },
    };

    const { container } = render(
      <StageReviewCard
        stageNumber={3}
        stageTitle="Document Upload"
        fields={[]}
        documents={mockDocs}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText('passport_bio.jpg')).toBeInTheDocument();
    expect(screen.getByText('500 KB')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();

    const previewBtn = screen.getByRole('button', { name: /preview passport_bio\.jpg/i });
    expect(previewBtn).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
