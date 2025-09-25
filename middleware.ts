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
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    const callbackPath = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    loginUrl.searchParams.set('next', callbackPath);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
