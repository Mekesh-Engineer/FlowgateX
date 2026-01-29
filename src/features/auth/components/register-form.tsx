'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    mobile: '',
    role: 'user', 
    password: '', 
    confirmPassword: ''
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && (!formData.firstName || !formData.email)) {
      setError('Please fill in all required fields');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      router.push('/user');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-6">
        {[1, 2].map(i => (
          <div 
            key={i} 
            className={cn(
              "h-1 flex-1 rounded-full transition-colors", 
              step >= i ? "bg-[var(--brand-primary)]" : "bg-[var(--bg-tertiary)]"
            )} 
          />
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="John" 
                value={formData.firstName} 
                onChange={(e) => updateForm('firstName', e.target.value)} 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Last Name</label>
              <Input 
                placeholder="Doe" 
                value={formData.lastName} 
                onChange={(e) => updateForm('lastName', e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Email <span className="text-red-500">*</span>
            </label>
            <Input 
              type="email" 
              placeholder="john@example.com" 
              value={formData.email} 
              onChange={(e) => updateForm('email', e.target.value)} 
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Phone</label>
            <Input 
              type="tel" 
              placeholder="+1 234 567 890" 
              value={formData.mobile} 
              onChange={(e) => updateForm('mobile', e.target.value)} 
            />
          </div>
          
          <Button type="button" onClick={handleNext} className="w-full btn-primary mt-4">
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Select Role</label>
            <select 
              className="w-full p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--brand-primary)] outline-none transition-colors"
              value={formData.role}
              onChange={(e) => updateForm('role', e.target.value)}
            >
              <option value="user">Attendee</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Password <span className="text-red-500">*</span>
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={(e) => updateForm('password', e.target.value)} 
              required
            />
            <p className="text-xs text-[var(--text-muted)]">Minimum 6 characters</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={formData.confirmPassword} 
              onChange={(e) => updateForm('confirmPassword', e.target.value)} 
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">
              Back
            </Button>
            <Button type="submit" className="w-2/3 btn-primary" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[var(--brand-primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
