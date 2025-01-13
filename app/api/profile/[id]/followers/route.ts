import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { error: '유효하지 않은 사용자 ID' },
      { status: 400 },
    )
  }

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자' },
        { status: 401 },
      )
    }

    const { data: followers, error } = await supabase
      .from('follows')
      .select(
        `
        follower_id,
        users!follows_follower_id_fkey (
          username,
          profile_image
        )
      `,
      )
      .eq('following_id', id)

    if (error) {
      throw new Error(error.message)
    }

    const response = followers.map((follow) => ({
      id: follow.follower_id,
      username: follow.users.username,
      profile_image: follow.users.profile_image || undefined,
      isFollowing: id === follow.follower_id, // 현재 사용자와 팔로워 ID 비교
    }))

    return NextResponse.json(response, { status: 200 })
  } catch (err) {
    console.error('팔로워 목록 조회 오류:', err)
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 },
    )
  }
}
