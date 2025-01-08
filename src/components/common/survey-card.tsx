import { CustomAlertDialog } from '~/components/common/custom-alert-dialog'
import { Card } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { formatLikeCount } from '~/utils/like-formatters'
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
  onLikeToggle?: () => void
  onVoteSubmit?: (option: 'A' | 'B') => void
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
  onLikeToggle,
  onVoteSubmit,
  userLiked,
}: SurveyCardProps) {
  // 전체 투표 수
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
            value={(votesB / totalVotes) * 100}
            className="mt-2 w-full"
          />
          <span className="text-xs">
            {Math.round((votesB / totalVotes) * 100)}%
          </span>

          {/* 투표 버튼은 isVoteComplete가 false일 때만 보입니다 */}
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
