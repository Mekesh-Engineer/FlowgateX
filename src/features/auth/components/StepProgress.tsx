// =============================================================================
// STEP PROGRESS — Four-step indicator: Identity → Security → Verify → Review
// =============================================================================

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number; // 1 | 2 | 3 | 4
}

const STEPS = [
  { num: 1, label: 'Identity' },
  { num: 2, label: 'Security' },
  { num: 3, label: 'Verify' },
  { num: 4, label: 'Review' },
];

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <nav aria-label="Signup progress" className="register-step-progress">
      {/* Step text */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {currentStep < STEPS.length
            ? `Next: ${STEPS[currentStep]?.label}`
            : 'Complete'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="register-step-bar" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={4}>
        <motion.div
          className="register-step-bar-fill"
          initial={false}
          animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Step labels */}
      <ol className="register-step-list">
        {STEPS.map(({ num, label }) => {
          const isDone = currentStep > num;
          const isCurrent = currentStep === num;
          return (
            <li
              key={num}
              className={`register-step-item ${isDone ? 'register-step-item--done' : ''} ${isCurrent ? 'register-step-item--active' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="register-step-dot">
                {isDone ? <Check size={12} aria-hidden="true" /> : num}
              </span>
              <span className="register-step-label">{label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
