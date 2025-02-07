import { NextResponse } from 'next/server'
import { adminAuthClient } from '~/utils/supabase/admin'
import { createClient } from '~/utils/supabase/server'

export async function DELETE() {
  try {
    const supabase = await createClient()

    // 현재 로그인한 사용자 가져오기
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: No user found' },
        { status: 401 },
      )
    }

    // Supabase 관리자 권한으로 사용자 삭제
    const { error: deleteError } = await adminAuthClient.deleteUser(user.id)

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete account: ${deleteError.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: `Unexpected error: ${err}` },
      { status: 500 },
    )
  }
}
