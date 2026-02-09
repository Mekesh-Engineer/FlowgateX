// =============================================================================
// CONFIRMATION SCREEN — Post-signup success with confetti
// =============================================================================

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfirmationScreenProps {
  email: string;
  role: string;
}

function fireConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;
  const colors = ['#00A3DB', '#33B8E5', '#007AA3', '#A3D639', '#ffffff'];

  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export default function ConfirmationScreen({ email, role }: ConfirmationScreenProps) {
  useEffect(() => {
    fireConfetti();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center space-y-6 py-8"
      role="status"
      aria-live="polite"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="register-confirmation-icon"
      >
        <CheckCircle2 size={48} aria-hidden="true" />
      </motion.div>

      {/* Heading */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Welcome to FlowGateX!
        </h2>
        <p className="text-[var(--text-secondary)] text-sm max-w-sm">
          Your <span className="font-semibold capitalize">{role}</span> account has been created
          successfully. A confirmation email has been sent to{' '}
          <span className="font-semibold text-[var(--color-primary)]">{email}</span>.
        </p>
      </div>

      {/* Info card */}
      <div className="register-confirmation-card">
        <Activity size={18} className="text-[var(--color-primary)] shrink-0" aria-hidden="true" />
        <p className="text-sm text-[var(--text-secondary)]">
          You can now sign in and start exploring events, managing your profile, and more.
        </p>
      </div>

      {/* CTA */}
      <Link
        to="/login"
        className="register-confirmation-cta group"
      >
        <span>Go to Sign In</span>
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}
