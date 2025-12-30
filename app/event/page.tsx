import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'

async function getEvents() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: 'asc' },
  })
  return events
}

export default async function EventPage() {
  const events = await getEvents()

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Events</h1>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>
      
      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-lg">
            Stay updated with the latest events, conferences, and workshops in the hydrometallurgy field. This section will feature upcoming and past events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-200"
            >
              {event.imageUrl ? (
                <div className="relative w-full h-48 flex-shrink-0">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full h-48 flex-shrink-0">
                  <ImagePlaceholder />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {event.description
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .trim()}
                </p>
                <div className="space-y-2 text-sm text-gray-500 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📅</span>
                    <span>
                      {format(new Date(event.startDate), 'MMMM d, yyyy', { locale: enUS })}
                      {event.endDate && 
                        ` - ${format(new Date(event.endDate), 'MMMM d, yyyy', { locale: enUS })}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

