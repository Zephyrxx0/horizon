import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { DocumentPreviewSheet } from './DocumentPreviewSheet';
import type { DocumentAttachment } from './types';

// Mock storage retrieval
vi.mock('./storage', () => ({
  retrieveStoredDocument: vi.fn(async () => new Blob(['mock image data'], { type: 'image/jpeg' })),
}));

describe('DocumentPreviewSheet Component', () => {
  const mockAttachment: DocumentAttachment = {
    docId: 'doc_passport_123',
    slotId: 'passport',
    fileName: 'passport_bio.jpg',
    originalSize: 2048000,
    compressedSize: 512000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-08-26T12:00:00Z',
  };

  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it('renders image preview, zoom controls, and inspection checklist', async () => {
    const onClose = vi.fn();
    const onReplace = vi.fn();

    render(
      <DocumentPreviewSheet
        isOpen={true}
        onClose={onClose}
        attachment={mockAttachment}
        onReplace={onReplace}
      />,
    );

    expect(screen.getByText('passport_bio.jpg')).toBeDefined();
    expect(screen.getByText('Inspection Checklist:')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByLabelText('Zoom in')).toBeDefined();
    });

    // Check zoom in/out
    fireEvent.click(screen.getByLabelText('Zoom in'));
    expect(screen.getByText('Zoom: 125%')).toBeDefined();

    fireEvent.click(screen.getByLabelText('Reset zoom'));
    expect(screen.getByText('Zoom: 100%')).toBeDefined();

    fireEvent.click(screen.getByText('Done'));
    expect(onClose).toHaveBeenCalled();

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
