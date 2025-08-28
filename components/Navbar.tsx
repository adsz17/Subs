'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const links = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#precios', label: 'Precios' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#contacto', label: 'Contacto' }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" aria-label="Main navigation">
        <Link href="/" className="font-serif text-xl font-bold">Servicios SaaS</Link>
        <button className="sm:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          ☰
        </button>
        <ul
          className={cn(
            'text-sm',
            open
              ? 'absolute left-0 right-0 top-full flex flex-col items-center gap-4 bg-white p-4 shadow-md'
              : 'hidden',
            'sm:static sm:flex sm:flex-row sm:gap-6 sm:bg-transparent sm:p-0'
          )}
        >
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="hover:underline" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contacto"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700"
              onClick={() => setOpen(false)}
            >
              Contactar
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
