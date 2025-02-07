// useRealtimeComments.ts
import { useEffect } from 'react'
import { createClient } from '~/utils/supabase/client'
import { Tables } from '~/types/supabase'
import { useCommentsStore } from '~/stores/use-comment-store'

/**
 * useRealtimeComments
 * @param postId - 해당 포스트의 id
 * @param currentUserName - 현재 로그인한 사용자의 이름 (INSERT 이벤트 처리 시 사용)
 */
export const useRealtimeComments = (
  postId: number,
  currentUserName: string,
) => {
  const { addComment, deleteComment, updateComment } = useCommentsStore()

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`comments_${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          const { eventType } = payload
          const newComment = payload.new as Tables<'comments'>
          const oldComment = payload.old as Tables<'comments'>

          switch (eventType) {
            case 'INSERT':
              // INSERT 이벤트 시, 현재 사용자의 이름을 함께 전달
              addComment(newComment, currentUserName)
              break
            case 'UPDATE':
              updateComment(newComment)
              break
            case 'DELETE':
              deleteComment(oldComment.id)
              break
            default:
              break
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId, addComment, deleteComment, updateComment, currentUserName])
}
