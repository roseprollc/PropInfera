import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getEnv } from './lib/env';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/renters',
  '/airbnb',
  '/wholesale',
  '/api/reports',
  '/api/tiers',
  '/api/agent',
  '/api/scrape'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/api/auth',
  '/login',
  '/signup',
  '/pricing',
  '/auth/error'
];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: getEnv('NEXTAUTH_SECRET'),
  });

  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Allow public API routes
    if (request.nextUrl.pathname.startsWith('/api/public/')) {
      return NextResponse.next();
    }

    // Protect all other API routes
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // Check if the request is for a protected page
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/settings')
  ) {
    if (!token) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/api/:path*',
  ],
};
