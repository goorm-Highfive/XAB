'use client'

import { useEffect, useState } from 'react'

import SurveyList from '~/components/home/survey-list'
import { ProfileSection } from '~/components/home/profile-section'
import { SuggestSection } from '~/components/home/suggest-section'
import { NewSurveyButton } from '~/components/home/new-survey-button'
import { toggleLikeAPI } from '~/utils/toggleLikeAPI'
import { voteSubmitAPI } from '~/utils/voteSubmitAPI'
import useSubscribeToPosts from '~/hooks/subscribe-posts'
import usePostStore from '~/stores/post-store'

export default function HomePage() {
  const posts = usePostStore((state) => state.posts)
  const setPosts = usePostStore((state) => state.setPosts)
  const updatePost = usePostStore((state) => state.updatePost)
  const [error, setError] = useState<string | null>(null)

  // 실시간 게시글 구독 활성화
  useSubscribeToPosts()

  useEffect(() => {
    async function fetchPosts() {
      setError(null) // 에러 초기화
      const apiUrl = `/api/posts/feed`

      try {
        const res = await fetch(apiUrl, { cache: 'no-store' })

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}))
          throw new Error(errJson.error || 'Failed to fetch posts')
        }

        const json = await res.json()
        setPosts(json.data ?? []) // 초기 데이터 설정
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unexpected error occurred')
        }
      }
    }

    fetchPosts()
  }, [setPosts])

  if (error) {
    console.error('Error fetching user data:', error)
  }

  const handleLikeToggle = async (postId: number) => {
    try {
      const data = await toggleLikeAPI(postId)

      // Zustand 상태 업데이트
      updatePost(postId, (post) => ({
        ...post,
        userLiked: data.liked,
        likes_count: data.liked ? post.likes_count + 1 : post.likes_count - 1,
      }))
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  const handleVoteSubmit = async (abTestId: number, option: 'A' | 'B') => {
    try {
      if (option !== 'A' && option !== 'B') {
        throw new Error('Invalid option type')
      }

      const data = await voteSubmitAPI(abTestId, option)

      if (data.voted) {
        // Zustand 상태 업데이트
        updatePost(abTestId, (post) => {
          const previousVote = post.userVote
          let newVotesA = post.votesA
          let newVotesB = post.votesB

          if (previousVote === 'A') {
            newVotesA -= 1
          } else if (previousVote === 'B') {
            newVotesB -= 1
          }

          if (option === 'A') {
            newVotesA += 1
          } else if (option === 'B') {
            newVotesB += 1
          }

          return {
            ...post,
            userVote: option,
            votesA: newVotesA,
            votesB: newVotesB,
          }
        })
      }
    } catch (err) {
      console.error('Error submitting vote:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-screen-2xl items-start gap-6 p-6 lg:flex">
        <div className="lg:w-72">
          <ProfileSection />
        </div>
        <div className="flex-1 space-y-6">
          <NewSurveyButton />
          <SurveyList
            posts={posts}
            onLikeToggle={handleLikeToggle}
            onVoteSubmit={handleVoteSubmit}
          />
        </div>
        <SuggestSection />
      </div>
    </div>
  )
}
