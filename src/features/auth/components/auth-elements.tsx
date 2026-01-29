'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { 
  Mail, Lock, Eye, EyeOff, User, Phone, Shield, 
  ArrowLeft, Check, AlertCircle, Loader2, Sparkles, 
  Sun, Moon, Github 
} from 'lucide-react';

// --- Icon Mapping Wrapper ---
// Maps original material icon names to Lucide-React components
export const Icon = ({ name, className, size = 20, ...props }: any) => {
  const icons: Record<string, React.ElementType> = {
    auto_awesome: Sparkles,
    mail: Mail,
    lock: Lock,
    visibility: Eye,
    visibility_off: EyeOff,
    person: User,
    phone: Phone,
    shield: Shield,
    arrow_back: ArrowLeft,
    check: Check,
    error: AlertCircle,
    sync: Loader2,
    light_mode: Sun,
    dark_mode: Moon,
  };

  const LucideIcon = icons[name] || AlertCircle;
  return <LucideIcon className={className} size={size} {...props} />;
};

// --- Toast Component ---
export const Toast = memo(({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div className={cn(
    "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md animate-in slide-in-from-right-full fade-in duration-300",
    type === 'success' 
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
      : "bg-red-500/10 border-red-500/20 text-red-500"
  )}>
    <Icon name={type === 'success' ? 'check' : 'error'} size={18} />
    <span className="font-medium text-sm">{message}</span>
  </div>
));
Toast.displayName = 'Toast';

// --- InputField Component ---
export const InputField = memo(({
  icon,
  type = 'text',
  id,
  value,
  onChange,
  placeholder,
  error,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  className,
  ...props
}: any) => {
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" style={{ color: 'var(--text-muted)' }}>
          <Icon name={icon} size={20} />
        </div>

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: error ? '#ef4444' : 'var(--border-primary)' }}
          className={cn(
            "w-full pl-12 pr-4 py-3.5",
            "rounded-xl border-2 transition-all duration-200",
            "focus:outline-none",
            !error && "focus:border-[var(--brand-primary)] focus:ring-4",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            showPasswordToggle && "pr-12",
            className
          )}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--brand-primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(235, 22, 22, 0.12)';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={20} />
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-red-500 text-sm flex items-center gap-1.5 pl-1 animate-in fade-in slide-in-from-top-1">
          <Icon name="error" size={16} />
          {error}
        </p>
      )}
    </div>
  );
});
InputField.displayName = 'InputField';

// --- Button Component ---
export const Button = memo(({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  loading,
  className = '',
  ...props
}: any) => {
  const variants: any = {
    primary: "text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    secondary: "bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-2 border-[var(--border-primary)] hover:bg-[var(--bg-hover)]",
    ghost: "bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
  };
  
  const isPrimary = variant === 'primary';
  const primaryStyle = isPrimary ? {
    background: 'linear-gradient(135deg, var(--brand-primary-light) 0%, var(--brand-primary-dark) 100%)',
    boxShadow: '0 4px 12px var(--shadow-primary)'
  } : {};

  return (
    <button
      type={type}
      disabled={disabled || loading}
      style={primaryStyle}
      className={cn(
        "w-full font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-[var(--brand-primary)]/10",
        variants[variant] || variants.primary,
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Icon name="sync" className="animate-spin" size={20} />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});
Button.displayName = 'Button';

// --- SocialButton Component ---
export const SocialButton = memo(({ provider, icon, onClick }: any) => (
  <button
    type="button"
    onClick={() => onClick && onClick(provider)}
    className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] font-medium transition-all duration-200 hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-brand-primary/10"
  >
    {typeof icon === 'string' ? <Image src={icon} alt={`${provider} login`} width={20} height={20} className="w-5 h-5" /> : icon}
    <span className="text-sm">{provider}</span>
  </button>
));
SocialButton.displayName = 'SocialButton';

// --- PasswordStrength Component ---
export const PasswordStrength = memo(({ strength = 0 }: { strength: number }) => {
  const strengthConfig: any = {
    0: { width: '0%', color: 'bg-[var(--border-primary)]', text: 'Enter a password', textColor: 'text-muted-foreground' },
    1: { width: '25%', color: 'bg-red-500', text: 'Weak', textColor: 'text-red-500' },
    2: { width: '50%', color: 'bg-orange-500', text: 'Fair', textColor: 'text-orange-500' },
    3: { width: '75%', color: 'bg-blue-500', text: 'Good', textColor: 'text-blue-500' },
    4: { width: '100%', color: 'bg-emerald-500', text: 'Strong', textColor: 'text-emerald-500' },
  };

  const config = strengthConfig[strength] || strengthConfig[0];

  return (
    <div className="space-y-1.5">
      <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          className={`h-full ${config.color} transition-all duration-500 ease-out rounded-full`}
          style={{ width: config.width }}
        />
      </div>
      <p className={`text-xs font-medium ${config.textColor} transition-colors duration-300`}>
        {config.text}
      </p>
    </div>
  );
});
PasswordStrength.displayName = 'PasswordStrength';

// --- SegmentedProgressBar Component ---
export const SegmentedProgressBar = memo(({ currentStep, totalSteps = 3 }: any) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  const isComplete = currentStep >= totalSteps;
  const steps = Array.from({ length: totalSteps });
  
  // Dynamic labels based on number of steps
  const getStepLabel = (index: number) => {
    if (totalSteps === 4) {
      return ['Info', 'Profile', 'Security', 'Verify'][index] || '';
    }
    return ['Info', 'Security', 'Verify'][index] || '';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-x-1.5">
        {steps.map((_, i) => {
          const isActive = i + 1 <= currentStep;
          return (
            <div
              key={i}
              style={isActive ? { 
                background: 'linear-gradient(135deg, var(--brand-primary-light) 0%, var(--brand-primary-dark) 100%)'
              } : { backgroundColor: 'var(--border-primary)' }}
              className={cn(
                "w-full h-2.5 rounded-sm flex flex-col justify-center overflow-hidden transition-all duration-500 ease-out",
                isActive && "shadow-sm"
              )}
            />
          );
        })}
        <div className="ml-2 shrink-0">
          {isComplete ? (
            <span 
              className="flex items-center justify-center w-6 h-6 rounded-full text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--brand-primary-light) 0%, var(--brand-primary-dark) 100%)' }}
            >
              <Icon name="check" size={14} />
            </span>
          ) : (
            <span className="text-sm font-semibold min-w-[40px] text-right" style={{ color: 'var(--text-secondary)' }}>
              {percentage}%
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-2 px-0.5">
        {steps.map((_, i) => (
          <span
            key={i}
            style={{ color: i + 1 <= currentStep ? 'var(--brand-primary)' : 'var(--text-muted)' }}
            className="text-xs font-medium transition-colors duration-300"
          >
            {getStepLabel(i)}
          </span>
        ))}
      </div>
    </div>
  );
});
SegmentedProgressBar.displayName = 'SegmentedProgressBar';