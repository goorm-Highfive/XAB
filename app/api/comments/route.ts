import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {
    // 요청 데이터 파싱
    const { post_id, user_id, content, parent_id, dept } = await request.json()

    // 요청 데이터 검증
    if (!post_id || !user_id || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }, // Bad Request
      )
    }

    // 댓글 삽입
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id,
        user_id,
        content,
        parent_id: parent_id || null, // parent_id가 없으면 null 처리
        dept: dept || 1,
      })
      .select()

    if (error) {
      console.error('Error inserting comment:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }, // Internal Server Error
      )
    }

    console.log('Success insert comments', data)

    // 성공 응답 반환
    return NextResponse.json(
      { success: true, data },
      { status: 200 }, // OK
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'Unexpected server error' },
      { status: 500 },
    )
  }
}
