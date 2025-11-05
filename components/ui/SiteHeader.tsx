'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, Sparkles, X } from 'lucide-react';

import { ThemeToggle } from './ThemeToggle';
import { useCartStore } from '@/lib/cart/store';

const navigation = [
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#proyectos', label: 'Proyectos' },
  { href: '/#precios', label: 'Precios' },
  { href: '/#contacto', label: 'Contacto' },
];

export function SiteHeader() {
  const { items } = useCartStore();
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/20 bg-surface/80 shadow-soft backdrop-blur-md transition-colors dark:border-white/10">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-full border border-white/30 bg-surface/80 px-4 py-2 text-sm font-semibold text-ink shadow-soft backdrop-blur-sm transition hover:border-white/60 hover:shadow-lg dark:border-white/10 dark:text-ink/90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-cta text-primary-foreground shadow-soft transition group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-lg font-serif tracking-tight">Subs Agencia</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-ink md:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              href="/carrito"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-cta px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Empieza ahora
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">{count}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-surface/70 text-ink shadow-soft transition hover:border-white/70 hover:shadow-lg"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        role="presentation"
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[90vw] border-l border-white/10 bg-surface/95 p-6 shadow-soft transition-transform duration-300 ease-in-out backdrop-blur-xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal={isOpen}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-ink">Menú</span>
          <button
            type="button"
            onClick={closeMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-surface/70 text-ink shadow-soft transition hover:border-white/60 hover:shadow-lg"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-4 text-base font-medium text-muted-ink">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="rounded-md px-2 py-2 transition hover:bg-surface-muted/80 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/carrito"
            onClick={closeMenu}
            className="inline-flex items-center justify-between gap-2 rounded-xl bg-gradient-cta px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-xl"
          >
            Empieza ahora
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">{count}</span>
          </Link>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-surface-muted/60 px-3 py-3">
            <span className="text-sm font-medium text-muted-ink">Modo</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </header>
  );
}
