// src/components/common/survey-card.tsx

'use client'

import { CustomAlertDialog } from '~/components/common/custom-alert-dialog'
import { Card } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { formatLikeCount } from '~/utils/like-formatters'
import { Heart, MessageSquare, Share2 } from 'lucide-react'

type SurveyCardProps = {
  date: string
  username: string // username 추가
  question: string
  optionA: string
  optionB: string
  votesA: number
  votesB: number
  voteComplete: boolean // 투표 여부
  initLikeCount: number
  userLiked: boolean // 현재 사용자 좋아요 상태
  commentsCount: number // 댓글 수
  onLikeToggle?: () => void
  onVoteSubmit?: (option: 'A' | 'B') => void
}

function SurveyCard({
  date,
  username, // username 추가
  question,
  optionA,
  optionB,
  votesA,
  votesB,
  voteComplete,
  initLikeCount,
  onLikeToggle,
  onVoteSubmit,
  userLiked,
  commentsCount, // 댓글 수 추가
}: SurveyCardProps) {
  // 전체 투표 수
  const totalVotes = votesA + votesB

  return (
    <Card className="mb-4 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-300" />
        <div>
          <p className="text-sm font-medium">{username}</p>{' '}
          {/* username 표시 */}
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-800">{question}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center rounded-lg bg-gray-200 p-4">
          <span className="text-gray-600">{optionA}</span>
          <Progress
            value={totalVotes > 0 ? (votesA / totalVotes) * 100 : 0}
            className="mt-2 w-full"
          />
          <span className="text-xs">
            {totalVotes > 0
              ? `${Math.round((votesA / totalVotes) * 100)}%`
              : '0%'}
          </span>

          {/* 투표 버튼은 voteComplete가 false일 때만 보입니다 */}
          {!voteComplete && (
            <CustomAlertDialog
              triggerBtnText="Vote"
              alertTitle={`Your vote for ${optionA} has been submitted.`}
              actionBtnText="Confirm"
              onActionClick={() => onVoteSubmit && onVoteSubmit('A')}
            />
          )}
        </div>
        <div className="flex flex-col items-center rounded-lg bg-gray-200 p-4">
          <span className="text-gray-600">{optionB}</span>
          <Progress
            value={totalVotes > 0 ? (votesB / totalVotes) * 100 : 0}
            className="mt-2 w-full"
          />
          <span className="text-xs">
            {totalVotes > 0
              ? `${Math.round((votesB / totalVotes) * 100)}%`
              : '0%'}
          </span>

          {/* 투표 버튼은 voteComplete가 false일 때만 보입니다 */}
          {!voteComplete && (
            <CustomAlertDialog
              triggerBtnText={'Vote'}
              alertTitle={`Your vote for ${optionB} has been submitted.`}
              actionBtnText="Confirm"
              onActionClick={() => onVoteSubmit && onVoteSubmit('B')}
            />
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-gray-500">
        <button onClick={onLikeToggle} className="flex items-center">
          {userLiked ? (
            <Heart size={18} color="red" className="mr-4" strokeWidth={2} />
          ) : (
            <Heart size={18} color="gray" className="mr-4" />
          )}
          {formatLikeCount(initLikeCount)}
        </button>
        <button className="flex items-center">
          <MessageSquare size={18} className="mr-1" />
          {commentsCount} {/* 댓글 수 표시 */}
        </button>
        <button className="flex items-center">
          <Share2 size={18} className="mr-1" />
          Share
        </button>
        <span className="ml-auto">
          <strong>{totalVotes}</strong> Votes
        </span>
      </div>
    </Card>
  )
}

export { SurveyCard }
