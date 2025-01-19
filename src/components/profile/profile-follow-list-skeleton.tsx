import React from 'react'

function UserFollowListSkeleton() {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b p-4 last:border-b-0"
        >
          <div className="flex items-center gap-4">
            {/* 프로필 이미지 스켈레톤 */}
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
            <div>
              {/* 이름과 유저네임 스켈레톤 */}
              <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200"></div>
              <div className="mt-2 h-3 w-16 animate-pulse rounded-md bg-gray-200"></div>
            </div>
          </div>
          {/* 버튼 스켈레톤 */}
          <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200"></div>
        </div>
      ))}
    </div>
  )
}

export { UserFollowListSkeleton }
