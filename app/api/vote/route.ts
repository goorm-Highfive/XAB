// app/api/vote/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient() // 서버 클라이언트 초기화
  console.log('API 호출 시작')
  // 사용자 인증 확인
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Unauthorized access:', userError?.message)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.user.id
  console.log(user)

  const { abTestId, option } = await req.json() // abTestId 사용
  console.log(abTestId + ' ' + option)
  console.log(
    `Received vote from user ${userId} for abTestId ${abTestId} with option ${option}`,
  ) // 로그 추가

  // 유효한 옵션인지 확인
  if (!['A', 'B'].includes(option)) {
    console.error('Invalid voting option:', option)
    return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
  }

  // 이미 투표했는지 확인
  const { data: existingVote, error: voteError } = await supabase
    .from('ab_test_votes')
    .select('*')
    .eq('ab_test_id', abTestId)
    .eq('user_id', userId)
    .single()

  if (voteError && voteError.code !== 'PGRST116') {
    // PGRST116: No rows found
    console.error('Error fetching existing vote:', voteError.message)
    return NextResponse.json({ error: voteError.message }, { status: 500 })
  }

  if (existingVote) {
    // 이미 투표한 경우, 투표를 업데이트
    const { error: updateError } = await supabase
      .from('ab_test_votes')
      .update({ preferred_variant: option })
      .eq('ab_test_id', abTestId)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating vote:', updateError.message)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ voted: true, option })
  }

  // 투표 추가
  const { error: insertError } = await supabase
    .from('ab_test_votes')
    .insert([
      { ab_test_id: abTestId, user_id: userId, preferred_variant: option },
    ])

  if (insertError) {
    console.error('Error inserting vote:', insertError.message)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ voted: true, option })
}
