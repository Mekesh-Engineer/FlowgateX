// =============================================================================
// GENDER SELECT — Accessible gender selection with segmented pills
// =============================================================================

import { motion } from 'framer-motion';

import type { Gender } from '../types/registration.types';

interface GenderSelectProps {
  value: Gender | '';
  onChange: (value: Gender) => void;
  disabled?: boolean;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export default function GenderSelect({
  value,
  onChange,
  disabled = false,
}: GenderSelectProps) {
  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-semibold text-[var(--text-primary)]">
        Gender
      </span>

      <div
        role="radiogroup"
        aria-label="Gender"
        className="register-gender-group"
      >
        {GENDER_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => !disabled && onChange(opt.value)}
              disabled={disabled}
              className={`register-gender-pill ${isSelected ? 'register-gender-pill--active' : ''}`}
            >
              {isSelected && (
                <motion.span
                  layoutId="gender-pill-bg"
                  className="register-gender-pill-bg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-xs font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
