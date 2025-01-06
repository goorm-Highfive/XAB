// app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '~/utils/supabase'

export async function GET() {
  try {
    // 1) 현재 인증 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 2) DB에서 해당 사용자의 프로필 정보 조회
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, profile_image, bio, created_at')
      .eq('id', user.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // 3) 성공 응답
    return NextResponse.json(data, { status: 200 })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    // 혹은 unknown 타입에 대한 별도 처리
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
