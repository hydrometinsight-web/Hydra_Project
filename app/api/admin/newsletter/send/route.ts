import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { campaignId } = await request.json()

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }

    // Get campaign
    const campaign = await prisma.newsletterCampaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (campaign.status === 'sent' || campaign.status === 'sending') {
      return NextResponse.json({ error: 'Campaign already sent or is being sent' }, { status: 400 })
    }

    // Get active subscribers
    const subscribers = await prisma.newsletter.findMany({
      where: { active: true },
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 })
    }

    // Update campaign status to sending
    await prisma.newsletterCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'sending',
        recipients: subscribers.length,
      },
    })

    // In a production environment, you would:
    // 1. Use an email service (SendGrid, Mailgun, AWS SES, etc.)
    // 2. Queue emails for sending
    // 3. Track opens and clicks
    // 4. Handle bounces and unsubscribes

    // For now, we'll simulate sending
    // In production, replace this with actual email sending logic
    console.log(`[Newsletter] Sending campaign "${campaign.subject}" to ${subscribers.length} subscribers`)
    
    // Simulate email sending (replace with actual email service)
    subscribers.forEach((subscriber) => {
      console.log(`[Newsletter] Would send to: ${subscriber.email}`)
      // In production: await sendEmail(subscriber.email, campaign.subject, campaign.content, campaign.htmlContent)
    })

    // Update campaign status to sent
    await prisma.newsletterCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    })

    return NextResponse.json({
      message: `Newsletter sent to ${subscribers.length} subscribers`,
      recipients: subscribers.length,
    })
  } catch (error: any) {
    console.error('Error sending newsletter:', error)
    
    // Update campaign status to failed
    try {
      await prisma.newsletterCampaign.update({
        where: { id: campaignId },
        data: { status: 'failed' },
      })
    } catch {
      // Ignore update errors
    }

    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}

