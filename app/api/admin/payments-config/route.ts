import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const config = await prisma.paymentsConfig.findUnique({ where: { id: 1 } });
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
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

