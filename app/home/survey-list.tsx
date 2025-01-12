'use client'

import { SurveyCard } from '~/components/common/survey-card'
import { Post } from '~/types/post'

interface SurveyListProps {
  posts: Post[]
  onLikeToggle: (postId: number) => void
  onVoteSubmit: (abTestId: number, selectedOption: 'A' | 'B') => void // 수정됨
}

export default function SurveyList({
  posts,
  onLikeToggle,
  onVoteSubmit,
}: SurveyListProps) {
  console.log(posts)

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
          optionA={post.description_a ?? 'Variant A'}
          optionB={post.description_b ?? 'Variant B'}
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
