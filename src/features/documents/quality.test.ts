import { describe, it, expect } from 'vitest';
import { calculateLaplacianVariance, assessImageQuality, checkPhotoAspectRatio } from './quality';

describe('Quality Assessment Engine', () => {
  it('computes 0 variance for uniform flat grayscale image', () => {
    const size = 10;
    const flat = new Float32Array(size * size).fill(128);
    const variance = calculateLaplacianVariance(flat, size, size);
    expect(variance).toBe(0);
  });

  it('computes high variance for high-frequency sharp edge checkerboard', () => {
    const size = 10;
    const checker = new Float32Array(size * size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        checker[y * size + x] = (x + y) % 2 === 0 ? 255 : 0;
      }
    }
    const variance = calculateLaplacianVariance(checker, size, size);
    expect(variance).toBeGreaterThan(100);
  });

  it('bypasses blur analysis for PDF documents', async () => {
    const pdfBlob = new Blob(['%PDF-1.4 mock content'], { type: 'application/pdf' });
    const result = await assessImageQuality(pdfBlob);
    expect(result.isBlurry).toBe(false);
    expect(result.score).toBe(999);
    expect(result.warnings).toHaveLength(0);
  });

  it('evaluates photo aspect ratios accurately', () => {
    // 350x450 (standard passport) => ratio ~0.78 => compliant
    expect(checkPhotoAspectRatio(350, 450).isCompliant).toBe(true);

    // 400x600 (4x6cm) => ratio ~0.67 => compliant
    expect(checkPhotoAspectRatio(400, 600).isCompliant).toBe(true);

    // 1200x400 (extreme horizontal banner) => ratio 3.0 => non-compliant
    const nonCompliant = checkPhotoAspectRatio(1200, 400);
    expect(nonCompliant.isCompliant).toBe(false);
    expect(nonCompliant.message).toBeDefined();
  });
});
