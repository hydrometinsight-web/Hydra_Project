import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import jwt from 'jsonwebtoken'
import { sanitizeFilename, validateFileType } from '@/lib/validation'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validateFileType(file, allowedTypes)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }

    // Validate file size (min 1 byte)
    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 })
    }

    // Sanitize filename to prevent path traversal
    const sanitizedOriginalName = sanitizeFilename(file.name)
    if (!sanitizedOriginalName) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename with sanitized extension
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = sanitizedOriginalName.split('.').pop() || 'jpg'
    const sanitizedExtension = sanitizeFilename(extension)
    const filename = `${timestamp}-${randomString}.${sanitizedExtension}`
    
    // Ensure no path traversal in final path
    const filepath = join(uploadsDir, filename)
    const resolvedPath = join(process.cwd(), 'public', 'uploads', filename)
    
    // Security check: ensure the resolved path is within uploads directory
    if (!resolvedPath.startsWith(join(process.cwd(), 'public', 'uploads'))) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Additional security: verify it's actually an image by checking magic bytes
    const magicBytes = buffer.slice(0, 4)
    const isValidImage = 
      magicBytes[0] === 0xFF && magicBytes[1] === 0xD8 && magicBytes[2] === 0xFF || // JPEG
      magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4E && magicBytes[3] === 0x47 || // PNG
      magicBytes[0] === 0x47 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46 || // GIF
      (magicBytes[0] === 0x52 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46 && magicBytes[3] === 0x46) || // WebP (RIFF)
      (magicBytes[0] === 0x57 && magicBytes[1] === 0x45 && magicBytes[2] === 0x42 && magicBytes[3] === 0x50) // WebP (WEBP)
    
    if (!isValidImage) {
      return NextResponse.json(
        { error: 'File does not appear to be a valid image' },
        { status: 400 }
      )
    }
    
    await writeFile(resolvedPath, buffer)

    // Return the public URL
    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    // Don't expose internal error details
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}



