// Input validation and sanitization utilities

export function sanitizeString(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove null bytes and trim
  let sanitized = input.replace(/\0/g, '').trim()

  // Limit length if specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }

  return sanitized
}

export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return ''
  }

  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const sanitized = email.toLowerCase().trim()

  if (!emailRegex.test(sanitized)) {
    return ''
  }

  return sanitized
}

export function sanitizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    return ''
  }

  // Only allow alphanumeric, hyphens, and underscores
  // Remove path traversal attempts
  let sanitized = slug
    .toLowerCase()
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/\//g, '-') // Replace slashes
    .replace(/\\/g, '-') // Replace backslashes
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100) // Max length

  // Ensure it's not empty after sanitization
  if (!sanitized || sanitized.length === 0) {
    return 'untitled'
  }

  return sanitized
}

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // Enhanced HTML sanitization - remove script tags and dangerous attributes
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '')

  return sanitized
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' }
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' }
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password must be less than 128 characters' }
  }

  // Check for at least one letter and one number
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one letter' }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' }
  }

  return { valid: true }
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.toLowerCase().trim())
}

export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  const trimmedUrl = url.trim()
  
  // Allow local upload paths (e.g., /uploads/filename.jpg)
  if (trimmedUrl.startsWith('/uploads/')) {
    // Validate that it's a safe path (no path traversal)
    if (trimmedUrl.includes('..') || trimmedUrl.includes('//')) {
      return false
    }
    // Check for valid image extensions
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const hasValidExtension = validExtensions.some(ext => 
      trimmedUrl.toLowerCase().endsWith(ext)
    )
    return hasValidExtension
  }

  // For external URLs, validate with URL constructor
  try {
    const parsed = new URL(trimmedUrl)
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false
    }
    // Prevent javascript: and data: URLs
    if (trimmedUrl.toLowerCase().startsWith('javascript:') || trimmedUrl.toLowerCase().startsWith('data:')) {
      return false
    }
    // Prevent localhost and private IPs in production (optional)
    const hostname = parsed.hostname.toLowerCase()
    if (hostname === 'localhost' || hostname.startsWith('127.') || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      // Allow in development, block in production if needed
      if (process.env.NODE_ENV === 'production') {
        // You might want to allow these, so this is optional
      }
    }
    return true
  } catch {
    return false
  }
}

export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return ''
  }

  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/\.\./g, '') // Remove ..
    .replace(/\//g, '') // Remove /
    .replace(/\\/g, '') // Remove \
    .replace(/[^a-zA-Z0-9._-]/g, '') // Only allow alphanumeric, dots, underscores, hyphens
    .substring(0, 255) // Max length
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  if (!file || !allowedTypes || allowedTypes.length === 0) {
    return false
  }

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return false
  }

  // Additional check: verify extension matches MIME type
  const extension = file.name.split('.').pop()?.toLowerCase()
  const mimeToExt: { [key: string]: string[] } = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
  }

  if (extension && mimeToExt[file.type]) {
    if (!mimeToExt[file.type].includes(extension)) {
      return false
    }
  }

  return true
}

