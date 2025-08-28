import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const role = req.cookies.get('role')?.value;
  if (role !== 'ADMIN') {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
