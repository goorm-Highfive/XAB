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
    const currentUserId = id

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

    // 응답 데이터 구조화
    const response = following.map((follow) => ({
      id: follow.following_id, // UUID 그대로 사용
      name: follow.users.username,
      username: follow.users.username,
      isFollowing: true,
      profile_image: follow.users.profile_image || undefined,
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
