import React, { createContext, useContext, useId } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FieldContextValue {
  id: string;
  hintId: string;
  errorId: string;
  invalid: boolean;
  isValid: boolean;
  required: boolean;
  hasHint: boolean;
  hasError: boolean;
  setHasHint: (has: boolean) => void;
  setHasError: (has: boolean) => void;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  return useContext(FieldContext);
}

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  invalid?: boolean;
  isValid?: boolean;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({
  id: customId,
  invalid = false,
  isValid = false,
  required = true,
  className = '',
  children,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const id = customId || generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const [hasHint, setHasHint] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  return (
    <FieldContext.Provider
      value={{
        id,
        hintId,
        errorId,
        invalid,
        isValid: isValid && !invalid,
        required,
        hasHint,
        hasError,
        setHasHint,
        setHasError,
      }}
    >
      <div className={`flex flex-col gap-1.5 w-full ${className}`} {...props}>
        {children}
      </div>
    </FieldContext.Provider>
  );
}

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  tooltip?: React.ReactNode;
}

export function FieldLabel({ className = '', children, tooltip, ...props }: FieldLabelProps) {
  const ctx = useFieldContext();
  const htmlFor = props.htmlFor || ctx?.id;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-1.5">
        <label
          htmlFor={htmlFor}
          className="text-base font-semibold text-[var(--color-ink)] flex items-center gap-1.5"
          {...props}
        >
          <span>{children}</span>
          {ctx?.isValid && (
            <CheckCircle2
              className="w-4 h-4 text-[var(--color-success)] shrink-0"
              aria-label="Valid entry"
            />
          )}
        </label>
        {tooltip}
      </div>
      {ctx && !ctx.required && (
        <span className="text-sm font-normal text-[var(--color-ink-muted)]">(optional)</span>
      )}
    </div>
  );
}

export interface FieldHintProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function FieldHint({ className = '', children, ...props }: FieldHintProps) {
  const ctx = useFieldContext();

  React.useEffect(() => {
    ctx?.setHasHint(true);
    return () => ctx?.setHasHint(false);
  }, [ctx]);

  return (
    <p
      id={ctx?.hintId}
      className={`text-sm text-[var(--color-ink-muted)] leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function FieldError({ className = '', children, ...props }: FieldErrorProps) {
  const ctx = useFieldContext();

  React.useEffect(() => {
    ctx?.setHasError(true);
    return () => ctx?.setHasError(false);
  }, [ctx]);

  return (
    <p
      id={ctx?.errorId}
      role="status"
      aria-live="polite"
      className={`text-sm font-semibold text-[var(--color-error)] flex items-center gap-1.5 mt-0.5 ${className}`}
      {...props}
    >
      <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
