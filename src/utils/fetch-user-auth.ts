import { createClient } from '~/utils/supabase/server'

const fetchUserAuth = async () => {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('사용자 정보를 가져오는 데 실패했습니다:', error.message)
    return
  }
  return { user }
}

export { fetchUserAuth }
