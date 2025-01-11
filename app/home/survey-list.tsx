// app/home/survey-list.tsx

'use client'

import { SurveyCard } from '~/components/common/survey-card'
import { Post } from '~/types/post' // 타입 임포트
import { useState } from 'react'

interface SurveyListProps {
  posts: Post[]
}

export default function SurveyList({ posts }: SurveyListProps) {
  const [localPosts, setLocalPosts] = useState(posts)

  console.log('Posts Data Structure:', JSON.stringify(localPosts, null, 2))

  return (
    <>
      {localPosts.map((post) => (
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
          initLikeCount={post.likes_count}
          userLiked={post.userLiked}
          commentsCount={post.comments_count} // 댓글 수 추가
          onLikeToggle={async () => {
            try {
              const res = await fetch('/api/like', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: post.post_id }),
                credentials: 'include',
              })

              if (!res.ok) {
                const errJson = await res.json().catch(() => ({}))
                throw new Error(errJson.error || 'Failed to toggle like')
              }

              const data = await res.json()
              console.log(
                `Like toggled for post ${post.post_id}: ${data.liked ? 'Liked' : 'Unliked'}`,
              )

              // 좋아요 상태 업데이트
              setLocalPosts((prevPosts) =>
                prevPosts.map((p) =>
                  p.post_id === post.post_id
                    ? {
                        ...p,
                        userLiked: data.liked,
                        likes_count: data.liked
                          ? p.likes_count + 1
                          : p.likes_count - 1,
                      }
                    : p,
                ),
              )
            } catch (err) {
              console.error('Error toggling like:', err)
            }
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
