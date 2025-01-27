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
  const postId = id

  try {
    // 1) 현재 사용자 세션 확인
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser()

    if (sessionError) {
      throw new Error(sessionError.message)
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // 2) 게시글 데이터 가져오기
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select(
        `
        id,
        user_id,
        image_url,
        caption,
        created_at,
        updated_at,
        ab_tests (
          id,
          post_id,
          variant_a_url,
          variant_b_url,
          description_a,
          description_b,
          created_at,
          updated_at,
          ab_test_votes (
            id,
            user_id,
            preferred_variant,
            created_at
          )
        ),
        comments (id),
        likes (user_id),
        users (username)
      `,
      )
      .eq('id', postId)
      .single()
    if (postError) throw new Error(postError.message)

    // 3) 댓글 데이터 가져오기
    const { data: commentData, error: commentsError } = await supabase
      .from('comments')
      .select(
        'id, content, created_at, user_id, parent_id, dept, post_id, is_delete, users(username)',
      )
      .eq('post_id', postId)
    if (commentsError) throw new Error(commentsError.message)

    const commentsCount = commentData ? commentData.length : 0

    const comments = commentData.map(({ users, ...comment }) => ({
      username: users.username,
      ...comment,
    }))

    // 4) 댓글 좋아요 데이터 가져오기
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
        .filter((like) => like.user_id === userId)
        .map((like) => like.comment_id),
    )

    // 5) 댓글 데이터를 트리 구조로 변환
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

    // 6) 좋아요 및 AB 테스트 데이터 처리
    const { data: userLikesData, error: userLikesError } = await supabase
      .from('likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (userLikesError) {
      throw new Error(userLikesError.message)
    }

    const userLikedPostIds = userLikesData?.length ? [postId] : []

    let userVote: 'A' | 'B' | null = null
    let votesA = 0
    let votesB = 0

    if (post.ab_tests && post.ab_tests[0]?.ab_test_votes) {
      const abTestVotes = post.ab_tests[0].ab_test_votes
      userVote = abTestVotes.find((vote) => vote.user_id === userId)
        ?.preferred_variant as 'A' | 'B' | null

      votesA = abTestVotes.filter(
        (vote) => vote.preferred_variant === 'A',
      ).length
      votesB = abTestVotes.filter(
        (vote) => vote.preferred_variant === 'B',
      ).length
    }

    // 7) 데이터 포맷 구성
    const formattedData = {
      post_id: post.id,
      post_user_id: post.user_id,
      username: post.users.username,
      post_image_url: post.image_url,
      post_caption: post.caption,
      post_created_at: post.created_at.split('T')[0],
      post_updated_at: post.updated_at.split('T')[0],
      ab_test_id: post.ab_tests?.[0]?.id || null,
      variant_a_url: post.ab_tests?.[0]?.variant_a_url || null,
      variant_b_url: post.ab_tests?.[0]?.variant_b_url || null,
      description_a: post.ab_tests?.[0]?.description_a || null,
      description_b: post.ab_tests?.[0]?.description_b || null,
      ab_test_created_at: post.ab_tests?.[0]?.created_at.split('T')[0] || null,
      ab_test_updated_at: post.ab_tests?.[0]?.updated_at.split('T')[0] || null,
      comments: roots, // 트리 구조로 변환된 댓글
      comments_count: commentsCount,
      likes_count: post.likes ? post.likes.length : 0,
      userLikedPostIds,
      userVote,
      votesA,
      votesB,
    }

    // 데이터 반환
    return NextResponse.json({ data: formattedData })
  } catch (error) {
    console.error('Unexpected Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 },
    )
  }
}
