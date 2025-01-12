'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { createClient } from '~/utils/supabase/client'

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

  if (loading) {
    return <div>Loading profile...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!user) {
    return <div>No user data found</div>
  }

  return (
    <Card className="static top-[92px] mb-6 w-full lg:sticky lg:w-72">
      <CardHeader className="items-center gap-5">
        <Avatar className="size-20 items-center justify-center">
          {user.profile_image ? (
            <AvatarImage src={user.profile_image} alt={`@${user.username}`} />
          ) : (
            <AvatarFallback className="text-4xl font-semibold">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <CardTitle>{user.username}</CardTitle>
          <CardDescription>{user.bio || 'No bio available'}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-bold">{user.postCount}</span>
          <span className="text-sm text-muted-foreground">Posts</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-bold">{user.followerCount}</span>
          <span className="text-sm text-muted-foreground">Followers</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-bold">{user.followingCount}</span>
          <span className="text-sm text-muted-foreground">Following</span>
        </div>
      </CardContent>
    </Card>
  )
}

export { ProfileSection }
