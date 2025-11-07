import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useAuthStore } from './store/auth';

export function middleware(request: NextRequest) {
  const { token } = useAuthStore.getState();

  if (!token && request.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
