import { createClient } from '~/utils/supabase/server'

interface UserData {
  id: string
  username: string
  bio: string
  profileImage?: string
}

export async function fetchUserProfile(): Promise<UserData | null> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData?.user?.id) {
    console.error(
      '[fetchUserProfile] 사용자 인증 실패:',
      authError?.message || 'No user data',
    )
    return null
  }

  const userId = authData.user.id

  const { data, error } = await supabase
    .from('users')
    .select('profile_image, username, bio')
    .eq('id', userId)
    .single()

  if (error) {
    console.error(
      '[fetchUserProfile] 사용자 프로필 데이터 가져오기 실패:',
      error.message,
    )
    return null
  }

  return {
    id: userId,
    profileImage: data.profile_image || undefined,
    username: data.username || '',
    bio: data.bio || '',
  }
}
