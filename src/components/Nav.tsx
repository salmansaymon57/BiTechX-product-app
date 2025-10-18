
'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/store/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Nav() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const userEmail = useSelector((state: RootState) => state.auth.userEmail);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!token) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/products" className="text-xl font-bold text-gray-900">Products</Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}