// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '~/utils/supabase'

// 예: POST /api/comments -> { post_id, content }
export async function POST(request: NextRequest) {
  try {
    // 1) 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 2) body 파싱
    const { post_id, content } = await request.json()
    if (!post_id || !content) {
      return NextResponse.json(
        { error: 'Missing post_id or content' },
        { status: 400 },
      )
    }

    // 3) 댓글 삽입
    const { data, error } = await supabase.from('comments').insert([
      {
        post_id,
        user_id: user.id,
        content,
      },
    ])

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    // 혹은 unknown 타입에 대한 별도 처리
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
