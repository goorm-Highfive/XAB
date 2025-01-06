// app/api/posts/feed/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '~/utils/supabase'

export async function GET() {
  try {
    // 1) 인증 정보 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 2) 현재 사용자가 팔로우하는 사용자 목록(following_id) 가져오기
    const { data: followData, error: followError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id)

    if (followError) {
      throw new Error(followError.message)
    }
    const followingIds = followData.map((f) => f.following_id)

    // 3) 팔로잉하는 사용자들의 게시물 가져오기
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .in('user_id', followingIds)
      .order('created_at', { ascending: false })

    if (postsError) {
      throw new Error(postsError.message)
    }

    return NextResponse.json(postsData, { status: 200 })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    // 혹은 unknown 타입에 대한 별도 처리
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
