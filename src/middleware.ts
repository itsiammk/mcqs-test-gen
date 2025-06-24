import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

const protectedRoutes = ['/dashboard', '/history'];

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If user is trying to access auth pages but is already logged in, redirect to dashboard
  if (session && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not logged in and tries to access a protected page, redirect to login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

export const config = {
  // Match all routes except for static assets, API routes, and special Next.js files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
