import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const supabase = await createClient(request)
  const { id } = context.params

  if (!id) {
    return NextResponse.json(
      { error: '유효하지 않은 사용자 ID' },
      { status: 400 },
    )
  }

  try {
    // 인증된 사용자 정보 가져오기
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

    const currentUserId = user.id

    // 내가 팔로우하는 사람들 목록 조회
    const { data: following, error } = await supabase
      .from('follows')
      .select(
        `
        following_id,
        users!follows_following_id_fkey (
          username,
          profile_image
        )
      `,
      )
      .eq('follower_id', currentUserId)

    if (error) {
      throw new Error(error.message)
    }
    console.log(following)

    // 응답 데이터 구조화
    const response = following.map((follow) => ({
      id: follow.following_id, // UUID 그대로 사용
      name: follow.users.username,
      username: follow.users.username,
      isFollowing: true,
      image: follow.users.profile_image || undefined,
    }))

    return NextResponse.json(response, { status: 200 })
  } catch (err) {
    console.error('팔로우 목록 조회 오류:', err)
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
