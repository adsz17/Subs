import { NextRequest, NextResponse } from 'next/server';
import { getPaymentsProvider } from '@/lib/payments';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const provider = getPaymentsProvider(process.env.PAYMENT_PROVIDER);
  const session = await provider.createCheckout(body);
  return NextResponse.json(session);
}
