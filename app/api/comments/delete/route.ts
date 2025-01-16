import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {
    const { id } = await request.json()

    const { data, error } = await supabase
      .from('comments')
      .update({ is_delete: true, content: 'The comment has been deleted' })
      .eq('id', id)

    if (error) {
      console.error('Error inserting comment:', error.message)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      )
    }

    console.log('Success insert comments', data)
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch {
    throw new Error()
  }
}
