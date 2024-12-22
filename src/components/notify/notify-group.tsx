import { NotifyItem } from '~/components/notify/notify-item'
import type { MockDataType } from '~/types/mockdata'

type NotifyGroupProps = {
  date: string
  items: MockDataType[]
  updateIsRead: (id: number) => void
}

function NotifyGroup({ date, items, updateIsRead }: NotifyGroupProps) {
  // 알림 발생 날짜에 맞게 묶어서 출력하기 위한 컴포넌트
  return (
    <div className="mx-auto max-w-xl px-4 pt-5">
      <p className="font-bold text-muted-foreground">{date}</p>
      <div>
        {items.map((item) => (
          <NotifyItem key={item.id} data={item} updateIsRead={updateIsRead} />
        ))}
      </div>
    </div>
  )
}

export { NotifyGroup }
