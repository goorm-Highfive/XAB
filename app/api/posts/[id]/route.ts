import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server' // 서버 전용 Supabase 클라이언트

export async function DELETE(req: Request) {
  const supabase = await createClient()

  // URL에서 postId 추출
  const url = new URL(req.url) // 요청 URL 분석
  const postId = parseInt(url.pathname.split('/').pop() || '', 10) // 경로에서 ID 추출

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }

  try {
    // 1. 댓글에 달린 좋아요 삭제
    const { data: comments, error: commentsFetchError } = await supabase
      .from('comments')
      .select('id') // 댓글 ID 가져오기
      .eq('post_id', postId)

    if (commentsFetchError) {
      throw new Error('댓글 조회 중 오류 발생: ' + commentsFetchError.message)
    }

    if (comments && comments.length > 0) {
      const commentIds = comments.map((comment) => comment.id)

      const { error: commentLikesError } = await supabase
        .from('comment_likes')
        .delete()
        .in('comment_id', commentIds) // 댓글 ID에 해당하는 좋아요 삭제

      if (commentLikesError) {
        throw new Error(
          '댓글 좋아요 삭제 중 오류 발생: ' + commentLikesError.message,
        )
      }

      console.log('댓글 좋아요 삭제 완료')
    }

    // 2. 댓글 삭제
    const { error: commentsDeleteError } = await supabase
      .from('comments')
      .delete()
      .eq('post_id', postId)

    if (commentsDeleteError) {
      throw new Error('댓글 삭제 중 오류 발생: ' + commentsDeleteError.message)
    }

    console.log('댓글 삭제 완료')

    // 3. 게시글에 달린 좋아요 삭제
    const { error: likesError } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)

    if (likesError) {
      throw new Error('게시글 좋아요 삭제 중 오류 발생: ' + likesError.message)
    }

    console.log('게시글 좋아요 삭제 완료')

    // 4. AB 테스트 및 투표 데이터 삭제
    const { data: abTest, error: abTestFetchError } = await supabase
      .from('ab_tests')
      .select('id')
      .eq('post_id', postId)
      .single()

    if (abTestFetchError && abTestFetchError.code !== 'PGRST116') {
      throw new Error(
        'AB 테스트 데이터 조회 중 오류 발생: ' + abTestFetchError.message,
      )
    }

    if (abTest) {
      const { error: votesError } = await supabase
        .from('ab_test_votes')
        .delete()
        .eq('ab_test_id', abTest.id)

      if (votesError) {
        throw new Error('투표 데이터 삭제 중 오류 발생: ' + votesError.message)
      }

      const { error: abTestDeleteError } = await supabase
        .from('ab_tests')
        .delete()
        .eq('id', abTest.id)

      if (abTestDeleteError) {
        throw new Error(
          'AB 테스트 삭제 중 오류 발생: ' + abTestDeleteError.message,
        )
      }

      console.log('AB 테스트 및 투표 데이터 삭제 완료')
    }

    // 5. 게시글 삭제
    const { error: postDeleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (postDeleteError) {
      throw new Error('게시글 삭제 중 오류 발생: ' + postDeleteError.message)
    }

    console.log('게시글 삭제 완료')

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    console.error('삭제 처리 중 오류 발생:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
