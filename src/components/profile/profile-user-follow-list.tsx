'use client'
import React from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/utils/cn'
import type { User } from '~/types/user'

function UserFollowList({ users }: { users: User[] }) {
  const toggleFollow = (id: number) => {
    console.log(`Toggling follow state for user ${id}`)
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
              onClick={() => toggleFollow(user.id)}
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
