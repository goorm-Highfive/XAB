import { useEffect } from 'react'
import { createClient } from '~/utils/supabase/client'
import usePostStore from '~/stores/post-store'

const supabase = createClient()

const useSubscribeToPosts = () => {
  const addPost = usePostStore((state) => state.addPost)

  useEffect(() => {
    const channel = supabase
      .channel('realtime:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        async (payload) => {
          const newPostData = payload.new

          try {
            const { data: abTestData, error: abTestError } = await supabase
              .from('ab_tests')
              .select(
                `
              id,
              post_id,
              variant_a_url,
              variant_b_url,
              description_a,
              description_b,
              created_at,
              updated_at,
              ab_test_votes (
                id,
                user_id,
                preferred_variant,
                created_at
              )
            `,
              )
              .eq('post_id', newPostData.id)
              .maybeSingle()

            if (abTestError) {
              console.error('Error fetching ab_tests:', abTestError.message)
            }

            if (!abTestData) {
              console.warn(
                `No AB test data found for post_id: ${newPostData.id}`,
              )
              return
            }
          } catch (error) {
            console.error('게시글 데이터 처리 중 오류 발생:', error)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [addPost])
}

export default useSubscribeToPosts
