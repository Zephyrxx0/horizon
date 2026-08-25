import React, { useState } from 'react';
import { useWizardActor } from '../wizard/context';
import { useSelector } from '@xstate/react';
import {
  Field,
  FieldLabel,
  FieldHint,
  FieldError,
  Input,
  Button,
  ErrorSummary,
  type ErrorSummaryItem,
} from '../../components/ui';
import { validateVisaSpecificStep, isValidIsoDate } from '../wizard/validators';
import {
  ArrowLeft,
  ChevronRight,
  PlaneTakeoff,
  Building,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

export interface VisaSpecificStepProps {
  className?: string;
}

export const VisaSpecificStep: React.FC<VisaSpecificStepProps> = ({ className = '' }) => {
  const actor = useWizardActor();
  const answers = useSelector(actor, (s) => s.context.answers);

  const visaCategory = (answers.visaCategory as string) || 'tourist';
  const visaName = (answers.visaName as string) || 'Selected Visa';
  const destinationCountry = (answers.destinationCountry as string) || 'Destination';

  // Specific fields
  const travelStartDate = (answers.travelStartDate as string) || '';
  const travelEndDate = (answers.travelEndDate as string) || '';
  const stayAddress = (answers.stayAddress as string) || '';
  const companyName = (answers.companyName as string) || '';
  const businessContactPerson = (answers.businessContactPerson as string) || '';
  const institutionName = (answers.institutionName as string) || '';
  const sevisOrCasNumber = (answers.sevisOrCasNumber as string) || '';
  const employerName = (answers.employerName as string) || '';
  const jobTitle = (answers.jobTitle as string) || '';

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field: string, value: unknown) => {
    actor.send({ type: 'ANSWER_CHANGED', fieldId: field, value });
  };

  const handleContinue = () => {
    const currentAnswers = {
      visaCategory,
      travelStartDate,
      travelEndDate,
      stayAddress,
      companyName,
      businessContactPerson,
      institutionName,
      sevisOrCasNumber,
      employerName,
      jobTitle,
    };

    const validationErrors = validateVisaSpecificStep(currentAnswers);
    const errorKeys = Object.keys(validationErrors);

    if (errorKeys.length > 0) {
      setTouched({
        travelStartDate: true,
        travelEndDate: true,
        stayAddress: true,
        companyName: true,
        businessContactPerson: true,
        institutionName: true,
        sevisOrCasNumber: true,
        employerName: true,
        jobTitle: true,
      });

      setErrors(
        errorKeys.map((key) => ({
          fieldId: key,
          label:
            key === 'travelStartDate'
              ? 'Travel Date'
              : key === 'stayAddress'
                ? 'Accommodation Address'
                : key === 'companyName'
                  ? 'Company Name'
                  : key === 'institutionName'
                    ? 'Institution Name'
                    : key === 'sevisOrCasNumber'
                      ? 'SEVIS / Reference Number'
                      : key === 'employerName'
                        ? 'Employer Name'
                        : key === 'jobTitle'
                          ? 'Job Title'
                          : 'Required Field',
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

  const isStartDateValid = touched.travelStartDate && isValidIsoDate(travelStartDate);
  const isStayValid = touched.stayAddress && stayAddress.trim().length > 0;
  const isCompanyValid = touched.companyName && companyName.trim().length > 0;
  const isInstitutionValid = touched.institutionName && institutionName.trim().length > 0;
  const isSevisValid = touched.sevisOrCasNumber && sevisOrCasNumber.trim().length > 0;
  const isEmployerValid = touched.employerName && employerName.trim().length > 0;
  const isJobValid = touched.jobTitle && jobTitle.trim().length > 0;

  return (
    <div className={`space-y-6 max-w-xl mx-auto ${className}`}>
      {/* Top Error Summary */}
      {errors.length > 0 && <ErrorSummary errors={errors} />}

      {/* Sub-step Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-indigo-primary)]">
          {visaCategory === 'student' ? (
            <GraduationCap className="w-4 h-4" aria-hidden="true" />
          ) : visaCategory === 'work' ? (
            <Briefcase className="w-4 h-4" aria-hidden="true" />
          ) : visaCategory === 'business' ? (
            <Building className="w-4 h-4" aria-hidden="true" />
          ) : (
            <PlaneTakeoff className="w-4 h-4" aria-hidden="true" />
          )}
          <span>Stage 2c of 5 • {visaName} Specifics</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
          {destinationCountry} Travel & Visa Specifics
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Fields customized specifically for your <strong>{visaName}</strong>.
        </p>
      </div>

      {/* Progressive Disclosure Fields */}
      <div className="space-y-4">
        {/* Tourist / Visitor Fields */}
        {visaCategory === 'tourist' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="travelStartDate"
                invalid={touched.travelStartDate && !isValidIsoDate(travelStartDate)}
                isValid={isStartDateValid}
              >
                <FieldLabel>Planned Arrival Date</FieldLabel>
                <Input
                  type="date"
                  value={travelStartDate}
                  onChange={(e) => handleInputChange('travelStartDate', e.target.value)}
                  onBlur={() => handleBlur('travelStartDate')}
                />
                {touched.travelStartDate && !isValidIsoDate(travelStartDate) && (
                  <FieldError>Arrival date is required.</FieldError>
                )}
              </Field>

              <Field id="travelEndDate" required={false}>
                <FieldLabel>Planned Departure Date</FieldLabel>
                <Input
                  type="date"
                  value={travelEndDate}
                  onChange={(e) => handleInputChange('travelEndDate', e.target.value)}
                />
              </Field>
            </div>

            <Field
              id="stayAddress"
              invalid={touched.stayAddress && !stayAddress.trim()}
              isValid={isStayValid}
            >
              <FieldLabel>Hotel Name or Stay Address in {destinationCountry}</FieldLabel>
              <Input
                value={stayAddress}
                onChange={(e) => handleInputChange('stayAddress', e.target.value)}
                onBlur={() => handleBlur('stayAddress')}
                placeholder="e.g. Marriott Downtown / Host Residence"
              />
              <FieldHint>Where you will reside during your initial stay.</FieldHint>
              {touched.stayAddress && !stayAddress.trim() && (
                <FieldError>Stay address or hotel name is required.</FieldError>
              )}
            </Field>
          </>
        )}

        {/* Business Fields */}
        {visaCategory === 'business' && (
          <>
            <Field
              id="companyName"
              invalid={touched.companyName && !companyName.trim()}
              isValid={isCompanyValid}
            >
              <FieldLabel>Host / Inviting Company in {destinationCountry}</FieldLabel>
              <Input
                value={companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                onBlur={() => handleBlur('companyName')}
                placeholder="e.g. Acme International Corp"
              />
              {touched.companyName && !companyName.trim() && (
                <FieldError>Host company name is required.</FieldError>
              )}
            </Field>

            <Field id="businessContactPerson" required={false}>
              <FieldLabel>Host Contact Person / Designation</FieldLabel>
              <Input
                value={businessContactPerson}
                onChange={(e) => handleInputChange('businessContactPerson', e.target.value)}
                placeholder="e.g. John Doe, VP Engineering"
              />
            </Field>

            <Field
              id="travelStartDate"
              invalid={touched.travelStartDate && !isValidIsoDate(travelStartDate)}
              isValid={isStartDateValid}
            >
              <FieldLabel>Date of Planned Business Visit</FieldLabel>
              <Input
                type="date"
                value={travelStartDate}
                onChange={(e) => handleInputChange('travelStartDate', e.target.value)}
                onBlur={() => handleBlur('travelStartDate')}
              />
              {touched.travelStartDate && !isValidIsoDate(travelStartDate) && (
                <FieldError>Visit date is required.</FieldError>
              )}
            </Field>
          </>
        )}

        {/* Student Fields */}
        {visaCategory === 'student' && (
          <>
            <Field
              id="institutionName"
              invalid={touched.institutionName && !institutionName.trim()}
              isValid={isInstitutionValid}
            >
              <FieldLabel>Admitting College / University</FieldLabel>
              <Input
                value={institutionName}
                onChange={(e) => handleInputChange('institutionName', e.target.value)}
                onBlur={() => handleBlur('institutionName')}
                placeholder="e.g. Stanford University / University of Oxford"
              />
              {touched.institutionName && !institutionName.trim() && (
                <FieldError>University name is required.</FieldError>
              )}
            </Field>

            <Field
              id="sevisOrCasNumber"
              invalid={touched.sevisOrCasNumber && !sevisOrCasNumber.trim()}
              isValid={isSevisValid}
            >
              <FieldLabel>SEVIS ID / CAS Reference Number</FieldLabel>
              <Input
                value={sevisOrCasNumber}
                onChange={(e) => handleInputChange('sevisOrCasNumber', e.target.value)}
                onBlur={() => handleBlur('sevisOrCasNumber')}
                placeholder="e.g. N0012345678 or CAS12345"
              />
              <FieldHint>Found on your Form I-20 or CAS statement.</FieldHint>
              {touched.sevisOrCasNumber && !sevisOrCasNumber.trim() && (
                <FieldError>SEVIS ID or CAS number is required.</FieldError>
              )}
            </Field>

            <Field
              id="travelStartDate"
              invalid={touched.travelStartDate && !isValidIsoDate(travelStartDate)}
              isValid={isStartDateValid}
            >
              <FieldLabel>Course Start Date / Program Orientation</FieldLabel>
              <Input
                type="date"
                value={travelStartDate}
                onChange={(e) => handleInputChange('travelStartDate', e.target.value)}
                onBlur={() => handleBlur('travelStartDate')}
              />
              {touched.travelStartDate && !isValidIsoDate(travelStartDate) && (
                <FieldError>Course start date is required.</FieldError>
              )}
            </Field>
          </>
        )}

        {/* Work Fields */}
        {visaCategory === 'work' && (
          <>
            <Field
              id="employerName"
              invalid={touched.employerName && !employerName.trim()}
              isValid={isEmployerValid}
            >
              <FieldLabel>Sponsoring Employer in {destinationCountry}</FieldLabel>
              <Input
                value={employerName}
                onChange={(e) => handleInputChange('employerName', e.target.value)}
                onBlur={() => handleBlur('employerName')}
                placeholder="e.g. Global Tech Solutions Inc."
              />
              {touched.employerName && !employerName.trim() && (
                <FieldError>Sponsoring employer name is required.</FieldError>
              )}
            </Field>

            <Field
              id="jobTitle"
              invalid={touched.jobTitle && !jobTitle.trim()}
              isValid={isJobValid}
            >
              <FieldLabel>Job Title / Designation</FieldLabel>
              <Input
                value={jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                onBlur={() => handleBlur('jobTitle')}
                placeholder="e.g. Senior Software Architect"
              />
              {touched.jobTitle && !jobTitle.trim() && (
                <FieldError>Job title is required.</FieldError>
              )}
            </Field>

            <Field
              id="travelStartDate"
              invalid={touched.travelStartDate && !isValidIsoDate(travelStartDate)}
              isValid={isStartDateValid}
            >
              <FieldLabel>Expected Employment Joining Date</FieldLabel>
              <Input
                type="date"
                value={travelStartDate}
                onChange={(e) => handleInputChange('travelStartDate', e.target.value)}
                onBlur={() => handleBlur('travelStartDate')}
              />
              {touched.travelStartDate && !isValidIsoDate(travelStartDate) && (
                <FieldError>Employment start date is required.</FieldError>
              )}
            </Field>
          </>
        )}
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
          <span>Continue to Document Upload</span>
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
