// src/app/login/page.tsx (full corrected file)
'use client';

import { useState, useEffect } from 'react'; // Ensure useEffect imported
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '@/store/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('symansalman@gmail.com'); // Pre-fill
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, token } = useSelector((state: RootState) => state.auth); // Select token at component level

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!email.includes('@')) {
      setLocalError('Please enter a valid email');
      return;
    }
    const resultAction = await dispatch(login({ email }));
    if (login.fulfilled.match(resultAction)) {
      // No redirect here—useEffect handles it
    } else {
      setLocalError(error || 'Login failed');
    }
  };

  // Move useEffect to component body (top-level, not inside handleSubmit or conditional)
  useEffect(() => {
    if (token && !loading) {
      router.push('/products');
    }
  }, [token, loading, router]); // Watch token and loading to avoid premature redirect

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>
          {(localError || error) && (
            <div className="text-red-600 text-sm text-center">{localError || error}</div>
          )}
          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}