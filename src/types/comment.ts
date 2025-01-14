import { Tables } from '~/types/supabase'

export type Comment = Tables<'comments'> & {
  username: string
  likeCount: number
  userLiked: boolean
  replies: Comment[]
}
