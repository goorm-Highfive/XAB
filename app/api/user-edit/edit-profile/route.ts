import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { username, bio } = body

  // 필수 데이터 검증
  if (typeof username !== 'string' || username.trim() === '') {
    return NextResponse.json(
      { error: '입력값이 유효하지 않습니다. 사용자 이름은 필수입니다.' },
      { status: 400 },
    )
  }

  // 사용자 식별자를 세션에서 가져오기 (예: 현재 로그인한 사용자)
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user?.id) {
    console.error(
      '세션 오류:',
      sessionError?.message || '사용자 정보를 가져올 수 없습니다.',
    )
    return NextResponse.json(
      { error: '사용자 인증이 필요합니다.' },
      { status: 401 },
    )
  }

  const userId = session.user.id

  // 데이터베이스 업데이트
  const { error } = await supabase
    .from('users')
    .update({ username, bio })
    .eq('id', userId)

  if (error) {
    console.error('데이터베이스 업데이트 오류:', error.message)
    return NextResponse.json(
      { error: '프로필을 업데이트할 수 없습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    )
  }

  return NextResponse.json(
    { message: '변경 사항이 저장되었습니다.' },
    { status: 200 },
  )
}
