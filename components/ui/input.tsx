import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-xl border border-[hsl(var(--color-muted-ink)/0.28)] bg-[hsl(var(--color-surface)/0.85)] px-4 py-2 text-sm text-ink shadow-inner transition focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-[hsl(var(--color-muted-ink)/0.65)] dark:border-[hsl(var(--color-muted-ink)/0.32)] dark:bg-[hsl(var(--color-surface-muted)/0.55)]',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';
