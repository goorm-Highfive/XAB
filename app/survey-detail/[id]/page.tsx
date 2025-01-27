import { SurveyCard } from '~/components/common/survey-card/survey-card'
import { CommentsSection } from '~/components/survey-detail/survey-comment-section'
import { headers } from 'next/headers'
import { fetchUserAuth } from '~/utils/fetch-user-auth'

export default async function SurveyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    // 사용자 인증 정보 가져오기
    const authResult = await fetchUserAuth()
    const clientHeaders = await headers()

    const { user } = authResult || {}

    if (!user?.id) {
      return <p>사용자 인증이 필요합니다.</p>
    }

    const { id } = await params
    // API URL 설정
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const apiUrl = `${baseUrl}/api/survey-detail/${id}`

    // 데이터 요청
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: clientHeaders.get('Authorization') || '',
        Cookie: clientHeaders.get('Cookie') || '',
      },
    })

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.statusText}`)
    }

    const { data } = await response.json()
    console.log(data)

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="mx-auto mt-6 max-w-3xl space-y-6">
            {/* 게시물 컴포넌트 */}
            <SurveyCard currentUserId={user.id} {...data} />

            {/* 댓글 섹션 */}
            <CommentsSection
              initialComments={data.comments}
              currentUserId={user.id}
              postId={data.post_id}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('SurveyDetailPage 렌더링 중 에러:', error)
    return <p>페이지를 로드하는 중 문제가 발생했습니다.</p>
  }
}
