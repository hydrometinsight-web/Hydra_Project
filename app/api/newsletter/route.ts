import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.active) {
        return NextResponse.json({ message: 'You are already subscribed to our newsletter' }, { status: 200 })
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: { active: true },
        })
        return NextResponse.json({ message: 'Successfully resubscribed to newsletter' }, { status: 200 })
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: {
        email,
        active: true,
      },
    })

    return NextResponse.json({ message: 'Successfully subscribed to newsletter' }, { status: 201 })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json({ error: 'Failed to subscribe to newsletter' }, { status: 500 })
  }
}

