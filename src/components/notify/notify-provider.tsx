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
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user?.id) {
          fetchNotify(session.user.id)
        } else {
          console.log('사용자가 로그인 상태가 아닙니다.')
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
