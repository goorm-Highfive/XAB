// app/home/survey-list.tsx

'use client'

import { SurveyCard } from '~/components/common/survey-card'
import { Post } from '~/types/post' // 타입 임포트

interface SurveyListProps {
  posts: Post[]
}

export default function SurveyList({ posts }: SurveyListProps) {
  console.log('Posts Data Structure:', JSON.stringify(posts, null, 2))

  return (
    <>
      {posts.map((post) => (
        <SurveyCard
          key={post.post_id} // 고유한 post_id 사용
          date={post.post_created_at ?? 'Unknown date'}
          username={post.username} // username 전달
          question={post.post_caption ?? 'No caption'}
          optionA={post.description_a ?? 'Variant A'}
          optionB={post.description_b ?? 'Variant B'}
          votesA={
            post.ab_test_votes.filter((vote) => vote.preferred_variant === 'A')
              .length
          }
          votesB={
            post.ab_test_votes.filter((vote) => vote.preferred_variant === 'B')
              .length
          }
          voteComplete={false} // 필요한 로직에 따라 업데이트
          initLikeCount={post.likes_count}
          userLiked={post.userLiked}
          commentsCount={post.comments_count} // 댓글 수 추가
          onLikeToggle={() => {
            // 좋아요 토글 로직 구현
            console.log(`Like toggled for post ${post.post_id}`)
            // 실제 좋아요 토글 로직을 추가하세요.
          }}
          onVoteSubmit={(option) => {
            // 투표 제출 로직 구현
            console.log(
              `Vote submitted for post ${post.post_id}, option ${option}`,
            )
            // 실제 투표 제출 로직을 추가하세요.
          }}
        />
      ))}
    </>
  )
}
