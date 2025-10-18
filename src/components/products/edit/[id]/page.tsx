// src/app/products/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { fetchSingleProduct, updateProduct } from '@/store/productsSlice';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductFormData } from '@/lib/validations';
import { Loader } from '@/components/ui/Loader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { AxiosError } from 'axios'; // Add for error typing

export default function EditProductPage() {
  useProtectedRoute();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { singleProduct, loading, error } = useSelector((state: RootState) => state.products);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState<Partial<ProductFormData> | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (singleProduct) {
      setDefaultValues({
        name: singleProduct.name,
        description: singleProduct.description,
        price: singleProduct.price,
        category: singleProduct.category,
      });
    }
  }, [singleProduct]);

  const handleSubmit = async (data: ProductFormData) => {
    if (!id) return;
    setLocalLoading(true);
    setLocalError(null);
    try {
      await dispatch(updateProduct({ id, data }));
      router.push('/products');
      router.refresh();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>; // Fix: Type guard
      setLocalError(error.message || 'Failed to update product');
    } finally {
      setLocalLoading(false);
    }
  };

  if (loading && !singleProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!defaultValues) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message="Product not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>
        <ProductForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          loading={localLoading}
          error={(localError || error) || undefined}
          submitText="Update Product"
        />
      </div>
    </div>
  );
}