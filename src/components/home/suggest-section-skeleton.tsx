import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

const SuggestSkeleton = () => {
  return (
    <div className="sticky top-[92px] hidden w-72 flex-col gap-4 xl:flex">
      <Card>
        <CardHeader>
          <CardTitle>추천 사용자</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <li key={idx} className="flex items-center gap-3">
                {/* Avatar Skeleton */}
                <Skeleton className="h-10 w-10 rounded-full" />
                {/* User Info Skeleton */}
                <div className="flex flex-1 flex-col space-y-1">
                  <Skeleton className="h-5 w-24" /> {/* Username */}
                  <Skeleton className="h-4 w-40" /> {/* Bio */}
                </div>
                {/* Button Skeleton */}
                <Skeleton className="h-8 w-16 rounded" />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export { SuggestSkeleton }
