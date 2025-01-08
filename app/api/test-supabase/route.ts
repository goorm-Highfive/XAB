import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('users').select('*') // 'table_name'을 실제 테이블 이름으로 변경

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('Unexpected Error:', err)
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 },
    )
  }
}
