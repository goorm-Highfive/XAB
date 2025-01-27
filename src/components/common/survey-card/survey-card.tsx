'use client'
import { Card } from '~/components/ui/card'
import { toggleLikeAPI } from '~/utils/toggle-like-api'
import { voteSubmitAPI } from '~/utils/vote-submit-api'
import { SurveyCardHeader } from './survey-card-header'
import { SurveyCardBody } from './survey-card-body'
import { SurveyABTest } from './survey-abtest'
import { SurveyCardActions } from './survey-card-action'
import { useProfileImage } from './use-profile-image'
import { useState } from 'react'

export type SurveyCardProps = {
  post_id: number
  post_user_id: string
  username: string
  post_image_url: string | null
  post_caption: string
  post_created_at: string
  post_updated_at?: string
  ab_test_id?: number | null | undefined // undefined를 허용
  variant_a_url?: string | null
  variant_b_url?: string | null
  description_a?: string | null
  description_b?: string | null
  ab_test_created_at?: string | null
  ab_test_updated_at?: string | null
  comments_count: number
  likes_count: number
  userLiked?: boolean | null // 'userLiked'를 선택적으로 포함
  userVote?: 'A' | 'B' | null
  votesA?: number | null
  votesB?: number | null
  currentUserId: string | null
}

export function SurveyCard({
  post_id,
  post_user_id,
  username,
  post_image_url,
  post_caption,
  post_created_at,
  ab_test_id,
  variant_a_url,
  variant_b_url,
  description_a,
  description_b,
  votesA,
  votesB,
  userLiked,
  userVote,
  comments_count,
  likes_count,
  currentUserId,
}: SurveyCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false) // 중복 처리를 방지하기 위한 상태
  const [voteError, setVoteError] = useState<string | null>(null)
  const [liked, setLiked] = useState(userLiked) // 좋아요 상태 관리
  const [likeCount, setLikeCount] = useState(likes_count) // 좋아요 수 상태 관리
  const [currentVotesA, setCurrentVotesA] = useState(votesA) // A 투표 수 상태 관리
  const [currentVotesB, setCurrentVotesB] = useState(votesB) // B 투표 수 상태 관리
  const [currentUserVote, setCurrentUserVote] = useState(userVote) // 사용자 투표 상태 관리
  const userProfileImage = useProfileImage(post_id)

  // 좋아요 토글 함수
  const handleLikeToggle = async () => {
    if (isSubmitting) return // 처리 중일 때 무시
    setIsSubmitting(true)

    try {
      await toggleLikeAPI(post_id)
      setLiked((prev) => !prev)
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1)) // 좋아요 수 업데이트
    } catch (error) {
      console.error('Like toggle error:', error)
    } finally {
      setIsSubmitting(false) // 처리 완료
    }
  }

  const handleVoteSubmit = async (abTestId: number, option: 'A' | 'B') => {
    if (isSubmitting) return // 처리 중일 때 무시
    if (currentUserVote === option) return // 이미 선택한 옵션이면 무시
    setIsSubmitting(true)
    setVoteError(null)

    try {
      await voteSubmitAPI(abTestId, option)
      setCurrentUserVote(option) // 사용자의 선택 업데이트

      if (option === 'A') {
        setCurrentVotesA((prev) => (prev ?? 0) + 1) // prev가 null일 경우 0으로 처리
        if (currentUserVote === 'B') {
          setCurrentVotesB((prev) => (prev ?? 0) - 1) // 이전 B 투표를 취소
        }
      } else if (option === 'B') {
        setCurrentVotesB((prev) => (prev ?? 0) + 1) // prev가 null일 경우 0으로 처리
        if (currentUserVote === 'A') {
          setCurrentVotesA((prev) => (prev ?? 0) - 1) // 이전 A 투표를 취소
        }
      }
    } catch (error) {
      console.error('Vote submission error:', error)
      setVoteError(error instanceof Error ? error.message : '투표 오류')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-4 p-6 shadow-sm">
      {/* 헤더 */}
      <SurveyCardHeader
        userId={post_user_id}
        currentUserId={currentUserId}
        username={username}
        date={post_created_at}
        userProfileImage={userProfileImage}
        postId={post_id}
      />

      {/* 투표 에러 표시 */}
      {voteError && (
        <div
          className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{voteError}</span>
        </div>
      )}

      {/* 본문 */}
      <SurveyCardBody
        postId={post_id}
        question={post_caption}
        postImageUrl={post_image_url}
      />

      {/* AB 테스트 */}
      {ab_test_id && (
        <SurveyABTest
          abTestId={ab_test_id}
          optionA={description_a ?? null} // undefined인 경우 null로 처리
          optionB={description_b ?? null} // undefined인 경우 null로 처리
          optionAUrl={variant_a_url ?? null}
          optionBUrl={variant_b_url ?? null}
          votesA={currentVotesA ?? null}
          votesB={currentVotesB ?? null}
          userVote={currentUserVote ?? null}
          onVoteSubmit={handleVoteSubmit}
        />
      )}

      {/* 좋아요 & 댓글 & 공유 영역 */}
      <SurveyCardActions
        userLiked={liked ?? null}
        initLikeCount={likeCount}
        commentsCount={comments_count}
        postId={post_id}
        onLikeToggle={handleLikeToggle}
        totalVotes={(currentVotesA ?? 0) + (currentVotesB ?? 0)} // 기본값 0으로 설정
        abTestId={ab_test_id}
      />
    </Card>
  )
}
