import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

interface Params { params: { id: string } }

export async function POST(req: Request, { params }: Params) {
  const { hash } = await req.json();
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { customerTx: hash, status: OrderStatus.REVIEW }
  });
  return NextResponse.json(order);
}

