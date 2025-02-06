'use client'

import { useState, useEffect } from 'react'
import { createClient } from '~/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { SurveyComment } from '~/components/survey-detail/survey-comment'
import { SurveyCommentInput } from '~/components/survey-detail/survey-comment-input'
import { Comment } from '~/types/comment'

const supabase = createClient()

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

  useEffect(() => {
    const subscription = supabase
      .channel(`comments_${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setComments((prev) => [...prev, payload.new as Comment])
              break
            case 'UPDATE':
              setComments((prev) =>
                prev.map((c) =>
                  c.id === (payload.new as Comment).id
                    ? (payload.new as Comment)
                    : c,
                ),
              )
              break
            case 'DELETE':
              setComments((prev) =>
                prev.filter((c) => c.id !== (payload.old as Comment).id),
              )
              break
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [postId])

  // 댓글 좋아요 토글 함수 추가
  const handleCommentLikeToggle = async (commentId: number) => {
    try {
      const res = await fetch('/api/comment-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
        credentials: 'include',
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
    } catch (err) {
      console.error('Comment like toggle error:', err)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <SurveyComment
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              handleCommentLikeToggle={handleCommentLikeToggle} // 🔹 여기에서 props 추가
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
