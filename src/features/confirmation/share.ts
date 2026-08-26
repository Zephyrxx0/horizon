/**
 * Multi-channel sharing utilities for application confirmation
 */

export interface ShareResult {
  shared: boolean;
  method: 'native' | 'whatsapp' | 'clipboard';
  error?: string;
}

/**
 * Generates the formatted share text for an application reference.
 */
export function generateShareText(
  referenceNumber: string,
  visaType: string = 'Visa',
  destination: string = 'International',
): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://visarethink.gov.in';
  return `My Indian Visa Application (${visaType} for ${destination}) has been submitted! Reference ID: ${referenceNumber}. Track status at: ${origin}`;
}

/**
 * Generates a direct WhatsApp web/app deep link with pre-filled confirmation text.
 */
export function generateWhatsAppShareUrl(
  referenceNumber: string,
  visaType: string = 'Visa',
  destination: string = 'International',
): string {
  const text = generateShareText(referenceNumber, visaType, destination);
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Copies text to the clipboard with robust fallbacks.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea execCommand fallback
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Shares application confirmation using Web Share API on mobile,
 * falling back to WhatsApp deep-link or clipboard copy.
 */
export async function shareApplicationReference(
  referenceNumber: string,
  visaType: string = 'Visa',
  destination: string = 'International',
): Promise<ShareResult> {
  const shareText = generateShareText(referenceNumber, visaType, destination);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // 1. Try Native Web Share API if available
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'Visa Application Confirmation',
        text: shareText,
        url: shareUrl,
      });
      return { shared: true, method: 'native' };
    } catch (e: unknown) {
      // If user aborted/dismissed the share sheet, return clean result
      if (e instanceof Error && e.name === 'AbortError') {
        return { shared: false, method: 'native', error: 'Share dismissed' };
      }
      // Otherwise fall through to WhatsApp
    }
  }

  // 2. WhatsApp Deep-Link Fallback
  if (typeof window !== 'undefined') {
    const whatsappUrl = generateWhatsAppShareUrl(referenceNumber, visaType, destination);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    return { shared: true, method: 'whatsapp' };
  }

  // 3. Clipboard fallback
  const copied = await copyToClipboard(shareText);
  return { shared: copied, method: 'clipboard' };
}
