import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string; exp: number }
      
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return NextResponse.json({ valid: false, error: 'Token expired' }, { status: 401 })
      }

      // Check if user is admin
      if (decoded.role !== 'admin') {
        return NextResponse.json({ valid: false, error: 'Access denied' }, { status: 403 })
      }

      return NextResponse.json({
        valid: true,
        user: {
          userId: decoded.userId,
          role: decoded.role,
        },
      })
    } catch (error: any) {
      console.error('Token verification error:', error.message)
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('Error verifying token:', error.message)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
