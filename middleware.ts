import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      url.pathname = '/api/auth/signin';
      return NextResponse.redirect(url);
    }
  }
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  return res;
}

export const config = {
  matcher: ['/(.*)']
};
