import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const AUTH_ROUTES = ['/profile', '/orders', '/checkout', '/wishlist'];

// Admin routes
const ADMIN_ROUTES = ['/admin'];

// Auth pages (redirect away if already logged in)
const AUTH_PAGES = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read JWT token from cookie
  const token = request.cookies.get('yel_aura_token')?.value;

  const isProtectedRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthPage = AUTH_PAGES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to login if accessing admin without token
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/wishlist/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
