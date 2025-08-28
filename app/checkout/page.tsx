import { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { authOptions } from '@/lib/auth';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login?redirect=/checkout');
  }
  return (
    <Suspense fallback={null}>
      <CheckoutClient />
    </Suspense>
  );
}

