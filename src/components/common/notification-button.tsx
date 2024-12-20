'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'

import { NotifyItem } from '~/components/notify/notify-item'
import { Button } from '~/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/custom-sheet'

function NotificationButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell />
            Notifications
          </SheetTitle>
        </SheetHeader>
        <div className="my-6">
          <NotifyItem />
          <NotifyItem />
          <NotifyItem />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="h-12 w-full py-3 text-center" asChild>
              <Link href="/notify">View All</Link>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export { NotificationButton }
