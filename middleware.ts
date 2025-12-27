import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Additional security headers (next.config.js already sets most headers)
  // These can override or supplement the config headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY') // Override SAMEORIGIN for better security
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Block access to sensitive files and directories
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/.env') ||
    pathname.startsWith('/.git') ||
    pathname.includes('node_modules') ||
    pathname.startsWith('/.next') ||
    pathname.startsWith('/prisma') ||
    pathname.includes('package.json') ||
    pathname.includes('package-lock.json')
  ) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
}

