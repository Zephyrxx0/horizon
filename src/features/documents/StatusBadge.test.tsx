import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { StatusBadge } from './StatusBadge';
import type { DocumentAttachment } from './types';

describe('StatusBadge Component', () => {
  const mockAttachment: DocumentAttachment = {
    docId: 'doc_123',
    slotId: 'photo',
    fileName: 'passport_photo.jpg',
    originalSize: 2048000,
    compressedSize: 512000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-08-26T12:00:00Z',
  };

  it('renders optimizing state with accessible busy indicator', async () => {
    const { container } = render(<StatusBadge status="optimizing" />);
    expect(screen.getByText('Optimizing image…')).toBeDefined();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders error state with retry action', async () => {
    const onReplace = vi.fn();
    const { container } = render(
      <StatusBadge
        status="error"
        errorMessage="File format not supported."
        onReplace={onReplace}
      />,
    );
    expect(screen.getByText('File format not supported.')).toBeDefined();
    fireEvent.click(screen.getByText('Retry'));
    expect(onReplace).toHaveBeenCalledTimes(1);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders ready state with formatted size and action buttons', async () => {
    const onInspect = vi.fn();
    const onReplace = vi.fn();
    const onRemove = vi.fn();

    const { container } = render(
      <StatusBadge
        status="ready"
        attachment={mockAttachment}
        onInspect={onInspect}
        onReplace={onReplace}
        onRemove={onRemove}
      />,
    );

    expect(screen.getByText('passport_photo.jpg')).toBeDefined();
    expect(screen.getByText(/✓ Ready • 500 KB/)).toBeDefined();

    fireEvent.click(screen.getByLabelText('Preview passport_photo.jpg'));
    expect(onInspect).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Replace passport_photo.jpg'));
    expect(onReplace).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Remove passport_photo.jpg'));
    expect(onRemove).toHaveBeenCalledTimes(1);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
