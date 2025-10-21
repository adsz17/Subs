import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { isAdminOrStaff } from '@/lib/rbac';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminOrStaff((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const config = await prisma.paymentsConfig.findUnique({ where: { id: 1 } });
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminOrStaff((session.user as any).role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const data = await req.json();
  const config = await prisma.paymentsConfig.upsert({
    where: { id: 1 },
    update: data,
    create: {
      id: 1,
      network: data.network,
      wallet: data.wallet,
      qrUrl: data.qrUrl,
      provider: data.provider || 'manual'
    }
  });
  return NextResponse.json(config);
}

