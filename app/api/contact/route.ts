import { NextRequest, NextResponse } from 'next/server'

// Simple rate limiting (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 5 // Max 5 requests
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  return ip
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 1000)
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 255)
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getRateLimitKey(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name)
    const sanitizedEmail = sanitizeEmail(email)
    const sanitizedSubject = sanitizeString(subject)
    const sanitizedMessage = sanitizeString(message)

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    // Here you would typically send an email or save to database
    // For now, we'll just return success
    // TODO: Implement email sending (e.g., using Resend, SendGrid, etc.)
    // TODO: Optionally save to database for record keeping

    console.log('Contact form submission:', {
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { 
        message: 'Thank you for your message. We will get back to you soon!',
        success: true 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

