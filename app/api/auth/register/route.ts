import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { hash } from 'bcryptjs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
  }
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: await hash(parsed.data.password, 10)
    }
  });
  return NextResponse.json({ ok: true });
}
