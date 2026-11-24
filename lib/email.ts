// Email sending through Resend (https://resend.com), using its REST API directly.
//
// Environment variables (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  – required to actually send email
//   EMAIL_FROM      – optional, defaults to "HydroMetInsight <noreply@hydrometinsight.com>"
//   CONTACT_TO      – optional, where contact form messages go (defaults to info@hydrometinsight.com)
//
// Without RESEND_API_KEY nothing is sent; callers get { ok: false, skipped: true }.

import crypto from 'crypto'

const RESEND_URL = 'https://api.resend.com'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hydrometinsight.com').replace(/\/$/, '')
export const EMAIL_FROM = process.env.EMAIL_FROM || 'HydroMetInsight <noreply@hydrometinsight.com>'
export const CONTACT_TO = process.env.CONTACT_TO || 'info@hydrometinsight.com'

export interface EmailMessage {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  headers?: Record<string, string>
}

export interface SendResult {
  ok: boolean
  skipped?: boolean
  id?: string
  error?: string
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY)
}

function toResendPayload(msg: EmailMessage) {
  return {
    from: EMAIL_FROM,
    to: Array.isArray(msg.to) ? msg.to : [msg.to],
    subject: msg.subject,
    html: msg.html,
    ...(msg.text ? { text: msg.text } : {}),
    ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    ...(msg.headers ? { headers: msg.headers } : {}),
  }
}

export async function sendEmail(msg: EmailMessage): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY is not set; email not sent:', msg.subject)
    return { ok: false, skipped: true, error: 'Email sending is not configured' }
  }

  try {
    const res = await fetch(`${RESEND_URL}/emails`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(toResendPayload(msg)),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('[Email] Resend error', res.status, data)
      return { ok: false, error: data?.message || `HTTP ${res.status}` }
    }
    return { ok: true, id: data?.id }
  } catch (error: any) {
    console.error('[Email] Failed to send:', error)
    return { ok: false, error: error?.message || 'Unknown error' }
  }
}

// Sends up to 100 separate emails per request (Resend batch API).
export async function sendEmailBatch(messages: EmailMessage[]): Promise<{ sent: number; failed: number; skipped?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY is not set; batch not sent')
    return { sent: 0, failed: messages.length, skipped: true }
  }

  let sent = 0
  let failed = 0
  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100)
    try {
      const res = await fetch(`${RESEND_URL}/emails/batch`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk.map(toResendPayload)),
      })
      if (res.ok) {
        sent += chunk.length
      } else {
        failed += chunk.length
        console.error('[Email] Resend batch error', res.status, await res.text().catch(() => ''))
      }
    } catch (error) {
      failed += chunk.length
      console.error('[Email] Batch request failed:', error)
    }
  }
  return { sent, failed }
}

export function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Simple branded wrapper used by all site emails
export function emailLayout(title: string, bodyHtml: string, footerHtml = '') {
  return `<!DOCTYPE html><html><body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden">
<tr><td style="background:#0b1220;padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold">HydroMetInsight</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6">
<h1 style="margin:0 0 16px;font-size:20px;color:#111827">${escapeHtml(title)}</h1>
${bodyHtml}
</td></tr>
<tr><td style="padding:16px 28px;background:#f9fafb;color:#6b7280;font-size:12px;line-height:1.5">
${footerHtml}${footerHtml ? '<br>' : ''}HydroMetInsight · <a href="${SITE_URL}" style="color:#4d7c0f">${SITE_URL.replace(/^https?:\/\//, '')}</a>
</td></tr></table></td></tr></table></body></html>`
}

// Signed unsubscribe links (by subscriber id, so no email address appears in the link)
function unsubscribeSecret() {
  return process.env.NEXTAUTH_SECRET || 'your-secret-key'
}

export function unsubscribeToken(subscriberId: string) {
  return crypto.createHmac('sha256', unsubscribeSecret()).update(`unsubscribe:${subscriberId}`).digest('hex').slice(0, 32)
}

export function verifyUnsubscribeToken(subscriberId: string, token: string) {
  const expected = unsubscribeToken(subscriberId)
  return token.length === expected.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}

export function unsubscribeUrl(subscriberId: string) {
  return `${SITE_URL}/api/newsletter/unsubscribe?id=${encodeURIComponent(subscriberId)}&token=${unsubscribeToken(subscriberId)}`
}
