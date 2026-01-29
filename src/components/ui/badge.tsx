'use client';

import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'outline' | 'destructive';
  children: React.ReactNode;
}

export function Badge({ variant = 'primary', children, className = '', ...props }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'bg-transparent border border-gray-300 text-gray-700',
    destructive: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-sm font-semibold',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
