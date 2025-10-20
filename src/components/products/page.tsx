
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RootState, AppDispatch } from '@/store';
import { fetchProducts, deleteProduct, setCurrentPage, deleteProductLocal } from '@/store/productsSlice';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { ProductsTable } from '@/app/products/ProductsTable';
import { SearchInput } from '@/app/products/SearchInput';
import { Pagination } from '@/app/products/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

const PAGE_SIZE = 10;

export default function ProductsPage() {
  useProtectedRoute();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { products, totalPages, currentPage, searchTerm, loading, error } = useSelector((state: RootState) => state.products);
  const { token } = useSelector((state: RootState) => state.auth);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Initial fetch on mount
 useEffect(() => {
  console.log('Products useEffect: token=', token, 'page=', currentPage, 'search=', searchTerm);
  if (token) {
    dispatch(fetchProducts({ page: currentPage, search: searchTerm }));
  }
}, [token, currentPage, searchTerm, dispatch]);

  const handleEdit = (id: string) => {
    router.push(`/products/edit/${id}`);
  };

  const handleDeleteOpen = (id: string) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    dispatch(deleteProductLocal(productToDelete));
    try {
      await dispatch(deleteProduct(productToDelete));
      dispatch(fetchProducts({ page: currentPage, search: searchTerm }));
    } catch {
      dispatch(fetchProducts({ page: currentPage, search: searchTerm }));
    }
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const startItem = (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, products.length + (currentPage - 1) * PAGE_SIZE);
  const totalItems = totalPages * PAGE_SIZE;

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {startItem}-{endItem} of {totalItems} results
          </p>
        </div>

        {error && <ErrorMessage message={error} className="mb-6" />}

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput />
          <Link href="/products/create">
            <Button className="ml-auto sm:ml-0">Create New Product</Button>
          </Link>
        </div>

        <ProductsTable
          products={products}
          loading={loading}
          error={null}
          onEdit={handleEdit}
          onDelete={handleDeleteOpen}
        />

        <Pagination totalPages={totalPages} currentPage={currentPage} />

        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete"
          confirmAction={handleDeleteConfirm}
          confirmText="Delete"
        >
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
        </Modal>
      </div>
    </div>
  );
}