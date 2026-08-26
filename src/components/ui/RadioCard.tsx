import React, { createContext, useContext, useId } from 'react';

interface RadioCardGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioCardGroupContext = createContext<RadioCardGroupContextValue | null>(null);

export interface RadioCardGroupProps {
  legend: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function RadioCardGroup({
  legend,
  name: customName,
  value,
  onChange,
  className = '',
  children,
}: RadioCardGroupProps) {
  const generatedName = useId();
  const name = customName || generatedName;

  return (
    <RadioCardGroupContext.Provider value={{ name, value, onChange }}>
      <fieldset className={`border-none p-0 m-0 w-full ${className}`}>
        <legend className="text-base font-semibold text-[var(--color-ink)] mb-3">{legend}</legend>
        <div className="flex flex-col gap-3">{children}</div>
      </fieldset>
    </RadioCardGroupContext.Provider>
  );
}

export interface RadioCardProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  onChange?: (value: string) => void;
}

export function RadioCard({
  value,
  label,
  description,
  disabled = false,
  className = '',
  onChange: customOnChange,
  ...props
}: RadioCardProps) {
  const ctx = useContext(RadioCardGroupContext);
  const isChecked = props.checked !== undefined ? props.checked : ctx?.value === value;
  const name = props.name || ctx?.name;

  const handleChange = () => {
    if (disabled) return;
    if (customOnChange) customOnChange(value);
    if (ctx?.onChange) ctx.onChange(value);
  };

  return (
    <label
      className={`relative flex items-center justify-between min-h-[64px] p-4 rounded-[var(--radius-card)] cursor-pointer select-none transition-colors duration-150 border-2 ${
        isChecked
          ? 'border-[var(--color-indigo-primary)] bg-[var(--color-selected-bg)]'
          : 'border-[var(--color-border)] bg-white hover:border-[var(--color-indigo-primary)]/50'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        className="opacity-0 absolute inset-0 cursor-pointer w-full h-full peer z-10"
        {...props}
      />
      <div className="flex flex-col pr-4 pointer-events-none">
        <span className="text-base font-semibold text-[var(--color-ink)]">{label}</span>
        {description && (
          <span className="text-sm text-[var(--color-ink-muted)] mt-0.5">{description}</span>
        )}
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 pointer-events-none peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-indigo-primary)] peer-focus-visible:ring-offset-2 ${
          isChecked ? 'border-[var(--color-indigo-primary)]' : 'border-[var(--color-border)]'
        }`}
      >
        {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-indigo-primary)]" />}
      </div>
    </label>
  );
}
