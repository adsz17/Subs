import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { priceSchema } from '@/lib/validations';

export async function GET() {
  const prices = await prisma.price.findMany();
  return NextResponse.json(prices);
}

export async function POST(req: Request) {
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
