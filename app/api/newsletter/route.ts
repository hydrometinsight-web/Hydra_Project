import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'
import { sanitizeEmail } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`newsletter:${clientId}`, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5, // 5 subscription attempts per minute
    })

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
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

    // Sanitize and validate email
    const sanitizedEmail = sanitizeEmail(email)
    if (!sanitizedEmail) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await prisma.newsletter.findUnique({
      where: { email: sanitizedEmail },
    })

    if (existing) {
      if (existing.active) {
        return NextResponse.json({ message: 'You are already subscribed to our newsletter' }, { status: 200 })
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email: sanitizedEmail },
          data: { active: true },
        })
        return NextResponse.json({ message: 'Successfully resubscribed to newsletter' }, { status: 200 })
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: {
        email: sanitizedEmail,
        active: true,
      },
    })

    return NextResponse.json({ message: 'Successfully subscribed to newsletter' }, { status: 201 })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json({ error: 'Failed to subscribe to newsletter' }, { status: 500 })
  }
}

