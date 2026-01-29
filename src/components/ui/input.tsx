'use client';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full px-4 py-2.5 rounded-lg transition-all duration-200 focus:outline-none",
        "bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]",
        "placeholder:text-[var(--text-muted)]",
        "focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20",
        className
      )}
      {...props}
    />
  );
}
