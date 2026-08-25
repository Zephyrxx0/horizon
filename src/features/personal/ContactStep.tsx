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
import { formatPhoneNumber } from '../wizard/formatters';
import {
  validateContactStep,
  isValidEmail,
  isValidPhone,
  isValidPincode,
} from '../wizard/validators';
import { ArrowLeft, ChevronRight, MapPin } from 'lucide-react';

export interface ContactStepProps {
  className?: string;
}

export const ContactStep: React.FC<ContactStepProps> = ({ className = '' }) => {
  const actor = useWizardActor();
  const answers = useSelector(actor, (s) => s.context.answers);

  const email = (answers.email as string) || '';
  const phone = (answers.phone as string) || '+91 ';
  const addressLine1 = (answers.addressLine1 as string) || '';
  const addressLine2 = (answers.addressLine2 as string) || '';
  const city = (answers.city as string) || '';
  const state = (answers.state as string) || '';
  const pincode = (answers.pincode as string) || '';

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field: string, value: unknown) => {
    actor.send({ type: 'ANSWER_CHANGED', fieldId: field, value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    actor.send({ type: 'ANSWER_CHANGED', fieldId: 'phone', value: formatted });
  };

  const handleContinue = () => {
    const currentAnswers = {
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    };

    const validationErrors = validateContactStep(currentAnswers);
    const errorKeys = Object.keys(validationErrors);

    if (errorKeys.length > 0) {
      setTouched({
        email: true,
        phone: true,
        addressLine1: true,
        city: true,
        state: true,
        pincode: true,
      });

      setErrors(
        errorKeys.map((key) => ({
          fieldId: key,
          label:
            key === 'email'
              ? 'Email Address'
              : key === 'phone'
                ? 'Mobile Number'
                : key === 'addressLine1'
                  ? 'Address'
                  : key === 'city'
                    ? 'City'
                    : key === 'state'
                      ? 'State'
                      : 'PIN Code',
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

  const isEmailValid = touched.email && isValidEmail(email);
  const isPhoneValid = touched.phone && isValidPhone(phone);
  const isAddr1Valid = touched.addressLine1 && addressLine1.trim().length > 0;
  const isCityValid = touched.city && city.trim().length > 0;
  const isStateValid = touched.state && state.trim().length > 0;
  const isPincodeValid = touched.pincode && isValidPincode(pincode);

  return (
    <div className={`space-y-6 max-w-xl mx-auto ${className}`}>
      {/* Top Error Summary */}
      {errors.length > 0 && <ErrorSummary errors={errors} />}

      {/* Sub-step Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-indigo-primary)]">
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span>Stage 2b of 5 • Contact & Address</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
          Contact & Residential Address
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          We use your contact details to send confirmation receipts, SMS status updates, and
          tracking alerts.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="email" invalid={touched.email && !isValidEmail(email)} isValid={isEmailValid}>
            <FieldLabel>Email Address</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="name@example.com"
              autoComplete="email"
            />
            <FieldHint>For receipt delivery & status alerts.</FieldHint>
            {touched.email && !isValidEmail(email) && (
              <FieldError>
                {!email.trim()
                  ? 'Email address is required.'
                  : 'Please enter a valid email format (e.g. name@example.com).'}
              </FieldError>
            )}
          </Field>

          <Field id="phone" invalid={touched.phone && !isValidPhone(phone)} isValid={isPhoneValid}>
            <FieldLabel>Mobile Phone Number</FieldLabel>
            <Input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              placeholder="+91 98765 43210"
              autoComplete="tel"
            />
            <FieldHint>Auto-prefixed with +91 country code.</FieldHint>
            {touched.phone && !isValidPhone(phone) && (
              <FieldError>Please enter a valid 10-digit Indian mobile number.</FieldError>
            )}
          </Field>
        </div>

        {/* Address Lines */}
        <Field
          id="addressLine1"
          invalid={touched.addressLine1 && !addressLine1.trim()}
          isValid={isAddr1Valid}
        >
          <FieldLabel>Current Residential Address (Line 1)</FieldLabel>
          <Input
            value={addressLine1}
            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
            onBlur={() => handleBlur('addressLine1')}
            placeholder="Flat/House No., Building, Street Name"
            autoComplete="address-line1"
          />
          {touched.addressLine1 && !addressLine1.trim() && (
            <FieldError>Address line 1 is required.</FieldError>
          )}
        </Field>

        <Field id="addressLine2" required={false}>
          <FieldLabel>Address (Line 2)</FieldLabel>
          <Input
            value={addressLine2}
            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
            placeholder="Area, Landmark, Locality"
            autoComplete="address-line2"
          />
        </Field>

        {/* City, State, PIN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field id="city" invalid={touched.city && !city.trim()} isValid={isCityValid}>
            <FieldLabel>City / Town</FieldLabel>
            <Input
              value={city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              placeholder="e.g. Bengaluru"
              autoComplete="address-level2"
            />
            {touched.city && !city.trim() && <FieldError>City is required.</FieldError>}
          </Field>

          <Field id="state" invalid={touched.state && !state.trim()} isValid={isStateValid}>
            <FieldLabel>State / UT</FieldLabel>
            <Input
              value={state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              onBlur={() => handleBlur('state')}
              placeholder="e.g. Karnataka"
              autoComplete="address-level1"
            />
            {touched.state && !state.trim() && <FieldError>State is required.</FieldError>}
          </Field>

          <Field
            id="pincode"
            invalid={touched.pincode && !isValidPincode(pincode)}
            isValid={isPincodeValid}
          >
            <FieldLabel>6-Digit PIN Code</FieldLabel>
            <Input
              value={pincode}
              onChange={(e) =>
                handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              onBlur={() => handleBlur('pincode')}
              placeholder="560001"
              maxLength={6}
              autoComplete="postal-code"
            />
            {touched.pincode && !isValidPincode(pincode) && (
              <FieldError>6-digit PIN is required.</FieldError>
            )}
          </Field>
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
          <span>Continue to Trip Details</span>
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
