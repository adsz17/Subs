import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { isAdminOrStaff } from '@/lib/rbac';
import { serviceSchema } from '@/lib/validations';

export async function GET() {
  const services = await prisma.service.findMany({ include: { prices: true } });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
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
  const service = await prisma.service.create({
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
