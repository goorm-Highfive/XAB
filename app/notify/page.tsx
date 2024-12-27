'use client'

import { useState } from 'react'

import { SiteHeader } from '~/components/common/site-header'
import { NotifyGroup } from '~/components/notify/notify-group'

import type { MockDataType, GroupedMockData } from '~/types/mockdata'

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

function NotifyPage() {
  const [data, setData] = useState(mockData)

  const updateIsRead = (id: number) => {
    const newData = data.map((item) =>
      item.id === id ? { ...item, isRead: true } : item,
    )
    setData(newData)
  }

  // 날짜별로 그룹화한 데이터
  const groupedData = data.reduce<GroupedMockData>((acc, curr) => {
    const { createdAt } = curr

    if (!acc[createdAt]) {
      acc[createdAt] = []
    }
    acc[createdAt].push(curr)
    return acc
  }, {} as GroupedMockData)

  return (
    <div className="h-screen bg-gray-100">
      <SiteHeader />
      <div className="mb-28 mt-4">
        {Object.entries(groupedData).map(([createdAt, items]) => (
          <NotifyGroup
            key={createdAt}
            date={createdAt}
            items={items}
            updateIsRead={updateIsRead}
          />
        ))}
      </div>
    </div>
  )
}

export default NotifyPage
