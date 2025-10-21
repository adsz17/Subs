import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { isAdminOrStaff } from '@/lib/rbac';
import { priceSchema } from '@/lib/validations';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminOrStaff((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const data = await req.json();
  const parsed = priceSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const price = await prisma.price.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(price);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminOrStaff((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  await prisma.price.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
