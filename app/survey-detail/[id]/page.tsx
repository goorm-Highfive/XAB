'use client'

import { useEffect, useState } from 'react'

import { SurveyCard, SurveyCardProps } from '~/components/common/survey-card'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { SurveyComment } from '~/components/survey-detail/survey-comment'
import { SurveyCommentInput } from '~/components/survey-detail/survey-comment-input'
import { Skeleton } from '~/components/ui/skeleton'
import { SurveyCardSkeleton } from '~/components/common/surveycard-skeleton'
import { toggleLikeAPI } from '~/utils/toggleLikeAPI'
import { voteSubmitAPI } from '~/utils/voteSubmitAPI'
import { useCommentsStore } from '~/stores/comment-store'
import { createClient } from '~/utils/supabase/client'
import { Tables } from '~/types/supabase'

function SurveyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [userInfo, setUserInfo] = useState({ userId: '', userName: '' })
  const [postData, setPostData] = useState<SurveyCardProps>()
  const [postId, setPostId] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { comments, setComments, toggleLike } = useCommentsStore()

  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params

      if (!id) {
        setError('id is not define')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/survey-detail/${id}`)
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`)
        }
        const data = await response.json()
        console.log(data)

        setPostData({
          date: new Date(data.post.created_at).toLocaleDateString(),
          username: data.username || '',
          userId: data.userId,
          profile_image: data.profile_image,
          question: data.post.caption || 'Which option do you prefer?',
          post_image_url: data.post.image_url,
          optionA: data.abTest?.description_a,
          optionB: data.abTest?.description_b,
          optionA_url: data.abTest?.variant_a_url,
          optionB_url: data.abTest?.variant_b_url,
          votesA: data.votesA,
          votesB: data.votesB,
          initLikeCount: data.initLikeCount,
          userLiked: data.userLiked,
          commentsCount: data.commentsCount,
          userVote: data.userVote,
          ab_test_id: data.abTest?.id,
          postId: data.post.id,
          voteComplete: data.voteComplete,
          currentUserId: data.currentUserId,
        })
        setPostId(data.post.id)
        setComments(data.comments || [])
        setUserInfo({
          userId: data.currentUserId,
          userName: data.currentUserName.username,
        })

        setError(null) // 에러 초기화
      } catch (err) {
        setError((err as Error).message || '데이터를 가져오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  const useRealtimeComments = (postId: number) => {
    const { addComment, deleteComment, updateComment } = useCommentsStore()

    useEffect(() => {
      const supabase = createClient()
      const channel = supabase
        .channel('comments')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'comments',
            filter: `post_id=eq.${postId}`,
          },
          (payload) => {
            const { eventType } = payload
            const newComment = payload.new as Tables<'comments'>
            const oldComment = payload.old as Tables<'comments'>

            switch (eventType) {
              case 'INSERT':
                addComment(newComment, userInfo.userName)
                break
              case 'UPDATE':
                updateComment(newComment)
                break
              case 'DELETE':
                deleteComment(oldComment.id)
                break
              default:
                break
            }
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }, [postId, addComment, deleteComment, updateComment])
  }

  useRealtimeComments(postId)

  // 좋아요 토글
  const handleLikeToggle = async (postId: number) => {
    try {
      const data = await toggleLikeAPI(postId)

      if (!data) return

      setPostData((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          userLiked: data.liked,
          initLikeCount: data.liked
            ? prev.initLikeCount + 1
            : prev.initLikeCount - 1,
        }
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        // 사용자에게 에러를 표시할 수 있는 로직 추가 (예: 알림)
      } else {
        console.error('An unexpected error occurred')
      }
    }
  }

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

      toggleLike(commentId, data.liked)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        // 사용자에게 에러를 표시할 수 있는 로직 추가 (예: 알림)
      } else {
        console.error('An unexpected error occurred')
      }
    }
  }

  // 투표 결과 업데이트
  const updateVoteResults = (
    postData: SurveyCardProps,
    option: 'A' | 'B',
  ): SurveyCardProps => {
    const { userVote, votesA, votesB } = postData

    const newVotesA =
      votesA + (option === 'A' ? 1 : 0) - (userVote === 'A' ? 1 : 0)
    const newVotesB =
      votesB + (option === 'B' ? 1 : 0) - (userVote === 'B' ? 1 : 0)

    return {
      ...postData,
      userVote: option,
      votesA: newVotesA,
      votesB: newVotesB,
    }
  }

  const handleVoteSubmit = async (abTestId: number, option: 'A' | 'B') => {
    if (!postData) return

    try {
      console.log('Submitting vote for abTestId:', abTestId)
      console.log('Option selected:', option)

      const data = await voteSubmitAPI(abTestId, option)

      if (data.voted) {
        const updatedPostData = updateVoteResults(postData, option)
        setPostData(updatedPostData)
      } else {
        console.error('Vote submission failed.')
      }
    } catch (err) {
      console.error('Vote submission error:', err)
    }
  }

  if (error) return <div>Error: {error}</div>

  if (loading || !postData) {
    return (
      <div className="container mx-auto space-y-6 py-8">
        {/* SurveyCard Skeleton */}
        <SurveyCardSkeleton />

        {/* Comments Section Skeleton */}
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-4">
            <Skeleton className="h-6 w-1/3" /> {/* "Comments (X)" */}
          </div>

          {/* Comment List Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex gap-3">
                {/* Comment Avatar */}
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-1 flex-col space-y-1">
                  <Skeleton className="h-4 w-1/4" /> {/* Comment Username */}
                  <Skeleton className="h-4 w-full" /> {/* Comment Content */}
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input Skeleton */}
          <div className="mt-4 flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" /> {/* User Avatar */}
            <Skeleton className="h-8 w-full rounded-md" /> {/* Input Field */}
          </div>
        </div>
      </div>
    )
  }
  console.log(comments)
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="mx-auto mt-6 max-w-3xl space-y-6">
          <SurveyCard
            {...postData}
            onLikeToggle={() => handleLikeToggle(postData.postId)}
            onVoteSubmit={handleVoteSubmit}
          />
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Comments ({postData.commentsCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <SurveyComment
                    key={comment.id}
                    comment={comment}
                    currentUserId={userInfo.userId}
                    handleCommentLikeToggle={handleCommentLikeToggle}
                  />
                ))
              ) : (
                <div className="flex items-center rounded-lg bg-gray-50 p-4 py-4 text-gray-600">
                  <p>Noting Comments</p>
                </div>
              )}
              <SurveyCommentInput
                postId={postData.postId}
                currentUserName={userInfo.userName}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SurveyDetailPage
