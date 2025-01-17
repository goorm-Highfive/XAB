import React, { Suspense } from 'react'
import { Skeleton } from '~/components/ui/skeleton'

type CommonSkeletonLayoutProps = {
  children: React.ReactNode
}

function CommonSkeletonLayout({ children }: CommonSkeletonLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-full" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export { CommonSkeletonLayout }
