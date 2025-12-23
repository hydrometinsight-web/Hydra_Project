import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'
import { sanitizeString, sanitizeEmail, validateUrl } from '@/lib/validation'

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimitResult = rateLimit(clientId, { windowMs: 60000, maxRequests: 5 })
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const data = await request.json()
    
    // Sanitize inputs
    const sanitizedData = {
      companyName: sanitizeString(data.companyName, 200),
      contactName: sanitizeString(data.contactName, 100),
      email: sanitizeEmail(data.email),
      phone: data.phone ? sanitizeString(data.phone, 50) : null,
      website: data.website ? (validateUrl(data.website) ? data.website : null) : null,
      companyType: sanitizeString(data.companyType, 50),
      sponsorshipInterest: sanitizeString(data.sponsorshipInterest, 50),
      message: sanitizeString(data.message, 2000),
    }

    // Validate required fields
    if (!sanitizedData.companyName || !sanitizedData.contactName || !sanitizedData.email || !sanitizedData.message) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Save to database (create a SponsorInquiry model)
    // 2. Send email notification
    // 3. Log the inquiry
    
    console.log('Sponsor inquiry received:', sanitizedData)

    return NextResponse.json(
      { message: 'Inquiry submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing sponsor inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    )
  }
}

