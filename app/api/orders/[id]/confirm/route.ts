import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { hash, network } = await req.json();
  if (!hash) {
    return NextResponse.json({ error: 'hash required' }, { status: 400 });
  }
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  // update order with provided data
  await prisma.order.update({
    where: { id: params.id },
    data: {
      customerTx: hash,
      network: network || order.network,
      status: 'REVIEW',
    },
  });
  const purchase = await prisma.purchase.create({
    data: {
      txHash: hash,
      network: network || order.network || '',
      status: 'PENDING',
      userId: order.userId,
      items: {
        create: order.items.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
          unitPriceCents: item.unitAmountCents,
          currency: item.currency,
        })),
      },
    },
  });
  return NextResponse.json(purchase);
}
