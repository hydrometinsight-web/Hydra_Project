import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { sendEmailBatch, emailLayout, escapeHtml, unsubscribeUrl } from '@/lib/email'

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

  let campaignId: string | null = null

  try {
    const body = (await request.json()) as { campaignId?: string }
    campaignId = body.campaignId ?? null

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

    // Send one email per subscriber (nobody sees other subscribers' addresses)
    const html = campaign.htmlContent || `<div style="white-space:pre-wrap">${escapeHtml(campaign.content)}</div>`
    const messages = subscribers.map((subscriber) => {
      const unsub = unsubscribeUrl(subscriber.id)
      return {
        to: subscriber.email,
        subject: campaign.subject,
        html: emailLayout(
          campaign.subject,
          html,
          `You receive this because you subscribed to the HydroMetInsight newsletter. <a href="${unsub}" style="color:#6b7280">Unsubscribe</a>`
        ),
        text: `${campaign.content}\n\n---\nUnsubscribe: ${unsub}`,
        headers: {
          'List-Unsubscribe': `<${unsub}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      }
    })

    console.log(`[Newsletter] Sending campaign "${campaign.subject}" to ${subscribers.length} subscribers`)
    const result = await sendEmailBatch(messages)

    if (result.sent === 0) {
      await prisma.newsletterCampaign.update({
        where: { id: campaignId },
        data: { status: 'failed' },
      })
      return NextResponse.json(
        { error: result.skipped ? 'Email sending is not configured (RESEND_API_KEY missing)' : 'Failed to send newsletter' },
        { status: 500 }
      )
    }

    // Update campaign status to sent
    await prisma.newsletterCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'sent',
        sentAt: new Date(),
        recipients: result.sent,
      },
    })

    return NextResponse.json({
      message: result.failed
        ? `Newsletter sent to ${result.sent} of ${subscribers.length} subscribers (${result.failed} failed)`
        : `Newsletter sent to ${result.sent} subscribers`,
      recipients: result.sent,
    })
  } catch (error: any) {
    console.error('Error sending newsletter:', error)
    
    // Update campaign status to failed
    if (campaignId) {
      try {
        await prisma.newsletterCampaign.update({
          where: { id: campaignId },
          data: { status: 'failed' },
        })
      } catch {
        // Ignore update errors
      }
    }

    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}

