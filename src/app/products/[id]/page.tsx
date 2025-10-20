
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { fetchSingleProduct, deleteProduct } from '@/store/productsSlice';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import Link from 'next/link';
import Image from 'next/image'; // Add for optimization

export default function ProductDetailsPage() {
  useProtectedRoute();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { singleProduct, loading, error } = useSelector((state: RootState) => state.products);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [id, dispatch]);

  const handleEdit = () => {
    router.push(`/products/edit/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    try {
      await dispatch(deleteProduct(id));
      router.push('/products');
      router.refresh();
    } catch {
      // Error handled in thunk
    }
    setDeleteModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !singleProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error || 'Product not found'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/products" className="text-blue-600 hover:text-blue-500 text-sm font-medium mb-2 inline-block">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {singleProduct.imageUrl && (
            <Image
              src={singleProduct.imageUrl}
              alt={singleProduct.name}
              width={400} // Adjust based on design
              height={192} // 48*4 ratio
              className="w-full h-48 object-cover"
              priority // For LCP
            />
          )}

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{singleProduct.name}</h2>
            <p className="text-gray-600 mb-4">{singleProduct.description || 'No description available.'}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-500">Price:</span>
                <p className="text-xl font-semibold text-gray-900">${singleProduct.price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Category:</span>
                <p className="text-gray-900">{singleProduct.category}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleEdit} className="flex-1 sm:flex-none">
                Edit Product
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(true)}
                className="flex-1 sm:flex-none bg-red-50 text-red-700 border-red-200 hover:bg-red-50"
              >
                Delete Product
              </Button>
            </div>
          </div>
        </div>

        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete"
          confirmAction={handleDeleteConfirm}
          confirmText="Delete"
          cancelText="Cancel"
        >
          <p className="text-sm text-gray-500">
            Are you sure you want to delete &quot;{singleProduct.name}&quot;? This action cannot be undone.
          </p>
        </Modal>
      </div>
    </div>
  );
}