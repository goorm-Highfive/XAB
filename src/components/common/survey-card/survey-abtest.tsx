'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Progress } from '~/components/ui/progress'

interface SurveyABTestProps {
  abTestId: number
  optionA: string | null
  optionB: string | null
  optionAUrl: string | null
  optionBUrl: string | null
  votesA: number | null
  votesB: number | null
  userVote: 'A' | 'B' | null
  onVoteSubmit?: (abTestId: number, option: 'A' | 'B') => Promise<void>
}

export function SurveyABTest({
  abTestId,
  optionA,
  optionB,
  optionAUrl,
  optionBUrl,
  votesA,
  votesB,
  userVote,
  onVoteSubmit,
}: SurveyABTestProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)

  // votesA와 votesB가 null인 경우 기본값 0을 설정
  const safeVotesA = votesA ?? 0
  const safeVotesB = votesB ?? 0
  const totalVotes = safeVotesA + safeVotesB // 안전한 연산

  const isOptionASelected = userVote === 'A'
  const isOptionBSelected = userVote === 'B'

  const handleOptionClick = async (option: 'A' | 'B') => {
    if (!abTestId || !onVoteSubmit) return
    setIsSubmitting(true)
    setVoteError(null)

    try {
      await onVoteSubmit(abTestId, option)
    } catch (error: unknown) {
      setVoteError(
        error instanceof Error ? error.message : 'Failed to submit vote',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-4">
      {voteError && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{voteError}</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {/* 옵션 A */}
        <div
          className={`flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 bg-gray-200 p-4 transition ${
            isOptionASelected ? 'border-gray-800' : 'border-transparent'
          } hover:border-gray-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={() => !isSubmitting && handleOptionClick('A')}
        >
          <div className="flex flex-col items-center">
            <span className="text-md mb-3 font-bold text-gray-600">
              {optionA || 'A'}
            </span>
            {optionAUrl && (
              <a
                href={optionAUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2"
              >
                <Image
                  src={optionAUrl}
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
              value={totalVotes > 0 ? (safeVotesA / totalVotes) * 100 : 0}
              className="mt-2 w-full"
            />
            <span className="mt-2 text-xs">
              {totalVotes > 0
                ? `${Math.round((safeVotesA / totalVotes) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* 옵션 B */}
        <div
          className={`flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 bg-gray-200 p-4 transition ${
            isOptionBSelected ? 'border-gray-800' : 'border-transparent'
          } hover:border-gray-400 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={() => !isSubmitting && handleOptionClick('B')}
        >
          <div className="flex flex-col items-center">
            <span className="text-md mb-3 font-bold text-gray-600">
              {optionB || 'B'}
            </span>
            {optionBUrl && (
              <a
                href={optionBUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2"
              >
                <Image
                  src={optionBUrl}
                  alt={optionB || 'optionB'}
                  width={150}
                  height={150}
                  className="h-auto w-full rounded-md"
                />
              </a>
            )}
          </div>
          <div className="flex w-full flex-col items-center">
            <Progress
              value={totalVotes > 0 ? (safeVotesB / totalVotes) * 100 : 0}
              className="mt-2 w-full"
            />
            <span className="mt-2 text-xs">
              {totalVotes > 0
                ? `${Math.round((safeVotesB / totalVotes) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
