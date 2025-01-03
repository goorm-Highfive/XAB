'use client'

import { useState } from 'react'

import { SiteHeader } from '~/components/common/site-header'
import { SurveyCard } from '~/components/common/survey-card'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { PostComment } from '~/components/post-comment'
import { PostCommentInput } from '~/components/post-comment-input'

// 임시 데이터 타입 정의
type SurveyData = {
  date: string
  question: string
  optionA: string
  optionB: string
  votesA: number
  votesB: number
  voteComplete: boolean
  initLikeCount: number
  userLiked: boolean
}

// 임시 데이터
const mokData: SurveyData[] = [
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

// 임시 댓글 데이터 타입 정의
type commentMokData = {
  id: string
  writer: string
  content: string
  likeCount: number //해당 댓글의 좋아요 수
  date: string
  userLiked: boolean //현재 사용자가 해당 댓글에 좋아요를 눌렀는지 여부
  replies?: commentMokData[]
}

// 임시 댓글 데이터
const commentMokData: commentMokData[] = [
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

// 게시글 뷰페이지
function PostDetailPage() {
  const [surveyData, setSurveyData] = useState(mokData)
  const [comments, setComments] = useState(commentMokData)
  //console.log(surveyData)

  // 좋아요 상태를 업데이트하는 함수
  const updateLike = (index: number, newLikeStatus: boolean) => {
    setSurveyData((prevData) =>
      prevData.map((item, i) =>
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

  // 투표 데이터 업데이트 함수
  const handleVoteSubmit = (index: number, option: 'A' | 'B') => {
    setSurveyData((prevData) =>
      prevData.map((item, i) =>
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

  const toggleCommentLike = (id: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              userLiked: !comment.userLiked,
              likeCount: !comment.userLiked
                ? comment.likeCount + 1
                : Math.max(comment.likeCount - 1, 0),
            }
          : comment,
      ),
    )
  }

  const toggleReplyLike = (commentId: string, replyId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
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
          : comment,
      ),
    )
  }

  // 새로운 댓글 추가 함수
  const addComment = (commentContent: string) => {
    const newComment = {
      id: String(comments.length + 1), // 고유 id 생성
      writer: 'current_user', // 실제 사용자 정보로 대체 가능
      content: commentContent,
      likeCount: 0,
      date: 'Just now',
      userLiked: false,
    }
    setComments((prevComments) => [newComment, ...prevComments]) // 새 댓글을 기존 댓글 앞에 추가
  }

  // 새로운 댓글 추가 함수
  const addReply = (
    commentId: string,
    replyContent: string,
    mentionedUser: string,
  ) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  id: `${comment.id}-${(comment.replies?.length || 0) + 1}`,
                  writer: 'current_user', // 실제 사용자 정보로 변경
                  content: `@${mentionedUser} ${replyContent}`, // '@' 표시와 함께 대댓글 내용 추가
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

  return (
    <div className="bg-gray-100">
      <SiteHeader></SiteHeader>
      <div className="mx-auto max-w-[1248px] pt-[24px]">
        <section>
          <SurveyCard
            {...surveyData[0]}
            onVoteSubmit={(option) => handleVoteSubmit(0, option)}
            onLikeToggle={() => updateLike(0, !surveyData[0].userLiked)}
          />
        </section>
        <section className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comments (89)</CardTitle>
            </CardHeader>
            <CardContent>
              {comments.map((comment) => (
                <PostComment
                  comment={comment}
                  key={comment.id}
                  onToggleLike={() => toggleCommentLike(comment.id)}
                  onToggleReplyLike={(replyId) =>
                    toggleReplyLike(comment.id, replyId)
                  }
                  onAddReply={addReply}
                />
              ))}
              <PostCommentInput onCommentSubmit={addComment} />{' '}
              {/* 댓글 추가 기능 */}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default PostDetailPage
