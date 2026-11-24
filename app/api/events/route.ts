import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { upcomingEventsWhere, pastEventsWhere } from '@/lib/events'
import { addSecurityHeaders } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const sortBy =
      searchParams.get('sortBy') ||
      ((searchParams.get('when') || 'upcoming') === 'upcoming' ? 'startDate-asc' : 'startDate-desc')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const location = searchParams.get('location')

    const skip = (page - 1) * limit

    // "upcoming" (default), "past" or "all"
    const when = searchParams.get('when') || 'upcoming'

    // Build where clause from independent conditions
    const and: any[] = [{ published: true }]

    if (when === 'upcoming') and.push(upcomingEventsWhere())
    if (when === 'past') and.push(pastEventsWhere())

    // Search filter
    if (search) {
      and.push({
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
          { location: { contains: search } },
        ],
      })
    }

    // Date filters
    if (dateFrom) {
      and.push({ startDate: { gte: new Date(dateFrom) } })
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      // Event ends before or on dateTo, or if no endDate, starts before or on dateTo
      and.push({
        OR: [
          { endDate: { lte: toDate } },
          { AND: [{ endDate: null }, { startDate: { lte: toDate } }] },
        ],
      })
    }

    // Location filter
    if (location) {
      and.push({ location: { contains: location } })
    }

    const where = { AND: and }

    // Sort options
    let orderBy: any = { startDate: 'desc' }
    if (sortBy === 'startDate-asc') {
      orderBy = { startDate: 'asc' }
    } else if (sortBy === 'startDate-desc') {
      orderBy = { startDate: 'desc' }
    } else if (sortBy === 'title-asc') {
      orderBy = { title: 'asc' }
    } else if (sortBy === 'title-desc') {
      orderBy = { title: 'desc' }
    }

    // Get total count
    const total = await prisma.event.count({ where })

    // Get events
    const events = await prisma.event.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)

    const response = NextResponse.json({
      events,
      pagination: {
        page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })

    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Error fetching events:', error)
    const response = NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    return addSecurityHeaders(response)
  }
}
