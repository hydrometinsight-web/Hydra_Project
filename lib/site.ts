// Public address of the site. Falls back to the production domain so that
// canonical URLs, the sitemap and robots.txt never point to localhost.
const PRODUCTION_URL = 'https://www.hydrometinsight.com'

function resolveSiteUrl() {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || '').trim()
  // On Vercel a localhost value is always a misconfiguration: ignore it
  const onVercel = Boolean(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV)
  if (!fromEnv || (onVercel && /localhost|127\.0\.0\.1/.test(fromEnv))) return PRODUCTION_URL
  return fromEnv
}

export const SITE_URL = resolveSiteUrl().replace(/\/$/, '')

export const SITE_NAME = 'HydroMetInsight'

export const SITE_DESCRIPTION =
  'Independent news and technical insights on hydrometallurgy, critical metals and battery recycling.'

// Official profiles, used for Organization structured data (sameAs)
export const SOCIAL_PROFILES = [
  'https://www.linkedin.com/company/hydrometinsight',
  'https://x.com/hydrometinsight',
  'https://www.instagram.com/hydrometinsight/',
  'https://www.youtube.com/@hydrometinsight',
]
