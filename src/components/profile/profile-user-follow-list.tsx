'use client'

import React from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/utils/cn'

interface User {
  id: string
  name: string
  username: string
  isFollowing: boolean
  image?: string
}

function UserFollowList({ users }: { users: User[] }) {
  const toggleFollow = async (id: string, isFollowing: boolean) => {
    try {
      const endpoint = `/api/follow/${id}`
      const method = isFollowing ? 'DELETE' : 'POST'

      const response = await fetch(endpoint, { method })
      if (!response.ok) {
        throw new Error('Failed to update follow status')
      }

      console.log(
        `Successfully ${isFollowing ? 'unfollowed' : 'followed'} user ${id}`,
      )
      window.location.reload() // 새로고침하여 상태 반영
    } catch (error) {
      console.error('Follow/Unfollow error:', error)
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
              variant={user.isFollowing ? 'outline' : 'default'}
              className={cn(
                'w-24',
                user.isFollowing
                  ? 'border-gray-300 text-black hover:text-gray-700'
                  : 'bg-black text-white',
              )}
              onClick={() => toggleFollow(user.id, user.isFollowing)}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        ))
      ) : (
        <p className="p-4 text-center text-gray-500">No users found</p>
      )}
    </div>
  )
}

export { UserFollowList }
