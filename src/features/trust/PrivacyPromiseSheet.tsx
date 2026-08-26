import React from 'react';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, HardDrive, EyeOff, FileText, Monitor, Check } from 'lucide-react';
import type { PrivacySection } from './types';

export interface PrivacyPromiseSheetProps {
  open: boolean;
  onClose: () => void;
}

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'local-storage',
    title: '1. Local-First Data Isolation',
    content: [
      'Your personal information, passport numbers, and contact details are stored strictly within your local browser storage (HTML5 localStorage).',
      'Unsubmitted drafts are never transmitted to external analytics servers, marketing databases, or third parties.',
    ],
    tips: [
      'Drafts remain on this specific device and browser until final submission or explicit wipe.',
    ],
  },
  {
    id: 'zero-sharing',
    title: '2. Zero Third-Party Tracking or Ads',
    content: [
      'VisaReThink operates with zero tracking pixels, no advertising beacons, and no behavioral profiling cookies.',
      'We do not sell, rent, or trade your travel intents, demographic data, or personal details to any commercial entities.',
    ],
  },
  {
    id: 'document-security',
    title: '3. Encrypted Client-Side Document Staging',
    content: [
      'Uploaded passport scans, photos, and itinerary PDFs are held in isolated IndexedDB object stores on your device.',
      'Document validation (e.g. format verification, size checks) is performed locally on your device without premature upload.',
    ],
  },
  {
    id: 'shared-device',
    title: '4. Shared Computer & Cyber-Café Protection',
    content: [
      'If you are completing your visa application on a shared computer, internet kiosk, or cyber-café, your draft remains in that browser unless cleared.',
      'We strongly advise generating a Draft Backup Code and clicking "Reset / Clear Data" before ending your shared session.',
    ],
    tips: [
      'Use the "Reset / Clear Data" button in the header or footer when using public terminals.',
    ],
  },
];

export const PrivacyPromiseSheet: React.FC<PrivacyPromiseSheetProps> = ({ open, onClose }) => {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Our Privacy & Data Protection Promise"
      description="Clear, transparent guarantees on how your personal data and documents are handled."
    >
      <div className="space-y-6 pt-2" data-testid="privacy-promise-content">
        {/* Quick Reassurance Banner */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm">
            <span className="font-bold block text-emerald-950">
              Government-Grade Client-Side Privacy
            </span>
            <span>
              Your draft never leaves your browser until you review every field and authorize
              submission.
            </span>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4">
          {PRIVACY_SECTIONS.map((section) => (
            <div
              key={section.id}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] space-y-2"
            >
              <h3 className="text-sm font-bold text-[var(--color-ink)] flex items-center gap-2">
                {section.id === 'local-storage' && (
                  <HardDrive className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0" />
                )}
                {section.id === 'zero-sharing' && (
                  <EyeOff className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0" />
                )}
                {section.id === 'document-security' && (
                  <FileText className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0" />
                )}
                {section.id === 'shared-device' && (
                  <Monitor className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0" />
                )}
                <span>{section.title}</span>
              </h3>

              {section.content.map((paragraph, idx) => (
                <p key={idx} className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {section.tips && section.tips.length > 0 && (
                <div className="pt-1.5 space-y-1">
                  {section.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs font-medium text-emerald-800"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            className="w-full min-h-[44px] text-sm font-semibold"
          >
            I Understand My Privacy Guarantees
          </Button>
        </div>
      </div>
    </Sheet>
  );
};
