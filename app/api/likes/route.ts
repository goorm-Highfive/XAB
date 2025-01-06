// app/api/likes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '~/utils/supabase'

export async function POST(request: NextRequest) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { post_id, action } = await request.json()
    if (!post_id || !action) {
      return NextResponse.json(
        { error: 'Missing post_id or action' },
        { status: 400 },
      )
    }

    if (action === 'like') {
      // 좋아요 추가
      const { data, error } = await supabase.from('likes').insert([
        {
          post_id,
          user_id: user.id,
        },
      ])

      if (error) {
        throw new Error(error.message)
      }
      return NextResponse.json({ message: 'Liked!', data }, { status: 201 })
    } else if (action === 'unlike') {
      // 좋아요 취소
      const { data, error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', post_id)
        .eq('user_id', user.id)

      if (error) {
        throw new Error(error.message)
      }
      return NextResponse.json({ message: 'Unliked!', data }, { status: 200 })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use either "like" or "unlike"' },
        { status: 400 },
      )
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    // 혹은 unknown 타입에 대한 별도 처리
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
