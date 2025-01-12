import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function GET(
  request: Request,
  context: { params: { id: string } }, // `params`가 프로미스인 경우 타입 수정 필요
) {
  const supabase = await createClient()
  try {
    // 1) 현재 인증 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // `params.id` 안전하게 사용
    const params = await context.params // `params`가 프로미스인 경우
    const userId = params.id

    // 2) DB에서 해당 사용자의 프로필 정보 조회
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, username, email, profile_image, bio, created_at')
      .eq('id', userId)
      .single()

    if (profileError) {
      throw new Error(profileError.message)
    }

    // 3) 해당 사용자의 게시글 수 조회
    const { count: postCount, error: postCountError } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (postCountError) {
      throw new Error(postCountError.message)
    }

    // 4) 팔로워 수 조회
    const { count: followerCount, error: followerCountError } = await supabase
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_id', userId)

    if (followerCountError) {
      throw new Error(followerCountError.message)
    }

    // 5) 팔로잉 수 조회
    const { count: followingCount, error: followingCountError } = await supabase
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('follower_id', userId)

    if (followingCountError) {
      throw new Error(followingCountError.message)
    }

    // 6) 성공 응답
    return NextResponse.json(
      {
        ...userProfile,
        postCount: postCount || 0,
        followerCount: followerCount || 0,
        followingCount: followingCount || 0,
      },
      { status: 200 },
    )
  } catch (err: unknown) {
    console.error('Error fetching user profile:', err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
