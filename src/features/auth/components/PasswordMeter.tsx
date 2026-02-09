// =============================================================================
// PASSWORD METER — Real-time strength indicator with actionable hints
// =============================================================================

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { PASSWORD_RULES } from '@/features/auth/utils/passwordValidation';

interface PasswordMeterProps {
  password: string;
}

const RULES = PASSWORD_RULES;

function getStrength(password: string): { score: number; label: string; className: string } {
  if (!password) return { score: 0, label: '', className: '' };

  const passed = RULES.filter((r) => r.test(password)).length;
  const ratio = passed / RULES.length;

  if (ratio <= 0.2) return { score: 1, label: 'Very weak', className: 'register-pw-very-weak' };
  if (ratio <= 0.4) return { score: 2, label: 'Weak', className: 'register-pw-weak' };
  if (ratio <= 0.6) return { score: 3, label: 'Fair', className: 'register-pw-fair' };
  if (ratio <= 0.8) return { score: 4, label: 'Strong', className: 'register-pw-strong' };
  return { score: 5, label: 'Very strong', className: 'register-pw-very-strong' };
}

export default function PasswordMeter({ password }: PasswordMeterProps) {
  const strength = useMemo(() => getStrength(password), [password]);
  const results = useMemo(
    () => RULES.map((r) => ({ ...r, passed: r.test(password) })),
    [password],
  );

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2" aria-label="Password strength feedback">
      {/* Strength bar */}
      <div className="register-pw-bar" role="meter" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={5} aria-label={`Password strength: ${strength.label}`}>
        {[1, 2, 3, 4, 5].map((seg) => (
          <div
            key={seg}
            className={`register-pw-bar-seg ${seg <= strength.score ? strength.className : ''}`}
          />
        ))}
      </div>

      {/* Label */}
      <p className={`text-xs font-medium ${strength.className}`} aria-live="polite">
        {strength.label}
      </p>

      {/* Rule checklist */}
      <ul className="space-y-1" aria-label="Password requirements">
        {results.map((r, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs">
            {r.passed ? (
              <Check size={13} className="text-[var(--color-success)] shrink-0" aria-hidden="true" />
            ) : (
              <X size={13} className="text-[var(--text-muted)] shrink-0" aria-hidden="true" />
            )}
            <span className={r.passed ? 'text-[var(--color-success)]' : 'text-[var(--text-muted)]'}>
              {r.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
