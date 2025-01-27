import { SurveyCard } from '~/components/common/survey-card/survey-card'
import { fetchUserAuth } from '~/utils/fetch-user-auth'
import { headers } from 'next/headers'

// 게시글 데이터 타입 정의
type Post = {
  post_id: number
  post_user_id: string
  username: string
  post_image_url: string | null
  post_caption: string
  post_created_at: string
  post_updated_at?: string
  ab_test_id?: number | null
  variant_a_url?: string | null
  variant_b_url?: string | null
  description_a?: string | null
  description_b?: string | null
  ab_test_created_at?: string | null
  ab_test_updated_at?: string | null
  comments_count: number
  likes_count: number
  userLiked?: boolean // 'userLiked'를 선택적으로 포함
  userVote?: 'A' | 'B' | null
  votesA?: number
  votesB?: number
}

async function SurveyList({ type, id }: { type: string; id: string | null }) {
  // Supabase 사용자 정보 가져오기
  const authResult = await fetchUserAuth()
  const clientHeaders = await headers() // 클라이언트가 보낸 헤더를 가져옴

  const { user } = authResult || {}

  if (!user?.id) {
    return <p>사용자 인증이 필요합니다.</p>
  }

  // API 기본 URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const apiUrl =
    type === 'feed'
      ? `${baseUrl}/api/posts/feed`
      : `${baseUrl}/api/profile/${id}/user-posts`

  try {
    // Authorization 및 Cookie 헤더 값 확인 및 기본값 처리
    const authorizationHeader = clientHeaders.get('Authorization') || ''
    const cookieHeader = clientHeaders.get('Cookie') || ''

    // 데이터 페칭
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: authorizationHeader, // 헤더 값을 string으로 전달
        Cookie: cookieHeader,
      },
    })

    const { data }: { data: Post[] } = await res.json()
    console.log(data)

    // 렌더링
    return (
      <>
        {data.map((post) => (
          <SurveyCard currentUserId={user?.id} key={post.post_id} {...post} />
        ))}
      </>
    )
  } catch (error) {
    console.error('API 요청 실패:', error)
    return <p>게시글을 가져오는 도중 문제가 발생했습니다.</p>
  }
}

export { SurveyList }
