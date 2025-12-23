'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  className?: string
}

type UploadMode = 'file' | 'url'

export default function ImageUpload({ value, onChange, label = 'Image URL', className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  
  // Determine initial mode based on value
  const getInitialMode = (): UploadMode => {
    if (!value || !value.trim()) return 'file'
    // If value is a data URL (preview), it's from file upload
    if (value.startsWith('data:')) return 'file'
    // If value is a local upload path, it's from file upload
    if (value.startsWith('/uploads/')) return 'file'
    // Otherwise it's a URL
    return 'url'
  }
  
  const [mode, setMode] = useState<UploadMode>(() => {
    // Determine mode based on initial value
    if (!value || !value.trim()) return 'file'
    if (value.startsWith('data:')) return 'file'
    if (value.startsWith('/uploads/')) return 'file'
    return 'url'
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    const token = localStorage.getItem('adminToken')
    if (!token) {
      alert('Please login first')
      setUploading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onChange(data.url)
        setPreview(null) // Clear preview after successful upload
      } else {
        alert(data.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('An error occurred while uploading the image')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange('')
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const imageSrc = preview || (value && value.trim() ? value : null)
  const isValidImageSrc = imageSrc && (
    imageSrc.startsWith('/') || 
    imageSrc.startsWith('http://') || 
    imageSrc.startsWith('https://') ||
    imageSrc.startsWith('data:')
  )

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {/* Preview or Current Image */}
      {isValidImageSrc && (
        <div className="mb-4 relative">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
            <Image
              src={imageSrc}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized={preview ? true : imageSrc.startsWith('/uploads/') || imageSrc.startsWith('data:')}
            />
          </div>
          {value && value.trim() && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Remove Image
            </button>
          )}
        </div>
      )}

      {/* Mode Selection */}
      <div className="mb-4">
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="upload-mode"
              value="file"
              checked={mode === 'file'}
              onChange={() => {
                setMode('file')
                // Don't clear value, just switch mode
                setPreview(null)
              }}
              className="h-4 w-4 text-[#93D419] focus:ring-[#93D419] border-gray-300"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Upload from File</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="upload-mode"
              value="url"
              checked={mode === 'url'}
              onChange={() => {
                setMode('url')
                // Don't clear value, just switch mode
                setPreview(null)
              }}
              className="h-4 w-4 text-[#93D419] focus:ring-[#93D419] border-gray-300"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Enter URL</span>
          </label>
        </div>
      </div>

      {/* File Upload Section */}
      {mode === 'file' && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="mt-2 text-xs text-gray-500">
            Select an image file to upload (JPEG, PNG, GIF, WebP - Max 5MB)
          </p>
        </div>
      )}

      {/* URL Input Section */}
      {mode === 'url' && (
        <div>
          <input
            type="url"
            value={value && !value.startsWith('data:') && !value.startsWith('/uploads/') ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent"
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Paste an image URL from the web
          </p>
        </div>
      )}
    </div>
  )
}

