'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { SurveyComment } from '~/components/survey-detail/survey-comment'
import { SurveyCommentInput } from '~/components/survey-detail/survey-comment-input'
import { Comment } from '~/types/comment'

type CommentsSectionProps = {
  initialComments: Comment[]
  currentUserId: string
  postId: number
}

export function CommentsSection({
  initialComments,
  currentUserId,
  postId,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  // 댓글 좋아요 토글
  const handleCommentLikeToggle = async (commentId: number) => {
    try {
      const res = await fetch('/api/comment-like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
        credentials: 'include', // 쿠키 포함
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.error || 'Failed to toggle like')
      }

      const data = await res.json()

      if (!data) return

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                userLiked: data.liked,
                likeCount: data.liked
                  ? comment.likeCount + 1
                  : comment.likeCount - 1,
              }
            : comment,
        ),
      )
    } catch (err: unknown) {
      console.error('Comment like toggle error:', err)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Comments ({comments?.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <SurveyComment
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              postId={postId}
              handleCommentLikeToggle={handleCommentLikeToggle}
            />
          ))
        ) : (
          <p>No Comments Yet</p>
        )}
        <SurveyCommentInput postId={postId} />
      </CardContent>
    </Card>
  )
}
