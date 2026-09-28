import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from './lib/auth/token-cookie';

// Edge middleware cannot read the client-side Zustand store (it runs on the
// server, where the store is always empty), so it checks the auth cookie that
// the store writes on login/register instead. This is only a routing guard;
// the API still validates the token on every request.
export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/notifications/:path*'],
};
