'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'

import { NotifyItem } from '~/components/notify/notify-item'
import { Button } from '~/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '~/components/ui/custom-sheet'
import { useNotify } from '~/hooks/useNotify'

function NotificationButton() {
  const { notify, loading } = useNotify()
  const previewNotify = notify.slice(0, 10)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="flex items-center gap-2">
          <Bell />
          Notifications
        </SheetTitle>
        <SheetDescription className="opacity-0">
          View Notifications
        </SheetDescription>
        {loading ? (
          <div>로딩중</div>
        ) : (
          <div className="h-5/6 overflow-y-scroll">
            {previewNotify.map((item) => (
              <NotifyItem
                key={item.id}
                item={item}
                createdAt={item.created_at?.split('T')[0] || 'Unknown'}
              />
            ))}
          </div>
        )}
        <div className="pt-6">
          <SheetClose asChild>
            <Button className="h-12 w-full py-3 text-center" asChild>
              <Link href="/notify">View All</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { NotificationButton }
