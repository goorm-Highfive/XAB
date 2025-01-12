'use client'

import { useEffect, useState } from 'react'
import { ProfileHeader } from '~/components/profile/profile-header'
import { useParams } from 'next/navigation'
import { SurveyCard } from '~/components/common/survey-card'
import { Post } from '~/types/post'

function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { userId } = useParams() // URL에서 id 추출

  useEffect(() => {
    async function fetchPosts() {
      const apiUrl = `/api/profile/${userId}/user-posts` // 상대 경로 사용

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
  }, [userId])

  const handleLikeToggle = async (postId: number) => {
    try {
      // 서버에 좋아요 토글 요청
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
        credentials: 'include', // 쿠키 포함
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.error || 'Failed to toggle like')
      }

      const data = await res.json()

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
    return <p>Loading...</p>
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }
  console.log(posts)
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="mx-auto mt-6 max-w-3xl space-y-6">
          <ProfileHeader />
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
