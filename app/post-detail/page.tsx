'use client'

import { useState } from 'react'
import { SiteHeader } from '~/components/common/site-header'
import { SurveyCard } from '~/components/common/survey-card'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { PostComment } from '~/components/survey-detail/survey-comment'
import { PostCommentInput } from '~/components/survey-detail/survey-comment-input'
import { SurveyData } from '~/types/survey'
import { CommentData } from '~/types/comment'

// 임시 데이터
const initialSurveyData: SurveyData[] = [
  {
    date: 'March 15, 2025',
    question: 'Which landing page design do you prefer for our new product?',
    optionA: 'Design A',
    optionB: 'Design B',
    votesA: 50,
    votesB: 50,
    voteComplete: false,
    initLikeCount: 999,
    userLiked: false,
  },
]

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
const useSurveyData = (initialData: SurveyData[]) => {
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

  const handleVoteSubmit = (index: number, option: 'A' | 'B') => {
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

function PostDetailPage() {
  const { survey, updateLike, handleVoteSubmit } =
    useSurveyData(initialSurveyData)
  const { comments, toggleLike, addComment, addReply } =
    useCommentData(initialCommentData)

  return (
    <div className="bg-gray-100">
      <SiteHeader />
      <div className="mx-auto max-w-[1248px] pt-6">
        <SurveyCard
          {...survey[0]}
          onVoteSubmit={(option) => handleVoteSubmit(0, option)}
          onLikeToggle={() => updateLike(0, !survey[0].userLiked)}
        />

        {/* 댓글 영역 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Comments ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {comments.map((comment) => (
              <PostComment
                key={comment.id}
                comment={comment}
                onToggleLike={() => toggleLike(comment.id)}
                onToggleReplyLike={(replyId) =>
                  toggleLike(comment.id, true, replyId)
                }
                onAddReply={addReply}
              />
            ))}
            <PostCommentInput onCommentSubmit={addComment} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PostDetailPage
