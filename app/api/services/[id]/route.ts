import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { serviceSchema } from '@/lib/validations';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: { prices: true }
  });
  return NextResponse.json(service);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const service = await prisma.service.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(service);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
