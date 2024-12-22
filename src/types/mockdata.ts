export type MockDataType = {
  id: number
  userId: string
  action: string
  createdAt: string
  isRead: boolean
}

export type GroupedMockData = {
  [key: string]: MockDataType[] // 날짜별로 데이터를 그룹화한 객체
}

export type NotifyGroupProps = {
  date: string
  items: MockDataType[]
  updateIsRead: (id: number) => void
}

export type NotifyItemProp = {
  data: MockDataType
  updateIsRead: (id: number) => void
}
