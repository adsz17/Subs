import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { isAdminOrStaff } from '@/lib/rbac';
import { serviceSchema } from '@/lib/validations';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: { prices: true }
  });
  return NextResponse.json(service);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminOrStaff((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const data = await req.json();
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const { name, slug, description, content, imageUrl, isActive } = parsed.data;
  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      name,
      slug,
      description,
      content,
      imageUrl,
      isActive,
    },
  });
  return NextResponse.json(service);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminOrStaff((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
