
'use client';

import { Button } from '@/components/ui/Button';
import { useDispatch } from 'react-redux';
import { setCurrentPage, fetchProducts } from '@/store/productsSlice';
import { AppDispatch } from '@/store';
import { useSelector } from 'react-redux';
import { RootState } from '@/store'; // Keep for selector if needed, but remove if unused

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTerm } = useSelector((state: RootState) => state.products); // Use if needed for search persistence

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchProducts({ page, search: searchTerm }));
  };

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}