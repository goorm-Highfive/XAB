'use client'

import { use, useEffect, useState } from 'react'
import { SurveyCard, SurveyCardProps } from '~/components/common/survey-card'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { SurveyComment } from '~/components/survey-detail/survey-comment'
import { SurveyCommentInput } from '~/components/survey-detail/survey-comment-input'
import { CommentData } from '~/types/comment'

// 초기 댓글 데이터
const initialCommentData: CommentData[] = [
  {
    id: '1',
    writer: 'wontory',
    content: 'This is a comment on the post. Great article!',
    likeCount: 10,
    date: '2 hours ago',
    userLiked: false,
  },
  {
    id: '2',
    writer: 'E0min',
    content: 'This is a comment on the post. Great article!',
    likeCount: 10,
    date: '3 hours ago',
    userLiked: false,
  },
  {
    id: '3',
    writer: 'jyooni99',
    content: 'I totally agree with this perspective. Very insightful!',
    likeCount: 5,
    date: '1 hour ago',
    userLiked: true,
    replies: [
      {
        id: '3-1',
        writer: 'yujsoo',
        content: 'Thanks! Glad you liked it.',
        likeCount: 2,
        date: '30 minutes ago',
        userLiked: false,
      },
    ],
  },
]

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

const useCommentData = (initialData: CommentData[]) => {
  const [comments, setComments] = useState(initialData)

  const toggleLike = (id: string, isReply = false, replyId?: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              ...(isReply
                ? {
                    replies: comment.replies?.map((reply) =>
                      reply.id === replyId
                        ? {
                            ...reply,
                            userLiked: !reply.userLiked,
                            likeCount: reply.userLiked
                              ? Math.max(reply.likeCount - 1, 0)
                              : reply.likeCount + 1,
                          }
                        : reply,
                    ),
                  }
                : {
                    userLiked: !comment.userLiked,
                    likeCount: comment.userLiked
                      ? Math.max(comment.likeCount - 1, 0)
                      : comment.likeCount + 1,
                  }),
            }
          : comment,
      ),
    )
  }

  const addComment = (content: string) => {
    setComments((prev) => [
      {
        id: String(prev.length + 1),
        writer: 'current_user',
        content,
        likeCount: 0,
        date: 'Just now',
        userLiked: false,
      },
      ...prev,
    ])
  }

  const addReply = (
    commentId: string,
    content: string,
    mentionedUser: string,
  ) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  id: `${comment.id}-${(comment.replies?.length || 0) + 1}`,
                  writer: 'current_user',
                  content: `@${mentionedUser} ${content}`,
                  likeCount: 0,
                  date: 'Just now',
                  userLiked: false,
                },
              ],
            }
          : comment,
      ),
    )
  }

  return { comments, toggleLike, addComment, addReply }
}

function SurveyDetailPage({
  params,
}: {
  params: Promise<{ [key: string]: string | undefined }>
}) {
  const { id } = use(params)
  const [postData, setPostData] = useState<SurveyCardProps>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { updateLike } = useSurveyData([]) //handleVoteSubmit 추가해야 함
  const { comments, toggleLike, addComment, addReply } =
    useCommentData(initialCommentData)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('id is undefined')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/survey-detail/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch post data')
        }
        const data = await response.json()
        setPostData({
          date: new Date(data.post.created_at).toLocaleDateString(),
          username: data.username,
          question: data.abTest.description_a || 'Which option do you prefer?',
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
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

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
          <CardTitle>Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {comments.map((comment) => (
            <SurveyComment
              key={comment.id}
              comment={comment}
              onToggleLike={() => toggleLike(comment.id)}
              onToggleReplyLike={(replyId) =>
                toggleLike(comment.id, true, replyId)
              }
              onAddReply={addReply}
            />
          ))}
          <SurveyCommentInput onCommentSubmit={addComment} />
        </CardContent>
      </Card>
    </div>
  )
}

export default SurveyDetailPage
