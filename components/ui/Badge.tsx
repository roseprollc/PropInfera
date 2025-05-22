import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-green-800 text-green-200',
    secondary: 'bg-gray-800 text-gray-200',
    outline: 'border border-gray-800 text-gray-200',
    destructive: 'bg-red-800 text-red-200'
  };

  return (
    <span className={cn(
      'inline-block px-2 py-0.5 text-xs font-medium rounded-full',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
} 