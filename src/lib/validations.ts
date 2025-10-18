// src/lib/validations.ts (updated schema)
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0').max(10000, 'Price too high'),
  category: z.string().min(1, 'Category is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;