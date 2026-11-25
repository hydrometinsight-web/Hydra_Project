// Server-side helpers for first-party, cookieless analytics.
//
// How a visitor is counted (this is also what the report's methodology note says):
// - No cookies and no raw IP addresses are stored.
// - A visitor id is a SHA-256 hash of (date + IP + user agent + server secret).
//   The date is part of the hash, so the id changes every day and visitors
//   cannot be followed across days. "Visitors" therefore means unique visitors
//   per day, summed over the selected period.
// - Known bots and crawlers are not counted.
// - The same visitor opening the same page again within 30 minutes is counted once.
// - Logged-in admin sessions are not counted (the tracker skips them).
import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|whatsapp|telegram|discord|slack|linkedinbot|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python-requests|httpclient|axios|node-fetch|go-http|java\/|okhttp|scrapy|preview|vercel-screenshot/i

export function isBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.length < 20) return true
  return BOT_PATTERN.test(userAgent)
}

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || request.ip || '0.0.0.0'
}

export function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function visitorHash(request: NextRequest): string {
  const secret = process.env.ANALYTICS_SALT || process.env.NEXTAUTH_SECRET || 'hydrometinsight'
  const ua = request.headers.get('user-agent') || ''
  return createHash('sha256')
    .update(`${dayKey()}|${clientIp(request)}|${ua}|${secret}`)
    .digest('hex')
    .slice(0, 32)
}

// Vercel adds the visitor's country (ISO code) at the edge.
export function countryFrom(request: NextRequest): string | null {
  const code = request.headers.get('x-vercel-ip-country') || request.geo?.country || null
  if (!code || code.length !== 2) return null
  return code.toUpperCase()
}

export function deviceFrom(userAgent: string | null): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent || ''
  if (/ipad|tablet|kindle|playbook|silk|(android(?!.*mobile))/i.test(ua)) return 'tablet'
  if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) return 'mobile'
  return 'desktop'
}

export function sectionFor(path: string): string {
  if (path === '/' || path === '') return 'home'
  if (path.startsWith('/news') || path.startsWith('/haber')) return 'news'
  if (path.startsWith('/techinsight')) return 'techinsight'
  if (path.startsWith('/event')) return 'events'
  if (path.startsWith('/sponsor')) return 'sponsor'
  if (path.startsWith('/calculations') || path.startsWith('/calculator')) return 'calculators'
  if (path.startsWith('/sorular')) return 'questions'
  return 'other'
}

// Keep only the referring site's host, and only when it is another site.
export function referrerHost(referrer: unknown, ownHost: string | null): string | null {
  if (typeof referrer !== 'string' || !referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase()
    const own = (ownHost || '').replace(/^www\./, '').toLowerCase()
    if (!host || host === own || host.endsWith('.vercel.app') || host === 'localhost') return null
    return host.slice(0, 120)
  } catch {
    return null
  }
}

export function cleanPath(path: unknown): string | null {
  if (typeof path !== 'string' || !path.startsWith('/') || path.length > 300) return null
  if (path.startsWith('/admin') || path.startsWith('/api')) return null
  return path.split('?')[0].split('#')[0]
}
