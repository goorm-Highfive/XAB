import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log('API Route Params:', params)

  const supabase = await createClient()
  const { id } = await params

  const postId = Number(id)

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) throw new Error(sessionError.message)

    const currentUserId = session?.user.id

    //Post 부분
    //posts 데이터
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

    //ab_tests 데이터 가져오기
    const { data: abTest, error: abTestError } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('post_id', postId) //id타입 int
      .single()

    if (abTestError) throw new Error('Failed to fetch AB Test data')

    // comment 부분
    const { data: comments, error: commentError } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, parent_id, users(username)')
      .eq('post_id', postId)

    if (commentError) throw commentError

    // 댓글이 있으면 likes 데이터를 가져옴
    const { data: likes, error: likeError } = await supabase
      .from('comment_likes')
      .select('comment_id, user_id')
      .in(
        'comment_id',
        comments.map((comment) => comment.id),
      )

    if (likeError) throw likeError

    //like 데이터가 있으면 처리, 없으면 기본값으로 처리
    const likeCounts = (likes || []).reduce<Record<number, number>>(
      (acc, like) => {
        acc[like.comment_id] = (acc[like.comment_id] || 0) + 1
        return acc
      },
      {},
    )

    const userLikes = new Set(
      (likes || [])
        .filter((like) => like.user_id === userId)
        .map((like) => like.comment_id),
    )

    const commentWithLikes = comments.map((comment) => ({
      id: String(comment.id),
      writer: comment.users.username,
      content: comment.content,
      likeCount: likeCounts[comment.id] || 0,
      date: comment.created_at.split('T')[0],
      userLiked: userLikes.has(comment.id),
    }))

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
      comments,
      commentWithLikes,
    })
  } catch (error) {
    console.error('Unexpected Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 },
    )
  }
}
