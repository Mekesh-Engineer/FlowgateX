// =============================================================================
// DATE OF BIRTH PICKER — Date input with age ≥ 13 validation
// =============================================================================

import { useMemo } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
interface DateOfBirthPickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const MIN_AGE = 13;

/** Returns YYYY-MM-DD string for today minus `years` years */
function getMaxDate(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().split('T')[0];
}

export default function DateOfBirthPicker({
  value,
  onChange,
  error,
  disabled = false,
}: DateOfBirthPickerProps) {
  const maxDate = useMemo(() => getMaxDate(MIN_AGE), []);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor="register-dob"
        className="block text-sm font-semibold text-[var(--text-primary)]"
      >
        Date of Birth <span className="text-[var(--color-error)]">*</span>
      </label>

      <div className="relative">
        <Calendar
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="register-dob"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          max={maxDate}
          disabled={disabled}
          required
          aria-invalid={!!error}
          aria-describedby={error ? 'register-dob-error' : undefined}
          className={`register-input register-input--icon ${error ? 'register-input--error' : ''}`}
        />
      </div>

      {error && (
        <p
          id="register-dob-error"
          className="flex items-center gap-1 text-xs text-[var(--color-error)]"
          role="alert"
        >
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
