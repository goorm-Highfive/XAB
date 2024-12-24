'use client'

import { useState } from 'react'
import { CustomAlertDialog } from '~/components/common/custom-alert-dialog'
import { Card } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Heart, MessageSquare, Share2 } from 'lucide-react'

type SurveyCardProps = {
  date: string
  question: string
  optionA: string
  optionB: string
  votesA: number
  votesB: number
  voteComplete: boolean // 투표 여부
  initLikeCount: number
  userLiked: boolean // 현재 사용자 좋아요 상태
}

function SurveyCard({
  date,
  question,
  optionA,
  optionB,
  votesA,
  votesB,
  voteComplete,
  initLikeCount,
  userLiked,
}: SurveyCardProps) {
  // 투표 완료 상태 관리
  const [isVoteComplete, setIsVoteComplete] = useState(voteComplete)

  // 좋아요 상태 및 좋아요 카운트 관리
  const [liked, setLiked] = useState(userLiked)
  const [likeCount, setLikeCount] = useState(initLikeCount)

  // 좋아요 토글 함수
  const toggleLike = () => {
    setLikeCount((prevCount) =>
      liked ? Math.max(prevCount - 1, 0) : prevCount + 1,
    )
    setLiked((prev) => !prev)
  }

  // 좋아요 카운트 포맷
  const formatLikeCount = (count: number) => {
    if (count >= 1000) return `${Math.round(count / 100) / 10}k`
    return count.toString()
  }

  // 투표 처리 함수
  const handleVoteSubmit = () => {
    if (!isVoteComplete) setIsVoteComplete(true)
  }

  // A와 B의 투표 수 합
  const totalVotes = votesA + votesB

  return (
    <Card className="mb-4 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-300" />
        <div>
          <p className="text-sm font-medium">Alex Thompson</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-800">{question}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center rounded-lg bg-gray-200 p-4">
          <span className="text-gray-600">{optionA}</span>
          <Progress
            value={(votesA / totalVotes) * 100}
            className="mt-2 w-full"
          />
          <span className="text-xs">
            {Math.round((votesA / totalVotes) * 100)}%
          </span>

          {/* 투표 버튼은 isVoteComplete가 false일 때만 보입니다 */}
          {!isVoteComplete && (
            <CustomAlertDialog
              triggerBtnText="Vote"
              alertTitle={`Your vote for ${optionA} has been submitted.`}
              actionBtnText="Confirm"
              onActionClick={() => handleVoteSubmit('A')}
            />
          )}
        </div>
        <div className="flex flex-col items-center rounded-lg bg-gray-200 p-4">
          <span className="text-gray-600">{optionB}</span>
          <Progress
            value={(votesB / totalVotes) * 100}
            className="mt-2 w-full"
          />
          <span className="text-xs">
            {Math.round((votesB / totalVotes) * 100)}%
          </span>

          {/* 투표 버튼은 isVoteComplete가 false일 때만 보입니다 */}
          {!isVoteComplete && (
            <CustomAlertDialog
              triggerBtnText={'Vote'}
              alertTitle={`Your vote for ${optionB} has been submitted.`}
              actionBtnText="Confirm"
              onActionClick={() => handleVoteSubmit('B')}
            />
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-gray-500">
        <button onClick={toggleLike} className="flex items-center">
          {liked ? (
            <Heart size={18} color="red" className="mr-4" strokeWidth={2} />
          ) : (
            <Heart size={18} color="gray" className="mr-4" />
          )}
          {formatLikeCount(likeCount)}
        </button>
        <MessageSquare size={18} /> 128
        <Share2 size={18} /> Share
        <span className="ml-auto">
          <strong>{totalVotes}</strong> Votes
        </span>
      </div>
    </Card>
  )
}

export { SurveyCard }
