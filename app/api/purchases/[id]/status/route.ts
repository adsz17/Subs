import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { status } = await req.json();
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const purchase = await prisma.purchase.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json(purchase);
}
