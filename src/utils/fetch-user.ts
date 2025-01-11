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
  if (authError || !authData?.user?.id) {
    console.error('사용자 인증 실패:', authError || 'No user data')
    throw new Error('사용자 인증 실패')
  }

  //console.log('Fetched user:', authData.user); // 확인 로그

  const { data, error } = await supabase
    .from('users')
    .select('*') // 모든 필드 가져오기
    .eq('id', authData.user.id)
    .single()

  console.log(data)

  if (error || !data) {
    console.error(
      '사용자 데이터를 불러오는 데 실패했습니다:',
      error || 'No data found',
    )
    throw new Error('사용자 데이터를 불러오는 데 실패했습니다.')
  }

  console.log('User data:', data) // 확인 로그
  return data as UserData
}
