'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { createProduct } from '@/store/productsSlice';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductFormData } from '@/lib/validations';
import { Loader } from '@/components/ui/Loader';
import { AxiosError } from 'axios';

export default function CreateProductPage() {
  useProtectedRoute();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.products);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (data: ProductFormData) => {
    setLocalLoading(true);
    setLocalError(null);
    try {
      await dispatch(createProduct(data));
      router.push('/products');
      router.refresh();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>; // Fix: Type guard
      setLocalError(error.message || 'Failed to create product');
    } finally {
      setLocalLoading(false);
    }
  };

  if (loading && !localLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Product</h1>
        </div>
        <ProductForm
          onSubmit={handleSubmit}
          loading={localLoading}
          error={(localError || error) || undefined}
          submitText="Create Product"
        />
      </div>
    </div>
  );
}