import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <nav className="mb-6 flex gap-4">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/servicios">Servicios</Link>
        <Link href="/admin/precios">Precios</Link>
      </nav>
      {children}
    </div>
  );
}
