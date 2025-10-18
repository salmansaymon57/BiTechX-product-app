// src/components/ui/Loader.tsx
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ className, size = 'md' }: LoaderProps) {
  return (
    <div className={cn('inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent', {
      'h-4 w-4': size === 'sm',
      'h-8 w-8': size === 'md',
      'h-12 w-12': size === 'lg',
    }, className)} />
  );
}