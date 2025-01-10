import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server' // 서버용 클라이언트 가져오기

export async function GET() {
  const supabase = await createClient() // 서버용 클라이언트 초기화
  console.log('API 호출 시작')
  try {
    // 1) Supabase Auth 세션 확인
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      throw new Error(sessionError.message)
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    console.log('로그인된 유저 ID:', userId)

    // 2) 팔로우하는 유저들의 ID 가져오기
    const { data: followingData, error: followingError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)

    if (followingError) {
      throw new Error(followingError.message)
    }

    const followingIds =
      followingData?.map((follow) => follow.following_id) || []
    console.log('팔로우하는 유저 ID들:', followingIds)

    if (followingIds.length === 0) {
      // 팔로우하는 유저가 없으면 빈 배열 반환
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    // 3) 팔로우하는 유저들의 포스트 가져오기
    const { data: posts, error: postsError } = await supabase
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
      .in('user_id', followingIds)
      .order('created_at', { ascending: false })

    if (postsError) {
      throw new Error(postsError.message)
    }

    if (!posts) {
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    // 4) 현재 사용자가 좋아요를 누른 포스트 ID 목록 가져오기
    const postIds = posts.map((post) => post.id)

    const { data: userLikes, error: userLikesError } = await supabase
      .from('likes')
      .select('post_id')
      .in('post_id', postIds)
      .eq('user_id', userId)

    if (userLikesError) {
      throw new Error(userLikesError.message)
    }

    const userLikedPostIds = userLikes?.map((like) => like.post_id) || []

    // 5) 포스트별로 댓글 수와 좋아요 수, userLiked 설정
    const formattedPosts = posts.map((post) => ({
      post_id: post.id,
      post_user_id: post.user_id,
      username: post.users.username, // username 추가
      post_image_url: post.image_url,
      post_caption: post.caption,
      post_created_at: post.created_at,
      post_updated_at: post.updated_at,
      ab_test_id: post.ab_tests?.[0]?.id || null,
      variant_a_url: post.ab_tests?.[0]?.variant_a_url || null,
      variant_b_url: post.ab_tests?.[0]?.variant_b_url || null,
      description_a: post.ab_tests?.[0]?.description_a || null,
      description_b: post.ab_tests?.[0]?.description_b || null,
      ab_test_created_at: post.ab_tests?.[0]?.created_at || null,
      ab_test_updated_at: post.ab_tests?.[0]?.updated_at || null,
      ab_test_votes: post.ab_tests?.[0]?.ab_test_votes || [],
      comments: post.comments || [],
      likes: post.likes || [],
      comments_count: post.comments ? post.comments.length : 0,
      likes_count: post.likes ? post.likes.length : 0,
      userLiked: userLikedPostIds.includes(post.id),
    }))

    return NextResponse.json({ data: formattedPosts }, { status: 200 })
  } catch (err) {
    // 에러 처리
    console.error('Error fetching posts:', err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
