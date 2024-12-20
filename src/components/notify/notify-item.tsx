'use client'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import type { MockDataType } from '~/types/mockdata'

type NotifyItemsProp = {
  data: MockDataType
  updateIsRead: (id: number) => void
}

function NotifyItem({ data, updateIsRead }: NotifyItemsProp) {
  return (
    <Alert
      onClick={() => updateIsRead(data.id)}
      className={`relative my-4 flex cursor-pointer justify-between p-4 ${data.isRead ? 'opacity-50' : 'opacity-100'}`}
    >
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
      {data.isRead ? null : <div className="h-3 w-3 rounded-full bg-chart-1" />}
    </Alert>
  )
}

export { NotifyItem }
