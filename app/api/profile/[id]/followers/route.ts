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

    // 나를 팔로우하는 사용자 가져오기
    const { data: followers, error: followersError } = await supabase
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
      .eq('following_id', currentUserId)

    if (followersError) {
      throw new Error(followersError.message)
    }

    // 내가 각 팔로워를 팔로우하는지 여부 확인
    const response = await Promise.all(
      followers.map(async (follow) => {
        const { data: isFollowingData, error: isFollowingError } =
          await supabase
            .from('follows')
            .select('id') // 확인용 필드만 가져옴
            .eq('follower_id', currentUserId)
            .eq('following_id', follow.follower_id)
            .single()

        if (isFollowingError && isFollowingError.code !== 'PGRST116') {
          throw new Error(isFollowingError.message)
        }

        return {
          id: follow.follower_id,
          username: follow.users.username,
          profile_image: follow.users.profile_image || undefined,
          isFollowing: !!isFollowingData, // 데이터 존재 여부로 판단
        }
      }),
    )

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
