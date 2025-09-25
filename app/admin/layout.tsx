import type { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { authOptions } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false }
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session || session.user.role !== 'ADMIN') {
    const headersList = headers();
    const invokePath = headersList.get('x-invoke-path');
    const invokeQuery = headersList.get('x-invoke-query');
    const pathWithQuery = invokePath ? `${invokePath}${invokeQuery ? `?${invokeQuery}` : ''}` : '/admin';
    redirect(`/login?next=${encodeURIComponent(pathWithQuery)}`);
  }
  return (
    <div className={`${playfair.variable} ${inter.variable}`}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
