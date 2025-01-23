import { Skeleton } from '~/components/ui/skeleton'

const SkeletonLoading = () => {
  return (
    <div className="relative w-full max-w-lg">
      {/* 검색 결과 리스트의 Skeleton */}
      <div className="absolute z-10 mt-2 w-full">
        <div className="rounded bg-white p-4 shadow">
          <ul>
            {/* 3개의 스켈레톤 리스트 항목 */}
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex items-center gap-4 p-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-32 rounded" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export { SkeletonLoading }
