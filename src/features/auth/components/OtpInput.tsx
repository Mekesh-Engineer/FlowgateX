// =============================================================================
// OTP INPUT — 6-digit verification field with resend cooldown
// =============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle2, AlertCircle, RotateCw } from 'lucide-react';

interface OtpInputProps {
  /** Called when all 6 digits are entered */
  onComplete: (code: string) => void;
  /** Called when user requests a new OTP */
  onResend: () => void;
  /** Whether verification is in progress */
  verifying?: boolean;
  /** Whether the OTP has been verified */
  verified?: boolean;
  /** Error message to display */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Label text displayed above the input */
  label?: string;
  /** Description text below the label */
  description?: string;
  /** Success message shown after verification */
  successMessage?: string;
}

const OTP_LENGTH = 6;
const COOLDOWN_SECONDS = 60;

export default function OtpInput({
  onComplete,
  onResend,
  verifying = false,
  verified = false,
  error,
  disabled = false,
  label = 'Verification Code',
  description = 'Enter the 6-digit code sent to your email.',
  successMessage = 'Verified successfully!',
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start cooldown timer on mount
  useEffect(() => {
    startCooldown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCooldown = useCallback(() => {
    setCooldown(COOLDOWN_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const focusInput = (index: number) => {
    if (index >= 0 && index < OTP_LENGTH) {
      inputsRef.current[index]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (disabled || verified) return;

    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...digits];
    updated[index] = digit;
    setDigits(updated);

    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }

    // Auto-submit when all filled
    if (digit && updated.every((d) => d !== '')) {
      onComplete(updated.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        focusInput(index - 1);
        const updated = [...digits];
        updated[index - 1] = '';
        setDigits(updated);
      }
    } else if (e.key === 'ArrowLeft') {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight') {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const updated = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setDigits(updated);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));

    if (updated.every((d) => d !== '')) {
      onComplete(updated.join(''));
    }
  };

  const handleResend = () => {
    if (cooldown > 0 || disabled) return;
    setDigits(Array(OTP_LENGTH).fill(''));
    onResend();
    startCooldown();
    focusInput(0);
  };

  const isDisabled = disabled || verifying || verified;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[var(--text-primary)]">
        {label}
      </label>
      <p className="text-xs text-[var(--text-muted)]">
        {description} <span className="text-[var(--text-muted)] opacity-60">(Mock: 123456)</span>
      </p>

      {/* 6-digit input row */}
      <div
        className="register-otp-row"
        role="group"
        aria-label="6-digit verification code"
        onPaste={handlePaste}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={isDisabled}
            aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
            className={`register-otp-digit ${verified ? 'register-otp-digit--verified' : ''} ${error ? 'register-otp-digit--error' : ''}`}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Status messages */}
      {verifying && (
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-primary)]" role="status" aria-live="polite">
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          Verifying…
        </p>
      )}
      {verified && !error && (
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-success)]" role="status" aria-live="polite">
          <CheckCircle2 size={14} aria-hidden="true" />
          {successMessage}
        </p>
      )}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-error)]" role="alert" aria-live="assertive">
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Resend button */}
      {!verified && (
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || isDisabled}
          className="register-otp-resend"
          aria-label={cooldown > 0 ? `Resend code available in ${cooldown} seconds` : 'Resend verification code'}
        >
          <RotateCw size={13} aria-hidden="true" />
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      )}
    </div>
  );
}
