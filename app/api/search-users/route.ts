// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const searchTerm = url.searchParams.get('q') || '' // 검색어 가져오기

  const supabase = await createClient()

  if (!searchTerm.trim()) {
    return NextResponse.json([]) // 검색어가 없을 경우 빈 배열 반환
  }

  // username 검색
  const { data, error } = await supabase
    .from('users') // users 테이블
    .select('id, username, profile_image') // 필요한 필드만 가져옴
    .ilike('username', `%${searchTerm}%`) // 대소문자 구분 없는 검색

  if (error) {
    console.error('Error fetching users:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    )
  }

  return NextResponse.json(data)
}
