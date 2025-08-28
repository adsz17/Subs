import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export async function POST(req: Request) {
  const { items = [] } = await req.json();
  const config = await prisma.paymentsConfig.findUnique({ where: { id: 1 } });
  const total = items.reduce((sum: number, i: any) => sum + i.price * i.qty, 0);
  const order = await prisma.order.create({
    data: {
      email: 'guest@example.com',
      status: OrderStatus.PENDING,
      subtotalCents: Math.round(total * 100),
      totalCents: Math.round(total * 100),
      currency: 'USDT',
      network: config?.network || '',
      wallet: config?.wallet || '',
      provider: 'manual'
    }
  });
  return NextResponse.json({ id: order.id });
}

