import { NotifyItem } from '~/components/notify/notify-item'
import type { Tables } from '~/types/supabase'

type NotifyGroupProps = {
  createdAt: string
  items: Tables<'notifications'>[]
}

function NotifyGroup({ createdAt, items }: NotifyGroupProps) {
  // 알림 발생 날짜에 맞게 묶어서 출력하기 위한 컴포넌트
  return (
    <div className="mx-auto max-w-xl pt-5">
      <p className="font-bold text-muted-foreground">{createdAt}</p>
      <div>
        {items.map((item) => (
          <NotifyItem key={item.id} createdAt={createdAt} item={item} />
        ))}
      </div>
    </div>
  )
}

export { NotifyGroup }
