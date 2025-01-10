//src>utils>update-pswd.ts
import { createClient } from '~/utils/supabase/server'

export async function updatePassword({ newPassword }: { newPassword: string }) {
  const supabase = await createClient()

  // 비밀번호 업데이트
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error('비밀번호를 변경하는 중 오류가 발생했습니다.')
  }

  return true
}
