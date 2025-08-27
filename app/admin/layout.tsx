import type { ReactNode } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }
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
