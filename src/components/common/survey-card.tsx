'use client'

import { Card } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Heart, MessageSquare, Share2 } from 'lucide-react'

import { useState } from 'react'
import { CustomAlertDialog } from '~/components/common/custom-alert-dialog'

type SurveyCardProps = {
  date: string
  question: string
  optionA: string
  optionB: string
  votesA: number
  votesB: number
  showVoteBtn?: boolean //true일 경우 투표 버튼 표시
}

function SurveyCard({
  date,
  question,
  optionA,
  optionB,
  votesA,
  votesB,
  showVoteBtn = false,
}: SurveyCardProps) {
  //투표 완료 여부
  const [voteComplete, setVoteComplete] = useState(false)

  const handleVoteSubmit = () => {
    setVoteComplete(true)
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

          {/* 투표 버튼은 상세페이지 && 투표하지 않았을 경우에만 보입니다 */}
          {showVoteBtn && !voteComplete && (
            <CustomAlertDialog
              triggerBtnText={'Vote'}
              alertTitle={`Your vote for ${optionA} has been submitted.`}
              actionBtnText="Confirm"
              onActionClick={() => handleVoteSubmit()}
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

          {/* 투표 버튼은 상세페이지 && 투표하지 않았을 경우에만 보입니다 */}
          {showVoteBtn && !voteComplete && (
            <CustomAlertDialog
              triggerBtnText={'Vote'}
              alertTitle={`Your vote for ${optionB} has been submitted.`}
              actionBtnText="Confirm"
              onActionClick={() => handleVoteSubmit()}
            />
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-6 text-gray-500">
        <Heart size={18} /> 2.4k
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
