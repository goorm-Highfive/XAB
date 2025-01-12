// app/api/ab-tests/vote/route.ts
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

    const { ab_test_id, preferred_variant } = await request.json()
    if (!ab_test_id || !preferred_variant) {
      return NextResponse.json(
        { error: 'Missing ab_test_id or preferred_variant' },
        { status: 400 },
      )
    }

    // 예: 이미 투표를 했는지 확인 (중복 투표 방지)
    const { data: existingVote, error: existingVoteError } = await supabase
      .from('ab_test_votes')
      .select('*')
      .eq('ab_test_id', ab_test_id)
      .eq('user_id', user.id)
      .single()

    if (existingVoteError && existingVoteError.code !== 'PGRST100') {
      // PGRST100 은 "JSON object requested, multiple (or no) rows returned" 타입의 에러
      // 실제로는 에러코드나 메시지 확인 로직을 더 정교하게 해야 함
      throw new Error(existingVoteError.message)
    }

    if (existingVote) {
      // 이미 투표했다면 -> 여기서는 업데이트 예시
      const { data, error } = await supabase
        .from('ab_test_votes')
        .update({ preferred_variant })
        .eq('id', existingVote.id)

      if (error) {
        throw new Error(error.message)
      }
      return NextResponse.json(
        { message: 'Vote updated!', data },
        { status: 200 },
      )
    } else {
      // 투표 생성
      const { data, error } = await supabase
        .from('ab_test_votes')
        .insert([{ ab_test_id, user_id: user.id, preferred_variant }])

      if (error) {
        throw new Error(error.message)
      }
      return NextResponse.json(
        { message: 'Voted successfully!', data },
        { status: 201 },
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
