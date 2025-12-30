import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIdentifier } from '@/lib/rateLimit'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: commentId } = params
    const clientId = getClientIdentifier(request)
    const ipAddress = clientId.split(':')[0] // Extract IP from client identifier
    const userAgent = request.headers.get('user-agent') || ''

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if already liked from this IP
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_ipAddress: {
          commentId,
          ipAddress,
        },
      },
    })

    if (existingLike) {
      // Unlike - remove the like
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      })

      const likeCount = await prisma.commentLike.count({
        where: { commentId },
      })

      return NextResponse.json({
        message: 'Like removed',
        liked: false,
        likeCount,
      })
    } else {
      // Like - add the like
      await prisma.commentLike.create({
        data: {
          commentId,
          ipAddress,
          userAgent,
        },
      })

      const likeCount = await prisma.commentLike.count({
        where: { commentId },
      })

      return NextResponse.json({
        message: 'Comment liked',
        liked: true,
        likeCount,
      })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: commentId } = params
    const clientId = getClientIdentifier(request)
    const ipAddress = clientId.split(':')[0]

    // Get like count
    const likeCount = await prisma.commentLike.count({
      where: { commentId },
    })

    // Check if current user has liked
    const userLike = await prisma.commentLike.findUnique({
      where: {
        commentId_ipAddress: {
          commentId,
          ipAddress,
        },
      },
    })

    return NextResponse.json({
      likeCount,
      liked: !!userLike,
    })
  } catch (error) {
    console.error('Error fetching like status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch like status' },
      { status: 500 }
    )
  }
}

