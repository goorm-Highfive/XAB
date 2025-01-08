'use client'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import type { NotifyItemProp } from '~/types/mockdata'

function NotifyItem({ data, updateIsRead }: NotifyItemProp) {
  const { id, isRead, userId, action, createdAt } = data

  return (
    <Alert
      onClick={() => updateIsRead(id)}
      className={`relative my-4 flex cursor-pointer justify-between p-4 pr-10 ${isRead ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="items-top flex">
        <div className="mr-4">
          <div className="h-12 w-12 rounded-full bg-gray-300" />
        </div>
        <div>
          <AlertTitle className="text-base font-semibold">
            {userId}
            <span className="font-normal"> {action}</span>
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {createdAt}
          </AlertDescription>
        </div>
      </div>
      {isRead ? null : (
        <div className="absolute right-4 h-3 w-3 rounded-full bg-chart-1" />
      )}
    </Alert>
  )
}

export { NotifyItem }
