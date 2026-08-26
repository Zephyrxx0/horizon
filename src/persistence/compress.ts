/**
 * Compresses an image blob client-side to ensure it satisfies maxBytes budget (default 2MiB).
 */
export async function compressToBudget(file: Blob, maxBytes = 2 * 1024 * 1024): Promise<Blob> {
  // If already under budget and is non-image (like PDF), return directly
  if (file.size <= maxBytes && file.type === 'application/pdf') {
    return file;
  }

  let imgBitmap: ImageBitmap;
  try {
    imgBitmap = await createImageBitmap(file);
  } catch {
    // Non-image file or decode failure: return if under budget, else throw
    if (file.size <= maxBytes) {
      return file;
    }
    throw new Error('compress-to-budget-exhausted');
  }

  const origWidth = imgBitmap.width;
  const origHeight = imgBitmap.height;
  let scale = Math.min(1, 2048 / Math.max(origWidth, origHeight));

  const canvas = document.createElement('canvas');

  for (let scaleAttempt = 0; scaleAttempt < 4; scaleAttempt++) {
    const width = Math.max(1, Math.round(origWidth * scale));
    const height = Math.max(1, Math.round(origHeight * scale));

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(imgBitmap, 0, 0, width, height);

    for (let quality = 0.85; quality >= 0.35; quality -= 0.15) {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', quality);
      });

      if (blob && blob.size <= maxBytes) {
        return blob;
      }
    }

    // Downscale by 20% and retry quality loop
    scale *= 0.8;
  }

  throw new Error('compress-to-budget-exhausted');
}
