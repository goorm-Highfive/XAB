import { Skeleton } from '~/components/ui/skeleton'
import { SurveyCardSkeleton } from '~/components/common/survey-card/surveycard-skeleton'
function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="mx-auto mt-6 max-w-3xl space-y-6">
          {/* Profile Header Skeleton */}
          <div className="rounded-lg border bg-white p-6 shadow">
            <div className="mb-4 flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" /> {/* Avatar */}
              <div>
                <Skeleton className="mb-2 h-6 w-32" /> {/* Username */}
                <Skeleton className="h-4 w-24" /> {/* Bio */}
              </div>
            </div>
            <div className="flex gap-6">
              <Skeleton className="h-6 w-16" /> {/* Following */}
              <Skeleton className="h-6 w-16" /> {/* Followers */}
              <Skeleton className="h-6 w-16" /> {/* Posts */}
            </div>
          </div>

          {/* Survey Cards Skeleton */}
          {Array.from({ length: 3 }).map((_, idx) => (
            <SurveyCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}

export { ProfilePageSkeleton }
