import { createClient } from '~/utils/supabase/server'

interface UserData {
  username: string
  bio: string
}

export async function fetchUserProfile(
  fields: string[],
): Promise<Partial<UserData> | null> {
  const supabase = await createClient()

  // 인증 정보 가져오기
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) {
    console.error('인증 실패:', authError?.message)
    return null
  }

  // 필드를 쉼표로 연결
  const fieldsString = fields.join(',')

  const { data, error } = await supabase
    .from('users')
    .select(fieldsString) // 필드 문자열로 전달
    .eq('id', authData.user.id)
    .single()

  if (error) {
    console.error('사용자 데이터를 가져오는 데 실패했습니다:', error.message)
    return null
  }

  if (!data || typeof data !== 'object') {
    console.error('잘못된 데이터 형식:', data)
    return null
  }

  // 필요한 필드만 반환
  const result: Partial<UserData> = {}
  for (const field of fields) {
    if (field in data) {
      result[field as keyof UserData] = data[field]
    } else {
      console.warn(`필드 "${field}"가 데이터에 존재하지 않습니다.`)
    }
  }

  return result
}
