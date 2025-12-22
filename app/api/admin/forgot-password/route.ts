import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeEmail } from '@/lib/validation'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`forgot-password:${clientId}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // 3 requests per hour
    })

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email)
    if (!sanitizedEmail) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    })

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Delete any existing reset tokens for this email
    await prisma.passwordReset.deleteMany({
      where: {
        email: sanitizedEmail,
        used: false,
      },
    })

    // Create new reset token
    await prisma.passwordReset.create({
      data: {
        email: sanitizedEmail,
        token,
        expiresAt,
      },
    })

    // In a production environment, you would send an email here
    // For now, we'll return the token (only for development)
    // In production, remove the token from the response
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`

    // Log the reset request (for security monitoring)
    console.log(`[Password Reset] Request for: ${sanitizedEmail}, Token: ${token.substring(0, 8)}...`)

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      // DEVELOPMENT ONLY: Remove this in production
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
      token: process.env.NODE_ENV === 'development' ? token : undefined,
    })
  } catch (error) {
    console.error('Error processing password reset request:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}

