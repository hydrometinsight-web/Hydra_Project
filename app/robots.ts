import { SITE_URL } from '@/lib/site'
import { MetadataRoute } from 'next'

// Search engines and AI search/answer engines that may read the public site.
// Everything public is allowed; only the admin panel and API are excluded.
const CRAWLERS = [
  '*',
  'Googlebot',
  'Google-Extended', // Gemini / Google AI
  'Bingbot', // Bing and Microsoft Copilot
  'GPTBot', // OpenAI
  'OAI-SearchBot', // ChatGPT search
  'ChatGPT-User',
  'ClaudeBot', // Anthropic
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot', // Perplexity
  'Perplexity-User',
  'Applebot',
  'Applebot-Extended', // Apple Intelligence
  'CCBot', // Common Crawl
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: CRAWLERS.map((userAgent) => ({
      userAgent,
      allow: '/',
      disallow: ['/admin/', '/api/'],
    })),
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
