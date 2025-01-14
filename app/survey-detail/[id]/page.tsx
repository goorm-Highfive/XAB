'use client'

import { useEffect, useState } from 'react'
import { SurveyCard, SurveyCardProps } from '~/components/common/survey-card'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { SurveyComment } from '~/components/survey-detail/survey-comment'
import { SurveyCommentInput } from '~/components/survey-detail/survey-comment-input'
import { Comment } from '~/types/comment'

// 좋아요 및 투표 로직 관리
const useSurveyData = (initialData: SurveyCardProps[]) => {
  const [survey, setSurvey] = useState(initialData)

  const updateLike = (index: number, newLikeStatus: boolean) => {
    setSurvey((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              userLiked: newLikeStatus,
              initLikeCount: newLikeStatus
                ? item.initLikeCount + 1
                : Math.max(item.initLikeCount - 1, 0),
            }
          : item,
      ),
    )
  }

  const handleVoteSubmit = async (index: number, option: 'A' | 'B') => {
    return new Promise<void>((resolve) => {
      setSurvey((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                voteComplete: true,
                votesA: option === 'A' ? item.votesA + 1 : item.votesA,
                votesB: option === 'B' ? item.votesB + 1 : item.votesB,
              }
            : item,
        ),
      )
      resolve()
    })
  }

  return { survey, updateLike, handleVoteSubmit }
}

function SurveyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [postData, setPostData] = useState<SurveyCardProps>()
  const [comments, setComments] = useState<Comment[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { updateLike } = useSurveyData([]) //handleVoteSubmit 추가해야 함

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
          question: data.post.caption || 'Which option do you prefer?',
          post_image_url: data.post.image_url,
          optionA: data.abTest.description_a,
          optionB: data.abTest.description_b,
          optionA_url: data.abTest.variant_a_url,
          optionB_url: data.abTest.variant_b_url,
          votesA: data.votesA,
          votesB: data.votesB,
          initLikeCount: data.initLikeCount,
          userLiked: data.userLiked,
          commentsCount: data.commentsCount,
          userVote: data.userVote,
          ab_test_id: data.abTest.id,
          postId: data.post.id,
          voteComplete: data.voteComplete,
        })
        setComments(data.comments)
        setError(null) // 에러 초기화
      } catch (err) {
        setError((err as Error).message || '데이터를 가져오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!postData) return <div>No data found</div>

  return (
    <div className="container mx-auto py-8">
      <SurveyCard
        {...postData}
        // onVoteSubmit={(option) => handleVoteSubmit(0, option)}
        onLikeToggle={() => updateLike(0, !postData.userLiked)}
      />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Comments ({comments?.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {comments ? (
            comments.map((comment) => (
              <SurveyComment key={comment.id} comment={comment} />
            ))
          ) : (
            <div>
              <p>Noting Comments</p>
            </div>
          )}
          <SurveyCommentInput />
        </CardContent>
      </Card>
    </div>
  )
}

export default SurveyDetailPage
