import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const slug = 'slug' in resolvedParams ? resolvedParams.slug : resolvedParams.id

    const calculatorSponsor = await prisma.calculatorSponsor.findUnique({
      where: {
        calculatorSlug: slug,
        active: true,
      },
      include: {
        sponsor: true,
      },
    })

    if (!calculatorSponsor || !calculatorSponsor.sponsor || !calculatorSponsor.sponsor.active) {
      return NextResponse.json({ sponsor: null })
    }

    return NextResponse.json({
      sponsor: {
        id: calculatorSponsor.sponsor.id,
        name: calculatorSponsor.sponsor.name,
        website: calculatorSponsor.sponsor.website,
        logoUrl: calculatorSponsor.sponsor.logoUrl,
        title: calculatorSponsor.title,
        description: calculatorSponsor.description,
        ctaText: calculatorSponsor.ctaText,
        ctaLink: calculatorSponsor.ctaLink,
      },
    })
  } catch (error) {
    console.error('Error fetching calculator sponsor:', error)
    return NextResponse.json({ sponsor: null })
  }
}

