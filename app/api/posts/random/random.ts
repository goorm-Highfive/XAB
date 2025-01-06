// app/api/posts/random/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '~/utils/supabase'

export async function GET() {
  try {
    // 랜덤하게 게시물 10개 가져오는 예시
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('RANDOM()', { ascending: true })
      .limit(10)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    // 혹은 unknown 타입에 대한 별도 처리
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
