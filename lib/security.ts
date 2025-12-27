// Security utilities and middleware

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { rateLimit, getClientIdentifier } from './rateLimit'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export interface AuthUser {
  userId: string
  role: string
}

/**
 * Verify JWT token from request
 */
export async function verifyToken(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch {
    return null
  }
}

/**
 * Middleware to require admin authentication
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

/**
 * Apply rate limiting to a request
 */
export function applyRateLimit(
  request: NextRequest,
  identifier: string,
  options: { windowMs: number; maxRequests: number } = { windowMs: 60000, maxRequests: 10 }
): NextResponse | null {
  const clientId = getClientIdentifier(request)
  const rateLimitResult = rateLimit(`${identifier}:${clientId}`, options)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}

/**
 * Validate request body is JSON and not too large
 */
export async function validateRequestBody(request: NextRequest, maxSize: number = 1024 * 1024): Promise<any> {
  const contentType = request.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Content-Type must be application/json')
  }

  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > maxSize) {
    throw new Error(`Request body too large. Maximum size is ${maxSize} bytes`)
  }

  try {
    const body = await request.json()
    return body
  } catch (error) {
    throw new Error('Invalid JSON in request body')
  }
}

/**
 * Security headers for responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  }
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  const headers = getSecurityHeaders()
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

