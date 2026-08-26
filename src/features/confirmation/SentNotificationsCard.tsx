import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export interface SentNotificationsCardProps {
  referenceNumber: string;
  email?: string;
  phoneNumber?: string;
  applicantName?: string;
  visaType?: string;
  className?: string;
}

export const SentNotificationsCard: React.FC<SentNotificationsCardProps> = ({
  referenceNumber,
  email = 'applicant@example.com',
  phoneNumber = '+919876543210',
  applicantName = 'Applicant',
  visaType = 'Tourist Visa',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      role="region"
      aria-label="Simulated Confirmation Notifications"
      className={`border border-[var(--color-border)] bg-white overflow-hidden ${className}`}
    >
      {/* Header / Disclosure Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="sent-notifications-content"
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-primary)]"
        data-testid="toggle-notifications-disclosure"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-50 text-[var(--color-indigo-primary)] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-ink)]">
              Simulated Email & SMS Notifications
            </h3>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Inspect confirmation copies sent to your phone and inbox
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)]">
          <span className="hidden sm:inline">{isOpen ? 'Hide' : 'View Templates'}</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div
          id="sent-notifications-content"
          className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-slate-50 space-y-4 text-xs"
        >
          {/* SMS Notification Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[var(--color-ink-muted)] font-semibold">
              <span className="flex items-center gap-1.5 text-[var(--color-ink)] font-bold">
                <MessageSquare className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
                <span>Simulated SMS Message</span>
              </span>
              <span>To: {phoneNumber}</span>
            </div>

            <div className="p-3.5 rounded-[var(--radius-card)] bg-white border border-slate-200 shadow-2xs font-mono text-[11px] leading-relaxed text-slate-800 space-y-1">
              <p>
                <strong>[GovVisa]</strong> Dear {applicantName}, your application for {visaType} has
                been received.
              </p>
              <p>
                Reference ID: <strong>{referenceNumber}</strong>. Track anytime at
                https://visarethink.gov.in
              </p>
            </div>
          </div>

          {/* Email Notification Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[var(--color-ink-muted)] font-semibold">
              <span className="flex items-center gap-1.5 text-[var(--color-ink)] font-bold">
                <Mail className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                <span>Simulated Email Confirmation</span>
              </span>
              <span>To: {email}</span>
            </div>

            <div className="p-3.5 rounded-[var(--radius-card)] bg-white border border-slate-200 shadow-2xs text-[11px] leading-relaxed text-slate-800 space-y-2">
              <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <strong className="text-[var(--color-indigo-primary)]">
                  VisaReThink — Official Application Confirmation
                </strong>
                <span className="text-slate-400">noreply@visarethink.gov.in</span>
              </div>
              <p>Hello {applicantName},</p>
              <p>
                Thank you for submitting your visa application through the Reimagined Indian Visa
                Portal. Your application reference ID is <strong>{referenceNumber}</strong>.
              </p>
              <div className="p-2 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                <p>
                  <strong>Next Steps:</strong>
                </p>
                <p>1. Keep your physical documents and checklist ready for the interview.</p>
                <p>2. Consular verification typically takes 1–2 business days.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
