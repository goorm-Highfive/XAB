import React from 'react'
import { CommonSkeletonLayout } from '~/components/common/common-skeleton'

export default async function ExamplePage() {
  const fetchData = new Promise<string>((resolve) =>
    setTimeout(() => resolve('Hello, Skeleton!'), 2000),
  )

  const data = await fetchData

  return (
    <CommonSkeletonLayout>
      <div className="p-4">
        <div>{data}</div>
      </div>
    </CommonSkeletonLayout>
  )
}
