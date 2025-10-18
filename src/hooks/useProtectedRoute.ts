// src/hooks/useProtectedRoute.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function useProtectedRoute() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      router.refresh(); // Force reload if needed
    }
  }, [token, router]);
}