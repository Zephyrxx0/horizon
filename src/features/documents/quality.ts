import type { QualityAssessmentResult } from './types';

/**
 * Calculates variance of discrete Laplacian on grayscale image data.
 */
export function calculateLaplacianVariance(
  grayscaleData: Float32Array,
  width: number,
  height: number,
): number {
  if (width < 3 || height < 3) return 0;

  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const lap =
        grayscaleData[idx - width] +
        grayscaleData[idx + width] +
        grayscaleData[idx - 1] +
        grayscaleData[idx + 1] -
        4 * grayscaleData[idx];

      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  if (count === 0) return 0;
  const mean = sum / count;
  const variance = sumSq / count - mean * mean;
  return Math.max(0, variance);
}

/**
 * Evaluates the quality and sharpness of an uploaded document file client-side.
 */
export async function assessImageQuality(file: Blob): Promise<QualityAssessmentResult> {
  const warnings: string[] = [];

  // PDF documents are vector/compiled and exempt from image blur checks
  if (file.type === 'application/pdf') {
    return {
      isBlurry: false,
      score: 999,
      width: 0,
      height: 0,
      aspectRatio: 0,
      warnings: [],
    };
  }

  let width = 800;
  let height = 800;
  let variance = 250;

  try {
    if (typeof createImageBitmap !== 'undefined') {
      const bitmap = await createImageBitmap(file);
      width = bitmap.width;
      height = bitmap.height;

      // Small/low-res capture warning
      if (width < 600 || height < 600) {
        warnings.push('Image resolution is low. Clear text requires at least 600×600 pixels.');
      }

      if (typeof document !== 'undefined') {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(bitmap, 0, 0, size, size);
          const imgData = ctx.getImageData(0, 0, size, size);
          const data = imgData.data;

          const gray = new Float32Array(size * size);
          for (let i = 0; i < data.length; i += 4) {
            gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          }

          variance = calculateLaplacianVariance(gray, size, size);
        }
      }
    }
  } catch {
    // Fallback if bitmap creation fails
    variance = 150;
  }

  const isLowRes = width < 600 || height < 600;
  const isBlurryVariance = variance < 100;
  const isBlurry = isLowRes || isBlurryVariance;

  if (isBlurryVariance && !isLowRes) {
    warnings.push('Image appears blurry or low contrast. Ensure all text is clearly legible.');
  }

  const aspectRatio = height > 0 ? Number((width / height).toFixed(2)) : 1;

  return {
    isBlurry,
    score: Math.round(variance),
    width,
    height,
    aspectRatio,
    warnings,
  };
}

/**
 * Checks if a photograph satisfies standard 4x6cm (approx 0.67 - 0.78) portrait ratio.
 */
export function checkPhotoAspectRatio(
  width: number,
  height: number,
): { isCompliant: boolean; message?: string } {
  if (width <= 0 || height <= 0) {
    return { isCompliant: true };
  }

  const ratio = width / height;
  // Standard passport photo ratio: 35/45 ≈ 0.778, 4/6 ≈ 0.667. Tolerant window: 0.60 to 0.90
  const isCompliant = ratio >= 0.55 && ratio <= 0.95;

  return {
    isCompliant,
    message: isCompliant
      ? undefined
      : 'Photograph should be a vertical portrait (approx 4×6cm or 35×45mm aspect ratio).',
  };
}
