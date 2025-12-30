import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import SocialShare from '@/components/SocialShare'
import PDFExportButton from '@/components/PDFExportButton'
import StructuredData from '@/components/StructuredData'

async function getEvent(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
  })
  return event
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEvent(params.slug)

  if (!event || !event.published) {
    return {
      title: 'Event Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/event/${event.slug}`
  const imageUrl = event.imageUrl || `${baseUrl}/logo1.png`

  return {
    title: event.title,
    description: event.description.replace(/<[^>]*>/g, '').substring(0, 160) || 'Learn about upcoming events in hydrometallurgy and critical metals.',
    keywords: ['hydrometallurgy', 'events', 'conferences', 'critical metals', 'mining events'],
    openGraph: {
      type: 'article',
      url,
      title: event.title,
      description: event.description.replace(/<[^>]*>/g, '').substring(0, 160) || 'Learn about upcoming events in hydrometallurgy and critical metals.',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      publishedTime: event.createdAt.toISOString(),
      modifiedTime: event.updatedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description.replace(/<[^>]*>/g, '').substring(0, 160) || 'Learn about upcoming events in hydrometallurgy and critical metals.',
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)

  if (!event || !event.published) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/event/${event.slug}`
  const imageUrl = event.imageUrl || `${baseUrl}/logo1.png`

  // Structured Data for Event
  const eventStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description.replace(/<[^>]*>/g, '').substring(0, 500),
    image: imageUrl,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate ? event.endDate.toISOString() : event.startDate.toISOString(),
    location: {
      '@type': 'Place',
      name: event.location,
    },
    organizer: {
      '@type': 'Organization',
      name: 'HydroMetInsight',
    },
  }

  const formatEventDate = (startDate: Date, endDate: Date | null) => {
    const start = startDate
    const end = endDate
    
    if (end && start.toDateString() !== end.toDateString()) {
      return `${format(start, 'MMMM d', { locale: enUS })} - ${format(end, 'MMMM d, yyyy', { locale: enUS })}`
    }
    return format(start, 'MMMM d, yyyy', { locale: enUS })
  }

  const stripHtml = (html: string) => {
    if (!html) return ''
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
  }

  return (
    <>
      <StructuredData data={eventStructuredData} />
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
        <Link href="/events" className="text-gray-600 hover:text-[#93D419] mb-4 inline-block text-sm transition-colors">
          ← Back to Events
        </Link>

        <article className="bg-white rounded-xl shadow-md overflow-hidden" itemScope itemType="https://schema.org/Event">
          {event.imageUrl ? (
            <div className="relative w-full h-96">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="relative w-full h-96">
              <ImagePlaceholder />
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" itemProp="name">
              {event.title}
            </h1>

            {/* Event Details */}
            <div className="mb-6 pb-6 border-b border-gray-200 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Date:</span>
                <span itemProp="startDate" content={event.startDate.toISOString()}>
                  {formatEventDate(event.startDate, event.endDate)}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Location:</span>
                <span itemProp="location" itemScope itemType="https://schema.org/Place">
                  <span itemProp="name">{event.location}</span>
                </span>
              </div>
              {event.website && (
                <div className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="font-medium">Website:</span>
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#93D419] hover:underline"
                    itemProp="url"
                  >
                    {event.website}
                  </a>
                </div>
              )}
            </div>

            {/* Social Share Buttons and PDF Export */}
            <div className="mb-6 pb-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <SocialShare
                url={url}
                title={event.title}
                description={stripHtml(event.description).substring(0, 200)}
              />
              <PDFExportButton />
            </div>

            {/* Event Description */}
            <div
              className="prose prose-lg max-w-none"
              itemProp="description"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
        </article>

        {/* AdSense Ad - Outside the article */}
        <div className="mt-8">
          <AdSense adSlot="1234567890" className="w-full" />
        </div>
      </div>
    </>
  )
}

