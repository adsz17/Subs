import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({ email: z.string().trim().email().toLowerCase() });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email') || '';
  const parsed = schema.safeParse({ email });
  if (!parsed.success) {
    return NextResponse.json({ exists: false, error: 'Email inválido' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  return NextResponse.json({ exists: Boolean(user) });
}
