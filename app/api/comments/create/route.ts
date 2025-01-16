import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // 댓글 작성자 ID 불러오기
  const { data, error: userError } = await supabase.auth.getUser()

  if (userError || !data) {
    console.error('Unauthorized access:', userError?.message)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = data.user.id

  try {
    const { post_id, content, parent_id, dept } = await request.json()

    if (!post_id || !userId || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }, // Bad Request
      )
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: post_id,
        user_id: userId,
        content,
        parent_id: parent_id || null, // parent_id가 없으면 null 처리
        dept: dept || 1,
      })
      .select()

    if (error) {
      console.error('Error inserting comment:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      )
    }

    console.log('Success insert comments', data)

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'Unexpected server error' },
      { status: 500 },
    )
  }
}
