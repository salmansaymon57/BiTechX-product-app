
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/Input';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, fetchProducts } from '@/store/productsSlice';
import { RootState, AppDispatch } from '@/store';

interface SearchInputProps {
  debounceDelay?: number;
}

export function SearchInput({ debounceDelay = 300 }: SearchInputProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTerm } = useSelector((state: RootState) => state.products);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, debounceDelay);

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearch));
    dispatch(fetchProducts({ page: 1, search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search by name..."
        value={localSearch}
        onChange={handleChange}
        className="pl-10 pr-4 py-2"
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
    </div>
  );
}