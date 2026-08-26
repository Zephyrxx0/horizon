import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { copyToClipboard, shareApplicationReference } from './share';
import { CheckCircle2, Copy, Check, Share2, MessageSquare, ShieldCheck } from 'lucide-react';

export interface ReferenceCardProps {
  referenceNumber: string;
  applicantName?: string;
  visaType?: string;
  destinationCountry?: string;
  submittedAt?: string;
  className?: string;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({
  referenceNumber,
  applicantName,
  visaType = 'Tourist Visa',
  destinationCountry = 'International',
  submittedAt,
  className = '',
}) => {
  const { show } = useToast();
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  const handleCopy = async () => {
    const success = await copyToClipboard(referenceNumber);
    if (success) {
      setCopied(true);
      show({
        kind: 'success',
        message: 'Reference number copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async (forceWhatsApp = false) => {
    setIsSharing(true);
    try {
      if (forceWhatsApp) {
        // Direct WhatsApp
        await shareApplicationReference(referenceNumber, visaType, destinationCountry);
      } else {
        // Native or WhatsApp
        await shareApplicationReference(referenceNumber, visaType, destinationCountry);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card
      role="region"
      aria-label="Application Submission Confirmation & Reference"
      className={`border-2 border-[var(--color-success)] bg-[var(--color-surface-card)] overflow-hidden shadow-sm ${className}`}
    >
      {/* Header Banner */}
      <div className="bg-[var(--color-success)]/10 border-b border-[var(--color-success)]/20 p-5 sm:p-6 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)] mb-1">
          <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
          Application Submitted Successfully!
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)] max-w-md mx-auto">
          Your visa application has been received and is now being processed by the consular
          services.
        </p>
      </div>

      {/* Reference Box */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-[var(--radius-card)] p-4 sm:p-5 text-center space-y-1.5">
          <span className="text-xs font-bold tracking-wider text-[var(--color-ink-muted)] uppercase">
            Your Application Reference Number
          </span>
          <div className="flex items-center justify-center gap-2 py-1">
            <span
              className="text-2xl sm:text-3xl font-extrabold font-mono tracking-wide text-[var(--color-success)] select-all"
              data-testid="reference-number-display"
            >
              {referenceNumber}
            </span>
          </div>
          <p className="text-xs text-[var(--color-ink-muted)]">
            Save this 14-character reference number to track your status or contact support.
          </p>
        </div>

        {/* Metadata Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="p-2.5 rounded-[var(--radius-input)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)]">
            <span className="text-[var(--color-ink-muted)] block">Applicant</span>
            <strong className="text-[var(--color-ink)] font-semibold truncate block">
              {applicantName || 'Applicant'}
            </strong>
          </div>
          <div className="p-2.5 rounded-[var(--radius-input)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)]">
            <span className="text-[var(--color-ink-muted)] block">Visa & Destination</span>
            <strong className="text-[var(--color-ink)] font-semibold truncate block">
              {visaType} ({destinationCountry})
            </strong>
          </div>
          <div className="p-2.5 rounded-[var(--radius-input)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] col-span-2 sm:col-span-1">
            <span className="text-[var(--color-ink-muted)] block">Submitted On</span>
            <strong className="text-[var(--color-ink)] font-semibold block">{formattedDate}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex-1 min-h-[48px] font-semibold text-sm flex items-center justify-center gap-2 border-[var(--color-border)] hover:border-[var(--color-border-subtle)]"
            data-testid="copy-reference-btn"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[var(--color-success)]" aria-hidden="true" />
                <span className="text-[var(--color-success)]">Reference Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[var(--color-ink-muted)]" aria-hidden="true" />
                <span>Copy Reference</span>
              </>
            )}
          </Button>

          <Button
            variant="primary"
            onClick={() => handleShare(true)}
            disabled={isSharing}
            className="flex-1 min-h-[48px] font-semibold text-sm flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white border-transparent"
            data-testid="share-whatsapp-btn"
          >
            <MessageSquare className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Share via WhatsApp</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => handleShare(false)}
            disabled={isSharing}
            className="sm:w-auto min-h-[48px] px-4 font-semibold text-sm flex items-center justify-center gap-2"
            data-testid="native-share-btn"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>

        {/* Security & Authenticity Footnote */}
        <div className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)] pt-1 border-t border-[var(--color-border)]">
          <ShieldCheck
            className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0"
            aria-hidden="true"
          />
          <span>
            Official VisaReThink Portal submission • Retain confirmation for embassy entry
          </span>
        </div>
      </div>
    </Card>
  );
};
