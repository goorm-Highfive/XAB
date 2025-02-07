// components/survey-detail/survey-comment-section.tsx
'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { SurveyComment } from '~/components/survey-detail/survey-comment'
import { SurveyCommentInput } from '~/components/survey-detail/survey-comment-input'
import { Comment } from '~/types/comment'
import { useCommentsStore } from '~/stores/use-comment-store'
import { useRealtimeComments } from '~/hooks/use-realtime-comments'

type CommentsSectionProps = {
  initialComments: Comment[]
  currentUserId: string
  postId: number
  currentUserName: string
}

export function CommentsSection({
  initialComments,
  currentUserId,
  postId,
  currentUserName,
}: CommentsSectionProps) {
  // Zustand 스토어에서 댓글 트리 상태와 업데이트 함수를 사용합니다.
  const { comments, setComments, toggleLike } = useCommentsStore()
  console.log('이름' + currentUserName)
  // 최초 렌더링 시, props로 전달받은 초기 댓글 데이터를 스토어에 설정합니다.
  useEffect(() => {
    if (comments.length === 0 && initialComments.length > 0) {
      setComments(initialComments)
    }
  }, [initialComments, comments, setComments])

  // Supabase 리얼타임 구독을 통해 스토어 상태를 실시간 업데이트합니다.
  useRealtimeComments(postId, currentUserName)

  // 좋아요 토글 함수: API 호출 후 store의 toggleLike를 사용하여 업데이트합니다.
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

      // store의 toggleLike를 호출하여 해당 댓글의 좋아요 상태 업데이트
      toggleLike(commentId, data.liked)
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
