import { NextResponse } from 'next/server'
import { supabase } from '~/utils/supabase'

export async function GET() {
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
