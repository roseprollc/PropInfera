import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success } = await rateLimit(ip);
  
  if (!success) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Authentication check for protected routes
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // API route protection
  if (isApiRoute) {
    const response = NextResponse.next();
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/auth/:path*',
  ],
}; 