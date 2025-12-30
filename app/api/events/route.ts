import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addSecurityHeaders } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'startDate-desc'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const location = searchParams.get('location')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      published: true,
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ]
    }

    // Date filters
    if (dateFrom) {
      where.startDate = { gte: new Date(dateFrom) }
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      // Filter: event ends before or on dateTo, or if no endDate, starts before or on dateTo
      const dateFilter = {
        OR: [
          { endDate: { lte: toDate } },
          { AND: [{ endDate: null }, { startDate: { lte: toDate } }] },
        ],
      }
      
      // Combine with search filter if exists
      if (where.OR && search) {
        where.AND = [
          { OR: where.OR },
          dateFilter,
        ]
        delete where.OR
      } else if (!search) {
        where.OR = dateFilter.OR
      }
    }

    // Location filter
    if (location) {
      where.location = { contains: location }
    }

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
