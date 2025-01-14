'use client'

import { NotifyGroup } from '~/components/notify/notify-group'
import { Tables } from '~/types/supabase'
import { useNotify } from '~/hooks/useNotify'

type GroupedNotify = {
  [crated_at: string]: Tables<'notifications'>[]
}

function NotifyPage() {
  const { notify, loading } = useNotify()

  if (loading) {
    return <div>로딩 중...</div>
  }

  const groupedData = notify.reduce<GroupedNotify>((acc, curr) => {
    const createdAt = curr.created_at?.split('T')[0] || 'Unknown'

    if (!acc[createdAt]) {
      acc[createdAt] = []
    }
    acc[createdAt].push(curr)
    return acc
  }, {})

  return (
    <div>
      <ul>
        {notify.length > 0 ? (
          Object.entries(groupedData).map(([createdAt, items]) => (
            <NotifyGroup key={createdAt} createdAt={createdAt} items={items} />
          ))
        ) : (
          <li>알림이 없습니다.</li>
        )}
      </ul>
    </div>
  )
}

export default NotifyPage
