'use client'

import { useEffect, useState } from 'react'
import { useNotifyStore } from '~/stores/notify-store'
import { createClient } from '~/utils/supabase/client'

const useNotify = () => {
  const { notify, fetchNotify, clearNotify } = useNotifyStore()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const getUserId = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user?.id) {
          setUserId(user.id)
        } else {
          console.error('사용자 ID를 가져올 수 없습니다.')
        }
      } catch (err) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', err)
      }
    }
    getUserId()
  }, [supabase])

  useEffect(() => {
    if (userId) {
      const loadNotifications = async () => {
        try {
          setLoading(true)
          await fetchNotify(userId)
        } catch (err) {
          console.error('알림 데이터를 가져오는 중 오류 발생:', err)
        } finally {
          setLoading(false)
        }
      }
      loadNotifications()
    }

    return () => {
      if (window.location.pathname.startsWith('/account')) {
        clearNotify()
      }
    }
  }, [userId, fetchNotify, clearNotify])

  return { notify, loading }
}

export { useNotify }
