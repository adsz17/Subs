import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { cartId, txHash, network } = await req.json();
  if (!cartId || !txHash || !network) {
    return NextResponse.json(
      { error: 'cartId, txHash and network required' },
      { status: 400 },
    );
  }
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          service: {
            include: { prices: { where: { isCurrent: true }, take: 1 } },
          },
        },
      },
    },
  });
  if (!cart) {
    return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
  }
  const purchase = await prisma.purchase.create({
    data: {
      status: 'PENDING',
      txHash,
      network,
      items: {
        create: cart.items.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
          unitPriceCents: item.service.prices[0]?.amountCents || 0,
          currency: item.service.prices[0]?.currency || 'USD',
        })),
      },
    },
    include: { items: true },
  });
  await prisma.cartItem.deleteMany({ where: { cartId } });
  await prisma.cart.delete({ where: { id: cartId } });
  const res = NextResponse.json(purchase);
  res.cookies.delete('cartId');
  return res;
}
