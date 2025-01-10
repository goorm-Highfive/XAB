'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { createClient } from '~/utils/supabase/client'

function ClientSessionManager() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        console.log('사용자가 로그아웃 되었습니다.')
        router.push('/login')
      }
    })

    return () => {
      data.subscription?.unsubscribe()
    }
  }, [router, supabase.auth])

  return null
}

export { ClientSessionManager }
