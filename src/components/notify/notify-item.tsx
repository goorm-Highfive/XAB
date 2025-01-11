'use client'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import type { Tables } from '~/types/supabase'

type NotifyItemProps = {
  item: Tables<'notifications'>
  createdAt: string
}

function NotifyItem({ item, createdAt }: NotifyItemProps) {
  const { is_read, action } = item

  return (
    <Alert
      className={`relative my-4 flex cursor-pointer justify-between p-4 pr-10 ${is_read ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="items-top flex">
        <div className="mr-4">
          <div className="h-12 w-12 rounded-full bg-gray-300" />
        </div>
        <div>
          <AlertTitle className="text-base font-semibold">
            <span className="font-normal"> {action || 'undefined'}</span>
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {createdAt}
          </AlertDescription>
        </div>
      </div>
      {is_read ? null : (
        <div className="absolute right-4 h-3 w-3 rounded-full bg-chart-1" />
      )}
    </Alert>
  )
}

export { NotifyItem }
