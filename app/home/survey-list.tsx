'use client'

import { SurveyCard } from '~/components/common/survey-card'
import { SurveyCardSkeleton } from '~/components/common/surveycard-skeleton'

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

          <SurveyCardSkeleton key={idx} />

        ))}
      </div>
    )
  }

  return (
    <>
      {posts.map((post) => (
        <SurveyCard
          key={post.post_id}
          userId={post.post_user_id}
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
