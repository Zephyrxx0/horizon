import { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Calendar,
  User,
  Plane,
  RotateCcw,
} from 'lucide-react';
import { getSubmittedApplication } from '../../services/mock/duplicate';
import { QRCodeGenerator } from '../../components/ui/QRCodeGenerator';
import { Button } from '../../components/ui/Button';

export function TrackingPage() {
  const [referenceNumber, setReferenceNumber] = useState('IND-2026-84920');
  const [passportNumber, setPassportNumber] = useState('Z9876543');
  const [isSearched, setIsSearched] = useState(true);

  const application = getSubmittedApplication(referenceNumber) || {
    referenceNumber: referenceNumber || 'IND-2026-84920',
    applicantName: 'Priya Patel',
    visaType: 'Tourist / Business e-Visa (1 Year)',
    country: 'United States of America',
    submittedAt: '2026-08-20T10:30:00.000Z',
    status: 'Electronic Travel Authorization (ETA) Granted',
    passportNumber: passportNumber || 'Z9876543',
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (referenceNumber.trim()) {
      setIsSearched(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1.5 border-b border-[var(--color-border)] pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
          Immigration Verification Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-ink)]">
          Official Visa Application Status Tracker
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
          Verify live processing status or download your granted Electronic Travel Authorization
          (ETA).
        </p>
      </div>

      {/* Search Filter Card */}
      <div className="p-5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-2xs">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5 space-y-1">
            <label htmlFor="track-ref" className="text-xs font-medium text-[var(--color-ink)]">
              Application Reference ID
            </label>
            <input
              id="track-ref"
              type="text"
              required
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
              placeholder="e.g. IND-2026-84920"
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs font-mono font-medium text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-primary)]"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label htmlFor="track-pass" className="text-xs font-medium text-[var(--color-ink)]">
              Passport Number
            </label>
            <input
              id="track-pass"
              type="text"
              required
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
              placeholder="e.g. Z9876543"
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs font-mono font-medium text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo-primary)]"
            />
          </div>

          <div className="sm:col-span-3">
            <Button
              type="submit"
              variant="primary"
              className="w-full min-h-[38px] text-xs font-medium py-2 flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Search Status</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {isSearched && (
        <div className="space-y-6">
          {/* Grant Banner Card */}
          <div className="rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ETA Status: GRANTED</span>
                </div>
                <h2 className="text-xl font-bold text-[var(--color-ink)]">
                  Electronic Travel Authorization (ETA) Issued
                </h2>
                <span className="text-xs text-[var(--color-ink-muted)] font-mono">
                  Ref: {application.referenceNumber} • Passport: {application.passportNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="min-h-[36px] py-1 px-3 text-xs font-medium"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={handlePrint}
                  className="min-h-[36px] py-1 px-3 text-xs font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ETA</span>
                </Button>
              </div>
            </div>

            {/* Applicant Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-[var(--color-ink-muted)] flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Applicant Name</span>
                </span>
                <span className="font-semibold text-[var(--color-ink)] block">
                  {application.applicantName}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[var(--color-ink-muted)] flex items-center gap-1">
                  <Plane className="w-3 h-3" />
                  <span>Visa Category</span>
                </span>
                <span className="font-semibold text-[var(--color-ink)] block">
                  {application.visaType}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[var(--color-ink-muted)] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Issue Date</span>
                </span>
                <span className="font-semibold text-[var(--color-ink)] block">20 Aug 2026</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[var(--color-ink-muted)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Validity Expiry</span>
                </span>
                <span className="font-semibold text-[var(--color-ink)] block">19 Aug 2027</span>
              </div>
            </div>

            {/* Timeline & QR Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-[var(--color-border)] items-start">
              {/* Timeline (Left) */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Application Processing Timeline
                </h3>

                <div className="space-y-4 relative pl-5 border-l-2 border-[var(--color-border)] text-xs">
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-surface-card)]" />
                    <span className="font-semibold text-[var(--color-ink)] block">
                      Application Submitted & Fee Received
                    </span>
                    <span className="text-[11px] text-[var(--color-ink-muted)]">
                      20 Aug 2026, 10:30 IST
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-surface-card)]" />
                    <span className="font-semibold text-[var(--color-ink)] block">
                      Biometric & Security Clearance Verified
                    </span>
                    <span className="text-[11px] text-[var(--color-ink-muted)]">
                      21 Aug 2026, 14:15 IST
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-surface-card)]" />
                    <span className="font-semibold text-[var(--color-success)] block">
                      Electronic Travel Authorization (ETA) Granted
                    </span>
                    <span className="text-[11px] text-[var(--color-ink-muted)]">
                      22 Aug 2026, 09:45 IST
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Verification Pass (Right) */}
              <div className="md:col-span-5 flex flex-col items-center">
                <QRCodeGenerator
                  value={`https://indianvisaonline.gov.in/verify?ref=${application.referenceNumber}&pass=${application.passportNumber}`}
                  size={140}
                  title="Biometric QR Pass"
                  subtitle="Scan at immigration entry"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setReferenceNumber('');
                setPassportNumber('');
                setIsSearched(false);
              }}
              className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Search another application</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
