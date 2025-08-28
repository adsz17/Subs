import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { serviceId, quantity = 1 } = await req.json();
  if (!serviceId) {
    return NextResponse.json({ error: 'serviceId required' }, { status: 400 });
  }
  let cartId = req.cookies.get('cartId')?.value;
  if (!cartId) {
    const cart = await prisma.cart.create({ data: {} });
    cartId = cart.id;
  }
  const existing = await prisma.cartItem.findFirst({
    where: { cartId, serviceId },
  });
  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({ data: { cartId, serviceId, quantity } });
  }
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { service: true } } },
  });
  const res = NextResponse.json(cart);
  if (!req.cookies.get('cartId')) {
    res.cookies.set('cartId', cartId, { path: '/' });
  }
  return res;
}
