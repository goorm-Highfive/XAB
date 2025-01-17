'use client'

import { SurveyCard } from '~/components/common/survey-card'
import { Skeleton } from '~/components/ui/skeleton'
import { Post } from '~/types/post'

interface SurveyListProps {
  posts: Post[]
  onLikeToggle: (postId: number) => void
  onVoteSubmit: (abTestId: number, selectedOption: 'A' | 'B') => void
}

export default function SurveyList({
  posts,
  onLikeToggle,
  onVoteSubmit,
}: SurveyListProps) {
  const loading = posts.length === 0 // posts가 비어 있으면 로딩 상태로 간주

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
            {/* 프로필 섹션 */}
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" /> {/* 아바타 */}
              <div className="flex flex-col space-y-1">
                <Skeleton className="h-4 w-24" /> {/* 이름 */}
                <Skeleton className="h-3 w-16" /> {/* 날짜 */}
              </div>
            </div>

            {/* 질문 제목 */}
            <Skeleton className="mb-4 h-6 w-2/3" />

            {/* A와 B 옵션 */}
            <div className="flex justify-between gap-5">
              <Skeleton className="mb-2 h-64 w-full rounded-md" />{' '}
              <Skeleton className="mb-2 h-64 w-full rounded-md" />{' '}
            </div>

            {/* 하단 액션 버튼 */}
            <div className="mt-4 flex justify-between">
              <div className="mt-4 flex justify-start gap-1">
                <Skeleton className="h-4 w-10" /> {/* 좋아요 */}
                <Skeleton className="h-4 w-10" /> {/* 댓글 */}
                <Skeleton className="h-4 w-10" /> {/* 공유 */}
              </div>
              <div>
                <Skeleton className="h-4 w-10" /> {/* 투표 */}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {posts.map((post) => (
        <SurveyCard
          key={post.post_id}
          postId={post.post_id}
          ab_test_id={post.ab_test_id}
          date={post.post_created_at.split('T')[0] ?? 'Unknown date'}
          username={post.username}
          question={post.post_caption ?? 'No caption'}
          post_image_url={post.post_image_url}
          optionA={post.description_a ?? 'A'}
          optionB={post.description_b ?? 'B'}
          optionA_url={post.variant_a_url}
          optionB_url={post.variant_b_url}
          votesA={post.votesA}
          votesB={post.votesB}
          initLikeCount={post.likes_count}
          userLiked={post.userLiked}
          commentsCount={post.comments_count}
          userVote={post.userVote}
          onLikeToggle={() => onLikeToggle(post.post_id)}
          onVoteSubmit={(abTestId: number, selectedOption: 'A' | 'B') => {
            if (post.ab_test_id) {
              onVoteSubmit(post.ab_test_id, selectedOption)
            }
          }}
          voteComplete={
            post.voteComplete !== undefined ? post.voteComplete : false
          }
        />
      ))}
    </>
  )
}
