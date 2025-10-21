import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { isAdminOrStaff } from '@/lib/rbac';
import { priceSchema } from '@/lib/validations';

export async function GET() {
  const prices = await prisma.price.findMany();
  return NextResponse.json(prices);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminOrStaff((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const data = await req.json();
  const parsed = priceSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(parsed.error.flatten(), { status: 400 });
  }
  const price = await prisma.price.create({
    data: { ...parsed.data, activeFrom: new Date(), isCurrent: true }
  });
  return NextResponse.json(price);
}
