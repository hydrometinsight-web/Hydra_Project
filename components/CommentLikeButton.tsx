'use client'

import { useState, useEffect } from 'react'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'

interface CommentLikeButtonProps {
  commentId: string
  initialLikeCount?: number
  initialLiked?: boolean
}

export default function CommentLikeButton({
  commentId,
  initialLikeCount = 0,
  initialLiked = false,
}: CommentLikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [liked, setLiked] = useState(initialLiked)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch current like status
    fetch(`/api/comments/${commentId}/like`)
      .then((res) => res.json())
      .then((data) => {
        if (data.likeCount !== undefined) {
          setLikeCount(data.likeCount)
          setLiked(data.liked)
        }
      })
      .catch((error) => {
        console.error('Error fetching like status:', error)
      })
  }, [commentId])

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })

      const data = await res.json()

      if (res.ok) {
        setLiked(data.liked)
        setLikeCount(data.likeCount)
      } else {
        alert(data.error || 'Failed to like comment')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      alert('Failed to like comment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={liked ? 'Unlike' : 'Like'}
    >
      {liked ? (
        <HiHeart className="w-5 h-5 fill-current" />
      ) : (
        <HiOutlineHeart className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">{likeCount}</span>
    </button>
  )
}

