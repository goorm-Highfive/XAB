'use client'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import type { MockDataType } from '~/types/mockdata'

type NotifyItemsProp = {
  data: MockDataType
}

function NotifyItem({ data }: NotifyItemsProp) {
  return (
    <Alert className="relative my-4 flex cursor-pointer justify-between p-4">
      <div className="items-top flex gap-3">
        <div>
          <div className="h-12 w-12 rounded-full bg-gray-300" />
        </div>
        <div className="px-4">
          <AlertTitle className="text-base font-semibold">
            {data.userId}
            <span className="font-normal"> {data.action}</span>
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {data.createdAt}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}

export { NotifyItem }
