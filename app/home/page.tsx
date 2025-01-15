'use client'

import { useEffect, useState } from 'react'

import SurveyList from '#/home/survey-list'
import { ProfileSection } from '~/components/home/profile-section'
import { SuggestSection } from '~/components/home/suggest-section'
import { NewSurveyButton } from '~/components/home/new-survey-button'
import { toggleLikeAPI } from '~/utils/toggleLikeAPI'
import { voteSubmitAPI } from '~/utils/voteSubmitAPI'
import { Post } from '~/types/post'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      const apiUrl = `/api/posts/feed` // 상대 경로 사용

      try {
        const res = await fetch(apiUrl, {
          cache: 'no-store',
        })

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}))
          throw new Error(errJson.error || 'Failed to fetch posts')
        }

        const json = await res.json()
        setPosts(json.data ?? [])
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // useEffect(() => {
  //   async function fetchUser() {
  //     try {
  //       const res = await fetch('/api/user', { credentials: 'include' });
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch user');
  //       }
  //       const userData = await res.json();
  //       setUser(userData);
  //     } catch (err) {
  //       console.error('User fetch error:', err);
  //     }
  //   }

  //   fetchUser();
  // }, []);

  const handleLikeToggle = async (postId: number) => {
    try {
      // 서버에 좋아요 토글 요청
      const data = await toggleLikeAPI(postId)

      // 서버 응답에 따라 로컬 상태 업데이트
      const updatedPosts = posts.map((post: Post) => {
        if (post.post_id === postId) {
          return {
            ...post,
            userLiked: data.liked,
            likes_count: data.liked
              ? post.likes_count + 1
              : post.likes_count - 1,
          }
        }
        return post
      })

      setPosts(updatedPosts)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
        // 사용자에게 에러를 표시할 수 있는 로직 추가 (예: 알림)
      } else {
        console.error('An unexpected error occurred')
      }
    }
  }

  const handleVoteSubmit = async (abTestId: number, option: 'A' | 'B') => {
    try {
      console.log('Submitting vote for abTestId:', abTestId)
      console.log('Option selected:', option)

      if (option !== 'A' && option !== 'B') {
        throw new Error('Invalid option type')
      }

      const data = await voteSubmitAPI(abTestId, option)
      console.log('Vote response:', data)

      // 상태 업데이트 로직
      if (data.voted) {
        const updatedPosts = posts.map((post: Post) => {
          if (post.ab_test_id === abTestId) {
            // 이전 투표를 취소하고 새로운 투표를 반영
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
          }
          return post
        })

        setPosts(updatedPosts)
      }
    } catch (err) {
      console.error('Vote submission error:', err)
    }
  }

  if (loading) {
    return <div>Loading posts...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-screen-2xl items-start gap-6 p-6 lg:flex">
        <ProfileSection />
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
