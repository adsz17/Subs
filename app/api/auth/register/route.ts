import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { hash } from 'bcryptjs';

const schema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(6)
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
  }
  await prisma.user.create({
    data: {
      email,
      passwordHash: await hash(password, 10)
    }
  });
  return NextResponse.json({ ok: true });
}
