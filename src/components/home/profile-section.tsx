'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import Link from 'next/link'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true)
        const response = await fetch('/api/profile')
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

    fetchUserProfile()
  }, [])

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
      <CardFooter>
        <Link href="/settings/personal-information" passHref>
          <Button variant="default" className="w-full">
            Edit Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export { ProfileSection }
