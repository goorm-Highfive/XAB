// src/components/common/survey-card.tsx
'use client'
import { Card } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { formatLikeCount } from '~/utils/like-formatters'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Heart, MessageSquare, Share2, Ellipsis } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tables } from '~/types/supabase'
import { createClient } from '~/utils/supabase/client'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { useRouter } from 'next/navigation'

export type SurveyCardProps = {
  post?: Tables<'posts'>
  abTest?: Tables<'ab_tests'>
  date: string
  userId: string
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
  currentUserId: string | null
}

function SurveyCard({
  date,
  userId,
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
  currentUserId,
}: SurveyCardProps) {
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfileImage = async () => {
      // 게시글 ID로 작성자의 프로필 이미지 가져오기
      const { data } = await createClient()
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

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        cache: 'no-store', // 캐싱 비활성화
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || '게시글 삭제 실패')
      }

      await response.json()
      alert('게시글이 삭제되었습니다.')
      router.push('/')
    } catch (error: unknown) {
      console.error('게시글 삭제 오류:', error)
      alert(
        error instanceof Error
          ? error.message
          : '게시글 삭제 중 문제가 발생했습니다.',
      )
    }
  }

  return (
    <Card className="mb-4 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Link href={`/profile/${userId}`} className="flex items-center gap-4">
          <div className="relative h-[40px] w-[40px] overflow-hidden rounded-full">
            <Image
              fill
              className="object-cover"
              src={userProfileImage || defaultProfile}
              alt={username}
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </Link>
        {userId === currentUserId ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded p-1 hover:bg-gray-100">
              <Ellipsis className="text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href={{
                    pathname: '/write',
                    query: {
                      postId: postId,
                    },
                  }}
                  className="block w-full"
                >
                  편집
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      {voteError && (
        <div
          className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{voteError}</span>
        </div>
      )}
      <Link href={`/survey-detail/${postId}`} className="block">
        <p className="mb-4 min-h-20 rounded-lg bg-gray-50 p-4 text-gray-800">
          {question}
        </p>
        {post_image_url && (
          <Image
            src={post_image_url}
            alt={question}
            width={600}
            height={400}
            className="h-auto w-full rounded-md"
          />
        )}
      </Link>

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
