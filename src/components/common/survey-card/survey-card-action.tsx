// components/common/survey-card/SurveyCardActions.tsx
'use client'
import { Heart, MessageSquare, Share2 } from 'lucide-react'
import Link from 'next/link'
import { formatLikeCount } from '~/utils/like-formatters'

interface SurveyCardActionsProps {
  userLiked: boolean | null
  initLikeCount: number
  commentsCount: number
  postId: number
  onLikeToggle?: () => void
  totalVotes?: number
  abTestId?: number | null
}

export function SurveyCardActions({
  userLiked,
  initLikeCount,
  commentsCount,
  postId,
  onLikeToggle,
  totalVotes,
  abTestId,
}: SurveyCardActionsProps) {
  return (
    <div className="mt-6 flex items-center gap-4 text-gray-500">
      {/* 좋아요 버튼 */}
      <button onClick={onLikeToggle} className="flex items-center">
        {userLiked ? (
          <Heart size={18} color="red" className="mr-4" strokeWidth={2} />
        ) : (
          <Heart size={18} color="gray" className="mr-4" />
        )}
        {formatLikeCount(initLikeCount)}
      </button>

      {/* 댓글 */}
      <Link href={`/survey-detail/${postId}`} className="flex items-center">
        <MessageSquare size={18} className="mr-1" />
        {commentsCount}
      </Link>

      {/* 공유 */}
      <button className="flex items-center">
        <Share2 size={18} className="mr-1" />
        Share
      </button>

      {/* 투표 수 (AB Test가 있을 때만) */}
      {abTestId && (
        <span className="ml-auto">
          <strong>{totalVotes ?? 0}</strong> Votes
        </span>
      )}
    </div>
  )
}
