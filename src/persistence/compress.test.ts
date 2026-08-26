import { describe, it, expect, vi } from 'vitest';
import { compressToBudget } from './compress';

describe('compressToBudget', () => {
  it('returns non-image PDF directly when under budget', async () => {
    const smallPdf = new Blob(['%PDF-1.4 sample content'], { type: 'application/pdf' });
    const result = await compressToBudget(smallPdf, 1024 * 1024);
    expect(result).toBe(smallPdf);
  });

  it('throws compress-to-budget-exhausted when non-image exceeds budget', async () => {
    const largeNonImage = new Blob([new Uint8Array(3 * 1024 * 1024)], { type: 'application/pdf' });
    await expect(compressToBudget(largeNonImage, 2 * 1024 * 1024)).rejects.toThrow(
      'compress-to-budget-exhausted',
    );
  });

  it('compresses images and stops when output is under maxBytes', async () => {
    // Mock createImageBitmap
    const mockBitmap = {
      width: 3000,
      height: 2000,
      close: vi.fn(),
    } as unknown as ImageBitmap;

    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(mockBitmap));

    // Mock HTMLCanvasElement
    const originalCreateElement = document.createElement.bind(document);
    let toBlobCallCount = 0;

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => ({
            clearRect: vi.fn(),
            drawImage: vi.fn(),
          }),
          toBlob: (cb: (b: Blob | null) => void) => {
            toBlobCallCount++;
            // Return 1MB blob on second try
            const size = toBlobCallCount === 1 ? 3 * 1024 * 1024 : 1024 * 1024;
            cb(new Blob([new Uint8Array(size)], { type: 'image/jpeg' }));
          },
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const inputBlob = new Blob(['mock-image-data'], { type: 'image/jpeg' });
    const outputBlob = await compressToBudget(inputBlob, 2 * 1024 * 1024);

    expect(outputBlob).toBeInstanceOf(Blob);
    expect(outputBlob.size).toBeLessThanOrEqual(2 * 1024 * 1024);

    vi.restoreAllMocks();
  });
});
