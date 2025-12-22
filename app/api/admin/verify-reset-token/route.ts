import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find reset token
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid reset token',
      })
    }

    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json({
        valid: false,
        error: 'Reset token has expired',
      })
    }

    // Check if token is already used
    if (resetToken.used) {
      return NextResponse.json({
        valid: false,
        error: 'This reset token has already been used',
      })
    }

    return NextResponse.json({
      valid: true,
      email: resetToken.email,
    })
  } catch (error) {
    console.error('Error verifying reset token:', error)
    return NextResponse.json(
      { valid: false, error: 'Failed to verify token' },
      { status: 500 }
    )
  }
}

