'use client'

import { useState } from 'react'

import { SiteHeader } from '~/components/common/site-header'
import { SurveyCard } from '~/components/common/survey-card'
import { CommentsCard } from '~/components/post-comments-card'

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
    writer: 'John Doe',
    content: 'This is a comment on the post. Great article!',
    likeCount: 10,
    date: '2 hours ago',
    userLiked: false,
  },
  {
    id: '2',
    writer: 'John Doe',
    content: 'This is a comment on the post. Great article!',
    likeCount: 10,
    date: '3 hours ago',
    userLiked: false,
  },
  {
    id: '3',
    writer: 'Jane Smith',
    content: 'I totally agree with this perspective. Very insightful!',
    likeCount: 5,
    date: '1 hour ago',
    userLiked: true,
    replies: [
      {
        id: '3-1',
        writer: 'John Doe',
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
  console.log(surveyData)

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
          <CommentsCard comments={commentMokData}></CommentsCard>
        </section>
      </div>
    </div>
  )
}

export default PostDetailPage
