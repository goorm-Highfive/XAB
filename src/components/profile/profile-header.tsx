'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { SettingButton } from '~/components/profile/profile-setting-button'
import { Button } from '~/components/ui/button'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { Skeleton } from '~/components/ui/skeleton'

function ProfileHeader({ currentUserId }: { currentUserId: string | null }) {
  const [isFollowing, setIsFollowing] = useState(true)
  const [userData, setUserData] = useState<{
    username: string
    bio: string
    profile_image: string | null
    followerCount: number
    followingCount: number
    postCount: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams() // URL에서 userId 추출

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/profile/${id}/user-profile`)
        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }
        const data = await response.json()
        setUserData(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev)
  }

  if (isLoading || !userData) {
    return (
      <div className="flex flex-col rounded-lg bg-white p-6 shadow">
        {/* Avatar Skeleton */}
        <div className="mb-4">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>

        {/* Header 상단 Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-40" /> {/* 이름 */}
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded" /> {/* 버튼 1 */}
            <Skeleton className="h-8 w-8 rounded-full" /> {/* 설정 버튼 */}
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mt-4">
          <Skeleton className="mb-2 h-5 w-full" /> {/* 줄 1 */}
          <Skeleton className="h-5 w-3/4" /> {/* 줄 2 */}
        </div>

        {/* Stats Skeleton */}
        <div className="mt-4 flex gap-6">
          <Skeleton className="h-5 w-16" /> {/* Following */}
          <Skeleton className="h-5 w-16" /> {/* Followers */}
          <Skeleton className="h-5 w-16" /> {/* Posts */}
        </div>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

  return (
    <div className="flex flex-col rounded-lg bg-white p-6 shadow">
      {/* Avatar */}
      <div className="relative mb-4 h-[70px] w-[70px] overflow-hidden rounded-full">
        {userData?.profile_image ? (
          <Image
            fill
            className="object-cover"
            src={userData?.profile_image}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            alt=""
          />
        ) : (
          <Image
            fill
            className="object-cover"
            src={defaultProfile}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            alt=""
          />
        )}
      </div>
      {/* Header 상단 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {userData?.username || 'Guest'}
          </h2>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-2">
          {currentUserId === id ? (
            <>
              <Link href="/settings/personal-information" passHref>
                <Button variant="default">Edit Profile</Button>
              </Link>
              <SettingButton />
            </>
          ) : (
            <Button
              onClick={toggleFollow}
              variant={isFollowing ? 'default' : 'outline'}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-600">
        {userData?.bio || 'User bio not available'}
      </p>

      {/* Stats */}
      <div className="mt-4 flex gap-6 text-sm text-gray-700">
        <Link href={`/profile/${id}/followings`} className="hover:underline">
          <strong>{userData?.followingCount || 0}</strong> Following
        </Link>
        <Link href={`/profile/${id}/followers`} className="hover:underline">
          <strong>{userData?.followerCount || 0}</strong> Followers
        </Link>
        <span>
          <strong>{userData?.postCount || 0}</strong> Posts
        </span>
      </div>
    </div>
  )
}

export { ProfileHeader }
