import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const role = req.cookies.get('role')?.value;

  // Admin routes protection
  if (req.nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Organizer routes protection
  if (
    req.nextUrl.pathname.startsWith('/dashboard/organizer') &&
    !['organizer', 'admin'].includes(role || '')
  ) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // User dashboard protection
  if (req.nextUrl.pathname.startsWith('/dashboard/user') && !role) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
