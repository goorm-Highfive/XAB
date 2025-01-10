import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

type PasswordChangeRequest = {
  newPassword: string
}

type JsonResponse = {
  success?: boolean
  message?: string
  error?: string
}

export async function POST(req: Request): Promise<NextResponse<JsonResponse>> {
  const supabase = await createClient()

  try {
    const { newPassword }: PasswordChangeRequest = await req.json()

    // 현재 사용자 확인
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('사용자 인증에 실패 에러:', userError.message)
      return NextResponse.json(
        { error: '사용자 인증에 실패했습니다. 다시 로그인해 주세요.' },
        { status: 401 },
      )
    }
    if (!user) {
      console.error('사용자를 찾을 수 없습니다.')
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 },
      )
    }

    // 비밀번호 업데이트
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (updateError) {
      console.error('비밀번호 업데이트 오류:', updateError.message)
      return NextResponse.json(
        {
          error:
            '비밀번호 변경 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        },
        { status: 500 },
      )
    }

    // 성공 응답
    return NextResponse.json(
      { success: true, message: '비밀번호가 성공적으로 변경되었습니다!' },
      { status: 200 },
    )
  } catch (error: unknown) {
    // 오류 타입 지정
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    console.error('예상치 못한 오류 발생:', errorMessage)
    return NextResponse.json(
      { error: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 },
    )
  }
}
