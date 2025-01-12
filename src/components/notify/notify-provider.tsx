'use client'

import { useEffect } from 'react'
import { useNotifyStore } from '~/stores/notify-store'
import { createClient } from '~/utils/supabase/client'

const NotificationProvider = () => {
  const fetchNotify = useNotifyStore((state) => state.fetchNotify)
  const clearNotify = useNotifyStore((state) => state.clearNotify)

  useEffect(() => {
    const supabase = createClient()

    const getUserId = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user?.id) {
          fetchNotify(user.id)
        } else {
          console.error('사용자 ID를 가져올 수 없습니다.')
        }
      } catch (err) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', err)
      }
    }
    getUserId()

    return () => {
      if (window.location.pathname.startsWith('/account')) {
        clearNotify()
      }
    }
  }, [fetchNotify, clearNotify])

  return null
}

export { NotificationProvider }
