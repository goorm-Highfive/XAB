import React from 'react'
import { Skeleton } from '~/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-full" />
    </div>
  )
}
