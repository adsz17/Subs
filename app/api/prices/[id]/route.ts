import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { priceSchema } from '@/lib/validations';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const parsed = priceSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const price = await prisma.price.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(price);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.price.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
