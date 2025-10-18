// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) { // Fix: Use ClassValue[]
  return twMerge(clsx(inputs));
}