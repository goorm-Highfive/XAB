'use server'

import { createClient } from '~/utils/supabase/server'

// ✅ Supabase 클라이언트 생성 함수
async function getSupabase() {
  return await createClient()
}

export async function addComment(postId: number, content: string) {
  const supabase = await getSupabase()

  // ✅ 현재 로그인한 사용자의 ID 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser() // 현재 로그인한 유저 정보 가져오기

  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // ✅ 필수 필드 포함 (user_id 추가)
  const newComment = {
    post_id: postId,
    content,
    user_id: user.id, // 필수 user_id 추가
    created_at: new Date().toISOString(), // 생성 시간 추가
  }

  const { data, error } = await supabase
    .from('comments')
    .insert(newComment) // ✅ 배열이 아닌 단일 객체 전달
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function editComment(id: number, content: string) {
  const supabase = await getSupabase()

  const { error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteComment(id: number) {
  const supabase = await getSupabase()

  const { error } = await supabase.from('comments').delete().eq('id', id)

  if (error) throw new Error(error.message)
}
