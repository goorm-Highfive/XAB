import { redirect } from 'next/navigation'
import { createClient } from '~/utils/supabase/client'

const logout = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(`로그아웃 실패`, error.message)
    return { success: false }
  }

  alert('로그아웃이 완료되었습니다!')
  redirect('/login')
}

export { logout }
