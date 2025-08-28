import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { env } from './env.mjs';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: env.NEXTAUTH_SECRET });
  if (token?.role !== 'ADMIN') {
    const loginUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
