// app/api/posts/route.ts
// 포스팅할 때 사용하는 api
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '~/utils/supabase'

export async function POST(request: NextRequest) {
  try {
    // 1) 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 2) request Body 파싱
    const { image_url, caption } = await request.json()
    if (!image_url) {
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 },
      )
    }

    // 3) 게시물 생성
    const { data, error } = await supabase.from('posts').insert([
      {
        user_id: user.id,
        image_url,
        caption: caption || '',
      },
    ])

    if (error) {
      throw new Error(error.message)
    }

    // 4) 성공 응답
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    // 혹은 unknown 타입에 대한 별도 처리
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
