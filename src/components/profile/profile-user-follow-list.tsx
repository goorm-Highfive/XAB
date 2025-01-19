'use client'

import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/utils/cn'

interface UserListResponseItem {
  id: string
  name: string
  username: string
  isFollowing: boolean
  image?: string
}

function UserFollowList({ users }: { users: UserListResponseItem[] }) {
  // 사용자별 follow 상태를 관리하는 상태
  const [followStates, setFollowStates] = useState<Record<string, boolean>>(
    users.reduce((acc, user) => ({ ...acc, [user.id]: user.isFollowing }), {}),
  )

  // follow/unfollow 처리 함수
  const toggleFollow = async (id: string) => {
    const isFollowing = followStates[id]

    try {
      const endpoint = `/api/follow/${id}`
      const method = isFollowing ? 'DELETE' : 'POST'

      const response = await fetch(endpoint, { method })
      if (!response.ok) {
        throw new Error('Follow 상태 업데이트 실패')
      }

      // 상태 업데이트
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
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-200" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>
            <Button
              variant={followStates[user.id] ? 'outline' : 'default'}
              className={cn(
                'w-24',
                followStates[user.id]
                  ? 'border-gray-300 text-black hover:text-gray-700'
                  : 'bg-black text-white',
              )}
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
