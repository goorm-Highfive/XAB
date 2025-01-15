import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  console.log('좋아요 API 호출 시작')

  // 사용자 인증 확인
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Unauthorized access:', userError?.message)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.user.id
  console.log(`User ID: ${userId}`)

  const { commentId } = await req.json()
  console.log(`Comment ID: ${commentId}`)

  // 좋아요 상태 확인
  const { data: existingLike, error: likeError } = await supabase
    .from('comment_likes')
    .select('*')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single()

  if (likeError && likeError.code !== 'PGRST116') {
    console.error('Error fetching like status:', likeError.message)
    return NextResponse.json({ error: likeError.message }, { status: 500 })
  }

  if (existingLike) {
    // 이미 좋아요한 경우, 좋아요 취소
    const { error: deleteError } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting like:', deleteError.message)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    console.log('좋아요 취소 성공')
    return NextResponse.json({ liked: false })
  }

  // 좋아요 추가
  const { error: insertError } = await supabase
    .from('comment_likes')
    .insert([{ comment_id: commentId, user_id: userId }])

  if (insertError) {
    console.error('Error inserting like:', insertError.message)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  console.log('좋아요 추가 성공')
  return NextResponse.json({ liked: true })
}
