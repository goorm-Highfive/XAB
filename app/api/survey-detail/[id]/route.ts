import { NextRequest, NextResponse } from 'next/server'
import { Tables } from '~/types/supabase'
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

    //Post 데이터
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId) //id타입 int
      .single()
    if (postError) throw new Error(postError.message)

    //AB Tests 데이터 -> default type의 경우 데이터가 없을 수도 있음
    const { data: abTestData, error: abTestError } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('post_id', postId)
      .single()

    const abTest = abTestError ? null : abTestData

    // UserName 데이터 -> 포스트 작성자 이름을 반환
    const { user_id: userId } = post
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single()
    if (userError) throw new Error(userError.message)

    // UserLiked 여부
    const { data: userLikedData } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', currentUserId as string)
    const userLiked = userLikedData?.length ?? 0 > 0

    //Votes 데이터
    const { data: abTestVotes, error: votesError } = await supabase
      .from('ab_test_votes')
      .select(` *, ab_tests!inner(post_id)`)
      .eq('ab_tests.post_id', postId)
    if (votesError) throw new Error(votesError.message)

    const { votesA, votesB, userVote, voteComplete } = abTestVotes.reduce(
      (acc, { preferred_variant, user_id }) => {
        if (preferred_variant === 'A') acc.votesA++
        if (preferred_variant === 'B') acc.votesB++
        if (user_id === currentUserId) {
          acc.userVote = preferred_variant
          acc.voteComplete = true
        }
        return acc
      },
      { votesA: 0, votesB: 0, userVote: '', voteComplete: false },
    )

    // Post LikeCount
    const { data: likesData, error: likesError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
    if (likesError) throw new Error(likesError.message)

    const initLikeCount = likesData.length

    // Comment 데이터
    const { data, error: commentsError } = await supabase
      .from('comments')
      .select(
        'id, content, created_at, user_id, parent_id, dept, post_id, is_delete, users(username)',
      )
      .eq('post_id', postId)
    if (commentsError) throw new Error(commentsError.message)

    const comments = data.map(({ users, ...comment }) => ({
      username: users.username,
      ...comment,
    }))

    // Comment Likes 데이터
    const { data: likes, error: likeError } = await supabase
      .from('comment_likes')
      .select('comment_id, user_id')
      .in(
        'comment_id',
        comments.map((comment) => comment.id),
      )
    if (likeError) throw new Error(likeError.message)

    const likeCounts = (likes || []).reduce<Record<number, number>>(
      (acc, like) => {
        acc[like.comment_id] = (acc[like.comment_id] || 0) + 1
        return acc
      },
      {},
    )

    const userLikes = new Set(
      (likes || [])
        .filter((like) => like.user_id === currentUserId)
        .map((like) => like.comment_id),
    )

    // 댓글을 트리 구조로 변환
    type Comment = Tables<'comments'> & {
      username: string
      likeCount: number
      userLiked: boolean
      replies: Comment[]
    }
    const commentMap: Record<number, Comment> = {}
    const roots: Comment[] = []

    comments.forEach((comment) => {
      const mappedComment: Comment = {
        ...comment,
        likeCount: likeCounts[comment.id] || 0,
        userLiked: userLikes.has(comment.id),
        replies: [],
      }

      commentMap[comment.id] = mappedComment

      if (comment.parent_id === null) {
        roots.push(commentMap[comment.id])
      } else {
        if (commentMap[comment.parent_id]) {
          commentMap[comment.parent_id].replies.push(commentMap[comment.id])
        }
      }
    })

    // 데이터 반환
    return NextResponse.json({
      post,
      abTest,
      username: user.username,
      userId,
      votesA,
      votesB,
      userLiked,
      commentsCount: comments.length,
      userVote,
      voteComplete,
      initLikeCount,
      comments: roots,
      currentUserId,
    })
  } catch (error) {
    console.error('Unexpected Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 },
    )
  }
}
