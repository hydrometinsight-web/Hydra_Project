import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
        // Log logout activity (you can extend this to store in database)
        console.log(`[Admin Logout] User: ${decoded.userId}`)
      } catch {
        // Token invalid, but still allow logout
      }
    }

    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  }
}

