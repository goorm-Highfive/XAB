import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

// Supabase 클라이언트 초기화

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log('API Route Params:', params) // params 확인

  const supabase = await createClient()
  const { id } = params

  const postId = Number(id)

  try {
    // const postId = Number(id)

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) throw new Error(sessionError.message)

    const currentUserId = session?.user.id

    // posts 데이터
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId) //id타입 int
      .single()
    console.log('Post Data:', post, 'Post Error:', postError)

    if (postError) throw new Error(postError.message)

    // userName 데이터
    const { user_id: userId } = post
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single()

    if (userError) throw new Error(userError.message)

    //voteA & voteB 데이터
    const { data: abTestVotes, error: votesError } = await supabase
      .from('ab_test_votes')
      .select('preferred_variant')
      .eq('ab_test_id', postId)

    if (votesError) throw new Error(votesError.message)

    const votesA = abTestVotes.filter(
      (vote) => vote.preferred_variant === 'A',
    ).length
    const votesB = abTestVotes.filter(
      (vote) => vote.preferred_variant === 'B',
    ).length

    // userLiked 여부
    const { data: userLikedData } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', id)
      .eq('user_id', currentUserId as string)

    const userLiked = userLikedData?.length ?? 0 > 0

    // commentsCount
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('id')
      .eq('post_id', postId)

    if (commentsError) throw new Error(commentsError.message)

    const commentsCount = commentsData.length

    // userVote & voteComplete
    const { data: userVoteData, error: voteError } = await supabase
      .from('ab_test_votes')
      .select('preferred_variant')
      .eq('ab_test_id', postId)
      .eq('user_id', currentUserId as string)

    if (voteError) throw new Error(voteError.message)

    const userVote = userVoteData ? userVoteData : null
    const voteComplete = Boolean(userVoteData)

    // initLikeCount
    const { data: likesData, error: likesError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)

    if (likesError) throw new Error(likesError.message)

    const initLikeCount = likesData.length

    // ab_tests 데이터 가져오기
    const { data: abTest, error: abTestError } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('post_id', postId) //id타입 int
      .single()
    console.log('AB Test Data:', abTest, 'AB Test Error:', abTestError)

    if (abTestError) {
      throw new Error('Failed to fetch AB Test data')
    }

    // 데이터 반환
    return NextResponse.json({
      post,
      abTest,
      username: user.username,
      votesA,
      votesB,
      userLiked,
      commentsCount,
      userVote,
      voteComplete,
      initLikeCount,
    })
  } catch (error) {
    console.error('Unexpected Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 },
    )
  }
}
