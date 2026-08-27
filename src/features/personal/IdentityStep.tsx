import React, { useState } from 'react';
import { useWizardActor } from '../wizard/context';
import { useSelector } from '@xstate/react';
import {
  Field,
  FieldLabel,
  FieldHint,
  FieldError,
  Input,
  Select,
  Button,
  ErrorSummary,
  ExpiryWarning,
  type ErrorSummaryItem,
} from '../../components/ui';
import { formatPassportNumber } from '../wizard/formatters';
import {
  validateIdentityStep,
  getPassportExpiryStatus,
  isValidPassport,
  isValidIsoDate,
} from '../wizard/validators';
import { checkForDuplicateApplication } from '../../services/mock/duplicate';
import { DuplicateWarningCard } from '../confirmation/DuplicateWarningCard';
import { TrackingModal } from '../confirmation/TrackingModal';
import { JargonTooltip } from '../support';
import { ArrowLeft, ChevronRight, UserCheck } from 'lucide-react';

export interface IdentityStepProps {
  className?: string;
}

export const IdentityStep: React.FC<IdentityStepProps> = ({ className = '' }) => {
  const actor = useWizardActor();
  const answers = useSelector(actor, (s) => s.context.answers);

  const firstName = (answers.firstName as string) || '';
  const lastName = (answers.lastName as string) || '';
  const dateOfBirth = (answers.dateOfBirth as string) || '';
  const gender = (answers.gender as string) || '';
  const nationality = (answers.nationality as string) || 'India';
  const passportNumber = (answers.passportNumber as string) || '';
  const passportIssueDate = (answers.passportIssueDate as string) || '';
  const passportExpiryDate = (answers.passportExpiryDate as string) || '';
  const passportExpiryConfirmed = Boolean(answers.passportExpiryConfirmed);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  const [duplicateDismissed, setDuplicateDismissed] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedTrackingRef, setSelectedTrackingRef] = useState<string>('');

  // Expiry check
  const expiryStatus = passportExpiryDate ? getPassportExpiryStatus(passportExpiryDate) : null;
  const showExpiryWarning = Boolean(expiryStatus?.isNearExpiry);

  // Duplicate passport check
  const duplicateCheck = checkForDuplicateApplication(passportNumber);
  const showDuplicateWarning = Boolean(
    duplicateCheck.isDuplicate && duplicateCheck.record && !duplicateDismissed,
  );

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field: string, value: unknown) => {
    actor.send({ type: 'ANSWER_CHANGED', fieldId: field, value });
  };

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPassportNumber(e.target.value);
    setDuplicateDismissed(false);
    actor.send({ type: 'ANSWER_CHANGED', fieldId: 'passportNumber', value: formatted });
  };

  const handleContinue = () => {
    const currentAnswers = {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      passportNumber,
      passportIssueDate,
      passportExpiryDate,
      passportExpiryConfirmed,
    };

    const validationErrors = validateIdentityStep(currentAnswers);
    const errorKeys = Object.keys(validationErrors);

    if (errorKeys.length > 0) {
      setTouched({
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        nationality: true,
        passportNumber: true,
        passportIssueDate: true,
        passportExpiryDate: true,
        passportExpiryConfirmed: true,
      });

      setErrors(
        errorKeys.map((key) => ({
          fieldId: key,
          label:
            key === 'firstName'
              ? 'First Name'
              : key === 'lastName'
                ? 'Last Name'
                : key === 'dateOfBirth'
                  ? 'Date of Birth'
                  : key === 'gender'
                    ? 'Gender'
                    : key === 'nationality'
                      ? 'Nationality'
                      : key === 'passportNumber'
                        ? 'Passport Number'
                        : key === 'passportIssueDate'
                          ? 'Date of Issue'
                          : key === 'passportExpiryDate'
                            ? 'Date of Expiry'
                            : 'Validity Confirmation',
          message: validationErrors[key],
        })),
      );
      return;
    }

    setErrors([]);
    actor.send({
      type: 'ANSWERS_BATCHED',
      answers: currentAnswers,
    });
    actor.send({ type: 'NEXT' });
  };

  const handleBack = () => {
    actor.send({ type: 'BACK' });
  };

  const isFirstNameValid = touched.firstName && firstName.trim().length > 0;
  const isLastNameValid = touched.lastName && lastName.trim().length > 0;
  const isDobValid = touched.dateOfBirth && isValidIsoDate(dateOfBirth);
  const isGenderValid = touched.gender && gender.length > 0;
  const isNatValid = touched.nationality && nationality.trim().length > 0;
  const isPassportValid = touched.passportNumber && isValidPassport(passportNumber);
  const isIssueValid = touched.passportIssueDate && isValidIsoDate(passportIssueDate);
  const isExpiryValid =
    touched.passportExpiryDate &&
    isValidIsoDate(passportExpiryDate) &&
    Boolean(expiryStatus?.isValid) &&
    (!showExpiryWarning || passportExpiryConfirmed);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Error Summary */}
      {errors.length > 0 && <ErrorSummary errors={errors} />}

      {/* Sub-step Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-indigo-primary)]">
          <UserCheck className="w-4 h-4" aria-hidden="true" />
          <span>Stage 2a of 5 • Identity & Passport</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
          Identity & Passport Details
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Enter your personal and passport information exactly as it appears on your official travel
          document.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="firstName"
            invalid={touched.firstName && !firstName.trim()}
            isValid={isFirstNameValid}
          >
            <FieldLabel tooltip={<JargonTooltip jargonKey="givenNameVsSurname" />}>
              First / Given Name
            </FieldLabel>
            <Input
              value={firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="e.g. Rahul"
              autoComplete="given-name"
            />
            {touched.firstName && !firstName.trim() && (
              <FieldError>First name is required as on passport.</FieldError>
            )}
          </Field>

          <Field
            id="lastName"
            invalid={touched.lastName && !lastName.trim()}
            isValid={isLastNameValid}
          >
            <FieldLabel tooltip={<JargonTooltip jargonKey="givenNameVsSurname" />}>
              Last Name / Surname
            </FieldLabel>
            <Input
              value={lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="e.g. Sharma"
              autoComplete="family-name"
            />
            {touched.lastName && !lastName.trim() && (
              <FieldError>Last name is required as on passport.</FieldError>
            )}
          </Field>
        </div>

        {/* DOB & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            id="dateOfBirth"
            invalid={touched.dateOfBirth && !isValidIsoDate(dateOfBirth)}
            isValid={isDobValid}
          >
            <FieldLabel>Date of Birth</FieldLabel>
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
            />
            {touched.dateOfBirth && !isValidIsoDate(dateOfBirth) && (
              <FieldError>Valid date of birth is required.</FieldError>
            )}
          </Field>

          <Field id="gender" invalid={touched.gender && !gender} isValid={isGenderValid}>
            <FieldLabel>Gender</FieldLabel>
            <Select
              value={gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              onBlur={() => handleBlur('gender')}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Transgender</option>
            </Select>
            {touched.gender && !gender && <FieldError>Please select your gender.</FieldError>}
          </Field>
        </div>

        {/* Nationality (Smart Default) */}
        <Field
          id="nationality"
          invalid={touched.nationality && !nationality.trim()}
          isValid={isNatValid}
        >
          <FieldLabel>Nationality</FieldLabel>
          <Input
            value={nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            onBlur={() => handleBlur('nationality')}
            placeholder="e.g. India"
          />
          <FieldHint>Smart pre-filled for Indian passport holders.</FieldHint>
          {touched.nationality && !nationality.trim() && (
            <FieldError>Nationality is required.</FieldError>
          )}
        </Field>

        {/* ── Passport Details Section ── */}
        <div className="pt-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] shrink-0">
              Passport Details
            </span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]/40 p-4 space-y-4">
            {/* Passport Number with Auto-formatting */}
            <Field
              id="passportNumber"
              invalid={touched.passportNumber && !isValidPassport(passportNumber)}
              isValid={isPassportValid}
            >
              <FieldLabel
                tooltip={
                  <JargonTooltip
                    ariaLabel="Help: passport document format"
                    jargonKey="givenNameVsSurname"
                    diagramZone="passportNumber"
                    title="Passport Number Zone"
                    explanation="Your 8 or 9 digit passport number is printed in the upper right corner of your bio-data page and stamped along the edge."
                  />
                }
              >
                Passport Number
              </FieldLabel>
              <Input
                value={passportNumber}
                onChange={handlePassportChange}
                onBlur={() => handleBlur('passportNumber')}
                placeholder="AA1234567"
                maxLength={9}
                className="uppercase tracking-widest font-mono font-semibold"
              />
              <FieldHint>2 letters followed by 7 numbers (e.g. AA1234567).</FieldHint>
              {touched.passportNumber && !isValidPassport(passportNumber) && (
                <FieldError>
                  Passport must start with 2 letters and 7 digits (e.g. AA1234567).
                </FieldError>
              )}
            </Field>

            {/* Duplicate Application Warning Card */}
            {showDuplicateWarning && duplicateCheck.record && (
              <DuplicateWarningCard
                record={duplicateCheck.record}
                onTrackExisting={(ref) => {
                  setSelectedTrackingRef(ref);
                  setIsTrackingOpen(true);
                }}
                onDismiss={() => setDuplicateDismissed(true)}
              />
            )}

            {/* Issue Date & Expiry Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="passportIssueDate"
                invalid={touched.passportIssueDate && !isValidIsoDate(passportIssueDate)}
                isValid={isIssueValid}
              >
                <FieldLabel
                  tooltip={<JargonTooltip jargonKey="dateOfIssueVsExpiry" diagramZone="dates" />}
                >
                  Date of Issue
                </FieldLabel>
                <Input
                  type="date"
                  value={passportIssueDate}
                  onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                  onBlur={() => handleBlur('passportIssueDate')}
                />
                {touched.passportIssueDate && !isValidIsoDate(passportIssueDate) && (
                  <FieldError>Date of issue is required.</FieldError>
                )}
              </Field>

              <Field
                id="passportExpiryDate"
                invalid={
                  touched.passportExpiryDate &&
                  (!isValidIsoDate(passportExpiryDate) || Boolean(expiryStatus?.isExpired))
                }
                isValid={isExpiryValid}
              >
                <FieldLabel
                  tooltip={<JargonTooltip jargonKey="dateOfIssueVsExpiry" diagramZone="dates" />}
                >
                  Date of Expiry
                </FieldLabel>
                <Input
                  type="date"
                  value={passportExpiryDate}
                  onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                  onBlur={() => handleBlur('passportExpiryDate')}
                />
                {touched.passportExpiryDate && !isValidIsoDate(passportExpiryDate) && (
                  <FieldError>Date of expiry is required.</FieldError>
                )}
                {touched.passportExpiryDate && expiryStatus?.isExpired && (
                  <FieldError>{expiryStatus.message}</FieldError>
                )}
              </Field>
            </div>

            {/* Contextual Expiry Warning if <6 months */}
            {showExpiryWarning && (
              <div id="passportExpiryConfirmed">
                <ExpiryWarning
                  expiryDate={passportExpiryDate}
                  confirmed={passportExpiryConfirmed}
                  onConfirmChange={(val) => handleInputChange('passportExpiryConfirmed', val)}
                />
              </div>
            )}

            {/* Single consolidated privacy note */}
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 pt-1">
              <span aria-hidden="true">🔒</span>
              <span>Passport details are kept secure on this device until final submission</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={handleBack}
          className="min-h-[48px] px-4 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back</span>
        </Button>
        <Button
          variant="primary"
          onClick={handleContinue}
          className="min-h-[48px] flex-1 flex items-center justify-center gap-1.5"
        >
          <span>Continue to Contact & Address</span>
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>

      {/* Standalone Tracking Modal (pre-filled if opened from duplicate warning) */}
      <TrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialReference={selectedTrackingRef}
      />
    </div>
  );
};
