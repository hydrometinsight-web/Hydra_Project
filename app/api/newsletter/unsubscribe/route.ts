import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyUnsubscribeToken, SITE_URL } from '@/lib/email'

export const dynamic = 'force-dynamic'

function page(title: string, text: string, status = 200) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | HydroMetInsight</title></head>
<body style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;color:#111827;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">
<div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:32px;max-width:420px;text-align:center">
<h1 style="font-size:20px;margin:0 0 12px">${title}</h1><p style="color:#4b5563">${text}</p>
<p><a href="${SITE_URL}" style="color:#4d7c0f">Back to HydroMetInsight</a></p></div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

async function unsubscribe(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') || ''
  const token = searchParams.get('token') || ''

  if (!id || !token || !verifyUnsubscribeToken(id, token)) {
    return page('Invalid link', 'This unsubscribe link is not valid.', 400)
  }

  await prisma.newsletter.updateMany({ where: { id }, data: { active: false } })
  return page('You have been unsubscribed', 'You will no longer receive the HydroMetInsight newsletter.')
}

// Link in the email footer
export async function GET(request: NextRequest) {
  return unsubscribe(request)
}

// One-click unsubscribe from email apps (List-Unsubscribe-Post)
export async function POST(request: NextRequest) {
  return unsubscribe(request)
}
