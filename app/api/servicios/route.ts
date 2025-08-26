import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const servicios = await prisma.service.findMany({ include: { prices: { where: { isCurrent: true }, take: 1 } } });
  return NextResponse.json(servicios);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, slug, description } = body;
  const s = await prisma.service.create({ data: { name, slug, description } });
  return NextResponse.json(s);
}
