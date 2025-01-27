import { Skeleton } from '~/components/ui/skeleton'

export function SurveyCardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
          {/* 프로필 섹션 */}
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" /> {/* 아바타 */}
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-4 w-24" /> {/* 이름 */}
              <Skeleton className="h-3 w-16" /> {/* 날짜 */}
            </div>
          </div>

          {/* 질문 제목 */}
          <Skeleton className="mb-4 h-6 w-2/3" />

          {/* A와 B 옵션 */}
          <div className="flex justify-between gap-5">
            <Skeleton className="mb-2 h-64 w-full rounded-md" />{' '}
            <Skeleton className="mb-2 h-64 w-full rounded-md" />{' '}
          </div>

          {/* 하단 액션 버튼 */}
          <div className="mt-4 flex justify-between">
            <div className="mt-4 flex justify-start gap-1">
              <Skeleton className="h-4 w-10" /> {/* 좋아요 */}
              <Skeleton className="h-4 w-10" /> {/* 댓글 */}
              <Skeleton className="h-4 w-10" /> {/* 공유 */}
            </div>
            <div>
              <Skeleton className="h-4 w-10" /> {/* 투표 */}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
