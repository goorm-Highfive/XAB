// src/types/post.ts

export interface ABTestVote {
  id: number
  user_id: string
  preferred_variant: 'A' | 'B' // 'A' 또는 'B'로 제한
  created_at: string
}

export interface ABTest {
  id: number
  post_id: number
  variant_a_url: string | null
  variant_b_url: string | null
  description_a: string | null
  description_b: string | null
  created_at: string | null
  updated_at: string | null
  ab_test_votes: ABTestVote[]
}

export interface Post {
  post_id: number
  post_user_id: string
  username: string // 사용자 이름 추가
  post_image_url: string | null
  post_caption: string | null
  post_created_at: string
  post_updated_at: string
  ab_test_id: number | null
  variant_a_url: string | null
  variant_b_url: string | null
  description_a: string | null
  description_b: string | null
  ab_test_created_at: string | null
  ab_test_updated_at: string | null
  ab_test_votes: ABTestVote[]
  comments: { id: number }[]
  likes: { id: number }[]
  comments_count: number
  voteComplete: boolean
  likes_count: number
  userLiked: boolean
  userVote: 'A' | 'B' | null // 사용자 투표 정보 추가
  votesA: number // A 옵션에 대한 투표 수
  votesB: number // B 옵션에 대한 투표 수
}
