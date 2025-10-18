
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div className={cn('flex items-center justify-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-md bg-red-50', className)}>
      {message}
    </div>
  );
}