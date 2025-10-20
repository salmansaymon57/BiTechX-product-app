
'use client';

import { useEffect } from 'react'; // Add this import
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';

export interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  defaultValues?: Partial<ProductFormData>;
  loading?: boolean;
  error?: string;
  submitText?: string;
}

export function ProductForm({ onSubmit, defaultValues, loading = false, error, submitText = 'Save' }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const handleFormSubmit: SubmitHandler<ProductFormData> = async (data) => { // Explicitly type as SubmitHandler<ProductFormData>
    await onSubmit(data);
    reset(); // Clear form on success
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-md">
      {error && <ErrorMessage message={error} />}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <Input {...register('name')} placeholder="Product name" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <Input {...register('description')} placeholder="Optional description" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <Input 
          type="number" 
          step="0.01" 
          {...register('price', { valueAsNumber: true })} 
          placeholder="0.00" 
        />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <Input {...register('category')} placeholder="e.g., Electronics" />
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader size="sm" className="text-white" /> : submitText}
      </Button>
    </form>
  );
}