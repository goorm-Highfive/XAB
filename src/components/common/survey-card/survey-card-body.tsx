'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface SurveyCardBodyProps {
  postId: number
  question: string
  postImageUrl: string | null
}

export function SurveyCardBody({
  postId,
  question,
  postImageUrl,
}: SurveyCardBodyProps) {
  const pathname = usePathname() // 현재 경로 가져오기
  const detailPagePath = `/survey-detail/${postId}`

  return pathname === detailPagePath ? (
    // 현재 페이지라면 링크 없이 내용만 렌더링
    <div className="block">
      <p className="mb-4 min-h-20 rounded-lg bg-gray-50 p-4 text-gray-800">
        {question}
      </p>
      {postImageUrl && (
        <Image
          src={postImageUrl}
          alt={question}
          width={600}
          height={400}
          className="h-auto w-full rounded-md"
        />
      )}
    </div>
  ) : (
    // 현재 페이지가 아니라면 링크로 감싸기
    <Link href={detailPagePath} className="block">
      <p className="mb-4 min-h-20 rounded-lg bg-gray-50 p-4 text-gray-800">
        {question}
      </p>
      {postImageUrl && (
        <Image
          src={postImageUrl}
          alt={question}
          width={600}
          height={400}
          className="h-auto w-full rounded-md"
        />
      )}
    </Link>
  )
}
