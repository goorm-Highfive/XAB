export type ReplyData = {
  id: string
  writer: string
  content: string
  likeCount: number
  date: string
  userLiked: boolean
}

export type CommentData = ReplyData & {
  replies?: ReplyData[]
}
