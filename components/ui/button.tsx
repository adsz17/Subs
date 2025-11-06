import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon' | 'sm';
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90',
  outline:
    'border border-[hsl(var(--color-muted-ink)/0.28)] bg-[hsl(var(--color-surface)/0.82)] text-ink hover:border-primary/45 hover:bg-[hsl(var(--color-surface)/0.92)] hover:text-primary',
  ghost:
    'text-muted-ink hover:text-ink hover:bg-[hsl(var(--color-surface)/0.65)] dark:hover:bg-[hsl(var(--color-surface-muted)/0.55)]'
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-11 px-5',
  sm: 'h-9 px-4 text-sm',
  icon: 'h-10 w-10'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = 'default', size = 'default', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
