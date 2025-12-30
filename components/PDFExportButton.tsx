'use client'

import { useState } from 'react'
import { HiDownload } from 'react-icons/hi'
import { exportToPDF } from '@/lib/pdfExport'

interface PDFExportButtonProps {
  elementId: string
  title: string
  author?: string
  date?: string
  filename?: string
  className?: string
}

export default function PDFExportButton({
  elementId,
  title,
  author,
  date,
  filename,
  className = '',
}: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleExport = async () => {
    setIsGenerating(true)
    try {
      await exportToPDF(elementId, {
        title,
        author,
        date,
        filename,
      })
    } catch (error) {
      console.error('PDF export error:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className={`flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Download as PDF"
    >
      <HiDownload className="w-5 h-5" />
      <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
    </button>
  )
}

