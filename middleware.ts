import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { env } from './env.mjs';

export async function middleware(req: NextRequest) {
  const isAdmin = req.nextUrl.pathname.startsWith('/admin');
  if (!isAdmin) return NextResponse.next();

  const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });
  const role = (token as any)?.role;
  if (!token || !['ADMIN', 'STAFF'].includes(role)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
