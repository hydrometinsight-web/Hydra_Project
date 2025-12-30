'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { HiReply } from 'react-icons/hi'
import CommentLikeButton from './CommentLikeButton'
import ReplyForm from './ReplyForm'

interface CommentLike {
  id: string
}

interface CommentReply {
  id: string
  name: string
  email: string
  content: string
  createdAt: string
  likes: CommentLike[]
}

interface Comment {
  id: string
  name: string
  email: string
  content: string
  createdAt: string
  replies?: CommentReply[]
  likes?: CommentLike[]
}

interface CommentItemProps {
  comment: Comment
  newsId: string
  depth?: number
}

export default function CommentItem({ comment, newsId, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const maxDepth = 3 // Maximum nesting depth

  const likeCount = comment.likes?.length || 0
  const replyCount = comment.replies?.length || 0

  return (
    <div className={`${depth > 0 ? 'mt-4' : ''}`}>
      <div className={`${depth > 0 ? 'pl-6 border-l-2 border-gray-200' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#93D419] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {comment.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-gray-900">{comment.name}</span>
              <span className="text-gray-500 text-sm">
                {format(new Date(comment.createdAt), 'MMM d, yyyy', { locale: enUS })}
              </span>
            </div>
            <div className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</div>
            
            <div className="flex items-center gap-3">
              <CommentLikeButton
                commentId={comment.id}
                initialLikeCount={likeCount}
              />
              {depth < maxDepth && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <HiReply className="w-4 h-4" />
                  <span className="text-sm font-medium">Reply</span>
                  {replyCount > 0 && (
                    <span className="text-xs text-gray-500">({replyCount})</span>
                  )}
                </button>
              )}
            </div>

            {showReplyForm && (
              <ReplyForm
                newsId={newsId}
                parentId={comment.id}
                parentAuthorName={comment.name}
                onCancel={() => setShowReplyForm(false)}
                onSuccess={() => {
                  setShowReplyForm(false)
                  window.location.reload()
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              newsId={newsId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

