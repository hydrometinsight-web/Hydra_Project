'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ReplyFormProps {
  newsId: string
  parentId: string
  parentAuthorName: string
  onCancel?: () => void
  onSuccess?: () => void
}

export default function ReplyForm({
  newsId,
  parentId,
  parentAuthorName,
  onCancel,
  onSuccess,
}: ReplyFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch(`/api/comments/${parentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          content,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage('Your reply has been submitted and is awaiting approval.')
        setName('')
        setEmail('')
        setContent('')
        
        if (onSuccess) {
          onSuccess()
        } else {
          router.refresh()
        }
      } else {
        setSubmitStatus('error')
        setSubmitMessage(data.error || 'Failed to submit reply. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-4 pl-6 border-l-2 border-gray-200">
      <p className="text-sm text-gray-600 mb-3">
        Replying to <span className="font-semibold">{parentAuthorName}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`reply-name-${parentId}`} className="block text-xs font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              id={`reply-name-${parentId}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor={`reply-email-${parentId}`} className="block text-xs font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id={`reply-email-${parentId}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label htmlFor={`reply-content-${parentId}`} className="block text-xs font-medium text-gray-700 mb-1">
            Reply *
          </label>
          <textarea
            id={`reply-content-${parentId}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent resize-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Reply'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        {submitStatus === 'success' && (
          <p className="text-green-600 text-xs mt-2">{submitMessage}</p>
        )}
        {submitStatus === 'error' && (
          <p className="text-red-600 text-xs mt-2">{submitMessage}</p>
        )}
      </form>
    </div>
  )
}

