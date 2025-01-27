import { Skeleton } from '../ui/skeleton'

function ProfileHeaderSkeleton() {
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

export { ProfileHeaderSkeleton }
