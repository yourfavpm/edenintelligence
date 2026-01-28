'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../../../components/auth/AuthLayout';
import { Input, Button } from '../../../components/ui';
import { useAuth } from '../../../components/auth/AuthContext';
import { authService } from '../../../services/auth';
import { getErrorMessage } from '../../../types/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('signup') === 'success') {
        setIsSignupSuccess(true);
        const signupEmail = params.get('email');
        if (signupEmail) setEmail(signupEmail);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('📝 Submitting login form...');
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      console.log('🔑 Calling authService.login...');
      const response = await authService.login(formData);
      console.log('✅ Login response received:', response);

      console.log('🔐 Calling AuthContext.login...');
      await login(response.access_token, response.refresh_token);
      console.log('✅ AuthContext.login completed');
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Good to see you again. Enter your details to continue."
    >
      {isSignupSuccess && (
        <div className="mb-6 p-4 bg-success-50 border border-success-100 rounded-xl">
          <p className="text-sm text-success-700 font-medium">
            Account created successfully! Please sign in to continue.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="e.g. name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-error-50 border border-error-100 rounded-lg">
            <p className="text-xs text-error-600 font-medium text-center">
              {error}
            </p>
          </div>
        )}

        <Button type="submit" block loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-neutral-50 lg:bg-white px-2 text-neutral-400">
            Or continue with
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
        Sign in with Google
      </Button>

      <p className="mt-8 text-center text-sm text-neutral-500 font-normal">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-medium">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
