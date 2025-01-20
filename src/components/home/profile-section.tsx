'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { createClient } from '~/utils/supabase/client'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { Skeleton } from '~/components/ui/skeleton'

function ProfileSection() {
  const [user, setUser] = useState<{
    username: string
    email: string
    profile_image: string | null
    bio: string | null
    created_at: string
    postCount: number
    followerCount: number
    followingCount: number
  } | null>(null)

  const [authUserId, setAuthUserId] = useState<string | null>(null) // Supabase auth user ID
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuthUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error('Failed to fetch authenticated user:', error.message)
      } else if (user) {
        setAuthUserId(user.id)
      }
    }

    fetchAuthUser()
  }, [])

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true)
        const response = await fetch(`/api/profile/${authUserId}/user-profile`)
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        )
      } finally {
        setLoading(false)
      }
    }

    if (authUserId) {
      fetchUserProfile()
    }
  }, [authUserId])

  if (error) {
    return <div>Error: {error}</div>
  }

  if (loading || !user) {
    return (
      <Card className="static top-[92px] mb-6 w-full lg:sticky lg:w-72">
        <CardHeader className="items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full" /> {/* 프로필 이미지 */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Skeleton className="h-6 w-24" /> {/* 사용자 이름 */}
            <Skeleton className="h-4 w-40" /> {/* 사용자 설명 */}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-1 text-center"
            >
              <Skeleton className="h-4 w-8" /> {/* 숫자 */}
              <Skeleton className="h-4 w-16" /> {/* 텍스트 */}
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="static top-[92px] mb-6 w-full lg:sticky lg:w-72">
      <CardHeader className="items-center gap-5">
        <div className="relative h-[70px] w-[70px] overflow-hidden rounded-full">
          {user.profile_image ? (
            <Image
              className="object-cover"
              src={user.profile_image}
              alt={`@${user.username}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              priority
            />
          ) : (
            <Image
              className="object-cover"
              src={defaultProfile}
              alt={`@${user.username}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              priority
            />
          )}
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <CardTitle>{user.username}</CardTitle>
          <CardDescription>{user.bio || 'No bio available'}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-bold">{user.followingCount}</span>
          <span className="text-sm text-muted-foreground">Following</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-bold">{user.followerCount}</span>
          <span className="text-sm text-muted-foreground">Followers</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-bold">{user.postCount}</span>
          <span className="text-sm text-muted-foreground">Posts</span>
        </div>
      </CardContent>
    </Card>
  )
}

export { ProfileSection }
