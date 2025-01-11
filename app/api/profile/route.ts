import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function GET() {
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

    const userId = user.id

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
    const { data: postCountData, error: postCountError } = await supabase
      .from('posts')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)

    if (postCountError) {
      throw new Error(postCountError.message)
    }

    const postCount = postCountData?.length || 0

    // 4) 팔로워 수 조회
    const { data: followerCountData, error: followerCountError } =
      await supabase
        .from('follows')
        .select('id', { count: 'exact' })
        .eq('following_id', userId)

    if (followerCountError) {
      throw new Error(followerCountError.message)
    }

    const followerCount = followerCountData?.length || 0

    // 5) 팔로잉 수 조회
    const { data: followingCountData, error: followingCountError } =
      await supabase
        .from('follows')
        .select('id', { count: 'exact' })
        .eq('follower_id', userId)

    if (followingCountError) {
      throw new Error(followingCountError.message)
    }

    const followingCount = followingCountData?.length || 0

    // 6) 성공 응답
    return NextResponse.json(
      {
        ...userProfile,
        postCount,
        followerCount,
        followingCount,
      },
      { status: 200 },
    )
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
