// app/home/page.tsx

import { cookies } from 'next/headers' // 쿠키 가져오기
import { ProfileSection } from '~/components/home/profile-section'
import { SuggestSection } from '~/components/home/suggest-section'
import { NewSurveyButton } from '~/components/home/new-survey-button'
import SurveyList from './survey-list'
import { Post } from '~/types/post' // 타입 임포트

// (옵션) 매 요청마다 페이지를 새로 그리려면:
export const revalidate = 0

export default async function HomePage() {
  // 1) API 경로 설정 (절대 URL 사용)
  const apiUrl = `http://localhost:3000/api/posts/feed`

  // 2) 서버에서 API 호출 시 쿠키 포함
  let postsData: Post[] = []
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.toString()

    const res = await fetch(apiUrl, {
      cache: 'no-store', // 매번 최신 데이터 가져오기
      headers: {
        Cookie: cookie, // 클라이언트의 쿠키를 포함
      },
    })

    // 응답 상태 확인
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}))
      throw new Error(errJson.error || 'Failed to fetch posts')
    }

    const json = await res.json()
    postsData = json.data ?? []
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Failed to fetch posts:', err.message)
    } else {
      console.error('Failed to fetch posts:', err)
    }
  }

  // 3) 렌더링
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-screen-2xl items-start gap-6 p-6 lg:flex">
        <ProfileSection />
        <div className="flex-1 space-y-6">
          <NewSurveyButton />
          <SurveyList posts={postsData} />
        </div>
        <SuggestSection />
      </div>
    </div>
  )
}
