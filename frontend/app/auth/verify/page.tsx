'use client';

import React, { Suspense } from 'react';
import { VerifyContent } from './VerifyContent';
import AuthLayout from '../../../components/auth/AuthLayout';

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Loading" subtitle="Please wait...">
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </AuthLayout>
    }>
      <VerifyContent />
    </Suspense>
  );
}
