import React, { useMemo } from 'react';
import { useWizardActor } from '../wizard/context';
import { useSelector } from '@xstate/react';
import { ReferenceCard } from './ReferenceCard';
import { StatusTimelineCard } from './StatusTimelineCard';
import { InterviewChecklistCard } from './InterviewChecklistCard';
import { SentNotificationsCard } from './SentNotificationsCard';
import { ReceiptCard } from '../review/ReceiptCard';
import { generateReferenceNumber } from './reference';
import { saveSubmittedApplication } from '../../services/mock/duplicate';
import { Button } from '../../components/ui/Button';
import { RotateCcw, Sparkles } from 'lucide-react';

import type { PaymentReceiptData } from '../review/types';

export interface ConfirmationScreenProps {
  className?: string;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ className = '' }) => {
  const actor = useWizardActor();
  const context = useSelector(actor, (s) => s.context);
  const { answers } = context;
  const receipt =
    (answers.receipt as PaymentReceiptData | undefined) ||
    (context as unknown as { receipt?: PaymentReceiptData }).receipt;

  // Extract applicant details
  const applicantName =
    [answers.firstName || answers.givenNames, answers.lastName || answers.surname]
      .filter(Boolean)
      .join(' ') || 'Applicant';

  const visaType = (answers.visaName as string) || (answers.visaType as string) || 'Tourist Visa';

  const destinationCountry =
    (answers.destinationCountry as string) || (answers.country as string) || 'International';

  const passportNumber = (answers.passportNumber as string) || 'P8765432';
  const email = (answers.email as string) || 'applicant@example.com';
  const phoneNumber = (answers.phoneNumber as string) || '+919876543210';

  // Ensure deterministic reference number
  const referenceNumber = useMemo(() => {
    if (receipt?.referenceNumber) return receipt.referenceNumber;
    if (answers.referenceNumber && typeof answers.referenceNumber === 'string') {
      return answers.referenceNumber;
    }
    const generated = generateReferenceNumber();
    // Persist to local submitted registry
    saveSubmittedApplication({
      referenceNumber: generated,
      passportNumber,
      applicantName,
      visaType,
      country: destinationCountry,
      submittedAt: new Date().toISOString(),
      status: 'Documents Under Review',
    });
    return generated;
  }, [
    receipt?.referenceNumber,
    answers.referenceNumber,
    passportNumber,
    applicantName,
    visaType,
    destinationCountry,
  ]);

  const handleStartNewApplication = () => {
    actor.send({ type: 'RESET' });
  };

  return (
    <div
      role="main"
      aria-label="Application Confirmation Stage"
      className={`max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn ${className}`}
      data-testid="stage5-confirmation-screen"
    >
      {/* 1. Official Reference & Submission Banner */}
      <ReferenceCard
        referenceNumber={referenceNumber}
        applicantName={applicantName}
        visaType={visaType}
        destinationCountry={destinationCountry}
        submittedAt={receipt?.paidAt}
      />

      {/* 2. Official Fee Payment Receipt Card */}
      {receipt && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-[var(--color-indigo-primary)]" aria-hidden="true" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              Payment & Fee Receipt
            </h3>
          </div>
          <ReceiptCard receipt={receipt} />
        </div>
      )}

      {/* 3. Live Status Timeline & Demo Controller */}
      <StatusTimelineCard referenceNumber={referenceNumber} />

      {/* 4. Visa-Specific Preparation & Document Checklist */}
      <InterviewChecklistCard
        referenceNumber={referenceNumber}
        applicantName={applicantName}
        visaType={visaType}
        destinationCountry={destinationCountry}
      />

      {/* 5. Simulated Notifications Preview */}
      <SentNotificationsCard
        referenceNumber={referenceNumber}
        email={email}
        phoneNumber={phoneNumber}
        applicantName={applicantName}
        visaType={visaType}
      />

      {/* 6. Footer Navigation & Reset Action */}
      <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--color-ink-muted)] text-center sm:text-left">
          Need to apply for a family member or another destination?
        </p>

        <Button
          variant="outline"
          onClick={handleStartNewApplication}
          className="w-full sm:w-auto min-h-[48px] px-6 text-sm font-semibold flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-50"
          data-testid="start-new-application-btn"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Start a New Visa Application</span>
        </Button>
      </div>
    </div>
  );
};
