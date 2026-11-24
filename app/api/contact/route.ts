import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, emailLayout, escapeHtml, CONTACT_TO } from '@/lib/email'

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

    // Forward the message to the site inbox; replying goes straight to the sender
    const result = await sendEmail({
      to: CONTACT_TO,
      replyTo: sanitizedEmail,
      subject: `[Contact] ${sanitizedSubject}`,
      text: `From: ${sanitizedName} <${sanitizedEmail}>\nSubject: ${sanitizedSubject}\n\n${sanitizedMessage}`,
      html: emailLayout(
        'New message from the contact form',
        `<p><strong>From:</strong> ${escapeHtml(sanitizedName)} &lt;${escapeHtml(sanitizedEmail)}&gt;<br>
<strong>Subject:</strong> ${escapeHtml(sanitizedSubject)}</p>
<div style="white-space:pre-wrap;border-left:3px solid #93D419;padding-left:12px">${escapeHtml(sanitizedMessage)}</div>
<p style="color:#6b7280;font-size:13px">Reply to this email to answer ${escapeHtml(sanitizedName)} directly.</p>`
      ),
    })

    if (!result.ok) {
      console.error('Contact form email failed:', result.error, {
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
      })
      return NextResponse.json(
        { error: 'Sorry, your message could not be sent right now. Please email us at ' + CONTACT_TO + '.' },
        { status: 503 }
      )
    }

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

