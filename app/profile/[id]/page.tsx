'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { ProfileHeader } from '~/components/profile/profile-header'
import { SurveyCard } from '~/components/common/survey-card'
import { Skeleton } from '~/components/ui/skeleton'
import { Post } from '~/types/post'
import { SurveyCardSkeleton } from '~/components/common/surveycard-skeleton'
import { createClient } from '~/utils/supabase/client'

function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true) // 로딩 상태 추가
  const { id } = useParams() // URL에서 id 추출

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await createClient().auth.getUser()

      if (error) {
        console.error('사용자 정보를 가져오지 못했습니다:', error.message)
        return
      }

      setCurrentUserId(user?.id || null)
    }

    fetchCurrentUser()
  }, []) // 종속성 배열 비워도 안전

  useEffect(() => {
    async function fetchPosts() {
      const apiUrl = `/api/profile/${id}/user-posts` // 상대 경로 사용

      try {
        setLoading(true)
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
  }, [id])

  const handleLikeToggle = async (postId: number) => {
    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
        credentials: 'include',
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.error || 'Failed to toggle like')
      }

      const data = await res.json()

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
      } else {
        console.error('An unexpected error occurred')
      }
    }
  }

  const handleVoteSubmit = async (abTestId: number, option: 'A' | 'B') => {
    try {
      if (option !== 'A' && option !== 'B') {
        throw new Error('Invalid option type')
      }

      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ abTestId, option }),
        credentials: 'include',
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.error || 'Failed to submit vote')
      }

      const data = await res.json()

      if (data.voted) {
        const updatedPosts = posts.map((post: Post) => {
          if (post.ab_test_id === abTestId) {
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
    // 로딩 중 스켈레톤 UI
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="mx-auto mt-6 max-w-3xl space-y-6">
            {/* Profile Header Skeleton */}
            <div className="rounded-lg border bg-white p-6 shadow">
              <div className="mb-4 flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" /> {/* Avatar */}
                <div>
                  <Skeleton className="mb-2 h-6 w-32" /> {/* Username */}
                  <Skeleton className="h-4 w-24" /> {/* Bio */}
                </div>
              </div>
              <div className="flex gap-6">
                <Skeleton className="h-6 w-16" /> {/* Following */}
                <Skeleton className="h-6 w-16" /> {/* Followers */}
                <Skeleton className="h-6 w-16" /> {/* Posts */}
              </div>
            </div>

            {/* Survey Cards Skeleton */}
            {Array.from({ length: 3 }).map((_, idx) => (
              <SurveyCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="mx-auto mt-6 max-w-3xl space-y-6">
          <ProfileHeader />
          {posts.map((post) => (
            <SurveyCard
              userId={post.post_user_id}
              currentUserId={currentUserId}
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
              onLikeToggle={() => handleLikeToggle(post.post_id)}
              onVoteSubmit={(abTestId: number, selectedOption: 'A' | 'B') => {
                if (post.ab_test_id) {
                  handleVoteSubmit(post.ab_test_id, selectedOption)
                }
              }}
              voteComplete={
                post.voteComplete !== undefined ? post.voteComplete : false
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
