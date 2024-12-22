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
} from '~/components/ui/custom-sheet'

import type { MockDataType } from '~/types/mockdata'
import { useState } from 'react'
import { SheetDescription } from '../ui/sheet'

const mockData: MockDataType[] = [
  {
    id: 1,
    userId: 'wontory',
    action: '님이 게시글에 좋아요를 눌렀습니다.',
    createdAt: '2024.12.20',
    isRead: false,
  },
  {
    id: 2,
    userId: 'jyooni99',
    action: '님이 회원님을 팔로우하기 시작했습니다.',
    createdAt: '2024.12.20',
    isRead: false,
  },
  {
    id: 3,
    userId: 'E0min',
    action: '님이 회원님의 게시글에 댓글을 남겼습니다.',
    createdAt: '2024.12.19',
    isRead: false,
  },
  {
    id: 4,
    userId: 'yujsoo',
    action: '님이 회원님의 게시글에 좋아요를 눌렀습니다.',
    createdAt: '2024.12.19',
    isRead: false,
  },
]

function NotificationButton() {
  const [data, setData] = useState(mockData)

  const updateIsRead = (id: number) => {
    const newData = data.map((item) =>
      item.id === id ? { ...item, isRead: true } : item,
    )
    setData(newData)
  }

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
        <div>
          {data.map((item) => (
            <NotifyItem key={item.id} data={item} updateIsRead={updateIsRead} />
          ))}
        </div>
        <SheetClose asChild>
          <Button className="h-12 w-full py-3 text-center" asChild>
            <Link href="/notify">View All</Link>
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}

export { NotificationButton }
