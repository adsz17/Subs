import * as React from 'react';
import { cn } from '@/lib/utils';

const variants: Record<'default' | 'success' | 'destructive', string> = {
  default: 'border-slate-200/60 bg-white/70 text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-50',
  success:
    'border-green-500/50 bg-green-500/10 text-green-800 dark:border-green-400/40 dark:bg-green-400/10 dark:text-green-200',
  destructive:
    'border-red-500/60 bg-red-500/10 text-red-800 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-200',
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'destructive';
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        'relative w-full rounded-md border px-4 py-3 text-sm shadow-sm [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3 [&>svg]:text-current',
        variants[variant],
        className
      )}
      {...props}
    />
  )
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
  )
);
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm leading-relaxed', className)} {...props} />
  )
);
AlertDescription.displayName = 'AlertDescription';
