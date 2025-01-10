import { createClient } from '~/utils/supabase/server'

interface UserData {
  id?: string
  username: string
  bio: string
  profileImage?: string
}

export async function fetchUserProfile(): Promise<UserData> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) {
    throw new Error('사용자 인증 실패')
  }

  const { data, error } = await supabase
    .from('users')
    .select('*') // 모든 필드 가져오기
    .eq('id', authData.user.id)
    .single()

  console.log(data)

  if (error || !data) {
    throw new Error('사용자 데이터를 불러오는 데 실패했습니다.')
  }

  return data as UserData
}
