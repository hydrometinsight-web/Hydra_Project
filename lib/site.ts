// Public address of the site. Falls back to the production domain so that
// canonical URLs, the sitemap and robots.txt never point to localhost.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hydrometinsight.com').replace(/\/$/, '')

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
