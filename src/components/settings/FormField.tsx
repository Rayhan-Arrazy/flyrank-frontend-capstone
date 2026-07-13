import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div aria-describedby={describedBy}>
        {children}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-sm text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

const inputBaseClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-50';

const inputErrorClass = 'border-red-400 focus:border-red-500 focus:ring-red-500/20';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function TextInput({ hasError, className = '', ...props }: TextInputProps) {
  return (
    <input
      className={`${inputBaseClass} ${hasError ? inputErrorClass : ''} ${className}`}
      {...props}
    />
  );
}

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  rows?: number;
}

export function TextArea({ hasError, className = '', rows = 4, ...props }: TextAreaProps) {
  return (
    <textarea
      rows={rows}
      className={`${inputBaseClass} resize-y ${hasError ? inputErrorClass : ''} ${className}`}
      {...props}
    />
  );
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  options: { value: string; label: string }[];
}

export function SelectInput({ hasError, options, className = '', ...props }: SelectInputProps) {
  return (
    <select
      className={`${inputBaseClass} ${hasError ? inputErrorClass : ''} ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hasError?: boolean;
  error?: string;
}

export function CheckboxField({
  id,
  label,
  description,
  checked,
  onChange,
  hasError,
  error,
}: CheckboxFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={hasError || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <div>
          <label htmlFor={id} className="text-sm font-medium text-slate-700">
            {label}
          </label>
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
