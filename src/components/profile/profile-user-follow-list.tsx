'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/utils/cn'
import defaultProfile from '~/assets/svgs/default-profile.svg'

interface UserListResponseItem {
  id: string
  name: string
  username: string
  isFollowing: boolean
  profile_image?: string
}

function UserFollowList({ users }: { users: UserListResponseItem[] }) {
  const [followStates, setFollowStates] = useState<Record<string, boolean>>(
    Object.fromEntries(users.map((user) => [user.id, user.isFollowing])),
  )

  const toggleFollow = async (id: string) => {
    const isFollowing = followStates[id]

    try {
      const endpoint = `/api/follow/${id}`
      const method = isFollowing ? 'DELETE' : 'POST'

      const response = await fetch(endpoint, { method })
      if (!response.ok) {
        throw new Error(
          `Follow 상태 업데이트 실패 (Endpoint: ${endpoint}, Status: ${response.status})`,
        )
      }

      setFollowStates((prev) => ({
        ...prev,
        [id]: !isFollowing,
      }))
    } catch (error) {
      console.error('Follow/Unfollow 에러:', error)
    }
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {users.length > 0 ? (
        users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border-b p-4 last:border-b-0"
          >
            <Link
              href={`/profile/${user.id}`}
              aria-label={`${user.name}의 프로필로 이동`}
            >
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src={user.profile_image || defaultProfile.src}
                    alt={`${user.name}'s profile`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.username}</p>
                </div>
              </div>
            </Link>

            <Button
              variant={followStates[user.id] ? 'outline' : 'default'}
              className={cn('w-24', {
                'border-gray-300 text-black hover:text-gray-700':
                  followStates[user.id],
                'bg-black text-white': !followStates[user.id],
              })}
              onClick={() => toggleFollow(user.id)}
            >
              {followStates[user.id] ? 'Following' : 'Follow'}
            </Button>
          </div>
        ))
      ) : (
        <p className="p-4 text-center text-gray-500">
          사용자를 찾을 수 없습니다
        </p>
      )}
    </div>
  )
}

export { UserFollowList }
