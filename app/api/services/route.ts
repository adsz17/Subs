import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { serviceSchema } from '@/lib/validations';

export async function GET() {
  const services = await prisma.service.findMany({ include: { prices: true } });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
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
