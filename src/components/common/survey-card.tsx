// src/components/common/survey-card.tsx
'use client'
import { Card } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { formatLikeCount } from '~/utils/like-formatters'
import { Heart, MessageSquare, Share2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tables } from '~/types/supabase'
import { createClient } from '~/utils/supabase/client'
import defaultProfile from '~/assets/svgs/default-profile.svg'

export type SurveyCardProps = {
  post?: Tables<'posts'>
  abTest?: Tables<'ab_tests'>
  date: string
  username: string
  question: string
  post_image_url: string | null
  optionA: string | null
  optionB: string | null
  optionA_url: string | null
  optionB_url: string | null
  votesA: number
  votesB: number
  initLikeCount: number
  userLiked: boolean
  commentsCount: number
  userVote: 'A' | 'B' | null
  ab_test_id: number | null
  onLikeToggle?: () => void
  onVoteSubmit?: (abTestId: number, option: 'A' | 'B') => void
  postId: number
  voteComplete: boolean // 추가된 부분
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
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)
  //const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const fetchProfileImage = async () => {
      // 게시글 ID로 작성자의 프로필 이미지 가져오기
      const { data } = await supabase
        .from('posts')
        .select(
          `
            user_id,
            users (
              profile_image
            )
          `,
        )
        .eq('id', postId)
        .single()

      if (data?.users?.profile_image) {
        setUserProfileImage(data.users.profile_image)
      }
    }
    fetchProfileImage()
  }, [postId])

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
        await onVoteSubmit(ab_test_id, option)
      } catch (error: unknown) {
        setVoteError(
          error instanceof Error ? error.message : 'Failed to submit vote',
        )
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
            <div className="relative mr-4 h-[40px] w-[40px] overflow-hidden rounded-full">
              {userProfileImage ? (
                <Image
                  fill
                  className="object-cover"
                  src={userProfileImage}
                  alt={username}
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  priority
                />
              ) : (
                <Image
                  fill
                  className="object-cover"
                  src={defaultProfile}
                  alt={username}
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  priority
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{username}</p>
              <p className="text-xs text-gray-500">{date}</p>
            </div>
          </div>
          <p className="mb-4 text-gray-800">{question}</p>

          {post_image_url && (
            <div className="mb-4">
              <Image
                src={post_image_url || 'post_image'}
                alt={question}
                width={600}
                height={400}
                className="h-auto w-full rounded-md"
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
            className={`flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 bg-gray-200 p-4 transition ${
              isOptionASelected ? 'border-gray-800' : 'border-transparent'
            } hover:border-gray-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => handleOptionClick('A')}
          >
            <div className={`flex flex-col items-center`}>
              <span className="text-md mb-3 font-bold text-gray-600">
                {optionA || 'A'}
              </span>
              {optionA_url && (
                <a
                  href={optionA_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2"
                >
                  <Image
                    src={optionA_url}
                    alt={optionA || 'optionA'}
                    width={150}
                    height={150}
                    className="h-auto w-full rounded-md"
                  />
                </a>
              )}
            </div>
            <div className="flex w-full flex-col items-center">
              <Progress
                value={totalVotes > 0 ? (votesA / totalVotes) * 100 : 0}
                className="mt-2"
              />
              <span className="mt-2 text-xs">
                {totalVotes > 0
                  ? `${Math.round((votesA / totalVotes) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>

          {/* 옵션 B */}
          <div
            className={`flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 bg-gray-200 p-4 transition ${
              isOptionBSelected ? 'border-gray-800' : 'border-transparent'
            } hover:border-gray-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => handleOptionClick('B')}
          >
            <div className={`flex flex-col items-center`}>
              <span className="text-md mb-3 font-bold text-gray-600">
                {optionB || 'B'}
              </span>
              {optionB_url && (
                <a
                  href={optionB_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2"
                >
                  <Image
                    src={optionB_url}
                    alt={optionA || 'optionA'}
                    width={150}
                    height={150}
                    className="h-auto w-full rounded-md"
                  />
                </a>
              )}
            </div>
            <div className="flex w-full flex-col items-center">
              <Progress
                value={totalVotes > 0 ? (votesB / totalVotes) * 100 : 0}
                className="mt-2"
              />
              <span className="mt-2 text-xs">
                {totalVotes > 0
                  ? `${Math.round((votesB / totalVotes) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4 text-gray-500">
        <button onClick={onLikeToggle} className="flex items-center">
          {userLiked ? (
            <Heart size={18} color="red" className="mr-4" strokeWidth={2} />
          ) : (
            <Heart size={18} color="gray" className="mr-4" />
          )}
          {formatLikeCount(initLikeCount)}
        </button>
        <Link href={`/survey-detail/${postId}`} className="flex items-center">
          <MessageSquare size={18} className="mr-1" />
          {commentsCount}
        </Link>
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
