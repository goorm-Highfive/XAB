import { create } from 'zustand'
import { createClient } from '~/utils/supabase/client'
import { Tables } from '~/types/supabase'

type NotifyStore = {
  notify: Tables<'notifications'>[]
  unsubscribe: (() => void) | null // 구독 해제 -> 새로고침 시 구독 중복 -> 이를 방지
  fetchNotify: (user_id: string) => Promise<void>
  clearNotify: () => void // 상태 초기화
}

const useNotifyStore = create<NotifyStore>((set, get) => ({
  notify: [],
  unsubscribe: null,

  fetchNotify: async (userId: string) => {
    const supabase = createClient()

    const currentUnsubscribe = get().unsubscribe
    if (currentUnsubscribe) {
      currentUnsubscribe()
    }

    // 데이터 가져오기
    const { data, error } = await supabase
      .from('notifications')
      .select('id, user_id, action, created_at, is_read')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notifications: ', error.message)
      throw new Error(error.message)
    }

    set({ notify: data || [] })

    // 실시간 구독
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotify = payload.new as Tables<'notifications'>

          set((state) => {
            // 새로운 알림 울릴 떄
            if (payload.eventType === 'INSERT') {
              return {
                notify: [newNotify, ...state.notify],
              }

              // 알림 데이터가 바뀌었을 때
            } else if (payload.eventType === 'UPDATE') {
              return {
                notify: state.notify.map((notify) =>
                  notify.id === newNotify.id
                    ? { ...notify, ...newNotify }
                    : notify,
                ),
              }
            }
            return state
          })
        },
      )
      .subscribe()

    // 구독 해제
    set({
      unsubscribe: () => {
        supabase.removeChannel(channel)
      },
    })
  },

  // 상태 초기화
  clearNotify: () => set({ notify: [], unsubscribe: null }),
}))

export { useNotifyStore }
