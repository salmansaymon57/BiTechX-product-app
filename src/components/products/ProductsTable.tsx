// src/components/products/ProductsTable.tsx
'use client';

import { Product } from '@/store/productsSlice';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, loading, error, onEdit, onDelete }: ProductsTableProps) {
  if (loading) return <div className="flex justify-center py-8"><Loader size="lg" /></div>;
  if (error) return <ErrorMessage message={error} />;

  if (products.length === 0) return <p className="text-center py-8 text-gray-500">No products found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button variant="ghost" onClick={() => onEdit(product.id)} size="sm">Edit</Button>
                <Button variant="ghost" onClick={() => onDelete(product.id)} size="sm" className="text-red-600 hover:text-red-900">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Mobile Grid Variant (use conditionally, e.g., via CSS media queries or JS)
export function ProductsGrid({ products, loading, error, onEdit, onDelete }: ProductsTableProps) {
  if (loading || error) return <ProductsTable {...{ products, loading, error, onEdit, onDelete }} />; // Fallback to table on error/load

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-gray-500">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-400">{product.category}</p>
          <div className="mt-2 space-x-2">
            <Button variant="ghost" onClick={() => onEdit(product.id)} size="sm">Edit</Button>
            <Button variant="ghost" onClick={() => onDelete(product.id)} size="sm" className="text-red-600">Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
}