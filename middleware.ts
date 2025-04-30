import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Safe IP extraction
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  // Rate limiting
  try {
    const { success, limit, remaining, reset } = await rateLimit(ip);
    if (!success) {
      const response = new NextResponse('Too Many Requests', { status: 429 });
      response.headers.set('X-RateLimit-Limit', (limit || 100).toString());
      response.headers.set('X-RateLimit-Remaining', (remaining || 0).toString());
      response.headers.set('X-RateLimit-Reset', (reset || Math.ceil(Date.now() / 1000)).toString());
      return response;
    }
  } catch (err) {
    console.error('Rate limiting failed:', err);
    // Continue with the request if rate limiting fails
    return NextResponse.next();
  }

  // Auth handling
  const token = await getToken({ req: request });
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/auth');
  const isApiRoute = pathname.startsWith('/api');

  if (isProtectedRoute && !token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/signin';
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Add security headers for API requests
  if (isApiRoute) {
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.propinfera.com; frame-ancestors 'none';"
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/auth/:path*'],
};
