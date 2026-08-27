import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, QrCode as QrIcon } from 'lucide-react';
import { Button } from './Button';

export interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  showDownload?: boolean;
}

export function QRCodeGenerator({
  value,
  size = 160,
  className = '',
  title = 'Digital Travel Pass QR Code',
  subtitle = 'Scan at airport biometric e-gates',
  showDownload = true,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#09090b',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      },
      (err) => {
        if (err) {
          setError('Failed to generate QR code');
        } else {
          setError(null);
        }
      },
    );
  }, [value, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `evisa-travel-pass-${Date.now()}.png`;
    a.href = url;
    a.click();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] p-5 shadow-xs flex flex-col items-center text-center space-y-4 ${className}`}
      data-testid="qr-code-generator"
    >
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-[var(--color-ink)] font-semibold text-sm">
          <QrIcon className="w-4 h-4 text-[var(--color-ink-muted)]" aria-hidden="true" />
          <span>{title}</span>
        </div>
        {subtitle && <p className="text-xs text-[var(--color-ink-muted)]">{subtitle}</p>}
      </div>

      <div className="p-2.5 rounded-lg bg-white border border-[var(--color-border)] shadow-2xs">
        {error ? (
          <div className="w-36 h-36 flex items-center justify-center text-xs text-[var(--color-error)] font-medium">
            {error}
          </div>
        ) : (
          <canvas ref={canvasRef} className="block rounded" />
        )}
      </div>

      <div className="w-full text-center">
        <span className="text-[11px] font-mono text-[var(--color-ink-muted)] truncate max-w-[240px] inline-block">
          {value}
        </span>
      </div>

      {showDownload && (
        <div className="flex items-center gap-2 w-full pt-1">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="flex-1 min-h-[36px] py-1.5 text-xs font-medium"
            title="Copy verification link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={handleDownload}
            className="flex-1 min-h-[36px] py-1.5 text-xs font-medium"
            title="Download QR code image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save QR</span>
          </Button>
        </div>
      )}
    </div>
  );
}
