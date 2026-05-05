'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import { Input, Button } from '@/components/ui';
import { authService } from '@/services/auth';
import { getErrorMessage } from '@/types/auth';

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validatePassword = (pass: string) => {
    return {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass),
    };
  };

  const passwordStatus = validatePassword(password);
  const isPasswordValid = Object.values(passwordStatus).every(Boolean);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Please fulfill all password requirements.');
      return;
    }

    setLoading(true);

    try {
      await authService.signup({
        email,
        password,
        display_name: displayName,
      });
      // Verification disabled: Redirect to login with success message
      router.push(`/auth/login?signup=success&email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ label, met }: { label: string; met: boolean }) => (
    <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${met ? 'text-green-600' : 'text-neutral-400'}`}>
      <div className={`w-1 h-1 rounded-full ${met ? 'bg-green-600' : 'bg-neutral-300'}`} />
      {label}
    </div>
  );

  return (
    <AuthLayout
      title="Create your account."
      subtitle="Start turning conversations into insights."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full name"
          type="text"
          placeholder="e.g. John Doe"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <div className="space-y-3">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="········"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            }
          />

          <p className="text-[13px] text-neutral-500 font-medium pb-2">Minimum 8 characters.</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-1 bg-[#F7F8FB] p-3 rounded-xl border border-[#E5E7EB]">
            <ValidationItem label="8+ Characters" met={passwordStatus.length} />
            <ValidationItem label="Uppercase" met={passwordStatus.uppercase} />
            <ValidationItem label="Lowercase" met={passwordStatus.lowercase} />
            <ValidationItem label="Number" met={passwordStatus.number} />
            <ValidationItem label="Special Char" met={passwordStatus.special} />
          </div>
        </div>
        
        {/* Terms Agreement */}
        <div className="flex items-start gap-3 mt-4">
          <div className="flex items-center h-5 mt-0.5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-[18px] w-[18px] rounded-[6px] border-[#E5E7EB] text-[#6C63FF] focus:ring-[#6C63FF]/30 transition-colors cursor-pointer"
            />
          </div>
          <div className="text-[14px] text-neutral-600 font-medium pb-2">
            <label htmlFor="terms" className="cursor-pointer">
              I agree to the <Link href="#" className="text-[#6C63FF] hover:underline">Terms</Link> and <Link href="#" className="text-[#6C63FF] hover:underline">Privacy Policy</Link>.
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-xs text-red-600 font-medium text-center">
              {error}
            </p>
          </div>
        )}

        <Button type="submit" block loading={loading} className="h-12 text-sm" disabled={password.length > 0 && !isPasswordValid}>
          Create account
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]"></div>
        </div>
        <div className="relative flex justify-center text-[13px] uppercase font-bold tracking-wider">
          <span className="bg-white px-3 text-neutral-400">
            or
          </span>
        </div>
      </div>

      <Button
        variant="secondary"
        block
        className="flex items-center gap-2"
        onClick={() => {/* TODO: Implement Google Auth */ }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12 5.38z"
          />
        </svg>
        Sign up with Google
      </Button>

      <p className="mt-8 text-center text-[14px] text-neutral-500 font-medium">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#6C63FF] hover:text-[#5A52D5] font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
