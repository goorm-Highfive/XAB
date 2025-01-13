//app/api/follow/[id]/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'
import type { NextRequest } from 'next/server'

// POST 요청: 팔로우 추가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const { id } = await params

  try {
    // 인증된 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않았습니다.' },
        { status: 401 },
      )
    }

    const followerId = user.id

    // 자신을 팔로우하려는 경우 방지
    if (followerId === id) {
      return NextResponse.json(
        { error: '자신을 팔로우할 수 없습니다.' },
        { status: 400 },
      )
    }

    // 대상 사용자가 존재하는지 확인
    const { data: targetUser, error: targetUserError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single()

    if (targetUserError || !targetUser) {
      return NextResponse.json(
        { error: '대상 사용자를 찾을 수 없습니다.' },
        { status: 404 },
      )
    }

    // 이미 팔로우 중인지 확인
    const { data: existingFollow, error: existingFollowError } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', id)
      .single()

    if (existingFollowError && existingFollowError.code !== 'PGRST116') {
      throw new Error(existingFollowError.message)
    }

    if (existingFollow) {
      return NextResponse.json(
        { message: '이미 팔로우 중입니다.' },
        { status: 200 },
      )
    }

    // 팔로우 관계 생성
    const { data: newFollow, error: followError } = await supabase
      .from('follows')
      .insert([{ follower_id: followerId, following_id: id }])
      .select()

    if (followError) {
      throw new Error(followError.message)
    }

    return NextResponse.json(
      { message: '팔로우에 성공했습니다.', data: newFollow },
      { status: 201 },
    )
  } catch (err) {
    console.error('팔로우 오류:', err)
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

// DELETE 요청: 팔로우 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const { id } = await params

  try {
    // 인증된 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않았습니다.' },
        { status: 401 },
      )
    }

    const followerId = user.id

    // 자신을 언팔로우하려는 경우 방지
    if (followerId === id) {
      return NextResponse.json(
        { error: '자신을 언팔로우할 수 없습니다.' },
        { status: 400 },
      )
    }

    // 대상 사용자가 존재하는지 확인
    const { data: targetUser, error: targetUserError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single()

    if (targetUserError || !targetUser) {
      return NextResponse.json(
        { error: '대상 사용자를 찾을 수 없습니다.' },
        { status: 404 },
      )
    }

    // 팔로우 관계 삭제
    const { data: deletedFollow, error: deleteError } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', id)
      .select()

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    if (deletedFollow.length === 0) {
      return NextResponse.json(
        { message: '팔로우 관계가 존재하지 않습니다.' },
        { status: 200 },
      )
    }

    return NextResponse.json(
      { message: '언팔로우에 성공했습니다.', data: deletedFollow },
      { status: 200 },
    )
  } catch (err) {
    console.error('언팔로우 오류:', err)
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
