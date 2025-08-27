import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(function middleware(req) {
  const role = req.nextauth?.token?.role as string | undefined;
  if (req.nextUrl.pathname.startsWith('/admin') && role !== 'ADMIN' && role !== 'STAFF') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = { matcher: ['/admin/:path*'] };
