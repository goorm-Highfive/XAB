// src/components/common/survey-card.tsx
'use client'
import { Card } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { formatLikeCount } from '~/utils/like-formatters'
import { Heart, MessageSquare, Share2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'

type SurveyCardProps = {
  date: string
  username: string
  question: string
  post_image_url: string | null
  optionA: string
  optionB: string
  optionA_url: string | null
  optionB_url: string | null
  votesA: number
  votesB: number
  initLikeCount: number
  userLiked: boolean
  commentsCount: number
  userVote: 'A' | 'B' | null
  ab_test_id: number | null // ab_test_id 추가
  onLikeToggle?: () => void
  onVoteSubmit?: (abTestId: number, option: 'A' | 'B') => void // ab_test_id 사용
  postId: number // postId 추가
}

function SurveyCard({
  date,
  username,
  question,
  post_image_url,
  optionA,
  optionB,
  optionA_url,
  optionB_url,
  votesA,
  votesB,
  initLikeCount,
  onLikeToggle,
  onVoteSubmit,
  userLiked,
  commentsCount,
  userVote,
  ab_test_id,
  postId,
}: SurveyCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)

  const totalVotes = votesA + votesB

  const isOptionASelected = userVote === 'A'
  const isOptionBSelected = userVote === 'B'

  const handleOptionClick = async (option: 'A' | 'B') => {
    if (ab_test_id && onVoteSubmit) {
      setIsSubmitting(true)
      setVoteError(null)

      try {
        console.log('Selected option:', option) // 디버깅용
        await onVoteSubmit(ab_test_id, option) // 문자열로 전달
      } catch (error: unknown) {
        setVoteError(error.message || 'Failed to submit vote')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const isOptionASelected = userVote === 'A'
  const isOptionBSelected = userVote === 'B'

  const handleOptionClick = async (option: 'A' | 'B') => {
    if (ab_test_id && onVoteSubmit) {
      setIsSubmitting(true)
      setVoteError(null)

      try {
        console.log('Selected option:', option) // 디버깅용
        await onVoteSubmit(ab_test_id, option) // 문자열로 전달
      } catch (error: unknown) {
        setVoteError(error.message || 'Failed to submit vote')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Card className="mb-4 p-6 shadow-sm">
      <Link href={`/survey-detail/${postId}`}>
        <div className="block cursor-pointer">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-300" />
            <div>
              <p className="text-sm font-medium">{username}</p>{' '}
              <p className="text-xs text-gray-500">{date}</p>
            </div>
          </div>
          <p className="mb-4 text-gray-800">{question}</p>

          {post_image_url && (
            <div className="mb-4">
              <Image
                src={post_image_url}
                alt={question}
                width={600}
                height={400}
                className="rounded-md"
              />
            </div>
          )}
        </div>
      </Link>

      {/* 투표 에러 메시지 표시 */}
      {voteError && (
        <div
          className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{voteError}</span>
        </div>
      )}

      {/* AB 테스트가 있는 경우에만 투표 옵션 표시 */}
      {ab_test_id && (
        <div className="grid grid-cols-2 gap-4">
          {/* 옵션 A */}
          <div
            className={`flex cursor-pointer flex-col items-center rounded-lg border-2 bg-gray-200 p-4 transition ${
              isOptionASelected ? 'border-blue-500' : 'border-transparent'
            } hover:border-gray-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => handleOptionClick('A')}
          >
            <span className="text-gray-600">{optionA}</span>
            {optionA_url && (
              <a
                href={optionA_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2"
              >
                <Image
                  src={optionA_url}
                  alt={optionA}
                  width={150}
                  height={150}
                  className="rounded-md"
                />
              </a>
            )}
            <Progress
              value={totalVotes > 0 ? (votesA / totalVotes) * 100 : 0}
              className="mt-2 w-full"
            />
            <span className="text-xs">
              {totalVotes > 0
                ? `${Math.round((votesA / totalVotes) * 100)}%`
                : '0%'}
            </span>
          </div>

          {/* 옵션 B */}
          <div
            className={`flex cursor-pointer flex-col items-center rounded-lg border-2 bg-gray-200 p-4 transition ${
              isOptionBSelected ? 'border-blue-500' : 'border-transparent'
            } hover:border-gray-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => handleOptionClick('B')}
          >
            <span className="text-gray-600">{optionB}</span>
            {optionB_url && (
              <a
                href={optionB_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2"
              >
                <Image
                  src={optionB_url}
                  alt={optionB}
                  width={150}
                  height={150}
                  className="rounded-md"
                />
              </a>
            )}
            <Progress
              value={totalVotes > 0 ? (votesB / totalVotes) * 100 : 0}
              className="mt-2 w-full"
            />
            <span className="text-xs">
              {totalVotes > 0
                ? `${Math.round((votesB / totalVotes) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>
      )}

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
          {commentsCount}
        </button>
        <button className="flex items-center">
          <Share2 size={18} className="mr-1" />
          Share
        </button>
        {ab_test_id && (
          <span className="ml-auto">
            <strong>{totalVotes}</strong> Votes
          </span>
        )}
      </div>
    </Card>
  )
}

export { SurveyCard }
