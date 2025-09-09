'use client';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { useCartStore } from '@/lib/cart/store';

export function SiteHeader() {
  const { items } = useCartStore();
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold">
          Subs
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/compras" className="text-sm font-medium">
            Mis compras
          </Link>
          <Link
            href="/carrito"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Carrito ({count})
          </Link>
        </div>
      </div>
    </header>
  );
}
